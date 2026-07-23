import { getAdminQuotes } from "@/lib/admin/data";
import { QuoteStatusSelect } from "@/components/admin/QuoteStatusSelect";

export default async function AdminQuotesPage() {
  const quotes = await getAdminQuotes();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Quote Requests</h1>
      {quotes.length === 0 ? (
        <p className="text-zinc-500">No quotes yet.</p>
      ) : (
        <ul className="space-y-4">
          {quotes.map((q) => (
            <li key={q.id} className="rounded-lg border bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{q.customer_name}</p>
                  <p className="text-sm text-zinc-600">{q.customer_phone}</p>
                  {q.customer_email && (
                    <p className="text-sm text-zinc-600">{q.customer_email}</p>
                  )}
                </div>
                <QuoteStatusSelect quoteId={q.id} currentStatus={q.status} />
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-xs font-semibold uppercase text-zinc-500">
                    Size
                  </dt>
                  <dd>{q.sofa_size || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-zinc-500">
                    Fabric
                  </dt>
                  <dd>{q.fabric_color || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-zinc-500">
                    Foam
                  </dt>
                  <dd>{q.foam_type || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-zinc-500">
                    City
                  </dt>
                  <dd>{q.delivery_city || "—"}</dd>
                </div>
              </dl>

              {q.dimensions && (
                <p className="mt-3 text-sm">
                  <span className="font-semibold">Dimensions:</span>{" "}
                  {q.dimensions}
                </p>
              )}
              {q.notes && (
                <pre className="mt-3 whitespace-pre-wrap rounded bg-zinc-50 p-3 text-xs leading-5 text-zinc-700">
                  {q.notes}
                </pre>
              )}
              <p className="mt-3 text-xs text-zinc-500">
                Created {new Date(q.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
