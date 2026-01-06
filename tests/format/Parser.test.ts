import { describe, it, expect } from "vitest";
import { parseLocaleToMinor, parseLocaleString, parseToMinor } from "../../src/format/parser";
import { USD, EUR, JPY } from "../../src/currency/iso4217";
import { InvalidPrecisionError } from "../../src/errors/InvalidPrecisionError";

describe("Parser", () => {
  it("should parse valid money strings", () => {
    // parseLocaleToMinor returns bigint
    const val = parseLocaleToMinor("$1,234.56", USD, { locale: "en-US" });
    expect(val).toBe(123456n);
  });

  it("should parse valid money strings with multiple grouping separators", () => {
    const val = parseLocaleToMinor("$1,234,567.89", USD, { locale: "en-US" });
    expect(val).toBe(123456789n);
  });

  it("should parse valid money strings with surrounding whitespace", () => {
    const val = parseLocaleToMinor("  $1,234.56  ", USD, { locale: "en-US" });
    expect(val).toBe(123456n);
  });

  it("should parse locale-formatted strings (de-DE)", () => {
    const normalized = parseLocaleString("1.234,56", { locale: "de-DE" });
    expect(normalized).toBe("1234.56");

    const minor = parseLocaleToMinor("1.234,56", EUR, { locale: "de-DE" });
    expect(minor).toBe(123456n);
  });

  it("should parse negative amounts with minus sign", () => {
    const minor = parseLocaleToMinor("-$1,234.56", USD, { locale: "en-US" });
    expect(minor).toBe(-123456n);
  });

  it("should parse negative amounts with parentheses", () => {
    const minor = parseLocaleToMinor("($1,234.56)", USD, { locale: "en-US" });
    expect(minor).toBe(-123456n);
  });

  it("should reject scientific notation", () => {
    expect(() => parseToMinor("1e3", USD)).toThrow(/Scientific notation not supported/);
  });

  it("should reject invalid characters", () => {
    expect(() => parseToMinor("1,234.56", USD)).toThrow(/Invalid characters in amount/);
    expect(() => parseToMinor("12 34.56", USD)).toThrow(/Invalid characters in amount/);
  });

  it("should reject multiple decimal points", () => {
    expect(() => parseToMinor("1.2.3", USD)).toThrow(
      /Invalid format: multiple decimal points/
    );
  });

  it("should reject precision exceeding currency decimals", () => {
    expect(() => parseToMinor("1.234", USD)).toThrowError(InvalidPrecisionError);
    expect(() => parseToMinor("1.234", USD)).toThrow(/exceeds currency decimals/);
  });

  it("should reject invalid format '-' for decimal currencies", () => {
    expect(() => parseToMinor("-", USD)).toThrow(/Invalid format/);
  });

  it("should reject empty string", () => {
    expect(() => parseToMinor("", USD)).toThrow(/Invalid format/);
    expect(() => parseToMinor("", JPY)).toThrow(/Invalid format/);
  });

  it("should throw when Intl reports invalid locale separators (defensive)", () => {
    const original = Intl.NumberFormat;

    // Minimal stub that returns the same character for group and decimal
    // so the defensive branch triggers.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Intl as any).NumberFormat = function () {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        formatToParts(_n: number) {
          return [
            { type: "group", value: "." },
            { type: "decimal", value: "." },
          ];
        },
      };
    } as unknown as typeof Intl.NumberFormat;

    try {
      expect(() => parseLocaleString("1.234,56", { locale: "xx-XX" })).toThrow(
        /Invalid locale configuration: group and decimal separators are the same/
      );
    } finally {
      Intl.NumberFormat = original;
    }
  });

  it("should detect group separator from Intl when parsing locale strings", () => {
    const original = Intl.NumberFormat;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Intl as any).NumberFormat = function (_locale: string, options?: any) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        formatToParts(_n: number) {
          // If grouping isn't enabled, pretend Intl doesn't tell us the group separator.
          if (!options?.useGrouping) {
            return [{ type: "decimal", value: "," }];
          }

          return [
            { type: "group", value: "." },
            { type: "decimal", value: "," },
          ];
        },
      };
    } as unknown as typeof Intl.NumberFormat;

    try {
      expect(parseLocaleString("1.234,56", { locale: "de-DE" })).toBe("1234.56");
    } finally {
      Intl.NumberFormat = original;
    }
  });

  it("should fall back to default separators when Intl provides none", () => {
    const original = Intl.NumberFormat;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Intl as any).NumberFormat = function () {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        formatToParts(_n: number) {
          return [];
        },
      };
    } as unknown as typeof Intl.NumberFormat;

    try {
      expect(parseLocaleString("1,234.56", { locale: "en-US" })).toBe("1234.56");
    } finally {
      Intl.NumberFormat = original;
    }
  });
});
