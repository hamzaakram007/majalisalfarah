#!/usr/bin/env python3
"""Build EN + AR lifestyle sofa detail cards (photo + specs, no price)."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
ART = Path("/opt/cursor/artifacts/lifestyle-sofas")
W, H = 1080, 1500
PHOTO_H = 780
PANEL = (28, 21, 15)
CREAM = (245, 236, 220)
CREAM_DIM = (196, 176, 150)
BRASS = (196, 162, 110)
WHITE = (252, 248, 240)
LINE = (74, 57, 47)

SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
AR = "/usr/share/fonts/truetype/noto/NotoNaskhArabic-Regular.ttf"
AR_BOLD = "/usr/share/fonts/truetype/noto/NotoNaskhArabic-Bold.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def fit_cover(im: Image.Image, tw: int, th: int) -> Image.Image:
    im = im.convert("RGB")
    scale = max(tw / im.width, th / im.height)
    nw, nh = int(im.width * scale), int(im.height * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (nw - tw) // 2
    y = (nh - th) // 2
    return im.crop((x, y, x + tw, y + th))


def wrap(draw: ImageDraw.ImageDraw, text: str, f: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    words = text.split()
    if not words:
        return [""]
    lines: list[str] = []
    cur = words[0]
    for w in words[1:]:
        trial = f"{cur} {w}"
        if draw.textlength(trial, font=f) <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    return lines


def draw_en(card: Image.Image, p: dict) -> None:
    d = ImageDraw.Draw(card)
    d.rectangle((0, PHOTO_H, W, H), fill=PANEL)
    d.line((64, PHOTO_H + 48, W - 64, PHOTO_H + 48), fill=LINE, width=1)

    header = font(SERIF, 22)
    title_f = font(SERIF, 54)
    tag_f = font(SANS, 26)
    label_f = font(SANS_BOLD, 20)
    val_f = font(SANS, 22)
    foot_f = font(SANS, 18)

    d.text((64, PHOTO_H + 64), "THE WOOD CHAPTER · LIFESTYLE SOFAS 2026", font=header, fill=CREAM_DIM)
    d.text((64, PHOTO_H + 110), p["name"].upper(), font=title_f, fill=WHITE)
    d.text((64, PHOTO_H + 175), p["tagline"], font=tag_f, fill=BRASS)

    rows = [
        ("SETTING", p["setting"]),
        ("COLOR", p["color"]),
        ("FABRIC", p["fabric"]),
        ("BASE", p["base"]),
        ("FORM", p["shape"]),
        ("SIZE", p["dims"]),
        ("SEAT H", p["seat_h"]),
        ("SKU", p["sku"]),
    ]
    y = PHOTO_H + 230
    label_w = 140
    for lab, val in rows:
        d.text((64, y), lab, font=label_f, fill=CREAM_DIM)
        lines = wrap(d, val, val_f, W - 64 - (64 + label_w))
        for i, line in enumerate(lines):
            d.text((64 + label_w, y + i * 28), line, font=val_f, fill=CREAM)
        y += max(36, 28 * len(lines) + 8)

    d.text((64, H - 56), "YOUR SPACE | OUR CRAFT", font=foot_f, fill=BRASS)


def draw_ar(card: Image.Image, p: dict) -> None:
    d = ImageDraw.Draw(card)
    d.rectangle((0, PHOTO_H, W, H), fill=PANEL)
    d.line((64, PHOTO_H + 48, W - 64, PHOTO_H + 48), fill=LINE, width=1)

    header = font(AR, 24)
    title_f = font(AR_BOLD, 48)
    tag_f = font(AR, 26)
    label_f = font(AR_BOLD, 22)
    val_f = font(AR, 24)
    foot_f = font(AR, 20)
    sku_f = font(SANS_BOLD, 22)

    def rtl(text: str, fnt: ImageFont.FreeTypeFont, y: int, fill, x_right: int = W - 64) -> None:
        d.text((x_right, y), text, font=fnt, fill=fill, anchor="ra", direction="rtl", language="ar")

    rtl("الفصل الخشبي · أرائك الحياة ٢٠٢٦", header, PHOTO_H + 64, CREAM_DIM)
    rtl(p["name_ar"], title_f, PHOTO_H + 110, WHITE)
    rtl(p["tagline_ar"], tag_f, PHOTO_H + 175, BRASS)

    rows = [
        ("المكان", p["setting_ar"]),
        ("اللون", p["color_ar"]),
        ("القماش", p["fabric_ar"]),
        ("القاعدة", p["base_ar"]),
        ("الشكل", p["shape_ar"]),
        ("المقاس", p["dims_ar"]),
        ("ارتفاع المقعد", p["seat_h_ar"]),
        ("رمز المنتج", p["sku"]),
    ]
    y = PHOTO_H + 230
    for lab, val in rows:
        rtl(lab, label_f, y, CREAM_DIM)
        if lab == "رمز المنتج":
            d.text((64, y), val, font=sku_f, fill=CREAM)
            y += 40
            continue
        # wrap Arabic roughly by characters
        max_w = W - 220
        lines: list[str] = []
        cur = ""
        for ch in val:
            trial = cur + ch
            if d.textlength(trial, font=val_f, direction="rtl", language="ar") <= max_w:
                cur = trial
            else:
                if cur:
                    lines.append(cur)
                cur = ch
        if cur:
            lines.append(cur)
        for i, line in enumerate(lines):
            rtl(line, val_f, y + i * 30, CREAM)
        y += max(40, 30 * len(lines) + 10)

    rtl("مساحتك · حرفيتنا", foot_f, H - 56, BRASS)
    d.text((64, H - 56), p["sku"], font=sku_f, fill=BRASS)


def build_one(p: dict) -> None:
    front = ROOT / p["images"]["front"]
    if not front.exists():
        raise FileNotFoundError(front)
    photo = fit_cover(Image.open(front), W, PHOTO_H)

    en = Image.new("RGB", (W, H), PANEL)
    en.paste(photo, (0, 0))
    draw_en(en, p)
    out_en = ROOT / p["detail_card"]
    out_en.parent.mkdir(parents=True, exist_ok=True)
    en.save(out_en, quality=92)
    (ART / "detail-cards").mkdir(parents=True, exist_ok=True)
    en.save(ART / "detail-cards" / out_en.name, quality=92)

    ar = Image.new("RGB", (W, H), PANEL)
    ar.paste(photo, (0, 0))
    draw_ar(ar, p)
    out_ar = ROOT / p["detail_card_ar"]
    out_ar.parent.mkdir(parents=True, exist_ok=True)
    ar.save(out_ar, quality=92)
    (ART / "detail-cards-ar").mkdir(parents=True, exist_ok=True)
    ar.save(ART / "detail-cards-ar" / out_ar.name, quality=92)
    print("built", p["id"], p["slug"])


def main() -> None:
    products = json.loads((ROOT / "products.json").read_text())
    for p in products:
        build_one(p)


if __name__ == "__main__":
    main()
