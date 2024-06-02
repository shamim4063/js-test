import { describe, expect, it } from "vitest";
import { getExchangeRate } from "../src/lib/currency";

describe("getExchangeRate", () => {
  it("should return a number", () => {
    const result = getExchangeRate("USD", "BDT");
    expect(typeof result).toBe("number");
  });
});
