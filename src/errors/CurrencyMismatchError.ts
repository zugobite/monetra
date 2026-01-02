import { MonetraError } from "./BaseError";

export class CurrencyMismatchError extends MonetraError {
  constructor(expected: string, received: string) {
    super(
      `Currency mismatch: expected ${expected}, received ${received}.\n` +
        `💡 Tip: Use a Converter to convert between currencies:\n` +
        `   const converter = new Converter('USD', { ${received}: rate });\n` +
        `   const converted = converter.convert(money, '${expected}');`
    );
  }
}
