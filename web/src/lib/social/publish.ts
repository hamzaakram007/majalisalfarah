import type {
  PlatformPostResult,
  SocialPlatform,
  SocialProductCandidate,
} from "./types";

type PublishPayload = {
  product: SocialProductCandidate;
  caption: string;
  productUrl: string;
  imageUrl: string | null;
};

async function postWebhook(
  payload: PublishPayload,
): Promise<PlatformPostResult> {
  const url = process.env.SOCIAL_WEBHOOK_URL;
  if (!url) {
    console.info("[social webhook mock]", {
      product: payload.product.slug,
      caption: payload.caption.slice(0, 120),
    });
    return { platform: "webhook", ok: true, mock: true };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "majalisalfarah",
      event: "daily_product_post",
      product: {
        id: payload.product.id,
        slug: payload.product.slug,
        name_en: payload.product.name_en,
        name_ar: payload.product.name_ar,
        price_sar: payload.product.price_sar,
        image_url: payload.imageUrl,
        url: payload.productUrl,
      },
      caption: payload.caption,
      posted_at: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      platform: "webhook",
      ok: false,
      error: `Webhook ${res.status}: ${text.slice(0, 200)}`,
    };
  }

  return { platform: "webhook", ok: true };
}

async function postFacebook(
  payload: PublishPayload,
): Promise<PlatformPostResult> {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  const pageId = process.env.META_PAGE_ID;
  if (!token || !pageId) {
    console.info("[social facebook mock]", {
      product: payload.product.slug,
      caption: payload.caption.slice(0, 120),
    });
    return { platform: "facebook", ok: true, mock: true };
  }

  if (!payload.imageUrl) {
    return {
      platform: "facebook",
      ok: false,
      error: "Product image required for Facebook photo posts",
    };
  }

  const body = new URLSearchParams({
    url: payload.imageUrl,
    caption: payload.caption,
    access_token: token,
  });

  const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/photos`, {
    method: "POST",
    body,
  });
  const data = (await res.json().catch(() => ({}))) as {
    id?: string;
    error?: { message?: string };
  };

  if (!res.ok) {
    return {
      platform: "facebook",
      ok: false,
      error: data.error?.message ?? `Facebook ${res.status}`,
    };
  }

  return { platform: "facebook", ok: true, externalId: data.id };
}

async function postInstagram(
  payload: PublishPayload,
): Promise<PlatformPostResult> {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  const igUserId = process.env.META_INSTAGRAM_BUSINESS_ACCOUNT_ID;
  if (!token || !igUserId) {
    console.info("[social instagram mock]", {
      product: payload.product.slug,
      caption: payload.caption.slice(0, 120),
    });
    return { platform: "instagram", ok: true, mock: true };
  }

  if (!payload.imageUrl) {
    return {
      platform: "instagram",
      ok: false,
      error: "Product image required for Instagram posts",
    };
  }

  const createRes = await fetch(
    `https://graph.facebook.com/v21.0/${igUserId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        image_url: payload.imageUrl,
        caption: payload.caption,
        access_token: token,
      }),
    },
  );
  const createData = (await createRes.json().catch(() => ({}))) as {
    id?: string;
    error?: { message?: string };
  };

  if (!createRes.ok || !createData.id) {
    return {
      platform: "instagram",
      ok: false,
      error: createData.error?.message ?? `Instagram create ${createRes.status}`,
    };
  }

  const publishRes = await fetch(
    `https://graph.facebook.com/v21.0/${igUserId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        creation_id: createData.id,
        access_token: token,
      }),
    },
  );
  const publishData = (await publishRes.json().catch(() => ({}))) as {
    id?: string;
    error?: { message?: string };
  };

  if (!publishRes.ok) {
    return {
      platform: "instagram",
      ok: false,
      error:
        publishData.error?.message ?? `Instagram publish ${publishRes.status}`,
    };
  }

  return {
    platform: "instagram",
    ok: true,
    externalId: publishData.id ?? createData.id,
  };
}

export async function publishToPlatforms(
  platforms: SocialPlatform[],
  payload: PublishPayload,
): Promise<PlatformPostResult[]> {
  const results: PlatformPostResult[] = [];
  for (const platform of platforms) {
    if (platform === "webhook") {
      results.push(await postWebhook(payload));
    } else if (platform === "facebook") {
      results.push(await postFacebook(payload));
    } else if (platform === "instagram") {
      results.push(await postInstagram(payload));
    }
  }
  return results;
}
