# Shopify product export — Majalis Alfarah

Read-only export from `majalisalfarah.shop` via Admin API. **Nothing on the store was changed.**

## Product data (CSV)

| File | Description |
|---|---|
| `products-by-category/*.csv` | One CSV per category (Shopify-style fields; image columns are URLs) |
| `all-products.csv` | Combined catalog |
| `products-by-category-index.csv` | Category counts |
| `products-with-local-photos.csv` | One row per photo with **local file path** |
| `products-photo-manifest.csv` | One row per product listing all local photo paths |

## Product photos (actual image files)

Photos are saved under:

```
shopify-export/product-photos/{category}/{product-handle}/01-....jpg
```

- **207 products**, **806 photos** (~111 MB)
- Open `product-photos-gallery.html` in a browser (keep it next to the `product-photos/` folder)

Category resolution: Shopify product type → product taxonomy (if not Uncategorized) → primary collection. Singular/plural duplicates (`Sofa`/`Sofas`, `Cushion`/`Cushions`) are merged.
