import { Money } from "./Money";
import { Currency } from "../currency/Currency";
import { Converter } from "./Converter";
import { getCurrency } from "../currency/registry";

/**
 * A collection of Money objects in different currencies.
 * Useful for representing a wallet or portfolio.
 */
export class MoneyBag {
  private contents: Map<string, Money> = new Map();

  /**
   * Adds a Money amount to the bag.
   * @param money The money to add.
   */
  add(money: Money): void {
    const code = money.currency.code;
    const existing = this.contents.get(code);
    if (existing) {
      this.contents.set(code, existing.add(money));
    } else {
      this.contents.set(code, money);
    }
  }

  /**
   * Subtracts a Money amount from the bag.
   * @param money The money to subtract.
   */
  subtract(money: Money): void {
    const code = money.currency.code;
    const existing = this.contents.get(code);
    if (existing) {
      this.contents.set(code, existing.subtract(money));
    } else {
      // If not present, we assume 0 - amount
      const zero = Money.zero(money.currency);
      this.contents.set(code, zero.subtract(money));
    }
  }

  /**
   * Gets the amount for a specific currency.
   * @param currency The currency to retrieve.
   * @returns The Money amount in that currency (or zero if not present).
   */
  get(currency: Currency | string): Money {
    const code = typeof currency === "string" ? currency : currency.code;
    return (
      this.contents.get(code) ||
      Money.zero(
        typeof currency === "string" ? getCurrency(currency) : currency,
      )
    );
  }

  /**
   * Calculates the total value of the bag in a specific currency.
   *
   * @param targetCurrency The currency to convert everything to.
   * @param converter The converter instance with exchange rates.
   * @returns The total amount in the target currency.
   */
  total(targetCurrency: Currency | string, converter: Converter): Money {
    const target =
      typeof targetCurrency === "string"
        ? getCurrency(targetCurrency)
        : targetCurrency;
    let total = Money.zero(target);

    for (const money of this.contents.values()) {
      const converted = converter.convert(money, target);
      total = total.add(converted);
    }

    return total;
  }

  /**
   * Returns a list of all Money objects in the bag.
   */
  getAll(): Money[] {
    return Array.from(this.contents.values());
  }

  /**
   * Returns a JSON representation of the bag.
   */
  toJSON(): { amount: string; currency: string; precision: number }[] {
    return this.getAll().map((m) => m.toJSON());
  }
}
