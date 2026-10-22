#!/usr/bin/env python3
"""Upload lifestyle sofas to majalisalfarah.shop matching existing product style.

Requires env:
  SHOPIFY_SHOP (e.g. 0uekra-zs.myshopify.com)
  SHOPIFY_ACCESS_TOKEN
Does not print or store secrets.
"""
from __future__ import annotations

import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
API_VERSION = "2024-10"
SOFA_COLLECTION_ID = 534989799723  # Sofas – أرائك
VENDOR = "Majalis Alfarah"
PRICE = "1200.00"
WEIGHT_G = 85000


def api(method: str, path: str, data: dict | None = None, retries: int = 5):
    shop = os.environ["SHOPIFY_SHOP"]
    token = os.environ["SHOPIFY_ACCESS_TOKEN"]
    url = f"https://{shop}/admin/api/{API_VERSION}{path}"
    body = None if data is None else json.dumps(data).encode()
    headers = {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    for attempt in range(retries):
        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req) as resp:
                raw = resp.read().decode()
                return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as e:
            err = e.read().decode()
            if e.code == 429 or e.code >= 500:
                wait = float(e.headers.get("Retry-After", 2 + attempt * 2))
                time.sleep(wait)
                continue
            raise RuntimeError(f"{method} {path} -> {e.code}: {err[:800]}") from e
    raise RuntimeError(f"{method} {path} failed after retries")


def esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def build_body(p: dict) -> str:
    name, name_ar = esc(p["name"]), esc(p["name_ar"])
    color, color_ar = esc(p["color"]), esc(p["color_ar"])
    fabric, fabric_ar = esc(p["fabric"]), esc(p["fabric_ar"])
    base, base_ar = esc(p["base"]), esc(p["base_ar"])
    shape, shape_ar = esc(p["shape"]), esc(p["shape_ar"])
    setting, setting_ar = esc(p["setting"]), esc(p["setting_ar"])
    tagline, tagline_ar = esc(p["tagline"]), esc(p["tagline_ar"])
    dims, dims_ar = esc(p["dims"]), esc(p.get("dims_ar", p["dims"]))
    seat, seat_ar = esc(p["seat_h"]), esc(p.get("seat_h_ar", p["seat_h"]))

    return f"""<p><span>Bring real-home comfort into your space with </span><strong><span>{name}</span></strong><span>, a lifestyle sofa designed for {setting.lower()}. {shape}. Upholstered in {fabric.lower()} with {base.lower()}, it delivers {tagline.lower()} with a lived-in, photorealistic presence made for everyday Saudi homes.</span></p>
<p><span>Styled for authentic interiors — from family living rooms to quiet corners — {name} pairs refined craftsmanship with inviting proportions. Its {color.lower()} finish and carefully considered silhouette make it a natural centrepiece for contemporary, warm, and hospitality-minded spaces.</span></p>
<p dir="rtl"><strong>{name_ar}</strong> — أريكة حياة مصممة لـ {setting_ar}. {shape_ar}. منجدة بـ {fabric_ar} مع {base_ar}، لتمنحك {tagline_ar} بإحساس واقعي يناسب المنازل السعودية اليومية.</p>
<h2><span>Key Features | المميزات الرئيسية</span></h2>
<ul>
<li><p><strong><span>Setting | المكان:</span></strong><span> {setting}. {setting_ar}.</span></p></li>
<li><p><strong><span>Colour | اللون:</span></strong><span> {color}. {color_ar}.</span></p></li>
<li><p><strong><span>Fabric | القماش:</span></strong><span> {fabric}. {fabric_ar}.</span></p></li>
<li><p><strong><span>Base | القاعدة:</span></strong><span> {base}. {base_ar}.</span></p></li>
<li><p><strong><span>Form | الشكل:</span></strong><span> {shape}. {shape_ar}.</span></p></li>
<li><p><strong><span>Dimensions | المقاسات:</span></strong><span> {dims}. {dims_ar}.</span></p></li>
<li><p><strong><span>Seat Height | ارتفاع المقعد:</span></strong><span> {seat}. {seat_ar}.</span></p></li>
</ul>
<h2><span>Perfect For | مثالية لـ</span></h2>
<ul>
<li><p><span>{setting} | {setting_ar}</span></p></li>
<li><p><span>Contemporary Living Rooms | غرف المعيشة العصرية</span></p></li>
<li><p><span>Family &amp; Guest Spaces | مساحات العائلة والضيوف</span></p></li>
<li><p><span>Villas &amp; Apartments | الفلل والشقق</span></p></li>
<li><p><span>Warm, Lifestyle Interiors | الديكورات المنزلية الدافئة</span></p></li>
</ul>
<h2><span>Make a Statement in Modern Living | أضف لمسة مميزة إلى منزلك العصري</span></h2>
<p><strong><span>English:</span></strong><span> Make your living space feel finished with {name}. Its {color.lower()} upholstery, real-home proportions, and refined detailing bring together lifestyle comfort and distinctive design.</span></p>
<p><strong><span>العربية:</span></strong><span> امنح منزلك طابعاً مكتملاً مع {name_ar}. يجمع هذا التصميم بين {color_ar} والمقاسات المناسبة للحياة اليومية والتفاصيل الأنيقة لمظهر مميز ومريح.</span></p>
"""


def build_title(p: dict) -> str:
    return f"{p['name']} – Lifestyle {p['color']} Sofa | {p['name_ar']} – أريكة فاخرة لـ {p['setting_ar']}"


