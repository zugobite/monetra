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

  it("should return zero interest for zero-interest loans", () => {
    const principal = Money.fromMajor("10000.00", USD);

    const interest = totalInterest({
      principal,
      annualRate: 0,
      periods: 12,
    });

    expect(interest.isZero()).toBe(true);
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
});
