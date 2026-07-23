import { describe, expect, it } from "vitest";
import { generateOrderNumber } from "./utils";

describe("generateOrderNumber", () => {
  it("starts with MAF prefix", () => {
    expect(generateOrderNumber()).toMatch(/^MAF-/);
  });
});
