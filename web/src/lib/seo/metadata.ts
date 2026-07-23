import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import {
  defaultDescriptions,
  getSiteUrl,
  localePath,
  seoKeywords,
  siteConfig,
} from "./site";

type PageMetaInput = {
  locale: Locale;
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  noIndex?: boolean;
};

export function buildPageMetadata({
  locale,
  title,
  description,
  path = "",
  image,
  noIndex,
}: PageMetaInput): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = localePath(locale, path);
  const desc = description ?? defaultDescriptions[locale];
  const ogImage =
    image ??
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80";
  const fullTitle =
    title === siteConfig.name || title === siteConfig.nameAr
      ? `${siteConfig.name} | ${siteConfig.nameAr}`
      : `${title} | ${siteConfig.name}`;

  return {
    title: fullTitle,
    description: desc,
    keywords: seoKeywords[locale],
    alternates: {
      canonical,
      languages: {
        en: localePath("en", path),
        ar: localePath("ar", path),
        "x-default": localePath("en", path),
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_SA",
      url: canonical,
      siteName: siteConfig.name,
      title: fullTitle,
      description: desc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    metadataBase: new URL(siteUrl),
  };
}

export function homeMetadata(locale: Locale): Metadata {
  const title =
    locale === "ar"
      ? "أثاث وكنب وستائر حسب الطلب في السعودية"
      : "Custom Sofas, Curtains & Majlis Furniture";
  const description =
    locale === "ar"
      ? "مجالس الفرح: كنب سعودي، ستائر بمقاسات وألوان متعددة، فوم، مخدات، وديكور مجالس منذ 1990. طلب مباشر أو تفصيل حسب المقاس."
      : defaultDescriptions.en;
  return buildPageMetadata({ locale, title, description, path: "" });
}
