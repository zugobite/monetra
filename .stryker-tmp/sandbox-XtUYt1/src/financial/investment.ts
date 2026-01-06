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
import { CurrencyMismatchError } from "../errors/CurrencyMismatchError";
import { InvalidArgumentError } from "../errors/InvalidArgumentError";

/**
 * Calculates Return on Investment (ROI).
 * ROI = (Final Value - Initial Value) / Initial Value
 *
 * @param initialValue - The initial investment cost.
 * @param finalValue - The final value of the investment.
 * @returns The ROI as a decimal (e.g., 0.15 for 15%).
 * @throws {CurrencyMismatchError} If currencies differ.
 */
export function roi(initialValue: Money, finalValue: Money): number {
  if (stryMutAct_9fa48("318")) {
    {}
  } else {
    stryCov_9fa48("318");
    if (stryMutAct_9fa48("321") ? initialValue.currency.code === finalValue.currency.code : stryMutAct_9fa48("320") ? false : stryMutAct_9fa48("319") ? true : (stryCov_9fa48("319", "320", "321"), initialValue.currency.code !== finalValue.currency.code)) {
      if (stryMutAct_9fa48("322")) {
        {}
      } else {
        stryCov_9fa48("322");
        throw new CurrencyMismatchError(initialValue.currency.code, finalValue.currency.code);
      }
    }
    const gain = finalValue.subtract(initialValue);
    return stryMutAct_9fa48("323") ? Number(gain.minor) * Number(initialValue.minor) : (stryCov_9fa48("323"), Number(gain.minor) / Number(initialValue.minor));
  }
}

/**
 * Calculates Net Present Value of cash flows.
 */
export function npv(discountRate: number, cashFlows: Money[] // First is initial investment (usually negative)
): Money {
  if (stryMutAct_9fa48("324")) {
    {}
  } else {
    stryCov_9fa48("324");
    if (stryMutAct_9fa48("327") ? cashFlows.length !== 0 : stryMutAct_9fa48("326") ? false : stryMutAct_9fa48("325") ? true : (stryCov_9fa48("325", "326", "327"), cashFlows.length === 0)) {
      if (stryMutAct_9fa48("328")) {
        {}
      } else {
        stryCov_9fa48("328");
        throw new Error(stryMutAct_9fa48("329") ? "" : (stryCov_9fa48("329"), "At least one cash flow required"));
      }
    }
    const currency = cashFlows[0].currency;
    let total = Money.zero(currency);
    for (let i = 0; stryMutAct_9fa48("332") ? i >= cashFlows.length : stryMutAct_9fa48("331") ? i <= cashFlows.length : stryMutAct_9fa48("330") ? false : (stryCov_9fa48("330", "331", "332"), i < cashFlows.length); stryMutAct_9fa48("333") ? i-- : (stryCov_9fa48("333"), i++)) {
      if (stryMutAct_9fa48("334")) {
        {}
      } else {
        stryCov_9fa48("334");
        const discountFactor = Math.pow(stryMutAct_9fa48("335") ? 1 - discountRate : (stryCov_9fa48("335"), 1 + discountRate), i);
        const discounted = cashFlows[i].divide(discountFactor, stryMutAct_9fa48("336") ? {} : (stryCov_9fa48("336"), {
          rounding: RoundingMode.HALF_EVEN
        }));
        total = total.add(discounted);
      }
    }
    return total;
  }
}

/**
 * Calculates Internal Rate of Return using Newton-Raphson method.
 * @returns The IRR as a decimal (e.g., 0.12 for 12%)
 */
