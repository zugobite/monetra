import { describe, it, expect } from "vitest";
import {
  Money,
  money,
  Converter,
  MoneyBag,
  USD,
  EUR,
  registerCurrency,
} from "../../src";

describe("Wallet Features", () => {
  it("should create money using helper and string currency", () => {
    const m = money(100, "USD");
    expect(m.minor).toBe(100n);
    expect(m.currency.code).toBe("USD");
  });

  it("should create money from major string using helper", () => {
    const m = money("10.50", "USD");
    expect(m.minor).toBe(1050n);
  });

  it("should serialize to JSON", () => {
    const m = money(100, "USD");
    expect(m.toJSON()).toEqual({
      amount: "100",
      currency: "USD",
      precision: 2,
    });
  });

  it("should convert currency", () => {
    // 1 USD = 0.85 EUR
    const rates = {
      USD: 1,
      EUR: 0.85,
    };
    const converter = new Converter("USD", rates);

    const usd = money(1000, "USD"); // $10.00
    const eur = converter.convert(usd, "EUR");

    // 10.00 * 0.85 = 8.50 EUR = 850 cents
    expect(eur.minor).toBe(850n);
    expect(eur.currency.code).toBe("EUR");
  });

  it("should handle MoneyBag (Portfolio)", () => {
    const bag = new MoneyBag();
    bag.add(money(1000, "USD")); // $10
    bag.add(money(2000, "EUR")); // €20

    expect(bag.get("USD").minor).toBe(1000n);
    expect(bag.get("EUR").minor).toBe(2000n);

    const rates = {
      USD: 1,
      EUR: 0.5, // 1 USD = 0.5 EUR (Strong Dollar!) -> 1 EUR = 2 USD
    };
    // Wait, rates are usually "Base -> Quote".
    // If Base is USD.
    // USD: 1
    // EUR: 0.5 means 1 USD = 0.5 EUR.
    // So 1 EUR = 2 USD.

    const converter = new Converter("USD", rates);

    // Total in USD:
    // 10 USD + (20 EUR * (1/0.5)) = 10 + 40 = 50 USD.
    // 20 EUR = 2000 cents.
    // 2000 * (1 / 0.5) = 4000 cents.
    // Total 5000 cents.

    const total = bag.total("USD", converter);
    expect(total.minor).toBe(5000n);
  });

  it("should format with currency code", () => {
    const m = money(1000, "USD");
    // "USD 10.00" or "10.00 USD" depending on locale
    const formatted = m.format({ display: "code", locale: "en-US" });
    expect(formatted).toContain("USD");
    expect(formatted).toContain("10.00");
  });

  it("should support smart arithmetic", () => {
    const m = money(1000, "USD"); // $10.00

    // Add minor units (integer)
    expect(m.add(500).minor).toBe(1500n); // $15.00

    // Add major units (string)
    expect(m.add("5.00").minor).toBe(1500n); // $15.00

    // Subtract
    expect(m.subtract(200).minor).toBe(800n); // $8.00
    expect(m.subtract("2.00").minor).toBe(800n); // $8.00

    // Comparison
    expect(m.greaterThan(500)).toBe(true);
    expect(m.lessThan("20.00")).toBe(true);
    expect(m.equals(1000)).toBe(true);
  });

  it("should support financial helpers", () => {
    const m = money(10000, "USD"); // $100.00

    // Percentage
    expect(m.percentage(10).minor).toBe(1000n); // $10.00

    // Add Percent (Tax)
    expect(m.addPercent(10).minor).toBe(11000n); // $110.00

    // Subtract Percent (Discount)
    expect(m.subtractPercent(20).minor).toBe(8000n); // $80.00

    // Split
    const parts = m.split(3);
    // 10000 / 3 = 3333.33...
    // [3334, 3333, 3333]
    expect(parts[0].minor).toBe(3334n);
    expect(parts[1].minor).toBe(3333n);
    expect(parts[2].minor).toBe(3333n);
  });
});
