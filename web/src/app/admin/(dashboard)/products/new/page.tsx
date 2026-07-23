import { ProductForm } from "@/components/admin/ProductForm";
import { listAdminCategories } from "@/lib/admin/products";

export default async function AdminNewProductPage() {
  const categories = await listAdminCategories();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
