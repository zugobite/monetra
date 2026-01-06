import { describe, expect, it } from "vitest";
import { assertNonNegative, assertSameCurrency } from "../../src/money/guards";
import { Money } from "../../src/money/Money";
import { USD, EUR } from "../../src/currency/iso4217";
import { CurrencyMismatchError } from "../../src/errors";

describe("Guards", () => {
  describe("assertSameCurrency", () => {
    it("should not throw when currencies match", () => {
      const a = Money.fromMajor("10", USD);
      const b = Money.fromMajor("20", USD);
      expect(() => assertSameCurrency(a, b)).not.toThrow();
    });

    it("should throw CurrencyMismatchError when currencies differ", () => {
      const a = Money.fromMajor("10", USD);
      const b = Money.fromMajor("20", EUR);
      expect(() => assertSameCurrency(a, b)).toThrow(CurrencyMismatchError);
    });
  });

  describe("assertNonNegative", () => {
    it("should not throw for positive values", () => {
      const money = Money.fromMajor("10", USD);
      expect(() => assertNonNegative(money)).not.toThrow();
    });

    it("should not throw for zero", () => {
      const money = Money.zero(USD);
      expect(() => assertNonNegative(money)).not.toThrow();
    });

    it("should throw Error for negative values", () => {
      const money = Money.fromMajor("-10", USD);
      expect(() => assertNonNegative(money)).toThrow("Money value must be non-negative");
    });
  });
});
