"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveProductAction } from "@/app/admin/(dashboard)/products/actions";
import { Button } from "@/components/ui/Button";
import type { AdminProductRow } from "@/lib/admin/products";

type VariantDraft = {
  id?: string;
  option_label: string;
  sku?: string;
  price_sar: number;
  stock: number;
  image_url?: string;
};

export function ProductForm({
  product,
  categories,
}: {
  product?: AdminProductRow;
  categories: { id: string; slug: string; name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [variants, setVariants] = useState<VariantDraft[]>(
    (product?.variants ?? []).map((v) => ({
      id: v.id,
      option_label: v.option_label,
      sku: v.sku ?? undefined,
      price_sar: v.price_sar,
      stock: v.stock,
      image_url: v.image_url ?? undefined,
    })),
  );

  async function uploadImage(file: File) {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    setImageUrl(data.url);
  }

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      {
        option_label: "",
        price_sar: product?.price_sar ?? 0,
        stock: 0,
      },
    ]);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    form.set("image_url", imageUrl);
    form.set("variants_json", JSON.stringify(variants));
    const result = await saveProductAction(form);
    setLoading(false);
    if (!result.ok) {
      setError(
        typeof result.error === "string"
          ? result.error
          : "Validation failed",
      );
      return;
    }
    router.push(`/admin/products/${result.id}/edit`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Slug
          <input
            name="slug"
            required
            defaultValue={product?.slug}
            pattern="[a-z0-9-]+"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Category
          <select
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.slug})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Name (EN)
          <input
            name="name_en"
            required
            defaultValue={product?.name_en}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Name (AR)
          <input
            name="name_ar"
            required
            defaultValue={product?.name_ar}
            className="mt-1 w-full rounded border px-3 py-2"
            dir="rtl"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Description (EN)
          <textarea
            name="description_en"
            rows={3}
            defaultValue={product?.description_en}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Description (AR)
          <textarea
            name="description_ar"
            rows={3}
            defaultValue={product?.description_ar}
            className="mt-1 w-full rounded border px-3 py-2"
            dir="rtl"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          Base price (SAR)
          <input
            name="price_sar"
            type="number"
            step="0.01"
            required
            defaultValue={product?.price_sar ?? 0}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Base stock
          <input
            name="stock"
            type="number"
            required
            defaultValue={product?.stock ?? 0}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
        <div className="flex flex-col justify-end gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              name="is_featured"
              type="checkbox"
              defaultChecked={product?.is_featured}
            />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input
              name="is_active"
              type="checkbox"
              defaultChecked={product?.is_active ?? true}
            />
            Active / published
          </label>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold">Product image</p>
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Product"
            className="mt-2 h-32 w-32 rounded object-cover"
          />
        )}
        <input
          type="file"
          accept="image/*"
          className="mt-2 block text-sm"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              await uploadImage(file);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload failed");
            }
          }}
        />
      </div>

      <fieldset className="rounded-xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <legend className="text-sm font-bold">Color / size variants</legend>
          <button
            type="button"
            onClick={addVariant}
            className="text-sm text-emerald-700 hover:underline"
          >
            + Add variant
          </button>
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Use variants when a product has multiple colors or finishes. Each variant has its own price and stock.
        </p>
        <div className="mt-4 space-y-3">
          {variants.map((v, i) => (
            <div
              key={v.id ?? i}
              className="grid gap-2 rounded-lg border p-3 sm:grid-cols-4"
            >
              <input
                placeholder="Label (e.g. Olive)"
                value={v.option_label}
                onChange={(e) => {
                  const next = [...variants];
                  next[i] = { ...next[i], option_label: e.target.value };
                  setVariants(next);
                }}
                className="rounded border px-2 py-1 text-sm"
              />
              <input
                placeholder="SKU"
                value={v.sku ?? ""}
                onChange={(e) => {
                  const next = [...variants];
                  next[i] = { ...next[i], sku: e.target.value };
                  setVariants(next);
                }}
                className="rounded border px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="Price"
                value={v.price_sar}
                onChange={(e) => {
                  const next = [...variants];
                  next[i] = {
                    ...next[i],
                    price_sar: Number(e.target.value),
                  };
                  setVariants(next);
                }}
                className="rounded border px-2 py-1 text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => {
                    const next = [...variants];
                    next[i] = {
                      ...next[i],
                      stock: Number(e.target.value),
                    };
                    setVariants(next);
                  }}
                  className="w-full rounded border px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  className="text-xs text-red-600"
                  onClick={() =>
                    setVariants((prev) => prev.filter((_, j) => j !== i))
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : product ? "Update product" : "Create product"}
      </Button>
    </form>
  );
}
