# Majalis Al Farah — Modular Sofa Collection

**30 products × 5 photos = 150 images**

Each product includes:

| Shot | Suffix | Description |
|------|--------|-------------|
| Front | `*-front.jpg` | Straight-on lifestyle product view |
| Angle | `*-angle.jpg` | Three-quarter / 45° depth view |
| Side | `*-side.jpg` | Side profile |
| Detail AR | `*-detail-ar.jpg` | Feature callouts in Arabic |
| Detail EN | `*-detail-en.jpg` | Feature callouts in English |

## Browse

- [index.html](index.html) — collection landing
- [all-angles.html](all-angles.html) — every product with all 5 photos
- [products/](products/) — individual product pages

```bash
cd sofa-collection
python3 -m http.server 8766
```

Visit http://localhost:8766

## Data

- `products/products.json` — names (EN/AR), materials, dimensions, prices, image paths
- `products/references/` — source moodboard photos
- `products/images/` — generated catalog photography
