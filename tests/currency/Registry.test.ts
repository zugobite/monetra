import { describe, it, expect } from "vitest";
import { 
  registerCurrency, 
  getCurrency, 
  isCurrencyRegistered, 
  getAllCurrencies 
} from "../../src/currency/registry";
import { Currency } from "../../src/currency/Currency";

describe("Registry", () => {
  const TEST: Currency = {
    code: "TEST",
    symbol: "T",
    decimals: 2
  };

  it("should register and retrieve currency", () => {
    registerCurrency(TEST);
    expect(getCurrency("TEST")).toEqual(TEST);
  });

  it("should throw error if currency not found", () => {
    expect(() => getCurrency("INVALID")).toThrow("Currency 'INVALID' not found in registry.");
  });

  it("should check if currency is registered", () => {
    registerCurrency(TEST);
    expect(isCurrencyRegistered("TEST")).toBe(true);
    expect(isCurrencyRegistered("NONEXISTENT")).toBe(false);
  });

  it("should retrieve all currencies", () => {
    registerCurrency(TEST);
    const all = getAllCurrencies();
    expect(all).toHaveProperty("TEST");
    expect(all["TEST"]).toEqual(TEST);
  });
});
