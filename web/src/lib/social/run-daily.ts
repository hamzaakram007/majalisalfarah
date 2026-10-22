import { buildProductUrl, renderCaptionTemplate } from "./captions";
import { publishToPlatforms } from "./publish";
import { getSocialSettings, insertSocialPost } from "./store";
import { pickNextProduct } from "./rotate";
import type { SocialPostRecord, SocialSettings } from "./types";

export type DailySocialRunResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  post?: SocialPostRecord;
  settings: SocialSettings;
};

export async function runDailySocialPost(options: {
  triggeredBy: "cron" | "manual";
  force?: boolean;
}): Promise<DailySocialRunResult> {
  const settings = await getSocialSettings();

  if (!settings.enabled && !options.force) {
    return {
      ok: true,
      skipped: true,
      reason: "Daily social posting is disabled in admin settings",
      settings,
    };
  }

  if (!settings.platforms.length) {
    return {
      ok: false,
      skipped: true,
      reason: "No platforms selected",
      settings,
    };
  }

  const product = await pickNextProduct(settings);
  if (!product) {
    return {
      ok: false,
      skipped: true,
      reason: "No active products with images available to post",
      settings,
    };
  }

  const caption = renderCaptionTemplate(settings.caption_template, product, {
    locale: settings.post_locale,
    includePrice: settings.include_price,
  });
  const productUrl = buildProductUrl(product.slug, "en");

  const platformResults = await publishToPlatforms(settings.platforms, {
    product,
    caption,
    productUrl,
    imageUrl: product.image_url,
  });

  const allOk = platformResults.every((r) => r.ok);
  const anyOk = platformResults.some((r) => r.ok);
  const status = allOk ? "posted" : anyOk ? "posted" : "failed";
  const error = allOk
    ? null
    : platformResults
        .filter((r) => !r.ok)
        .map((r) => `${r.platform}: ${r.error ?? "failed"}`)
        .join("; ");

  const post = await insertSocialPost({
    product_id: product.id,
    product_slug: product.slug,
    product_name: product.name_en,
    platforms: settings.platforms,
    caption,
    image_url: product.image_url,
    product_url: productUrl,
    status,
    results: Object.fromEntries(
      platformResults.map((r) => [
        r.platform,
        {
          ok: r.ok,
          mock: r.mock ?? false,
          externalId: r.externalId,
          error: r.error,
        },
      ]),
    ),
    error,
    triggered_by: options.triggeredBy,
  });

  return {
    ok: status === "posted",
    post,
    settings,
    reason: error ?? undefined,
  };
}
