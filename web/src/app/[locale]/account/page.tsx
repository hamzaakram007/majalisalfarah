"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function AccountPage() {
  const params = useParams();
  const locale = (isLocale(params.locale as string)
    ? params.locale
    : "en") as Locale;
  const dict = getDictionary(locale);
  const [email, setEmail] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signedin">("signin");

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? null);
        setMode("signedin");
      }
    });
  }, []);

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;
    const form = new FormData(e.currentTarget);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.get("email") as string,
      password: form.get("password") as string,
    });
    if (!error && data.user) {
      setEmail(data.user.email ?? null);
      setMode("signedin");
    }
  }

  async function signOut() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setEmail(null);
    setMode("signin");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">{dict.account.title}</h1>
      {mode === "signedin" ? (
        <div>
          <p className="text-zinc-600">{email}</p>
          <Button type="button" className="mt-4" onClick={signOut}>
            {dict.account.signOut}
          </Button>
          <p className="mt-6 text-sm">
            <a href={`/${locale}/orders`} className="text-emerald-700 underline">
              {dict.account.orders}
            </a>
          </p>
        </div>
      ) : (
        <form onSubmit={signIn} className="space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder={dict.account.email}
            className="w-full rounded-lg border px-3 py-2"
          />
          <input
            name="password"
            type="password"
            required
            placeholder={dict.account.password}
            className="w-full rounded-lg border px-3 py-2"
          />
          <Button type="submit" className="w-full">
            {dict.account.signIn}
          </Button>
          {!createClient() && (
            <p className="text-xs text-zinc-500">
              Configure Supabase in .env.local for customer accounts.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