export function irr(cashFlows: Money[], guess: number = 0.1): number {
  if (stryMutAct_9fa48("337")) {
    {}
  } else {
    stryCov_9fa48("337");
    const values = cashFlows.map(stryMutAct_9fa48("338") ? () => undefined : (stryCov_9fa48("338"), cf => Number(cf.minor)));
    const maxIterations = 100;
    const tolerance = 1e-7;
    let rate = guess;
    for (let i = 0; stryMutAct_9fa48("341") ? i >= maxIterations : stryMutAct_9fa48("340") ? i <= maxIterations : stryMutAct_9fa48("339") ? false : (stryCov_9fa48("339", "340", "341"), i < maxIterations); stryMutAct_9fa48("342") ? i-- : (stryCov_9fa48("342"), i++)) {
      if (stryMutAct_9fa48("343")) {
        {}
      } else {
        stryCov_9fa48("343");
        let npvValue = 0;
        let derivative = 0;
        for (let j = 0; stryMutAct_9fa48("346") ? j >= values.length : stryMutAct_9fa48("345") ? j <= values.length : stryMutAct_9fa48("344") ? false : (stryCov_9fa48("344", "345", "346"), j < values.length); stryMutAct_9fa48("347") ? j-- : (stryCov_9fa48("347"), j++)) {
          if (stryMutAct_9fa48("348")) {
            {}
          } else {
            stryCov_9fa48("348");
            const denominator = Math.pow(stryMutAct_9fa48("349") ? 1 - rate : (stryCov_9fa48("349"), 1 + rate), j);
            stryMutAct_9fa48("350") ? npvValue -= values[j] / denominator : (stryCov_9fa48("350"), npvValue += stryMutAct_9fa48("351") ? values[j] * denominator : (stryCov_9fa48("351"), values[j] / denominator));
            if (stryMutAct_9fa48("355") ? j <= 0 : stryMutAct_9fa48("354") ? j >= 0 : stryMutAct_9fa48("353") ? false : stryMutAct_9fa48("352") ? true : (stryCov_9fa48("352", "353", "354", "355"), j > 0)) {
              if (stryMutAct_9fa48("356")) {
                {}
              } else {
                stryCov_9fa48("356");
                stryMutAct_9fa48("357") ? derivative += j * values[j] / Math.pow(1 + rate, j + 1) : (stryCov_9fa48("357"), derivative -= stryMutAct_9fa48("358") ? j * values[j] * Math.pow(1 + rate, j + 1) : (stryCov_9fa48("358"), (stryMutAct_9fa48("359") ? j / values[j] : (stryCov_9fa48("359"), j * values[j])) / Math.pow(stryMutAct_9fa48("360") ? 1 - rate : (stryCov_9fa48("360"), 1 + rate), stryMutAct_9fa48("361") ? j - 1 : (stryCov_9fa48("361"), j + 1))));
              }
            }
          }
        }
        const newRate = stryMutAct_9fa48("362") ? rate + npvValue / derivative : (stryCov_9fa48("362"), rate - (stryMutAct_9fa48("363") ? npvValue * derivative : (stryCov_9fa48("363"), npvValue / derivative)));
        if (stryMutAct_9fa48("367") ? Math.abs(newRate - rate) >= tolerance : stryMutAct_9fa48("366") ? Math.abs(newRate - rate) <= tolerance : stryMutAct_9fa48("365") ? false : stryMutAct_9fa48("364") ? true : (stryCov_9fa48("364", "365", "366", "367"), Math.abs(stryMutAct_9fa48("368") ? newRate + rate : (stryCov_9fa48("368"), newRate - rate)) < tolerance)) {
          if (stryMutAct_9fa48("369")) {
            {}
          } else {
            stryCov_9fa48("369");
            return newRate;
          }
        }
        rate = newRate;
      }
    }
    throw new Error(stryMutAct_9fa48("370") ? "" : (stryCov_9fa48("370"), "IRR calculation did not converge"));
  }
}

/**
 * Calculates the Current Yield of a bond.
 * Current Yield = Annual Coupon Payment / Current Market Price
 *
 * @param annualCoupon - The total annual coupon payment.
 * @param currentPrice - The current market price of the bond.
 * @returns The current yield as a decimal (e.g., 0.05 for 5%).
 * @throws {CurrencyMismatchError} If currencies differ.
 * @throws {InvalidArgumentError} If price is zero or negative.
 */
export function currentYield(annualCoupon: Money, currentPrice: Money): number {
  if (stryMutAct_9fa48("371")) {
    {}
  } else {
    stryCov_9fa48("371");
    if (stryMutAct_9fa48("374") ? annualCoupon.currency.code === currentPrice.currency.code : stryMutAct_9fa48("373") ? false : stryMutAct_9fa48("372") ? true : (stryCov_9fa48("372", "373", "374"), annualCoupon.currency.code !== currentPrice.currency.code)) {
      if (stryMutAct_9fa48("375")) {
        {}
      } else {
        stryCov_9fa48("375");
        throw new CurrencyMismatchError(annualCoupon.currency.code, currentPrice.currency.code);
      }
    }
    if (stryMutAct_9fa48("379") ? currentPrice.minor > 0n : stryMutAct_9fa48("378") ? currentPrice.minor < 0n : stryMutAct_9fa48("377") ? false : stryMutAct_9fa48("376") ? true : (stryCov_9fa48("376", "377", "378", "379"), currentPrice.minor <= 0n)) {
      if (stryMutAct_9fa48("380")) {
        {}
      } else {
        stryCov_9fa48("380");
        throw new InvalidArgumentError(stryMutAct_9fa48("381") ? "" : (stryCov_9fa48("381"), "Current price must be positive"));
      }
    }
    return stryMutAct_9fa48("382") ? Number(annualCoupon.minor) * Number(currentPrice.minor) : (stryCov_9fa48("382"), Number(annualCoupon.minor) / Number(currentPrice.minor));
  }
}