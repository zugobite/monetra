import { Currency } from "../currency/Currency";

export interface TokenDefinition extends Currency {
  /** Token type: 'fiat', 'crypto', 'commodity', 'custom' */
  type: "fiat" | "crypto" | "commodity" | "custom";

  /** Chain ID for crypto tokens (e.g., 1 for Ethereum mainnet) */
  chainId?: number;

  /** Contract address for ERC-20 tokens */
  contractAddress?: string;

  /** Token standard (e.g., 'ERC-20', 'BEP-20') */
  standard?: string;

  /** Coingecko ID for price lookups */
  coingeckoId?: string;
}
