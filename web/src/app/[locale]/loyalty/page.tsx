import { notFound } from "next/navigation";
import { loyaltySettings } from "@/lib/data/mock";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function LoyaltyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">{dict.loyalty.title}</h1>
      <p className="mt-4 text-zinc-600">{dict.loyalty.intro}</p>
      <ul className="mt-8 list-disc space-y-2 ps-6">
        <li>{dict.loyalty.rule1}</li>
        <li>{dict.loyalty.rule2}</li>
      </ul>
      <div className="mt-8 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">
        <p>
          {locale === "ar"
            ? `كل ${100 / loyaltySettings.pointsPer100Sar} ريال = نقطة واحدة. استبدل عند ${loyaltySettings.redeemAt} نقطة للحصول على خصم ${loyaltySettings.discountPercent}%.`
            : `Earn ${loyaltySettings.pointsPer100Sar} point per 100 SAR. Redeem at ${loyaltySettings.redeemAt} points for ${loyaltySettings.discountPercent}% off.`}
        </p>
      </div>
    </div>
  );
}
