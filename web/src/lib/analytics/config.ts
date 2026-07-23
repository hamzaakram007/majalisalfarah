export const analyticsConfig = {
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "",
};

export function isAnalyticsActive() {
  const { enabled, gaMeasurementId, googleAdsId, metaPixelId, tiktokPixelId } =
    analyticsConfig;
  if (!enabled) return false;
  return Boolean(
    gaMeasurementId || googleAdsId || metaPixelId || tiktokPixelId,
  );
}
