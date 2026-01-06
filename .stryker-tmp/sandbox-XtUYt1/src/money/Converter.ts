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
    if (stryMutAct_9fa48("1001")) {
      {}
    } else {
      stryCov_9fa48("1001");
      this.base = base;
      this.rates = stryMutAct_9fa48("1002") ? {} : (stryCov_9fa48("1002"), {
        ...rates
      });

      // Ensure base rate is 1
      if (stryMutAct_9fa48("1005") ? this.rates[base] !== undefined : stryMutAct_9fa48("1004") ? false : stryMutAct_9fa48("1003") ? true : (stryCov_9fa48("1003", "1004", "1005"), this.rates[base] === undefined)) {
        if (stryMutAct_9fa48("1006")) {
          {}
        } else {
          stryCov_9fa48("1006");
          this.rates[base] = 1;
        }
      }
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
    if (stryMutAct_9fa48("1007")) {
      {}
    } else {
      stryCov_9fa48("1007");
      const targetCurrency = (stryMutAct_9fa48("1010") ? typeof toCurrency !== "string" : stryMutAct_9fa48("1009") ? false : stryMutAct_9fa48("1008") ? true : (stryCov_9fa48("1008", "1009", "1010"), typeof toCurrency === (stryMutAct_9fa48("1011") ? "" : (stryCov_9fa48("1011"), "string")))) ? getCurrency(toCurrency) : toCurrency;
      if (stryMutAct_9fa48("1014") ? money.currency.code !== targetCurrency.code : stryMutAct_9fa48("1013") ? false : stryMutAct_9fa48("1012") ? true : (stryCov_9fa48("1012", "1013", "1014"), money.currency.code === targetCurrency.code)) {
        if (stryMutAct_9fa48("1015")) {
          {}
        } else {
          stryCov_9fa48("1015");
          return money;
        }
      }
      const fromRate = this.rates[money.currency.code];
      const toRate = this.rates[targetCurrency.code];
      if (stryMutAct_9fa48("1018") ? fromRate === undefined && toRate === undefined : stryMutAct_9fa48("1017") ? false : stryMutAct_9fa48("1016") ? true : (stryCov_9fa48("1016", "1017", "1018"), (stryMutAct_9fa48("1020") ? fromRate !== undefined : stryMutAct_9fa48("1019") ? false : (stryCov_9fa48("1019", "1020"), fromRate === undefined)) || (stryMutAct_9fa48("1022") ? toRate !== undefined : stryMutAct_9fa48("1021") ? false : (stryCov_9fa48("1021", "1022"), toRate === undefined)))) {
        if (stryMutAct_9fa48("1023")) {
          {}
        } else {
          stryCov_9fa48("1023");
          throw new Error(stryMutAct_9fa48("1024") ? `` : (stryCov_9fa48("1024"), `Exchange rate missing for conversion from ${money.currency.code} to ${targetCurrency.code}`));
        }
      }

      // Calculate the exchange rate ratio
      const ratio = stryMutAct_9fa48("1025") ? toRate * fromRate : (stryCov_9fa48("1025"), toRate / fromRate);

      // Adjust for difference in decimal places
      // targetMinor = sourceMinor * ratio * 10^(targetDecimals - sourceDecimals)
      const decimalAdjustment = 10 ** (stryMutAct_9fa48("1026") ? targetCurrency.decimals + money.currency.decimals : (stryCov_9fa48("1026"), targetCurrency.decimals - money.currency.decimals));

      // We use the multiply method of Money which handles rounding.
      // Default rounding is usually needed for conversion.
      // We'll use the default rounding (HALF_EVEN is common for money, but Money.multiply requires explicit if fractional).
      // Let's assume standard rounding (HALF_UP) or require options?
      // For ease of use, we should probably default to HALF_UP or similar.
      // But Money.multiply throws if rounding is needed and not provided.

      // Let's pass a default rounding mode.
      // We need to import RoundingMode.

      const multiplier = stryMutAct_9fa48("1027") ? ratio / decimalAdjustment : (stryCov_9fa48("1027"), ratio * decimalAdjustment);

      // We need to access the internal multiply or use the public one.
      // Public one: money.multiply(multiplier, { rounding: 'HALF_EVEN' })

      const convertedAmount = money.multiply(multiplier, stryMutAct_9fa48("1028") ? {} : (stryCov_9fa48("1028"), {
        rounding: RoundingMode.HALF_EVEN
      }));
      return Money.fromMinor(convertedAmount.minor, targetCurrency);
    }
  }
}