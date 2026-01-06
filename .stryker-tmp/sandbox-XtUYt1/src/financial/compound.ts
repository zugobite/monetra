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
import { Money } from "../money/Money";
import { RoundingMode } from "../rounding/strategies";
export interface CompoundOptions {
  rate: number; // Annual rate (e.g., 0.07 for 7%)
  years: number;
  compoundingPerYear?: number; // Default: 12 (monthly)
  rounding?: RoundingMode;
}

/**
 * Calculates future value with compound interest.
 * FV = PV * (1 + r/n)^(n*t)
 */
export function futureValue(presentValue: Money, options: CompoundOptions): Money {
  if (stryMutAct_9fa48("270")) {
    {}
  } else {
    stryCov_9fa48("270");
    const {
      rate,
      years,
      compoundingPerYear = 12,
      rounding = RoundingMode.HALF_EVEN
    } = options;
    const n = compoundingPerYear;
    const t = years;
    const multiplier = Math.pow(stryMutAct_9fa48("271") ? 1 - rate / n : (stryCov_9fa48("271"), 1 + (stryMutAct_9fa48("272") ? rate * n : (stryCov_9fa48("272"), rate / n))), stryMutAct_9fa48("273") ? n / t : (stryCov_9fa48("273"), n * t));
    return presentValue.multiply(multiplier, stryMutAct_9fa48("274") ? {} : (stryCov_9fa48("274"), {
      rounding
    }));
  }
}

/**
 * Calculates present value (discounting).
 * PV = FV / (1 + r/n)^(n*t)
 */
export function presentValue(futureVal: Money, options: CompoundOptions): Money {
  if (stryMutAct_9fa48("275")) {
    {}
  } else {
    stryCov_9fa48("275");
    const {
      rate,
      years,
      compoundingPerYear = 12,
      rounding = RoundingMode.HALF_EVEN
    } = options;
    const n = compoundingPerYear;
    const t = years;
    const divisor = Math.pow(stryMutAct_9fa48("276") ? 1 - rate / n : (stryCov_9fa48("276"), 1 + (stryMutAct_9fa48("277") ? rate * n : (stryCov_9fa48("277"), rate / n))), stryMutAct_9fa48("278") ? n / t : (stryCov_9fa48("278"), n * t));
    return futureVal.divide(divisor, stryMutAct_9fa48("279") ? {} : (stryCov_9fa48("279"), {
      rounding
    }));
  }
}

// Alias for familiarity
export const compound = futureValue;
export const discount = presentValue;