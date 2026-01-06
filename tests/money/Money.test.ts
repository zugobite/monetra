import { describe, it, expect } from "vitest";
import { Money, RoundingMode, USD, ZAR } from "../../src";

describe("Money", () => {
  it("should create from minor units", () => {
    const m = Money.fromMinor(100, USD);
    expect(m.minor).toBe(100n);
    expect(m.currency).toBe(USD);
  });

  it("should create from major units", () => {
    const m = Money.fromMajor("10.50", USD);
    expect(m.minor).toBe(1050n);
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

  it("should format correctly", () => {
    const m = Money.fromMajor("1234.56", USD);
    expect(m.format({ locale: "en-US" })).toBe("$1,234.56");
    expect(m.format({ locale: "de-DE" })).toBe("1.234,56\u00A0$"); // Intl might put symbol at end for DE
    // Note: \u00A0 is non-breaking space.
    // We might need to be flexible with exact string match or normalize spaces.
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
