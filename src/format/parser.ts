import { Currency } from "../currency/Currency";
import { InvalidPrecisionError } from "../errors";

/**
 * Options for locale-aware parsing.
 */
export interface LocaleParseOptions {
  /**
   * The locale to use for parsing (e.g., "en-US", "de-DE").
   * Used to detect decimal and grouping separators.
   */
  locale: string;
}

/**
 * Parses a locale-formatted string into a normalized decimal string.
 *
 * Handles locale-specific decimal separators (e.g., comma in German "1.234,56")
 * and grouping separators (e.g., period in German "1.234").
 *
 * @param amount - The locale-formatted amount string (e.g., "1,234.56" or "1.234,56").
 * @param options - The locale options.
 * @returns A normalized decimal string (e.g., "1234.56").
 * @example
 * parseLocaleString("1.234,56", { locale: "de-DE" }); // "1234.56"
 * parseLocaleString("1,234.56", { locale: "en-US" }); // "1234.56"
 */
export function parseLocaleString(
  amount: string,
  options: LocaleParseOptions,
): string {
  // Use Intl.NumberFormat to determine the locale's separators
  const parts = new Intl.NumberFormat(options.locale, {
    style: "decimal",
    minimumFractionDigits: 1,
    useGrouping: true,
  }).formatToParts(1234.5);

  let decimalSeparator = ".";
  let groupSeparator = ",";

  for (const part of parts) {
    if (part.type === "decimal") {
      decimalSeparator = part.value;
    } else if (part.type === "group") {
      groupSeparator = part.value;
    }
  }

  // Handle the case where group and decimal separators are the same
  // (shouldn't happen, but be defensive)
  if (groupSeparator === decimalSeparator) {
    throw new Error(
      `Invalid locale configuration: group and decimal separators are the same for locale ${options.locale}`,
    );
  }

  // Remove currency symbols and whitespace
  let normalized = amount.replace(/[^\d.,\-\s]/g, "").trim();

  // Handle negative sign
  const isNegative = normalized.startsWith("-") || amount.includes("(");
  normalized = normalized.replace(/[-()]/g, "");

  // Remove all grouping separators
  normalized = normalized.split(groupSeparator).join("");

  // Replace locale decimal separator with standard period
  normalized = normalized.split(decimalSeparator).join(".");

  return isNegative ? `-${normalized}` : normalized;
}

/**
 * Parses a locale-formatted amount string and converts it to Money minor units.
 *
 * This is a convenience function that combines locale parsing with currency validation.
 *
 * @param amount - The locale-formatted amount string.
 * @param currency - The currency to validate against.
 * @param options - The locale options.
 * @returns The amount in minor units as a BigInt.
 * @throws {InvalidPrecisionError} If the precision exceeds the currency's decimals.
 * @example
 * parseLocaleToMinor("1.234,56", EUR, { locale: "de-DE" }); // 123456n
 */
export function parseLocaleToMinor(
  amount: string,
  currency: Currency,
  options: LocaleParseOptions,
): bigint {
  const normalized = parseLocaleString(amount, options);
  return parseToMinor(normalized, currency);
}

/**
 * Parses a string representation of a major unit amount into minor units.
 *
 * Validates the input format to ensure it is a valid decimal number without
 * scientific notation or ambiguous characters. Checks that the precision
 * does not exceed the currency's allowed decimals.
 *
 * @param amount - The amount string (e.g., "10.50").
 * @param currency - The currency to validate against.
 * @returns The amount in minor units as a BigInt.
 * @throws {Error} If the format is invalid (scientific notation, non-numeric chars).
 * @throws {InvalidPrecisionError} If the precision exceeds the currency's decimals.
 */
export function parseToMinor(amount: string, currency: Currency): bigint {
  // Validate format
  if (/[eE]/.test(amount)) {
    throw new Error("Scientific notation not supported");
  }

  // Reject ambiguous separators (commas, spaces, etc.)
  if (/[^0-9.-]/.test(amount)) {
    throw new Error("Invalid characters in amount");
  }

  // Reject inputs with no digits (e.g. "-" or "")
  if (!/[0-9]/.test(amount)) {
    throw new Error("Invalid format");
  }

  const parts = amount.split(".");
  if (parts.length > 2) {
    throw new Error("Invalid format: multiple decimal points");
  }

  const integerPart = parts[0];
  const fractionalPart = parts[1] || "";

  if (fractionalPart.length > currency.decimals) {
    throw new InvalidPrecisionError(
      `Precision ${fractionalPart.length} exceeds currency decimals ${currency.decimals}`,
    );
  }

  // Pad fractional part
  const paddedFractional = fractionalPart.padEnd(currency.decimals, "0");

  const combined = integerPart + paddedFractional;

  return BigInt(combined);
}
