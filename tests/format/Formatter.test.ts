import { describe, it, expect } from "vitest";
import { format } from "../../src/format/formatter";
import { USD, JPY } from "../../src/currency/iso4217";
import { Money } from "../../src/money/Money";

describe("Formatter", () => {
  it("should format money correctly", () => {
    const m = Money.fromMajor("1234.56", USD);
    expect(format(m)).toBe("$1,234.56");
  });

  it("should format negative with symbol without accounting", () => {
    const m = Money.fromMajor("-1234.56", USD);
    expect(format(m, { accounting: false })).toBe("-$1,234.56");
  });

  it("should format without currency symbol", () => {
    const m = Money.fromMajor("1234.56", USD);
    expect(format(m, { symbol: false })).toBe("1,234.56");
  });

  it("should format negative without symbol and without accounting", () => {
    const m = Money.fromMajor("-1234.56", USD);
    expect(format(m, { symbol: false, accounting: false })).toBe("-1,234.56");
  });

  it("should format negative without symbol using accounting", () => {
    const m = Money.fromMajor("-1234.56", USD);
    expect(format(m, { symbol: false, accounting: true })).toBe("(1,234.56)");
  });

  it("should format negative with accounting (parentheses)", () => {
    const m = Money.fromMajor("-1234.56", USD);
    // Keep the assertion slightly flexible around currency spacing.
    const out = format(m, { accounting: true });
    expect(out.startsWith("(")).toBe(true);
    expect(out.endsWith(")")).toBe(true);
    expect(out).toContain("$1,234.56");
  });

  it("should support display=code", () => {
    const m = Money.fromMajor("1.00", USD);
    const out = format(m, { display: "code" });
    expect(out).toContain("USD");
    expect(out).toContain("1.00");
  });

  it("should format currencies with 0 decimals", () => {
    const m = Money.fromMajor("1234", JPY);
    const out = format(m);
    expect(out).toContain("¥");
    expect(out).toContain("1,234");
    expect(out).not.toContain(".");
  });

  it("should use locale decimal separator when formatting without symbol", () => {
    const m = Money.fromMajor("1234.56", USD);
    expect(format(m, { symbol: false, locale: "de-DE" })).toBe("1.234,56");
  });

  it("should fall back for invalid currency codes", () => {
    const fakeCurrency = {
      code: "US", // invalid ISO 4217 code length, Intl should throw
      decimals: 2,
      symbol: "?",
      locale: "en-US",
    };
    const m = Money.fromMinor(123456, fakeCurrency);
    expect(format(m)).toBe("?1,234.56");
    expect(format(m, { display: "code" })).toBe("US1,234.56");
    expect(format(Money.fromMinor(-123456, fakeCurrency))).toBe("-?1,234.56");
    expect(format(Money.fromMinor(-123456, fakeCurrency), { accounting: true })).toBe(
      "(?1,234.56)"
    );
  });

  it("should pass Intl options when deriving separators and grouping", () => {
    const original = Intl.NumberFormat;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Intl as any).NumberFormat = function (_locale: string, options?: any) {
      return {
        formatToParts(_n: number) {
          // When called with the expected options, provide no decimal part so we exercise the fallback.
          // If the options are missing (mutant), pretend the locale decimal separator is a comma.
          if (options?.style === "decimal" && options?.minimumFractionDigits === 1) {
            return [{ type: "integer", value: "1" }];
          }
          return [{ type: "decimal", value: "," }];
        },
        format(n: bigint) {
          // Require grouping option to produce grouped output for 4+ digits.
          if (options?.style === "decimal" && options?.useGrouping === true && n === 1234n) {
            return "1,234";
          }
          return n.toString();
        },
      };
    } as unknown as typeof Intl.NumberFormat;

    try {
      const m = Money.fromMajor("1234.56", USD);
      expect(format(m, { symbol: false })).toBe("1,234.56");
    } finally {
      Intl.NumberFormat = original;
    }
  });

  it("should trim template whitespace when using accounting format", () => {
    const original = Intl.NumberFormat;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Intl as any).NumberFormat = function (_locale: string, options?: any) {
      if (options?.style === "currency") {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          formatToParts(_n: number) {
            return [
              { type: "literal", value: " " },
              { type: "minusSign", value: "-" },
              { type: "currency", value: "$" },
              { type: "integer", value: "1" },
              { type: "literal", value: " " },
            ];
          },
        };
      }

      return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        formatToParts(_n: number) {
          return [{ type: "decimal", value: "." }];
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        format(n: bigint) {
          return n.toString();
        },
      };
    } as unknown as typeof Intl.NumberFormat;

    try {
      const m = Money.fromMajor("-1.00", USD);
      expect(format(m, { accounting: true })).toBe("($1.00)");
    } finally {
      Intl.NumberFormat = original;
    }
  });
});
