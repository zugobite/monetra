import { describe, it, expect } from "vitest";
import { Converter } from "../../src/money/Converter";
import { Money } from "../../src/money/Money";
import { USD, EUR } from "../../src/currency/iso4217";

describe("Converter", () => {
  it("should convert money", () => {
    const rates = { USD: 1, EUR: 0.85 };
    const converter = new Converter("USD", rates);
    const usd = Money.fromMajor("100", USD);
    const eur = converter.convert(usd, "EUR");
    expect(eur.currency.code).toBe("EUR");
  });

  it("should not convert when currencies are the same", () => {
    const rates = { USD: 1, EUR: 0.85 };
    const converter = new Converter("USD", rates);
    const usd = Money.fromMajor("100", USD);
    const same = converter.convert(usd, "USD");
    expect(same).toBe(usd); // Should return the same instance
  });

  it("should throw error when exchange rate is missing", () => {
    const rates = { USD: 1 }; // EUR rate missing
    const converter = new Converter("USD", rates);
    const usd = Money.fromMajor("100", USD);
    expect(() => converter.convert(usd, "EUR")).toThrow(
      "Exchange rate missing for conversion from USD to EUR"
    );
  });

  it("should automatically set base rate to 1 when not provided", () => {
    const rates = { EUR: 0.85 }; // USD (base) rate not provided
    const converter = new Converter("USD", rates);
    const usd = Money.fromMajor("100", USD);
    const same = converter.convert(usd, "USD");
    expect(same.equals(usd)).toBe(true);
  });
});
