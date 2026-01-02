import { Money } from "./money";
import { Currency } from "./currency";

export * from "./money";
export * from "./currency";
export * from "./rounding";
export * from "./errors";

/**
 * Helper function to create Money instances.
 *
 * If amount is a number or BigInt, it is treated as minor units.
 * If amount is a string, it is treated as major units.
 *
 * @param amount - The amount (minor units if number/bigint, major units if string).
 * @param currency - The currency code or object.
 */
export function money(
  amount: number | bigint | string,
  currency: string | Currency
): Money {
  if (typeof amount === "string") {
    return Money.fromMajor(amount, currency);
  }
  return Money.fromMinor(amount, currency);
}
