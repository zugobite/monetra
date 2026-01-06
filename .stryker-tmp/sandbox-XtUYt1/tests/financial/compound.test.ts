// @ts-nocheck
import { describe, it, expect } from "vitest";
import { futureValue, presentValue } from "../../src/financial/compound";
import { Money } from "../../src/money/Money";
import { USD } from "../../src/currency/iso4217";

describe("Financial - Compound Interest", () => {
  it("should calculate future value", () => {
    const pv = Money.fromMajor("1000.00", USD);
    const fv = futureValue(pv, {
      rate: 0.05,
      years: 10,
      compoundingPerYear: 1, // Annual compounding
    });

    // 1000 * (1.05)^10 = 1628.89
    expect(fv.format()).toBe("$1,628.89");
  });

  it("should calculate present value", () => {
    const fv = Money.fromMajor("1628.89", USD);
    const pv = presentValue(fv, {
      rate: 0.05,
      years: 10,
      compoundingPerYear: 1,
    });

    // Should be close to 1000.00
    expect(pv.format()).toBe("$1,000.00");
  });
});
