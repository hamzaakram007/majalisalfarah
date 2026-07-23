export type LoyaltyConfig = {
  pointsPer100Sar: number;
  redeemAt: number;
  discountPercent: number;
};

export function pointsFromPurchase(
  totalSar: number,
  config: LoyaltyConfig,
): number {
  return Math.floor(totalSar / 100) * config.pointsPer100Sar;
}

export function canRedeem(points: number, config: LoyaltyConfig): boolean {
  return points >= config.redeemAt;
}

export function redemptionDiscount(
  subtotalSar: number,
  config: LoyaltyConfig,
): number {
  return (subtotalSar * config.discountPercent) / 100;
}
