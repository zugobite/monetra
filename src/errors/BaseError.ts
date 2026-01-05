/**
 * Error codes for programmatic handling of Monetra errors.
 */
export enum MonetraErrorCode {
  CURRENCY_MISMATCH = "MONETRA_CURRENCY_MISMATCH",
  INSUFFICIENT_FUNDS = "MONETRA_INSUFFICIENT_FUNDS",
  INVALID_ARGUMENT = "MONETRA_INVALID_ARGUMENT",
  INVALID_PRECISION = "MONETRA_INVALID_PRECISION",
  OVERFLOW = "MONETRA_OVERFLOW",
  ROUNDING_REQUIRED = "MONETRA_ROUNDING_REQUIRED",
}

/**
 * Base error class for all Monetra errors.
 * All Monetra errors include an error code for programmatic handling.
 */
export class MonetraError extends Error {
  /**
   * A unique error code for programmatic handling.
   */
  readonly code: MonetraErrorCode;

  constructor(message: string, code: MonetraErrorCode) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
