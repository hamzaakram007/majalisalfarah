# Shopify product export — Majalis Alfarah

Read-only export from `majalisalfarah.shop`. **Nothing on the store was changed.**

## Start here: details + photos together

Use **`complete/`** — each category folder has the full product CSV **and** the photo files side by side:

```
complete/
  catalog.html                      # browse details + photos
  all-products-with-photos.csv      # all products, local photo paths
  curtains/
    products.csv                    # full details + Local Image Path
    photos/{product-handle}/*.jpg   # actual images
  sofa/
    products.csv
    photos/...
  ...
```

Open `complete/catalog.html` in a browser (from inside the `complete/` folder).

## Other files

| Path | Description |
|---|---|
| `products-by-category/*.csv` | Category CSVs with image **URLs** |
| `all-products.csv` | Combined catalog (URLs) |
| `product-photos/` | All downloaded photos (same files as in `complete/*/photos/`) |
| `products-with-local-photos.csv` | Photo path index |
| `products-photo-manifest.csv` | Per-product photo list |
