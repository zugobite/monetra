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
  const {
    principal,
    annualRate,
    periods,
    periodsPerYear = 12,
    rounding = RoundingMode.HALF_EVEN,
  } = options;

  const periodicRate = annualRate / periodsPerYear;
  let payment: Money;

  if (annualRate === 0) {
    payment = principal.divide(periods, { rounding });
  } else {
    // PMT formula: P * (r(1+r)^n) / ((1+r)^n - 1)
    const r = periodicRate;
    const n = periods;
    const numerator = r * Math.pow(1 + r, n);
    const denominator = Math.pow(1 + r, n) - 1;
    const pmtMultiplier = numerator / denominator;
    payment = principal.multiply(pmtMultiplier, { rounding });
  }

  const schedule: LoanScheduleEntry[] = [];
  let balance = principal;

  for (let period = 1; period <= periods; period++) {
    const interest =
      annualRate === 0
        ? Money.zero(principal.currency)
        : balance.multiply(periodicRate, { rounding });

    let principalPayment = payment.subtract(interest);

    // If payment < interest (negative amortization), principal payment is negative.
    // This implementation assumes standard amortization.

    balance = balance.subtract(principalPayment);

    // Handle final period rounding adjustment
    if (period === periods && !balance.isZero()) {
      const adjustedPrincipal = principalPayment.add(balance);
      schedule.push({
        period,
        payment: interest.add(adjustedPrincipal),
        principal: adjustedPrincipal,
        interest,
        balance: Money.zero(principal.currency),
      });
    } else {
      schedule.push({
        period,
        payment,
        principal: principalPayment,
        interest,
        balance: balance.isNegative()
          ? Money.zero(principal.currency)
          : balance,
      });
    }
  }

  return schedule;
}

/**
 * Calculates monthly payment amount.
 */
export function pmt(
  options: Omit<LoanOptions, "rounding"> & { rounding?: RoundingMode },
): Money {
  const schedule = loan(options);
  return schedule[0].payment;
}

/**
 * Calculates total interest over the life of the loan using the payment formula.
 */
export function totalInterest(options: LoanOptions): Money {
  const {
    principal,
    annualRate,
    periods,
    rounding = RoundingMode.HALF_EVEN,
  } = options;

  if (annualRate === 0) {
    return Money.zero(principal.currency);
  }

  const payment = pmt(options);
  const totalPaid = payment.multiply(periods, { rounding });
  return totalPaid.subtract(principal);
}

/**
 * Sums the interest column from a loan schedule.
 */
export function totalInterestFromSchedule(
  schedule: LoanScheduleEntry[],
): Money {
  if (schedule.length === 0) {
    throw new Error("Schedule must have at least one entry");
  }

  const currency = schedule[0].interest.currency;
  return schedule.reduce(
    (sum, entry) => sum.add(entry.interest),
    Money.zero(currency),
  );
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
  const {
    principal,
    annualRate,
    periodsPerYear = 12,
    rounding = RoundingMode.HALF_EVEN,
  } = options;

  // If rate is zero, interest payment is zero
  if (annualRate === 0) {
    return Money.zero(principal.currency);
  }

  const periodicRate = annualRate / periodsPerYear;
  return principal.multiply(periodicRate, { rounding });
}
