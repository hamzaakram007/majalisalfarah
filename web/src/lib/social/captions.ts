import type { SocialPostLocale, SocialProductCandidate } from "./types";

export function buildProductUrl(slug: string, locale: "en" | "ar" = "en") {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  return `${base}/${locale}/products/${slug}`;
}

export function renderCaptionTemplate(
  template: string,
  product: SocialProductCandidate,
  options: {
    locale: SocialPostLocale;
    includePrice: boolean;
  },
) {
  const name =
    options.locale === "ar"
      ? product.name_ar
      : options.locale === "en"
        ? product.name_en
        : `${product.name_en} | ${product.name_ar}`;

  const description =
    options.locale === "ar"
      ? (product.description_ar ?? "")
      : options.locale === "en"
        ? (product.description_en ?? "")
        : [product.description_en, product.description_ar]
            .filter(Boolean)
            .join("\n\n");

  const price = options.includePrice
    ? `${product.price_sar.toLocaleString("en-SA")} SAR`
    : "";

  const url = buildProductUrl(product.slug, "en");

  return template
    .replaceAll("{{name}}", name.trim())
    .replaceAll("{{description}}", description.trim())
    .replaceAll("{{price}}", price)
    .replaceAll("{{url}}", url)
    .replaceAll("{{slug}}", product.slug)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
