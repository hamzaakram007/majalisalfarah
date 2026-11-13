#!/usr/bin/env python3
"""Generate vertical 9:16 Instagram Reels for Majalis Alfarah products.

Pipeline:
  1. Compose scene stills (Pillow) with bilingual luxury overlays
  2. Animate with ffmpeg Ken Burns pans/zooms + crossfades
  3. Append branded closing card

Usage:
  python3 generate_reels.py                  # all products with images
  python3 generate_reels.py soft-geometry    # one slug
  python3 generate_reels.py --limit 3        # first N products
  python3 generate_reels.py --prompts-only   # write AI prompts only
"""

from __future__ import annotations

import argparse
import json
import math
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

try:
    import arabic_reshaper
except ImportError:  # pragma: no cover
    arabic_reshaper = None

from reel_data import BRAND, enrich_product, build_ai_prompt

ROOT = Path(__file__).resolve().parents[2]
CHAPTER = ROOT / "the-wood-chapter" / "products"
CATALOG = CHAPTER / "products.json"
OUT_DIR = ROOT / "instagram-reels" / "output"
PROMPTS_DIR = ROOT / "instagram-reels" / "prompts"
ASSETS = ROOT / "instagram-reels" / "assets"

W, H = 1080, 1920
FPS = 30

FONT_EN = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
FONT_EN_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_EN_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
# Naskh renders correctly with Pillow; Kufi Bold often tofu's on this host.
FONT_AR = "/usr/share/fonts/truetype/noto/NotoNaskhArabic-Bold.ttf"
FONT_AR_REG = "/usr/share/fonts/truetype/noto/NotoNaskhArabic-Regular.ttf"

# Warm luxury palette
CREAM = (245, 236, 220)
WARM_WHITE = (255, 250, 242)
GOLD = (196, 154, 98)
DARK = (28, 22, 18)
SOFT_DARK = (48, 38, 30)
STRIKE = (180, 90, 70)
ACCENT = (212, 175, 120)


def ar(text: str) -> str:
    """Shape Arabic for Pillow.

    Use reshape only — do NOT apply python-bidi get_display(). With current
    Pillow + Noto Naskh, bidi reverses already-correct RTL runs.
    """
    if not text:
        return ""
    if arabic_reshaper:
        return arabic_reshaper.reshape(text)
    return text


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def load_cover(path: Path) -> Image.Image:
    img = Image.open(path).convert("RGB")
    # Warm grade
    img = ImageEnhance.Color(img).enhance(1.08)
    img = ImageEnhance.Contrast(img).enhance(1.05)
    img = ImageEnhance.Brightness(img).enhance(1.02)
    src_w, src_h = img.size
    scale = max(W / src_w, H / src_h)
    nw, nh = int(src_w * scale), int(src_h * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - W) // 2
    top = (nh - H) // 2
    return img.crop((left, top, left + W, top + H))


