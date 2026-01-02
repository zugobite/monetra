import { describe, it, expect } from "vitest";
import { loan, pmt } from "../../src/financial/loan";
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
});
