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
export interface LoanScheduleEntry {
  period: number;
  payment: Money;
  principal: Money;
  interest: Money;
  balance: Money;
}
export interface LoanOptions {
  principal: Money;
  annualRate: number; // e.g., 0.05 for 5%
  periods: number; // Total number of payments
  periodsPerYear?: number; // Default: 12 (monthly)
  rounding?: RoundingMode;
}
export interface InterestOnlyOptions {
  principal: Money;
  annualRate: number; // e.g., 0.05 for 5%
  periodsPerYear?: number; // Default: 12 (monthly)
  rounding?: RoundingMode;
}

/**
 * Calculates loan amortization schedule.
 */
export function loan(options: LoanOptions): LoanScheduleEntry[] {
  if (stryMutAct_9fa48("408")) {
    {}
  } else {
    stryCov_9fa48("408");
    const {
      principal,
      annualRate,
      periods,
      periodsPerYear = 12,
      rounding = RoundingMode.HALF_EVEN
    } = options;
    const periodicRate = stryMutAct_9fa48("409") ? annualRate * periodsPerYear : (stryCov_9fa48("409"), annualRate / periodsPerYear);
    let payment: Money;
    if (stryMutAct_9fa48("412") ? annualRate !== 0 : stryMutAct_9fa48("411") ? false : stryMutAct_9fa48("410") ? true : (stryCov_9fa48("410", "411", "412"), annualRate === 0)) {
      if (stryMutAct_9fa48("413")) {
        {}
      } else {
        stryCov_9fa48("413");
        payment = principal.divide(periods, stryMutAct_9fa48("414") ? {} : (stryCov_9fa48("414"), {
          rounding
        }));
      }
    } else {
      if (stryMutAct_9fa48("415")) {
        {}
      } else {
        stryCov_9fa48("415");
        // PMT formula: P * (r(1+r)^n) / ((1+r)^n - 1)
        const r = periodicRate;
        const n = periods;
        const numerator = stryMutAct_9fa48("416") ? r / Math.pow(1 + r, n) : (stryCov_9fa48("416"), r * Math.pow(stryMutAct_9fa48("417") ? 1 - r : (stryCov_9fa48("417"), 1 + r), n));
        const denominator = stryMutAct_9fa48("418") ? Math.pow(1 + r, n) + 1 : (stryCov_9fa48("418"), Math.pow(stryMutAct_9fa48("419") ? 1 - r : (stryCov_9fa48("419"), 1 + r), n) - 1);
        const pmtMultiplier = stryMutAct_9fa48("420") ? numerator * denominator : (stryCov_9fa48("420"), numerator / denominator);
        payment = principal.multiply(pmtMultiplier, stryMutAct_9fa48("421") ? {} : (stryCov_9fa48("421"), {
          rounding
        }));
      }
    }
    const schedule: LoanScheduleEntry[] = stryMutAct_9fa48("422") ? ["Stryker was here"] : (stryCov_9fa48("422"), []);
    let balance = principal;
    for (let period = 1; stryMutAct_9fa48("425") ? period > periods : stryMutAct_9fa48("424") ? period < periods : stryMutAct_9fa48("423") ? false : (stryCov_9fa48("423", "424", "425"), period <= periods); stryMutAct_9fa48("426") ? period-- : (stryCov_9fa48("426"), period++)) {
      if (stryMutAct_9fa48("427")) {
        {}
      } else {
        stryCov_9fa48("427");
        const interest = (stryMutAct_9fa48("430") ? annualRate !== 0 : stryMutAct_9fa48("429") ? false : stryMutAct_9fa48("428") ? true : (stryCov_9fa48("428", "429", "430"), annualRate === 0)) ? Money.zero(principal.currency) : balance.multiply(periodicRate, stryMutAct_9fa48("431") ? {} : (stryCov_9fa48("431"), {
          rounding
        }));
        let principalPayment = payment.subtract(interest);

        // If payment < interest (negative amortization), principal payment is negative.
        // This implementation assumes standard amortization.

        balance = balance.subtract(principalPayment);

        // Handle final period rounding adjustment
        if (stryMutAct_9fa48("434") ? period === periods || !balance.isZero() : stryMutAct_9fa48("433") ? false : stryMutAct_9fa48("432") ? true : (stryCov_9fa48("432", "433", "434"), (stryMutAct_9fa48("436") ? period !== periods : stryMutAct_9fa48("435") ? true : (stryCov_9fa48("435", "436"), period === periods)) && (stryMutAct_9fa48("437") ? balance.isZero() : (stryCov_9fa48("437"), !balance.isZero())))) {
          if (stryMutAct_9fa48("438")) {
            {}
          } else {
            stryCov_9fa48("438");
            const adjustedPrincipal = principalPayment.add(balance);
            schedule.push(stryMutAct_9fa48("439") ? {} : (stryCov_9fa48("439"), {
              period,
              payment: interest.add(adjustedPrincipal),
              principal: adjustedPrincipal,
              interest,
              balance: Money.zero(principal.currency)
            }));
          }
        } else {
          if (stryMutAct_9fa48("440")) {
            {}
          } else {
            stryCov_9fa48("440");
            schedule.push(stryMutAct_9fa48("441") ? {} : (stryCov_9fa48("441"), {
              period,
              payment,
              principal: principalPayment,
              interest,
              balance: balance.isNegative() ? Money.zero(principal.currency) : balance
            }));
          }
        }
      }
    }
    return schedule;
  }
}

