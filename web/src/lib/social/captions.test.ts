import { describe, expect, it } from "vitest";
import { buildProductUrl, renderCaptionTemplate } from "./captions";
import type { SocialProductCandidate } from "./types";

const product: SocialProductCandidate = {
  id: "1",
  slug: "riyadh-majlis-sofa",
  name_en: "Riyadh Majlis Sofa",
  name_ar: "جلسة مجلس الرياض",
  description_en: "Custom Saudi seating.",
  description_ar: "جلسة سعودية مخصصة.",
  price_sar: 4500,
  image_url: "https://example.com/sofa.jpg",
  is_featured: true,
};

describe("social captions", () => {
  it("builds storefront product urls", () => {
    expect(buildProductUrl("riyadh-majlis-sofa", "en")).toContain(
      "/en/products/riyadh-majlis-sofa",
    );
  });

  it("renders bilingual captions with price and url", () => {
    const caption = renderCaptionTemplate(
      "{{name}}\n{{description}}\n{{price}}\n{{url}}",
      product,
      { locale: "both", includePrice: true },
    );
    expect(caption).toContain("Riyadh Majlis Sofa");
    expect(caption).toContain("جلسة مجلس الرياض");
    expect(caption).toContain("Custom Saudi seating.");
    expect(caption).toContain("SAR");
    expect(caption).toContain("/en/products/riyadh-majlis-sofa");
  });

  it("omits price when disabled", () => {
    const caption = renderCaptionTemplate("{{name}}\n{{price}}", product, {
      locale: "en",
      includePrice: false,
    });
    expect(caption).toBe("Riyadh Majlis Sofa");
  });
});
