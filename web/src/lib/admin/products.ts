import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { ProductOptionGroup, ProductVariant } from "@/lib/products/types";

export type AdminProductRow = {
  id: string;
  slug: string;
  price_sar: number;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  image_url: string | null;
  category_id: string | null;
  name_en?: string;
  name_ar?: string;
  description_en?: string;
  description_ar?: string;
  category_slug?: string | null;
  variants?: ProductVariant[];
  option_groups?: ProductOptionGroup[];
};

async function getAdminClient() {
  const sessionClient = await createClient();
  if (sessionClient) return sessionClient;
  return createServiceClient();
}

export async function listAdminProducts(): Promise<AdminProductRow[]> {
  const supabase = await getAdminClient();
  if (!supabase) {
    const { getMockProducts } = await import("@/lib/data/mock");
    return getMockProducts("en").map((p) => ({
      id: p.id,
      slug: p.slug,
      price_sar: p.price_sar,
      stock: p.stock,
      is_featured: p.is_featured,
      is_active: p.is_active ?? true,
      image_url: p.image_url,
      category_id: null,
      name_en: p.name,
      category_slug: p.category_slug,
    }));
  }

  const { data } = await supabase
    .from("products")
    .select(
      `
      id, slug, price_sar, stock, is_featured, is_active, image_url, category_id,
      product_translations(name, description, locale),
      categories(slug)
    `,
    )
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => {
    const translations = Array.isArray(row.product_translations)
      ? row.product_translations
      : row.product_translations
        ? [row.product_translations]
        : [];
    const en = translations.find((t: { locale: string }) => t.locale === "en");
    const ar = translations.find((t: { locale: string }) => t.locale === "ar");
    const cat = Array.isArray(row.categories)
      ? row.categories[0]
      : row.categories;
    return {
      id: row.id,
      slug: row.slug,
      price_sar: Number(row.price_sar),
      stock: row.stock,
      is_featured: row.is_featured,
      is_active: row.is_active,
      image_url: row.image_url,
      category_id: row.category_id,
      name_en: en?.name,
      name_ar: ar?.name,
      description_en: en?.description,
      description_ar: ar?.description,
      category_slug: (cat as { slug: string } | null)?.slug ?? null,
    };
  });
}

export async function getAdminProductById(
  id: string,
): Promise<AdminProductRow | null> {
  const supabase = await getAdminClient();
  if (!supabase) {
    const { getMockProducts } = await import("@/lib/data/mock");
    const p = getMockProducts("en").find((x) => x.id === id);
    if (!p) return null;
    return {
      id: p.id,
      slug: p.slug,
      price_sar: p.price_sar,
      stock: p.stock,
      is_featured: p.is_featured,
      is_active: true,
      image_url: p.image_url,
      category_id: null,
      name_en: p.name,
      variants: p.variants,
      option_groups: p.option_groups,
      category_slug: p.category_slug,
    };
  }

  const { data: row } = await supabase
    .from("products")
    .select(
      `
      id, slug, price_sar, stock, is_featured, is_active, image_url, category_id,
      product_translations(name, description, locale),
      categories(slug)
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (!row) return null;

  const { data: variants } = await supabase
    .from("product_variants")
    .select(
      "id, product_id, sku, option_label, price_sar, compare_at_price_sar, stock, image_url, attributes, is_active, sort_order",
    )
    .eq("product_id", id)
    .order("sort_order");

  const translations = Array.isArray(row.product_translations)
    ? row.product_translations
    : row.product_translations
      ? [row.product_translations]
      : [];
  const en = translations.find((t: { locale: string }) => t.locale === "en");
  const ar = translations.find((t: { locale: string }) => t.locale === "ar");

  return {
    id: row.id,
    slug: row.slug,
    price_sar: Number(row.price_sar),
    stock: row.stock,
    is_featured: row.is_featured,
    is_active: row.is_active,
    image_url: row.image_url,
    category_id: row.category_id,
    name_en: en?.name,
    name_ar: ar?.name,
    description_en: en?.description ?? undefined,
    description_ar: ar?.description ?? undefined,
    category_slug:
      (
        (Array.isArray(row.categories)
          ? row.categories[0]
          : row.categories) as { slug: string } | null
      )?.slug ?? null,
    variants: (variants ?? []).map((v) => ({
      id: v.id,
      product_id: v.product_id,
      sku: v.sku,
      option_label: v.option_label,
      price_sar: Number(v.price_sar),
      compare_at_price_sar: v.compare_at_price_sar
        ? Number(v.compare_at_price_sar)
        : null,
      stock: v.stock,
      image_url: v.image_url,
      attributes: (v.attributes as Record<string, string>) ?? {},
      is_active: v.is_active,
      sort_order: v.sort_order,
    })),
  };
}

export async function listAdminCategories() {
  const supabase = await getAdminClient();
  if (!supabase) {
    const { getMockCategories } = await import("@/lib/data/mock");
    return getMockCategories("en").map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
    }));
  }
  const { data } = await supabase
    .from("categories")
    .select("id, slug, category_translations(name, locale)")
    .order("sort_order");
  return (data ?? []).map((c) => {
    const t = Array.isArray(c.category_translations)
      ? c.category_translations.find((x: { locale: string }) => x.locale === "en")
      : c.category_translations;
    return { id: c.id, slug: c.slug, name: (t as { name: string })?.name ?? c.slug };
  });
}
