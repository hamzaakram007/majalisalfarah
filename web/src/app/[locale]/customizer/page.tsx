"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics/events";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function CustomizerPage() {
  const params = useParams();
  const locale = (isLocale(params.locale as string)
    ? params.locale
    : "en") as Locale;
  const dict = getDictionary(locale);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const productType = form.get("productType");
    const orderMode = form.get("orderMode");
    const curtainType = form.get("curtainType");
    const color = form.get("color");
    const notes = [
      `Product type: ${productType}`,
      `Order mode: ${orderMode}`,
      curtainType ? `Curtain type: ${curtainType}` : null,
      color ? `Color: ${color}` : null,
      form.get("notes") ? `Notes: ${form.get("notes")}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        customerName: form.get("name"),
        customerPhone: form.get("phone"),
        customerEmail: form.get("email") || undefined,
        sofaSize: form.get("size"),
        fabricColor: form.get("fabric"),
        foamType: form.get("foam"),
        dimensions: form.get("dimensions"),
        deliveryCity: form.get("city"),
        notes,
      }),
    });
    setLoading(false);
    setDone(true);
    trackEvent("quote_request", {
      locale,
      source: "customizer",
      product_name: String(productType),
    });
  }

  return (
    <div className="bg-[#f4eee4]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-[2rem] bg-stone-950 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-300">
            Custom Orders
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight">
            {dict.customizer.title}
          </h1>
          <p className="mt-5 leading-7 text-stone-300">
            Build sofas, curtains, majlis seating, cushions, pillows, or sofa
            accessories with ready options or custom measurements. Curtains
            support wave, pleated, blackout, sheer, and layered types.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-stone-200">
            <span className="rounded-full border border-white/20 px-4 py-2">
              {dict.categories.selfOrder}
            </span>
            <span className="rounded-full border border-white/20 px-4 py-2">
              {dict.categories.customOrder}
            </span>
          </div>
        </aside>
        <section className="rounded-[2rem] bg-[#fffaf1] p-6 shadow-sm ring-1 ring-stone-200 md:p-8">
      {done ? (
            <p className="text-emerald-900">{dict.customizer.success}</p>
      ) : (
            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
              <input
                name="name"
                required
                placeholder={dict.checkout.name}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
              />
              <input
                name="phone"
                required
                placeholder={dict.checkout.phone}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
              />
              <input
                name="email"
                type="email"
                placeholder={dict.checkout.email}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 md:col-span-2"
              />
              <label className="block text-sm font-semibold">
                {dict.customizer.productType}
                <select name="productType" className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3">
                  <option>Sofa / كنب</option>
                  <option>Curtains / ستائر</option>
                  <option>Majlis / مجلس</option>
                  <option>Cushions & pillows / مخدات ووسائد</option>
                  <option>Sofa accessories / إكسسوارات كنب</option>
                </select>
              </label>
              <label className="block text-sm font-semibold">
                {dict.customizer.orderMode}
                <select name="orderMode" className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3">
                  <option>Self-order standard size / طلب مباشر</option>
                  <option>Custom order by measurements / تفصيل حسب المقاس</option>
                </select>
              </label>
              <label className="block text-sm font-semibold">
                {dict.customizer.size}
                <select name="size" className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3">
                  <option>2-Seater / مقعدين</option>
                  <option>3-Seater / 3 مقاعد</option>
                  <option>L-Shape / شكل L</option>
                  <option>Window 140 x 240 cm</option>
                  <option>Window 200 x 280 cm</option>
                  <option>Custom measurement / مقاس خاص</option>
                </select>
              </label>
              <label className="block text-sm font-semibold">
                {dict.customizer.curtainType}
                <select name="curtainType" className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3">
                  <option>Wave / ويف</option>
                  <option>Pleated / كسرات</option>
                  <option>Blackout / بلاك آوت</option>
                  <option>Sheer / شفافة</option>
                  <option>Layered / طبقات</option>
                </select>
              </label>
              <label className="block text-sm font-semibold">
                {dict.customizer.color}
                <select name="color" className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3">
                  <option>Warm beige / بيج دافئ</option>
                  <option>Ivory / عاجي</option>
                  <option>Olive / زيتوني</option>
                  <option>Charcoal / فحمي</option>
                  <option>Custom fabric color / لون خاص</option>
                </select>
              </label>
              <label className="block text-sm font-semibold">
                {dict.customizer.fabric}
                <input name="fabric" type="color" defaultValue="#c9b79f" className="mt-2 h-12 w-full rounded-xl border border-stone-300 bg-white" />
              </label>
              <label className="block text-sm font-semibold">
                {dict.customizer.foam}
                <select name="foam" className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3">
                  <option>Soft / ناعم</option>
                  <option>Medium / متوسط</option>
                  <option>Hard / صلب</option>
                  <option>High resilience / عالي المرونة</option>
                </select>
              </label>
              <input
                name="dimensions"
                placeholder={dict.customizer.dimensions}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 md:col-span-2"
              />
              <input
                name="city"
                required
                placeholder={dict.customizer.city}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 md:col-span-2"
              />
              <textarea
                name="notes"
                placeholder={dict.customizer.notes}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 md:col-span-2"
                rows={4}
              />
              <Button type="submit" disabled={loading} className="w-full md:col-span-2">
                {dict.customizer.submit}
              </Button>
            </form>
      )}
        </section>
      </div>
    </div>
  );
}
