// @ts-nocheck
import { describe, it, expect } from "vitest";
import { divideWithRounding, RoundingMode } from "../../src/rounding/index";

describe("Rounding Edge Cases", () => {
    describe("Division by Zero", () => {
        it("should throw error when dividing by zero", () => {
            expect(() => divideWithRounding(100n, 0n, RoundingMode.HALF_UP)).toThrow(
                "Division by zero"
            );
        });
    });

    describe("Zero Numerator", () => {
        it("should return 0 when numerator is 0", () => {
            expect(divideWithRounding(0n, 5n, RoundingMode.HALF_UP)).toBe(0n);
        });
    });

    describe("Negative Numbers", () => {
        it("should handle negative result rounding correctly", () => {
            // -10 / 3 = -3.33...
            // FLOOR: -4
            // CEIL: -3
            expect(divideWithRounding(-10n, 3n, RoundingMode.FLOOR)).toBe(-4n);
            expect(divideWithRounding(-10n, 3n, RoundingMode.CEIL)).toBe(-3n);
            expect(divideWithRounding(-10n, 3n, RoundingMode.TRUNCATE)).toBe(-3n);
        });

        it("should handle negative denominator", () => {
             // 10 / -3 = -3.33...
             expect(divideWithRounding(10n, -3n, RoundingMode.FLOOR)).toBe(-4n);
        });
    });

    describe("Exact Half Cases (2.5, -2.5)", () => {
        // 25 / 10 = 2.5
        const num = 25n;
        const den = 10n;

        it("HALF_UP: 2.5 -> 3", () => {
             expect(divideWithRounding(num, den, RoundingMode.HALF_UP)).toBe(3n);
        });

        it("HALF_DOWN: 2.5 -> 2", () => {
             expect(divideWithRounding(num, den, RoundingMode.HALF_DOWN)).toBe(2n);
        });

        it("HALF_EVEN: 2.5 -> 2 (nearest even)", () => {
            expect(divideWithRounding(num, den, RoundingMode.HALF_EVEN)).toBe(2n);
        });

        it("HALF_EVEN: 3.5 -> 4 (nearest even)", () => {
             // 35 / 10 = 3.5
            expect(divideWithRounding(35n, 10n, RoundingMode.HALF_EVEN)).toBe(4n);
        });
        
        it("HALF_EVEN: -2.5 -> -2", () => {
            // -25 / 10 = -2.5
             expect(divideWithRounding(-25n, 10n, RoundingMode.HALF_EVEN)).toBe(-2n);
        });

        it("HALF_EVEN: -3.5 -> -4", () => {
            // -35 / 10 = -3.5
             expect(divideWithRounding(-35n, 10n, RoundingMode.HALF_EVEN)).toBe(-4n);
        });
    });
});
