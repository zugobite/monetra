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

  /**
   * Whether to use accounting format for negative numbers.
   * When true, negative values are wrapped in parentheses instead of using a minus sign.
   * Defaults to false.
   * @example
   * // accounting: false (default): "-$1.00"
   * // accounting: true: "($1.00)"
   */
  accounting?: boolean;
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
  const useAccounting = options?.accounting ?? false;

  const decimals = money.currency.decimals;
  const minor = money.minor;
  const isNegative = minor < 0n;
  const absMinor = isNegative ? -minor : minor;

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
    if (isNegative) {
      return useAccounting ? `(${absString})` : `-${absString}`;
    }
    return absString;
  }

  // Use formatToParts to get the template (sign position, currency position)
  let templateParts: Intl.NumberFormatPart[];
  try {
    templateParts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: money.currency.code,
      currencyDisplay: display,
    }).formatToParts(isNegative ? -1234.5 : 1234.5);
  } catch (e) {
    // Fallback for custom currencies or invalid codes
    const symbol =
      display === "symbol" ? money.currency.symbol : money.currency.code;
    if (isNegative) {
      return useAccounting
        ? `(${symbol}${absString})`
        : `-${symbol}${absString}`;
    }
    return `${symbol}${absString}`;
  }

  let result = "";
  let numberInserted = false;

  for (const part of templateParts) {
    switch (part.type) {
      case "minusSign": {
        // Skip the minus sign, we'll handle it later for accounting format
        if (!useAccounting) {
          result += part.value;
        }
        break;
      }

      case "integer": {
        if (!numberInserted) {
          result += absString;
          numberInserted = true;
        }
        break;
      }

      // Skip the remaining numeric parts, since we already inserted the full number string.
      case "group":
      case "decimal":
      case "fraction": {
        break;
      }

      case "currency": {
        if (display === "symbol" && money.currency.symbol) {
          result += money.currency.symbol;
        } else {
          result += part.value;
        }
        break;
      }

      default: {
        result += part.value; // literals, parentheses, etc.
        break;
      }
    }
  }

  // Apply accounting format if negative
  if (useAccounting && isNegative) {
    return `(${result.trim()})`;
  }

  return result;
}
