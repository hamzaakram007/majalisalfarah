export type ProductVariant = {
  id: string;
  product_id: string;
  sku: string | null;
  option_label: string;
  price_sar: number;
  compare_at_price_sar: number | null;
  stock: number;
  image_url: string | null;
  attributes: Record<string, string>;
  is_active: boolean;
  sort_order: number;
};

export type ProductOptionValue = {
  id: string;
  group_id: string;
  value_key: string;
  price_adjustment_sar: number;
  label: string;
  sort_order: number;
};

export type ProductOptionGroup = {
  id: string;
  product_id: string;
  group_key: string;
  label: string;
  selection_type: "single" | "multi";
  is_required: boolean;
  affects_price: boolean;
  is_quote_only: boolean;
  sort_order: number;
  values: ProductOptionValue[];
};

export type ProductImage = {
  id: string;
  url: string;
  alt_text: string | null;
  variant_id: string | null;
  sort_order: number;
};

export type SelectedProductOptions = Record<string, string>;

export function buildCartLineKey(input: {
  productId: string;
  variantId?: string | null;
  options?: SelectedProductOptions;
}) {
  const opts = input.options ?? {};
  const optKey = Object.keys(opts)
    .sort()
    .map((k) => `${k}:${opts[k]}`)
    .join("|");
  return `${input.productId}:${input.variantId ?? "base"}:${optKey || "none"}`;
}

export function resolveProductPrice(
  basePrice: number,
  variant: ProductVariant | null | undefined,
  options: SelectedProductOptions | undefined,
  optionGroups: ProductOptionGroup[],
) {
  if (variant) return variant.price_sar;
  let price = basePrice;
  if (!options || !optionGroups.length) return price;
  for (const group of optionGroups) {
    if (!group.affects_price || group.is_quote_only) continue;
    const selected = options[group.group_key];
    if (!selected) continue;
    const value = group.values.find((v) => v.value_key === selected);
    if (value) price += value.price_adjustment_sar;
  }
  return price;
}

export function resolveProductStock(
  baseStock: number,
  variant: ProductVariant | null | undefined,
) {
  if (variant) return variant.stock;
  return baseStock;
}
