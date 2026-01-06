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
import { Converter } from "./Converter";
import { getCurrency } from "../currency/registry";

/**
 * A collection of Money objects in different currencies.
 * Useful for representing a wallet or portfolio.
 */
export class MoneyBag {
  private contents: Map<string, Money> = new Map();

  /**
   * Adds a Money amount to the bag.
   * @param money The money to add.
   */
  add(money: Money): void {
    if (stryMutAct_9fa48("1226")) {
      {}
    } else {
      stryCov_9fa48("1226");
      const code = money.currency.code;
      const existing = this.contents.get(code);
      if (stryMutAct_9fa48("1228") ? false : stryMutAct_9fa48("1227") ? true : (stryCov_9fa48("1227", "1228"), existing)) {
        if (stryMutAct_9fa48("1229")) {
          {}
        } else {
          stryCov_9fa48("1229");
          this.contents.set(code, existing.add(money));
        }
      } else {
        if (stryMutAct_9fa48("1230")) {
          {}
        } else {
          stryCov_9fa48("1230");
          this.contents.set(code, money);
        }
      }
    }
  }

  /**
   * Subtracts a Money amount from the bag.
   * @param money The money to subtract.
   */
  subtract(money: Money): void {
    if (stryMutAct_9fa48("1231")) {
      {}
    } else {
      stryCov_9fa48("1231");
      const code = money.currency.code;
      const existing = this.contents.get(code);
      if (stryMutAct_9fa48("1233") ? false : stryMutAct_9fa48("1232") ? true : (stryCov_9fa48("1232", "1233"), existing)) {
        if (stryMutAct_9fa48("1234")) {
          {}
        } else {
          stryCov_9fa48("1234");
          this.contents.set(code, existing.subtract(money));
        }
      } else {
        if (stryMutAct_9fa48("1235")) {
          {}
        } else {
          stryCov_9fa48("1235");
          // If not present, we assume 0 - amount
          const zero = Money.zero(money.currency);
          this.contents.set(code, zero.subtract(money));
        }
      }
    }
  }

  /**
   * Gets the amount for a specific currency.
   * @param currency The currency to retrieve.
   * @returns The Money amount in that currency (or zero if not present).
   */
  get(currency: Currency | string): Money {
    if (stryMutAct_9fa48("1236")) {
      {}
    } else {
      stryCov_9fa48("1236");
      const code = (stryMutAct_9fa48("1239") ? typeof currency !== "string" : stryMutAct_9fa48("1238") ? false : stryMutAct_9fa48("1237") ? true : (stryCov_9fa48("1237", "1238", "1239"), typeof currency === (stryMutAct_9fa48("1240") ? "" : (stryCov_9fa48("1240"), "string")))) ? currency : currency.code;
      return stryMutAct_9fa48("1243") ? this.contents.get(code) && Money.zero(typeof currency === "string" ? getCurrency(currency) : currency) : stryMutAct_9fa48("1242") ? false : stryMutAct_9fa48("1241") ? true : (stryCov_9fa48("1241", "1242", "1243"), this.contents.get(code) || Money.zero((stryMutAct_9fa48("1246") ? typeof currency !== "string" : stryMutAct_9fa48("1245") ? false : stryMutAct_9fa48("1244") ? true : (stryCov_9fa48("1244", "1245", "1246"), typeof currency === (stryMutAct_9fa48("1247") ? "" : (stryCov_9fa48("1247"), "string")))) ? getCurrency(currency) : currency));
    }
  }

  /**
   * Calculates the total value of the bag in a specific currency.
   *
   * @param targetCurrency The currency to convert everything to.
   * @param converter The converter instance with exchange rates.
   * @returns The total amount in the target currency.
   */
  total(targetCurrency: Currency | string, converter: Converter): Money {
    if (stryMutAct_9fa48("1248")) {
      {}
    } else {
      stryCov_9fa48("1248");
      const target = (stryMutAct_9fa48("1251") ? typeof targetCurrency !== "string" : stryMutAct_9fa48("1250") ? false : stryMutAct_9fa48("1249") ? true : (stryCov_9fa48("1249", "1250", "1251"), typeof targetCurrency === (stryMutAct_9fa48("1252") ? "" : (stryCov_9fa48("1252"), "string")))) ? getCurrency(targetCurrency) : targetCurrency;
      let total = Money.zero(target);
      for (const money of this.contents.values()) {
        if (stryMutAct_9fa48("1253")) {
          {}
        } else {
          stryCov_9fa48("1253");
          const converted = converter.convert(money, target);
          total = total.add(converted);
        }
      }
      return total;
    }
  }

  /**
   * Returns a list of all Money objects in the bag.
   */
  getAll(): Money[] {
    if (stryMutAct_9fa48("1254")) {
      {}
    } else {
      stryCov_9fa48("1254");
      return Array.from(this.contents.values());
    }
  }

  /**
   * Returns a JSON representation of the bag.
   */
  toJSON(): {
    amount: string;
    currency: string;
    precision: number;
  }[] {
    if (stryMutAct_9fa48("1255")) {
      {}
    } else {
      stryCov_9fa48("1255");
      return this.getAll().map(stryMutAct_9fa48("1256") ? () => undefined : (stryCov_9fa48("1256"), m => m.toJSON()));
    }
  }
}