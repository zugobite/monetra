import { describe, it, expect } from "vitest";
import { InsufficientFundsError } from "../../src/errors";
import { MonetraErrorCode } from "../../src/errors/BaseError";

describe("InsufficientFundsError", () => {
  it("should use default message when none provided", () => {
    const error = new InsufficientFundsError();
    expect(error.code).toBe(MonetraErrorCode.INSUFFICIENT_FUNDS);
    expect(error.message).toBe("Insufficient funds for this operation.");
  });

  it("should use custom message when provided", () => {
    const error = new InsufficientFundsError("Not enough cash!");
    expect(error.code).toBe(MonetraErrorCode.INSUFFICIENT_FUNDS);
    expect(error.message).toBe("Not enough cash!");
  });
});
