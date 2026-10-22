#!/usr/bin/env python3
"""Upload sofa-collection products to Shopify قنب-qanab collection.

Matches lifestyle-sofa product style:
- Title: English | Arabic
- Vendor: Majalis Alfarah
- Type: Sofa
- Bilingual body (EN + AR Key Features / Perfect For)
- 5 images: front, angle, side, detail-en, detail-ar
"""

from __future__ import annotations

import base64
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PRODUCTS_JSON = ROOT / "products" / "products.json"
IMAGES_DIR = ROOT / "products" / "images"

SHOP = os.environ.get("SHOPIFY_SHOP", "0uekra-zs.myshopify.com")
TOKEN = os.environ.get("SHOPIFY_TOKEN") or Path("/tmp/shopify_token.txt").read_text().strip()
API = f"https://{SHOP}/admin/api/2024-10"
COLLECTION_ID = int(os.environ.get("SHOPIFY_COLLECTION_ID", "534989570347"))  # قنب-qanab

AR_DIGITS = str.maketrans("0123456789", "٠١٢٣٤٥٦٧٨٩")


def ar_num(s: str) -> str:
    return s.translate(AR_DIGITS)


def price_num(price: str) -> str:
    # "SAR 18,900" -> "18900.00"
    digits = re.sub(r"[^\d.]", "", price.replace(",", ""))
    if not digits:
        return "2000.00"
    if "." not in digits:
        digits = f"{digits}.00"
    return digits


