import { getAdminOrders } from "@/lib/admin/data";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-zinc-500">No orders yet. Connect Supabase and run migrations.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Order #</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="py-2 font-mono">{o.order_number}</td>
                <td>{o.customer_name}</td>
                <td>{o.total_sar} SAR</td>
                <td className="capitalize">{o.status}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
