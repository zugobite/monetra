import { describe, it, expect } from "vitest";
import { allocate } from "../../src/money/allocation";
import { Money } from "../../src/money/Money";
import { USD } from "../../src/currency/iso4217";

describe("Allocation", () => {
  it("should allocate money", () => {
    const m = Money.fromMajor("100", USD);
    const shares = allocate(m.minor, [1, 1]); // Pass bigint, not Money object
    expect(shares[0]).toBe(5000n);
    expect(shares[1]).toBe(5000n);
  });

  it("should throw error for empty ratios array", () => {
    const m = Money.fromMajor("100", USD);
    expect(() => allocate(m.minor, [])).toThrow("Cannot allocate to empty ratios");
  });

  it("should throw error for zero total ratio", () => {
    const m = Money.fromMajor("100", USD);
    expect(() => allocate(m.minor, [0, 0])).toThrow("Total ratio must be greater than zero");
  });

  it("should handle decimal ratios correctly", () => {
    const m = Money.fromMajor("100", USD);
    const shares = allocate(m.minor, [0.5, 0.5]); // 50/50 split with decimals
    expect(shares[0]).toBe(5000n);
    expect(shares[1]).toBe(5000n);
  });
});
