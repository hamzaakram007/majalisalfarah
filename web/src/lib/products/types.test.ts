import { describe, expect, it } from "vitest";
import {
  buildCartLineKey,
  resolveProductPrice,
  resolveProductStock,
} from "@/lib/products/types";
import type { ProductOptionGroup, ProductVariant } from "@/lib/products/types";

const variant: ProductVariant = {
  id: "v1",
  product_id: "p1",
  sku: null,
  option_label: "Olive",
  price_sar: 4100,
  compare_at_price_sar: null,
  stock: 5,
  image_url: null,
  attributes: { color: "olive" },
  is_active: true,
  sort_order: 0,
};

const optionGroups: ProductOptionGroup[] = [
  {
    id: "g1",
    product_id: "p1",
    group_key: "installation",
    label: "Installation",
    selection_type: "single",
    is_required: false,
    affects_price: true,
    is_quote_only: false,
    sort_order: 0,
    values: [
      {
        id: "ov1",
        group_id: "g1",
        value_key: "standard",
        price_adjustment_sar: 150,
        label: "Standard",
        sort_order: 0,
      },
    ],
  },
];

describe("product commerce helpers", () => {
  it("builds stable cart line keys", () => {
    const key = buildCartLineKey({
      productId: "p1",
      variantId: "v1",
      options: { installation: "standard" },
    });
    expect(key).toBe("p1:v1:installation:standard");
  });

  it("uses variant price when selected", () => {
    expect(resolveProductPrice(3900, variant, {}, [])).toBe(4100);
  });

  it("adds option price adjustments", () => {
    expect(
      resolveProductPrice(890, null, { installation: "standard" }, optionGroups),
    ).toBe(1040);
  });

  it("uses variant stock when selected", () => {
    expect(resolveProductStock(10, variant)).toBe(5);
  });
});
