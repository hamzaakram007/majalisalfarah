import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  DEFAULT_SOCIAL_SETTINGS,
  isSocialPlatform,
  type SocialPlatform,
  type SocialPostLocale,
  type SocialPostRecord,
  type SocialPostStatus,
  type SocialSettings,
} from "./types";

async function getDb() {
  const session = await createClient();
  if (session) return session;
  return createServiceClient();
}

function parsePlatforms(raw: unknown): SocialPlatform[] {
  if (!Array.isArray(raw)) return [...DEFAULT_SOCIAL_SETTINGS.platforms];
  return raw.filter((p): p is SocialPlatform => typeof p === "string" && isSocialPlatform(p));
}

function mapSettings(row: Record<string, unknown> | null): SocialSettings {
  if (!row) return { ...DEFAULT_SOCIAL_SETTINGS };
  return {
    enabled: Boolean(row.enabled),
    platforms: parsePlatforms(row.platforms),
    caption_template:
      typeof row.caption_template === "string" && row.caption_template
        ? row.caption_template
        : DEFAULT_SOCIAL_SETTINGS.caption_template,
    prefer_featured:
      row.prefer_featured === undefined
        ? DEFAULT_SOCIAL_SETTINGS.prefer_featured
        : Boolean(row.prefer_featured),
    include_price:
      row.include_price === undefined
        ? DEFAULT_SOCIAL_SETTINGS.include_price
        : Boolean(row.include_price),
    post_locale:
      row.post_locale === "en" ||
      row.post_locale === "ar" ||
      row.post_locale === "both"
        ? (row.post_locale as SocialPostLocale)
        : DEFAULT_SOCIAL_SETTINGS.post_locale,
  };
}

function mapPost(row: Record<string, unknown>): SocialPostRecord {
  return {
    id: String(row.id),
    product_id: row.product_id ? String(row.product_id) : null,
    product_slug: row.product_slug ? String(row.product_slug) : null,
    product_name: row.product_name ? String(row.product_name) : null,
    platforms: parsePlatforms(row.platforms),
    caption: String(row.caption ?? ""),
    image_url: row.image_url ? String(row.image_url) : null,
    product_url: row.product_url ? String(row.product_url) : null,
    status: (row.status as SocialPostStatus) ?? "pending",
    results:
      row.results && typeof row.results === "object"
        ? (row.results as Record<string, unknown>)
        : {},
    error: row.error ? String(row.error) : null,
    triggered_by: row.triggered_by === "manual" ? "manual" : "cron",
    posted_at: row.posted_at ? String(row.posted_at) : null,
    created_at: String(row.created_at ?? new Date().toISOString()),
  };
}

/** Demo-mode in-process history (resets on cold start). */
const demoHistory: SocialPostRecord[] = [];
let demoSettings: SocialSettings = { ...DEFAULT_SOCIAL_SETTINGS };

export async function getSocialSettings(): Promise<SocialSettings> {
  const supabase = await getDb();
  if (!supabase) return { ...demoSettings };

  const { data, error } = await supabase
    .from("social_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return { ...DEFAULT_SOCIAL_SETTINGS };
  return mapSettings(data as Record<string, unknown>);
}

export async function saveSocialSettings(
  settings: SocialSettings,
): Promise<SocialSettings> {
  const supabase = await getDb();
  if (!supabase) {
    demoSettings = { ...settings };
    return demoSettings;
  }

  const payload = {
    id: 1,
    enabled: settings.enabled,
    platforms: settings.platforms,
    caption_template: settings.caption_template,
    prefer_featured: settings.prefer_featured,
    include_price: settings.include_price,
    post_locale: settings.post_locale,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("social_settings")
    .upsert(payload)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapSettings(data as Record<string, unknown>);
}

export async function listRecentSocialPosts(
  limit = 20,
): Promise<SocialPostRecord[]> {
  const supabase = await getDb();
  if (!supabase) {
    return [...demoHistory]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit);
  }

  const { data, error } = await supabase
    .from("social_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []).map((row) => mapPost(row as Record<string, unknown>));
}

export async function listPostedProductIds(
  sinceDays = 30,
): Promise<Set<string>> {
  const supabase = await getDb();
  if (!supabase) {
    const since = Date.now() - sinceDays * 24 * 60 * 60 * 1000;
    return new Set(
      demoHistory
        .filter(
          (p) =>
            p.status === "posted" &&
            p.product_id &&
            new Date(p.created_at).getTime() >= since,
        )
        .map((p) => p.product_id as string),
    );
  }

  const sinceIso = new Date(
    Date.now() - sinceDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data } = await supabase
    .from("social_posts")
    .select("product_id")
    .eq("status", "posted")
    .gte("created_at", sinceIso)
    .not("product_id", "is", null);

  return new Set(
    (data ?? [])
      .map((row) => row.product_id as string | null)
      .filter((id): id is string => Boolean(id)),
  );
}

export async function insertSocialPost(input: {
  product_id: string | null;
  product_slug: string | null;
  product_name: string | null;
  platforms: SocialPlatform[];
  caption: string;
  image_url: string | null;
  product_url: string | null;
  status: SocialPostStatus;
  results: Record<string, unknown>;
  error: string | null;
  triggered_by: "cron" | "manual";
}): Promise<SocialPostRecord> {
  const now = new Date().toISOString();
  const record: SocialPostRecord = {
    id: crypto.randomUUID(),
    product_id: input.product_id,
    product_slug: input.product_slug,
    product_name: input.product_name,
    platforms: input.platforms,
    caption: input.caption,
    image_url: input.image_url,
    product_url: input.product_url,
    status: input.status,
    results: input.results,
    error: input.error,
    triggered_by: input.triggered_by,
    posted_at: input.status === "posted" ? now : null,
    created_at: now,
  };

  const supabase = await getDb();
  if (!supabase) {
    demoHistory.unshift(record);
    if (demoHistory.length > 100) demoHistory.pop();
    return record;
  }

  const { data, error } = await supabase
    .from("social_posts")
    .insert({
      product_id: input.product_id,
      product_slug: input.product_slug,
      product_name: input.product_name,
      platforms: input.platforms,
      caption: input.caption,
      image_url: input.image_url,
      product_url: input.product_url,
      status: input.status,
      results: input.results,
      error: input.error,
      triggered_by: input.triggered_by,
      posted_at: input.status === "posted" ? now : null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapPost(data as Record<string, unknown>);
}
