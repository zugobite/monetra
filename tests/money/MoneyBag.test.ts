import { describe, it, expect } from "vitest";
import { MoneyBag } from "../../src/money/MoneyBag";
import { Money } from "../../src/money/Money";
import { USD } from "../../src/currency/iso4217";

describe("MoneyBag", () => {
  it("should add money to bag", () => {
    const bag = new MoneyBag();
    bag.add(Money.fromMajor("100", USD));
    expect(bag.get("USD").minor).toBe(10000n);
  });
});
