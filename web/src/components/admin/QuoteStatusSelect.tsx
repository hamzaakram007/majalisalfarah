"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  quoteStatuses,
  updateQuoteStatusAction,
} from "@/app/admin/(dashboard)/quotes/actions";

export function QuoteStatusSelect({
  quoteId,
  currentStatus,
}: {
  quoteId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  return (
    <label className="block text-xs font-semibold text-zinc-500">
      Status
      <select
        value={status}
        disabled={saving}
        className="mt-1 block rounded border px-2 py-1 text-sm font-normal text-zinc-900"
        onChange={async (event) => {
          const next = event.target.value as (typeof quoteStatuses)[number];
          setStatus(next);
          setSaving(true);
          const result = await updateQuoteStatusAction(quoteId, next);
          setSaving(false);
          if (!result.ok) {
            alert(result.error);
            setStatus(currentStatus);
            return;
          }
          router.refresh();
        }}
      >
        {quoteStatuses.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
