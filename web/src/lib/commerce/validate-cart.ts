import type { Locale } from "@/lib/i18n/config";
import { getProductById } from "@/lib/data/products";
import {
  buildCartLineKey,
  resolveProductPrice,
  resolveProductStock,
  type SelectedProductOptions,
} from "@/lib/products/types";

export type CheckoutCartItemInput = {
  productId: string;
  variantId?: string | null;
  options?: SelectedProductOptions;
  name: string;
  quantity: number;
  unitPriceSar: number;
  lineKey?: string;
};

export async function validateAndPriceCartItems(
  locale: Locale,
  items: CheckoutCartItemInput[],
): Promise<
  | { ok: true; items: Array<CheckoutCartItemInput & { lineKey: string }> }
  | { ok: false; error: string }
> {
  const priced: Array<CheckoutCartItemInput & { lineKey: string }> = [];

  for (const item of items) {
    const product = await getProductById(locale, item.productId);
    if (!product) {
      return { ok: false, error: `Product not found: ${item.productId}` };
    }

    const variant =
      item.variantId && product.variants?.length
        ? product.variants.find((v) => v.id === item.variantId)
        : undefined;

    if (item.variantId && product.variants?.length && !variant) {
      return { ok: false, error: `Invalid variant for ${product.slug}` };
    }

    const options = item.options ?? {};
    for (const group of product.option_groups ?? []) {
      if (group.is_required && !options[group.group_key]) {
        return {
          ok: false,
          error: `Missing required option: ${group.group_key}`,
        };
      }
      if (group.is_quote_only && options[group.group_key]) {
        continue;
      }
    }

    const stock = resolveProductStock(product.stock, variant);
    if (stock < item.quantity) {
      return { ok: false, error: `Insufficient stock for ${product.name}` };
    }

    const unitPrice = resolveProductPrice(
      product.price_sar,
      variant,
      options,
      product.option_groups ?? [],
    );

    if (Math.abs(unitPrice - item.unitPriceSar) > 0.01) {
      return { ok: false, error: `Price mismatch for ${product.name}` };
    }

    const displayName = variant
      ? `${product.name} — ${variant.option_label}`
      : product.name;

    priced.push({
      ...item,
      name: displayName,
      unitPriceSar: unitPrice,
      lineKey: buildCartLineKey({
        productId: product.id,
        variantId: variant?.id,
        options,
      }),
    });
  }

  return { ok: true, items: priced };
}

