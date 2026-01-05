import { describe, it, expect } from "vitest";
import { simpleInterest, simpleInterestTotal } from "../../src/financial/simple";
import { Money } from "../../src/money/Money";
import { Rate } from "../../src/financial/rate";
import { USD, EUR } from "../../src/currency/iso4217";
import { RoundingMode } from "../../src/rounding/strategies";

describe("Financial - Simple Interest", () => {
  describe("simpleInterest", () => {
    it("should calculate simple interest with known values", () => {
      // Test case: $1,000 at 5% for 2 years
      // Expected: $1,000 × 0.05 × 2 = $100.00
      const principal = Money.fromMajor("1000.00", USD);
      const rate = Rate.percent(5);
      const interest = simpleInterest(principal, { rate, years: 2 });
      
      expect(interest.format()).toBe("$100.00");
    });

    it("should calculate simple interest with fractional years", () => {
      // Test case: $5,000 at 6% for 1.5 years  
      // Expected: $5,000 × 0.06 × 1.5 = $450.00
      const principal = Money.fromMajor("5000.00", USD);
      const rate = Rate.percent(6);
      const interest = simpleInterest(principal, { rate, years: 1.5 });
      
      expect(interest.format()).toBe("$450.00");
    });

    it("should calculate simple interest with decimal rate", () => {
      // Test case: $2,500 at 3.25% for 3 years
      // Expected: $2,500 × 0.0325 × 3 = $243.75
      const principal = Money.fromMajor("2500.00", USD);
      const rate = Rate.percent(3.25);
      const interest = simpleInterest(principal, { rate, years: 3 });
      
      expect(interest.format()).toBe("$243.75");
    });

    it("should handle different currencies", () => {
      const principal = Money.fromMajor("1000.00", EUR);
      const rate = Rate.percent(4);
      const interest = simpleInterest(principal, { rate, years: 1 });
      
      expect(interest.format()).toBe("40,00\u00A0€");
      expect(interest.currency).toBe(EUR);
    });

    it("should handle zero rate", () => {
      const principal = Money.fromMajor("1000.00", USD);
      const rate = Rate.zero();
      const interest = simpleInterest(principal, { rate, years: 5 });
      
      expect(interest.format()).toBe("$0.00");
    });

    it("should handle zero time", () => {
      const principal = Money.fromMajor("1000.00", USD);
      const rate = Rate.percent(10);
      const interest = simpleInterest(principal, { rate, years: 0 });
      
      expect(interest.format()).toBe("$0.00");
    });

    it("should handle large principal amounts", () => {
      // Test case: $100,000 at 2.75% for 4 years
      // Expected: $100,000 × 0.0275 × 4 = $11,000.00
      const principal = Money.fromMajor("100000.00", USD);
      const rate = Rate.percent(2.75);
      const interest = simpleInterest(principal, { rate, years: 4 });
      
      expect(interest.format()).toBe("$11,000.00");
    });

    it("should respect rounding modes", () => {
      // Test case that results in fraction requiring rounding
      // Using a calculation that results in 0.333... cents
      const principal = Money.fromMinor(1, USD); // $0.01
      const rate = Rate.decimal(1/3); // 33.333...% creates fractional minor units
      
      const interestFloor = simpleInterest(principal, { 
        rate, 
        years: 1, 
        rounding: RoundingMode.FLOOR 
      });
      const interestCeil = simpleInterest(principal, { 
        rate, 
        years: 1, 
        rounding: RoundingMode.CEIL 
      });
      
      // These should be different due to rounding
      expect(interestFloor.equals(interestCeil)).toBe(false);
    });
  });

  describe("simpleInterestTotal", () => {
    it("should calculate total amount with known values", () => {
      // Test case: $1,000 at 5% for 2 years
      // Expected: $1,000 × (1 + 0.05 × 2) = $1,000 × 1.10 = $1,100.00
      const principal = Money.fromMajor("1000.00", USD);
      const rate = Rate.percent(5);
      const total = simpleInterestTotal(principal, { rate, years: 2 });
      
      expect(total.format()).toBe("$1,100.00");
    });

    it("should calculate total with fractional years", () => {
      // Test case: $5,000 at 6% for 1.5 years
      // Expected: $5,000 × (1 + 0.06 × 1.5) = $5,000 × 1.09 = $5,450.00
      const principal = Money.fromMajor("5000.00", USD);
      const rate = Rate.percent(6);
      const total = simpleInterestTotal(principal, { rate, years: 1.5 });
      
      expect(total.format()).toBe("$5,450.00");
    });

    it("should equal principal plus simple interest", () => {
      const principal = Money.fromMajor("2500.00", USD);
      const rate = Rate.percent(4.5);
      const years = 3;
      
      const interest = simpleInterest(principal, { rate, years });
      const total = simpleInterestTotal(principal, { rate, years });
      const expectedTotal = principal.add(interest);
      
      expect(total.equals(expectedTotal)).toBe(true);
    });

    it("should handle different currencies", () => {
      const principal = Money.fromMajor("1500.00", EUR);
      const rate = Rate.percent(3.5);
      const total = simpleInterestTotal(principal, { rate, years: 2 });
      
      expect(total.currency).toBe(EUR);
      // €1,500 × (1 + 0.035 × 2) = €1,500 × 1.07 = €1,605.00
      expect(total.format()).toBe("1.605,00\u00A0€");
    });

    it("should return principal when rate is zero", () => {
      const principal = Money.fromMajor("1000.00", USD);
      const rate = Rate.zero();
      const total = simpleInterestTotal(principal, { rate, years: 5 });
      
      expect(total.equals(principal)).toBe(true);
    });

    it("should return principal when time is zero", () => {
      const principal = Money.fromMajor("1000.00", USD);
      const rate = Rate.percent(10);
      const total = simpleInterestTotal(principal, { rate, years: 0 });
      
      expect(total.equals(principal)).toBe(true);
    });

    it("should handle high interest rates", () => {
      // Test case: $1,000 at 15% for 3 years (high rate scenario)
      // Expected: $1,000 × (1 + 0.15 × 3) = $1,000 × 1.45 = $1,450.00
      const principal = Money.fromMajor("1000.00", USD);
      const rate = Rate.percent(15);
      const total = simpleInterestTotal(principal, { rate, years: 3 });
      
      expect(total.format()).toBe("$1,450.00");
    });

    it("should respect rounding modes", () => {
      // Using a calculation that results in fractional minor units
      const principal = Money.fromMinor(1, USD); // $0.01
      const rate = Rate.decimal(1/3); // 33.333...% creates fractional minor units
      
      const totalFloor = simpleInterestTotal(principal, { 
        rate, 
        years: 1, 
        rounding: RoundingMode.FLOOR 
      });
      const totalCeil = simpleInterestTotal(principal, { 
        rate, 
        years: 1, 
        rounding: RoundingMode.CEIL 
      });
      
      // These should be different due to rounding
      expect(totalFloor.equals(totalCeil)).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle very small principal amounts", () => {
      const principal = Money.fromMinor(1, USD); // $0.01
      const rate = Rate.percent(5);
      const interest = simpleInterest(principal, { rate, years: 1 });
      
      // Should handle minimal amounts without error
      expect(Number(interest.minor)).toBeGreaterThanOrEqual(0);
    });

    it("should handle very high principal amounts", () => {
      const principal = Money.fromMajor("999999999.99", USD);
      const rate = Rate.percent(1);
      const total = simpleInterestTotal(principal, { rate, years: 1 });
      
      // Should handle large amounts without overflow
      expect(parseFloat(total.toDecimalString())).toBeGreaterThan(parseFloat(principal.toDecimalString()));
    });

    it("should maintain currency consistency", () => {
      const principal = Money.fromMajor("1000.00", USD);
      const rate = Rate.percent(5);
      
      const interest = simpleInterest(principal, { rate, years: 1 });
      const total = simpleInterestTotal(principal, { rate, years: 1 });
      
      expect(interest.currency).toBe(principal.currency);
      expect(total.currency).toBe(principal.currency);
    });
  });
});