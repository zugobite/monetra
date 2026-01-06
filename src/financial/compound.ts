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
export function futureValue(
  presentValue: Money,
  options: CompoundOptions,
): Money {
  const {
    rate,
    years,
    compoundingPerYear = 12,
    rounding = RoundingMode.HALF_EVEN,
  } = options;

  const n = compoundingPerYear;
  const t = years;
  const multiplier = Math.pow(1 + rate / n, n * t);

  return presentValue.multiply(multiplier, { rounding });
}

/**
 * Calculates present value (discounting).
 * PV = FV / (1 + r/n)^(n*t)
 */
export function presentValue(
  futureVal: Money,
  options: CompoundOptions,
): Money {
  const {
    rate,
    years,
    compoundingPerYear = 12,
    rounding = RoundingMode.HALF_EVEN,
  } = options;

  const n = compoundingPerYear;
  const t = years;
  const divisor = Math.pow(1 + rate / n, n * t);

  return futureVal.divide(divisor, { rounding });
}

// Alias for familiarity
export const compound = futureValue;
export const discount = presentValue;
