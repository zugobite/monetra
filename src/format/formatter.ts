import { Money } from "../money/Money";

/**
 * Options for formatting Money values.
 */
export interface FormatOptions {
  /**
   * The locale to use for formatting (e.g., "en-US", "de-DE").
   * If not provided, defaults to the currency's default locale or "en-US".
   */
  locale?: string;

  /**
   * Whether to include the currency symbol in the output.
   * Defaults to true.
   */
  symbol?: boolean;

  /**
   * How to display the currency.
   * 'symbol' (default): "$1.00"
   * 'code': "USD 1.00"
   * 'name': "1.00 US dollars"
   */
  display?: "symbol" | "code" | "name";
}

/**
 * Formats a Money object into a string representation.
 *
 * Uses `Intl.NumberFormat` for locale-aware formatting of numbers and currency symbols.
 *
 * @param money - The Money object to format.
 * @param options - Formatting options.
 * @returns The formatted string.
 */
export function format(money: Money, options?: FormatOptions): string {
  const locale = options?.locale || money.currency.locale || "en-US";
  const showSymbol = options?.symbol ?? true;
  const display = options?.display || "symbol";

  const decimals = money.currency.decimals;
  const minor = money.minor;
  const absMinor = minor < 0n ? -minor : minor;

  const divisor = 10n ** BigInt(decimals);
  const integerPart = absMinor / divisor;
  const fractionalPart = absMinor % divisor;

  // Pad fractional
  const fractionalStr = fractionalPart.toString().padStart(decimals, "0");

  // Get separators
  // We use a dummy format to extract the decimal separator for the locale
  const parts = new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: 1,
  }).formatToParts(1.1);

  const decimalSeparator =
    parts.find((p) => p.type === "decimal")?.value || ".";

  // Format integer part with grouping using Intl (supports BigInt)
  const integerFormatted = new Intl.NumberFormat(locale, {
    style: "decimal",
    useGrouping: true,
  }).format(integerPart);

  const absString =
    decimals > 0
      ? `${integerFormatted}${decimalSeparator}${fractionalStr}`
      : integerFormatted;

  if (!showSymbol) {
    return minor < 0n ? `-${absString}` : absString;
  }

  // Use formatToParts to get the template (sign position, currency position)
  const templateParts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency.code,
    currencyDisplay: display,
  }).formatToParts(minor < 0n ? -1 : 1);

  let result = "";
  let numberInserted = false;

  for (const part of templateParts) {
    if (["integer", "group", "decimal", "fraction"].includes(part.type)) {
      if (!numberInserted) {
        result += absString;
        numberInserted = true;
      }
    } else if (part.type === "currency") {
      result += part.value;
    } else {
      result += part.value; // literals, minusSign, parentheses, etc.
    }
  }

  return result;
}
