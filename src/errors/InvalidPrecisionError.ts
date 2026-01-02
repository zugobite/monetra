import { MonetraError, MonetraErrorCode } from "./BaseError";

export class InvalidPrecisionError extends MonetraError {
  constructor(message: string) {
    super(message, MonetraErrorCode.INVALID_PRECISION);
  }
}
