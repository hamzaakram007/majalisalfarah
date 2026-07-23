import { getAdminPayments } from "@/lib/admin/data";

export default async function AdminPaymentsPage() {
  const payments = await getAdminPayments();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Payments</h1>
      {payments.length === 0 ? (
        <p className="text-zinc-500">No payment records yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Amount</th>
              <th>Status</th>
              <th>Provider</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2">{p.amount_sar} SAR</td>
                <td className="capitalize">{p.status}</td>
                <td>{p.provider}</td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
