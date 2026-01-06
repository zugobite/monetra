import { describe, it, expect } from "vitest";
import { RoundingRequiredError } from "../../src/errors";
import { MonetraErrorCode } from "../../src/errors/BaseError";

describe("RoundingRequiredError", () => {
  it("should use simple message when no details provided", () => {
    const error = new RoundingRequiredError();
    expect(error.code).toBe(MonetraErrorCode.ROUNDING_REQUIRED);
    expect(error.message).toBe("Rounding is required for this operation but was not provided.");
  });

  it("should use detailed message with tip when operation/result provided", () => {
    const error = new RoundingRequiredError("divide", 3.333);
    const message = error.message;

    expect(error.code).toBe(MonetraErrorCode.ROUNDING_REQUIRED);
    expect(message).toContain("Rounding required for divide: result 3.333 is not an integer.");
    expect(message).toContain("💡 Tip: Provide a rounding mode:");
    expect(message).toContain("money.divide(value, { rounding: RoundingMode.HALF_UP })");
    expect(message).toContain("Available modes: HALF_UP, HALF_DOWN, HALF_EVEN, FLOOR, CEIL, TRUNCATE");
  });

  it("should handle mixed arguments gracefully (operation provided, result missing)", () => {
    // Though types suggest both are optional, if one is missing it should fall back to default
    const error = new RoundingRequiredError("divide");
    expect(error.message).toBe("Rounding is required for this operation but was not provided.");
  });
});
