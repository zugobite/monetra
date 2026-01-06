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
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
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
    if (stryMutAct_9fa48("463")) {
      {}
    } else {
      stryCov_9fa48("463");
      this.decimalValue = decimalValue;
    }
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
    if (stryMutAct_9fa48("464")) {
      {}
    } else {
      stryCov_9fa48("464");
      const decimal = (stryMutAct_9fa48("467") ? typeof percent !== "string" : stryMutAct_9fa48("466") ? false : stryMutAct_9fa48("465") ? true : (stryCov_9fa48("465", "466", "467"), typeof percent === (stryMutAct_9fa48("468") ? "" : (stryCov_9fa48("468"), "string")))) ? parseFloat(percent) : percent;
      const scaled = BigInt(Math.round(stryMutAct_9fa48("469") ? decimal / 100 / Number(Rate.SCALE) : (stryCov_9fa48("469"), (stryMutAct_9fa48("470") ? decimal * 100 : (stryCov_9fa48("470"), decimal / 100)) * Number(Rate.SCALE))));
      return new Rate(scaled);
    }
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
    if (stryMutAct_9fa48("471")) {
      {}
    } else {
      stryCov_9fa48("471");
      const value = (stryMutAct_9fa48("474") ? typeof decimal !== "string" : stryMutAct_9fa48("473") ? false : stryMutAct_9fa48("472") ? true : (stryCov_9fa48("472", "473", "474"), typeof decimal === (stryMutAct_9fa48("475") ? "" : (stryCov_9fa48("475"), "string")))) ? parseFloat(decimal) : decimal;
      const scaled = BigInt(Math.round(stryMutAct_9fa48("476") ? value / Number(Rate.SCALE) : (stryCov_9fa48("476"), value * Number(Rate.SCALE))));
      return new Rate(scaled);
    }
  }

  /**
   * Creates a Rate representing zero.
   *
   * @returns A Rate of 0%.
   */
  static zero(): Rate {
    if (stryMutAct_9fa48("477")) {
      {}
    } else {
      stryCov_9fa48("477");
      return new Rate(0n);
    }
  }

  /**
   * Returns the rate as a percentage (e.g., 5 for 5%).
   *
   * @returns The percentage value as a number.
   */
  toPercent(): number {
    if (stryMutAct_9fa48("478")) {
      {}
    } else {
      stryCov_9fa48("478");
      return stryMutAct_9fa48("479") ? Number(this.decimalValue) / Number(Rate.SCALE) / 100 : (stryCov_9fa48("479"), (stryMutAct_9fa48("480") ? Number(this.decimalValue) * Number(Rate.SCALE) : (stryCov_9fa48("480"), Number(this.decimalValue) / Number(Rate.SCALE))) * 100);
    }
  }

  /**
   * Returns the rate as a decimal (e.g., 0.05 for 5%).
   *
   * @returns The decimal value as a number.
   */
  toDecimal(): number {
    if (stryMutAct_9fa48("481")) {
      {}
    } else {
      stryCov_9fa48("481");
      return stryMutAct_9fa48("482") ? Number(this.decimalValue) * Number(Rate.SCALE) : (stryCov_9fa48("482"), Number(this.decimalValue) / Number(Rate.SCALE));
    }
  }

  /**
   * Adds another rate to this one.
   *
   * @param other - The rate to add.
   * @returns A new Rate representing the sum.
   */
  add(other: Rate): Rate {
    if (stryMutAct_9fa48("483")) {
      {}
    } else {
      stryCov_9fa48("483");
      return new Rate(stryMutAct_9fa48("484") ? this.decimalValue - other.decimalValue : (stryCov_9fa48("484"), this.decimalValue + other.decimalValue));
    }
  }

  /**
   * Subtracts another rate from this one.
   *
   * @param other - The rate to subtract.
   * @returns A new Rate representing the difference.
   */
  subtract(other: Rate): Rate {
    if (stryMutAct_9fa48("485")) {
      {}
    } else {
      stryCov_9fa48("485");
      return new Rate(stryMutAct_9fa48("486") ? this.decimalValue + other.decimalValue : (stryCov_9fa48("486"), this.decimalValue - other.decimalValue));
    }
  }

  /**
   * Multiplies this rate by a scalar.
   *
   * @param multiplier - The number to multiply by.
   * @returns A new Rate representing the product.
   */
  multiply(multiplier: number): Rate {
    if (stryMutAct_9fa48("487")) {
      {}
    } else {
      stryCov_9fa48("487");
      const scaled = BigInt(Math.round(stryMutAct_9fa48("488") ? multiplier / Number(Rate.SCALE) : (stryCov_9fa48("488"), multiplier * Number(Rate.SCALE))));
      return new Rate(stryMutAct_9fa48("489") ? this.decimalValue * scaled * Rate.SCALE : (stryCov_9fa48("489"), (stryMutAct_9fa48("490") ? this.decimalValue / scaled : (stryCov_9fa48("490"), this.decimalValue * scaled)) / Rate.SCALE));
    }
  }

  /**
   * Divides this rate by a divisor.
   *
   * @param divisor - The number to divide by.
   * @returns A new Rate representing the quotient.
   */
  divide(divisor: number): Rate {
    if (stryMutAct_9fa48("491")) {
      {}
    } else {
      stryCov_9fa48("491");
      const scaled = BigInt(Math.round(stryMutAct_9fa48("492") ? divisor / Number(Rate.SCALE) : (stryCov_9fa48("492"), divisor * Number(Rate.SCALE))));
      return new Rate(stryMutAct_9fa48("493") ? this.decimalValue * Rate.SCALE * scaled : (stryCov_9fa48("493"), (stryMutAct_9fa48("494") ? this.decimalValue / Rate.SCALE : (stryCov_9fa48("494"), this.decimalValue * Rate.SCALE)) / scaled));
    }
  }

  /**
   * Checks if this rate equals another.
   *
   * @param other - The rate to compare.
   * @returns True if the rates are equal.
   */
  equals(other: Rate): boolean {
    if (stryMutAct_9fa48("495")) {
      {}
    } else {
      stryCov_9fa48("495");
      return stryMutAct_9fa48("498") ? this.decimalValue !== other.decimalValue : stryMutAct_9fa48("497") ? false : stryMutAct_9fa48("496") ? true : (stryCov_9fa48("496", "497", "498"), this.decimalValue === other.decimalValue);
    }
  }

  /**
   * Checks if this rate is greater than another.
   *
   * @param other - The rate to compare.
   * @returns True if this rate is greater.
   */
  greaterThan(other: Rate): boolean {
    if (stryMutAct_9fa48("499")) {
      {}
    } else {
      stryCov_9fa48("499");
      return stryMutAct_9fa48("503") ? this.decimalValue <= other.decimalValue : stryMutAct_9fa48("502") ? this.decimalValue >= other.decimalValue : stryMutAct_9fa48("501") ? false : stryMutAct_9fa48("500") ? true : (stryCov_9fa48("500", "501", "502", "503"), this.decimalValue > other.decimalValue);
    }
  }

  /**
   * Checks if this rate is less than another.
   *
   * @param other - The rate to compare.
   * @returns True if this rate is less.
   */
  lessThan(other: Rate): boolean {
    if (stryMutAct_9fa48("504")) {
      {}
    } else {
      stryCov_9fa48("504");
      return stryMutAct_9fa48("508") ? this.decimalValue >= other.decimalValue : stryMutAct_9fa48("507") ? this.decimalValue <= other.decimalValue : stryMutAct_9fa48("506") ? false : stryMutAct_9fa48("505") ? true : (stryCov_9fa48("505", "506", "507", "508"), this.decimalValue < other.decimalValue);
    }
  }

  /**
   * Checks if this rate is zero.
   *
   * @returns True if the rate is 0%.
   */
  isZero(): boolean {
    if (stryMutAct_9fa48("509")) {
      {}
    } else {
      stryCov_9fa48("509");
      return stryMutAct_9fa48("512") ? this.decimalValue !== 0n : stryMutAct_9fa48("511") ? false : stryMutAct_9fa48("510") ? true : (stryCov_9fa48("510", "511", "512"), this.decimalValue === 0n);
    }
  }

  /**
   * Checks if this rate is negative.
   *
   * @returns True if the rate is negative.
   */
  isNegative(): boolean {
    if (stryMutAct_9fa48("513")) {
      {}
    } else {
      stryCov_9fa48("513");
      return stryMutAct_9fa48("517") ? this.decimalValue >= 0n : stryMutAct_9fa48("516") ? this.decimalValue <= 0n : stryMutAct_9fa48("515") ? false : stryMutAct_9fa48("514") ? true : (stryCov_9fa48("514", "515", "516", "517"), this.decimalValue < 0n);
    }
  }

  /**
   * Returns a string representation of the rate as a percentage.
   *
   * @returns The rate as a percentage string (e.g., "5.5%").
   */
  toString(): string {
    if (stryMutAct_9fa48("518")) {
      {}
    } else {
      stryCov_9fa48("518");
      return stryMutAct_9fa48("519") ? `` : (stryCov_9fa48("519"), `${this.toPercent()}%`);
    }
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
    if (stryMutAct_9fa48("520")) {
      {}
    } else {
      stryCov_9fa48("520");
      return Math.pow(stryMutAct_9fa48("521") ? 1 - this.toDecimal() : (stryCov_9fa48("521"), 1 + this.toDecimal()), periods);
    }
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
    if (stryMutAct_9fa48("522")) {
      {}
    } else {
      stryCov_9fa48("522");
      return this.divide(periodsPerYear);
    }
  }

  /**
   * Converts an effective rate to a nominal rate.
   *
   * @param periodsPerYear - Number of compounding periods per year.
   * @returns The nominal annual rate.
   */
  toNominal(periodsPerYear: number): Rate {
    if (stryMutAct_9fa48("523")) {
      {}
    } else {
      stryCov_9fa48("523");
      const effectiveDecimal = this.toDecimal();
      const nominalDecimal = stryMutAct_9fa48("524") ? periodsPerYear / (Math.pow(1 + effectiveDecimal, 1 / periodsPerYear) - 1) : (stryCov_9fa48("524"), periodsPerYear * (stryMutAct_9fa48("525") ? Math.pow(1 + effectiveDecimal, 1 / periodsPerYear) + 1 : (stryCov_9fa48("525"), Math.pow(stryMutAct_9fa48("526") ? 1 - effectiveDecimal : (stryCov_9fa48("526"), 1 + effectiveDecimal), stryMutAct_9fa48("527") ? 1 * periodsPerYear : (stryCov_9fa48("527"), 1 / periodsPerYear)) - 1)));
      return Rate.decimal(nominalDecimal);
    }
  }

  /**
   * Converts a nominal rate to an effective annual rate.
   *
   * @param periodsPerYear - Number of compounding periods per year.
   * @returns The effective annual rate.
   */
  toEffective(periodsPerYear: number): Rate {
    if (stryMutAct_9fa48("528")) {
      {}
    } else {
      stryCov_9fa48("528");
      const nominalDecimal = this.toDecimal();
      const effectiveDecimal = stryMutAct_9fa48("529") ? Math.pow(1 + nominalDecimal / periodsPerYear, periodsPerYear) + 1 : (stryCov_9fa48("529"), Math.pow(stryMutAct_9fa48("530") ? 1 - nominalDecimal / periodsPerYear : (stryCov_9fa48("530"), 1 + (stryMutAct_9fa48("531") ? nominalDecimal * periodsPerYear : (stryCov_9fa48("531"), nominalDecimal / periodsPerYear))), periodsPerYear) - 1);
      return Rate.decimal(effectiveDecimal);
    }
  }

  /**
   * Returns a JSON representation.
   */
  toJSON(): {
    percent: number;
    decimal: number;
  } {
    if (stryMutAct_9fa48("532")) {
      {}
    } else {
      stryCov_9fa48("532");
      return stryMutAct_9fa48("533") ? {} : (stryCov_9fa48("533"), {
        percent: this.toPercent(),
        decimal: this.toDecimal()
      });
    }
  }
}