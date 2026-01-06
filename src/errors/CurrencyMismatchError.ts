import { MonetraError, MonetraErrorCode } from "./BaseError";

export class CurrencyMismatchError extends MonetraError {
  /**
   * The expected currency code.
   */
  readonly expected: string;

  /**
   * The received currency code.
   */
  readonly received: string;

  constructor(expected: string, received: string) {
    super(
      `Currency mismatch: expected ${expected}, received ${received}.\n` +
        `💡 Tip: Use a Converter to convert between currencies:\n` +
        `   const converter = new Converter('USD', { ${received}: rate });\n` +
        `   const converted = converter.convert(money, '${expected}');`,
      MonetraErrorCode.CURRENCY_MISMATCH,
    );
    this.expected = expected;
    this.received = received;
  }
}
