import { TokenDefinition } from "./types";
import { registerCurrency } from "../currency/registry";

/**
 * Defines a custom token that can be used with Money.
 *
 * @example
 * const ETH = defineToken({
 *   code: 'ETH',
 *   symbol: 'Ξ',
 *   decimals: 18,
 *   type: 'crypto',
 *   chainId: 1,
 * });
 *
 * const balance = money('1.5', ETH);
 */
export function defineToken(definition: {
  code: string;
  symbol: string;
  decimals: number;
  type?: "fiat" | "crypto" | "commodity" | "custom";
  locale?: string;
  chainId?: number;
  contractAddress?: string;
  standard?: string;
  coingeckoId?: string;
}): TokenDefinition {
  if (!definition.code) throw new Error("Token definition requires a code");
  if (!definition.symbol) throw new Error("Token definition requires a symbol");
  if (definition.decimals === undefined)
    throw new Error("Token definition requires decimals");

  const token: TokenDefinition = {
    code: definition.code.toUpperCase(),
    symbol: definition.symbol,
    decimals: definition.decimals,
    locale: definition.locale,
    type: definition.type ?? "custom",
    chainId: definition.chainId,
    contractAddress: definition.contractAddress,
    standard: definition.standard,
    coingeckoId: definition.coingeckoId,
  };

  // Register so it can be used with currency codes
  registerCurrency(token);

  return Object.freeze(token);
}

// Pre-defined popular crypto tokens
export const ETH = defineToken({
  code: "ETH",
  symbol: "Ξ",
  decimals: 18,
  type: "crypto",
  chainId: 1,
  coingeckoId: "ethereum",
});

export const BTC = defineToken({
  code: "BTC",
  symbol: "₿",
  decimals: 8,
  type: "crypto",
  coingeckoId: "bitcoin",
});

export const USDC = defineToken({
  code: "USDC",
  symbol: "USDC",
  decimals: 6,
  type: "crypto",
  chainId: 1,
  contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  standard: "ERC-20",
  coingeckoId: "usd-coin",
});

export const USDT = defineToken({
  code: "USDT",
  symbol: "₮",
  decimals: 6,
  type: "crypto",
  chainId: 1,
  contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  standard: "ERC-20",
  coingeckoId: "tether",
});
