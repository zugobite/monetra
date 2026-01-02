import { MonetraError } from "./BaseError";

export class RoundingRequiredError extends MonetraError {
  constructor() {
    super("Rounding is required for this operation but was not provided.");
  }
}
