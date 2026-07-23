import { getAdminCallbacks } from "@/lib/admin/data";

export default async function AdminCallbacksPage() {
  const callbacks = await getAdminCallbacks();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Callback Requests</h1>
      {callbacks.length === 0 ? (
        <p className="text-zinc-500">No callbacks yet.</p>
      ) : (
        <ul className="space-y-4">
          {callbacks.map((c) => (
            <li key={c.id} className="rounded-lg border bg-white p-4">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm">{c.phone}</p>
              <p className="text-sm text-zinc-600">{c.message}</p>
              <p className="text-xs text-zinc-400">
                {c.handled ? "Handled" : "Pending"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
