# Custom Tokens Guide

Monetra supports not only traditional fiat currencies but also cryptocurrencies, stablecoins, and custom tokens. This guide covers how to define and work with custom monetary units.

---

## Table of Contents

- [When to Use Custom Tokens](#when-to-use)
- [Defining Tokens](#defining-tokens)
- [Built-in Crypto Tokens](#builtin-tokens)
- [Token Types](#token-types)
- [High-Precision Handling](#high-precision)
- [Framework Examples](#framework-examples)
- [Best Practices](#best-practices)

---

## When to Use Custom Tokens {#when-to-use}

Use `defineToken()` when you need to work with:

- **Cryptocurrencies** (ETH, BTC, etc.)
- **Stablecoins** (USDC, USDT, DAI)
- **ERC-20 / SPL tokens**
- **Game currencies** or loyalty points
- **Commodities** (gold, silver by weight)
- **Custom business units** (credits, shares)

```typescript
import { defineToken, money } from "monetra";

// Your company's reward points
const REWARDS = defineToken({
  code: "REWARDS",
  symbol: "★",
  decimals: 0, // No fractional points
  type: "custom",
});

// Now use it like any currency
const points = money(5000, REWARDS);
console.log(points.format()); // "5,000 ★"

const bonus = points.add(500);
console.log(bonus.format()); // "5,500 ★"
```

---

## Defining Tokens {#defining-tokens}

### Basic Token Definition

```typescript
import { defineToken, money } from "monetra";

const token = defineToken({
  code: "MYTOKEN", // Required: Unique identifier
  symbol: "MTK", // Required: Display symbol
  decimals: 8, // Required: Decimal precision
});

// Token is automatically registered and ready to use
const balance = money("100.12345678", "MYTOKEN");
console.log(balance.format()); // "100.12345678 MTK"
```

### Full Token Definition

```typescript
import { defineToken, money } from "monetra";

const MATIC = defineToken({
  // Required fields
  code: "MATIC",
  symbol: "MATIC",
  decimals: 18,

  // Optional metadata
  type: "crypto", // 'fiat' | 'crypto' | 'commodity' | 'custom'
  locale: "en-US", // Default formatting locale
  chainId: 137, // Polygon mainnet
  contractAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC
  standard: "ERC-20", // Token standard
  coingeckoId: "matic-network", // For price lookups
});

// Use with full precision
const balance = money("1500.123456789012345678", MATIC);
console.log(balance.format());
// "1,500.123456789012345678 MATIC"
```

### Token Definition Interface

```typescript
interface TokenDefinition {
  code: string; // Unique identifier (e.g., "ETH", "USDC")
  symbol: string; // Display symbol (e.g., "Ξ", "USDC")
  decimals: number; // Decimal places (0-18)
  type?: "fiat" | "crypto" | "commodity" | "custom";
  locale?: string; // BCP 47 locale for formatting
  chainId?: number; // Blockchain network ID
  contractAddress?: string; // Smart contract address
  standard?: string; // Token standard (ERC-20, SPL, etc.)
  coingeckoId?: string; // CoinGecko API identifier
}
```

---

## Built-in Crypto Tokens {#builtin-tokens}

Monetra includes popular cryptocurrency tokens:

```typescript
import { ETH, BTC, USDC, USDT, money } from "monetra";

// Ethereum (18 decimals)
const ethBalance = money("2.5", ETH);
console.log(ethBalance.format()); // "2.50 Ξ"
console.log(ETH.decimals); // 18
console.log(ETH.symbol); // "Ξ"

// Bitcoin (8 decimals)
const btcBalance = money("0.00100000", BTC);
console.log(btcBalance.format()); // "0.00100000 ₿"
console.log(BTC.decimals); // 8

// USDC (6 decimals - typical for stablecoins)
const usdcBalance = money("1000.50", USDC);
console.log(usdcBalance.format()); // "1,000.50 USDC"
console.log(USDC.decimals); // 6

// Tether (6 decimals)
const usdtBalance = money("500.00", USDT);
console.log(usdtBalance.format()); // "500.00 ₮"
console.log(USDT.decimals); // 6
```

### Built-in Token Details

| Token    | Code | Symbol | Decimals | Type   |
| -------- | ---- | ------ | -------- | ------ |
| Ethereum | ETH  | Ξ      | 18       | crypto |
| Bitcoin  | BTC  | ₿      | 8        | crypto |
| USD Coin | USDC | USDC   | 6        | crypto |
| Tether   | USDT | ₮      | 6        | crypto |

---

## Token Types {#token-types}

### Cryptocurrency

```typescript
import { defineToken, money } from "monetra";

const SOL = defineToken({
  code: "SOL",
  symbol: "◎",
  decimals: 9,
  type: "crypto",
  coingeckoId: "solana",
});

const AVAX = defineToken({
  code: "AVAX",
  symbol: "AVAX",
  decimals: 18,
  type: "crypto",
  chainId: 43114, // Avalanche C-Chain
  coingeckoId: "avalanche-2",
});

const solBalance = money("100.5", SOL);
console.log(solBalance.format()); // "100.50 ◎"
```

### Stablecoins

```typescript
import { defineToken, money, RoundingMode } from "monetra";

const DAI = defineToken({
  code: "DAI",
  symbol: "DAI",
  decimals: 18,
  type: "crypto",
  chainId: 1,
  contractAddress: "0x6B175474E89094C44Da98b954EesdeCB5DC3c7",
  standard: "ERC-20",
  coingeckoId: "dai",
});

const USDC = defineToken({
  code: "USDC",
  symbol: "USDC",
  decimals: 6,
  type: "crypto",
  chainId: 1,
  contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  standard: "ERC-20",
  coingeckoId: "usd-coin",
});

// Note: DAI and USDC have different precisions
const daiAmount = money("100.00", DAI);
const usdcAmount = money("100.00", USDC);

console.log(daiAmount.minor); // 100000000000000000000n (18 decimals)
console.log(usdcAmount.minor); // 100000000n (6 decimals)
```

### Game/Reward Tokens

```typescript
import { defineToken, money } from "monetra";

// Game currency with no decimals
const GOLD = defineToken({
  code: "GOLD",
  symbol: "G",
  decimals: 0,
  type: "custom",
});

// Loyalty points with 2 decimals (for partial points)
const POINTS = defineToken({
  code: "POINTS",
  symbol: "pts",
  decimals: 2,
  type: "custom",
});

const goldBalance = money(10000, GOLD);
console.log(goldBalance.format()); // "10,000 G"

const pointsBalance = money("125.50", POINTS);
console.log(pointsBalance.format()); // "125.50 pts"
```

### Commodities

```typescript
import { defineToken, money, RoundingMode } from "monetra";

// Gold by troy ounce (common precision: 3-4 decimals)
const XAU = defineToken({
  code: "XAU",
  symbol: "oz Au",
  decimals: 4,
  type: "commodity",
});

// Silver by troy ounce
const XAG = defineToken({
  code: "XAG",
  symbol: "oz Ag",
  decimals: 4,
  type: "commodity",
});

const goldHolding = money("10.5000", XAU);
const silverHolding = money("500.2500", XAG);

console.log(goldHolding.format()); // "10.5000 oz Au"
console.log(silverHolding.format()); // "500.2500 oz Ag"
```

---

## High-Precision Handling {#high-precision}

### 18-Decimal Precision

Ethereum and many ERC-20 tokens use 18 decimals:

```typescript
import { defineToken, money, Money, RoundingMode } from "monetra";

// 1 ETH = 10^18 wei
const ETH = defineToken({
  code: "ETH",
  symbol: "Ξ",
  decimals: 18,
  type: "crypto",
});

// Full 18-decimal precision
const precise = money("1.234567890123456789", ETH);
console.log(precise.minor);
// 1234567890123456789n

// Arithmetic preserves precision
const doubled = precise.multiply(2);
console.log(doubled.minor);
// 2469135780246913578n

// When converting from wei (common in blockchain)
function fromWei(weiAmount: bigint): Money {
  return Money.fromMinor(weiAmount, ETH);
}

const weiBalance = 1500000000000000000n; // 1.5 ETH in wei
const ethBalance = fromWei(weiBalance);
console.log(ethBalance.format()); // "1.50 Ξ"
```

### Precision Conversions

```typescript
import { money, Money, ETH, USDC, Converter } from "monetra";

// Converting between different precision tokens
const converter = new Converter("USD", {
  ETH: 0.0003, // 1 USD = 0.0003 ETH (ETH @ $3,333)
  USDC: 1.0, // 1 USD = 1 USDC (stablecoin)
});

// $1000 worth of ETH
const usdAmount = money("1000.00", "USD");
const ethAmount = converter.convert(usdAmount, ETH);
console.log(ethAmount.format()); // "0.30 Ξ"

// Note: Precision is handled automatically
// ETH has 18 decimals, USD has 2, USDC has 6
```

---

## Framework Examples {#framework-examples}

<details open>
<summary><strong>React.js - Crypto Wallet</strong></summary>

```tsx
import React, { useState, useEffect } from "react";
import { defineToken, money, Money, Converter, MoneyBag } from "monetra";

// Define tokens once at module level
const tokens = {
  ETH: defineToken({ code: "ETH", symbol: "Ξ", decimals: 18, type: "crypto" }),
  USDC: defineToken({
    code: "USDC",
    symbol: "USDC",
    decimals: 6,
    type: "crypto",
  }),
  MATIC: defineToken({
    code: "MATIC",
    symbol: "MATIC",
    decimals: 18,
    type: "crypto",
  }),
};

interface WalletBalance {
  token: string;
  balance: Money;
  usdValue: Money | null;
}

function CryptoWallet() {
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [totalUSD, setTotalUSD] = useState<Money | null>(null);

  useEffect(() => {
    // Simulated wallet balances
    const bag = new MoneyBag();
    bag.add(money("2.5", tokens.ETH));
    bag.add(money("1000.00", tokens.USDC));
    bag.add(money("500.0", tokens.MATIC));

    // Prices in USD (from API in production)
    const prices: Record<string, number> = {
      ETH: 3333.0,
      USDC: 1.0,
      MATIC: 0.75,
    };

    // Create converter
    const converter = new Converter("USD", {
      ETH: 1 / prices.ETH,
      USDC: 1 / prices.USDC,
      MATIC: 1 / prices.MATIC,
    });

    // Calculate balances with USD values
    const walletBalances = bag.getAll().map((balance) => ({
      token: balance.currency.code,
      balance,
      usdValue: converter.convert(balance, "USD"),
    }));

    setBalances(walletBalances);
    setTotalUSD(bag.total("USD", converter));
  }, []);

  return (
    <div className="crypto-wallet">
      <h2>My Wallet</h2>

      <div className="balances">
        {balances.map(({ token, balance, usdValue }) => (
          <div key={token} className="balance-row">
            <span className="token-name">{token}</span>
            <span className="token-balance">{balance.format()}</span>
            <span className="usd-value">≈ {usdValue?.format()}</span>
          </div>
        ))}
      </div>

      <div className="total">
        <strong>Total: {totalUSD?.format() ?? "Loading..."}</strong>
      </div>
    </div>
  );
}
```

</details>

<details>
<summary><strong>Vue.js - Token Swap</strong></summary>

```vue
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { defineToken, money, Money, Converter, RoundingMode } from "monetra";

// Define tokens
const ETH = defineToken({
  code: "ETH",
  symbol: "Ξ",
  decimals: 18,
  type: "crypto",
});
const USDC = defineToken({
  code: "USDC",
  symbol: "USDC",
  decimals: 6,
  type: "crypto",
});
const DAI = defineToken({
  code: "DAI",
  symbol: "DAI",
  decimals: 18,
  type: "crypto",
});

const tokenList = { ETH, USDC, DAI };

const fromToken = ref("ETH");
const toToken = ref("USDC");
const fromAmount = ref("1.0");
const slippage = ref(0.5); // 0.5%

// Simulated prices (fetch from API in production)
const prices = {
  ETH: 3333.0,
  USDC: 1.0,
  DAI: 1.0,
};

const converter = new Converter("USD", {
  ETH: 1 / prices.ETH,
  USDC: 1 / prices.USDC,
  DAI: 1 / prices.DAI,
});

const toAmount = computed(() => {
  try {
    const from = money(fromAmount.value, fromToken.value);
    const result = converter.convert(from, toToken.value);
    return result;
  } catch {
    return null;
  }
});

const minimumReceived = computed(() => {
  if (!toAmount.value) return null;
  const slippageMultiplier = 1 - slippage.value / 100;
  return toAmount.value.multiply(slippageMultiplier, {
    rounding: RoundingMode.FLOOR,
  });
});

function swapTokens() {
  const temp = fromToken.value;
  fromToken.value = toToken.value;
  toToken.value = temp;
}
</script>

<template>
  <div class="token-swap">
    <h2>Swap Tokens</h2>

    <div class="swap-input from">
      <label>From</label>
      <input v-model="fromAmount" type="text" placeholder="0.0" />
      <select v-model="fromToken">
        <option v-for="(_, code) in tokenList" :key="code" :value="code">
          {{ code }}
        </option>
      </select>
    </div>

    <button class="swap-button" @click="swapTokens">⇅</button>

    <div class="swap-input to">
      <label>To (estimated)</label>
      <div class="output">{{ toAmount?.format() ?? "—" }}</div>
      <select v-model="toToken">
        <option v-for="(_, code) in tokenList" :key="code" :value="code">
          {{ code }}
        </option>
      </select>
    </div>

    <div class="details">
      <div class="slippage">
        <label>Slippage Tolerance:</label>
        <select v-model="slippage">
          <option :value="0.1">0.1%</option>
          <option :value="0.5">0.5%</option>
          <option :value="1.0">1.0%</option>
        </select>
      </div>

      <div v-if="minimumReceived" class="minimum">
        Minimum received: {{ minimumReceived.format() }}
      </div>
    </div>

    <button class="swap-execute" :disabled="!toAmount">Swap</button>
  </div>
</template>
```

</details>

<details>
<summary><strong>Node.js - Token Management</strong></summary>

```javascript
import { defineToken, money, Money, getCurrency } from "monetra";
import express from "express";

const app = express();
app.use(express.json());

// Token registry
const tokenRegistry = new Map();

// Initialize with built-in tokens
function initializeTokens() {
  const tokens = [
    { code: "ETH", symbol: "Ξ", decimals: 18, chainId: 1 },
    {
      code: "USDC",
      symbol: "USDC",
      decimals: 6,
      chainId: 1,
      contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    { code: "MATIC", symbol: "MATIC", decimals: 18, chainId: 137 },
  ];

  for (const config of tokens) {
    const token = defineToken({ ...config, type: "crypto" });
    tokenRegistry.set(config.code, token);
  }
}

initializeTokens();

// Add custom token endpoint
app.post("/api/tokens", (req, res) => {
  const { code, symbol, decimals, chainId, contractAddress } = req.body;

  // Validate
  if (!code || !symbol || decimals === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (decimals < 0 || decimals > 18) {
    return res.status(400).json({ error: "Decimals must be 0-18" });
  }

  try {
    const token = defineToken({
      code: code.toUpperCase(),
      symbol,
      decimals,
      type: "crypto",
      chainId,
      contractAddress,
    });

    tokenRegistry.set(token.code, token);

    res.json({
      success: true,
      token: {
        code: token.code,
        symbol: token.symbol,
        decimals: token.decimals,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get balance in token
app.get("/api/balance/:token", async (req, res) => {
  const tokenCode = req.params.token.toUpperCase();

  try {
    const currency = getCurrency(tokenCode);

    // Simulated balance (fetch from blockchain in production)
    const balanceMinor = BigInt("1500000000000000000"); // 1.5 tokens
    const balance = Money.fromMinor(balanceMinor, currency);

    res.json({
      token: tokenCode,
      balance: balance.format({ symbol: false }),
      balanceMinor: balance.minor.toString(),
      formatted: balance.format(),
    });
  } catch (error) {
    res.status(404).json({ error: `Token not found: ${tokenCode}` });
  }
});

// Convert between tokens
app.post("/api/convert", (req, res) => {
  const { amount, fromToken, toToken, prices } = req.body;

  try {
    const from = money(amount, fromToken.toUpperCase());

    // Build converter from prices
    const converter = new Converter("USD", prices);
    const result = converter.convert(from, toToken.toUpperCase());

    res.json({
      from: { amount, token: fromToken },
      to: {
        amount: result.format({ symbol: false }),
        token: toToken,
        formatted: result.format(),
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Token API running on port 3000");
});
```

</details>

---

## Best Practices {#best-practices}

### 1. Define Tokens at Module Level

```typescript
// tokens.ts - Define once, import everywhere
import { defineToken } from "monetra";

export const ETH = defineToken({
  code: "ETH",
  symbol: "Ξ",
  decimals: 18,
  type: "crypto",
});

export const USDC = defineToken({
  code: "USDC",
  symbol: "USDC",
  decimals: 6,
  type: "crypto",
});

// In other files:
// import { ETH, USDC } from './tokens';
```

### 2. Validate Token Configurations

```typescript
function validateTokenConfig(config: TokenDefinition): void {
  if (config.decimals < 0 || config.decimals > 18) {
    throw new Error("Decimals must be between 0 and 18");
  }

  if (!config.code || config.code.length > 10) {
    throw new Error("Invalid token code");
  }

  if (
    config.contractAddress &&
    !config.contractAddress.match(/^0x[a-fA-F0-9]{40}$/)
  ) {
    throw new Error("Invalid contract address");
  }
}
```

### 3. Handle Wei/Gwei Conversions

```typescript
import { Money, ETH } from "monetra";

// Wei to ETH
function fromWei(wei: bigint): Money {
  return Money.fromMinor(wei, ETH);
}

// ETH to Wei
function toWei(eth: Money): bigint {
  return eth.minor;
}

// Gwei (10^9 wei) to ETH
function fromGwei(gwei: number): Money {
  const wei = BigInt(Math.floor(gwei * 1e9));
  return Money.fromMinor(wei, ETH);
}

// Usage
const gasPrice = fromGwei(50); // 50 gwei
console.log(gasPrice.format()); // "0.000000050 Ξ"
```

### 4. Use Type-Safe Token References

```typescript
import { Money, money } from "monetra";

// Define a type for your supported tokens
type SupportedToken = "ETH" | "USDC" | "MATIC";

function getBalance(token: SupportedToken): Money {
  // TypeScript ensures only valid tokens are passed
  return money("0", token);
}
```

---

## Next Steps

- **[Currency API](../api/currency.md)** - Full currency/token API reference
- **[Formatting Guide](./formatting.md)** - Display token values
- **[Error Handling](./error-handling.md)** - Handle token errors
