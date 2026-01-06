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
import { InvalidArgumentError } from "../errors/InvalidArgumentError";
import { CurrencyMismatchError } from "../errors/CurrencyMismatchError";
export interface DepreciationOptions {
  cost: Money;
  salvageValue: Money;
  usefulLife: number; // in years
  rounding?: RoundingMode;
}
export interface DepreciationResult {
  annualDepreciation: Money;
  bookValueAtYear(year: number): Money;
  schedule(): {
    year: number;
    depreciation: Money;
    bookValue: Money;
  }[];
}

/**
 * Calculates straight-line depreciation for an asset.
 *
 * Formula:
 * Annual Depreciation = (Cost - Salvage Value) / Useful Life
 * Book Value at Year N = Cost - (Annual Depreciation × N)
 *
 * @param options - Configuration for depreciation calculation
 * @returns Object containing annual depreciation, book value calculator, and schedule generator
 * @throws {CurrencyMismatchError} If cost and salvage value currencies differ
 * @throws {InvalidArgumentError} If useful life is not positive or salvage value > cost
 */
export function straightLineDepreciation(options: DepreciationOptions): DepreciationResult {
  if (stryMutAct_9fa48("280")) {
    {}
  } else {
    stryCov_9fa48("280");
    const {
      cost,
      salvageValue,
      usefulLife,
      rounding = RoundingMode.HALF_EVEN
    } = options;
    if (stryMutAct_9fa48("283") ? cost.currency.code === salvageValue.currency.code : stryMutAct_9fa48("282") ? false : stryMutAct_9fa48("281") ? true : (stryCov_9fa48("281", "282", "283"), cost.currency.code !== salvageValue.currency.code)) {
      if (stryMutAct_9fa48("284")) {
        {}
      } else {
        stryCov_9fa48("284");
        throw new CurrencyMismatchError(cost.currency.code, salvageValue.currency.code);
      }
    }
    if (stryMutAct_9fa48("288") ? usefulLife > 0 : stryMutAct_9fa48("287") ? usefulLife < 0 : stryMutAct_9fa48("286") ? false : stryMutAct_9fa48("285") ? true : (stryCov_9fa48("285", "286", "287", "288"), usefulLife <= 0)) {
      if (stryMutAct_9fa48("289")) {
        {}
      } else {
        stryCov_9fa48("289");
        throw new InvalidArgumentError(stryMutAct_9fa48("290") ? "" : (stryCov_9fa48("290"), "Useful life must be positive"));
      }
    }
    if (stryMutAct_9fa48("292") ? false : stryMutAct_9fa48("291") ? true : (stryCov_9fa48("291", "292"), salvageValue.greaterThan(cost))) {
      if (stryMutAct_9fa48("293")) {
        {}
      } else {
        stryCov_9fa48("293");
        throw new InvalidArgumentError(stryMutAct_9fa48("294") ? "" : (stryCov_9fa48("294"), "Salvage value cannot be greater than cost"));
      }
    }
    const depreciableAmount = cost.subtract(salvageValue);
    const annualDepreciation = depreciableAmount.divide(usefulLife, stryMutAct_9fa48("295") ? {} : (stryCov_9fa48("295"), {
      rounding
    }));
    const result: DepreciationResult = stryMutAct_9fa48("296") ? {} : (stryCov_9fa48("296"), {
      annualDepreciation,
      bookValueAtYear(year: number): Money {
        if (stryMutAct_9fa48("297")) {
          {}
        } else {
          stryCov_9fa48("297");
          if (stryMutAct_9fa48("301") ? year >= 0 : stryMutAct_9fa48("300") ? year <= 0 : stryMutAct_9fa48("299") ? false : stryMutAct_9fa48("298") ? true : (stryCov_9fa48("298", "299", "300", "301"), year < 0)) {
            if (stryMutAct_9fa48("302")) {
              {}
            } else {
              stryCov_9fa48("302");
              throw new InvalidArgumentError(stryMutAct_9fa48("303") ? "" : (stryCov_9fa48("303"), "Year must be non-negative"));
            }
          }
          if (stryMutAct_9fa48("306") ? year !== 0 : stryMutAct_9fa48("305") ? false : stryMutAct_9fa48("304") ? true : (stryCov_9fa48("304", "305", "306"), year === 0)) return cost;
          const totalDepreciation = annualDepreciation.multiply(year);
          const bookValue = cost.subtract(totalDepreciation);

          // Ensure book value doesn't drop below salvage value
          if (stryMutAct_9fa48("308") ? false : stryMutAct_9fa48("307") ? true : (stryCov_9fa48("307", "308"), bookValue.lessThan(salvageValue))) {
            if (stryMutAct_9fa48("309")) {
              {}
            } else {
              stryCov_9fa48("309");
              return salvageValue;
            }
          }
          return bookValue;
        }
      },
      schedule(): {
        year: number;
        depreciation: Money;
        bookValue: Money;
      }[] {
        if (stryMutAct_9fa48("310")) {
          {}
        } else {
          stryCov_9fa48("310");
          const schedule = stryMutAct_9fa48("311") ? ["Stryker was here"] : (stryCov_9fa48("311"), []);
          let previousBookValue = cost;
          const maxYears = Math.ceil(usefulLife);
          for (let year = 1; stryMutAct_9fa48("314") ? year > maxYears : stryMutAct_9fa48("313") ? year < maxYears : stryMutAct_9fa48("312") ? false : (stryCov_9fa48("312", "313", "314"), year <= maxYears); stryMutAct_9fa48("315") ? year-- : (stryCov_9fa48("315"), year++)) {
            if (stryMutAct_9fa48("316")) {
              {}
            } else {
              stryCov_9fa48("316");
              const currentBookValue = result.bookValueAtYear(year);
              const depreciation = previousBookValue.subtract(currentBookValue);
              schedule.push(stryMutAct_9fa48("317") ? {} : (stryCov_9fa48("317"), {
                year,
                depreciation,
                bookValue: currentBookValue
              }));
              previousBookValue = currentBookValue;
            }
          }
          return schedule;
        }
      }
    });
    return result;
  }
}