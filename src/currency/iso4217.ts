import { Currency } from './Currency';

/**
 * United States Dollar (USD).
 */
export const USD: Currency = {
  code: 'USD',
  decimals: 2,
  symbol: '$',
  locale: 'en-US',
};

/**
 * Euro (EUR).
 */
export const EUR: Currency = {
  code: 'EUR',
  decimals: 2,
  symbol: '€',
  locale: 'de-DE', // Default locale, can be overridden
};

/**
 * British Pound Sterling (GBP).
 */
export const GBP: Currency = {
  code: 'GBP',
  decimals: 2,
  symbol: '£',
  locale: 'en-GB',
};

/**
 * Japanese Yen (JPY).
 */
export const JPY: Currency = {
  code: 'JPY',
  decimals: 0,
  symbol: '¥',
  locale: 'ja-JP',
};

/**
 * South African Rand (ZAR).
 */
export const ZAR: Currency = {
  code: 'ZAR',
  decimals: 2,
  symbol: 'R',
  locale: 'en-ZA',
};

/**
 * A collection of common currencies.
 */
export const CURRENCIES: Record<string, Currency> = {
  USD,
  EUR,
  GBP,
  JPY,
  ZAR,
};

/**
 * Retrieves a Currency object by its ISO 4217 code.
 * 
 * @param code - The currency code (case-insensitive).
 * @returns The Currency object corresponding to the code.
 * @throws {Error} If the currency code is not found in the registry.
 */
export function getCurrency(code: string): Currency {
  const currency = CURRENCIES[code.toUpperCase()];
  if (!currency) {
    // Fallback or error? Spec says "Currency Defines Precision".
    // If unknown, we might need to throw or allow custom registration.
    // For now, let's throw if not found, or allow creating one on the fly if we want to be flexible.
    // But spec says "Currency Module... Defines currency metadata".
    // Let's assume for now we only support known ones or user must provide the object.
    throw new Error(`Unknown currency code: ${code}`);
  }
  return currency;
}
