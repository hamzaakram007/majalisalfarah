export const SOCIAL_PLATFORMS = ["facebook", "instagram", "webhook"] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export type SocialPostStatus = "pending" | "posted" | "failed" | "skipped";

export type SocialPostLocale = "en" | "ar" | "both";

export type SocialSettings = {
  enabled: boolean;
  platforms: SocialPlatform[];
  caption_template: string;
  prefer_featured: boolean;
  include_price: boolean;
  post_locale: SocialPostLocale;
};

export type SocialPostRecord = {
  id: string;
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
  posted_at: string | null;
  created_at: string;
};

export type SocialProductCandidate = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  price_sar: number;
  image_url: string | null;
  is_featured: boolean;
};

export type PlatformPostResult = {
  platform: SocialPlatform;
  ok: boolean;
  mock?: boolean;
  externalId?: string;
  error?: string;
};

export const DEFAULT_SOCIAL_SETTINGS: SocialSettings = {
  enabled: false,
  platforms: ["webhook"],
  caption_template:
    "{{name}}\n\n{{description}}\n\n{{price}}\n{{url}}\n\n#MajalisAlfarah #SaudiFurniture #Majlis",
  prefer_featured: true,
  include_price: true,
  post_locale: "both",
};

export function isSocialPlatform(value: string): value is SocialPlatform {
  return (SOCIAL_PLATFORMS as readonly string[]).includes(value);
}
