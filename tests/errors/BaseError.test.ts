import { describe, it, expect } from "vitest";
import { MonetraError, MonetraErrorCode } from "../../src/errors/BaseError";

describe("BaseError", () => {
    it("should be an instance of Error", () => {
        const error = new MonetraError("Test error", "TEST_CODE");
        expect(error).toBeInstanceOf(Error);
    });

    it("should store the error code", () => {
        const error = new MonetraError("Test error", "TEST_CODE");
        expect(error.code).toBe("TEST_CODE");
    });
    
    it("should have correct name", () => {
        const error = new MonetraError("Test error", "TEST_CODE");
        expect(error.name).toBe("MonetraError");
    });

    it("should have expected enum values", () => {
        expect(MonetraErrorCode.CURRENCY_MISMATCH).toBe("MONETRA_CURRENCY_MISMATCH");
    })
});
