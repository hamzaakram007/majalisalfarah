# Shopify product export — Majalis Alfarah

Read-only export from `majalisalfarah.shop` via Admin API. **Nothing on the store was changed.**

| | |
|---|---|
| Products exported | 207 (all active) |
| Category files | `products-by-category/*.csv` |
| Combined file | `all-products.csv` |
| Index | `products-by-category-index.csv` |

Category resolution: Shopify product type → product taxonomy (if not Uncategorized) → primary collection. Singular/plural duplicates (`Sofa`/`Sofas`, `Cushion`/`Cushions`) are merged.
