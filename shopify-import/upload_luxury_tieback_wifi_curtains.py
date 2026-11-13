#!/usr/bin/env python3
"""Upload luxury tie-back WiFi curtain variants to Shopify.

Credentials via env:
  SHOPIFY_SHOP, SHOPIFY_ACCESS_TOKEN
Never commit secrets.
"""
from __future__ import annotations

import base64
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STYLES_PATH = ROOT / "shopify-import" / "luxury-tieback-wifi-curtains-styles.json"
IMAGES_DIR = ROOT / "photos" / "luxury-tieback-wifi-curtains"
if not IMAGES_DIR.exists():
    IMAGES_DIR = ROOT / "shopify-import" / "images" / "luxury-tieback-wifi-curtains"

SHOP = os.environ.get("SHOPIFY_SHOP", "0uekra-zs.myshopify.com")
TOKEN = os.environ["SHOPIFY_ACCESS_TOKEN"]
API = f"https://{SHOP}/admin/api/2024-10"
CURTAINS_COLLECTION_ID = 534989701419  # Curtains – ستائر
ONLINE_STORE_PUBLICATION_ID = 321440710955
DEMO_PRICE = "250.00"
DEMO_COMPARE = "360.00"
VENDOR = "Majalis Alfarah"
SLEEP = 0.55


