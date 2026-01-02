import { RoundingMode } from "./strategies";

export * from "./strategies";

export function divideWithRounding(
  numerator: bigint,
  denominator: bigint,
  mode: RoundingMode
): bigint {
  if (denominator === 0n) {
    throw new Error("Division by zero");
  }

  const quotient = numerator / denominator;
  const remainder = numerator % denominator;

  if (remainder === 0n) {
    return quotient;
  }

  const sign = (numerator >= 0n ? 1n : -1n) * (denominator >= 0n ? 1n : -1n);
  const absRemainder = remainder < 0n ? -remainder : remainder;
  const absDenominator = denominator < 0n ? -denominator : denominator;

  // Check for exact half
  const isHalf = absRemainder * 2n === absDenominator;
  const isMoreThanHalf = absRemainder * 2n > absDenominator;

  switch (mode) {
    case RoundingMode.FLOOR:
      // If positive, quotient is already floor (truncation).
      // If negative, quotient is ceil (truncation towards zero), so we need to subtract 1.
      return sign > 0n ? quotient : quotient - 1n;
    case RoundingMode.CEIL:
      // If positive, quotient is floor, so add 1.
      // If negative, quotient is ceil, so keep it.
      return sign > 0n ? quotient + 1n : quotient;
    case RoundingMode.HALF_UP:
      if (isMoreThanHalf || isHalf) {
        return sign > 0n ? quotient + 1n : quotient - 1n;
      }
      return quotient;
    case RoundingMode.HALF_DOWN:
      if (isMoreThanHalf) {
        return sign > 0n ? quotient + 1n : quotient - 1n;
      }
      return quotient;
    case RoundingMode.HALF_EVEN:
      if (isMoreThanHalf) {
        return sign > 0n ? quotient + 1n : quotient - 1n;
      }
      if (isHalf) {
        // If quotient is odd, round up (away from zero? no, to nearest even).
        // If quotient is even, keep it.
        if (quotient % 2n !== 0n) {
          return sign > 0n ? quotient + 1n : quotient - 1n;
        }
      }
      return quotient;
    case RoundingMode.TRUNCATE:
      // Truncate towards zero (simply return the quotient without adjustment)
      return quotient;
    default:
      throw new Error(`Unsupported rounding mode: ${mode}`);
  }
}