def ensure_lifestyle_collection() -> int:
    cols = api("GET", "/custom_collections.json?limit=250").get("custom_collections", [])
    for c in cols:
        if c["handle"] in ("lifestyle-sofas", "lifestyle-sofas-أرائك-الحياة"):
            return c["id"]
    created = api(
        "POST",
        "/custom_collections.json",
        {
            "custom_collection": {
                "title": "Lifestyle Sofas – أرائك الحياة",
                "handle": "lifestyle-sofas",
                "body_html": "<p>Real-home lifestyle sofas styled for everyday living spaces. أرائك الحياة بأجواء منزلية واقعية.</p>",
                "published": True,
            }
        },
    )
    return created["custom_collection"]["id"]


def find_existing_by_sku(sku: str) -> dict | None:
    # Search products - Shopify product search is limited; scan tags/sku via GraphQL-less approach
    # Use product listing filter by vendor then check variants locally once cached
    return None


def upload_image(product_id: int, path: Path, position: int, alt: str) -> None:
    b64 = base64.b64encode(path.read_bytes()).decode()
    api(
        "POST",
        f"/products/{product_id}/images.json",
        {
            "image": {
                "attachment": b64,
                "filename": path.name,
                "position": position,
                "alt": alt,
            }
        },
    )


def add_to_collection(collection_id: int, product_id: int) -> None:
    try:
        api(
            "POST",
            "/collects.json",
            {"collect": {"collection_id": collection_id, "product_id": product_id}},
        )
    except RuntimeError as e:
        if "already" in str(e).lower() or "422" in str(e):
            return
        raise


def create_product(p: dict, lifestyle_col_id: int) -> dict:
    sku = p.get("sku") or f"TWC-L{p['id']}"
    title = build_title(p)
    handle_base = f"{p['slug']}-lifestyle-sofa-{p['id']}"
    body = build_body(p)
    payload = {
        "product": {
            "title": title,
            "body_html": body,
            "vendor": VENDOR,
            "product_type": "Sofa",
            "tags": f"sofa, sofas, lifestyle sofa, {p['slug']}, The Wood Chapter, Comfort Forward 2026, أرائك, كنب, أريكة",
            "status": "active",
            "published": True,
            "handle": handle_base,
            "options": [{"name": "Title", "values": ["Default Title"]}],
            "variants": [
                {
                    "option1": "Default Title",
                    "price": PRICE,
                    "sku": sku,
                    "grams": WEIGHT_G,
                    "inventory_management": "shopify",
                    "inventory_quantity": 5,
                    "inventory_policy": "deny",
                    "requires_shipping": True,
                    "taxable": True,
                    "weight": 85.0,
                    "weight_unit": "kg",
                }
            ],
        }
    }
    created = api("POST", "/products.json", payload)["product"]
    pid = created["id"]

    images = [
        (ROOT / p["images"]["front"], f"{p['name']} — front view"),
        (ROOT / p["images"]["angle"], f"{p['name']} — angle view"),
        (ROOT / p["images"]["side"], f"{p['name']} — side view"),
        (ROOT / p["detail_card"], f"{p['name']} — English details"),
        (ROOT / p["detail_card_ar"], f"{p['name']} — Arabic details"),
    ]
    for i, (path, alt) in enumerate(images, start=1):
        if not path.exists():
            raise FileNotFoundError(path)
        print(f"  image {i}/5 {path.name}", flush=True)
        upload_image(pid, path, i, alt)
        time.sleep(0.4)

    add_to_collection(SOFA_COLLECTION_ID, pid)
    add_to_collection(lifestyle_col_id, pid)
    return created


def already_uploaded(products_cache: list[dict], sku: str, slug: str) -> bool:
    for prod in products_cache:
        handle = (prod.get("handle") or "").lower()
        title = (prod.get("title") or "").lower()
        if slug in handle or slug.replace("-", " ") in title:
            return True
        for v in prod.get("variants") or []:
            if (v.get("sku") or "") == sku:
                return True
    return False


def load_all_products() -> list[dict]:
    out: list[dict] = []
    path = "/products.json?limit=250&fields=id,title,handle,variants"
    # paginate via Link is hard in simple helper; fetch once then again with since_id
    since = 0
    while True:
        batch = api("GET", f"/products.json?limit=250&fields=id,title,handle,variants&since_id={since}").get(
            "products", []
        )
        if not batch:
            break
        out.extend(batch)
        since = batch[-1]["id"]
        if len(batch) < 250:
            break
    return out


def main() -> int:
    for key in ("SHOPIFY_SHOP", "SHOPIFY_ACCESS_TOKEN"):
        if not os.environ.get(key):
            print(f"Missing {key}", file=sys.stderr)
            return 1

    products = json.loads((ROOT / "products.json").read_text())
    lifestyle_col = ensure_lifestyle_collection()
    print("Lifestyle collection id:", lifestyle_col)

    existing = load_all_products()
    print("Existing products:", len(existing))

    results = []
    for p in products:
        sku = p.get("sku") or f"TWC-L{p['id']}"
        if already_uploaded(existing, sku, p["slug"]):
            print(f"SKIP {p['id']} {p['slug']} (already on store)")
            results.append({"id": p["id"], "slug": p["slug"], "status": "skipped"})
            continue
        print(f"UPLOAD {p['id']} {p['name']} ({sku})")
        created = create_product(p, lifestyle_col)
        print(f"  -> product_id={created['id']} handle={created['handle']}")
        results.append(
            {
                "id": p["id"],
                "slug": p["slug"],
                "status": "created",
                "product_id": created["id"],
                "handle": created["handle"],
                "url": f"https://majalisalfarah.shop/products/{created['handle']}",
            }
        )
        time.sleep(0.8)

    out = ROOT / "shopify-upload-results.json"
    out.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print("Wrote", out)
    created_n = sum(1 for r in results if r["status"] == "created")
    skipped_n = sum(1 for r in results if r["status"] == "skipped")
    print(f"Done. created={created_n} skipped={skipped_n}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