/**
 * Calculates monthly payment amount.
 */
export function pmt(options: Omit<LoanOptions, "rounding"> & {
  rounding?: RoundingMode;
}): Money {
  if (stryMutAct_9fa48("442")) {
    {}
  } else {
    stryCov_9fa48("442");
    const schedule = loan(options);
    return schedule[0].payment;
  }
}

/**
 * Calculates total interest over the life of the loan using the payment formula.
 */
export function totalInterest(options: LoanOptions): Money {
  if (stryMutAct_9fa48("443")) {
    {}
  } else {
    stryCov_9fa48("443");
    const {
      principal,
      annualRate,
      periods,
      rounding = RoundingMode.HALF_EVEN
    } = options;
    if (stryMutAct_9fa48("446") ? annualRate !== 0 : stryMutAct_9fa48("445") ? false : stryMutAct_9fa48("444") ? true : (stryCov_9fa48("444", "445", "446"), annualRate === 0)) {
      if (stryMutAct_9fa48("447")) {
        {}
      } else {
        stryCov_9fa48("447");
        return Money.zero(principal.currency);
      }
    }
    const payment = pmt(options);
    const totalPaid = payment.multiply(periods, stryMutAct_9fa48("448") ? {} : (stryCov_9fa48("448"), {
      rounding
    }));
    return totalPaid.subtract(principal);
  }
}

/**
 * Sums the interest column from a loan schedule.
 */
export function totalInterestFromSchedule(schedule: LoanScheduleEntry[]): Money {
  if (stryMutAct_9fa48("449")) {
    {}
  } else {
    stryCov_9fa48("449");
    if (stryMutAct_9fa48("452") ? schedule.length !== 0 : stryMutAct_9fa48("451") ? false : stryMutAct_9fa48("450") ? true : (stryCov_9fa48("450", "451", "452"), schedule.length === 0)) {
      if (stryMutAct_9fa48("453")) {
        {}
      } else {
        stryCov_9fa48("453");
        throw new Error(stryMutAct_9fa48("454") ? "" : (stryCov_9fa48("454"), "Schedule must have at least one entry"));
      }
    }
    const currency = schedule[0].interest.currency;
    return schedule.reduce(stryMutAct_9fa48("455") ? () => undefined : (stryCov_9fa48("455"), (sum, entry) => sum.add(entry.interest)), Money.zero(currency));
  }
}

/**
 * Calculates the periodic payment for an interest-only loan.
 *
 * In an interest-only loan, the borrower pays only the interest each period,
 * with the full principal due at maturity or refinancing. This is common in:
 * - Commercial real estate
 * - Construction loans
 * - Home Equity Lines of Credit (HELOCs)
 *
 * Formula: Payment = Principal × Periodic Rate
 * Where Periodic Rate = Annual Rate / Periods Per Year
 *
 * @param options - Interest-only loan configuration
 * @returns The periodic interest payment as a Money object
 *
 * @example
 * ```typescript
 * const principal = Money.fromMajor("100000", USD);
 * const payment = interestOnlyPayment({
 *   principal,
 *   annualRate: 0.06, // 6% annual
 *   periodsPerYear: 12 // Monthly payments
 * });
 * // Returns $500.00 per month
 * ```
 */
export function interestOnlyPayment(options: InterestOnlyOptions): Money {
  if (stryMutAct_9fa48("456")) {
    {}
  } else {
    stryCov_9fa48("456");
    const {
      principal,
      annualRate,
      periodsPerYear = 12,
      rounding = RoundingMode.HALF_EVEN
    } = options;

    // If rate is zero, interest payment is zero
    if (stryMutAct_9fa48("459") ? annualRate !== 0 : stryMutAct_9fa48("458") ? false : stryMutAct_9fa48("457") ? true : (stryCov_9fa48("457", "458", "459"), annualRate === 0)) {
      if (stryMutAct_9fa48("460")) {
        {}
      } else {
        stryCov_9fa48("460");
        return Money.zero(principal.currency);
      }
    }
    const periodicRate = stryMutAct_9fa48("461") ? annualRate * periodsPerYear : (stryCov_9fa48("461"), annualRate / periodsPerYear);
    return principal.multiply(periodicRate, stryMutAct_9fa48("462") ? {} : (stryCov_9fa48("462"), {
      rounding
    }));
  }
}