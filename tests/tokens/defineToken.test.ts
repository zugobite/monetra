import { describe, it, expect } from "vitest";
import { defineToken, ETH, BTC, USDC, USDT } from "../../src/tokens/defineToken";
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

  it("should have valid definitions for default crypto tokens", () => {
    // ETH
    expect(ETH.code).toBe("ETH");
    expect(ETH.symbol).toBe("Ξ");
    expect(ETH.decimals).toBe(18);
    expect(ETH.type).toBe("crypto");
    // @ts-ignore
    expect(ETH.chainId).toBe(1);
    // @ts-ignore
    expect(ETH.coingeckoId).toBe("ethereum");

    // BTC
    expect(BTC.code).toBe("BTC");
    expect(BTC.symbol).toBe("₿");
    expect(BTC.decimals).toBe(8);
    // @ts-ignore
    expect(BTC.coingeckoId).toBe("bitcoin");

    // USDC
    expect(USDC.code).toBe("USDC");
    // @ts-ignore
    expect(USDC.contractAddress).toBe("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
    // @ts-ignore
    expect(USDC.standard).toBe("ERC-20");

    // USDT
    expect(USDT.code).toBe("USDT");
    expect(USDT.symbol).toBe("₮");
    // @ts-ignore
    expect(USDT.contractAddress).toBe("0xdac17f958d2ee523a2206206994597c13d831ec7");
  });
});
