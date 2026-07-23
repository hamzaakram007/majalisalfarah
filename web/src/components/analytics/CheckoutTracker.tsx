"use client";

import { useEffect, useRef } from "react";
import {
  productToAnalyticsItem,
  trackEvent,
} from "@/lib/analytics/events";
import type { CartItem } from "@/lib/cart/types";

export function CheckoutTracker({
  items,
  subtotal,
  locale,
}: {
  items: CartItem[];
  subtotal: number;
  locale: string;
}) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current || !items.length) return;
    tracked.current = true;
    trackEvent("begin_checkout", {
      locale,
      value: subtotal,
      currency: "SAR",
      items: items.map((i) =>
        productToAnalyticsItem({
          id: i.productId,
          name: i.name,
          price: i.priceSar,
          quantity: i.quantity,
          variant: i.optionSummary,
        }),
      ),
    });
  }, [items, subtotal, locale]);

  return null;
}
