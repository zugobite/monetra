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
import { Rate } from "./rate";
import { RoundingMode } from "../rounding/strategies";
export interface SimpleInterestOptions {
  rate: Rate;
  years: number;
  rounding?: RoundingMode;
}

/**
 * Calculates simple interest earned on principal.
 * 
 * Simple interest is calculated using the formula: Interest = P × r × t
 * Where:
 * - P = Principal amount
 * - r = Annual interest rate (as decimal)
 * - t = Time in years
 * 
 * This is commonly used for:
 * - Short-term loans
 * - Accrued interest between bond coupon payments
 * - Basic savings calculations without compounding
 * 
 * @param principal - The principal amount as a Money object
 * @param options - Configuration options including rate, years, and rounding
 * @returns The interest amount as a Money object
 * 
 * @example
 * ```typescript
 * const principal = Money.fromMajor("1000.00", USD);
 * const rate = Rate.percent(5); // 5% annual rate
 * const interest = simpleInterest(principal, { rate, years: 2 });
 * console.log(interest.format()); // "$100.00" (1000 × 0.05 × 2)
 * ```
 */
export function simpleInterest(principal: Money, options: SimpleInterestOptions): Money {
  if (stryMutAct_9fa48("534")) {
    {}
  } else {
    stryCov_9fa48("534");
    const {
      rate,
      years,
      rounding = RoundingMode.HALF_EVEN
    } = options;

    // Handle edge cases
    if (stryMutAct_9fa48("537") ? rate.isZero() && years === 0 : stryMutAct_9fa48("536") ? false : stryMutAct_9fa48("535") ? true : (stryCov_9fa48("535", "536", "537"), rate.isZero() || (stryMutAct_9fa48("539") ? years !== 0 : stryMutAct_9fa48("538") ? false : (stryCov_9fa48("538", "539"), years === 0)))) {
      if (stryMutAct_9fa48("540")) {
        {}
      } else {
        stryCov_9fa48("540");
        return Money.zero(principal.currency);
      }
    }

    // Simple Interest = Principal × Rate × Time
    const interestMultiplier = stryMutAct_9fa48("541") ? rate.toDecimal() / years : (stryCov_9fa48("541"), rate.toDecimal() * years);
    return principal.multiply(interestMultiplier, stryMutAct_9fa48("542") ? {} : (stryCov_9fa48("542"), {
      rounding
    }));
  }
}

/**
 * Calculates the total amount (principal + simple interest).
 * 
 * Uses the formula: Total = P × (1 + r × t)
 * Where:
 * - P = Principal amount
 * - r = Annual interest rate (as decimal)
 * - t = Time in years
 * 
 * This represents the final amount you would have after earning
 * simple interest on the principal for the specified time period.
 * 
 * @param principal - The principal amount as a Money object
 * @param options - Configuration options including rate, years, and rounding
 * @returns The total amount (principal + interest) as a Money object
 * 
 * @example
 * ```typescript
 * const principal = Money.fromMajor("1000.00", USD);
 * const rate = Rate.percent(5); // 5% annual rate
 * const total = simpleInterestTotal(principal, { rate, years: 2 });
 * console.log(total.format()); // "$1,100.00" (1000 × (1 + 0.05 × 2))
 * ```
 */
export function simpleInterestTotal(principal: Money, options: SimpleInterestOptions): Money {
  if (stryMutAct_9fa48("543")) {
    {}
  } else {
    stryCov_9fa48("543");
    const {
      rate,
      years,
      rounding = RoundingMode.HALF_EVEN
    } = options;

    // Handle edge cases
    if (stryMutAct_9fa48("546") ? rate.isZero() && years === 0 : stryMutAct_9fa48("545") ? false : stryMutAct_9fa48("544") ? true : (stryCov_9fa48("544", "545", "546"), rate.isZero() || (stryMutAct_9fa48("548") ? years !== 0 : stryMutAct_9fa48("547") ? false : (stryCov_9fa48("547", "548"), years === 0)))) {
      if (stryMutAct_9fa48("549")) {
        {}
      } else {
        stryCov_9fa48("549");
        return principal;
      }
    }

    // Total Amount = Principal × (1 + rate × time)
    const totalMultiplier = stryMutAct_9fa48("550") ? 1 - rate.toDecimal() * years : (stryCov_9fa48("550"), 1 + (stryMutAct_9fa48("551") ? rate.toDecimal() / years : (stryCov_9fa48("551"), rate.toDecimal() * years)));
    return principal.multiply(totalMultiplier, stryMutAct_9fa48("552") ? {} : (stryCov_9fa48("552"), {
      rounding
    }));
  }
}