import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getAdminProductById, listAdminCategories } from "@/lib/admin/products";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    listAdminCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Edit product</h1>
      <p className="mb-6 text-sm text-zinc-500">{product.slug}</p>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
