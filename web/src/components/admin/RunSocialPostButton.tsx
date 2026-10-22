"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { runSocialPostNowAction } from "@/app/admin/(dashboard)/social/actions";

export function RunSocialPostButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function runPost() {
    setLoading(true);
    setMessage(null);
    const res = await runSocialPostNowAction();
    setLoading(false);
    setConfirming(false);
    if (res.ok) {
      setMessage(`Posted: ${res.product ?? "product"}`);
      router.refresh();
    } else {
      setMessage(res.error);
    }
  }

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-zinc-700">
          Post one product now using current platform settings?
        </p>
        <button
          type="button"
          disabled={loading}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          onClick={runPost}
        >
          {loading ? "Posting…" : "Yes, post now"}
        </button>
        <button
          type="button"
          disabled={loading}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          onClick={() => setConfirming(false)}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={loading}
        className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 disabled:opacity-50"
        onClick={() => {
          setMessage(null);
          setConfirming(true);
        }}
      >
        Post next product now
      </button>
      {message && <p className="text-sm text-zinc-600">{message}</p>}
    </div>
  );
}
