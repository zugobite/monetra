/**
 * Represents an interest rate or percentage rate with explicit handling
 * to avoid confusion between percentage and decimal forms.
 *
 * @example
 * const rate = Rate.percent(5);     // 5% interest rate
 * const rate2 = Rate.decimal(0.05); // Same as 5%
 *
 * rate.toPercent();  // 5
 * rate.toDecimal();  // 0.05
 *
 * // Safe operations
 * rate.add(Rate.percent(2));  // 7%
 * rate.multiply(2);           // 10%
 */
export class Rate {
  /**
   * Internal storage as a decimal (e.g., 0.05 for 5%).
   * Uses a scaled BigInt internally for precision.
   */
  private readonly decimalValue: bigint;

  /**
   * Scale factor for internal precision (1e18 for 18 decimal places).
   */
  private static readonly SCALE = 10n ** 18n;

  private constructor(decimalValue: bigint) {
    this.decimalValue = decimalValue;
  }

  /**
   * Creates a Rate from a percentage value (e.g., 5 for 5%).
   *
   * @param percent - The percentage value.
   * @returns A new Rate instance.
   * @example
   * const rate = Rate.percent(5.5); // 5.5%
   */
  static percent(percent: number | string): Rate {
    const decimal = typeof percent === "string" ? parseFloat(percent) : percent;
    const scaled = BigInt(Math.round((decimal / 100) * Number(Rate.SCALE)));
    return new Rate(scaled);
  }

  /**
   * Creates a Rate from a decimal value (e.g., 0.05 for 5%).
   *
   * @param decimal - The decimal value.
   * @returns A new Rate instance.
   * @example
   * const rate = Rate.decimal(0.055); // 5.5%
   */
  static decimal(decimal: number | string): Rate {
    const value = typeof decimal === "string" ? parseFloat(decimal) : decimal;
    const scaled = BigInt(Math.round(value * Number(Rate.SCALE)));
    return new Rate(scaled);
  }

  /**
   * Creates a Rate representing zero.
   *
   * @returns A Rate of 0%.
   */
  static zero(): Rate {
    return new Rate(0n);
  }

  /**
   * Returns the rate as a percentage (e.g., 5 for 5%).
   *
   * @returns The percentage value as a number.
   */
  toPercent(): number {
    return (Number(this.decimalValue) / Number(Rate.SCALE)) * 100;
  }

  /**
   * Returns the rate as a decimal (e.g., 0.05 for 5%).
   *
   * @returns The decimal value as a number.
   */
  toDecimal(): number {
    return Number(this.decimalValue) / Number(Rate.SCALE);
  }

  /**
   * Adds another rate to this one.
   *
   * @param other - The rate to add.
   * @returns A new Rate representing the sum.
   */
  add(other: Rate): Rate {
    return new Rate(this.decimalValue + other.decimalValue);
  }

  /**
   * Subtracts another rate from this one.
   *
   * @param other - The rate to subtract.
   * @returns A new Rate representing the difference.
   */
  subtract(other: Rate): Rate {
    return new Rate(this.decimalValue - other.decimalValue);
  }

  /**
   * Multiplies this rate by a scalar.
   *
   * @param multiplier - The number to multiply by.
   * @returns A new Rate representing the product.
   */
  multiply(multiplier: number): Rate {
    const scaled = BigInt(Math.round(multiplier * Number(Rate.SCALE)));
    return new Rate((this.decimalValue * scaled) / Rate.SCALE);
  }

  /**
   * Divides this rate by a divisor.
   *
   * @param divisor - The number to divide by.
   * @returns A new Rate representing the quotient.
   */
  divide(divisor: number): Rate {
    const scaled = BigInt(Math.round(divisor * Number(Rate.SCALE)));
    return new Rate((this.decimalValue * Rate.SCALE) / scaled);
  }

  /**
   * Checks if this rate equals another.
   *
   * @param other - The rate to compare.
   * @returns True if the rates are equal.
   */
  equals(other: Rate): boolean {
    return this.decimalValue === other.decimalValue;
  }

  /**
   * Checks if this rate is greater than another.
   *
   * @param other - The rate to compare.
   * @returns True if this rate is greater.
   */
  greaterThan(other: Rate): boolean {
    return this.decimalValue > other.decimalValue;
  }

  /**
   * Checks if this rate is less than another.
   *
   * @param other - The rate to compare.
   * @returns True if this rate is less.
   */
  lessThan(other: Rate): boolean {
    return this.decimalValue < other.decimalValue;
  }

  /**
   * Checks if this rate is zero.
   *
   * @returns True if the rate is 0%.
   */
  isZero(): boolean {
    return this.decimalValue === 0n;
  }

  /**
   * Checks if this rate is negative.
   *
   * @returns True if the rate is negative.
   */
  isNegative(): boolean {
    return this.decimalValue < 0n;
  }

  /**
   * Returns a string representation of the rate as a percentage.
   *
   * @returns The rate as a percentage string (e.g., "5.5%").
   */
  toString(): string {
    return `${this.toPercent()}%`;
  }

  /**
   * Computes compound factor: (1 + rate)^periods.
   *
   * @param periods - The number of compounding periods.
   * @returns The compound factor as a number.
   * @example
   * Rate.percent(10).compoundFactor(3); // (1.10)^3 = 1.331
   */
  compoundFactor(periods: number): number {
    return Math.pow(1 + this.toDecimal(), periods);
  }

  /**
   * Returns the periodic rate for a given frequency.
   *
   * @param periodsPerYear - Number of periods per year (e.g., 12 for monthly).
   * @returns A new Rate representing the periodic rate.
   * @example
   * Rate.percent(12).periodic(12); // 1% monthly
   */
  periodic(periodsPerYear: number): Rate {
    return this.divide(periodsPerYear);
  }

  /**
   * Converts an effective rate to a nominal rate.
   *
   * @param periodsPerYear - Number of compounding periods per year.
   * @returns The nominal annual rate.
   */
  toNominal(periodsPerYear: number): Rate {
    const effectiveDecimal = this.toDecimal();
    const nominalDecimal =
      periodsPerYear * (Math.pow(1 + effectiveDecimal, 1 / periodsPerYear) - 1);
    return Rate.decimal(nominalDecimal);
  }

  /**
   * Converts a nominal rate to an effective annual rate.
   *
   * @param periodsPerYear - Number of compounding periods per year.
   * @returns The effective annual rate.
   */
  toEffective(periodsPerYear: number): Rate {
    const nominalDecimal = this.toDecimal();
    const effectiveDecimal =
      Math.pow(1 + nominalDecimal / periodsPerYear, periodsPerYear) - 1;
    return Rate.decimal(effectiveDecimal);
  }

  /**
   * Returns a JSON representation.
   */
  toJSON(): { percent: number; decimal: number } {
    return {
      percent: this.toPercent(),
      decimal: this.toDecimal(),
    };
  }
}
