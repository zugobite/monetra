import { Currency } from "../currency/Currency";
import { getCurrency } from "../currency/registry";
import { RoundingMode } from "../rounding/strategies";

import { assertSameCurrency } from "./guards";
import { add, subtract, multiply, divide } from "./arithmetic";
import { allocate } from "./allocation";
import { parseToMinor } from "../format/parser";
import { format } from "../format/formatter";

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

  private static resolveCurrency(currency: Currency | string): Currency {
    if (typeof currency === "string") {
      return getCurrency(currency);
    }
    return currency;
  }

  /**
   * Creates a Money instance from minor units (e.g., cents).
   *
   * @param minor - The amount in minor units. Can be a number or BigInt.
   * @param currency - The currency of the money (object or code string).
   * @returns A new Money instance.
   * @example
   * const m = Money.fromMinor(100, USD); // $1.00
   * const m2 = Money.fromMinor(100, 'USD'); // $1.00
   */
  static fromMinor(minor: bigint | number, currency: Currency | string): Money {
    return new Money(BigInt(minor), Money.resolveCurrency(currency));
  }

  /**
   * Alias for `fromMinor`. Creates a Money instance from cents/minor units.
   *
   * @param cents - The amount in minor units.
   * @param currency - The currency of the money (object or code string).
   * @returns A new Money instance.
   * @example
   * const m = Money.fromCents(100, 'USD'); // $1.00
   */
  static fromCents(cents: bigint | number, currency: Currency | string): Money {
    return Money.fromMinor(cents, currency);
  }

  /**
   * Creates a Money instance from major units (e.g., "10.50").
   *
   * @param amount - The amount as a string. Must be a valid decimal number.
   * @param currency - The currency of the money (object or code string).
   * @returns A new Money instance.
   * @throws {InvalidPrecisionError} If the amount has more decimal places than the currency allows.
   * @example
   * const m = Money.fromMajor("10.50", USD); // $10.50
   */
  static fromMajor(amount: string, currency: Currency | string): Money {
    const resolvedCurrency = Money.resolveCurrency(currency);
    const minor = parseToMinor(amount, resolvedCurrency);
    return new Money(minor, resolvedCurrency);
  }

  /**
   * Alias for `fromMajor`. Creates a Money instance from a decimal string.
   *
   * @param amount - The amount as a string (e.g., "10.50").
   * @param currency - The currency of the money (object or code string).
   * @returns A new Money instance.
   * @throws {InvalidPrecisionError} If the amount has more decimal places than the currency allows.
   * @example
   * const m = Money.fromDecimal("10.50", 'USD'); // $10.50
   */
  static fromDecimal(amount: string, currency: Currency | string): Money {
    return Money.fromMajor(amount, currency);
  }

  /**
   * Creates a Money instance from a floating-point number.
   *
   * ⚠️ WARNING: Floating-point numbers can have precision issues.
   * Prefer `Money.fromMajor("10.50", currency)` for exact values.
   *
   * @param amount - The float amount in major units.
   * @param currency - The currency.
   * @param options - Options for handling precision.
   * @returns A new Money instance.
   */
  static fromFloat(
    amount: number,
    currency: Currency | string,
    options?: {
      rounding?: RoundingMode;
      suppressWarning?: boolean;
    },
  ): Money {
    if (!options?.suppressWarning && process.env.NODE_ENV !== "production") {
      console.warn(
        "[monetra] Money.fromFloat() may lose precision. " +
          'Consider using Money.fromMajor("' +
          amount +
          '", currency) instead.',
      );
    }
    const resolvedCurrency = Money.resolveCurrency(currency);
    const factor = 10 ** resolvedCurrency.decimals;
    const minorUnits = Math.round(amount * factor);
    return new Money(BigInt(minorUnits), resolvedCurrency);
  }

  /**
   * Returns the minimum of the provided Money values.
   * @param values - Money values to compare (must all be same currency).
   * @returns The Money with the smallest amount.
   * @throws {CurrencyMismatchError} If currencies don't match.
   */
  static min(...values: Money[]): Money {
    if (values.length === 0)
      throw new Error("At least one Money value required");
    return values.reduce((min, current) => {
      assertSameCurrency(min, current);
      return current.lessThan(min) ? current : min;
    });
  }

  /**
   * Returns the maximum of the provided Money values.
   * @param values - Money values to compare (must all be same currency).
   * @returns The Money with the largest amount.
   * @throws {CurrencyMismatchError} If currencies don't match.
   */
  static max(...values: Money[]): Money {
    if (values.length === 0)
      throw new Error("At least one Money value required");
    return values.reduce((max, current) => {
      assertSameCurrency(max, current);
      return current.greaterThan(max) ? current : max;
    });
  }

  /**
   * Creates a Money instance representing zero in the given currency.
   *
   * @param currency - The currency.
   * @returns A new Money instance with value 0.
   */
  static zero(currency: Currency | string): Money {
    return new Money(0n, Money.resolveCurrency(currency));
  }

  private resolveOther(other: Money | number | bigint | string): Money {
    if (other instanceof Money) {
      return other;
    }
    if (typeof other === "string") {
      return Money.fromMajor(other, this.currency);
    }
    return Money.fromMinor(other, this.currency);
  }

  /**
   * Adds another Money value to this one.
   *
   * @param other - The value to add (Money, minor units as number/bigint, or major units as string).
   * @returns A new Money instance representing the sum.
   * @throws {CurrencyMismatchError} If the currencies do not match.
   */
  add(other: Money | number | bigint | string): Money {
    const otherMoney = this.resolveOther(other);
    assertSameCurrency(this, otherMoney);
    return new Money(add(this.minor, otherMoney.minor), this.currency);
  }

  /**
   * Subtracts another Money value from this one.
   *
   * @param other - The value to subtract (Money, minor units as number/bigint, or major units as string).
   * @returns A new Money instance representing the difference.
   * @throws {CurrencyMismatchError} If the currencies do not match.
   */
  subtract(other: Money | number | bigint | string): Money {
    const otherMoney = this.resolveOther(other);
    assertSameCurrency(this, otherMoney);
    return new Money(subtract(this.minor, otherMoney.minor), this.currency);
  }

  /**
   * Multiplies this Money value by a scalar.
   *
   * @param multiplier - The number to multiply by.
   * @param options - Options for rounding if the result is not an integer.
   * @returns A new Money instance representing the product.
   * @throws {RoundingRequiredError} If the result is fractional and no rounding mode is provided.
   */
  multiply(
    multiplier: string | number,
    options?: { rounding?: RoundingMode },
  ): Money {
    const result = multiply(this.minor, multiplier, options?.rounding);
    return new Money(result, this.currency);
  }

  /**
   * Divides this Money value by a divisor.
   *
   * @param divisor - The number to divide by.
   * @param options - Options for rounding if the result is not an integer.
   * @returns A new Money instance representing the quotient.
   * @throws {RoundingRequiredError} If the result is fractional and no rounding mode is provided.
   * @throws {Error} If divisor is zero.
   */
  divide(
    divisor: number | string,
    options?: { rounding?: RoundingMode },
  ): Money {
    if (divisor === 0 || divisor === "0") {
      throw new Error("Division by zero");
    }
    const result = divide(this.minor, divisor, options?.rounding);
    return new Money(result, this.currency);
  }

  /**
   * Returns the absolute value of this Money.
   * @returns A new Money instance with the absolute value.
   */
  abs(): Money {
    return new Money(this.minor < 0n ? -this.minor : this.minor, this.currency);
  }

  /**
   * Returns the negated value of this Money.
   * @returns A new Money instance with the negated value.
   */
  negate(): Money {
    return new Money(-this.minor, this.currency);
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
    return shares.map((share) => new Money(share, this.currency));
  }

  /**
   * Formats this Money value as a string.
   *
   * @param options - Formatting options.
   * @returns The formatted string.
   */
  format(options?: {
    locale?: string;
    symbol?: boolean;
    display?: "symbol" | "code" | "name";
  }): string {
    return format(this, options);
  }

  /**
   * Checks if this Money value is equal to another.
   *
   * @param other - The other Money value (Money, minor units as number/bigint, or major units as string).
   * @returns True if amounts and currencies are equal.
   */
  equals(other: Money | number | bigint | string): boolean {
    const otherMoney = this.resolveOther(other);
    return (
      this.currency.code === otherMoney.currency.code &&
      this.minor === otherMoney.minor
    );
  }

  /**
   * Checks if this Money value is greater than another.
   *
   * @param other - The other Money value (Money, minor units as number/bigint, or major units as string).
   * @returns True if this value is greater.
   * @throws {CurrencyMismatchError} If the currencies do not match.
   */
  greaterThan(other: Money | number | bigint | string): boolean {
    const otherMoney = this.resolveOther(other);
    assertSameCurrency(this, otherMoney);
    return this.minor > otherMoney.minor;
  }

  /**
   * Checks if this Money value is less than another.
   *
   * @param other - The other Money value (Money, minor units as number/bigint, or major units as string).
   * @returns True if this value is less.
   * @throws {CurrencyMismatchError} If the currencies do not match.
   */
  lessThan(other: Money | number | bigint | string): boolean {
    const otherMoney = this.resolveOther(other);
    assertSameCurrency(this, otherMoney);
    return this.minor < otherMoney.minor;
  }

  /**
   * Checks if this Money value is greater than or equal to another.
   */
  greaterThanOrEqual(other: Money | number | bigint | string): boolean {
    const otherMoney = this.resolveOther(other);
    assertSameCurrency(this, otherMoney);
    return this.minor >= otherMoney.minor;
  }

  /**
   * Checks if this Money value is less than or equal to another.
   */
  lessThanOrEqual(other: Money | number | bigint | string): boolean {
    const otherMoney = this.resolveOther(other);
    assertSameCurrency(this, otherMoney);
    return this.minor <= otherMoney.minor;
  }

  /**
   * Checks if this Money value is positive (greater than zero).
   */
  isPositive(): boolean {
    return this.minor > 0n;
  }

  /**
   * Compares this Money to another, returning -1, 0, or 1.
   * Useful for sorting.
   */
  compare(other: Money | number | bigint | string): -1 | 0 | 1 {
    const otherMoney = this.resolveOther(other);
    assertSameCurrency(this, otherMoney);
    if (this.minor < otherMoney.minor) return -1;
    if (this.minor > otherMoney.minor) return 1;
    return 0;
  }

  /**
   * Calculates a percentage of the money.
   * @param percent - The percentage (e.g., 50 for 50%).
   * @param rounding - Rounding mode (defaults to HALF_EVEN).
   */
  percentage(
    percent: number,
    rounding: RoundingMode = RoundingMode.HALF_EVEN,
  ): Money {
    return this.multiply(percent / 100, { rounding });
  }

  /**
   * Adds a percentage to the money.
   * @param percent - The percentage to add.
   * @param rounding - Rounding mode.
   */
  addPercent(
    percent: number,
    rounding: RoundingMode = RoundingMode.HALF_EVEN,
  ): Money {
    return this.add(this.percentage(percent, rounding));
  }

  /**
   * Subtracts a percentage from the money.
   * @param percent - The percentage to subtract.
   * @param rounding - Rounding mode.
   */
  subtractPercent(
    percent: number,
    rounding: RoundingMode = RoundingMode.HALF_EVEN,
  ): Money {
    return this.subtract(this.percentage(percent, rounding));
  }

  /**
   * Splits the money into equal parts.
   * @param parts - Number of parts.
   */
  split(parts: number): Money[] {
    const ratios = Array(parts).fill(1);
    return this.allocate(ratios);
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

  /**
   * Clamps this Money value between a minimum and maximum.
   *
   * @param min - The minimum Money value.
   * @param max - The maximum Money value.
   * @returns A new Money instance clamped between min and max.
   * @throws {CurrencyMismatchError} If currencies don't match.
   * @throws {Error} If min is greater than max.
   * @example
   * const price = Money.fromMajor("150", 'USD');
   * const clamped = price.clamp(Money.fromMajor("50", 'USD'), Money.fromMajor("100", 'USD'));
   * // clamped is $100.00
   */
  clamp(min: Money, max: Money): Money {
    assertSameCurrency(this, min);
    assertSameCurrency(this, max);

    if (min.greaterThan(max)) {
      throw new Error("Clamp min cannot be greater than max");
    }

    if (this.lessThan(min)) {
      return new Money(min.minor, this.currency);
    }
    if (this.greaterThan(max)) {
      return new Money(max.minor, this.currency);
    }
    return this;
  }

  /**
   * Returns the value as a decimal string without locale formatting.
   *
   * This returns a raw decimal representation suitable for storage or calculations,
   * without any currency symbols, grouping separators, or locale-specific formatting.
   *
   * @returns The decimal string representation (e.g., "10.50", "-5.25").
   * @example
   * const m = Money.fromMajor("1234.56", 'USD');
   * m.toDecimalString(); // "1234.56"
   */
  toDecimalString(): string {
    const decimals = this.currency.decimals;
    const isNegative = this.minor < 0n;
    const absMinor = isNegative ? -this.minor : this.minor;

    if (decimals === 0) {
      return isNegative ? `-${absMinor.toString()}` : absMinor.toString();
    }

    const divisor = 10n ** BigInt(decimals);
    const integerPart = absMinor / divisor;
    const fractionalPart = absMinor % divisor;

    const fractionalStr = fractionalPart.toString().padStart(decimals, "0");
    const result = `${integerPart}.${fractionalStr}`;

    return isNegative ? `-${result}` : result;
  }

  /**
   * Returns a JSON representation of the Money object.
   *
   * @returns An object with amount (string), currency (code), and precision.
   */
  toJSON(): { amount: string; currency: string; precision: number } {
    return {
      amount: this.minor.toString(),
      currency: this.currency.code,
      precision: this.currency.decimals,
    };
  }

  /**
   * JSON reviver function for deserializing Money objects.
   *
   * Use with `JSON.parse()` to automatically reconstruct Money instances:
   *
   * @param key - The JSON key (unused).
   * @param value - The parsed JSON value.
   * @returns A Money instance if value is a serialized Money object, otherwise the original value.
   * @example
   * const json = '{"amount": "1050", "currency": "USD", "precision": 2}';
   * const money = JSON.parse(json, Money.reviver);
   * // money is Money instance: $10.50
   */
  static reviver(key: string, value: unknown): unknown {
    if (
      value !== null &&
      typeof value === "object" &&
      "amount" in value &&
      "currency" in value &&
      "precision" in value &&
      typeof (value as Record<string, unknown>).amount === "string" &&
      typeof (value as Record<string, unknown>).currency === "string" &&
      typeof (value as Record<string, unknown>).precision === "number"
    ) {
      const obj = value as {
        amount: string;
        currency: string;
        precision: number;
      };
      return Money.fromMinor(BigInt(obj.amount), obj.currency);
    }
    return value;
  }

  /**
   * Returns a string representation of the Money object (formatted).
   */
  toString(): string {
    return this.format();
  }
}
