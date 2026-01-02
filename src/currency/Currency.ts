/**
 * Represents a currency with its metadata.
 *
 * This interface defines the structure for currency objects used throughout the library.
 * It includes the ISO 4217 code, the number of decimal places (precision),
 * the currency symbol, and an optional default locale for formatting.
 */
export interface Currency {
  /**
   * The ISO 4217 currency code (e.g., "USD", "EUR", "ZAR").
   */
  code: string;

  /**
   * The number of decimal places for the currency.
   * This defines the precision of the currency (e.g., 2 for USD, 0 for JPY).
   */
  decimals: number;

  /**
   * The symbol associated with the currency (e.g., "$", "€", "R").
   */
  symbol: string;

  /**
   * The default locale to use when formatting amounts in this currency (e.g., "en-US").
   * If not provided, the formatter may fall back to a default or user-provided locale.
   */
  locale?: string;
}
