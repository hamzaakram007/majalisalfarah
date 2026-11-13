"""Bilingual overlay copy + promo pricing for Majalis Alfarah Instagram Reels."""

from __future__ import annotations

import re
from typing import Any

BRAND = {
    "name": "Majalis Alfarah",
    "name_ar": "مجالس الفرح",
    "website": "majalisalfarah.shop",
    "whatsapp": "+966596135993",
    "instagram": "@majalisalfarah9",
}

# Default promo: list price = original, ~15% off rounded to nearest 50
DISCOUNT_PCT = 0.15

# Arabic product names + short category / setting copy for reels
OVERLAYS: dict[str, dict[str, str]] = {
    "soft-geometry": {
        "name_ar": "هندسة ناعمة",
        "category": "sculptural accent lounge chair",
        "category_ar": "كرسي جلوس منحوت فاخر",
        "setting": "contemporary Saudi villa living room",
        "setting_ar": "غرفة معيشة فيلا سعودية عصرية",
        "features": "Stacked circular seat, cylindrical bolster backrest, low dark wood plinth",
        "features_ar": "مقعد دائري مزدوج، مسند ظهر أسطواني، قاعدة خشب داكنة منخفضة",
        "material": "Nubby cream bouclé with subtle tonal pattern — Cream ivory",
        "material_ar": "قماش بوكليه كريمي محبب — عاجي كريمي",
    },
    "natural-hues": {
        "name_ar": "ألوان طبيعية",
        "category": "organic wraparound lounge chair",
        "category_ar": "كرسي استرخاء عضوي ملتف",
        "setting": "modern majlis with natural light",
        "setting_ar": "مجلس عصري بإضاءة طبيعية",
        "features": "Horseshoe wrap-around back, deep circular seat, hidden swivel base",
        "features_ar": "ظهر ملتف على شكل حدوة، مقعد دائري عميق، قاعدة دوّارة مخفية",
        "material": "Textured olive-green bouclé — Olive sage",
        "material_ar": "بوكليه زيتوني محكم — زيتوني مريمي",
    },
    "modular-lounging": {
        "name_ar": "جلوس معياري",
        "category": "modular quilted lounge sofa chair",
        "category_ar": "كنبة جلوس معيارية مبطنة",
        "setting": "contemporary Saudi villa living room",
        "setting_ar": "غرفة معيشة فيلا سعودية عصرية",
        "features": "Six puffy quilted segments, floor-hugging modular lounge",
        "features_ar": "ستة مقاطع مبطنة منفوخة، جلوس منخفض ملاصق للأرض",
        "material": "Soft terracotta with vertical pillow tufting — Terracotta rust",
        "material_ar": "تيراكوتا ناعمة بتطريز عمودي — صدأ تيراكوتا",
    },
    "tactile-living": {
        "name_ar": "لمسة فاخرة",
        "category": "enveloping bouclé accent chair",
        "category_ar": "كرسي بوكليه فاخر مغلّف",
        "setting": "luxury modern majlis",
        "setting_ar": "مجلس عصري فاخر",
        "features": "High enveloping rounded back with integrated arms, dark wood plinth",
        "features_ar": "ظهر دائري مرتفع مغلّف مع أذرع مدمجة، قاعدة خشب داكنة",
        "material": "Plush cream bouclé — Cream ivory",
        "material_ar": "بوكليه كريمي فاخر — عاجي كريمي",
    },
    "cocoon-comfort": {
        "name_ar": "راحة الشرنقة",
        "category": "barrel cocoon swivel lounge chair",
        "category_ar": "كرسي شرنقة دوار فاخر",
        "setting": "contemporary Saudi villa living room",
        "setting_ar": "غرفة معيشة فيلا سعودية عصرية",
        "features": "Tall barrel cocoon shell, thick circular inset seat, brushed brass swivel",
        "features_ar": "هيكل شرنقة برميلي مرتفع، مقعد دائري سميك، قاعدة نحاس مصقول دوّارة",
        "material": "Deep navy textured chenille bouclé — Midnight navy",
        "material_ar": "شينيليه بوكليه كحلي محكم — كحلي منتصف الليل",
    },
    "relaxed-luxury": {
        "name_ar": "فخامة مريحة",
        "category": "low-slung channel-tufted lounge",
        "category_ar": "أريكة استرخاء منخفضة بخطوط أفقية",
        "setting": "warm modern majlis",
        "setting_ar": "مجلس عصري دافئ",
        "features": "Stacked horizontal ribbed cushion layers, floor-hugging base",
        "features_ar": "طبقات وسائد أفقية مضلعة، قاعدة منخفضة ملاصقة للأرض",
        "material": "Warm cognac channel-tufted upholstery — Cognac brown",
        "material_ar": "تنجيد كونياك دافئ بخطوط أفقية — بني كونياك",
    },
    "quiet-luxury": {
        "name_ar": "فخامة هادئة",
        "category": "compact barrel accent chair",
        "category_ar": "كرسي برميلي مدمج فاخر",
        "setting": "quiet luxury Saudi villa corner",
        "setting_ar": "ركن فيلا سعودية بفخامة هادئة",
        "features": "Classic compact barrel form, thick rounded seat, brushed brass ring swivel",
        "features_ar": "شكل برميلي كلاسيكي مدمج، مقعد دائري سميك، حلقة نحاس دوّارة",
        "material": "Cream bouclé — Cream ivory",
        "material_ar": "بوكليه كريمي — عاجي كريمي",
    },
    "sage-story": {
        "name_ar": "قصة المريمية",
        "category": "deep wraparound swivel lounge chair",
        "category_ar": "كرسي استرخاء ملتف عميق",
        "setting": "nature-inspired modern majlis",
        "setting_ar": "مجلس عصري مستوحى من الطبيعة",
        "features": "Deep circular seat, high continuous wrap-around back and arms, brass swivel",
        "features_ar": "مقعد دائري عميق، ظهر وأذرع ملتفة مرتفعة، قاعدة نحاس دوّارة",
        "material": "Sage green plush bouclé — Muted sage",
        "material_ar": "بوكليه أخضر مريمي فاخر — مريمي هادئ",
    },
    "playful-shapes": {
        "name_ar": "أشكال مرحة",
        "category": "sculptural playful accent chair",
        "category_ar": "كرسي منحوت بأشكال مرحة",
        "setting": "contemporary Saudi villa living room",
        "setting_ar": "غرفة معيشة فيلا سعودية عصرية",
        "features": "Bulbous round seat with cylindrical bolster backrest, brushed brass swivel",
        "features_ar": "مقعد دائري منتفخ مع مسند ظهر أسطواني، قاعدة نحاس دوّارة",
        "material": "Cream bouclé — Cream ivory",
        "material_ar": "بوكليه كريمي — عاجي كريمي",
    },
    "bold-accents": {
        "name_ar": "لمسات جريئة",
        "category": "statement sculptural lounge stool chair",
        "category_ar": "كرسي جلوس منحوت بلمسة جريئة",
        "setting": "modern majlis statement corner",
        "setting_ar": "ركن مميز في مجلس عصري",
        "features": "Circular seat, cylindrical bolster backrest, four thick stump legs",
        "features_ar": "مقعد دائري، مسند ظهر أسطواني، أربع أرجل سميكة",
        "material": "Matte terracotta upholstery — Terracotta rust",
        "material_ar": "تنجيد تيراكوتا مطفي — صدأ تيراكوتا",
    },
    "contemporary-flow": {
        "name_ar": "تدفق عصري",
        "category": "asymmetrical sculptural lounge chair",
        "category_ar": "كرسي استرخاء منحوت غير متماثل",
        "setting": "contemporary Saudi villa living room",
        "setting_ar": "غرفة معيشة فيلا سعودية عصرية",
        "features": "Sweeping asymmetrical backrest, single flowing arm, brushed brass swivel",
        "features_ar": "ظهر غير متماثل انسيابي، ذراع واحدة متدفقة، قاعدة نحاس دوّارة",
        "material": "Cream bouclé — Cream ivory",
        "material_ar": "بوكليه كريمي — عاجي كريمي",
    },
    "deep-comfort": {
        "name_ar": "راحة عميقة",
        "category": "plush deep-seat swivel lounge chair",
        "category_ar": "كرسي استرخاء عميق ومريح",
        "setting": "luxury modern majlis",
        "setting_ar": "مجلس عصري فاخر",
        "features": "Extra-thick pillowy seat, soft blocky arms, brushed brass swivel",
        "features_ar": "مقعد وسادي سميك جداً، أذرع ناعمة، قاعدة نحاس دوّارة",
        "material": "Navy plush bouclé — Midnight navy",
        "material_ar": "بوكليه كحلي فاخر — كحلي منتصف الليل",
    },
    "sculpted-simplicity": {
        "name_ar": "بساطة منحوتة",
        "category": "minimal wood-and-bouclé lounge chair",
        "category_ar": "كرسي بسيط من الخشب والبوكليه",
        "setting": "warm contemporary Saudi villa",
        "setting_ar": "فيلا سعودية عصرية دافئة",
        "features": "Rounded seat, cylindrical bolster arms, dark wood side beam supports",
        "features_ar": "مقعد دائري، أذرع أسطوانية، دعامات خشب داكنة جانبية",
        "material": "Cream bouclé — Cream ivory",
        "material_ar": "بوكليه كريمي — عاجي كريمي",
    },
    "earth-balance": {
        "name_ar": "توازن الأرض",
        "category": "organic low sculptural lounge chair",
        "category_ar": "كرسي استرخاء عضوي منخفض",
        "setting": "grounded modern majlis",
        "setting_ar": "مجلس عصري بأجواء أرضية",
        "features": "Organic bean-shaped seat, spherical accent cushion, brass swivel",
        "features_ar": "مقعد عضوي بشكل حبة، وسادة كروية مميزة، قاعدة نحاس دوّارة",
        "material": "Sage green bouclé — Olive sage",
        "material_ar": "بوكليه أخضر مريمي — زيتوني مريمي",
    },
    "new-classics": {
        "name_ar": "كلاسيكيات جديدة",
        "category": "mid-century wood frame accent armchair",
        "category_ar": "كرسي بذراعين خشبي بطابع منتصف القرن",
        "setting": "classic contemporary Saudi villa living room",
        "setting_ar": "غرفة معيشة كلاسيكية عصرية",
        "features": "Exposed dark wood mid-century frame, tapered legs, cream cushions",
        "features_ar": "إطار خشب داكن بطابع منتصف القرن، أرجل مستدقة، وسائد كريمية",
        "material": "Cream bouclé cushions — Cream + walnut",
        "material_ar": "وسائد بوكليه كريمية — كريمي وجوز",
    },
    "warm-textures": {
        "name_ar": "أنسجة دافئة",
        "category": "scooped barrel swivel lounge chair",
        "category_ar": "كرسي برميلي مجوّف دوار",
        "setting": "warm inviting modern majlis",
        "setting_ar": "مجلس عصري دافئ وجذّاب",
        "features": "Deep bowl-like scooped barrel seat, rounded wraparound back, brass swivel",
        "features_ar": "مقعد برميلي مجوّف عميق، ظهر ملتف دائري، قاعدة نحاس دوّارة",
        "material": "Terracotta bouclé — Terracotta rust",
        "material_ar": "بوكليه تيراكوتا — صدأ تيراكوتا",
    },
    "curated-comfort": {
        "name_ar": "راحة منتقاة",
        "category": "curated round swivel accent chair",
        "category_ar": "كرسي دائري دوار منتقاة بعناية",
        "setting": "designed contemporary Saudi villa living room",
        "setting_ar": "غرفة معيشة مصممة في فيلا سعودية",
        "features": "Rounded armchair, curved back, matching spherical throw pillow, brass swivel",
        "features_ar": "كرسي دائري، ظهر منحني، وسادة كروية مطابقة، قاعدة نحاس دوّارة",
        "material": "Cream bouclé — Cream ivory",
        "material_ar": "بوكليه كريمي — عاجي كريمي",
    },
    "low-profile": {
        "name_ar": "تصميم منخفض",
        "category": "elongated low-profile mini sofa lounge",
        "category_ar": "أريكة مصغّرة منخفضة وطويلة",
        "setting": "horizontal modern majlis seating wall",
        "setting_ar": "جدار جلوس أفقي في مجلس عصري",
        "features": "Elongated low bench form, long rounded seat, matching bolster backrest",
        "features_ar": "مقعد منخفض طويل، قاعدة دائرية ممتدة، مسند ظهر أسطواني مطابق",
        "material": "Smooth sage green upholstery — Sage green",
        "material_ar": "تنجيد أخضر مريمي ناعم — أخضر مريمي",
    },
    "detail-matters": {
        "name_ar": "التفاصيل تهم",
        "category": "architectural wood-block accent armchair",
        "category_ar": "كرسي بذراعين بإطار خشبي معماري",
        "setting": "crafted contemporary Saudi villa living room",
        "setting_ar": "غرفة معيشة حرفية في فيلا سعودية",
        "features": "Geometric dark wood block frame, chunky square legs and arms, bouclé cushions",
        "features_ar": "إطار خشب داكن هندسي، أرجل وأذرع مربعة سميكة، وسائد بوكليه",
        "material": "Cream bouclé — Cream + walnut",
        "material_ar": "بوكليه كريمي — كريمي وجوز",
    },
    "blush-hour": {
        "name_ar": "ساعة الورد",
        "category": "feminine blush barrel lounge chair",
        "category_ar": "كرسي برميلي وردي أنثوي",
        "setting": "soft romantic modern majlis",
        "setting_ar": "مجلس عصري رومانسي ناعم",
        "features": "Feminine rounded barrel form, continuous curved back into arms, brass swivel",
        "features_ar": "شكل برميلي أنثوي دائري، ظهر منحني متصل بالأذرع، قاعدة نحاس دوّارة",
        "material": "Soft blush pink velvet-chenille — Dusty blush pink",
        "material_ar": "شينيليه مخملي وردي ناعم — وردي باهت",
    },
}


