import { describe, it, expect } from "vitest";
import { InvalidPrecisionError } from "../../src/errors";
import { MonetraErrorCode } from "../../src/errors/BaseError";

describe("InvalidPrecisionError", () => {
  it("should construct with message", () => {
    const error = new InvalidPrecisionError("Bad precision");
    expect(error.code).toBe(MonetraErrorCode.INVALID_PRECISION);
    expect(error.message).toBe("Bad precision");
  });
});
