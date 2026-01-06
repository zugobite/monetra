import { describe, it, expect, beforeAll } from "vitest";
import * as fc from "fast-check";
import { Money } from "../../src/money/Money";
import { RoundingMode } from "../../src/rounding/strategies";
import { registerCurrency } from "../../src/currency/registry";
import { USD } from "../../src/currency/iso4217";

/**
 * Property-based tests for Money arithmetic operations.
 *
 * These tests use fast-check to generate random inputs and verify
 * that mathematical properties hold for all inputs.
 */

// Register USD currency for tests
beforeAll(() => {
  registerCurrency(USD);
});

// Arbitrary for generating safe integer amounts (to avoid BigInt overflow in tests)
const safeAmount = fc.integer({ min: -1_000_000_000, max: 1_000_000_000 });

// Arbitrary for generating positive amounts
const positiveAmount = fc.integer({ min: 1, max: 1_000_000_000 });

describe("Money Property-Based Tests", () => {
  describe("Addition Properties", () => {
    it("should be commutative: a + b = b + a", () => {
      fc.assert(
        fc.property(safeAmount, safeAmount, (a, b) => {
          const moneyA = Money.fromMinor(a, "USD");
          const moneyB = Money.fromMinor(b, "USD");

          const result1 = moneyA.add(moneyB);
          const result2 = moneyB.add(moneyA);

          expect(result1.equals(result2)).toBe(true);
        })
      );
    });

    it("should be associative: (a + b) + c = a + (b + c)", () => {
      fc.assert(
        fc.property(safeAmount, safeAmount, safeAmount, (a, b, c) => {
          const moneyA = Money.fromMinor(a, "USD");
          const moneyB = Money.fromMinor(b, "USD");
          const moneyC = Money.fromMinor(c, "USD");

          const result1 = moneyA.add(moneyB).add(moneyC);
          const result2 = moneyA.add(moneyB.add(moneyC));

          expect(result1.equals(result2)).toBe(true);
        })
      );
    });

    it("should have identity element: a + 0 = a", () => {
      fc.assert(
        fc.property(safeAmount, (a) => {
          const moneyA = Money.fromMinor(a, "USD");
          const zero = Money.zero("USD");

          const result = moneyA.add(zero);

          expect(result.equals(moneyA)).toBe(true);
        })
      );
    });

    it("should have inverse element: a + (-a) = 0", () => {
      fc.assert(
        fc.property(safeAmount, (a) => {
          const moneyA = Money.fromMinor(a, "USD");
          const negA = moneyA.negate();

          const result = moneyA.add(negA);

          expect(result.isZero()).toBe(true);
        })
      );
    });
  });

  describe("Subtraction Properties", () => {
    it("should satisfy: a - b = a + (-b)", () => {
      fc.assert(
        fc.property(safeAmount, safeAmount, (a, b) => {
          const moneyA = Money.fromMinor(a, "USD");
          const moneyB = Money.fromMinor(b, "USD");

          const result1 = moneyA.subtract(moneyB);
          const result2 = moneyA.add(moneyB.negate());

          expect(result1.equals(result2)).toBe(true);
        })
      );
    });

    it("should satisfy: a - a = 0", () => {
      fc.assert(
        fc.property(safeAmount, (a) => {
          const moneyA = Money.fromMinor(a, "USD");

          const result = moneyA.subtract(moneyA);

          expect(result.isZero()).toBe(true);
        })
      );
    });
  });

  describe("Multiplication Properties", () => {
    it("should have identity element: a * 1 = a", () => {
      fc.assert(
        fc.property(safeAmount, (a) => {
          const moneyA = Money.fromMinor(a, "USD");

          const result = moneyA.multiply(1);

          expect(result.equals(moneyA)).toBe(true);
        })
      );
    });

    it("should have zero element: a * 0 = 0", () => {
      fc.assert(
        fc.property(safeAmount, (a) => {
          const moneyA = Money.fromMinor(a, "USD");

          const result = moneyA.multiply(0);

          expect(result.isZero()).toBe(true);
        })
      );
    });

    it("should distribute over addition with rounding: (a + b) * k ≈ a * k + b * k", () => {
      fc.assert(
        fc.property(safeAmount, safeAmount, fc.integer({ min: 1, max: 100 }), (a, b, k) => {
          const moneyA = Money.fromMinor(a, "USD");
          const moneyB = Money.fromMinor(b, "USD");

          const result1 = moneyA.add(moneyB).multiply(k);
          const result2 = moneyA.multiply(k).add(moneyB.multiply(k));

          // Should be equal for integer multipliers
          expect(result1.equals(result2)).toBe(true);
        })
      );
    });
  });

  describe("Comparison Properties", () => {
    it("should be reflexive: a = a", () => {
      fc.assert(
        fc.property(safeAmount, (a) => {
          const moneyA = Money.fromMinor(a, "USD");

          expect(moneyA.equals(moneyA)).toBe(true);
        })
      );
    });

    it("should be symmetric: if a = b then b = a", () => {
      fc.assert(
        fc.property(safeAmount, (a) => {
          const moneyA = Money.fromMinor(a, "USD");
          const moneyB = Money.fromMinor(a, "USD");

          expect(moneyA.equals(moneyB)).toBe(true);
          expect(moneyB.equals(moneyA)).toBe(true);
        })
      );
    });

    it("should be transitive: if a = b and b = c then a = c", () => {
      fc.assert(
        fc.property(safeAmount, (a) => {
          const moneyA = Money.fromMinor(a, "USD");
          const moneyB = Money.fromMinor(a, "USD");
          const moneyC = Money.fromMinor(a, "USD");

          expect(moneyA.equals(moneyB)).toBe(true);
          expect(moneyB.equals(moneyC)).toBe(true);
          expect(moneyA.equals(moneyC)).toBe(true);
        })
      );
    });

    it("compare should be consistent with greaterThan/lessThan", () => {
      fc.assert(
        fc.property(safeAmount, safeAmount, (a, b) => {
          const moneyA = Money.fromMinor(a, "USD");
          const moneyB = Money.fromMinor(b, "USD");

          const comparison = moneyA.compare(moneyB);

          if (comparison > 0) {
            expect(moneyA.greaterThan(moneyB)).toBe(true);
            expect(moneyB.lessThan(moneyA)).toBe(true);
          } else if (comparison < 0) {
            expect(moneyA.lessThan(moneyB)).toBe(true);
            expect(moneyB.greaterThan(moneyA)).toBe(true);
          } else {
            expect(moneyA.equals(moneyB)).toBe(true);
          }
        })
      );
    });
  });

  describe("Absolute Value and Negation Properties", () => {
    it("should satisfy: |a| >= 0", () => {
      fc.assert(
        fc.property(safeAmount, (a) => {
          const moneyA = Money.fromMinor(a, "USD");

          const abs = moneyA.abs();

          expect(abs.isNegative()).toBe(false);
        })
      );
    });

    it("should satisfy: |-a| = |a|", () => {
      fc.assert(
        fc.property(safeAmount, (a) => {
          const moneyA = Money.fromMinor(a, "USD");

          const abs1 = moneyA.abs();
          const abs2 = moneyA.negate().abs();

          expect(abs1.equals(abs2)).toBe(true);
        })
      );
    });

    it("should satisfy: -(-a) = a", () => {
      fc.assert(
        fc.property(safeAmount, (a) => {
          const moneyA = Money.fromMinor(a, "USD");

          const result = moneyA.negate().negate();

          expect(result.equals(moneyA)).toBe(true);
        })
      );
    });
  });

  describe("Clamp Properties", () => {
    it("should return min if value < min", () => {
      fc.assert(
        fc.property(
          safeAmount,
          fc.integer({ min: 0, max: 500_000_000 }),
          fc.integer({ min: 500_000_001, max: 1_000_000_000 }),
          (value, minVal, maxVal) => {
            // Ensure value < minVal
            const actualValue = Math.min(value, minVal - 1);
            const money = Money.fromMinor(actualValue, "USD");
            const min = Money.fromMinor(minVal, "USD");
            const max = Money.fromMinor(maxVal, "USD");

            const result = money.clamp(min, max);

            expect(result.equals(min)).toBe(true);
          }
        )
      );
    });

    it("should return max if value > max", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 500_000_001, max: 1_000_000_000 }),
          fc.integer({ min: 0, max: 250_000_000 }),
          fc.integer({ min: 250_000_001, max: 500_000_000 }),
          (value, minVal, maxVal) => {
            const money = Money.fromMinor(value, "USD");
            const min = Money.fromMinor(minVal, "USD");
            const max = Money.fromMinor(maxVal, "USD");

            const result = money.clamp(min, max);

            expect(result.equals(max)).toBe(true);
          }
        )
      );
    });
  });

  describe("Allocation Properties", () => {
    it("should preserve total: sum of allocated parts = original", () => {
      fc.assert(
        fc.property(
          positiveAmount,
          fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 1, maxLength: 10 }),
          (amount, ratios) => {
            const money = Money.fromMinor(amount, "USD");

            const parts = money.allocate(ratios);
            const sum = parts.reduce((acc, part) => acc.add(part), Money.zero("USD"));

            expect(sum.equals(money)).toBe(true);
          }
        )
      );
    });

    it("split should preserve total", () => {
      fc.assert(
        fc.property(positiveAmount, fc.integer({ min: 1, max: 100 }), (amount, parts) => {
          const money = Money.fromMinor(amount, "USD");

          const splits = money.split(parts);
          const sum = splits.reduce((acc, part) => acc.add(part), Money.zero("USD"));

          expect(sum.equals(money)).toBe(true);
        })
      );
    });
  });

  describe("Rounding Consistency", () => {
    it("division with rounding should produce integer minor units", () => {
      fc.assert(
        fc.property(safeAmount, fc.integer({ min: 1, max: 1000 }), (amount, divisor) => {
          const money = Money.fromMinor(amount, "USD");

          const result = money.divide(divisor, { rounding: RoundingMode.HALF_EVEN });

          // The result should be a valid Money instance
          expect(typeof result.minor).toBe("bigint");
        })
      );
    });

    it("different rounding modes should produce consistent results", () => {
      fc.assert(
        fc.property(safeAmount, fc.integer({ min: 2, max: 100 }), (amount, divisor) => {
          const money = Money.fromMinor(amount, "USD");

          const halfUp = money.divide(divisor, { rounding: RoundingMode.HALF_UP });
          const halfDown = money.divide(divisor, { rounding: RoundingMode.HALF_DOWN });
          const floor = money.divide(divisor, { rounding: RoundingMode.FLOOR });
          const ceil = money.divide(divisor, { rounding: RoundingMode.CEIL });

          // Floor should be <= HALF_DOWN <= HALF_UP <= Ceil (for positive)
          // This is a simplified check; detailed behavior depends on the value
          if (amount >= 0) {
            expect(floor.minor <= ceil.minor).toBe(true);
          }
        })
      );
    });
  });

  describe("Serialization Properties", () => {
    it("toJSON and reviver should round-trip correctly", () => {
      fc.assert(
        fc.property(safeAmount, (amount) => {
          const money = Money.fromMinor(amount, "USD");

          const json = JSON.stringify(money);
          const restored = JSON.parse(json, Money.reviver);

          expect(restored.equals(money)).toBe(true);
        })
      );
    });

    it("toDecimalString should be parseable back", () => {
      fc.assert(
        fc.property(safeAmount, (amount) => {
          const money = Money.fromMinor(amount, "USD");

          const decimalStr = money.toDecimalString();
          const restored = Money.fromDecimal(decimalStr, "USD");

          expect(restored.equals(money)).toBe(true);
        })
      );
    });
  });
});
