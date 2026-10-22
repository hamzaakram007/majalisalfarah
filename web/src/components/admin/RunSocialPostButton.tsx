"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { runSocialPostNowAction } from "@/app/admin/(dashboard)/social/actions";

export function RunSocialPostButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={loading}
        className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
        onClick={async () => {
          if (
            !confirm(
              "Post one product to social media now? This uses your current platform settings.",
            )
          ) {
            return;
          }
          setLoading(true);
          setMessage(null);
          const res = await runSocialPostNowAction();
          setLoading(false);
          if (res.ok) {
            setMessage(`Posted: ${res.product ?? "product"}`);
            router.refresh();
          } else {
            setMessage(res.error);
          }
        }}
      >
        {loading ? "Posting…" : "Post next product now"}
      </button>
      {message && <p className="text-sm text-zinc-600">{message}</p>}
    </div>
  );
}
