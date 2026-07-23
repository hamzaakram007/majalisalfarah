import { isAnalyticsActive } from "@/lib/analytics/config";

export type AnalyticsEvent =
  | "page_view"
  | "view_product"
  | "add_to_cart"
  | "buy_now"
  | "begin_checkout"
  | "purchase"
  | "quote_request"
  | "whatsapp_click";

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_category?: string | null;
  item_variant?: string;
};

export type AnalyticsPayload = {
  currency?: string;
  value?: number;
  items?: AnalyticsItem[];
  product_id?: string;
  product_name?: string;
  product_slug?: string;
  order_number?: string;
  source?: string;
  locale?: string;
};

function pushGtag(event: AnalyticsEvent, payload: AnalyticsPayload) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, {
    currency: payload.currency ?? "SAR",
    value: payload.value,
    items: payload.items,
    transaction_id: payload.order_number,
    ...payload,
  });
}

function pushMeta(event: AnalyticsEvent, payload: AnalyticsPayload) {
  if (typeof window === "undefined" || !window.fbq) return;
  const metaMap: Partial<Record<AnalyticsEvent, string>> = {
    view_product: "ViewContent",
    add_to_cart: "AddToCart",
    buy_now: "InitiateCheckout",
    begin_checkout: "InitiateCheckout",
    purchase: "Purchase",
    quote_request: "Lead",
    whatsapp_click: "Contact",
  };
  const name = metaMap[event];
  if (!name) return;
  window.fbq("track", name, {
    currency: payload.currency ?? "SAR",
    value: payload.value,
    content_ids: payload.items?.map((i) => i.item_id),
    content_name: payload.product_name ?? payload.items?.[0]?.item_name,
    content_type: "product",
  });
}

function pushTikTok(event: AnalyticsEvent, payload: AnalyticsPayload) {
  if (typeof window === "undefined" || !window.ttq?.track) return;
  const tiktokMap: Partial<Record<AnalyticsEvent, string>> = {
    view_product: "ViewContent",
    add_to_cart: "AddToCart",
    buy_now: "InitiateCheckout",
    begin_checkout: "InitiateCheckout",
    purchase: "CompletePayment",
    quote_request: "SubmitForm",
    whatsapp_click: "Contact",
  };
  const name = tiktokMap[event];
  if (!name) return;
  window.ttq.track(name, {
    currency: payload.currency ?? "SAR",
    value: payload.value,
    content_id: payload.product_id ?? payload.items?.[0]?.item_id,
    content_name: payload.product_name ?? payload.items?.[0]?.item_name,
  });
}

export function trackEvent(event: AnalyticsEvent, payload: AnalyticsPayload = {}) {
  if (!isAnalyticsActive()) return;
  pushGtag(event, payload);
  pushMeta(event, payload);
  pushTikTok(event, payload);
}

export function trackPageView(path: string) {
  if (!isAnalyticsActive()) return;
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", { page_path: path });
  }
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
  if (typeof window !== "undefined" && window.ttq?.page) {
    window.ttq.page();
  }
}

export function productToAnalyticsItem(input: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  category?: string | null;
  variant?: string;
}): AnalyticsItem {
  return {
    item_id: input.id,
    item_name: input.name,
    price: input.price,
    quantity: input.quantity ?? 1,
    item_category: input.category,
    item_variant: input.variant,
  };
}
