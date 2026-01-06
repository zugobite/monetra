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
    if (stryMutAct_9fa48("1029")) {
      {}
    } else {
      stryCov_9fa48("1029");
      this.minor = minor;
      this.currency = currency;
    }
  }
  private static resolveCurrency(currency: Currency | string): Currency {
    if (stryMutAct_9fa48("1030")) {
      {}
    } else {
      stryCov_9fa48("1030");
      if (stryMutAct_9fa48("1033") ? typeof currency !== "string" : stryMutAct_9fa48("1032") ? false : stryMutAct_9fa48("1031") ? true : (stryCov_9fa48("1031", "1032", "1033"), typeof currency === (stryMutAct_9fa48("1034") ? "" : (stryCov_9fa48("1034"), "string")))) {
        if (stryMutAct_9fa48("1035")) {
          {}
        } else {
          stryCov_9fa48("1035");
          return getCurrency(currency);
        }
      }
      return currency;
    }
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
    if (stryMutAct_9fa48("1036")) {
      {}
    } else {
      stryCov_9fa48("1036");
      return new Money(BigInt(minor), Money.resolveCurrency(currency));
    }
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
    if (stryMutAct_9fa48("1037")) {
      {}
    } else {
      stryCov_9fa48("1037");
      return Money.fromMinor(cents, currency);
    }
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
    if (stryMutAct_9fa48("1038")) {
      {}
    } else {
      stryCov_9fa48("1038");
      const resolvedCurrency = Money.resolveCurrency(currency);
      const minor = parseToMinor(amount, resolvedCurrency);
      return new Money(minor, resolvedCurrency);
    }
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
    if (stryMutAct_9fa48("1039")) {
      {}
    } else {
      stryCov_9fa48("1039");
      return Money.fromMajor(amount, currency);
    }
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
  static fromFloat(amount: number, currency: Currency | string, options?: {
    rounding?: RoundingMode;
    suppressWarning?: boolean;
  }): Money {
    if (stryMutAct_9fa48("1040")) {
      {}
    } else {
      stryCov_9fa48("1040");
      if (stryMutAct_9fa48("1043") ? !options?.suppressWarning || process.env.NODE_ENV !== "production" : stryMutAct_9fa48("1042") ? false : stryMutAct_9fa48("1041") ? true : (stryCov_9fa48("1041", "1042", "1043"), (stryMutAct_9fa48("1044") ? options?.suppressWarning : (stryCov_9fa48("1044"), !(stryMutAct_9fa48("1045") ? options.suppressWarning : (stryCov_9fa48("1045"), options?.suppressWarning)))) && (stryMutAct_9fa48("1047") ? process.env.NODE_ENV === "production" : stryMutAct_9fa48("1046") ? true : (stryCov_9fa48("1046", "1047"), process.env.NODE_ENV !== (stryMutAct_9fa48("1048") ? "" : (stryCov_9fa48("1048"), "production")))))) {
        if (stryMutAct_9fa48("1049")) {
          {}
        } else {
          stryCov_9fa48("1049");
          console.warn((stryMutAct_9fa48("1050") ? "" : (stryCov_9fa48("1050"), '[monetra] Money.fromFloat() may lose precision. ')) + (stryMutAct_9fa48("1051") ? "" : (stryCov_9fa48("1051"), 'Consider using Money.fromMajor("')) + amount + (stryMutAct_9fa48("1052") ? "" : (stryCov_9fa48("1052"), '", currency) instead.')));
        }
      }
      const resolvedCurrency = Money.resolveCurrency(currency);
      const factor = 10 ** resolvedCurrency.decimals;
      const minorUnits = Math.round(stryMutAct_9fa48("1053") ? amount / factor : (stryCov_9fa48("1053"), amount * factor));
      return new Money(BigInt(minorUnits), resolvedCurrency);
    }
  }

  /**
   * Returns the minimum of the provided Money values.
   * @param values - Money values to compare (must all be same currency).
   * @returns The Money with the smallest amount.
   * @throws {CurrencyMismatchError} If currencies don't match.
   */
  static min(...values: Money[]): Money {
    if (stryMutAct_9fa48("1054")) {
      {}
    } else {
      stryCov_9fa48("1054");
      if (stryMutAct_9fa48("1057") ? values.length !== 0 : stryMutAct_9fa48("1056") ? false : stryMutAct_9fa48("1055") ? true : (stryCov_9fa48("1055", "1056", "1057"), values.length === 0)) throw new Error(stryMutAct_9fa48("1058") ? "" : (stryCov_9fa48("1058"), "At least one Money value required"));
      return values.reduce((min, current) => {
        if (stryMutAct_9fa48("1059")) {
          {}
        } else {
          stryCov_9fa48("1059");
          assertSameCurrency(min, current);
          return current.lessThan(min) ? current : min;
        }
      });
    }
  }

  /**
   * Returns the maximum of the provided Money values.
   * @param values - Money values to compare (must all be same currency).
   * @returns The Money with the largest amount.
   * @throws {CurrencyMismatchError} If currencies don't match.
   */
  static max(...values: Money[]): Money {
    if (stryMutAct_9fa48("1060")) {
      {}
    } else {
      stryCov_9fa48("1060");
      if (stryMutAct_9fa48("1063") ? values.length !== 0 : stryMutAct_9fa48("1062") ? false : stryMutAct_9fa48("1061") ? true : (stryCov_9fa48("1061", "1062", "1063"), values.length === 0)) throw new Error(stryMutAct_9fa48("1064") ? "" : (stryCov_9fa48("1064"), "At least one Money value required"));
      return values.reduce((max, current) => {
        if (stryMutAct_9fa48("1065")) {
          {}
        } else {
          stryCov_9fa48("1065");
          assertSameCurrency(max, current);
          return current.greaterThan(max) ? current : max;
        }
      });
    }
  }

  /**
   * Creates a Money instance representing zero in the given currency.
   *
   * @param currency - The currency.
   * @returns A new Money instance with value 0.
   */
  static zero(currency: Currency | string): Money {
    if (stryMutAct_9fa48("1066")) {
      {}
    } else {
      stryCov_9fa48("1066");
      return new Money(0n, Money.resolveCurrency(currency));
    }
  }
  private resolveOther(other: Money | number | bigint | string): Money {
    if (stryMutAct_9fa48("1067")) {
      {}
    } else {
      stryCov_9fa48("1067");
      if (stryMutAct_9fa48("1069") ? false : stryMutAct_9fa48("1068") ? true : (stryCov_9fa48("1068", "1069"), other instanceof Money)) {
        if (stryMutAct_9fa48("1070")) {
          {}
        } else {
          stryCov_9fa48("1070");
          return other;
        }
      }
      if (stryMutAct_9fa48("1073") ? typeof other !== "string" : stryMutAct_9fa48("1072") ? false : stryMutAct_9fa48("1071") ? true : (stryCov_9fa48("1071", "1072", "1073"), typeof other === (stryMutAct_9fa48("1074") ? "" : (stryCov_9fa48("1074"), "string")))) {
        if (stryMutAct_9fa48("1075")) {
          {}
        } else {
          stryCov_9fa48("1075");
          return Money.fromMajor(other, this.currency);
        }
      }
      return Money.fromMinor(other, this.currency);
    }
  }

  /**
   * Adds another Money value to this one.
   *
   * @param other - The value to add (Money, minor units as number/bigint, or major units as string).
   * @returns A new Money instance representing the sum.
   * @throws {CurrencyMismatchError} If the currencies do not match.
   */
  add(other: Money | number | bigint | string): Money {
    if (stryMutAct_9fa48("1076")) {
      {}
    } else {
      stryCov_9fa48("1076");
      const otherMoney = this.resolveOther(other);
      assertSameCurrency(this, otherMoney);
      return new Money(add(this.minor, otherMoney.minor), this.currency);
    }
  }

  /**
   * Subtracts another Money value from this one.
   *
   * @param other - The value to subtract (Money, minor units as number/bigint, or major units as string).
   * @returns A new Money instance representing the difference.
   * @throws {CurrencyMismatchError} If the currencies do not match.
   */
  subtract(other: Money | number | bigint | string): Money {
    if (stryMutAct_9fa48("1077")) {
      {}
    } else {
      stryCov_9fa48("1077");
      const otherMoney = this.resolveOther(other);
      assertSameCurrency(this, otherMoney);
      return new Money(subtract(this.minor, otherMoney.minor), this.currency);
    }
  }

  /**
   * Multiplies this Money value by a scalar.
   *
   * @param multiplier - The number to multiply by.
   * @param options - Options for rounding if the result is not an integer.
   * @returns A new Money instance representing the product.
   * @throws {RoundingRequiredError} If the result is fractional and no rounding mode is provided.
   */
  multiply(multiplier: string | number, options?: {
    rounding?: RoundingMode;
  }): Money {
    if (stryMutAct_9fa48("1078")) {
      {}
    } else {
      stryCov_9fa48("1078");
      const result = multiply(this.minor, multiplier, stryMutAct_9fa48("1079") ? options.rounding : (stryCov_9fa48("1079"), options?.rounding));
      return new Money(result, this.currency);
    }
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
  divide(divisor: number | string, options?: {
    rounding?: RoundingMode;
  }): Money {
    if (stryMutAct_9fa48("1080")) {
      {}
    } else {
      stryCov_9fa48("1080");
      if (stryMutAct_9fa48("1083") ? divisor === 0 && divisor === "0" : stryMutAct_9fa48("1082") ? false : stryMutAct_9fa48("1081") ? true : (stryCov_9fa48("1081", "1082", "1083"), (stryMutAct_9fa48("1085") ? divisor !== 0 : stryMutAct_9fa48("1084") ? false : (stryCov_9fa48("1084", "1085"), divisor === 0)) || (stryMutAct_9fa48("1087") ? divisor !== "0" : stryMutAct_9fa48("1086") ? false : (stryCov_9fa48("1086", "1087"), divisor === (stryMutAct_9fa48("1088") ? "" : (stryCov_9fa48("1088"), "0")))))) {
        if (stryMutAct_9fa48("1089")) {
          {}
        } else {
          stryCov_9fa48("1089");
          throw new Error(stryMutAct_9fa48("1090") ? "" : (stryCov_9fa48("1090"), "Division by zero"));
        }
      }
      const result = divide(this.minor, divisor, stryMutAct_9fa48("1091") ? options.rounding : (stryCov_9fa48("1091"), options?.rounding));
      return new Money(result, this.currency);
    }
  }

  /**
   * Returns the absolute value of this Money.
   * @returns A new Money instance with the absolute value.
   */
  abs(): Money {
    if (stryMutAct_9fa48("1092")) {
      {}
    } else {
      stryCov_9fa48("1092");
      return new Money((stryMutAct_9fa48("1096") ? this.minor >= 0n : stryMutAct_9fa48("1095") ? this.minor <= 0n : stryMutAct_9fa48("1094") ? false : stryMutAct_9fa48("1093") ? true : (stryCov_9fa48("1093", "1094", "1095", "1096"), this.minor < 0n)) ? stryMutAct_9fa48("1097") ? +this.minor : (stryCov_9fa48("1097"), -this.minor) : this.minor, this.currency);
    }
  }

  /**
   * Returns the negated value of this Money.
   * @returns A new Money instance with the negated value.
   */
  negate(): Money {
    if (stryMutAct_9fa48("1098")) {
      {}
    } else {
      stryCov_9fa48("1098");
      return new Money(stryMutAct_9fa48("1099") ? +this.minor : (stryCov_9fa48("1099"), -this.minor), this.currency);
    }
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
    if (stryMutAct_9fa48("1100")) {
      {}
    } else {
      stryCov_9fa48("1100");
      const shares = allocate(this.minor, ratios);
      return shares.map(stryMutAct_9fa48("1101") ? () => undefined : (stryCov_9fa48("1101"), share => new Money(share, this.currency)));
    }
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
    if (stryMutAct_9fa48("1102")) {
      {}
    } else {
      stryCov_9fa48("1102");
      return format(this, options);
    }
  }

  /**
   * Checks if this Money value is equal to another.
   *
   * @param other - The other Money value (Money, minor units as number/bigint, or major units as string).
   * @returns True if amounts and currencies are equal.
   */
  equals(other: Money | number | bigint | string): boolean {
    if (stryMutAct_9fa48("1103")) {
      {}
    } else {
      stryCov_9fa48("1103");
      const otherMoney = this.resolveOther(other);
      return stryMutAct_9fa48("1106") ? this.currency.code === otherMoney.currency.code || this.minor === otherMoney.minor : stryMutAct_9fa48("1105") ? false : stryMutAct_9fa48("1104") ? true : (stryCov_9fa48("1104", "1105", "1106"), (stryMutAct_9fa48("1108") ? this.currency.code !== otherMoney.currency.code : stryMutAct_9fa48("1107") ? true : (stryCov_9fa48("1107", "1108"), this.currency.code === otherMoney.currency.code)) && (stryMutAct_9fa48("1110") ? this.minor !== otherMoney.minor : stryMutAct_9fa48("1109") ? true : (stryCov_9fa48("1109", "1110"), this.minor === otherMoney.minor)));
    }
  }

  /**
   * Checks if this Money value is greater than another.
   *
   * @param other - The other Money value (Money, minor units as number/bigint, or major units as string).
   * @returns True if this value is greater.
   * @throws {CurrencyMismatchError} If the currencies do not match.
   */
  greaterThan(other: Money | number | bigint | string): boolean {
    if (stryMutAct_9fa48("1111")) {
      {}
    } else {
      stryCov_9fa48("1111");
      const otherMoney = this.resolveOther(other);
      assertSameCurrency(this, otherMoney);
      return stryMutAct_9fa48("1115") ? this.minor <= otherMoney.minor : stryMutAct_9fa48("1114") ? this.minor >= otherMoney.minor : stryMutAct_9fa48("1113") ? false : stryMutAct_9fa48("1112") ? true : (stryCov_9fa48("1112", "1113", "1114", "1115"), this.minor > otherMoney.minor);
    }
  }

  /**
   * Checks if this Money value is less than another.
   *
   * @param other - The other Money value (Money, minor units as number/bigint, or major units as string).
   * @returns True if this value is less.
   * @throws {CurrencyMismatchError} If the currencies do not match.
   */
  lessThan(other: Money | number | bigint | string): boolean {
    if (stryMutAct_9fa48("1116")) {
      {}
    } else {
      stryCov_9fa48("1116");
      const otherMoney = this.resolveOther(other);
      assertSameCurrency(this, otherMoney);
      return stryMutAct_9fa48("1120") ? this.minor >= otherMoney.minor : stryMutAct_9fa48("1119") ? this.minor <= otherMoney.minor : stryMutAct_9fa48("1118") ? false : stryMutAct_9fa48("1117") ? true : (stryCov_9fa48("1117", "1118", "1119", "1120"), this.minor < otherMoney.minor);
    }
  }

  /**
   * Checks if this Money value is greater than or equal to another.
   */
  greaterThanOrEqual(other: Money | number | bigint | string): boolean {
    if (stryMutAct_9fa48("1121")) {
      {}
    } else {
      stryCov_9fa48("1121");
      const otherMoney = this.resolveOther(other);
      assertSameCurrency(this, otherMoney);
      return stryMutAct_9fa48("1125") ? this.minor < otherMoney.minor : stryMutAct_9fa48("1124") ? this.minor > otherMoney.minor : stryMutAct_9fa48("1123") ? false : stryMutAct_9fa48("1122") ? true : (stryCov_9fa48("1122", "1123", "1124", "1125"), this.minor >= otherMoney.minor);
    }
  }

  /**
   * Checks if this Money value is less than or equal to another.
   */
  lessThanOrEqual(other: Money | number | bigint | string): boolean {
    if (stryMutAct_9fa48("1126")) {
      {}
    } else {
      stryCov_9fa48("1126");
      const otherMoney = this.resolveOther(other);
      assertSameCurrency(this, otherMoney);
      return stryMutAct_9fa48("1130") ? this.minor > otherMoney.minor : stryMutAct_9fa48("1129") ? this.minor < otherMoney.minor : stryMutAct_9fa48("1128") ? false : stryMutAct_9fa48("1127") ? true : (stryCov_9fa48("1127", "1128", "1129", "1130"), this.minor <= otherMoney.minor);
    }
  }

  /**
   * Checks if this Money value is positive (greater than zero).
   */
  isPositive(): boolean {
    if (stryMutAct_9fa48("1131")) {
      {}
    } else {
      stryCov_9fa48("1131");
      return stryMutAct_9fa48("1135") ? this.minor <= 0n : stryMutAct_9fa48("1134") ? this.minor >= 0n : stryMutAct_9fa48("1133") ? false : stryMutAct_9fa48("1132") ? true : (stryCov_9fa48("1132", "1133", "1134", "1135"), this.minor > 0n);
    }
  }

  /**
   * Compares this Money to another, returning -1, 0, or 1.
   * Useful for sorting.
   */
  compare(other: Money | number | bigint | string): -1 | 0 | 1 {
    if (stryMutAct_9fa48("1136")) {
      {}
    } else {
      stryCov_9fa48("1136");
      const otherMoney = this.resolveOther(other);
      assertSameCurrency(this, otherMoney);
      if (stryMutAct_9fa48("1140") ? this.minor >= otherMoney.minor : stryMutAct_9fa48("1139") ? this.minor <= otherMoney.minor : stryMutAct_9fa48("1138") ? false : stryMutAct_9fa48("1137") ? true : (stryCov_9fa48("1137", "1138", "1139", "1140"), this.minor < otherMoney.minor)) return stryMutAct_9fa48("1141") ? +1 : (stryCov_9fa48("1141"), -1);
      if (stryMutAct_9fa48("1145") ? this.minor <= otherMoney.minor : stryMutAct_9fa48("1144") ? this.minor >= otherMoney.minor : stryMutAct_9fa48("1143") ? false : stryMutAct_9fa48("1142") ? true : (stryCov_9fa48("1142", "1143", "1144", "1145"), this.minor > otherMoney.minor)) return 1;
      return 0;
    }
  }

  /**
   * Calculates a percentage of the money.
   * @param percent - The percentage (e.g., 50 for 50%).
   * @param rounding - Rounding mode (defaults to HALF_EVEN).
   */
  percentage(percent: number, rounding: RoundingMode = RoundingMode.HALF_EVEN): Money {
    if (stryMutAct_9fa48("1146")) {
      {}
    } else {
      stryCov_9fa48("1146");
      return this.multiply(stryMutAct_9fa48("1147") ? percent * 100 : (stryCov_9fa48("1147"), percent / 100), stryMutAct_9fa48("1148") ? {} : (stryCov_9fa48("1148"), {
        rounding
      }));
    }
  }

  /**
   * Adds a percentage to the money.
   * @param percent - The percentage to add.
   * @param rounding - Rounding mode.
   */
  addPercent(percent: number, rounding: RoundingMode = RoundingMode.HALF_EVEN): Money {
    if (stryMutAct_9fa48("1149")) {
      {}
    } else {
      stryCov_9fa48("1149");
      return this.add(this.percentage(percent, rounding));
    }
  }

  /**
   * Subtracts a percentage from the money.
   * @param percent - The percentage to subtract.
   * @param rounding - Rounding mode.
   */
  subtractPercent(percent: number, rounding: RoundingMode = RoundingMode.HALF_EVEN): Money {
    if (stryMutAct_9fa48("1150")) {
      {}
    } else {
      stryCov_9fa48("1150");
      return this.subtract(this.percentage(percent, rounding));
    }
  }

  /**
   * Splits the money into equal parts.
   * @param parts - Number of parts.
   */
  split(parts: number): Money[] {
    if (stryMutAct_9fa48("1151")) {
      {}
    } else {
      stryCov_9fa48("1151");
      const ratios = stryMutAct_9fa48("1152") ? Array().fill(1) : (stryCov_9fa48("1152"), Array(parts).fill(1));
      return this.allocate(ratios);
    }
  }

  /**
   * Checks if this Money value is zero.
   *
   * @returns True if the amount is zero.
   */
  isZero(): boolean {
    if (stryMutAct_9fa48("1153")) {
      {}
    } else {
      stryCov_9fa48("1153");
      return stryMutAct_9fa48("1156") ? this.minor !== 0n : stryMutAct_9fa48("1155") ? false : stryMutAct_9fa48("1154") ? true : (stryCov_9fa48("1154", "1155", "1156"), this.minor === 0n);
    }
  }

  /**
   * Checks if this Money value is negative.
   *
   * @returns True if the amount is negative.
   */
  isNegative(): boolean {
    if (stryMutAct_9fa48("1157")) {
      {}
    } else {
      stryCov_9fa48("1157");
      return stryMutAct_9fa48("1161") ? this.minor >= 0n : stryMutAct_9fa48("1160") ? this.minor <= 0n : stryMutAct_9fa48("1159") ? false : stryMutAct_9fa48("1158") ? true : (stryCov_9fa48("1158", "1159", "1160", "1161"), this.minor < 0n);
    }
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
    if (stryMutAct_9fa48("1162")) {
      {}
    } else {
      stryCov_9fa48("1162");
      assertSameCurrency(this, min);
      assertSameCurrency(this, max);
      if (stryMutAct_9fa48("1164") ? false : stryMutAct_9fa48("1163") ? true : (stryCov_9fa48("1163", "1164"), min.greaterThan(max))) {
        if (stryMutAct_9fa48("1165")) {
          {}
        } else {
          stryCov_9fa48("1165");
          throw new Error(stryMutAct_9fa48("1166") ? "" : (stryCov_9fa48("1166"), "Clamp min cannot be greater than max"));
        }
      }
      if (stryMutAct_9fa48("1168") ? false : stryMutAct_9fa48("1167") ? true : (stryCov_9fa48("1167", "1168"), this.lessThan(min))) {
        if (stryMutAct_9fa48("1169")) {
          {}
        } else {
          stryCov_9fa48("1169");
          return new Money(min.minor, this.currency);
        }
      }
      if (stryMutAct_9fa48("1171") ? false : stryMutAct_9fa48("1170") ? true : (stryCov_9fa48("1170", "1171"), this.greaterThan(max))) {
        if (stryMutAct_9fa48("1172")) {
          {}
        } else {
          stryCov_9fa48("1172");
          return new Money(max.minor, this.currency);
        }
      }
      return this;
    }
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
    if (stryMutAct_9fa48("1173")) {
      {}
    } else {
      stryCov_9fa48("1173");
      const decimals = this.currency.decimals;
      const isNegative = stryMutAct_9fa48("1177") ? this.minor >= 0n : stryMutAct_9fa48("1176") ? this.minor <= 0n : stryMutAct_9fa48("1175") ? false : stryMutAct_9fa48("1174") ? true : (stryCov_9fa48("1174", "1175", "1176", "1177"), this.minor < 0n);
      const absMinor = isNegative ? stryMutAct_9fa48("1178") ? +this.minor : (stryCov_9fa48("1178"), -this.minor) : this.minor;
      if (stryMutAct_9fa48("1181") ? decimals !== 0 : stryMutAct_9fa48("1180") ? false : stryMutAct_9fa48("1179") ? true : (stryCov_9fa48("1179", "1180", "1181"), decimals === 0)) {
        if (stryMutAct_9fa48("1182")) {
          {}
        } else {
          stryCov_9fa48("1182");
          return isNegative ? stryMutAct_9fa48("1183") ? `` : (stryCov_9fa48("1183"), `-${absMinor.toString()}`) : absMinor.toString();
        }
      }
      const divisor = 10n ** BigInt(decimals);
      const integerPart = stryMutAct_9fa48("1184") ? absMinor * divisor : (stryCov_9fa48("1184"), absMinor / divisor);
      const fractionalPart = stryMutAct_9fa48("1185") ? absMinor * divisor : (stryCov_9fa48("1185"), absMinor % divisor);
      const fractionalStr = fractionalPart.toString().padStart(decimals, stryMutAct_9fa48("1186") ? "" : (stryCov_9fa48("1186"), "0"));
      const result = stryMutAct_9fa48("1187") ? `` : (stryCov_9fa48("1187"), `${integerPart}.${fractionalStr}`);
      return isNegative ? stryMutAct_9fa48("1188") ? `` : (stryCov_9fa48("1188"), `-${result}`) : result;
    }
  }

  /**
   * Returns a JSON representation of the Money object.
   *
   * @returns An object with amount (string), currency (code), and precision.
   */
  toJSON(): {
    amount: string;
    currency: string;
    precision: number;
  } {
    if (stryMutAct_9fa48("1189")) {
      {}
    } else {
      stryCov_9fa48("1189");
      return stryMutAct_9fa48("1190") ? {} : (stryCov_9fa48("1190"), {
        amount: this.minor.toString(),
        currency: this.currency.code,
        precision: this.currency.decimals
      });
    }
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
    if (stryMutAct_9fa48("1191")) {
      {}
    } else {
      stryCov_9fa48("1191");
      if (stryMutAct_9fa48("1194") ? value !== null && typeof value === "object" && "amount" in value && "currency" in value && "precision" in value && typeof (value as Record<string, unknown>).amount === "string" && typeof (value as Record<string, unknown>).currency === "string" || typeof (value as Record<string, unknown>).precision === "number" : stryMutAct_9fa48("1193") ? false : stryMutAct_9fa48("1192") ? true : (stryCov_9fa48("1192", "1193", "1194"), (stryMutAct_9fa48("1196") ? value !== null && typeof value === "object" && "amount" in value && "currency" in value && "precision" in value && typeof (value as Record<string, unknown>).amount === "string" || typeof (value as Record<string, unknown>).currency === "string" : stryMutAct_9fa48("1195") ? true : (stryCov_9fa48("1195", "1196"), (stryMutAct_9fa48("1198") ? value !== null && typeof value === "object" && "amount" in value && "currency" in value && "precision" in value || typeof (value as Record<string, unknown>).amount === "string" : stryMutAct_9fa48("1197") ? true : (stryCov_9fa48("1197", "1198"), (stryMutAct_9fa48("1200") ? value !== null && typeof value === "object" && "amount" in value && "currency" in value || "precision" in value : stryMutAct_9fa48("1199") ? true : (stryCov_9fa48("1199", "1200"), (stryMutAct_9fa48("1202") ? value !== null && typeof value === "object" && "amount" in value || "currency" in value : stryMutAct_9fa48("1201") ? true : (stryCov_9fa48("1201", "1202"), (stryMutAct_9fa48("1204") ? value !== null && typeof value === "object" || "amount" in value : stryMutAct_9fa48("1203") ? true : (stryCov_9fa48("1203", "1204"), (stryMutAct_9fa48("1206") ? value !== null || typeof value === "object" : stryMutAct_9fa48("1205") ? true : (stryCov_9fa48("1205", "1206"), (stryMutAct_9fa48("1208") ? value === null : stryMutAct_9fa48("1207") ? true : (stryCov_9fa48("1207", "1208"), value !== null)) && (stryMutAct_9fa48("1210") ? typeof value !== "object" : stryMutAct_9fa48("1209") ? true : (stryCov_9fa48("1209", "1210"), typeof value === (stryMutAct_9fa48("1211") ? "" : (stryCov_9fa48("1211"), "object")))))) && (stryMutAct_9fa48("1212") ? "" : (stryCov_9fa48("1212"), "amount")) in value)) && (stryMutAct_9fa48("1213") ? "" : (stryCov_9fa48("1213"), "currency")) in value)) && (stryMutAct_9fa48("1214") ? "" : (stryCov_9fa48("1214"), "precision")) in value)) && (stryMutAct_9fa48("1216") ? typeof (value as Record<string, unknown>).amount !== "string" : stryMutAct_9fa48("1215") ? true : (stryCov_9fa48("1215", "1216"), typeof (value as Record<string, unknown>).amount === (stryMutAct_9fa48("1217") ? "" : (stryCov_9fa48("1217"), "string")))))) && (stryMutAct_9fa48("1219") ? typeof (value as Record<string, unknown>).currency !== "string" : stryMutAct_9fa48("1218") ? true : (stryCov_9fa48("1218", "1219"), typeof (value as Record<string, unknown>).currency === (stryMutAct_9fa48("1220") ? "" : (stryCov_9fa48("1220"), "string")))))) && (stryMutAct_9fa48("1222") ? typeof (value as Record<string, unknown>).precision !== "number" : stryMutAct_9fa48("1221") ? true : (stryCov_9fa48("1221", "1222"), typeof (value as Record<string, unknown>).precision === (stryMutAct_9fa48("1223") ? "" : (stryCov_9fa48("1223"), "number")))))) {
        if (stryMutAct_9fa48("1224")) {
          {}
        } else {
          stryCov_9fa48("1224");
          const obj = value as {
            amount: string;
            currency: string;
            precision: number;
          };
          return Money.fromMinor(BigInt(obj.amount), obj.currency);
        }
      }
      return value;
    }
  }

  /**
   * Returns a string representation of the Money object (formatted).
   */
  toString(): string {
    if (stryMutAct_9fa48("1225")) {
      {}
    } else {
      stryCov_9fa48("1225");
      return this.format();
    }
  }
}