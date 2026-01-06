import { describe, it, expect } from "vitest";
import { divideWithRounding, RoundingMode } from "../../src/rounding/index";

describe("Rounding Edge Cases", () => {
    describe("Division by Zero", () => {
        it("should throw error when dividing by zero", () => {
            try {
                divideWithRounding(100n, 0n, RoundingMode.HALF_UP);
                throw new Error("Expected divideWithRounding to throw");
            } catch (err) {
                // This should be the explicit Error thrown by divideWithRounding,
                // not the runtime RangeError BigInt would throw.
                expect(err).toBeInstanceOf(Error);
                expect((err as Error).name).toBe("Error");
                expect((err as Error).message).toBe("Division by zero");
            }
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

    describe("Modes that differ on odd halves", () => {
        it("should distinguish HALF_DOWN from HALF_EVEN on 3.5", () => {
            // 7/2 = 3.5 (odd quotient)
            // HALF_DOWN rounds toward zero on exact halves -> 3
            expect(divideWithRounding(7n, 2n, RoundingMode.HALF_DOWN)).toBe(3n);
            expect(divideWithRounding(-7n, 2n, RoundingMode.HALF_DOWN)).toBe(-3n);

            // HALF_EVEN rounds to nearest even -> 4 / -4
            expect(divideWithRounding(7n, 2n, RoundingMode.HALF_EVEN)).toBe(4n);
            expect(divideWithRounding(-7n, 2n, RoundingMode.HALF_EVEN)).toBe(-4n);
        });
    });

    describe("Exact Division (remainder === 0)", () => {
        it("should return the exact quotient for CEIL when evenly divisible", () => {
            // If the early-return on remainder===0 is removed, CEIL would incorrectly add 1.
            expect(divideWithRounding(10n, 2n, RoundingMode.CEIL)).toBe(5n);
            expect(divideWithRounding(-10n, 2n, RoundingMode.CEIL)).toBe(-5n);
        });
    });

    describe("HALF_DOWN more-than-half", () => {
        it("should round away from zero when fraction is greater than half", () => {
            // 7/4 = 1.75 -> 2
            expect(divideWithRounding(7n, 4n, RoundingMode.HALF_DOWN)).toBe(2n);
            // -7/4 = -1.75 -> -2
            expect(divideWithRounding(-7n, 4n, RoundingMode.HALF_DOWN)).toBe(-2n);
            // 7/-4 = -1.75 -> -2
            expect(divideWithRounding(7n, -4n, RoundingMode.HALF_DOWN)).toBe(-2n);
            // -7/-4 = 1.75 -> 2
            expect(divideWithRounding(-7n, -4n, RoundingMode.HALF_DOWN)).toBe(2n);
        });
    });

    describe("HALF_EVEN more-than-half (negative)", () => {
        it("should round away from zero when more than half", () => {
            // -8/3 = -2.666... -> -3
            expect(divideWithRounding(-8n, 3n, RoundingMode.HALF_EVEN)).toBe(-3n);
        });
    });

    describe("Unsupported rounding mode", () => {
        it("should throw a helpful error for unsupported mode", () => {
            expect(() => divideWithRounding(5n, 2n, "NOPE" as any)).toThrow(
                "Unsupported rounding mode: NOPE"
            );
        });
    });
});
