import { MonetraError } from './BaseError';

export class CurrencyMismatchError extends MonetraError {
  constructor(expected: string, actual: string) {
    super(`Currency mismatch: expected ${expected}, got ${actual}`);
  }
}
