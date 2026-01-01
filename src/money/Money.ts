import { Currency } from '../currency/Currency';
import { RoundingMode } from '../rounding/strategies';
import { assertSameCurrency } from './guards';
import { add, subtract, multiply } from './arithmetic';
import { allocate } from './allocation';
import { parseToMinor } from '../format/parser';
import { format } from '../format/formatter';

/**
 * Represents a monetary value in a specific currency.
 * 
 * Money objects are immutable and store values in minor units (e.g., cents) using BigInt
 * to avoid floating-point precision errors.
 */
export class Money {
  /**
   * The amount in minor units (e.g., cents).
   */
  readonly minor: bigint;

  /**
   * The currency of this money value.
   */
  readonly currency: Currency;

  private constructor(minor: bigint, currency: Currency) {
    this.minor = minor;
    this.currency = currency;
  }

  /**
   * Creates a Money instance from minor units (e.g., cents).
   * 
   * @param minor - The amount in minor units. Can be a number or BigInt.
   * @param currency - The currency of the money.
   * @returns A new Money instance.
   * @example
   * const m = Money.fromMinor(100, USD); // $1.00
   */
  static fromMinor(minor: bigint | number, currency: Currency): Money {
    return new Money(BigInt(minor), currency);
  }

  /**
   * Creates a Money instance from major units (e.g., "10.50").
   * 
   * @param amount - The amount as a string. Must be a valid decimal number.
   * @param currency - The currency of the money.
   * @returns A new Money instance.
   * @throws {InvalidPrecisionError} If the amount has more decimal places than the currency allows.
   * @example
   * const m = Money.fromMajor("10.50", USD); // $10.50
   */
  static fromMajor(amount: string, currency: Currency): Money {
    const minor = parseToMinor(amount, currency);
    return new Money(minor, currency);
  }

  /**
   * Creates a Money instance representing zero in the given currency.
   * 
   * @param currency - The currency.
   * @returns A new Money instance with value 0.
   */
  static zero(currency: Currency): Money {
    return new Money(0n, currency);
  }

  /**
   * Adds another Money value to this one.
   * 
   * @param other - The Money value to add.
   * @returns A new Money instance representing the sum.
   * @throws {CurrencyMismatchError} If the currencies do not match.
   */
  add(other: Money): Money {
    assertSameCurrency(this, other);
    return new Money(add(this.minor, other.minor), this.currency);
  }

  /**
   * Subtracts another Money value from this one.
   * 
   * @param other - The Money value to subtract.
   * @returns A new Money instance representing the difference.
   * @throws {CurrencyMismatchError} If the currencies do not match.
   */
  subtract(other: Money): Money {
    assertSameCurrency(this, other);
    return new Money(subtract(this.minor, other.minor), this.currency);
  }

  /**
   * Multiplies this Money value by a scalar.
   * 
   * @param multiplier - The number to multiply by.
   * @param options - Options for rounding if the result is not an integer.
   * @returns A new Money instance representing the product.
   * @throws {RoundingRequiredError} If the result is fractional and no rounding mode is provided.
   */
  multiply(multiplier: string | number, options?: { rounding?: RoundingMode }): Money {
    const result = multiply(this.minor, multiplier, options?.rounding);
    return new Money(result, this.currency);
  }

  /**
   * Allocates (splits) this Money value according to a list of ratios.
   * 
   * The sum of the parts will always equal the original amount.
   * Remainders are distributed to the parts with the largest fractional remainders.
   * 
   * @param ratios - A list of numbers representing the ratios to split by.
   * @returns An array of Money instances.
   */
  allocate(ratios: number[]): Money[] {
    const shares = allocate(this.minor, ratios);
    return shares.map(share => new Money(share, this.currency));
  }

  /**
   * Formats this Money value as a string.
   * 
   * @param options - Formatting options.
   * @returns The formatted string.
   */
  format(options?: { locale?: string; symbol?: boolean }): string {
    return format(this, options);
  }

  /**
   * Checks if this Money value is equal to another.
   * 
   * @param other - The other Money value.
   * @returns True if amounts and currencies are equal.
   */
  equals(other: Money): boolean {
    return this.currency.code === other.currency.code && this.minor === other.minor;
  }

  /**
   * Checks if this Money value is greater than another.
   * 
   * @param other - The other Money value.
   * @returns True if this value is greater.
   * @throws {CurrencyMismatchError} If the currencies do not match.
   */
  greaterThan(other: Money): boolean {
    assertSameCurrency(this, other);
    return this.minor > other.minor;
  }

  /**
   * Checks if this Money value is less than another.
   * 
   * @param other - The other Money value.
   * @returns True if this value is less.
   * @throws {CurrencyMismatchError} If the currencies do not match.
   */
  lessThan(other: Money): boolean {
    assertSameCurrency(this, other);
    return this.minor < other.minor;
  }

  /**
   * Checks if this Money value is zero.
   * 
   * @returns True if the amount is zero.
   */
  isZero(): boolean {
    return this.minor === 0n;
  }

  /**
   * Checks if this Money value is negative.
   * 
   * @returns True if the amount is negative.
   */
  isNegative(): boolean {
    return this.minor < 0n;
  }
}
