# Complete export — product details + photos together

Each category folder contains **both**:

1. `products.csv` — full Shopify product details (title, description, price, variants, SKU, tags, SEO, etc.) **and** `Local Image Path` columns pointing to files in this folder
2. `photos/` — the actual image files for those products

## Layout

```
complete/
  catalog.html                 # browse details + photos together
  all-products-with-photos.csv # everything in one CSV
  index.csv
  curtains/
    products.csv
    photos/{handle}/*.jpg
  sofa/
    products.csv
    photos/{handle}/*.jpg
  ...
```

Open `catalog.html` in a browser from this folder.
Open any `products.csv` in Excel — the `Local Image Path` column is a relative path to the photo file next to the CSV.
