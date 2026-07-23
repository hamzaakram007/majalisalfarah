import { getAdminStats } from "@/lib/admin/data";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Orders", value: stats.orders },
    { label: "Revenue (SAR)", value: stats.revenue.toLocaleString() },
    { label: "Quote Requests", value: stats.quotes },
    { label: "Callbacks", value: stats.callbacks },
    { label: "Products", value: stats.products },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-zinc-500">{c.label}</p>
            <p className="mt-2 text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-zinc-500">
        Loyalty: {stats.loyalty?.pointsPer100Sar ?? 1} pt / 100 SAR · redeem at{" "}
        {stats.loyalty?.redeemAt ?? 200} pts
      </p>
    </div>
  );
}
