import { describe, it, expect } from "vitest";
import { loan, pmt, totalInterest, totalInterestFromSchedule } from "../../src/financial/loan";
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
});
