import { Money } from "../money/Money";
import { RoundingMode } from "../rounding/strategies";
import { CurrencyMismatchError } from "../errors/CurrencyMismatchError";

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
  if (initialValue.currency.code !== finalValue.currency.code) {
    throw new CurrencyMismatchError(
      initialValue.currency.code,
      finalValue.currency.code
    );
  }

  const gain = finalValue.subtract(initialValue);
  return Number(gain.minor) / Number(initialValue.minor);
}

/**
 * Calculates Net Present Value of cash flows.
 */
export function npv(
  discountRate: number,
  cashFlows: Money[] // First is initial investment (usually negative)
): Money {
  if (cashFlows.length === 0) {
    throw new Error("At least one cash flow required");
  }

  const currency = cashFlows[0].currency;

  let total = Money.zero(currency);

  for (let i = 0; i < cashFlows.length; i++) {
    const discountFactor = Math.pow(1 + discountRate, i);
    const discounted = cashFlows[i].divide(discountFactor, {
      rounding: RoundingMode.HALF_EVEN,
    });
    total = total.add(discounted);
  }

  return total;
}

/**
 * Calculates Internal Rate of Return using Newton-Raphson method.
 * @returns The IRR as a decimal (e.g., 0.12 for 12%)
 */
export function irr(cashFlows: Money[], guess: number = 0.1): number {
  const values = cashFlows.map((cf) => Number(cf.minor));

  const maxIterations = 100;
  const tolerance = 1e-7;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npvValue = 0;
    let derivative = 0;

    for (let j = 0; j < values.length; j++) {
      const denominator = Math.pow(1 + rate, j);
      npvValue += values[j] / denominator;
      if (j > 0) {
        derivative -= (j * values[j]) / Math.pow(1 + rate, j + 1);
      }
    }

    const newRate = rate - npvValue / derivative;

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate;
    }

    rate = newRate;
  }

  throw new Error("IRR calculation did not converge");
}
