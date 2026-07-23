"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatSar } from "@/lib/utils";

export default function CartPage() {
  const params = useParams();
  const localeParam = params.locale as string;
  const locale = (isLocale(localeParam) ? localeParam : "en") as Locale;
  const dict = getDictionary(locale);
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  if (!items.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-black">{dict.cart.title}</h1>
        <p className="mt-4 text-stone-600">{dict.cart.empty}</p>
        <Link
          href={`/${locale}/products`}
          className="mt-6 inline-block text-emerald-700 underline"
        >
          {dict.nav.products}
        </Link>
      </div>
    );
  }

  const shipping = subtotal >= 5000 ? 0 : 99;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-black">{dict.cart.title}</h1>
      <p className="mb-8 text-sm text-stone-600">{dict.checkoutInfo.support}</p>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.lineKey}
            className="flex gap-4 rounded-lg border border-zinc-200 bg-white p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-zinc-100">
              <Image
                src={item.imageUrl ?? "/images/sofa-sample.svg"}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="font-medium">{item.name}</span>
              {item.optionSummary && (
                <span className="text-xs text-stone-500">{item.optionSummary}</span>
              )}
              <span className="text-emerald-800">
                {formatSar(item.priceSar, locale)}
              </span>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  className="rounded border px-2"
                  onClick={() =>
                    updateQuantity(item.lineKey, item.quantity - 1)
                  }
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  className="rounded border px-2"
                  onClick={() =>
                    updateQuantity(item.lineKey, item.quantity + 1)
                  }
                >
                  +
                </button>
                <button
                  type="button"
                  className="ms-auto text-sm text-red-600"
                  onClick={() => removeItem(item.lineKey)}
                >
                  {dict.cart.remove}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 space-y-3 rounded-2xl bg-[#fffaf1] p-6 ring-1 ring-stone-200">
        <div className="flex justify-between text-sm text-stone-600">
          <span>{dict.cart.total}</span>
          <span>{formatSar(subtotal, locale)}</span>
        </div>
        <div className="flex justify-between text-sm text-stone-600">
          <span>{locale === "ar" ? "الشحن" : "Shipping"}</span>
          <span>
            {shipping === 0
              ? locale === "ar"
                ? "مجاني"
                : "Free"
              : formatSar(shipping, locale)}
          </span>
        </div>
        <div className="flex justify-between border-t border-stone-200 pt-3 text-lg font-black">
          <span>{locale === "ar" ? "الإجمالي" : "Estimated total"}</span>
          <span>{formatSar(subtotal + shipping, locale)}</span>
        </div>
        <p className="text-xs text-stone-500">{dict.checkoutInfo.shippingNote}</p>
        <div className="rounded-2xl bg-[#f4eee4] p-4 text-xs leading-6 text-stone-600">
          <p className="font-semibold text-stone-900">
            {dict.checkoutInfo.methodsTitle}
          </p>
          <p className="mt-1">{dict.checkoutInfo.methods}</p>
          <p className="mt-2">{dict.checkoutInfo.customNote}</p>
        </div>
        <Link href={`/${locale}/checkout`} className="block">
          <Button className="w-full">{dict.cart.checkout}</Button>
        </Link>
      </div>
    </div>
  );
}
