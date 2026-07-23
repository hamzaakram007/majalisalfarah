import Link from "next/link";
import { listAdminProducts } from "@/lib/admin/products";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await listAdminProducts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          + New product
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50">
            <tr className="border-b">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="px-4 py-3 font-medium">{p.name_en ?? p.slug}</td>
                <td className="px-4 py-3 text-zinc-600">{p.slug}</td>
                <td className="px-4 py-3">{p.category_slug ?? "—"}</td>
                <td className="px-4 py-3">{p.price_sar} SAR</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  {p.is_active ? (
                    <span className="text-emerald-700">Active</span>
                  ) : (
                    <span className="text-zinc-400">Draft</span>
                  )}
                  {p.is_featured && (
                    <span className="ms-2 text-xs text-amber-700">★</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-emerald-700 hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton id={p.id} slug={p.slug} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-zinc-500">
        Variants and quote-only options are managed per product on the edit screen.
        Category-specific quote fields remain on the customizer.
      </p>
    </div>
  );
}
