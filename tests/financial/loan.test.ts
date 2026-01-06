import { describe, it, expect } from "vitest";
import {
  loan,
  pmt,
  totalInterest,
  totalInterestFromSchedule,
  interestOnlyPayment,
} from "../../src/financial/loan";
import { Money } from "../../src/money/Money";
import { USD } from "../../src/currency/iso4217";
import { RoundingMode } from "../../src/rounding/strategies";

describe("Financial - Loan", () => {
  it("should calculate loan schedule", () => {
    const principal = Money.fromMajor("10000.00", USD);
    const schedule = loan({
      principal,
      annualRate: 0.05,
      periods: 12,
    });

    expect(schedule.length).toBe(12);

    // Total principal paid should equal original principal
    const totalPrincipal = schedule.reduce(
      (sum, entry) => sum.add(entry.principal),
      Money.zero(USD)
    );
    expect(totalPrincipal.equals(principal)).toBe(true);

    // Balance at end should be zero
    expect(schedule[11].balance.isZero()).toBe(true);
  });

  it("should calculate PMT", () => {
    const principal = Money.fromMajor("10000.00", USD);
    const payment = pmt({
      principal,
      annualRate: 0.05,
      periods: 12,
    });

    // Approx check: 10000 * (0.05/12) / (1 - (1+0.05/12)^-12) ~= 856.07
    expect(payment.format()).toBe("$856.07");
  });

  it("should calculate total interest using payment formula", () => {
    const principal = Money.fromMajor("10000.00", USD);
    const options = { principal, annualRate: 0.05, periods: 12 };

    const interest = totalInterest(options);

    // Verify against known value (calculated externally)
    expect(interest.format()).toBe("$272.84");

    // Cross-check against manual calculation: payment * periods - principal
    const payment = pmt(options);
    const manual = payment.multiply(options.periods).subtract(principal);
    expect(interest.equals(manual)).toBe(true);
  });

  it("should calculate total interest from loan schedule", () => {
    const principal = Money.fromMajor("10000.00", USD);

    const schedule = loan({
      principal,
      annualRate: 0.05,
      periods: 12,
    });
    const interest = totalInterestFromSchedule(schedule);

    const sum = schedule.reduce(
      (sum, entry) => sum.add(entry.interest),
      Money.zero(USD)
    );

    expect(interest.equals(sum)).toBe(true);
  });

  it("should throw error for empty schedule in totalInterestFromSchedule", () => {
    expect(() => totalInterestFromSchedule([])).toThrow(/Schedule must have at least one entry/);
  });

  it("should return zero interest for zero-interest loans", () => {
    const principal = Money.fromMajor("10000.00", USD);

    const interest = totalInterest({
      principal,
      annualRate: 0,
      periods: 12,
    });

    expect(interest.isZero()).toBe(true);
  });

  it("should calculate zero-interest loan payments using rounding", () => {
    const principal = Money.fromMajor("100.01", USD);

    const scheduleHalfEven = loan({
      principal,
      annualRate: 0,
      periods: 2,
      rounding: RoundingMode.HALF_EVEN,
    });

    const scheduleHalfUp = loan({
      principal,
      annualRate: 0,
      periods: 2,
      rounding: RoundingMode.HALF_UP,
    });

    // 100.01 / 2 = 50.005
    // HALF_EVEN -> 50.00, HALF_UP -> 50.01
    expect(scheduleHalfEven[0].payment.format()).toBe("$50.00");
    expect(scheduleHalfUp[0].payment.format()).toBe("$50.01");

    // Interest should be zero for all periods when annualRate is zero
    expect(scheduleHalfEven.every((e) => e.interest.isZero())).toBe(true);
    expect(scheduleHalfUp.every((e) => e.interest.isZero())).toBe(true);
  });

  it("should charge interest for non-zero interest loans", () => {
    const principal = Money.fromMajor("1000.00", USD);
    const schedule = loan({
      principal,
      annualRate: 0.12,
      periods: 12,
    });

    expect(schedule[0].interest.isZero()).toBe(false);
  });

  describe("Interest-Only Loans", () => {
    it("should calculate monthly interest-only payment", () => {
      const principal = Money.fromMajor("100000.00", USD);
      const payment = interestOnlyPayment({
        principal,
        annualRate: 0.06, // 6% annual rate
        periodsPerYear: 12, // Monthly payments
      });

      // Monthly payment = 100,000 × (0.06 / 12) = 100,000 × 0.005 = 500.00
      expect(payment.format()).toBe("$500.00");
    });

    it("should calculate quarterly interest-only payment", () => {
      const principal = Money.fromMajor("50000.00", USD);
      const payment = interestOnlyPayment({
        principal,
        annualRate: 0.08, // 8% annual rate
        periodsPerYear: 4, // Quarterly payments
      });

      // Quarterly payment = 50,000 × (0.08 / 4) = 50,000 × 0.02 = 1,000.00
      expect(payment.format()).toBe("$1,000.00");
    });

    it("should calculate annual interest-only payment", () => {
      const principal = Money.fromMajor("200000.00", USD);
      const payment = interestOnlyPayment({
        principal,
        annualRate: 0.05, // 5% annual rate
        periodsPerYear: 1, // Annual payment
      });

      // Annual payment = 200,000 × (0.05 / 1) = 200,000 × 0.05 = 10,000.00
      expect(payment.format()).toBe("$10,000.00");
    });

    it("should return zero for zero interest rate", () => {
      const principal = Money.fromMajor("100000.00", USD);
      const payment = interestOnlyPayment({
        principal,
        annualRate: 0,
        periodsPerYear: 12,
      });

      expect(payment.isZero()).toBe(true);
    });

    it("should handle commercial real estate example", () => {
      // $5M commercial property with 5.5% interest-only for 5 years
      const principal = Money.fromMajor("5000000.00", USD);
      const monthlyPayment = interestOnlyPayment({
        principal,
        annualRate: 0.055,
        periodsPerYear: 12,
      });

      // Monthly = 5,000,000 × (0.055 / 12) = 5,000,000 × 0.00458333... = 22,916.67
      expect(monthlyPayment.format()).toBe("$22,916.67");
    });
  });

  it("should handle edge case where balance might go negative in amortization", () => {
    // Create a scenario with very small principal and high interest that could cause
    // computational rounding to produce a slightly negative balance
    const principal = Money.fromMajor("1.00", USD);
    const schedule = loan({
      principal,
      annualRate: 0.99, // Very high rate
      periods: 2,
      rounding: RoundingMode.HALF_UP,
    });

    // All balances should be >= 0
    schedule.forEach((entry) => {
      expect(entry.balance.isNegative()).toBe(false);
    });

    // Final balance should be zero
    expect(schedule[schedule.length - 1].balance.isZero()).toBe(true);
  });

  it("should handle balance going negative due to rounding in principal calculation", () => {
    // Create a very specific scenario to trigger line 88's isNegative() check
    // We need: balance.subtract(principalPayment) to go negative in a non-final period
    //
    // Use CEILING rounding to make payment slightly too large, combined with
    // small principal and few periods to exaggerate rounding effects
    
    const principal = Money.fromMajor("0.04", USD); // 4 cents
    const schedule = loan({
      principal,
      annualRate: 0.01, // Small interest
      periods: 3,
      periodsPerYear: 1, // Annual periods (makes rate/period larger)
      rounding: RoundingMode.CEIL, // Round up to make payment larger
    });

    // Verify all balances are non-negative (line 88 clamps negative to zero)
    schedule.forEach((entry) => {
      expect(entry.balance.isNegative()).toBe(false);
    });

    expect(schedule[schedule.length - 1].balance.isZero()).toBe(true);
  });
});
