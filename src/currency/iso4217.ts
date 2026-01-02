import { Currency } from "./Currency";
import { registerCurrency } from "./registry";

/**
 * United States Dollar (USD).
 */
export const USD: Currency = {
  code: "USD",
  decimals: 2,
  symbol: "$",
  locale: "en-US",
};
registerCurrency(USD);

/**
 * Euro (EUR).
 */
export const EUR: Currency = {
  code: "EUR",
  decimals: 2,
  symbol: "€",
  locale: "de-DE", // Default locale, can be overridden
};
registerCurrency(EUR);

/**
 * British Pound Sterling (GBP).
 */
export const GBP: Currency = {
  code: "GBP",
  decimals: 2,
  symbol: "£",
  locale: "en-GB",
};
registerCurrency(GBP);

/**
 * Japanese Yen (JPY).
 */
export const JPY: Currency = {
  code: "JPY",
  decimals: 0,
  symbol: "¥",
  locale: "ja-JP",
};
registerCurrency(JPY);

/**
 * South African Rand (ZAR).
 */
export const ZAR: Currency = {
  code: "ZAR",
  decimals: 2,
  symbol: "R",
  locale: "en-ZA",
};
registerCurrency(ZAR);