def parse_price_sar(price_str: str) -> int:
    digits = re.sub(r"[^\d]", "", price_str)
    return int(digits) if digits else 0


def format_sar(amount: int) -> str:
    return f"{amount:,}".replace(",", ",")


def promo_prices(price_str: str) -> tuple[int, int]:
    original = parse_price_sar(price_str)
    discounted = int(round(original * (1 - DISCOUNT_PCT) / 50) * 50)
    if discounted >= original:
        discounted = max(50, original - 50)
    return original, discounted


def enrich_product(product: dict[str, Any]) -> dict[str, Any]:
    slug = product["slug"]
    overlay = OVERLAYS.get(slug, {})
    original, discounted = promo_prices(product["price"])
    return {
        **product,
        "name_ar": overlay.get("name_ar", product["name"]),
        "category": overlay.get("category", "sculptural lounge chair"),
        "category_ar": overlay.get("category_ar", "كرسي جلوس منحوت"),
        "setting": overlay.get("setting", "contemporary Saudi villa living room"),
        "setting_ar": overlay.get("setting_ar", "غرفة معيشة فيلا سعودية عصرية"),
        "features": overlay.get("features", product.get("shape", "")),
        "features_ar": overlay.get("features_ar", ""),
        "material": overlay.get(
            "material", f"{product.get('fabric', '')} — {product.get('color', '')}"
        ),
        "material_ar": overlay.get("material_ar", ""),
        "original_price": original,
        "discounted_price": discounted,
        "original_price_label": f"{format_sar(original)} SAR",
        "discounted_price_label": f"{format_sar(discounted)} SAR",
    }


