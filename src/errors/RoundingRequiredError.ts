import { MonetraError, MonetraErrorCode } from "./BaseError";

export class RoundingRequiredError extends MonetraError {
  constructor(operation?: string, result?: number) {
    let message =
      "Rounding is required for this operation but was not provided.";
    if (operation && result !== undefined) {
      message =
        `Rounding required for ${operation}: result ${result} is not an integer.\n` +
        `💡 Tip: Provide a rounding mode:\n` +
        `   money.${operation}(value, { rounding: RoundingMode.HALF_UP })\n` +
        `   Available modes: HALF_UP, HALF_DOWN, HALF_EVEN, FLOOR, CEIL, TRUNCATE`;
    }
    super(message, MonetraErrorCode.ROUNDING_REQUIRED);
  }
}
