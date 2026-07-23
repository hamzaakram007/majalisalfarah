"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import {
  productToAnalyticsItem,
  trackEvent,
} from "@/lib/analytics/events";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { ProductWithTranslation } from "@/lib/data/mock";
import {
  resolveProductPrice,
  resolveProductStock,
  type ProductVariant,
  type SelectedProductOptions,
} from "@/lib/products/types";
import { formatSar } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

export function ProductPurchasePanel({
  product,
  dict,
  locale,
}: {
  product: ProductWithTranslation;
  dict: Dictionary;
  locale: Locale;
}) {
  const router = useRouter();
  const { addItem, buyNow } = useCart();
  const variants = useMemo(
    () => product.variants ?? [],
    [product.variants],
  );
  const optionGroups = (product.option_groups ?? []).filter(
    (g) => !g.is_quote_only,
  );
  const requiredQuoteGroups = (product.option_groups ?? []).filter(
    (g) => g.is_quote_only,
  );

  const [variantId, setVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );
  const [options, setOptions] = useState<SelectedProductOptions>({});

  const selectedVariant: ProductVariant | undefined = useMemo(
    () => variants.find((v) => v.id === variantId),
    [variants, variantId],
  );

  const price = useMemo(
    () =>
      resolveProductPrice(
        product.price_sar,
        selectedVariant,
        options,
        product.option_groups ?? [],
      ),
    [product, selectedVariant, options],
  );

  const stock = useMemo(
    () => resolveProductStock(product.stock, selectedVariant),
    [product.stock, selectedVariant],
  );

  const optionSummary = useMemo(() => {
    const parts: string[] = [];
    if (selectedVariant) parts.push(selectedVariant.option_label);
    for (const group of product.option_groups ?? []) {
      const val = options[group.group_key];
      if (!val) continue;
      const label = group.values.find((v) => v.value_key === val)?.label ?? val;
      parts.push(`${group.label}: ${label}`);
    }
    return parts.join(" · ");
  }, [selectedVariant, options, product.option_groups]);

  const missingRequired = optionGroups.some(
    (g) => g.is_required && !options[g.group_key],
  );

  const hasQuoteOnlySelection = requiredQuoteGroups.some(
    (g) => options[g.group_key] === "custom",
  );

  const canPurchase =
    stock > 0 &&
    !missingRequired &&
    !hasQuoteOnlySelection &&
    !(variants.length > 0 && !variantId);

  function setOption(groupKey: string, value: string) {
    setOptions((prev) => ({ ...prev, [groupKey]: value }));
  }

  function buildLineItem() {
    return {
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      options,
      slug: product.slug,
      name: product.name,
      priceSar: price,
      imageUrl: selectedVariant?.image_url ?? product.image_url,
      optionSummary,
    };
  }

  function trackProductAction(event: "add_to_cart" | "buy_now") {
    trackEvent(event, {
      locale,
      product_id: product.id,
      product_slug: product.slug,
      product_name: product.name,
      value: price,
      currency: "SAR",
      items: [
        productToAnalyticsItem({
          id: product.id,
          name: product.name,
          price,
          category: product.category_slug,
          variant: selectedVariant?.option_label ?? optionSummary,
        }),
      ],
    });
  }

  return (
    <div className="space-y-5">
      {variants.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-stone-700">
            {dict.product.selectVariant}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  variantId === v.id
                    ? "border-stone-950 bg-stone-950 text-white"
                    : "border-stone-300 bg-white text-stone-800 hover:border-stone-500"
                }`}
              >
                {v.option_label}
              </button>
            ))}
          </div>
        </div>
      )}

      {optionGroups.map((group) => (
        <div key={group.id}>
          <p className="text-sm font-semibold text-stone-700">
            {group.label}
            {group.is_required && (
              <span className="text-red-600"> *</span>
            )}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.values.map((val) => (
              <button
                key={val.id}
                type="button"
                onClick={() => setOption(group.group_key, val.value_key)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  options[group.group_key] === val.value_key
                    ? "border-emerald-800 bg-emerald-50 text-emerald-900"
                    : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                }`}
              >
                {val.label}
                {group.affects_price && val.price_adjustment_sar !== 0 && (
                  <span className="ms-1 text-xs opacity-70">
                    {val.price_adjustment_sar > 0 ? "+" : ""}
                    {val.price_adjustment_sar} SAR
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      <p className="text-2xl font-black text-stone-950">{formatSar(price, locale)}</p>
      <p className="text-sm text-stone-500">
        {stock > 0
          ? `${stock} ${locale === "ar" ? "متوفر" : "in stock"}`
          : dict.products.outOfStock}
      </p>

      {hasQuoteOnlySelection && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {dict.product.customSizeQuote}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={!canPurchase}
          onClick={() => {
            addItem(buildLineItem());
            trackProductAction("add_to_cart");
          }}
        >
          {dict.products.addToCart}
        </Button>
        <Button
          type="button"
          disabled={!canPurchase}
          onClick={() => {
            buyNow(buildLineItem());
            trackProductAction("buy_now");
            router.push(`/${locale}/checkout`);
          }}
        >
          {dict.products.buyNow}
        </Button>
      </div>
    </div>
  );
}
