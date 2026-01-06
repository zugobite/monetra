import { describe, it, expect } from "vitest";
import { InvalidArgumentError } from "../../src/errors";
import { MonetraErrorCode } from "../../src/errors/BaseError";

describe("InvalidArgumentError", () => {
  it("should construct with message", () => {
    const error = new InvalidArgumentError("Bad arg");
    expect(error.code).toBe(MonetraErrorCode.INVALID_ARGUMENT);
    expect(error.message).toBe("Bad arg");
  });
});
