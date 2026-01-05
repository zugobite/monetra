import { MonetraError, MonetraErrorCode } from "./BaseError";

export class InvalidArgumentError extends MonetraError {
  constructor(message: string) {
    super(message, MonetraErrorCode.INVALID_ARGUMENT);
  }
}
