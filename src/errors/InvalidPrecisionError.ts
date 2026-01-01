import { MonetraError } from './BaseError';

export class InvalidPrecisionError extends MonetraError {
  constructor(message: string) {
    super(message);
  }
}
