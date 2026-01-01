import { RoundingMode, divideWithRounding } from '../rounding';
import { RoundingRequiredError } from '../errors';

/**
 * Adds two BigInt values.
 */
export function add(a: bigint, b: bigint): bigint {
  return a + b;
}

/**
 * Subtracts two BigInt values.
 */
export function subtract(a: bigint, b: bigint): bigint {
  return a - b;
}

/**
 * Multiplies a BigInt amount by a multiplier.
 * 
 * Handles fractional multipliers by converting them to a rational number (numerator/denominator).
 * If the result is not an integer, a rounding mode must be provided.
 * 
 * @param amount - The amount to multiply.
 * @param multiplier - The multiplier (number or string).
 * @param rounding - Optional rounding mode.
 * @returns The result as a BigInt.
 * @throws {RoundingRequiredError} If rounding is needed but not provided.
 */
export function multiply(
  amount: bigint,
  multiplier: string | number,
  rounding?: RoundingMode
): bigint {
  const { numerator, denominator } = parseMultiplier(multiplier);
  
  // result = amount * (numerator / denominator)
  // result = (amount * numerator) / denominator
  
  const product = amount * numerator;
  
  if (product % denominator === 0n) {
    return product / denominator;
  }
  
  if (!rounding) {
    throw new RoundingRequiredError();
  }
  
  return divideWithRounding(product, denominator, rounding);
}

function parseMultiplier(multiplier: string | number): { numerator: bigint; denominator: bigint } {
  const s = multiplier.toString();
  
  // Check for scientific notation
  if (/[eE]/.test(s)) {
    throw new Error('Scientific notation not supported');
  }
  
  const parts = s.split('.');
  if (parts.length > 2) {
    throw new Error('Invalid number format');
  }
  
  const integerPart = parts[0];
  const fractionalPart = parts[1] || '';
  
  const denominator = 10n ** BigInt(fractionalPart.length);
  const numerator = BigInt(integerPart + fractionalPart);
  
  return { numerator, denominator };
}
