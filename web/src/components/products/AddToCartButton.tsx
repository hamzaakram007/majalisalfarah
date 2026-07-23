"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import {
  productToAnalyticsItem,
  trackEvent,
} from "@/lib/analytics/events";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { ProductWithTranslation } from "@/lib/data/mock";
import Link from "next/link";

export function AddToCartButton({
  product,
  dict,
  locale,
  disabled,
}: {
  product: ProductWithTranslation;
  dict: Dictionary;
  locale: string;
  disabled?: boolean;
}) {
  const { addItem, buyNow } = useCart();
  const router = useRouter();
  const hasOptions =
    (product.variants?.length ?? 0) > 0 ||
    (product.option_groups?.length ?? 0) > 0;

  if (hasOptions) {
    return (
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="inline-flex items-center justify-center rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
      >
        {dict.product.selectVariant}
      </Link>
    );
  }

  const lineItem = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    priceSar: product.price_sar,
    imageUrl: product.image_url,
  };

  function track(action: "add_to_cart" | "buy_now") {
    trackEvent(action, {
      locale,
      product_id: product.id,
      product_slug: product.slug,
      product_name: product.name,
      value: product.price_sar,
      currency: "SAR",
      items: [
        productToAnalyticsItem({
          id: product.id,
          name: product.name,
          price: product.price_sar,
          category: product.category_slug,
        }),
      ],
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="secondary"
        disabled={disabled}
        onClick={() => {
          addItem(lineItem);
          track("add_to_cart");
        }}
      >
        {dict.products.addToCart}
      </Button>
      <Button
        type="button"
        disabled={disabled}
        onClick={() => {
          buyNow(lineItem);
          track("buy_now");
          router.push(`/${locale}/checkout`);
        }}
      >
        {dict.products.buyNow}
      </Button>
    </div>
  );
}
