import { MonetraError, MonetraErrorCode } from "./BaseError";

export class InsufficientFundsError extends MonetraError {
  constructor(message?: string) {
    super(
      message || "Insufficient funds for this operation.",
      MonetraErrorCode.INSUFFICIENT_FUNDS,
    );
  }
}
