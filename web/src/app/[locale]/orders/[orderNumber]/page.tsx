import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderSuccessTracker } from "@/components/analytics/OrderSuccessTracker";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/server";

export default async function OrderTrackPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; orderNumber: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { locale: localeParam, orderNumber } = await params;
  const { success } = await searchParams;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  let status = success ? "paid" : "pending";
  let totalSar = 0;
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("orders")
      .select("status, total_sar, customer_name")
      .eq("order_number", orderNumber)
      .single();
    if (data) {
      status = data.status;
      totalSar = Number(data.total_sar);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 text-center">
      {success && (
        <OrderSuccessTracker
          orderNumber={orderNumber}
          totalSar={totalSar}
          locale={locale}
          success={Boolean(success)}
        />
      )}
      <h1 className="text-2xl font-bold">{dict.orderTrack.title}</h1>
      <p className="mt-4 text-lg">
        {dict.orderTrack.number}: <strong>{orderNumber}</strong>
      </p>
      <p className="mt-2 capitalize text-emerald-700">Status: {status}</p>
      {success && (
        <p className="mt-4 text-zinc-600">{dict.checkout.success}</p>
      )}
      <Link
        href={`/${locale}`}
        className="mt-8 inline-block text-emerald-700 underline"
      >
        {dict.nav.home}
      </Link>
    </div>
  );
}