def req(method: str, path: str, payload: dict | None = None, retries: int = 5):
    url = path if path.startswith("http") else f"{API}{path}"
    data = None
    headers = {
        "X-Shopify-Access-Token": TOKEN,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
    for attempt in range(retries):
        request = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(request, timeout=120) as resp:
                body = resp.read().decode("utf-8")
                time.sleep(SLEEP)
                return json.loads(body) if body else {}
        except urllib.error.HTTPError as e:
            err = e.read().decode("utf-8", errors="replace")
            if e.code in (429, 500, 502, 503, 504) and attempt < retries - 1:
                wait = float(e.headers.get("Retry-After", 2 + attempt * 2))
                print(f"  retry {attempt+1} after {wait}s ({e.code})")
                time.sleep(wait)
                continue
            raise RuntimeError(f"{method} {url} -> {e.code}: {err[:800]}") from e
    raise RuntimeError("unreachable")


def build_body(style: dict) -> str:
    en = style["en"]
    ar = style["ar"]
    color = style.get("color") or style.get("solid", "")
    accent = style.get("accent", "decorative tie-backs")
    sheer = style.get("sheer", "white sheer")
    feats_en = style["detail_en"]
    feats_ar = style["detail_ar"]

    feature_items = []
    for fe, fa in zip(feats_en, feats_ar):
        if ":" in fe:
            label_en, val_en = fe.split(":", 1)
            label_en, val_en = label_en.strip(), val_en.strip()
        else:
            label_en, val_en = fe, ""
        if ":" in fa:
            label_ar, val_ar = fa.split(":", 1)
            label_ar, val_ar = label_ar.strip(), val_ar.strip()
        else:
            label_ar, val_ar = fa, ""
        feature_items.append(
            f"<li><strong><span>{label_en} | </span><bdi>{label_ar}:</bdi></strong>"
            f"<span> {val_en}. </span><bdi>{val_ar}.</bdi></li>"
        )

    features_html = "\n".join(feature_items)
    return f"""
<p><span>Bring formal majlis elegance and smart control to your interiors with our </span><strong><span>{en}</span></strong><span>. Designed with {color}, decorative {accent}, and a {sheer}, these motorized WiFi luxury tie-back curtains create a refined floor-to-ceiling presence for Saudi homes, majlis rooms, bedrooms, and stylish living spaces. Soft wave folds, premium fabric character, and custom sizing support make them an easy choice for everyday comfort and luxury interiors.</span></p>
<p><strong><span>العربية:</span></strong></p>
<p><span>أضف لمسة عصرية وتحكماً ذكياً إلى منزلك مع </span><strong><span>{ar}</span></strong><span>. بجوانب {color} بلاك آوت وطبقة وسط {sheer}، تمنح هذه الستائر الثنائية اللون بمحرك واي فاي حضوراً راقياً من السقف إلى الأرض يناسب المنازل السعودية والمجالس وغرف النوم وغرف المعيشة. طيات ويف أنيقة، قماش مميز، وإمكانية تفصيل المقاس حسب الطلب تجعلها خياراً عملياً للراحة اليومية والديكور الفاخر.</span></p>
<h2><span>Key Features | </span><bdi>المميزات الرئيسية</bdi></h2>
<ul>
{features_html}
<li><strong><span>Demo Price | </span><bdi>سعر تجريبي:</bdi></strong><span> Placeholder pricing for catalog display; final price will be updated later. </span><bdi>سعر مؤقت للعرض في المتجر وسيتم تحديث السعر النهائي لاحقاً.</bdi></li>
</ul>
<h2><span>Perfect For | </span><bdi>مثالية لـ</bdi></h2>
<p><strong><span>Modern Living Rooms | </span><bdi>غرف المعيشة العصرية</bdi></strong></p>
<p><strong><span>Majlis &amp; Formal Rooms | </span><bdi>المجالس والغرف الرسمية</bdi></strong></p>
<p><strong><span>Bedrooms &amp; Guest Rooms | </span><bdi>غرف النوم وغرف الضيوف</bdi></strong></p>
<p><strong><span>Villas &amp; Apartments | </span><bdi>الفلل والشقق</bdi></strong></p>
<p><strong><span>Hotels &amp; Designer Interiors | </span><bdi>الفنادق والديكورات المصممة</bdi></strong></p>
<h2><span>Luxury Tie-Back WiFi Curtains | </span><bdi>ستائر واي فاي فاخرة برباط زخرفي</bdi></h2>
<p><strong><span>English:</span></strong><span> Elevate your windows with {en} from Majalis Alfarah. Enjoy colored blackout sides with decorative tie-backs, a soft sheer center, motorized WiFi control, and a premium finish that complements contemporary Saudi interiors. Custom sizing available on request.</span></p>
<p><strong><span>العربية:</span></strong><span> ارتقِ بنوافذ منزلك مع {ar} من مجالس الفرح. استمتع بجوانب بلاك آوت ملونة مع رباطات زخرفية وشفافة وسط ناعمة وتحكم واي فاي بمحرك وتشطيب فاخر يناسب الديكورات السعودية المعاصرة. المقاسات الخاصة متاحة حسب الطلب.</span></p>
""".strip()


def image_payload(path: Path, position: int) -> dict:
    raw = path.read_bytes()
    return {
        "attachment": base64.b64encode(raw).decode("ascii"),
        "filename": path.name,
        "alt": path.stem.replace("-", " "),
        "position": position,
    }


def already_exists(handle: str) -> dict | None:
    q = urllib.parse.urlencode({"handle": handle, "fields": "id,handle,title"})
    data = req("GET", f"/products.json?{q}")
    prods = data.get("products") or []
    return prods[0] if prods else None


def publish_online(product_id: int) -> None:
    query = """
    mutation publish($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        userErrors { field message }
      }
    }
    """
    payload = {
        "query": query,
        "variables": {
            "id": f"gid://shopify/Product/{product_id}",
            "input": [
                {
                    "publicationId": f"gid://shopify/Publication/{ONLINE_STORE_PUBLICATION_ID}"
                }
            ],
        },
    }
    try:
        data = req("POST", f"https://{SHOP}/admin/api/2024-10/graphql.json", payload)
        errs = (
            (data.get("data") or {})
            .get("publishablePublish", {})
            .get("userErrors")
            or []
        )
        if errs:
            print(f"  warn publish: {errs}")
    except Exception as e:
        print(f"  warn publish: {e}")


def add_to_collection(product_id: int) -> None:
    try:
        req(
            "POST",
            "/collects.json",
            {"collect": {"product_id": product_id, "collection_id": CURTAINS_COLLECTION_ID}},
        )
    except Exception as e:
        if "already" in str(e).lower() or "taken" in str(e).lower():
            return
        print(f"  warn collect: {e}")


def upload_style(style: dict) -> dict:
    sid = style["id"]
    slug = style["slug"]
    en = style["en"]
    ar = style["ar"]
    handle = f"luxury-tieback-wifi-{slug}-{sid}"
    title = f"{en} | {ar}"
    sku = f"LTW-{sid}"

    shots = [
        ("angle1", 1),
        ("angle2", 2),
        ("angle3", 3),
        ("details-en", 4),
        ("details-ar", 5),
    ]
    images = []
    for suf, pos in shots:
        path = IMAGES_DIR / f"{sid}-{slug}-{suf}.jpg"
        if not path.exists():
            raise FileNotFoundError(path)
        images.append(image_payload(path, pos))

    tags = (
        f"curtains, luxury, tie-back, wifi curtains, motorized, ستائر, "
        f"ستائر واي فاي, رباط زخرفي, {slug}, demo-price"
    )

    existing = already_exists(handle)
    if existing:
        print(f"[{sid}] exists #{existing['id']} {handle} — updating images/body")
        product_id = existing["id"]
        variant_id = req("GET", f"/products/{product_id}.json")["product"]["variants"][0]["id"]
        req(
            "PUT",
            f"/products/{product_id}.json",
            {
                "product": {
                    "id": product_id,
                    "title": title,
                    "body_html": build_body(style),
                    "vendor": VENDOR,
                    "product_type": "Curtains",
                    "tags": tags,
                    "status": "active",
                    "variants": [
                        {
                            "id": variant_id,
                            "price": DEMO_PRICE,
                            "compare_at_price": DEMO_COMPARE,
                            "sku": sku,
                        }
                    ],
                }
            },
        )
        full = req("GET", f"/products/{product_id}.json")["product"]
        for img in full.get("images") or []:
            try:
                req("DELETE", f"/products/{product_id}/images/{img['id']}.json")
            except Exception:
                pass
        for img in images:
            req("POST", f"/products/{product_id}/images.json", {"image": img})
    else:
        print(f"[{sid}] creating {title}")
        created = req(
            "POST",
            "/products.json",
            {
                "product": {
                    "title": title,
                    "handle": handle,
                    "body_html": build_body(style),
                    "vendor": VENDOR,
                    "product_type": "Curtains",
                    "tags": tags,
                    "status": "active",
                    "published": True,
                    "variants": [
                        {
                            "price": DEMO_PRICE,
                            "compare_at_price": DEMO_COMPARE,
                            "sku": sku,
                            "inventory_management": None,
                            "requires_shipping": True,
                            "taxable": True,
                            "weight": 2.0,
                            "weight_unit": "kg",
                        }
                    ],
                    "images": images,
                }
            },
        )
        product_id = created["product"]["id"]
        print(f"[{sid}] created #{product_id}")

    add_to_collection(product_id)
    publish_online(product_id)
    return {
        "id": product_id,
        "handle": handle,
        "title": title,
        "url": f"https://majalisalfarah.shop/products/{handle}",
    }


def main():
    styles = json.loads(STYLES_PATH.read_text(encoding="utf-8"))
    print(f"Uploading {len(styles)} luxury tie-back WiFi variants from {IMAGES_DIR}")
    results = []
    errors = []
    for style in styles:
        try:
            results.append(upload_style(style))
        except Exception as e:
            print(f"[{style['id']}] ERROR: {e}")
            errors.append({"id": style["id"], "error": str(e)[:500]})
    out = {
        "uploaded": results,
        "errors": errors,
        "collection_id": CURTAINS_COLLECTION_ID,
        "demo_price": DEMO_PRICE,
        "demo_compare_at": DEMO_COMPARE,
    }
    out_path = ROOT / "shopify-import" / "luxury-tieback-wifi-curtains-upload-result.json"
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Done. uploaded={len(results)} errors={len(errors)} -> {out_path}")
    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