def gradient_scrim(height: int, top_alpha: int = 0, bottom_alpha: int = 200) -> Image.Image:
    scrim = Image.new("RGBA", (W, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(scrim)
    for y in range(height):
        t = y / max(1, height - 1)
        a = int(top_alpha + (bottom_alpha - top_alpha) * (t**1.2))
        draw.line([(0, y), (W, y)], fill=(*SOFT_DARK, a))
    return scrim


def rounded_panel(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    fill: tuple[int, int, int, int],
    radius: int = 28,
) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill)


def wrap_text(text: str, fnt: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    if not words:
        return [""]
    lines: list[str] = []
    current = words[0]
    for word in words[1:]:
        trial = f"{current} {word}"
        if fnt.getlength(trial) <= max_width:
            current = trial
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


def draw_centered(
    draw: ImageDraw.ImageDraw,
    text: str,
    y: int,
    fnt: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    max_width: int | None = None,
) -> int:
    lines = wrap_text(text, fnt, max_width or (W - 120))
    line_h = int(fnt.size * 1.28)
    for i, line in enumerate(lines):
        tw = fnt.getlength(line)
        x = (W - tw) / 2
        draw.text((x, y + i * line_h), line, font=fnt, fill=fill)
    return len(lines) * line_h


def compose_base(photo: Image.Image, vignette: bool = True) -> Image.Image:
    base = photo.convert("RGBA")
    # Soft top/bottom luxury scrims so text stays readable
    top = gradient_scrim(420, top_alpha=160, bottom_alpha=0)
    bottom = gradient_scrim(720, top_alpha=0, bottom_alpha=210)
    base.alpha_composite(top, (0, 0))
    base.alpha_composite(bottom, (0, H - 720))
    if vignette:
        # subtle edge darkening
        edge = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ed = ImageDraw.Draw(edge)
        for i in range(80):
            a = int(40 * (1 - i / 80))
            ed.rectangle([i, i, W - 1 - i, H - 1 - i], outline=(20, 14, 10, a))
        base = Image.alpha_composite(base, edge)
    return base


def scene_hook(photo: Image.Image, product: dict) -> Image.Image:
    img = compose_base(photo)
    draw = ImageDraw.Draw(img)
    # Brand eyebrow
    draw_centered(draw, BRAND["name"].upper(), 96, font(FONT_EN_BOLD, 28), GOLD)
    draw_centered(draw, ar(BRAND["name_ar"]), 136, font(FONT_AR, 34), CREAM)

    y = 1480
    y += draw_centered(draw, product["name"], y, font(FONT_EN, 64), WARM_WHITE)
    y += 8
    y += draw_centered(draw, ar(product["name_ar"]), y, font(FONT_AR, 52), GOLD)
    y += 18
    draw_centered(
        draw,
        product["category"],
        y,
        font(FONT_EN_REG, 28),
        CREAM,
        max_width=W - 160,
    )
    return img.convert("RGB")


def scene_detail(
    photo: Image.Image,
    product: dict,
    label_en: str,
    label_ar: str,
    body_en: str,
    body_ar: str,
) -> Image.Image:
    img = compose_base(photo)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    panel = (70, 1320, W - 70, 1780)
    rounded_panel(od, panel, (22, 16, 12, 195), radius=36)
    # gold accent line
    od.rounded_rectangle((110, 1355, 220, 1363), radius=4, fill=(*GOLD, 255))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    draw.text((120, 1375), label_en.upper(), font=font(FONT_EN_BOLD, 26), fill=GOLD)
    draw.text((120, 1412), ar(label_ar), font=font(FONT_AR, 30), fill=CREAM)

    y = 1470
    for line in wrap_text(body_en, font(FONT_EN_REG, 34), W - 260):
        draw.text((120, y), line, font=font(FONT_EN_REG, 34), fill=WARM_WHITE)
        y += 44
    y += 10
    for line in wrap_text(ar(body_ar), font(FONT_AR_REG, 32), W - 260):
        # Arabic: right-align inside panel
        tw = font(FONT_AR_REG, 32).getlength(line)
        draw.text((W - 120 - tw, y), line, font=font(FONT_AR_REG, 32), fill=CREAM)
        y += 42
    return img.convert("RGB")


def scene_price(photo: Image.Image, product: dict) -> Image.Image:
    img = compose_base(photo)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    rounded_panel(od, (90, 1280, W - 90, 1760), (18, 12, 8, 210), radius=40)
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    draw_centered(draw, "SPECIAL OFFER", 1320, font(FONT_EN_BOLD, 30), GOLD)
    draw_centered(draw, ar("عرض خاص"), 1365, font(FONT_AR, 36), CREAM)

    # Original crossed out
    orig = product["original_price_label"]
    f_orig = font(FONT_EN, 42)
    tw = f_orig.getlength(orig)
    ox = (W - tw) / 2
    oy = 1450
    draw.text((ox, oy), orig, font=f_orig, fill=(170, 150, 135))
    draw.line([(ox - 8, oy + 24), (ox + tw + 8, oy + 24)], fill=STRIKE, width=4)

    # Discounted
    disc = product["discounted_price_label"]
    draw_centered(draw, disc, 1520, font(FONT_EN, 78), ACCENT)
    draw_centered(draw, ar("السعر بعد الخصم"), 1620, font(FONT_AR, 34), CREAM)
    return img.convert("RGB")


def scene_closing() -> Image.Image:
    # Warm gradient background
    img = Image.new("RGB", (W, H), DARK)
    draw = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        r = int(28 + 40 * t)
        g = int(20 + 18 * t)
        b = int(14 + 8 * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # Soft gold glow center
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx, cy = W // 2, H // 2 - 80
    for i in range(220, 0, -4):
        a = int(18 * (i / 220))
        gd.ellipse([cx - i * 2, cy - i, cx + i * 2, cy + i], fill=(196, 154, 98, a))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    draw = ImageDraw.Draw(img)

    draw_centered(draw, BRAND["name"].upper(), 760, font(FONT_EN, 56), WARM_WHITE)
    draw_centered(draw, ar(BRAND["name_ar"]), 840, font(FONT_AR, 58), GOLD)
    draw.line([(W // 2 - 80, 930), (W // 2 + 80, 930)], fill=GOLD, width=3)

    draw_centered(draw, BRAND["website"], 980, font(FONT_EN_REG, 36), CREAM)
    draw_centered(draw, f"WhatsApp {BRAND['whatsapp']}", 1040, font(FONT_EN_REG, 30), ACCENT)
    draw_centered(draw, BRAND["instagram"], 1100, font(FONT_EN_REG, 28), (180, 160, 140))

    draw_centered(
        draw,
        ar("فخامة المجالس السعودية"),
        1280,
        font(FONT_AR_REG, 34),
        CREAM,
    )
    return img


def write_scene(path: Path, img: Image.Image) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "JPEG", quality=92, optimize=True)


def ffmpeg_ken_burns(
    image: Path,
    out: Path,
    duration: float,
    zoom_start: float = 1.0,
    zoom_end: float = 1.12,
    x_expr: str = "iw/2-(iw/zoom/2)",
    y_expr: str = "ih/2-(ih/zoom/2)",
) -> None:
    frames = max(1, int(duration * FPS))
    # zoompan needs frames; z goes from start to end over frames
    z = f"min({zoom_start}+({zoom_end}-{zoom_start})*on/{frames},{max(zoom_start, zoom_end)+0.01})"
    vf = (
        f"scale={W * 2}:{H * 2},"
        f"zoompan=z='{z}':x='{x_expr}':y='{y_expr}':d={frames}:s={W}x{H}:fps={FPS},"
        f"format=yuv420p"
    )
    cmd = [
        "ffmpeg",
        "-y",
        "-loop",
        "1",
        "-i",
        str(image),
        "-vf",
        vf,
        "-t",
        str(duration),
        "-r",
        str(FPS),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-preset",
        "veryfast",
        "-crf",
        "18",
        str(out),
    ]
    subprocess.run(cmd, check=True, capture_output=True)


def concat_with_xfades(clips: list[Path], durations: list[float], out: Path, xfade: float = 0.45) -> None:
    if len(clips) == 1:
        shutil.copy(clips[0], out)
        return

    # Chain xfade filters
    inputs: list[str] = []
    for c in clips:
        inputs.extend(["-i", str(c)])

    filter_parts: list[str] = []
    # offset timeline
    offset = durations[0] - xfade
    prev = "[0:v]"
    for i in range(1, len(clips)):
        nxt = f"[{i}:v]"
        out_label = f"[v{i}]" if i < len(clips) - 1 else "[vout]"
        filter_parts.append(
            f"{prev}{nxt}xfade=transition=fade:duration={xfade}:offset={offset:.3f}{out_label}"
        )
        prev = out_label
        if i < len(clips) - 1:
            offset += durations[i] - xfade

    filter_complex = ";".join(filter_parts)
    cmd = [
        "ffmpeg",
        "-y",
        *inputs,
        "-filter_complex",
        filter_complex,
        "-map",
        "[vout]",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-preset",
        "veryfast",
        "-crf",
        "18",
        "-r",
        str(FPS),
        "-movflags",
        "+faststart",
        str(out),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        # Fallback: simple concat without xfade
        lst = out.with_suffix(".txt")
        lst.write_text("".join(f"file '{c.resolve()}'\n" for c in clips))
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                str(lst),
                "-c:v",
                "libx264",
                "-pix_fmt",
                "yuv420p",
                "-preset",
                "veryfast",
                "-crf",
                "18",
                "-movflags",
                "+faststart",
                str(out),
            ],
            check=True,
            capture_output=True,
        )
        lst.unlink(missing_ok=True)


def generate_reel(product: dict, work: Path) -> Path:
    p = enrich_product(product)
    slug = p["slug"]
    img_dir = CHAPTER
    front = load_cover(img_dir / p["images"]["front"])
    angle = load_cover(img_dir / p["images"]["angle"])
    side = load_cover(img_dir / p["images"]["side"])

    scenes = work / slug
    scenes.mkdir(parents=True, exist_ok=True)

    frames = [
        ("01_hook.jpg", scene_hook(angle, p)),
        (
            "02_material.jpg",
            scene_detail(
                front,
                p,
                "Material & Color",
                "الخامة واللون",
                p["material"],
                p["material_ar"],
            ),
        ),
        (
            "03_features.jpg",
            scene_detail(
                side,
                p,
                "Key Features",
                "المميزات",
                p["features"],
                p["features_ar"],
            ),
        ),
        (
            "04_dims.jpg",
            scene_detail(
                angle,
                p,
                "Dimensions",
                "الأبعاد",
                f"{p['dims']}  ·  Seat height: {p['seat_h']}",
                f"{p['dims']}  ·  ارتفاع المقعد: {p['seat_h']}",
            ),
        ),
        ("05_price.jpg", scene_price(front, p)),
        ("06_closing.jpg", scene_closing()),
    ]

    for name, img in frames:
        write_scene(scenes / name, img)

    # Durations totaling ~42–48s after xfades
    durations = [6.5, 7.0, 7.0, 6.5, 7.5, 7.0]
    zooms = [
        (1.0, 1.14, "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),  # center push-in
        (1.05, 1.18, "iw/2-(iw/zoom/2)+40", "ih/2-(ih/zoom/2)"),
        (1.0, 1.12, "iw/2-(iw/zoom/2)-30", "ih/2-(ih/zoom/2)+20"),
        (1.08, 1.0, "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),  # pull back
        (1.0, 1.1, "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),
        (1.0, 1.06, "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),
    ]

    clips: list[Path] = []
    for i, ((name, _), dur, zoom) in enumerate(zip(frames, durations, zooms)):
        clip = scenes / f"clip_{i:02d}.mp4"
        ffmpeg_ken_burns(
            scenes / name,
            clip,
            duration=dur,
            zoom_start=zoom[0],
            zoom_end=zoom[1],
            x_expr=zoom[2],
            y_expr=zoom[3],
        )
        clips.append(clip)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"{slug}-reel-9x16.mp4"
    concat_with_xfades(clips, durations, out)
    return out


def write_prompts(products: list[dict]) -> None:
    PROMPTS_DIR.mkdir(parents=True, exist_ok=True)
    index_lines = ["# Instagram Reel AI Prompts — Majalis Alfarah\n"]
    for product in products:
        p = enrich_product(product)
        prompt = build_ai_prompt(product)
        path = PROMPTS_DIR / f"{p['slug']}.txt"
        path.write_text(prompt, encoding="utf-8")
        index_lines.append(f"- [{p['name']} / {p['name_ar']}]({p['slug']}.txt)")
    (PROMPTS_DIR / "README.md").write_text("\n".join(index_lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate Majalis Alfarah Instagram Reels")
    parser.add_argument("slugs", nargs="*", help="Product slugs to generate")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of products")
    parser.add_argument("--prompts-only", action="store_true")
    parser.add_argument("--skip-prompts", action="store_true")
    args = parser.parse_args()

    products = json.loads(CATALOG.read_text(encoding="utf-8"))
    if args.slugs:
        wanted = set(args.slugs)
        products = [p for p in products if p["slug"] in wanted]
        missing = wanted - {p["slug"] for p in products}
        if missing:
            print(f"Unknown slugs: {', '.join(sorted(missing))}", file=sys.stderr)
            return 1
    if args.limit:
        products = products[: args.limit]

    if not args.skip_prompts:
        write_prompts(json.loads(CATALOG.read_text(encoding="utf-8")))
        print(f"Wrote AI prompts → {PROMPTS_DIR}")

    if args.prompts_only:
        return 0

    if not shutil.which("ffmpeg"):
        print("ffmpeg is required", file=sys.stderr)
        return 1

    # Pre-render closing once for assets preview
    ASSETS.mkdir(parents=True, exist_ok=True)
    scene_closing().save(ASSETS / "closing-card.jpg", quality=92)

    with tempfile.TemporaryDirectory(prefix="majlis-reels-") as tmp:
        work = Path(tmp)
        for i, product in enumerate(products, 1):
            # Skip if images missing
            for key in ("front", "angle", "side"):
                path = CHAPTER / product["images"][key]
                if not path.exists():
                    print(f"SKIP {product['slug']}: missing {path}")
                    break
            else:
                print(f"[{i}/{len(products)}] Generating {product['name']}…")
                out = generate_reel(product, work)
                size_mb = out.stat().st_size / (1024 * 1024)
                print(f"  → {out.relative_to(ROOT)} ({size_mb:.1f} MB)")

    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
