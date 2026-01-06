import { describe, it, expect } from "vitest";
import { divideWithRounding, RoundingMode } from "../../src/rounding/index";

describe("Rounding Comprehensive Logic", () => {
  const modes = Object.values(RoundingMode);

  // Helper to test all sign combinations
  function testSignPermutations(n: bigint, d: bigint, mode: RoundingMode, expectedPosPos: bigint) {
    // We can't easily predict negative results for all modes from the positive one because 
    // symmetric vs asymmetric rounding differs per mode. 
    // So we will just expect explicit values for each test case below.
  }

  describe("HALF_UP (Commercial Rounding)", () => {
    // Rounds towards nearest neighbor. If equidistant, rounds away from zero.
    // 2.5 -> 3, -2.5 -> -3
    it("should handle exact halves correctly", () => {
      // 5 / 2 = 2.5 -> 3
      expect(divideWithRounding(5n, 2n, RoundingMode.HALF_UP)).toBe(3n);
      // -5 / 2 = -2.5 -> -3
      expect(divideWithRounding(-5n, 2n, RoundingMode.HALF_UP)).toBe(-3n);
      // 5 / -2 = -2.5 -> -3
      expect(divideWithRounding(5n, -2n, RoundingMode.HALF_UP)).toBe(-3n);
      // -5 / -2 = 2.5 -> 3
      expect(divideWithRounding(-5n, -2n, RoundingMode.HALF_UP)).toBe(3n);
    });

    it("should handle less than half", () => {
      // 2.2 -> 2
      expect(divideWithRounding(11n, 5n, RoundingMode.HALF_UP)).toBe(2n);
      // -2.2 -> -2
      expect(divideWithRounding(-11n, 5n, RoundingMode.HALF_UP)).toBe(-2n);
    });

    it("should handle more than half", () => {
      // 2.6 -> 3
      expect(divideWithRounding(13n, 5n, RoundingMode.HALF_UP)).toBe(3n);
      // -2.6 -> -3
      expect(divideWithRounding(-13n, 5n, RoundingMode.HALF_UP)).toBe(-3n);
    });
  });

  describe("HALF_DOWN", () => {
    // Rounds towards nearest neighbor. If equidistant, rounds towards zero.
    // 2.5 -> 2, -2.5 -> -2
    it("should handle exact halves correctly", () => {
      expect(divideWithRounding(5n, 2n, RoundingMode.HALF_DOWN)).toBe(2n);
      expect(divideWithRounding(-5n, 2n, RoundingMode.HALF_DOWN)).toBe(-2n);
      expect(divideWithRounding(5n, -2n, RoundingMode.HALF_DOWN)).toBe(-2n);
      expect(divideWithRounding(-5n, -2n, RoundingMode.HALF_DOWN)).toBe(2n);
    });
  });

  describe("HALF_EVEN (Bankers Rounding)", () => {
    // Rounds towards nearest neighbor. If equidistant, rounds towards nearest even integer.
    it("should handle exact halves correctly", () => {
      // 2.5 -> 2 (2 is even, 3 is odd)
      expect(divideWithRounding(5n, 2n, RoundingMode.HALF_EVEN)).toBe(2n);
      // 3.5 -> 4 (4 is even, 3 is odd)
      expect(divideWithRounding(7n, 2n, RoundingMode.HALF_EVEN)).toBe(4n);
      
      // Negative
      // -2.5 -> -2
      expect(divideWithRounding(-5n, 2n, RoundingMode.HALF_EVEN)).toBe(-2n);
      // -3.5 -> -4
      expect(divideWithRounding(-7n, 2n, RoundingMode.HALF_EVEN)).toBe(-4n);
    });
  });

  describe("FLOOR", () => {
    // Rounds towards negative infinity
    it("should always round down", () => {
      // 2.5 -> 2
      expect(divideWithRounding(5n, 2n, RoundingMode.FLOOR)).toBe(2n);
      // -2.5 -> -3
      expect(divideWithRounding(-5n, 2n, RoundingMode.FLOOR)).toBe(-3n);
    });
  });

  describe("CEIL", () => {
    // Rounds towards positive infinity
    it("should always round up", () => {
      // 2.5 -> 3
      expect(divideWithRounding(5n, 2n, RoundingMode.CEIL)).toBe(3n);
      // -2.5 -> -2
      expect(divideWithRounding(-5n, 2n, RoundingMode.CEIL)).toBe(-2n);
    });
  });

  describe("TRUNCATE (DOWN)", () => {
    // Rounds towards zero
    it("should truncate decimals", () => {
      // 2.9 -> 2
      expect(divideWithRounding(29n, 10n, RoundingMode.TRUNCATE)).toBe(2n);
      // -2.9 -> -2
      expect(divideWithRounding(-29n, 10n, RoundingMode.TRUNCATE)).toBe(-2n);
    });
  });
});