def build_ai_prompt(product: dict[str, Any]) -> str:
    p = enrich_product(product)
    return f"""Create a vertical 9:16 Instagram Reel showcasing the {p['name']} ({p['name_ar']}), a {p['category']} ({p['category_ar']}) in a {p['setting']} ({p['setting_ar']}).

Start with a fast-paced, eye-catching hook revealing the full {p['name']} with smooth cinematic camera pans and zooms. Highlight key details using clean on-screen text overlays:
• Material & Color / الخامة واللون: {p['material']} | {p['material_ar']}
• Key Features / المميزات: {p['features']} | {p['features_ar']}
• Dimensions / الأبعاد: {p['dims']} | Seat height / ارتفاع المقعد: {p['seat_h']}

Display a bold promotional price callout showing the original price {p['original_price_label']} crossed out, discounted to {p['discounted_price_label']}.
النص العربي للسعر: السعر الأصلي {p['original_price_label']} مشطوب، والخصم إلى {p['discounted_price_label']}.

End with a clean, branded closing screen featuring:
• Brand: Majalis Alfarah / مجالس الفرح
• Website: majalisalfarah.shop
• WhatsApp: +966596135993

Ensure warm, luxury lighting, smooth transitions, and a duration between 30 to 60 seconds.
Use the attached clean product photos (front / angle / side) without pre-baked text so overlays stay readable.
"""
