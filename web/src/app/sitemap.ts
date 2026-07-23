import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getMockProducts, getMockBlogPosts } from "@/lib/data/mock";
import { getSiteUrl } from "@/lib/seo/site";
import { policySlugs } from "@/lib/policies";

const staticPaths = [
  "",
  "products",
  "customizer",
  "gallery",
  "blog",
  "loyalty",
  "callback",
  "location",
  "cart",
  "checkout",
  "account",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path ? `/${path}` : ""}`,
        lastModified: now,
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : path === "products" ? 0.9 : 0.7,
        alternates: {
          languages: {
            en: `${base}/en${path ? `/${path}` : ""}`,
            ar: `${base}/ar${path ? `/${path}` : ""}`,
          },
        },
      });
    }

    for (const slug of policySlugs) {
      entries.push({
        url: `${base}/${locale}/policies/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: {
          languages: {
            en: `${base}/en/policies/${slug}`,
            ar: `${base}/ar/policies/${slug}`,
          },
        },
      });
    }

    for (const product of getMockProducts(locale)) {
      entries.push({
        url: `${base}/${locale}/products/${product.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            en: `${base}/en/products/${product.slug}`,
            ar: `${base}/ar/products/${product.slug}`,
          },
        },
      });
    }

    for (const post of getMockBlogPosts(locale)) {
      entries.push({
        url: `${base}/${locale}/blog/${post.slug}`,
        lastModified: post.published_at
          ? new Date(post.published_at)
          : now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
