import { MonetraError } from "./BaseError";

export class OverflowError extends MonetraError {
  constructor(message: string = "Arithmetic overflow") {
    super(message);
  }
}
