#!/usr/bin/env python3
"""Render Week 1 Majalis Alfarah reels (9:16) from staged assets + Arabic overlays."""

from __future__ import annotations

import math
import shutil
import subprocess
import tempfile
from pathlib import Path

import arabic_reshaper
from bidi.algorithm import get_display
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "assets"
EXPORTS = ROOT / "exports"
W, H = 1080, 1920
FPS = 30

FONT_REG = "/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/noto/NotoSansArabic-Bold.ttf"
FONT_EN = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def ar(text: str) -> str:
    """Shape Arabic for correct connected forms + RTL display order."""
    return get_display(arabic_reshaper.reshape(text))


def font(size: int, bold: bool = True, english: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_EN if english else (FONT_BOLD if bold else FONT_REG)
    try:
        return ImageFont.truetype(path, size, layout_engine=ImageFont.Layout.RAQM)
    except Exception:
        return ImageFont.truetype(path, size)


def cover_crop(img: Image.Image, tw: int, th: int, zoom: float = 1.0, pan_x: float = 0.5, pan_y: float = 0.5) -> Image.Image:
    img = img.convert("RGB")
    iw, ih = img.size
    scale = max(tw / iw, th / ih) * zoom
    nw, nh = int(iw * scale), int(ih * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    max_x = max(nw - tw, 0)
    max_y = max(nh - th, 0)
    left = int(max_x * pan_x)
    top = int(max_y * pan_y)
    return img.crop((left, top, left + tw, top + th))


def gradient_scrim(draw: ImageDraw.ImageDraw, top: bool = False, strength: int = 160) -> None:
    band = 520
    for i in range(band):
        if top:
            a = int(strength * (1 - i / band))
            y = i
        else:
            a = int(strength * (i / band))
            y = H - band + i
        draw.rectangle([0, y, W, y + 1], fill=(12, 10, 8, a))


def draw_centered_text(
    base: Image.Image,
    lines: list[str],
    y: int,
    size: int = 64,
    fill=(255, 252, 247),
    shadow: bool = True,
    english: bool = False,
) -> None:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    f = font(size, bold=True, english=english)
    # With RAQM, pass logical Arabic and direction=rtl; fall back to reshaper path.
    use_raqm = True
    try:
        _ = ImageFont.Layout.RAQM
    except Exception:
        use_raqm = False
    rendered = []
    for line in lines:
        if english:
            rendered.append(line)
        elif use_raqm:
            rendered.append(line)
        else:
            rendered.append(ar(line))
    sizes = []
    for t in rendered:
        if english or not use_raqm:
            sizes.append(draw.textbbox((0, 0), t, font=f))
        else:
            sizes.append(draw.textbbox((0, 0), t, font=f, direction="rtl", language="ar"))
    heights = [b[3] - b[1] for b in sizes]
    total_h = sum(heights) + 22 * (len(lines) - 1)
    cy = y - total_h // 2
    fill_rgba = (fill[0], fill[1], fill[2], 255)
    for t, bbox, h in zip(rendered, sizes, heights):
        tw = bbox[2] - bbox[0]
        x = (W - tw) // 2
        kwargs = {"font": f, "anchor": None}
        if not english and use_raqm:
            kwargs["direction"] = "rtl"
            kwargs["language"] = "ar"
        if shadow:
            # hard outline for mobile readability
            for dx, dy in ((-3, 0), (3, 0), (0, -3), (0, 3), (-2, -2), (2, 2), (-2, 2), (2, -2)):
                draw.text((x + dx, cy + dy), t, fill=(0, 0, 0, 210), **kwargs)
        draw.text((x, cy), t, fill=fill_rgba, **kwargs)
        cy += h + 22
    base.alpha_composite(overlay)


def make_frame(
    src: Path,
    text_lines: list[str] | None = None,
    zoom: float = 1.08,
    pan_x: float = 0.5,
    pan_y: float = 0.45,
    text_y: int = 1500,
    text_size: int = 62,
    badge: str | None = None,
    darken: float = 1.0,
    english: bool = False,
) -> Image.Image:
    img = Image.open(src)
    frame = cover_crop(img, W, H, zoom=zoom, pan_x=pan_x, pan_y=pan_y)
    if darken != 1.0:
        frame = ImageEnhance.Brightness(frame).enhance(darken)
    frame = frame.convert("RGBA")
    scrim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(scrim)
    gradient_scrim(draw, top=False, strength=175)
    if text_lines or badge:
        gradient_scrim(draw, top=True, strength=110)
    frame = Image.alpha_composite(frame, scrim)
    if badge:
        bfont = font(44, bold=True, english=english)
        label = badge
        draw_tmp = ImageDraw.Draw(frame)
        if english:
            bbox = draw_tmp.textbbox((0, 0), label, font=bfont)
        else:
            bbox = draw_tmp.textbbox((0, 0), label, font=bfont, direction="rtl", language="ar")
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        pad_x, pad_y = 36, 20
        bx, by = (W - tw) // 2 - pad_x, 120
        pill = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        pd = ImageDraw.Draw(pill)
        pd.rounded_rectangle(
            [bx, by, bx + tw + pad_x * 2, by + th + pad_y * 2],
            radius=28,
            fill=(28, 24, 20, 210),
        )
        frame = Image.alpha_composite(frame, pill)
        kw = {"font": bfont, "fill": (255, 250, 240, 255)}
        if not english:
            kw["direction"] = "rtl"
            kw["language"] = "ar"
        ImageDraw.Draw(frame).text((bx + pad_x, by + pad_y), label, **kw)
    if text_lines:
        draw_centered_text(frame, text_lines, y=text_y, size=text_size, english=english)
    return frame.convert("RGB")


def write_clip_frames(
    out_dir: Path,
    src: Path,
    seconds: float,
    text_lines: list[str] | None = None,
    zoom_from: float = 1.05,
    zoom_to: float = 1.14,
    pan_from: tuple[float, float] = (0.45, 0.42),
    pan_to: tuple[float, float] = (0.55, 0.48),
    text_y: int = 1500,
    text_size: int = 62,
    badge: str | None = None,
    darken: float = 1.0,
    start_idx: int = 0,
) -> int:
    out_dir.mkdir(parents=True, exist_ok=True)
    n = max(1, int(seconds * FPS))
    for i in range(n):
        t = i / max(n - 1, 1)
        zoom = zoom_from + (zoom_to - zoom_from) * t
        pan_x = pan_from[0] + (pan_to[0] - pan_from[0]) * t
        pan_y = pan_from[1] + (pan_to[1] - pan_from[1]) * t
        # slight easing
        ease = 0.5 - 0.5 * math.cos(math.pi * t)
        zoom = zoom_from + (zoom_to - zoom_from) * ease
        pan_x = pan_from[0] + (pan_to[0] - pan_from[0]) * ease
        pan_y = pan_from[1] + (pan_to[1] - pan_from[1]) * ease
        frame = make_frame(
            src,
            text_lines=text_lines,
            zoom=zoom,
            pan_x=pan_x,
            pan_y=pan_y,
            text_y=text_y,
            text_size=text_size,
            badge=badge,
            darken=darken,
        )
        frame.save(out_dir / f"f_{start_idx + i:05d}.jpg", quality=92)
    return start_idx + n


def frames_to_mp4(frames_dir: Path, out_mp4: Path, start: int, count: int) -> None:
    # rename sequential from 0 for ffmpeg
    seq = Path(tempfile.mkdtemp(prefix="reelseq_"))
    for i in range(count):
        src = frames_dir / f"f_{start + i:05d}.jpg"
        if not src.exists():
            # already absolute indices in one folder
            src = frames_dir / f"f_{i:05d}.jpg"
        shutil.copy(src, seq / f"frame_{i:05d}.jpg")
    out_mp4.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "ffmpeg",
        "-y",
        "-framerate",
        str(FPS),
        "-i",
        str(seq / "frame_%05d.jpg"),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-vf",
        f"scale={W}:{H}",
        "-movflags",
        "+faststart",
        "-crf",
        "18",
        str(out_mp4),
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    shutil.rmtree(seq, ignore_errors=True)


def concat_frame_dirs(parts: list[tuple[Path, int, int]], out_mp4: Path) -> None:
    """parts: list of (frames_dir, start_idx, count) — use single continuous dir instead."""
    seq = Path(tempfile.mkdtemp(prefix="reelcat_"))
    n = 0
    for frames_dir, start, count in parts:
        for i in range(count):
            src = frames_dir / f"f_{start + i:05d}.jpg"
            shutil.copy(src, seq / f"frame_{n:05d}.jpg")
            n += 1
    out_mp4.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "ffmpeg",
        "-y",
        "-framerate",
        str(FPS),
        "-i",
        str(seq / "frame_%05d.jpg"),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        "-crf",
        "18",
        str(out_mp4),
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    shutil.rmtree(seq, ignore_errors=True)


def build_day1() -> Path:
    work = Path(tempfile.mkdtemp(prefix="day1_"))
    idx = 0
    clips = []
    # hero sofa
    c = write_clip_frames(
        work,
        ASSETS / "style3-curved-arm-luxury-sofa.jpg",
        3.0,
        text_lines=["من ينبع…"],
        zoom_from=1.04,
        zoom_to=1.12,
        text_y=1480,
        text_size=70,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    idx = c
    # craft
    c = write_clip_frames(
        work,
        ASSETS / "workshop-craft.jpg",
        4.0,
        text_lines=["حرفية تغيّر شكل بيتك"],
        zoom_from=1.06,
        zoom_to=1.14,
        text_y=1500,
        text_size=56,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    idx = c
    # quiet luxury beauty
    c = write_clip_frames(
        work,
        ASSETS / "07-quiet-luxury-front.jpg",
        5.0,
        text_lines=["تفاصيل تُصنع بإيد"],
        zoom_from=1.05,
        zoom_to=1.13,
        text_y=1500,
        text_size=58,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    idx = c
    # soft geometry end
    c = write_clip_frames(
        work,
        ASSETS / "01-soft-geometry-front.jpg",
        5.0,
        text_lines=["مجالس الفرح · منذ ١٩٩٠", "احفظ للإلهام"],
        zoom_from=1.06,
        zoom_to=1.1,
        text_y=1520,
        text_size=52,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    out = EXPORTS / "day1-brand-craft-majlis-AR.mp4"
    concat_frame_dirs(clips, out)
    shutil.rmtree(work, ignore_errors=True)
    return out


def build_day2() -> Path:
    work = Path(tempfile.mkdtemp(prefix="day2_"))
    idx = 0
    clips = []
    c = write_clip_frames(
        work,
        ASSETS / "sofa-before-worn.jpg",
        4.0,
        text_lines=["نفس الكنب؟"],
        badge="قبل",
        zoom_from=1.05,
        zoom_to=1.1,
        darken=0.92,
        text_y=1550,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    idx = c
    c = write_clip_frames(
        work,
        ASSETS / "sofa-before-worn.jpg",
        3.0,
        text_lines=["الكنب تعبان… والمجلس يبين"],
        zoom_from=1.12,
        zoom_to=1.2,
        pan_from=(0.5, 0.55),
        pan_to=(0.5, 0.65),
        text_size=48,
        text_y=1560,
        darken=0.9,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    idx = c
    c = write_clip_frames(
        work,
        ASSETS / "workshop-craft.jpg",
        3.5,
        text_lines=["بعد شغل الحرفيين…"],
        zoom_from=1.05,
        zoom_to=1.15,
        text_size=52,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    idx = c
    c = write_clip_frames(
        work,
        ASSETS / "style1-majlis-floor-sofa.jpg",
        6.0,
        text_lines=["نفس الكنب. روح جديدة."],
        badge="بعد التنجيد",
        zoom_from=1.04,
        zoom_to=1.12,
        text_y=1520,
        text_size=56,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    idx = c
    c = write_clip_frames(
        work,
        ASSETS / "style1-majlis-floor-sofa.jpg",
        5.5,
        text_lines=["واتساب للعرض", "ينبع والمناطق القريبة"],
        zoom_from=1.1,
        zoom_to=1.16,
        pan_from=(0.5, 0.4),
        pan_to=(0.55, 0.35),
        text_size=50,
        text_y=1540,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    out = EXPORTS / "day2-sofa-before-after-AR.mp4"
    concat_frame_dirs(clips, out)
    shutil.rmtree(work, ignore_errors=True)
    return out


def build_day3() -> Path:
    work = Path(tempfile.mkdtemp(prefix="day3_"))
    idx = 0
    clips = []
    c = write_clip_frames(
        work,
        ASSETS / "curtain-mistake-short.jpg",
        3.0,
        text_lines=["ثلاث أخطاء تخرب شكل الستارة"],
        text_size=48,
        text_y=1500,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    idx = c
    c = write_clip_frames(
        work,
        ASSETS / "curtain-mistake-short.jpg",
        5.5,
        text_lines=["١) الطول الغلط"],
        badge="خطأ ١",
        text_size=60,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    idx = c
    c = write_clip_frames(
        work,
        ASSETS / "curtain-lining-detail.jpg",
        5.5,
        text_lines=["٢) بدون بطانة مناسبة"],
        badge="خطأ ٢",
        text_size=54,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    idx = c
    c = write_clip_frames(
        work,
        ASSETS / "curtain-correct-hero.jpg",
        5.5,
        text_lines=["٣) العرض ناقص", "اختار عرض يعطي تجعيد كامل"],
        badge="خطأ ٣ → الحل",
        text_size=48,
        text_y=1480,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    idx = c
    c = write_clip_frames(
        work,
        ASSETS / "curtain-correct-hero.jpg",
        6.0,
        text_lines=["احفظ الفيديو", "ستائر · شحن لجميع مدن المملكة", "majalisalfarah.shop"],
        text_size=46,
        text_y=1500,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    out = EXPORTS / "day3-three-curtain-mistakes-AR.mp4"
    concat_frame_dirs(clips, out)
    shutil.rmtree(work, ignore_errors=True)
    return out


def build_day4() -> Path:
    work = Path(tempfile.mkdtemp(prefix="day4_"))
    idx = 0
    clips = []
    # title on soft geometry
    c = write_clip_frames(
        work,
        ASSETS / "01-soft-geometry-front.jpg",
        2.5,
        text_lines=["أي مجلس تختار؟"],
        text_size=66,
        darken=0.85,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    idx = c
    c = write_clip_frames(
        work,
        ASSETS / "style1-majlis-floor-sofa.jpg",
        5.0,
        text_lines=["علق برقمك"],
        badge="١",
        text_size=56,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    idx = c
    c = write_clip_frames(
        work,
        ASSETS / "style2-contemporary-modular-sofa.jpg",
        5.0,
        text_lines=["علق برقمك"],
        badge="٢",
        text_size=56,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    idx = c
    c = write_clip_frames(
        work,
        ASSETS / "style3-curved-arm-luxury-sofa.jpg",
        3.5,
        text_lines=["١ ولا ٢؟", "مجالس الفرح"],
        text_size=58,
        text_y=1500,
        start_idx=idx,
    )
    clips.append((work, idx, c - idx))
    out = EXPORTS / "day4-this-or-that-sofas-AR.mp4"
    concat_frame_dirs(clips, out)
    shutil.rmtree(work, ignore_errors=True)
    return out


def build_stories() -> list[Path]:
    EXPORTS.mkdir(parents=True, exist_ok=True)
    outs = []
    specs = [
        ("story-s1-yanbu.jpg", ASSETS / "07-quiet-luxury-front.jpg", ["مجالس الفرح · ينبع"], "زيارة المعرض"),
        ("story-s2-texture.jpg", ASSETS / "workshop-craft.jpg", ["الخامة تفرق"], None),
        ("story-s4-workshop.jpg", ASSETS / "workshop-craft.jpg", ["من الورشة"], "واتساب"),
        ("story-s5-visit.jpg", ASSETS / "style3-curved-arm-luxury-sofa.jpg", ["لو بتمرّ على ينبع…", "المعرض ينتظرك"], None),
        ("story-s6-curtains-ksa.jpg", ASSETS / "curtain-correct-hero.jpg", ["ستائر · شحن للمملكة", "majalisalfarah.shop"], None),
    ]
    for name, src, lines, badge in specs:
        frame = make_frame(src, text_lines=lines, badge=badge, zoom=1.1, text_y=1500, text_size=54)
        path = EXPORTS / name
        frame.save(path, quality=93)
        outs.append(path)
    # poll background split-ish: side by side 1 and 2
    left = cover_crop(Image.open(ASSETS / "style1-majlis-floor-sofa.jpg"), W // 2, H, zoom=1.12)
    right = cover_crop(Image.open(ASSETS / "style2-contemporary-modular-sofa.jpg"), W // 2, H, zoom=1.12)
    poll = Image.new("RGB", (W, H))
    poll.paste(left, (0, 0))
    poll.paste(right, (W // 2, 0))
    poll = poll.convert("RGBA")
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.rectangle([W // 2 - 3, 0, W // 2 + 3, H], fill=(255, 255, 255, 220))
    poll = Image.alpha_composite(poll, overlay)
    draw_centered_text(poll, ["كنب جديد ولا تنجيد؟"], y=280, size=54)
    # numbers
    f = font(72)
    ImageDraw.Draw(poll).text((W // 4 - 20, H // 2), ar("١"), font=f, fill=(255, 255, 255, 255))
    ImageDraw.Draw(poll).text((3 * W // 4 - 20, H // 2), ar("٢"), font=f, fill=(255, 255, 255, 255))
    poll_path = EXPORTS / "story-s3-poll.jpg"
    poll.convert("RGB").save(poll_path, quality=93)
    outs.append(poll_path)
    return outs


def main() -> None:
    EXPORTS.mkdir(parents=True, exist_ok=True)
    print("Building Day 1…")
    print(build_day1())
    print("Building Day 2…")
    print(build_day2())
    print("Building Day 3…")
    print(build_day3())
    print("Building Day 4…")
    print(build_day4())
    print("Building Stories…")
    for p in build_stories():
        print(p)
    print("Done.")


if __name__ == "__main__":
    main()
