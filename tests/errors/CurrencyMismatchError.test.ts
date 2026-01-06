import { describe, it, expect } from "vitest";
import { CurrencyMismatchError } from "../../src/errors";
import { MonetraErrorCode } from "../../src/errors/BaseError";

describe("CurrencyMismatchError", () => {
  it("should construct with expected and received currencies", () => {
    const error = new CurrencyMismatchError("USD", "EUR");
    
    expect(error.code).toBe(MonetraErrorCode.CURRENCY_MISMATCH);
    expect(error.name).toBe("CurrencyMismatchError");
    expect(error.expected).toBe("USD");
    expect(error.received).toBe("EUR");
  });

  it("should include helpful tip in the message", () => {
    const error = new CurrencyMismatchError("USD", "EUR");
    const message = error.message;

    expect(message).toContain("Currency mismatch: expected USD, received EUR.");
    expect(message).toContain("💡 Tip: Use a Converter");
    expect(message).toContain("const converter = new Converter('USD', { EUR: rate });");
    expect(message).toContain("const converted = converter.convert(money, 'USD');");
  });
});
