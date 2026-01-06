import { Money } from "./Money";
import { Currency } from "../currency/Currency";
import { getCurrency } from "../currency/registry";
import { RoundingMode } from "../rounding";

/**
 * Handles currency conversion using exchange rates.
 */
export class Converter {
  private rates: Record<string, number>;
  private base: string;

  /**
   * Creates a new Converter.
   *
   * @param base - The base currency code (e.g., "USD").
   * @param rates - A map of currency codes to exchange rates relative to the base.
   *                Example: { "EUR": 0.85, "GBP": 0.75 } (where 1 Base = 0.85 EUR).
   */
  constructor(base: string, rates: Record<string, number>) {
    this.base = base;
    this.rates = { ...rates };

    // Ensure base rate is 1
    if (this.rates[base] === undefined) {
      this.rates[base] = 1;
    }
  }

  /**
   * Converts a Money object to a target currency.
   *
   * @param money - The Money object to convert.
   * @param toCurrency - The target currency (code or object).
   * @returns A new Money object in the target currency.
   * @throws {Error} If exchange rates are missing.
   */
  convert(money: Money, toCurrency: Currency | string): Money {
    const targetCurrency =
      typeof toCurrency === "string" ? getCurrency(toCurrency) : toCurrency;

    if (money.currency.code === targetCurrency.code) {
      return money;
    }

    const fromRate = this.rates[money.currency.code];
    const toRate = this.rates[targetCurrency.code];

    if (fromRate === undefined || toRate === undefined) {
      throw new Error(
        `Exchange rate missing for conversion from ${money.currency.code} to ${targetCurrency.code}`,
      );
    }

    // Calculate the exchange rate ratio
    const ratio = toRate / fromRate;

    // Adjust for difference in decimal places
    // targetMinor = sourceMinor * ratio * 10^(targetDecimals - sourceDecimals)
    const decimalAdjustment =
      10 ** (targetCurrency.decimals - money.currency.decimals);

    // We use the multiply method of Money which handles rounding.
    // Default rounding is usually needed for conversion.
    // We'll use the default rounding (HALF_EVEN is common for money, but Money.multiply requires explicit if fractional).
    // Let's assume standard rounding (HALF_UP) or require options?
    // For ease of use, we should probably default to HALF_UP or similar.
    // But Money.multiply throws if rounding is needed and not provided.

    // Let's pass a default rounding mode.
    // We need to import RoundingMode.

    const multiplier = ratio * decimalAdjustment;

    // We need to access the internal multiply or use the public one.
    // Public one: money.multiply(multiplier, { rounding: 'HALF_EVEN' })

    const convertedAmount = money.multiply(multiplier, {
      rounding: RoundingMode.HALF_EVEN,
    });
    return Money.fromMinor(convertedAmount.minor, targetCurrency);
  }
}
