import { Money } from "../money/Money";
import { RoundingMode } from "../rounding/strategies";
import { InvalidArgumentError } from "../errors/InvalidArgumentError";
import { CurrencyMismatchError } from "../errors/CurrencyMismatchError";

export interface DepreciationOptions {
  cost: Money;
  salvageValue: Money;
  usefulLife: number; // in years
  rounding?: RoundingMode;
}

export interface DepreciationResult {
  annualDepreciation: Money;
  bookValueAtYear(year: number): Money;
  schedule(): { year: number; depreciation: Money; bookValue: Money }[];
}

/**
 * Calculates straight-line depreciation for an asset.
 *
 * Formula:
 * Annual Depreciation = (Cost - Salvage Value) / Useful Life
 * Book Value at Year N = Cost - (Annual Depreciation × N)
 *
 * @param options - Configuration for depreciation calculation
 * @returns Object containing annual depreciation, book value calculator, and schedule generator
 * @throws {CurrencyMismatchError} If cost and salvage value currencies differ
 * @throws {InvalidArgumentError} If useful life is not positive or salvage value > cost
 */
export function straightLineDepreciation(options: DepreciationOptions): DepreciationResult {
  const { cost, salvageValue, usefulLife, rounding = RoundingMode.HALF_EVEN } = options;

  if (cost.currency.code !== salvageValue.currency.code) {
    throw new CurrencyMismatchError(cost.currency.code, salvageValue.currency.code);
  }

  if (usefulLife <= 0) {
    throw new InvalidArgumentError("Useful life must be positive");
  }

  if (salvageValue.greaterThan(cost)) {
    throw new InvalidArgumentError("Salvage value cannot be greater than cost");
  }

  const depreciableAmount = cost.subtract(salvageValue);
  const annualDepreciation = depreciableAmount.divide(usefulLife, { rounding });

  const result: DepreciationResult = {
    annualDepreciation,

    bookValueAtYear(year: number): Money {
      if (year < 0) {
        throw new InvalidArgumentError("Year must be non-negative");
      }
      if (year === 0) return cost;

      const totalDepreciation = annualDepreciation.multiply(year);
      const bookValue = cost.subtract(totalDepreciation);

      // Ensure book value doesn't drop below salvage value
      if (bookValue.lessThan(salvageValue)) {
        return salvageValue;
      }
      return bookValue;
    },

    schedule(): { year: number; depreciation: Money; bookValue: Money }[] {
      const schedule = [];
      let previousBookValue = cost;
      const maxYears = Math.ceil(usefulLife);

      for (let year = 1; year <= maxYears; year++) {
        const currentBookValue = result.bookValueAtYear(year);
        const depreciation = previousBookValue.subtract(currentBookValue);

        schedule.push({
          year,
          depreciation,
          bookValue: currentBookValue,
        });

        previousBookValue = currentBookValue;
      }

      return schedule;
    },
  };

  return result;
}
