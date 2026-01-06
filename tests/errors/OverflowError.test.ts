import { describe, it, expect } from "vitest";
import { OverflowError } from "../../src/errors";
import { MonetraErrorCode } from "../../src/errors/BaseError";

describe("OverflowError", () => {
  it("should use default message when none provided", () => {
    const error = new OverflowError();
    expect(error.code).toBe(MonetraErrorCode.OVERFLOW);
    expect(error.message).toBe("Arithmetic overflow");
  });

  it("should use custom message when provided", () => {
    const error = new OverflowError("Number too big!");
    expect(error.code).toBe(MonetraErrorCode.OVERFLOW);
    expect(error.message).toBe("Number too big!");
  });
});
