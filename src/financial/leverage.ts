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
  assertSameCurrency(totalDebt, totalEquity);
  if (totalEquity.isZero()) {
    throw new Error("Total equity cannot be zero");
  }
  return Number(totalDebt.minor) / Number(totalEquity.minor);
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
  assertSameCurrency(totalDebt, totalAssets);
  if (totalAssets.isZero()) {
    throw new Error("Total assets cannot be zero");
  }
  return Number(totalDebt.minor) / Number(totalAssets.minor);
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
  assertSameCurrency(ebit, interestExpense);
  if (interestExpense.isZero()) {
    return Infinity;
  }
  return Number(ebit.minor) / Number(interestExpense.minor);
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
export function equityMultiplier(
  totalAssets: Money,
  totalEquity: Money,
): number {
  assertSameCurrency(totalAssets, totalEquity);
  if (totalEquity.isZero()) {
    throw new Error("Total equity cannot be zero");
  }
  return Number(totalAssets.minor) / Number(totalEquity.minor);
}

/**
 * Calculates all leverage ratios at once
 *
 * @param inputs - Object containing all necessary Money values
 * @returns An object with all calculated leverage ratios
 */
export function leverageRatios(inputs: LeverageInputs): LeverageResult {
  return {
    debtToEquity: debtToEquity(inputs.totalDebt, inputs.totalEquity),
    debtToAssets: debtToAssets(inputs.totalDebt, inputs.totalAssets),
    interestCoverage: interestCoverage(inputs.ebit, inputs.interestExpense),
    equityMultiplier: equityMultiplier(inputs.totalAssets, inputs.totalEquity),
  };
}
