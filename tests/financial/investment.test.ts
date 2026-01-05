import { describe, it, expect } from "vitest";
import { npv, irr, roi } from "../../src/financial/investment";
import { Money } from "../../src/money/Money";
import { USD, EUR } from "../../src/currency/iso4217";

describe("Financial - Investment", () => {
  it("should calculate ROI", () => {
    const initial = Money.fromMajor("1000.00", USD);
    const final = Money.fromMajor("1150.00", USD);
    expect(roi(initial, final)).toBe(0.15);
  });

  it("should calculate negative ROI", () => {
    const initial = Money.fromMajor("1000.00", USD);
    const final = Money.fromMajor("800.00", USD);
    expect(roi(initial, final)).toBe(-0.2);
  });

  it("should calculate zero ROI", () => {
    const initial = Money.fromMajor("1000.00", USD);
    const final = Money.fromMajor("1000.00", USD);
    expect(roi(initial, final)).toBe(0);
  });

  it("should throw error for currency mismatch in ROI", () => {
    const initial = Money.fromMajor("1000.00", USD);
    const final = Money.fromMajor("1150.00", EUR);
    expect(() => roi(initial, final)).toThrow(/Currency mismatch/);
  });

  it("should calculate NPV", () => {
    const cashFlows = [
      Money.fromMajor("-1000.00", USD), // Initial investment
      Money.fromMajor("200.00", USD),
      Money.fromMajor("300.00", USD),
      Money.fromMajor("500.00", USD),
      Money.fromMajor("500.00", USD),
    ];

    const result = npv(0.1, cashFlows); // 10% discount rate

    // -1000 + 200/1.1 + 300/1.21 + 500/1.331 + 500/1.4641
    // -1000 + 181.82 + 247.93 + 375.66 + 341.51 = 146.92
    expect(result.format()).toBe("$146.92");
  });

  it("should calculate IRR", () => {
    const cashFlows = [
      Money.fromMajor("-1000.00", USD),
      Money.fromMajor("500.00", USD),
      Money.fromMajor("500.00", USD),
      Money.fromMajor("500.00", USD),
    ];

    const rate = irr(cashFlows);
    // Approx 23.38%
    expect(rate).toBeCloseTo(0.23375, 4);
  });
});
