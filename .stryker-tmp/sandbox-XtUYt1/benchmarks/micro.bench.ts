// @ts-nocheck
import { bench, describe } from "vitest";
import { Money } from "../src/money/Money";
import { USD, EUR, JPY } from "../src/currency/iso4217";
import { RoundingMode } from "../src/rounding/strategies";

describe("Money Arithmetic - Micro Benchmarks", () => {
  // Setup test data
  const m1 = Money.fromMinor(10050n, USD); // $100.50
  const m2 = Money.fromMinor(5025n, USD); // $50.25
  const m3 = Money.fromMinor(25000n, USD); // $250.00

  bench("Money.add (same currency)", () => {
    m1.add(m2);
  });

  bench("Money.subtract (same currency)", () => {
    m1.subtract(m2);
  });

  bench("Money.multiply (by number)", () => {
    m1.multiply(2.5, { rounding: RoundingMode.HALF_EVEN });
  });

  bench("Money.divide (by number)", () => {
    m3.divide(3, { rounding: RoundingMode.HALF_EVEN });
  });

  bench("Money.equals comparison", () => {
    m1.equals(m2);
  });

  bench("Money.greaterThan comparison", () => {
    m1.greaterThan(m2);
  });

  bench("Money allocation (3-way split)", () => {
    m3.allocate([1, 1, 1]);
  });

  bench("Money allocation (10-way split)", () => {
    m3.allocate([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  });
});

describe("Money Creation - Performance", () => {
  bench("Money.fromMinor (BigInt)", () => {
    Money.fromMinor(12345n, USD);
  });

  bench("Money.fromMajor (string)", () => {
    Money.fromMajor("123.45", USD);
  });

  bench("Money.zero", () => {
    Money.zero(USD);
  });
});

describe("Currency Operations", () => {
  const usdMoney = Money.fromMinor(10000n, USD);
  const eurMoney = Money.fromMinor(8500n, EUR);
  const jpyMoney = Money.fromMinor(1500n, JPY);

  bench("Currency precision check (2 decimals)", () => {
    usdMoney.currency.decimals;
  });

  bench("Currency precision check (0 decimals)", () => {
    jpyMoney.currency.decimals;
  });

  bench("Currency mismatch detection", () => {
    try {
      usdMoney.add(eurMoney);
    } catch (e) {
      // Expected error
    }
  });
});
