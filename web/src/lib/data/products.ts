import type { Locale } from "@/lib/i18n/config";
import {
  getMockCategories,
  getMockFeatured,
  getMockProduct,
  getMockProducts,
  type CategoryWithTranslation,
  type ProductWithTranslation,
} from "@/lib/data/mock";
import type {
  ProductImage,
  ProductOptionGroup,
  ProductOptionValue,
  ProductVariant,
} from "@/lib/products/types";
import { createClient } from "@/lib/supabase/server";

type ProductRow = {
  id: string;
  slug: string;
  price_sar: number;
  stock: number;
  is_featured: boolean;
  is_active?: boolean;
  image_url: string | null;
  product_translations:
    | { name: string; description: string | null; locale: string }
    | { name: string; description: string | null; locale: string }[];
  categories: { slug: string } | { slug: string }[] | null;
};

function mapProductRow(
  row: ProductRow,
  locale: Locale,
  extras?: {
    variants?: ProductVariant[];
    option_groups?: ProductOptionGroup[];
    images?: ProductImage[];
  },
): ProductWithTranslation {
  const t = Array.isArray(row.product_translations)
    ? row.product_translations[0]
    : row.product_translations;
  const catRaw = row.categories;
  const cat = Array.isArray(catRaw)
    ? (catRaw[0] as { slug: string } | undefined)
    : (catRaw as { slug: string } | null);
  return {
    id: row.id,
    slug: row.slug,
    price_sar: Number(row.price_sar),
    stock: row.stock,
    is_featured: row.is_featured,
    is_active: row.is_active ?? true,
    image_url: row.image_url,
    name: t?.name ?? row.slug,
    description: t?.description ?? null,
    category_slug: cat?.slug ?? null,
    variants: extras?.variants,
    option_groups: extras?.option_groups,
    images: extras?.images,
  };
}

async function loadVariants(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  productIds: string[],
): Promise<Map<string, ProductVariant[]>> {
  if (!productIds.length) return new Map();
  const { data } = await supabase
    .from("product_variants")
    .select(
      "id, product_id, sku, option_label, price_sar, compare_at_price_sar, stock, image_url, attributes, is_active, sort_order",
    )
    .in("product_id", productIds)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  const map = new Map<string, ProductVariant[]>();
  for (const row of data ?? []) {
    const list = map.get(row.product_id) ?? [];
    list.push({
      id: row.id,
      product_id: row.product_id,
      sku: row.sku,
      option_label: row.option_label,
      price_sar: Number(row.price_sar),
      compare_at_price_sar: row.compare_at_price_sar
        ? Number(row.compare_at_price_sar)
        : null,
      stock: row.stock,
      image_url: row.image_url,
      attributes: (row.attributes as Record<string, string>) ?? {},
      is_active: row.is_active,
      sort_order: row.sort_order,
    });
    map.set(row.product_id, list);
  }
  return map;
}

