"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSocialSettingsAction } from "@/app/admin/(dashboard)/social/actions";
import {
  SOCIAL_PLATFORMS,
  type SocialSettings,
} from "@/lib/social/types";

export function SocialSettingsForm({
  initial,
}: {
  initial: SocialSettings;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        const form = new FormData(e.currentTarget);
        const res = await saveSocialSettingsAction(form);
        setSaving(false);
        if (res.ok) {
          setMessage("Settings saved.");
          router.refresh();
        } else {
          setMessage(res.error);
        }
      }}
    >
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="enabled"
          defaultChecked={initial.enabled}
          className="size-4 rounded border-zinc-300"
        />
        Enable daily automatic posting
      </label>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Platforms</legend>
        <div className="flex flex-wrap gap-4 text-sm">
          {SOCIAL_PLATFORMS.map((platform) => (
            <label key={platform} className="flex items-center gap-2 capitalize">
              <input
                type="checkbox"
                name="platforms"
                value={platform}
                defaultChecked={initial.platforms.includes(platform)}
                className="size-4 rounded border-zinc-300"
              />
              {platform === "webhook" ? "Zapier / Make webhook" : platform}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm">
        <span className="font-medium">Caption template</span>
        <textarea
          name="caption_template"
          rows={7}
          defaultValue={initial.caption_template}
          className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-xs"
        />
        <span className="mt-1 block text-xs text-zinc-500">
          Placeholders: {"{{name}}"}, {"{{description}}"}, {"{{price}}"},{" "}
          {"{{url}}"}, {"{{slug}}"}
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Caption language</span>
          <select
            name="post_locale"
            defaultValue={initial.post_locale}
            className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2"
          >
            <option value="both">English + Arabic</option>
            <option value="en">English only</option>
            <option value="ar">Arabic only</option>
          </select>
        </label>

        <div className="space-y-3 self-end text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="prefer_featured"
              defaultChecked={initial.prefer_featured}
              className="size-4 rounded border-zinc-300"
            />
            Prefer featured products
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="include_price"
              defaultChecked={initial.include_price}
              className="size-4 rounded border-zinc-300"
            />
            Include price in caption
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
        {message && <p className="text-sm text-zinc-600">{message}</p>}
      </div>
    </form>
  );
}
