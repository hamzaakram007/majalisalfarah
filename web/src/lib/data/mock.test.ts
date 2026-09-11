import { describe, expect, it } from "vitest";
import { getMockCategories, getMockProducts } from "./mock";

describe("mock catalog", () => {
  it("includes curtains as an orderable first-class category", () => {
    const categories = getMockCategories("en").map((category) => category.slug);
    const curtainProducts = getMockProducts("en").filter(
      (product) => product.category_slug === "curtains",
    );

    expect(categories).toContain("curtains");
    expect(curtainProducts.length).toBeGreaterThanOrEqual(10);
    expect(curtainProducts.some((product) => product.is_featured)).toBe(true);
  });

  it("includes sofa by-products", () => {
    const slugs = getMockProducts("en").map((product) => product.category_slug);

    expect(slugs).toContain("cushions");
    expect(slugs).toContain("accessories");
  });

  it("has at least 10 demo products in every category", () => {
    const products = getMockProducts("en");

    for (const category of getMockCategories("en")) {
      const categoryProducts = products.filter(
        (product) => product.category_slug === category.slug,
      );

      expect(categoryProducts.length, category.slug).toBeGreaterThanOrEqual(10);
    }
  });

  it("uses polished remote product images for the expanded demo catalog", () => {
    const products = getMockProducts("en");

    expect(products).toHaveLength(60);
    expect(
      products.every(
        (product) =>
          product.image_url?.startsWith("https://images.unsplash.com/") ||
          product.image_url?.startsWith("/images/wifi-curtains/"),
      ),
    ).toBe(true);
  });

  it("includes wifi smart curtains with six light color variants", () => {
    const product = getMockProducts("en").find(
      (item) => item.slug === "wifi-smart-curtains",
    );

    expect(product).toBeDefined();
    expect(product?.variants).toHaveLength(6);
    expect(
      product?.variants?.every((variant) =>
        variant.image_url?.startsWith("/images/wifi-curtains/"),
      ),
    ).toBe(true);
  });
});