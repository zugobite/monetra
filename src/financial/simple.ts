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
export function simpleInterest(
  principal: Money,
  options: SimpleInterestOptions,
): Money {
  const { rate, years, rounding = RoundingMode.HALF_EVEN } = options;

  // Handle edge cases
  if (rate.isZero() || years === 0) {
    return Money.zero(principal.currency);
  }

  // Simple Interest = Principal × Rate × Time
  const interestMultiplier = rate.toDecimal() * years;

  return principal.multiply(interestMultiplier, { rounding });
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
export function simpleInterestTotal(
  principal: Money,
  options: SimpleInterestOptions,
): Money {
  const { rate, years, rounding = RoundingMode.HALF_EVEN } = options;

  // Handle edge cases
  if (rate.isZero() || years === 0) {
    return principal;
  }

  // Total Amount = Principal × (1 + rate × time)
  const totalMultiplier = 1 + rate.toDecimal() * years;

  return principal.multiply(totalMultiplier, { rounding });
}
