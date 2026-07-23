import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const title =
    locale === "ar" ? "طلب مخصص — كنب وستائر" : "Custom Order — Sofas & Curtains";
  const description =
    locale === "ar"
      ? "اطلب كنب أو ستائر أو مجلس أو مخدات بالمقاسات والألوان والأقمشة التي تختارها."
      : "Request custom sofas, curtains, majlis seating, cushions, or accessories with your sizes, colors, and fabrics.";
  return buildPageMetadata({ locale, title, description, path: "customizer" });
}

export default function CustomizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
