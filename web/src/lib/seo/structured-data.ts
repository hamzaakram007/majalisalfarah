import type { Locale } from "@/lib/i18n/config";
import type { ProductWithTranslation } from "@/lib/data/mock";
import { getSiteUrl, localePath, siteConfig } from "./site";

export function organizationJsonLd(locale: Locale) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "@id": `${url}/#organization`,
    name: locale === "ar" ? siteConfig.nameAr : siteConfig.name,
    url,
    logo: `${url}/brand/logo-mark.svg`,
    image: `${url}/brand/logo-mark.svg`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ali Bin Abi Talib Road, Al Saharij",
      addressLocality: "Yanbu",
      addressCountry: "SA",
    },
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
    foundingDate: String(siteConfig.foundingYear),
    priceRange: "$$",
    sameAs: [
      `https://wa.me/${siteConfig.whatsappNumber}`,
      `https://www.instagram.com/${siteConfig.instagram}/`,
    ],
  };
}

export function websiteJsonLd(locale: Locale) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name: siteConfig.name,
    inLanguage: locale === "ar" ? "ar-SA" : "en-SA",
    publisher: { "@id": `${url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/${locale}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: localePath(locale, item.path),
    })),
  };
}

export function productJsonLd(
  product: ProductWithTranslation,
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? product.name,
    image: product.image_url,
    sku: product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "SAR",
      price: product.price_sar,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: localePath(locale, `products/${product.slug}`),
    },
  };
}

export function faqJsonLd(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
