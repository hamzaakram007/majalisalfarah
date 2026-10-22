import { listAdminProducts } from "@/lib/admin/products";
import { listPostedProductIds } from "./store";
import type { SocialProductCandidate, SocialSettings } from "./types";

function toCandidate(
  p: Awaited<ReturnType<typeof listAdminProducts>>[number],
): SocialProductCandidate | null {
  if (!p.is_active) return null;
  if (!p.image_url) return null;
  return {
    id: p.id,
    slug: p.slug,
    name_en: p.name_en ?? p.slug,
    name_ar: p.name_ar ?? p.name_en ?? p.slug,
    description_en: p.description_en ?? null,
    description_ar: p.description_ar ?? null,
    price_sar: p.price_sar,
    image_url: p.image_url,
    is_featured: p.is_featured,
  };
}

export async function pickNextProduct(
  settings: SocialSettings,
): Promise<SocialProductCandidate | null> {
  const [products, postedIds] = await Promise.all([
    listAdminProducts(),
    listPostedProductIds(45),
  ]);

  const candidates = products
    .map(toCandidate)
    .filter((p): p is SocialProductCandidate => Boolean(p));

  if (!candidates.length) return null;

  const unposted = candidates.filter((p) => !postedIds.has(p.id));
  const pool = unposted.length ? unposted : candidates;

  if (settings.prefer_featured) {
    const featured = pool.filter((p) => p.is_featured);
    if (featured.length) {
      return featured[Math.floor(Math.random() * featured.length)] ?? null;
    }
  }

  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}
