import { RunSocialPostButton } from "@/components/admin/RunSocialPostButton";
import { SocialSettingsForm } from "@/components/admin/SocialSettingsForm";
import {
  getSocialSettings,
  listRecentSocialPosts,
} from "@/lib/social/store";
import { pickNextProduct } from "@/lib/social/rotate";

function connectionStatus() {
  return {
    webhook: Boolean(process.env.SOCIAL_WEBHOOK_URL),
    facebook: Boolean(
      process.env.META_PAGE_ACCESS_TOKEN && process.env.META_PAGE_ID,
    ),
    instagram: Boolean(
      process.env.META_PAGE_ACCESS_TOKEN &&
        process.env.META_INSTAGRAM_BUSINESS_ACCOUNT_ID,
    ),
    cron: Boolean(process.env.CRON_SECRET),
  };
}

export default async function AdminSocialPage() {
  const settings = await getSocialSettings();
  const [history, nextProduct] = await Promise.all([
    listRecentSocialPosts(15),
    pickNextProduct(settings),
  ]);
  const connections = connectionStatus();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Social auto-post</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-600">
          Automatically share one catalog product every day to Facebook,
          Instagram, or a Zapier/Make webhook. Without API keys, posts run in
          mock mode and appear in history for testing.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 font-semibold">Daily schedule</h2>
          <SocialSettingsForm initial={settings} />
        </section>

        <div className="space-y-6">
          <section className="rounded-xl border bg-white p-6">
            <h2 className="mb-3 font-semibold">Connections</h2>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>
                Zapier / Make webhook:{" "}
                {connections.webhook ? (
                  <span className="text-emerald-700">configured</span>
                ) : (
                  <span className="text-amber-700">mock (set SOCIAL_WEBHOOK_URL)</span>
                )}
              </li>
              <li>
                Facebook Page:{" "}
                {connections.facebook ? (
                  <span className="text-emerald-700">configured</span>
                ) : (
                  <span className="text-amber-700">
                    mock (META_PAGE_ID + META_PAGE_ACCESS_TOKEN)
                  </span>
                )}
              </li>
              <li>
                Instagram:{" "}
                {connections.instagram ? (
                  <span className="text-emerald-700">configured</span>
                ) : (
                  <span className="text-amber-700">
                    mock (META_INSTAGRAM_BUSINESS_ACCOUNT_ID)
                  </span>
                )}
              </li>
              <li>
                Cron secret:{" "}
                {connections.cron ? (
                  <span className="text-emerald-700">set</span>
                ) : (
                  <span className="text-amber-700">optional in local / required on Vercel</span>
                )}
              </li>
            </ul>
            <p className="mt-4 text-xs text-zinc-500">
              Vercel Cron calls{" "}
              <code className="rounded bg-zinc-100 px-1">/api/cron/social-post</code>{" "}
              daily at 09:00 Asia/Riyadh (06:00 UTC).
            </p>
          </section>

          <section className="rounded-xl border bg-white p-6">
            <h2 className="mb-3 font-semibold">Next up</h2>
            {nextProduct ? (
              <div className="flex gap-4">
                {nextProduct.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={nextProduct.image_url}
                    alt={nextProduct.name_en}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                )}
                <div className="text-sm">
                  <p className="font-medium">{nextProduct.name_en}</p>
                  <p className="text-zinc-500">{nextProduct.name_ar}</p>
                  <p className="mt-1 text-zinc-600">
                    {nextProduct.price_sar} SAR
                    {nextProduct.is_featured ? " · Featured" : ""}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                No active products with images found.
              </p>
            )}
            <div className="mt-4">
              <RunSocialPostButton />
            </div>
          </section>
        </div>
      </div>

      <section className="mt-6 rounded-xl border bg-white p-6">
        <h2 className="mb-4 font-semibold">Recent posts</h2>
        {history.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No posts yet. Enable daily posting or use &quot;Post next product
            now&quot;.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50">
                <tr className="border-b">
                  <th className="px-3 py-2">When</th>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Platforms</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {history.map((post) => (
                  <tr key={post.id} className="border-b align-top">
                    <td className="px-3 py-2 text-zinc-500 whitespace-nowrap">
                      {new Date(post.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <p className="font-medium">
                        {post.product_name ?? post.product_slug ?? "—"}
                      </p>
                      {post.error && (
                        <p className="mt-1 text-xs text-red-600">{post.error}</p>
                      )}
                    </td>
                    <td className="px-3 py-2 capitalize">
                      {post.platforms.join(", ")}
                    </td>
                    <td className="px-3 py-2">
                      {post.status === "posted" ? (
                        <span className="text-emerald-700">Posted</span>
                      ) : post.status === "failed" ? (
                        <span className="text-red-600">Failed</span>
                      ) : (
                        <span className="text-zinc-500">{post.status}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-zinc-500">{post.triggered_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
