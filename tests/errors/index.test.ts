import { describe, it, expect } from "vitest";
import * as Errors from "../../src/errors";

describe("Errors Index", () => {
  it("should export all error classes", () => {
    expect(Errors.MonetraError).toBeDefined();
    expect(Errors.MonetraErrorCode).toBeDefined();
    expect(Errors.CurrencyMismatchError).toBeDefined();
    expect(Errors.InsufficientFundsError).toBeDefined();
    expect(Errors.InvalidPrecisionError).toBeDefined();
    expect(Errors.RoundingRequiredError).toBeDefined();
    expect(Errors.InvalidArgumentError).toBeDefined();
    expect(Errors.OverflowError).toBeDefined();
  });
});
