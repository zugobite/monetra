import { Currency } from "../currency/Currency";
import { InvalidPrecisionError } from "../errors";

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

  const parts = amount.split(".");
  if (parts.length > 2) {
    throw new Error("Invalid format: multiple decimal points");
  }

  const integerPart = parts[0];
  const fractionalPart = parts[1] || "";

  if (fractionalPart.length > currency.decimals) {
    throw new InvalidPrecisionError(
      `Precision ${fractionalPart.length} exceeds currency decimals ${currency.decimals}`
    );
  }

  // Pad fractional part
  const paddedFractional = fractionalPart.padEnd(currency.decimals, "0");

  const combined = integerPart + paddedFractional;

  // Handle edge case where integer part is just "-"
  if (combined === "-" || combined === "") {
    throw new Error("Invalid format");
  }

  return BigInt(combined);
}
