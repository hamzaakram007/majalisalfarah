"use client";

import { TrackedWhatsAppLink } from "@/components/analytics/TrackedWhatsAppLink";
import type { Locale } from "@/lib/i18n/config";

export function WhatsAppFloat({ locale }: { locale: Locale }) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "966570169672";
  const label = locale === "ar" ? "تحدث معنا" : "Chat on WhatsApp";
  return (
    <TrackedWhatsAppLink
      href={`https://wa.me/${number}`}
      source="floating_button"
      locale={locale}
      title={label}
      className="fixed bottom-6 end-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-2xl text-white shadow-lg hover:bg-emerald-700"
      aria-label={label}
    >
      💬
    </TrackedWhatsAppLink>
  );
}
