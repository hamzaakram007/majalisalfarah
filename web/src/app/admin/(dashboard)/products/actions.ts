"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminUser } from "@/lib/auth/admin";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const variantSchema = z.object({
  id: z.string().optional(),
  option_label: z.string().min(1),
  sku: z.string().optional(),
  price_sar: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  image_url: z.string().optional(),
  is_active: z.boolean().optional().default(true),
  sort_order: z.coerce.number().int().default(0),
});

const productSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  category_id: z.string().uuid().nullable().optional(),
  price_sar: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  is_featured: z.coerce.boolean(),
  is_active: z.coerce.boolean(),
  image_url: z.string().optional(),
  name_en: z.string().min(2),
  name_ar: z.string().min(2),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  variants: z.array(variantSchema).optional(),
});

async function requireAdmin() {
  const ok = await isAdminUser();
  if (!ok) throw new Error("Unauthorized");
}

async function db() {
  const client = await createClient();
  if (client) return client;
  const service = await createServiceClient();
  if (!service) throw new Error("Supabase not configured");
  return service;
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const rawVariants = formData.get("variants_json");
  const parsed = productSchema.safeParse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug"),
    category_id: formData.get("category_id") || null,
    price_sar: formData.get("price_sar"),
    stock: formData.get("stock"),
    is_featured: formData.get("is_featured") === "on",
    is_active: formData.get("is_active") === "on",
    image_url: formData.get("image_url") || undefined,
    name_en: formData.get("name_en"),
    name_ar: formData.get("name_ar"),
    description_en: formData.get("description_en") || undefined,
    description_ar: formData.get("description_ar") || undefined,
    variants: rawVariants ? JSON.parse(String(rawVariants)) : [],
  });

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }

  const supabase = await db();
  const input = parsed.data;
  let productId = input.id;

  const productPayload = {
    slug: input.slug,
    category_id: input.category_id || null,
    price_sar: input.price_sar,
    stock: input.stock,
    is_featured: input.is_featured,
    is_active: input.is_active,
    image_url: input.image_url || null,
    updated_at: new Date().toISOString(),
  };

  if (productId) {
    const { error } = await supabase
      .from("products")
      .update(productPayload)
      .eq("id", productId);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert(productPayload)
      .select("id")
      .single();
    if (error) return { ok: false as const, error: error.message };
    productId = data.id;
  }

  const translations = [
    {
      product_id: productId,
      locale: "en",
      name: input.name_en,
      description: input.description_en ?? null,
    },
    {
      product_id: productId,
      locale: "ar",
      name: input.name_ar,
      description: input.description_ar ?? null,
    },
  ];

  await supabase
    .from("product_translations")
    .delete()
    .eq("product_id", productId!);
  await supabase.from("product_translations").insert(translations);

  const variants = input.variants ?? [];
  const existingIds = variants.filter((v) => v.id).map((v) => v.id!);

  if (productId) {
    const { data: current } = await supabase
      .from("product_variants")
      .select("id")
      .eq("product_id", productId);
    const toDelete = (current ?? [])
      .map((v) => v.id)
      .filter((id) => !existingIds.includes(id));
    if (toDelete.length) {
      await supabase.from("product_variants").delete().in("id", toDelete);
    }
  }

  for (const [index, variant] of variants.entries()) {
    const payload = {
      product_id: productId!,
      option_label: variant.option_label,
      sku: variant.sku || null,
      price_sar: variant.price_sar,
      stock: variant.stock,
      image_url: variant.image_url || null,
      is_active: variant.is_active ?? true,
      sort_order: variant.sort_order ?? index,
      attributes: {},
    };
    if (variant.id) {
      await supabase.from("product_variants").update(payload).eq("id", variant.id);
    } else {
      await supabase.from("product_variants").insert(payload);
    }
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
  return { ok: true as const, id: productId };
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  const supabase = await db();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/products");
  return { ok: true as const };
}

export async function toggleProductActiveAction(id: string, isActive: boolean) {
  await requireAdmin();
  const supabase = await db();
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/products");
  return { ok: true as const };
}
