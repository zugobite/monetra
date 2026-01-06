import { describe, it, expect } from "vitest";
import { MoneyBag } from "../../src/money/MoneyBag";
import { Money } from "../../src/money/Money";
import { Converter } from "../../src/money/Converter";
import { USD, EUR } from "../../src/currency/iso4217";

describe("MoneyBag", () => {
  it("should add money to bag", () => {
    const bag = new MoneyBag();
    bag.add(Money.fromMajor("100", USD));
    expect(bag.get("USD").minor).toBe(10000n);
  });

  it("should add twice into existing currency bucket", () => {
    const bag = new MoneyBag();
    bag.add(Money.fromMajor("1.00", USD));
    bag.add(Money.fromMajor("2.50", USD));
    expect(bag.get(USD).minor).toBe(350n);
  });

  it("should subtract from an existing currency bucket", () => {
    const bag = new MoneyBag();
    bag.add(Money.fromMajor("10.00", USD));
    bag.subtract(Money.fromMajor("3.25", USD));
    expect(bag.get("USD").minor).toBe(675n);
  });

  it("should subtract from a missing currency bucket by assuming zero", () => {
    const bag = new MoneyBag();
    bag.subtract(Money.fromMajor("2.00", USD));
    expect(bag.get("USD").minor).toBe(-200n);
  });

  it("should return zero for missing currencies", () => {
    const bag = new MoneyBag();
    expect(bag.get("USD").minor).toBe(0n);
    expect(bag.get(USD).minor).toBe(0n);
  });

  it("should total across currencies using a converter", () => {
    const bag = new MoneyBag();
    bag.add(Money.fromMajor("1.00", USD)); // 1.00 USD
    bag.add(Money.fromMajor("2.00", EUR)); // 2.00 EUR

    // Base USD. 1 USD = 2 EUR, so 1 EUR = 0.5 USD.
    const converter = new Converter("USD", { USD: 1, EUR: 2 });

    // 2.00 EUR -> 1.00 USD. Total should be 2.00 USD.
    const total = bag.total("USD", converter);
    expect(total.currency.code).toBe("USD");
    expect(total.minor).toBe(200n);

    // Also cover passing a Currency object as the target.
    const totalObjTarget = bag.total(USD, converter);
    expect(totalObjTarget.currency.code).toBe("USD");
    expect(totalObjTarget.minor).toBe(200n);
  });

  it("should list all contents and serialize to JSON", () => {
    const bag = new MoneyBag();
    bag.add(Money.fromMajor("1.00", USD));
    bag.add(Money.fromMajor("2.00", EUR));

    const all = bag.getAll();
    expect(all).toHaveLength(2);
    expect(all.map((m) => m.currency.code).sort()).toEqual(["EUR", "USD"]);

    const json = bag.toJSON();
    expect(json).toHaveLength(2);
    expect(json.map((j) => j.currency).sort()).toEqual(["EUR", "USD"]);
  });
});
