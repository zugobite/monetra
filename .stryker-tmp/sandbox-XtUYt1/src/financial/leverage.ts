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
import { assertSameCurrency } from "../money/guards";

/**
 *  Input parameters for calculating all leverage ratios
 */
export interface LeverageInputs {
  totalDebt: Money;
  totalEquity: Money;
  totalAssets: Money;
  ebit: Money;
  interestExpense: Money;
}

/**
 *  Result of leverage ratio calculations
 */
export interface LeverageResult {
  debtToEquity: number;
  debtToAssets: number;
  interestCoverage: number;
  equityMultiplier: number;
}

/**
 * Calculates the Debt-to-Equity (D/E) ratio,
 * Formula: Total Debt / Total Equity
 *
 * @param totalDebt - Total liabilities
 * @param totalEquity - Total shareholders' equity
 * @returns The D/E ratio as a number
 * @throws {Error} If totalEquity is zero
 */
export function debtToEquity(totalDebt: Money, totalEquity: Money): number {
  if (stryMutAct_9fa48("383")) {
    {}
  } else {
    stryCov_9fa48("383");
    assertSameCurrency(totalDebt, totalEquity);
    if (stryMutAct_9fa48("385") ? false : stryMutAct_9fa48("384") ? true : (stryCov_9fa48("384", "385"), totalEquity.isZero())) {
      if (stryMutAct_9fa48("386")) {
        {}
      } else {
        stryCov_9fa48("386");
        throw new Error(stryMutAct_9fa48("387") ? "" : (stryCov_9fa48("387"), "Total equity cannot be zero"));
      }
    }
    return stryMutAct_9fa48("388") ? Number(totalDebt.minor) * Number(totalEquity.minor) : (stryCov_9fa48("388"), Number(totalDebt.minor) / Number(totalEquity.minor));
  }
}

/**
 * Calculates the Debt-to-Assets ratio.
 * Formula: Total Debt / Total Assets
 *
 * @param totalDebt - Total liabilities
 * @param totalAssets - Total assets
 * @returns The Debt-to-Assets ratio as a number
 * @throws {Error} If totalAssets is zero
 */
export function debtToAssets(totalDebt: Money, totalAssets: Money): number {
  if (stryMutAct_9fa48("389")) {
    {}
  } else {
    stryCov_9fa48("389");
    assertSameCurrency(totalDebt, totalAssets);
    if (stryMutAct_9fa48("391") ? false : stryMutAct_9fa48("390") ? true : (stryCov_9fa48("390", "391"), totalAssets.isZero())) {
      if (stryMutAct_9fa48("392")) {
        {}
      } else {
        stryCov_9fa48("392");
        throw new Error(stryMutAct_9fa48("393") ? "" : (stryCov_9fa48("393"), "Total assets cannot be zero"));
      }
    }
    return stryMutAct_9fa48("394") ? Number(totalDebt.minor) * Number(totalAssets.minor) : (stryCov_9fa48("394"), Number(totalDebt.minor) / Number(totalAssets.minor));
  }
}

/**
 * Calculates the Interest Coverage ratio.
 * Formula: EBIT / Interest Expense
 *
 * @param ebit - Earnings Before Interest and Taxes
 * @param interestExpense - Total interest expense
 * @returns The Interest Coverage ratio. Returns Infinity if interest expense is zero
 */
export function interestCoverage(ebit: Money, interestExpense: Money): number {
  if (stryMutAct_9fa48("395")) {
    {}
  } else {
    stryCov_9fa48("395");
    assertSameCurrency(ebit, interestExpense);
    if (stryMutAct_9fa48("397") ? false : stryMutAct_9fa48("396") ? true : (stryCov_9fa48("396", "397"), interestExpense.isZero())) {
      if (stryMutAct_9fa48("398")) {
        {}
      } else {
        stryCov_9fa48("398");
        return Infinity;
      }
    }
    return stryMutAct_9fa48("399") ? Number(ebit.minor) * Number(interestExpense.minor) : (stryCov_9fa48("399"), Number(ebit.minor) / Number(interestExpense.minor));
  }
}

/**
 * Calculates the Equity Multiplier
 * Formula: TotalAssets / TotalEquity
 *
 * @param totalAssets - Total assets
 * @param totalEquity - Total shareholders' equity
 * @returns The Equity Multiplier ratio as a number
 * @throws {Error} If total Equity is zero
 */
export function equityMultiplier(totalAssets: Money, totalEquity: Money): number {
  if (stryMutAct_9fa48("400")) {
    {}
  } else {
    stryCov_9fa48("400");
    assertSameCurrency(totalAssets, totalEquity);
    if (stryMutAct_9fa48("402") ? false : stryMutAct_9fa48("401") ? true : (stryCov_9fa48("401", "402"), totalEquity.isZero())) {
      if (stryMutAct_9fa48("403")) {
        {}
      } else {
        stryCov_9fa48("403");
        throw new Error(stryMutAct_9fa48("404") ? "" : (stryCov_9fa48("404"), "Total equity cannot be zero"));
      }
    }
    return stryMutAct_9fa48("405") ? Number(totalAssets.minor) * Number(totalEquity.minor) : (stryCov_9fa48("405"), Number(totalAssets.minor) / Number(totalEquity.minor));
  }
}

/**
 * Calculates all leverage ratios at once
 *
 * @param inputs - Object containing all necessary Money values
 * @returns An object with all calculated leverage ratios
 */
export function leverageRatios(inputs: LeverageInputs): LeverageResult {
  if (stryMutAct_9fa48("406")) {
    {}
  } else {
    stryCov_9fa48("406");
    return stryMutAct_9fa48("407") ? {} : (stryCov_9fa48("407"), {
      debtToEquity: debtToEquity(inputs.totalDebt, inputs.totalEquity),
      debtToAssets: debtToAssets(inputs.totalDebt, inputs.totalAssets),
      interestCoverage: interestCoverage(inputs.ebit, inputs.interestExpense),
      equityMultiplier: equityMultiplier(inputs.totalAssets, inputs.totalEquity)
    });
  }
}