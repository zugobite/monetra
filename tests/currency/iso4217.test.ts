import { describe, it, expect } from "vitest";
import { getAllCurrencies, getCurrency } from "../../src/currency/registry";
import * as ISO4217 from "../../src/currency/iso4217";

describe("Currency ISO4217 Definitions", () => {
  it("should have correct definitions for major currencies", () => {
    // USD
    expect(ISO4217.USD.code).toBe("USD");
    expect(ISO4217.USD.decimals).toBe(2);
    expect(ISO4217.USD.symbol).toBe("$");

    // EUR
    expect(ISO4217.EUR.code).toBe("EUR");
    expect(ISO4217.EUR.decimals).toBe(2);
    expect(ISO4217.EUR.symbol).toBe("€");

    // JPY (0 decimals)
    expect(ISO4217.JPY.code).toBe("JPY");
    expect(ISO4217.JPY.decimals).toBe(0);
    expect(ISO4217.JPY.symbol).toBe("¥");

    // GBP
    expect(ISO4217.GBP.code).toBe("GBP");
    expect(ISO4217.GBP.decimals).toBe(2);
    expect(ISO4217.GBP.symbol).toBe("£");
  });

  it("should validate all exported currencies", () => {
    const exportedCurrencies = Object.values(ISO4217).filter(
      (val) => typeof val === "object" && val !== null && "code" in val
    );

    expect(exportedCurrencies.length).toBeGreaterThan(50);

    exportedCurrencies.forEach((currency: any) => {
      // Code should be 3 letters
      expect(currency.code).toMatch(/^[A-Z]{3}$/);
      
      // Decimals should be between 0 and 4 (usually)
      expect(currency.decimals).toBeGreaterThanOrEqual(0);
      expect(currency.decimals).toBeLessThanOrEqual(4);
      
      // Symbol should be present and non-empty string
      // Note: Some might not have a symbol in some datasets, but usually they do or it's the code
      expect(typeof currency.symbol).toBe("string");
      // If symbol is mutated to empty string, this fails:
      if (currency.symbol === "") {
        // Some might effectively have no symbol, but let's check if strictness kills mutants
         expect(currency.symbol.length).toBeGreaterThan(0);
      }
    });
  });

  it("should be able to retrieve all registered currencies", () => {
    // This test ensures we are actually touching the registry for coverage
    const currencies = getAllCurrencies();
    expect(Object.keys(currencies).length).toBeGreaterThan(50);
    
    // Random check of a few
    expect(getCurrency("AUD").decimals).toBe(2);
    expect(getCurrency("BHD").decimals).toBe(3); // Bahraini Dinar has 3 decimals
    expect(getCurrency("CNY").decimals).toBe(2);
  });
});
