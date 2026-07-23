"use client";

import { useEffect } from "react";
import {
  productToAnalyticsItem,
  trackEvent,
} from "@/lib/analytics/events";

export function ProductViewTracker({
  product,
  locale,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    price_sar: number;
    category_slug: string | null;
  };
  locale: string;
}) {
  useEffect(() => {
    trackEvent("view_product", {
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
  }, [product.id, product.slug, product.name, product.price_sar, product.category_slug, locale]);

  return null;
}
