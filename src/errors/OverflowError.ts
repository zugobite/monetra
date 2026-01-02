import { MonetraError, MonetraErrorCode } from "./BaseError";

export class OverflowError extends MonetraError {
  constructor(message: string = "Arithmetic overflow") {
    super(message, MonetraErrorCode.OVERFLOW);
  }
}
