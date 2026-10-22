"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminUser } from "@/lib/auth/admin";
import { runDailySocialPost } from "@/lib/social/run-daily";
import { saveSocialSettings } from "@/lib/social/store";
import {
  SOCIAL_PLATFORMS,
  type SocialPlatform,
  type SocialSettings,
} from "@/lib/social/types";

async function requireAdmin() {
  const ok = await isAdminUser();
  if (!ok) throw new Error("Unauthorized");
}

const settingsSchema = z.object({
  enabled: z.boolean(),
  platforms: z.array(z.enum(SOCIAL_PLATFORMS)).min(1),
  caption_template: z.string().min(3).max(2200),
  prefer_featured: z.boolean(),
  include_price: z.boolean(),
  post_locale: z.enum(["en", "ar", "both"]),
});

export async function saveSocialSettingsAction(formData: FormData) {
  await requireAdmin();

  const platforms = formData.getAll("platforms").map(String) as SocialPlatform[];
  const parsed = settingsSchema.safeParse({
    enabled: formData.get("enabled") === "on",
    platforms,
    caption_template: formData.get("caption_template"),
    prefer_featured: formData.get("prefer_featured") === "on",
    include_price: formData.get("include_price") === "on",
    post_locale: formData.get("post_locale") || "both",
  });

  if (!parsed.success) {
    return { ok: false as const, error: "Invalid settings. Check platforms and caption." };
  }

  const settings: SocialSettings = parsed.data;
  await saveSocialSettings(settings);
  revalidatePath("/admin/social");
  return { ok: true as const };
}

export async function runSocialPostNowAction() {
  await requireAdmin();
  const result = await runDailySocialPost({
    triggeredBy: "manual",
    force: true,
  });
  revalidatePath("/admin/social");
  if (!result.ok && result.skipped) {
    return { ok: false as const, error: result.reason ?? "Skipped" };
  }
  if (!result.ok) {
    return { ok: false as const, error: result.reason ?? "Post failed" };
  }
  return {
    ok: true as const,
    product: result.post?.product_name ?? result.post?.product_slug,
  };
}
