import { describe, it, expect } from "vitest";
import { defineToken, ETH, BTC, USDC } from "../../src/tokens/defineToken";
import { Money } from "../../src/money/Money";

describe("Tokens - defineToken", () => {
  it("should define a custom token", () => {
    const MY_TOKEN = defineToken({
      code: "MYT",
      symbol: "T",
      decimals: 6,
    });

    expect(MY_TOKEN.code).toBe("MYT");
    expect(MY_TOKEN.symbol).toBe("T");
    expect(MY_TOKEN.decimals).toBe(6);
  });

  it("should work with Money", () => {
    const amount = Money.fromMajor("1.5", ETH);
    expect(amount.minor.toString()).toBe("1500000000000000000"); // 1.5 * 10^18
    // Normalize NBSP to space for comparison
    expect(amount.format().replace(/\u00A0/g, " ")).toBe("Ξ 1.500000000000000000");
  });

  it("should handle BTC formatting", () => {
    const amount = Money.fromMajor("0.00000001", BTC); // 1 satoshi
    expect(amount.minor.toString()).toBe("1");
    expect(amount.format().replace(/\u00A0/g, " ")).toBe("₿ 0.00000001");
  });

  it("should handle USDC formatting", () => {
    const amount = Money.fromMajor("100.50", USDC);
    expect(amount.minor.toString()).toBe("100500000"); // 6 decimals
    expect(amount.format()).toBe("USDC100.500000");
  });
});
