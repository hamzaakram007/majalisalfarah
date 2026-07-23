"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function CallbackPage() {
  const params = useParams();
  const locale = (isLocale(params.locale as string)
    ? params.locale
    : "en") as Locale;
  const dict = getDictionary(locale);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        name: form.get("name"),
        phone: form.get("phone"),
        preferredTime: form.get("time"),
        message: form.get("message"),
      }),
    });
    setLoading(false);
    setDone(true);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">{dict.callback.title}</h1>
      {done ? (
        <p className="text-emerald-700">{dict.callback.success}</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="name"
            required
            placeholder={dict.callback.name}
            className="w-full rounded-lg border px-3 py-2"
          />
          <input
            name="phone"
            required
            placeholder={dict.callback.phone}
            className="w-full rounded-lg border px-3 py-2"
          />
          <input
            name="time"
            placeholder={dict.callback.time}
            className="w-full rounded-lg border px-3 py-2"
          />
          <textarea
            name="message"
            placeholder={dict.callback.message}
            className="w-full rounded-lg border px-3 py-2"
            rows={4}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {dict.callback.submit}
          </Button>
        </form>
      )}
    </div>
  );
}
