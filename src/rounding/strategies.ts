/**
 * Enumeration of rounding modes for handling fractional minor units.
 */
export enum RoundingMode {
  /**
   * Rounds towards the nearest neighbor. If equidistant, rounds away from zero.
   * Example: 2.5 -> 3, -2.5 -> -3
   */
  HALF_UP = "HALF_UP",

  /**
   * Rounds towards the nearest neighbor. If equidistant, rounds towards zero.
   * Example: 2.5 -> 2, -2.5 -> -2
   */
  HALF_DOWN = "HALF_DOWN",

  /**
   * Rounds towards the nearest neighbor. If equidistant, rounds towards the nearest even integer.
   * Also known as Banker's Rounding.
   * Example: 2.5 -> 2, 3.5 -> 4
   */
  HALF_EVEN = "HALF_EVEN",

  /**
   * Rounds towards negative infinity.
   * Example: 2.9 -> 2, -2.1 -> -3
   */
  FLOOR = "FLOOR",

  /**
   * Rounds towards positive infinity.
   * Example: 2.1 -> 3, -2.9 -> -2
   */
  CEIL = "CEIL",

  /**
   * Truncates towards zero (removes fractional part).
   * Example: 2.9 -> 2, -2.9 -> -2
   */
  TRUNCATE = "TRUNCATE",
}
