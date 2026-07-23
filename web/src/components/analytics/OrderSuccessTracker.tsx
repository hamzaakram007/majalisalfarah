"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/events";

export function OrderSuccessTracker({
  orderNumber,
  totalSar,
  locale,
  success,
}: {
  orderNumber: string;
  totalSar: number;
  locale: string;
  success: boolean;
}) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!success || tracked.current) return;

    let value = totalSar;
    try {
      const raw = sessionStorage.getItem("maf_pending_purchase");
      if (raw) {
        const pending = JSON.parse(raw) as {
          orderNumber?: string;
          total?: number;
        };
        if (pending.orderNumber === orderNumber && pending.total) {
          value = pending.total;
        }
        sessionStorage.removeItem("maf_pending_purchase");
      }
    } catch {
      /* ignore */
    }

    if (value <= 0) return;

    tracked.current = true;
    trackEvent("purchase", {
      locale,
      order_number: orderNumber,
      value,
      currency: "SAR",
    });
  }, [orderNumber, totalSar, locale, success]);

  return null;
}
