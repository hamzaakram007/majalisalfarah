#!/usr/bin/env python3
"""Upload 20 cushion products to Majalis Alfarah Shopify cushions collection.

Matches existing store style:
- Vendor: Majalis Alfarah
- Bilingual title: English | Arabic
- Bilingual body with Key Features / Perfect For sections
- Collection: Cushions – وسائد
"""

from __future__ import annotations

import base64
import json
import mimetypes
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CATALOG = json.loads((ROOT / "cushion-20-catalog.json").read_text(encoding="utf-8"))
IMG_DIR = ROOT / "images" / "cushion-20"

SHOP = os.environ.get("SHOPIFY_SHOP", "0uekra-zs.myshopify.com")
TOKEN = os.environ["SHOPIFY_TOKEN"]
API = f"https://{SHOP}/admin/api/2024-10"
COLLECTION_ID = int(os.environ.get("SHOPIFY_CUSHIONS_COLLECTION_ID", "534989734187"))
VENDOR = "Majalis Alfarah"

PACKS = [
    ("1 Piece | قطعة واحدة", "1P", 1.0),
    ("2 Piece | قطعتان", "2P", 1.9),
    ("3 Piece | 3 قطع", "3P", 2.7),
    ("4 Piece | 4 قطع", "4P", 3.4),
]

PHOTO_KEYS = [
    ("photo1-hero", "Hero product photo"),
    ("photo2-lifestyle", "Lifestyle photo"),
    ("photo3-detail", "Fabric detail photo"),
    ("detail-en", "English product details"),
    ("detail-ar", "Arabic product details"),
]


