"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CheckoutTracker } from "@/components/analytics/CheckoutTracker";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatSar } from "@/lib/utils";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (isLocale(params.locale as string)
    ? params.locale
    : "en") as Locale;
  const dict = getDictionary(locale);
  const { items, subtotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        customer: {
          name: form.get("name"),
          phone: form.get("phone"),
          email: form.get("email") || undefined,
          city: form.get("city"),
          address: form.get("address"),
        },
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          options: i.options,
          lineKey: i.lineKey,
          name: i.name,
          quantity: i.quantity,
          unitPriceSar: i.priceSar,
        })),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Checkout failed");
      return;
    }
    if (data.paymentUrl) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "maf_pending_purchase",
          JSON.stringify({
            orderNumber: data.orderNumber,
            total: data.total,
          }),
        );
      }
      clear();
      window.location.href = data.paymentUrl;
      return;
    }
    clear();
    router.push(
      `/${locale}/orders/${data.orderNumber}?success=1`,
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p>{dict.cart.empty}</p>
      </div>
    );
  }

  const shipping = subtotal >= 5000 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <CheckoutTracker items={items} subtotal={subtotal} locale={locale} />
      <h1 className="mb-2 text-2xl font-black">{dict.checkout.title}</h1>
      <p className="mb-6 text-sm text-stone-600">{dict.checkoutInfo.secure}</p>
      <div className="mb-6 grid gap-3 rounded-2xl bg-stone-950 p-5 text-sm text-white">
        <div>
          <p className="font-bold">{dict.checkoutInfo.methodsTitle}</p>
          <p className="mt-1 text-stone-300">{dict.checkoutInfo.methods}</p>
        </div>
        <div className="grid gap-2 text-stone-300 sm:grid-cols-2">
          <p>{dict.checkoutInfo.deliveryNote}</p>
          <p>{dict.checkoutInfo.customNote}</p>
        </div>
      </div>
      <div className="mb-6 rounded-2xl bg-[#fffaf1] p-5 ring-1 ring-stone-200">
        <div className="flex justify-between text-sm">
          <span>{dict.cart.total}</span>
          <span>{formatSar(subtotal, locale)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span>{locale === "ar" ? "الشحن" : "Shipping"}</span>
          <span>
            {shipping === 0
              ? locale === "ar"
                ? "مجاني"
                : "Free"
              : formatSar(shipping, locale)}
          </span>
        </div>
        <div className="mt-3 flex justify-between border-t pt-3 font-black">
          <span>{locale === "ar" ? "الإجمالي" : "Total"}</span>
          <span>{formatSar(total, locale)}</span>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          name="name"
          required
          placeholder={dict.checkout.name}
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          name="phone"
          required
          placeholder={dict.checkout.phone}
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          name="email"
          type="email"
          placeholder={dict.checkout.email}
          className="w-full rounded-lg border px-3 py-2"
        />
        <input
          name="city"
          required
          placeholder={dict.checkout.city}
          className="w-full rounded-lg border px-3 py-2"
        />
        <textarea
          name="address"
          required
          placeholder={dict.checkout.address}
          className="w-full rounded-lg border px-3 py-2"
          rows={3}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "..." : dict.checkout.placeOrder}
        </Button>
        <p className="text-center text-xs text-stone-500">
          {dict.checkoutInfo.shippingNote}
        </p>
      </form>
    </div>
  );
}
