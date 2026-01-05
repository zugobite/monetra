import { describe, it, expect } from "vitest";
import { straightLineDepreciation } from "../../src/financial/depreciation";
import { Money } from "../../src/money/Money";
import { USD, EUR } from "../../src/currency/iso4217";
import { RoundingMode } from "../../src/rounding/strategies";

describe("Financial - Depreciation", () => {
  it("should calculate straight-line depreciation correctly", () => {
    const cost = Money.fromMajor("1000.00", USD);
    const salvageValue = Money.fromMajor("0.00", USD);
    const usefulLife = 5;

    const result = straightLineDepreciation({ cost, salvageValue, usefulLife });

    expect(result.annualDepreciation.format()).toBe("$200.00");
    expect(result.bookValueAtYear(1).format()).toBe("$800.00");
    expect(result.bookValueAtYear(5).format()).toBe("$0.00");
  });

  it("should handle salvage value", () => {
    const cost = Money.fromMajor("1000.00", USD);
    const salvageValue = Money.fromMajor("200.00", USD);
    const usefulLife = 4;

    const result = straightLineDepreciation({ cost, salvageValue, usefulLife });

    // (1000 - 200) / 4 = 200
    expect(result.annualDepreciation.format()).toBe("$200.00");
    expect(result.bookValueAtYear(4).format()).toBe("$200.00");
  });

  it("should handle rounding correctly", () => {
    const cost = Money.fromMajor("100.00", USD);
    const salvageValue = Money.fromMajor("0.00", USD);
    const usefulLife = 3;

    const result = straightLineDepreciation({ cost, salvageValue, usefulLife });

    // 100 / 3 = 33.333... -> 33.33 (HALF_EVEN)
    expect(result.annualDepreciation.format()).toBe("$33.33");
    
    const schedule = result.schedule();
    expect(schedule).toHaveLength(3);
    expect(schedule[0].depreciation.format()).toBe("$33.33");
    expect(schedule[0].bookValue.format()).toBe("$66.67");
    
    expect(schedule[1].depreciation.format()).toBe("$33.33");
    expect(schedule[1].bookValue.format()).toBe("$33.34");
    
    expect(schedule[2].depreciation.format()).toBe("$33.33");
    expect(schedule[2].bookValue.format()).toBe("$0.01"); // 100 - 99.99
  });

  it("should clamp book value to salvage value when rounding causes overshoot", () => {
      // Cost 10.00, Life 3. 
      // 10 / 3 = 3.333...
      // If we force RoundingMode.CEIL -> 3.34
      // Year 1: 10 - 3.34 = 6.66
      // Year 2: 10 - 6.68 = 3.32
      // Year 3: 10 - 10.02 = -0.02 -> Should be clamped to 0.00
      
      const cost = Money.fromMajor("10.00", USD);
      const salvageValue = Money.fromMajor("0.00", USD);
      const usefulLife = 3;
      
      const result = straightLineDepreciation({ 
          cost, 
          salvageValue, 
          usefulLife,
          rounding: RoundingMode.CEIL 
      });
      
      expect(result.annualDepreciation.format()).toBe("$3.34");
      expect(result.bookValueAtYear(3).format()).toBe("$0.00");
      
      const schedule = result.schedule();
      expect(schedule[2].bookValue.format()).toBe("$0.00");
      // Depreciation in last year should be adjusted
      // Previous BV (Year 2) = 3.32
      // Current BV (Year 3) = 0.00
      // Depreciation = 3.32
      expect(schedule[2].depreciation.format()).toBe("$3.32");
  });
  
  it("should throw error for currency mismatch", () => {
    const cost = Money.fromMajor("1000.00", USD);
    const salvageValue = Money.fromMajor("0.00", EUR);
    expect(() => straightLineDepreciation({ cost, salvageValue, usefulLife: 5 })).toThrow(/Currency mismatch/);
  });

  it("should throw error for invalid useful life", () => {
    const cost = Money.fromMajor("1000.00", USD);
    const salvageValue = Money.fromMajor("0.00", USD);
    expect(() => straightLineDepreciation({ cost, salvageValue, usefulLife: 0 })).toThrow(/Useful life must be positive/);
    expect(() => straightLineDepreciation({ cost, salvageValue, usefulLife: -1 })).toThrow(/Useful life must be positive/);
  });

  it("should throw error if salvage value > cost", () => {
    const cost = Money.fromMajor("1000.00", USD);
    const salvageValue = Money.fromMajor("1200.00", USD);
    expect(() => straightLineDepreciation({ cost, salvageValue, usefulLife: 5 })).toThrow(/Salvage value cannot be greater than cost/);
  });
});
