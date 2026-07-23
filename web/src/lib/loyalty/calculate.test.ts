import { describe, expect, it } from "vitest";
import {
  canRedeem,
  pointsFromPurchase,
  redemptionDiscount,
} from "./calculate";

const config = { pointsPer100Sar: 1, redeemAt: 200, discountPercent: 10 };

describe("loyalty", () => {
  it("awards points from purchase total", () => {
    expect(pointsFromPurchase(5500, config)).toBe(55);
    expect(pointsFromPurchase(99, config)).toBe(0);
  });

  it("checks redeem eligibility", () => {
    expect(canRedeem(199, config)).toBe(false);
    expect(canRedeem(200, config)).toBe(true);
  });

  it("calculates redemption discount", () => {
    expect(redemptionDiscount(1000, config)).toBe(100);
  });
});
