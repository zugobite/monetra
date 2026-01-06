import { describe, it, expect, vi } from "vitest";
import { Money, RoundingMode, USD, ZAR } from "../../src";

describe("Money Utilities", () => {
  describe("divide", () => {
    it("should divide correctly", () => {
      const m = Money.fromMajor("10.00", USD);
      // 10.00 / 2 = 5.00
      expect(m.divide(2).minor).toBe(500n);
    });

    it("should throw on division by zero", () => {
      const m = Money.fromMajor("10.00", USD);
      // Check specifically for the text to ensure the guard is hit
      expect(() => m.divide(0)).toThrow(/Division by zero/);
      // Check string input to kill mutants that might skip string verification
      expect(() => m.divide("0")).toThrow(/Division by zero/);
      expect(() => m.divide(0n as any)).toThrow(/Division by zero/);
    });

    it("should handle rounding", () => {
      const m = Money.fromMajor("10.00", USD);
      // 10.00 / 3 = 3.333...
      expect(() => m.divide(3)).toThrow();
      expect(m.divide(3, { rounding: RoundingMode.HALF_UP }).minor).toBe(333n);
    });
  });

  describe("abs & negate", () => {
    it("should return absolute value", () => {
      const m = Money.fromMajor("-10.00", USD);
      expect(m.abs().minor).toBe(1000n);
      expect(m.abs().isPositive()).toBe(true);
    });

    it("should negate value", () => {
      const m = Money.fromMajor("10.00", USD);
      expect(m.negate().minor).toBe(-1000n);
      expect(m.negate().negate().equals(m)).toBe(true);
    });
  });

  describe("min & max", () => {
    it("should find min", () => {
      const a = Money.fromMajor("10.00", USD);
      const b = Money.fromMajor("5.00", USD);
      const c = Money.fromMajor("15.00", USD);
      expect(Money.min(a, b, c).equals(b)).toBe(true);
    });

    it("should find max", () => {
      const a = Money.fromMajor("10.00", USD);
      const b = Money.fromMajor("5.00", USD);
      const c = Money.fromMajor("15.00", USD);
      expect(Money.max(a, b, c).equals(c)).toBe(true);
    });

    it("should throw on currency mismatch", () => {
      const a = Money.fromMajor("10.00", USD);
      const b = Money.fromMajor("5.00", ZAR);
      expect(() => Money.min(a, b)).toThrow();
    });
  });

  describe("fromFloat", () => {
    it("should create from float", () => {
      // Suppress warning for this test to keep output clean
      const m = Money.fromFloat(10.5, USD, { suppressWarning: true });
      expect(m.minor).toBe(1050n);
    });

    it("should warn about precision by default", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      Money.fromFloat(10.5, USD);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("may lose precision"));
      warnSpy.mockRestore();
    });

    it("should allow suppressing precision warning", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      Money.fromFloat(10.5, USD, { suppressWarning: true });
      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe("comparisons", () => {
    it("should compare correctly", () => {
      const a = Money.fromMajor("10.00", USD);
      const b = Money.fromMajor("5.00", USD);
      const c = Money.fromMajor("10.00", USD);

      // Equality
      expect(a.equals(c)).toBe(true);
      expect(a.equals(b)).toBe(false);

      // Compare returns
      expect(a.compare(b)).toBe(1);
      expect(b.compare(a)).toBe(-1);
      expect(a.compare(c)).toBe(0);

      // Greater/Less Than
      expect(a.greaterThan(b)).toBe(true);
      expect(b.greaterThan(a)).toBe(false);

      expect(b.lessThan(a)).toBe(true);
      expect(a.lessThan(b)).toBe(false);

      // Inclusive Comparison
      expect(a.greaterThanOrEqual(b)).toBe(true);
      expect(a.greaterThanOrEqual(c)).toBe(true);
      expect(b.greaterThanOrEqual(a)).toBe(false); // Essential

      expect(b.lessThanOrEqual(a)).toBe(true);
      expect(c.lessThanOrEqual(a)).toBe(true);
      expect(a.lessThanOrEqual(b)).toBe(false); // Essential
    });

    it("should check positive", () => {
      expect(Money.fromMajor("10.00", USD).isPositive()).toBe(true);
      expect(Money.fromMajor("-10.00", USD).isPositive()).toBe(false);
      expect(Money.fromMajor("0.00", USD).isPositive()).toBe(false);
    });
  });
});
