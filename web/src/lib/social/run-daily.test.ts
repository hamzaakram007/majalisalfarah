import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./store", () => ({
  getSocialSettings: vi.fn(),
  insertSocialPost: vi.fn(async (input) => ({
    id: "post-1",
    ...input,
    posted_at: input.status === "posted" ? new Date().toISOString() : null,
    created_at: new Date().toISOString(),
  })),
}));

vi.mock("./rotate", () => ({
  pickNextProduct: vi.fn(),
}));

vi.mock("./publish", () => ({
  publishToPlatforms: vi.fn(async (platforms: string[]) =>
    platforms.map((platform) => ({ platform, ok: true, mock: true })),
  ),
}));

import { getSocialSettings, insertSocialPost } from "./store";
import { pickNextProduct } from "./rotate";
import { runDailySocialPost } from "./run-daily";

describe("runDailySocialPost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("skips when disabled unless forced", async () => {
    vi.mocked(getSocialSettings).mockResolvedValue({
      enabled: false,
      platforms: ["webhook"],
      caption_template: "{{name}} {{url}}",
      prefer_featured: true,
      include_price: true,
      post_locale: "en",
    });

    const skipped = await runDailySocialPost({ triggeredBy: "cron" });
    expect(skipped.skipped).toBe(true);
    expect(insertSocialPost).not.toHaveBeenCalled();

    vi.mocked(pickNextProduct).mockResolvedValue({
      id: "p1",
      slug: "sofa",
      name_en: "Sofa",
      name_ar: "كنبة",
      description_en: "Nice",
      description_ar: null,
      price_sar: 1000,
      image_url: "https://example.com/a.jpg",
      is_featured: true,
    });

    const forced = await runDailySocialPost({
      triggeredBy: "manual",
      force: true,
    });
    expect(forced.ok).toBe(true);
    expect(forced.post?.product_slug).toBe("sofa");
    expect(insertSocialPost).toHaveBeenCalledOnce();
  });
});
