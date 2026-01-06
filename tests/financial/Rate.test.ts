import { describe, it, expect } from "vitest";
import { Rate } from "../../src/financial/rate";

describe("Financial - Rate", () => {
    it("should create from percent (number) and convert to decimal", () => {
        const rate = Rate.percent(5);
        expect(rate.toPercent()).toBeCloseTo(5, 12);
        expect(rate.toDecimal()).toBeCloseTo(0.05, 12);
    });

    it("should create from percent (string)", () => {
        const rate = Rate.percent("7.25");
        expect(rate.toPercent()).toBeCloseTo(7.25, 12);
        expect(rate.toDecimal()).toBeCloseTo(0.0725, 12);
    });

    it("should parse percent strings with suffixes", () => {
        const rate = Rate.percent("7.25%");
        expect(rate.toPercent()).toBeCloseTo(7.25, 12);
        expect(rate.toDecimal()).toBeCloseTo(0.0725, 12);
    });

    it("should create from decimal (number) and convert to percent", () => {
        const rate = Rate.decimal(0.0325);
        expect(rate.toDecimal()).toBeCloseTo(0.0325, 12);
        expect(rate.toPercent()).toBeCloseTo(3.25, 12);
    });

    it("should create from decimal (string)", () => {
        const rate = Rate.decimal("0.12");
        expect(rate.toDecimal()).toBeCloseTo(0.12, 12);
        expect(rate.toPercent()).toBeCloseTo(12, 12);
    });

    it("should parse decimal strings with suffixes", () => {
        const rate = Rate.decimal("0.12x");
        expect(rate.toDecimal()).toBeCloseTo(0.12, 12);
        expect(rate.toPercent()).toBeCloseTo(12, 12);
    });

    it("should support add and subtract", () => {
        const a = Rate.percent(5);
        const b = Rate.percent(2);
        expect(a.add(b).toPercent()).toBeCloseTo(7, 12);
        expect(a.subtract(b).toPercent()).toBeCloseTo(3, 12);
    });

    it("should support multiply and divide", () => {
        const r = Rate.percent(10);
        expect(r.multiply(2).toPercent()).toBeCloseTo(20, 10);
        expect(r.multiply(1.5).toPercent()).toBeCloseTo(15, 10);
        expect(r.divide(2).toPercent()).toBeCloseTo(5, 10);
    });

    it("should support comparisons and equality", () => {
        const a = Rate.percent(3);
        const b = Rate.percent(3);
        const c = Rate.percent(4);

        expect(a.equals(b)).toBe(true);
        expect(a.equals(c)).toBe(false);

        // Equal values should not be greater/less than each other
        expect(a.greaterThan(b)).toBe(false);
        expect(a.lessThan(b)).toBe(false);

        expect(c.greaterThan(a)).toBe(true);
        expect(a.greaterThan(c)).toBe(false);
        expect(a.lessThan(c)).toBe(true);
        expect(c.lessThan(a)).toBe(false);
    });

    it("should detect zero and negative rates", () => {
        expect(Rate.zero().isZero()).toBe(true);
        expect(Rate.percent(0).isZero()).toBe(true);
        expect(Rate.percent(1).isZero()).toBe(false);

        expect(Rate.percent(0).isNegative()).toBe(false);
        expect(Rate.percent(-0.5).isNegative()).toBe(true);
        expect(Rate.percent(0.5).isNegative()).toBe(false);
    });

    it("should format as percent string", () => {
        expect(Rate.percent(5).toString()).toBe("5%");
    });

    it("should compute compound factor", () => {
        expect(Rate.percent(10).compoundFactor(3)).toBeCloseTo(1.331, 6);
    });

    it("should compute periodic rate", () => {
        const monthly = Rate.percent(12).periodic(12);
        expect(monthly.toPercent()).toBeCloseTo(1, 10);
    });

    it("should convert effective <-> nominal", () => {
        const effective = Rate.decimal(0.12);
        const nominal = effective.toNominal(12);
        const roundTrip = nominal.toEffective(12);

        expect(roundTrip.toDecimal()).toBeCloseTo(effective.toDecimal(), 8);
    });

    it("should produce JSON", () => {
        const json = Rate.percent(7).toJSON();
        expect(json.percent).toBeCloseTo(7, 12);
        expect(json.decimal).toBeCloseTo(0.07, 12);
    });
});