async function loadOptionGroups(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  productIds: string[],
  locale: Locale,
): Promise<Map<string, ProductOptionGroup[]>> {
  if (!productIds.length) return new Map();
  const { data: groups } = await supabase
    .from("product_option_groups")
    .select(
      `
      id, product_id, group_key, selection_type, is_required, affects_price, is_quote_only, sort_order,
      product_option_group_translations!inner(label, locale),
      product_option_values(
        id, group_id, value_key, price_adjustment_sar, is_active, sort_order,
        product_option_value_translations!inner(label, locale)
      )
    `,
    )
    .in("product_id", productIds)
    .eq("product_option_group_translations.locale", locale)
    .order("sort_order", { ascending: true });

  const map = new Map<string, ProductOptionGroup[]>();
  for (const g of groups ?? []) {
    const gt = Array.isArray(g.product_option_group_translations)
      ? g.product_option_group_translations[0]
      : g.product_option_group_translations;
    const rawValues = g.product_option_values as Array<{
      id: string;
      group_id: string;
      value_key: string;
      price_adjustment_sar: number;
      is_active: boolean;
      sort_order: number;
      product_option_value_translations:
        | { label: string; locale: string }
        | { label: string; locale: string }[];
    }> | null;
    const values: ProductOptionValue[] = (rawValues ?? [])
      .filter((v) => v.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((v) => {
        const vt = Array.isArray(v.product_option_value_translations)
          ? v.product_option_value_translations[0]
          : v.product_option_value_translations;
        return {
          id: v.id,
          group_id: v.group_id,
          value_key: v.value_key,
          price_adjustment_sar: Number(v.price_adjustment_sar),
          label: vt?.label ?? v.value_key,
          sort_order: v.sort_order,
        };
      });
    const group: ProductOptionGroup = {
      id: g.id,
      product_id: g.product_id,
      group_key: g.group_key,
      label: (gt as { label: string })?.label ?? g.group_key,
      selection_type: g.selection_type as "single" | "multi",
      is_required: g.is_required,
      affects_price: g.affects_price,
      is_quote_only: g.is_quote_only,
      sort_order: g.sort_order,
      values,
    };
    const list = map.get(g.product_id) ?? [];
    list.push(group);
    map.set(g.product_id, list);
  }
  return map;
}

async function fromSupabase(
  locale: Locale,
): Promise<ProductWithTranslation[] | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, slug, price_sar, stock, is_featured, is_active, image_url,
      product_translations!inner(name, description, locale),
      categories(slug)
    `,
    )
    .eq("is_active", true)
    .eq("product_translations.locale", locale);

  if (error || !data) return null;

  const ids = data.map((r) => r.id);
  const [variantMap, optionMap] = await Promise.all([
    loadVariants(supabase, ids),
    loadOptionGroups(supabase, ids, locale),
  ]);

  return data.map((row) =>
    mapProductRow(row as ProductRow, locale, {
      variants: variantMap.get(row.id),
      option_groups: optionMap.get(row.id),
    }),
  );
}

async function productFromSupabase(locale: Locale, slug: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, slug, price_sar, stock, is_featured, is_active, image_url,
      product_translations!inner(name, description, locale),
      categories(slug)
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("product_translations.locale", locale)
    .maybeSingle();

  if (error || !data) return null;

  const [variantMap, optionMap] = await Promise.all([
    loadVariants(supabase, [data.id]),
    loadOptionGroups(supabase, [data.id], locale),
  ]);

  return mapProductRow(data as ProductRow, locale, {
    variants: variantMap.get(data.id),
    option_groups: optionMap.get(data.id),
  });
}

async function categoriesFromSupabase(
  locale: Locale,
): Promise<CategoryWithTranslation[] | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id, slug, sort_order,
      category_translations!inner(name, description, locale)
    `,
    )
    .eq("category_translations.locale", locale)
    .order("sort_order", { ascending: true });

  if (error || !data) return null;

  return data.map((row) => {
    const t = Array.isArray(row.category_translations)
      ? row.category_translations[0]
      : row.category_translations;
    return {
      id: row.id,
      slug: row.slug,
      sort_order: row.sort_order ?? 0,
      name: t?.name ?? row.slug,
      description: t?.description ?? null,
    };
  });
}

export async function getProducts(locale: Locale) {
  const remote = await fromSupabase(locale);
  if (!remote) return getMockProducts(locale);

  const categories = getMockCategories(locale);
  const hasCompleteDemoDepth = categories.every((category) => {
    const productCount = remote.filter(
      (product) => product.category_slug === category.slug,
    ).length;
    return productCount >= 10;
  });

  return hasCompleteDemoDepth ? remote : getMockProducts(locale);
}

export async function getCategories(locale: Locale) {
  const remote = await categoriesFromSupabase(locale);
  return remote ?? getMockCategories(locale);
}

export async function getFeaturedProducts(locale: Locale) {
  const all = await getProducts(locale);
  const featured = all.filter((p) => p.is_featured);
  return featured.length ? featured : getMockFeatured(locale);
}

export async function getProduct(locale: Locale, slug: string) {
  const remote = await productFromSupabase(locale, slug);
  if (remote) return remote;
  return getMockProduct(locale, slug);
}

export async function getProductById(locale: Locale, productId: string) {
  const all = await getProducts(locale);
  const found = all.find((p) => p.id === productId);
  if (!found) return null;
  return getProduct(locale, found.slug);
}

export async function getRelatedProducts(
  locale: Locale,
  slug: string,
  limit = 4,
) {
  const product = await getProduct(locale, slug);
  if (!product?.category_slug) return [];
  const all = await getProducts(locale);
  return all
    .filter(
      (p) =>
        p.slug !== slug && p.category_slug === product.category_slug,
    )
    .slice(0, limit);
}