def api(method: str, path: str, payload: dict | None = None, retries: int = 5):
    url = f"{API}{path}"
    data = None
    headers = {
        "X-Shopify-Access-Token": TOKEN,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
    for attempt in range(retries):
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                body = resp.read().decode("utf-8")
                return resp.status, json.loads(body) if body else {}
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")
            if e.code == 429 or e.code >= 500:
                wait = float(e.headers.get("Retry-After", 2 + attempt * 2))
                print(f"  retry {attempt+1} after {wait}s ({e.code})")
                time.sleep(wait)
                continue
            raise RuntimeError(f"{method} {path} -> {e.code}: {err_body[:800]}") from e
    raise RuntimeError(f"{method} {path} failed after retries")


def build_body(p: dict) -> str:
    name = p["name"]
    name_ar = p["name_ar"]
    tagline = p["tagline"]
    color = p["color"]
    fabric = p["fabric"]
    shape = p["shape"]
    accents = p["accents"]
    dims = p["dims"]
    seat_h = p["seat_h"]
    price = p["price"]

    en_intro = (
        f"<p><span>Bring refined living-room luxury into your home with </span>"
        f"<strong><span>{name}</span></strong><span>, a premium modular sofa "
        f"designed around {tagline.lower()}. Upholstered in {fabric} in a "
        f"{color.lower()} finish, with {shape.lower()}. Styled with {accents.lower()}, "
        f"it delivers showroom presence made for contemporary Saudi homes, majlis halls, "
        f"and villa living rooms.</span></p>"
    )
    en_intro2 = (
        f"<p><span>Crafted for everyday comfort and lasting elegance, {name} pairs "
        f"generous modular seating with carefully considered proportions. "
        f"Dimensions {dims}; seat height {seat_h}. A natural centrepiece for modern, "
        f"warm, and hospitality-minded interiors.</span></p>"
    )
    ar_intro = (
        f'<p dir="rtl"><strong>{name_ar}</strong> — كنب فاخر بتصميم معياري، '
        f"مصمم حول {tagline}. منجد بـ {fabric} بلون {color}، "
        f"وبشكل {shape}. مزود بـ {accents}، ليمنحك حضوراً فاخراً يناسب "
        f"المنازل السعودية العصرية، المجالس، وغرف معيشة الفلل.</p>"
    )

    features = [
        ("Colour | اللون", f"{color}. {color}."),
        ("Fabric | القماش", f"{fabric}."),
        ("Form | الشكل", f"{shape}."),
        ("Accents | الإكسسوارات", f"{accents}."),
        ("Dimensions | المقاسات", f"{dims}. {ar_num(dims)}."),
        ("Seat Height | ارتفاع المقعد", f"{seat_h}. {ar_num(seat_h)}."),
        ("Modular Design | تصميم معياري", "Flexible modular sectional configuration. تكوين معياري مرن."),
        ("Price | السعر", f"{price}."),
    ]
    feats_html = "\n".join(
        f"<li><p><strong><span>{label}:</span></strong><span> {text}</span></p></li>"
        for label, text in features
    )

    perfect = [
        "Luxury Living Rooms | غرف المعيشة الفاخرة",
        "Majlis & Family Spaces | المجالس والمساحات العائلية",
        "Villas & Apartments | الفلل والشقق",
        "Contemporary & Minimal Interiors | الديكورات العصرية والبسيطة",
        "Warm Lifestyle Homes | المنازل الدافئة والعصرية",
    ]
    perfect_html = "\n".join(f"<li><p><span>{x}</span></p></li>" for x in perfect)

    closing = (
        f"<h2><span>Make a Statement in Modern Living | أضف لمسة مميزة لمساحتك</span></h2>"
        f"<p><strong><span>English:</span></strong><span> Elevate your living space with "
        f"{name} — modular comfort, luxury fabric, and a silhouette that feels collected "
        f"and current.</span></p>"
        f'<p dir="rtl"><strong>العربية:</strong> ارتقِ بجمال غرفة معيشتك مع {name_ar} — '
        f"راحة معيارية، قماش فاخر، وتصميم يمنح مساحتك حضوراً عصرياً متكاملاً.</p>"
    )

    return (
        f"{en_intro}\n{en_intro2}\n{ar_intro}\n"
        f"<h2><span>Key Features | المميزات الرئيسية</span></h2>\n"
        f"<ul>\n{feats_html}\n</ul>\n"
        f"<h2><span>Perfect For | مثالية لـ</span></h2>\n"
        f"<ul>\n{perfect_html}\n</ul>\n"
        f"{closing}"
    )


def build_tags(p: dict) -> str:
    tags = [
        "sofa",
        "sofas",
        "modular sofa",
        "sectional",
        "qanab",
        "قنب",
        "كنب",
        "أرائك",
        "أريكة",
        "Comfort Forward 2026",
        p["slug"],
        p["color"],
        "Majalis Al Farah",
    ]
    return ", ".join(tags)


def image_rows(p: dict):
    imgs = p["images"]
    return [
        (IMAGES_DIR / Path(imgs["front"]).name, f"{p['name']} — front view", 1),
        (IMAGES_DIR / Path(imgs["angle"]).name, f"{p['name']} — angle view", 2),
        (IMAGES_DIR / Path(imgs["side"]).name, f"{p['name']} — side view", 3),
        (IMAGES_DIR / Path(imgs["detail_en"]).name, f"{p['name']} — English details", 4),
        (IMAGES_DIR / Path(imgs["detail_ar"]).name, f"{p['name']} — Arabic details", 5),
    ]


def upload_image(product_id: int, path: Path, alt: str, position: int):
    b64 = base64.b64encode(path.read_bytes()).decode("ascii")
    payload = {
        "image": {
            "attachment": b64,
            "filename": path.name,
            "alt": alt,
            "position": position,
        }
    }
    status, data = api("POST", f"/products/{product_id}/images.json", payload)
    img = data.get("image", {})
    print(f"    image {position}: {path.name} -> {img.get('id')}")
    return img


def create_product(p: dict) -> dict:
    title = f"{p['name']} | {p['name_ar']}"
    sku = f"MAJ-QAN-{p['id']}"
    price = price_num(p["price"])
    # compare-at ~20% higher like L-shape import
    compare = f"{round(float(price) * 1.2, 2):.2f}"

    payload = {
        "product": {
            "title": title,
            "body_html": build_body(p),
            "vendor": "Majalis Alfarah",
            "product_type": "Sofa",
            "tags": build_tags(p),
            "status": "active",
            "handle": f"{p['slug']}-qanab",
            "variants": [
                {
                    "price": price,
                    "compare_at_price": compare,
                    "sku": sku,
                    "barcode": sku,
                    "inventory_management": "shopify",
                    "inventory_quantity": 5,
                    "weight": 85.0,
                    "weight_unit": "kg",
                    "requires_shipping": True,
                    "taxable": True,
                }
            ],
        }
    }
    status, data = api("POST", "/products.json", payload)
    product = data["product"]
    print(f"  created product {product['id']} handle={product['handle']} price={price}")
    return product


def add_to_collection(product_id: int):
    payload = {"collect": {"product_id": product_id, "collection_id": COLLECTION_ID}}
    status, data = api("POST", "/collects.json", payload)
    print(f"  added to collection {COLLECTION_ID} collect={data.get('collect', {}).get('id')}")


def already_uploaded(handle: str) -> int | None:
    status, data = api("GET", f"/products.json?handle={handle}&limit=1")
    products = data.get("products") or []
    if products:
        return products[0]["id"]
    return None


def main():
    products = json.loads(PRODUCTS_JSON.read_text())
    only = set(sys.argv[1:]) if len(sys.argv) > 1 else None
    results = []

    for p in products:
        if only and p["id"] not in only and p["slug"] not in only:
            continue
        handle = f"{p['slug']}-qanab"
        print(f"\n=== {p['id']} {p['name']} ===")
        existing = already_uploaded(handle)
        if existing:
            print(f"  skip existing id={existing}")
            results.append({"id": p["id"], "product_id": existing, "status": "exists"})
            continue

        for path, _, _ in image_rows(p):
            if not path.exists():
                raise FileNotFoundError(path)

        product = create_product(p)
        pid = product["id"]
        for path, alt, position in image_rows(p):
            upload_image(pid, path, alt, position)
            time.sleep(0.35)
        add_to_collection(pid)
        results.append(
            {
                "id": p["id"],
                "slug": p["slug"],
                "product_id": pid,
                "handle": product["handle"],
                "admin_url": f"https://{SHOP}/admin/products/{pid}",
                "status": "created",
            }
        )
        time.sleep(0.5)

    out = ROOT / "shopify-upload-results.json"
    out.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print(f"\nWrote {out} ({len(results)} products)")


if __name__ == "__main__":
    main()
