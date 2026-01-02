import { Money } from "./Money";
import { CurrencyMismatchError, InsufficientFundsError } from "../errors";

export function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency.code !== b.currency.code) {
    throw new CurrencyMismatchError(a.currency.code, b.currency.code);
  }
}

export function assertNonNegative(money: Money): void {
  if (money.isNegative()) {
    // Spec doesn't explicitly name a NegativeError, but InsufficientFundsError might fit or just a generic error.
    // Spec lists "InsufficientFundsError" in 4.7.
    // But "assertNonNegative" is a guard.
    // Let's throw an Error or a specific one if defined.
    // "Any violation is considered a bug" -> maybe just Error?
    // But for "InsufficientFunds", that's usually when subtracting.
    // Let's use a generic Error for now or create a specific one if needed.
    throw new Error("Money value must be non-negative");
  }
}
