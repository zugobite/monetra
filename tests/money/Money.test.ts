import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Money, RoundingMode, USD, ZAR, JPY, EUR } from "../../src";

describe("Money", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.NODE_ENV = originalNodeEnv;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("should create from minor units", () => {
    const m = Money.fromMinor(100, USD);
    expect(m.minor).toBe(100n);
    expect(m.currency).toBe(USD);
  });

  it("should resolve currency from code string", () => {
    const m = Money.fromMinor(100, "USD");
    expect(m.minor).toBe(100n);
    expect(m.currency.code).toBe("USD");
  });

  it("should create from cents (alias) using currency string", () => {
    const m = Money.fromCents(250, "USD");
    expect(m.minor).toBe(250n);
    expect(m.currency.code).toBe("USD");
  });

  it("should create from major units", () => {
    const m = Money.fromMajor("10.50", USD);
    expect(m.minor).toBe(1050n);
  });

  it("should create from decimal (alias) using currency string", () => {
    const m = Money.fromDecimal("10.50", "USD");
    expect(m.minor).toBe(1050n);
    expect(m.currency.code).toBe("USD");
  });

  it("should create from float and optionally warn", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    process.env.NODE_ENV = "test";

    const m = Money.fromFloat(10.5, "USD");
    expect(m.minor).toBe(1050n);
    expect(warn).toHaveBeenCalledTimes(1);

    warn.mockClear();
    const m2 = Money.fromFloat(10.5, "USD", { suppressWarning: true });
    expect(m2.minor).toBe(1050n);
    expect(warn).not.toHaveBeenCalled();

    warn.mockClear();
    process.env.NODE_ENV = "production";
    const m3 = Money.fromFloat(10.5, "USD");
    expect(m3.minor).toBe(1050n);
    expect(warn).not.toHaveBeenCalled();
  });

  it("should add correctly", () => {
    const a = Money.fromMajor("10.00", USD);
    const b = Money.fromMajor("5.50", USD);
    const result = a.add(b);
    expect(result.minor).toBe(1550n);
  });

  it("should subtract correctly", () => {
    const a = Money.fromMajor("10.00", USD);
    const b = Money.fromMajor("5.50", USD);
    const result = a.subtract(b);
    expect(result.minor).toBe(450n);
  });

  it("should resolve other values from string and number", () => {
    const base = Money.fromMajor("10.00", USD);
    expect(base.add("0.50").minor).toBe(1050n);
    expect(base.add(50).minor).toBe(1050n);
  });

  it("should enforce invariant a + b - b === a", () => {
    const a = Money.fromMajor("10.00", USD);
    const b = Money.fromMajor("5.50", USD);
    expect(a.add(b).subtract(b).equals(a)).toBe(true);
  });

  it("should multiply with rounding", () => {
    const m = Money.fromMajor("10.00", USD);
    // 10.00 * 1.5 = 15.00
    expect(m.multiply(1.5).minor).toBe(1500n);

    const m2 = Money.fromMinor(100, USD); // $1.00
    // * 0.5 = $0.50 (50 minor)
    expect(m2.multiply(0.5).minor).toBe(50n);

    // * 0.555 -> 55.5 minor -> 56 (HALF_UP)
    expect(() => m2.multiply(0.555)).toThrow();
    expect(m2.multiply(0.555, { rounding: RoundingMode.HALF_UP }).minor).toBe(
      56n
    );
    expect(m2.multiply(0.555, { rounding: RoundingMode.FLOOR }).minor).toBe(
      55n
    );
  });

  it("should throw on currency mismatch", () => {
    const a = Money.fromMajor("10.00", USD);
    const b = Money.fromMajor("10.00", ZAR);
    expect(() => a.add(b)).toThrow();
  });

  it("should compute min/max and validate inputs", () => {
    expect(() => Money.min()).toThrow("At least one Money value required");
    expect(() => Money.max()).toThrow("At least one Money value required");

    const a = Money.fromMajor("10.00", USD);
    const b = Money.fromMajor("5.00", USD);
    const c = Money.fromMajor("7.00", USD);
    expect(Money.min(a, b, c).minor).toBe(500n);
    expect(Money.max(a, b, c).minor).toBe(1000n);

    const otherCurrency = Money.fromMajor("1.00", EUR);
    expect(() => Money.min(a, otherCurrency)).toThrow();
    expect(() => Money.max(a, otherCurrency)).toThrow();
  });

  it("should format correctly", () => {
    const m = Money.fromMajor("1234.56", USD);
    expect(m.format({ locale: "en-US" })).toBe("$1,234.56");
    expect(m.format({ locale: "de-DE" })).toBe("1.234,56\u00A0$"); // Intl might put symbol at end for DE
    // Note: \u00A0 is non-breaking space.
    // We might need to be flexible with exact string match or normalize spaces.
  });

  it("should clamp correctly", () => {
    const min = Money.fromMajor("50.00", USD);
    const max = Money.fromMajor("100.00", USD);

    expect(() => Money.fromMajor("10.00", USD).clamp(max, min)).toThrow(
      "Clamp min cannot be greater than max"
    );

    const below = Money.fromMajor("10.00", USD).clamp(min, max);
    expect(below.minor).toBe(min.minor);

    const above = Money.fromMajor("150.00", USD).clamp(min, max);
    expect(above.minor).toBe(max.minor);

    const within = Money.fromMajor("75.00", USD);
    expect(within.clamp(min, max)).toBe(within);
  });

  it("should return correct decimal string representation", () => {
    expect(Money.fromMajor("1234.56", USD).toDecimalString()).toBe("1234.56");
    expect(Money.fromMajor("-5.25", USD).toDecimalString()).toBe("-5.25");

    expect(Money.fromMajor("150", JPY).toDecimalString()).toBe("150");
    expect(Money.fromMajor("-150", JPY).toDecimalString()).toBe("-150");
  });

  it("should revive Money objects from JSON", () => {
    const json = '{"amount":"1050","currency":"USD","precision":2}';
    const revived = JSON.parse(json, Money.reviver);
    expect(revived).toBeInstanceOf(Money);
    expect((revived as Money).minor).toBe(1050n);
    expect((revived as Money).currency.code).toBe("USD");

    const notMoney = JSON.parse('{"amount":1050,"currency":"USD","precision":2}', Money.reviver);
    expect(notMoney).toEqual({ amount: 1050, currency: "USD", precision: 2 });
  });

  it("should delegate to format for toString", () => {
    const m = Money.fromMajor("10.00", USD);
    expect(m.toString()).toBe(m.format());
  });

  it("should throw error for scientific notation multiplier", () => {
    const m = Money.fromMajor("10.00", USD);
    expect(() => m.multiply("1e10")).toThrow("Scientific notation not supported");
  });

  it("should throw error for invalid number format in multiplier", () => {
    const m = Money.fromMajor("10.00", USD);
    expect(() => m.multiply("10.5.5")).toThrow("Invalid number format");
  });
});