def api(method: str, path: str, payload: dict | None = None, retries: int = 5):
    data = None
    headers = {
        "X-Shopify-Access-Token": TOKEN,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(f"{API}{path}", data=data, headers=headers, method=method)
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                body = resp.read().decode("utf-8")
                return json.loads(body) if body else {}
        except urllib.error.HTTPError as e:
            err = e.read().decode("utf-8", errors="replace")
            if e.code in (429, 500, 502, 503, 504) and attempt < retries - 1:
                wait = float(e.headers.get("Retry-After", 2 + attempt * 2))
                time.sleep(wait)
                continue
            raise RuntimeError(f"{method} {path} -> {e.code}: {err[:800]}") from e
    raise RuntimeError(f"{method} {path} failed after retries")


def build_title(p: dict) -> str:
    en = p["en_name"]
    if not en.lower().startswith("luxury"):
        en = f"Luxury {en}"
    return f"{en} | {p['ar_name']}"


def build_body(p: dict) -> str:
    en = p["en_name"]
    ar = p["ar_name"]
    color = p["color"]
    fabric = p["fabric"]
    shape = p["shape"]
    en_blurb = p["en_blurb"]
    ar_blurb = p["ar_blurb"]
    base = p["base_price"]

    return f"""<p><span>Elevate your home with our </span><strong><span>{en}</span></strong><span>. {en_blurb} Crafted for Majlis Alfarah interiors, this piece brings a refined finishing touch to sofas, bedrooms, and gathering spaces.</span></p>
<p><span>Available in flexible pack sizes — 1, 2, 3, or 4 pieces — so you can style a single accent or complete a coordinated set. Ideal for modern Saudi homes seeking comfort, texture, and timeless elegance.</span></p>
<p dir="rtl"><strong>{ar}</strong> — {ar_blurb} متوفرة بخيارات العدد: قطعة واحدة، قطعتان، 3 قطع، أو 4 قطع لتنسيق مثالي حسب مساحتك.</p>
<h2><span>Key Features | المميزات الرئيسية</span></h2>
<ul>
<li><p><strong><span>Colour | اللون:</span></strong><span> {color}. لون متناسق يضفي لمسة أنيقة على الديكور.</span></p></li>
<li><p><strong><span>Fabric | القماش:</span></strong><span> {fabric}. قماش مختار بعناية لمظهر فاخر وملمس مريح.</span></p></li>
<li><p><strong><span>Shape &amp; Size | الشكل والمقاس:</span></strong><span> {shape}. تصميم عملي يناسب الأرائك والمجالس.</span></p></li>
<li><p><strong><span>Flexible Pack Sizes | خيارات العدد المرنة:</span></strong><span> Choose 1, 2, 3, or 4 pieces. اختر قطعة واحدة أو قطعتين أو 3 أو 4 قطع.</span></p></li>
<li><p><strong><span>Ready to Style | جاهزة للتنسيق:</span></strong><span> Includes plump cushion insert(s) for an instantly finished look. تتضمن حشوة ناعمة لمظهر جاهز فوراً.</span></p></li>
</ul>
<h2><span>Perfect For | مثالية لـ</span></h2>
<ul>
<li><p><span>Luxury Living Rooms | غرف المعيشة الفاخرة</span></p></li>
<li><p><span>Majlis &amp; Lounge Seating | المجالس وأماكن الجلوس</span></p></li>
<li><p><span>Elegant Bedrooms | غرف النوم الأنيقة</span></p></li>
<li><p><span>Sofas &amp; Sectionals | الأرائك والكنب</span></p></li>
<li><p><span>Contemporary &amp; Classic Interiors | الديكورات العصرية والكلاسيكية</span></p></li>
</ul>
<h2><span>Complete Your Space | أكمل جمال مساحتك</span></h2>
<p><strong><span>English:</span></strong><span> Refresh your favourite rooms with the {en}. Starting from {base} SAR for 1 piece, with multi-piece packs for coordinated styling.</span></p>
<p><strong><span>العربية:</span></strong><span> جدّد مساحاتك المفضلة مع {ar}. تبدأ الأسعار من {base} ر.س للقطعة الواحدة، مع باقات متعددة القطع لتنسيق متكامل.</span></p>"""


def build_product_payload(p: dict) -> dict:
    variants = []
    for pack_label, suffix, mult in PACKS:
        price = round(p["base_price"] * mult, 2)
        compare = round(p["compare_base"] * mult, 2)
        variants.append(
            {
                "option1": pack_label,
                "price": f"{price:.2f}",
                "compare_at_price": f"{compare:.2f}",
                "sku": f"{p['sku_prefix']}-{suffix}",
                "inventory_management": "shopify",
                "inventory_policy": "deny",
                "requires_shipping": True,
                "taxable": True,
                "weight": 0.7 if "Bolster" not in p["en_name"] and "Pouf" not in p["en_name"] else 1.2,
                "weight_unit": "kg",
            }
        )

    return {
        "product": {
            "title": build_title(p),
            "body_html": build_body(p),
            "vendor": VENDOR,
            "product_type": "Cushion",
            "tags": "cushion, cushions, وسائد, مخدات, majlis, decorative cushion",
            "status": "active",
            "options": [{"name": "Pack Size"}],
            "variants": variants,
        }
    }


def set_inventory(variant_id: int, qty: int = 25):
    # Get inventory item + location
    v = api("GET", f"/variants/{variant_id}.json")["variant"]
    item_id = v["inventory_item_id"]
    locs = api("GET", "/locations.json")["locations"]
    if not locs:
        return
    loc_id = locs[0]["id"]
    api(
        "POST",
        "/inventory_levels/set.json",
        {"location_id": loc_id, "inventory_item_id": item_id, "available": qty},
    )


def upload_images(product_id: int, p: dict):
    for pos, (key, label) in enumerate(PHOTO_KEYS, start=1):
        path = IMG_DIR / f"{p['id']}-{key}.jpg"
        if not path.exists():
            print(f"  WARN missing image {path.name}", flush=True)
            continue
        raw = path.read_bytes()
        b64 = base64.b64encode(raw).decode("ascii")
        alt = f"{build_title(p)} – {label}"
        api(
            "POST",
            f"/products/{product_id}/images.json",
            {
                "image": {
                    "attachment": b64,
                    "filename": path.name,
                    "alt": alt,
                    "position": pos,
                }
            },
        )
        print(f"  image {pos}/5 {path.name}", flush=True)
        time.sleep(0.4)


def collect(product_id: int):
    api(
        "POST",
        "/collects.json",
        {"collect": {"product_id": product_id, "collection_id": COLLECTION_ID}},
    )


def already_uploaded(handle_hint: str) -> bool:
    # Search by title fragment via products.json?title=
    # Safer: check tags/sku prefix via product search
    return False


def main():
    products = CATALOG["products"]
    results = []
    print(f"Uploading {len(products)} products to {SHOP} collection {COLLECTION_ID}", flush=True)

    for p in products:
        title = build_title(p)
        print(f"\n== {p['id']} {title}", flush=True)
        created = api("POST", "/products.json", build_product_payload(p))
        product = created["product"]
        pid = product["id"]
        handle = product["handle"]
        print(f"  created id={pid} handle={handle}", flush=True)

        for v in product.get("variants", []):
            try:
                set_inventory(v["id"], 25)
            except Exception as e:
                print(f"  inventory warn: {e}", flush=True)

        upload_images(pid, p)
        try:
            collect(pid)
            print("  added to cushions collection", flush=True)
        except Exception as e:
            print(f"  collect warn: {e}", flush=True)

        results.append(
            {
                "id": p["id"],
                "shopify_id": pid,
                "handle": handle,
                "title": title,
                "url": f"https://majalisalfarah.shop/products/{handle}",
            }
        )
        time.sleep(0.6)

    out = ROOT / "cushion-20-upload-results.json"
    out.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nDone. Results -> {out}", flush=True)
    for r in results:
        print(f"- {r['id']}: {r['url']}")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"FATAL: {e}", file=sys.stderr)
        sys.exit(1)
