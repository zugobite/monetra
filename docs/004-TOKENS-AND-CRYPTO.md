# Tokens & Crypto

The Tokens module allows you to define custom currencies, including cryptocurrencies with high precision (up to 18 decimals) and custom tokens.

## Installation

```typescript
import { defineToken, ETH, BTC, USDC } from "monetra/tokens";
```

## Using Built-in Tokens

Monetra comes with presets for popular cryptocurrencies.

```typescript
import { Money } from "monetra";
import { ETH, BTC } from "monetra/tokens";

const ethBalance = Money.fromMajor("1.5", ETH);
console.log(ethBalance.format()); // "Ξ 1.500000000000000000"

const btcBalance = Money.fromMajor("0.005", BTC);
console.log(btcBalance.format()); // "₿ 0.00500000"
```

## Defining Custom Tokens

You can define your own tokens for your application.

```typescript
import { defineToken } from "monetra/tokens";

const MY_TOKEN = defineToken({
  code: "MYT",
  symbol: "T",
  decimals: 6,
  type: "custom"
});

const balance = Money.fromMajor("100", MY_TOKEN);
console.log(balance.format()); // "T100.000000"
```

## Token Definition Options

```typescript
interface TokenDefinition {
  code: string;           // Unique code (e.g., "ETH")
  symbol: string;         // Display symbol (e.g., "Ξ")
  decimals: number;       // Precision (e.g., 18)
  type: "fiat" | "crypto" | "commodity" | "custom";
  chainId?: number;       // For crypto (e.g., 1 for Mainnet)
  contractAddress?: string; // ERC-20 contract address
  coingeckoId?: string;   // For price fetching
}
```

## Next Steps

- [API Reference](005-API-REFERENCE.md)
