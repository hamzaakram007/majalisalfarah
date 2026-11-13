# Instagram Reels — Majalis Alfarah

Vertical **9:16** product Reels for [The Wood Chapter](../the-wood-chapter/) sculptural seating collection.

Each reel (~40–50s) follows the brand template:

1. **Hook** — cinematic reveal of the full piece  
2. **Material & Color** — bilingual overlay  
3. **Key Features** — bilingual overlay  
4. **Dimensions** — size + seat height  
5. **Promo price** — original SAR crossed out → discounted SAR  
6. **Closing card** — Majalis Alfarah · majalisalfarah.shop · WhatsApp +966596135993  

## Quick start

```bash
# From repo root
pip3 install pillow arabic-reshaper python-bidi

# AI prompts only (paste into Runway / Kling / CapCut / etc.)
python3 instagram-reels/scripts/generate_reels.py --prompts-only

# Generate one reel
python3 instagram-reels/scripts/generate_reels.py soft-geometry

# First 3 products
python3 instagram-reels/scripts/generate_reels.py --limit 3

# All 20
python3 instagram-reels/scripts/generate_reels.py
```

Requires **ffmpeg** on PATH.

## Outputs

| Path | Contents |
|------|----------|
| `output/*-reel-9x16.mp4` | Ready-to-upload Instagram Reels |
| `prompts/*.txt` | Bilingual AI video prompts per product |
| `assets/closing-card.jpg` | Branded end card still |

## Promo pricing

Listed catalog price = **original**. Discount defaults to **15%** (rounded to nearest 50 SAR) in `scripts/reel_data.py` (`DISCOUNT_PCT`). Edit overlay copy / Arabic names there.

## Tips for AI video tools

1. Start the prompt with **“vertical 9:16 aspect ratio”** (already included).  
2. Attach the product’s clean `front` / `angle` / `side` photos from `the-wood-chapter/products/images/` (no pre-baked text).  
3. Prefer warm luxury lighting; keep overlays short and bilingual when targeting KSA.  

## Brand lockup

- **Brand:** Majalis Alfarah / مجالس الفرح  
- **Web:** majalisalfarah.shop  
- **WhatsApp:** +966596135993  
- **Instagram:** @majalisalfarah9  
