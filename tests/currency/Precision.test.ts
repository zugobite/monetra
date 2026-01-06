import { describe, it, expect } from "vitest";
import { getMinorUnitExponent } from "../../src/currency/precision";
import { USD } from "../../src/currency/iso4217";

describe("Precision", () => {
  it("should get precision for currency", () => {
    // getMinorUnitExponent returns 10^decimals, so for USD (2 decimals), 10^2 = 100
    expect(getMinorUnitExponent(USD)).toBe(100n);
  });
});
