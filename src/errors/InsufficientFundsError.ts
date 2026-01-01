import { MonetraError } from './BaseError';

export class InsufficientFundsError extends MonetraError {
  constructor() {
    super('Insufficient funds for this operation.');
  }
}
