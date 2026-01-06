import { describe, it, expect } from "vitest";
import {
  debtToEquity,
  debtToAssets,
  interestCoverage,
  equityMultiplier,
  leverageRatios,
} from "../../src/financial/leverage";
import { Money } from "../../src/money/Money";
import { USD, EUR } from "../../src/currency/iso4217";

describe("Financial - Leverage Ratios", () => {
  const debt = Money.fromMajor("20000", USD);
  const equity = Money.fromMajor("10000", USD);
  const assets = Money.fromMajor("30000", USD);
  const ebit = Money.fromMajor("50000", USD);
  const interest = Money.fromMajor("10000", USD);

  it("should calculate Debt-to-Equity ratio correctly", () => {
    // 200,000 / 100,000 = 2.0
    expect(debtToEquity(debt, equity)).toBe(2.0);
  });

  it("should throw if total equity is zero", () => {
    const zeroEquity = Money.zero(USD);
    expect(() => debtToEquity(debt, zeroEquity)).toThrow(/Total equity cannot be zero/);
  });

  it("should calculate Debt-to-Assets ratio correctly", () => {
    // 200,000 / 300,000 = 0.666...
    expect(debtToAssets(debt, assets)).toBeCloseTo(0.6666666, 5);
  });

  it("should throw if total assets is zero", () => {
    const zeroAssets = Money.zero(USD);
    expect(() => debtToAssets(debt, zeroAssets)).toThrow(/Total assets cannot be zero/);
  });

  it("should calculate Infinity for zero interest expense", () => {
    const zeroInterest = Money.zero(USD);
    expect(interestCoverage(ebit, zeroInterest)).toBe(Infinity);
  });

  it("should calculate Equity Multiplier correctly", () => {
    // 300,000 / 100,000 = 3.0
    expect(equityMultiplier(assets, equity)).toBe(3.0);
  });

  it("should throw if total equity is zero for equity multiplier", () => {
    const zeroEquity = Money.zero(USD);
    expect(() => equityMultiplier(assets, zeroEquity)).toThrow(/Total equity cannot be zero/);
  });

  it("should calculate all ratios using bundled function", () => {
    const results = leverageRatios({
      totalDebt: debt,
      totalEquity: equity,
      totalAssets: assets,
      ebit: ebit,
      interestExpense: interest,
    });

    expect(results.debtToEquity).toBe(2.0);
    expect(results.interestCoverage).toBe(5.0);
  });

  it("should throw error on currency mismatch", () => {
    const debtInEur = Money.fromMajor("200000", EUR);
    expect(() => debtToEquity(debtInEur, equity)).toThrow();
  });
});
