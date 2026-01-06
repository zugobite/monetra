# Currency & Tokens API Reference

Monetra provides comprehensive support for ISO 4217 currencies, cryptocurrencies, and custom tokens.

---

## Table of Contents

- [Currency System](#currency-system)
  - [getCurrency()](#getcurrency)
  - [registerCurrency()](#registercurrency)
  - [Currency Interface](#currency-interface)
- [Tokens](#tokens)
  - [defineToken()](#definetoken)
  - [Built-in Tokens](#builtin-tokens)
- [Currency Conversion](#conversion)
  - [Converter](#converter)
- [Multi-Currency Portfolios](#portfolio)
  - [MoneyBag](#moneybag)

---

## Currency System {#currency-system}

### getCurrency() {#getcurrency}

Retrieves a currency definition by its ISO 4217 code.

```typescript
function getCurrency(code: string): Currency;
```

**Parameters:**

- `code` - ISO 4217 currency code (e.g., `"USD"`, `"EUR"`, `"JPY"`)

**Returns:** `Currency` object

**Throws:** Error if currency code is not registered

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { getCurrency, Money } from "monetra";

// Get currency details
const usd = getCurrency("USD");
console.log(usd);
// {
//   code: 'USD',
//   decimals: 2,
//   symbol: '$',
//   locale: 'en-US'
// }

const jpy = getCurrency("JPY");
console.log(jpy.decimals); // 0 (no decimal places)

const bhd = getCurrency("BHD");
console.log(bhd.decimals); // 3 (Bahraini Dinar uses 3 decimals)

// Use with Money
const amount = Money.fromMajor("100.00", getCurrency("EUR"));
console.log(amount.currency.symbol); // "€"
```

</details>

<details>
<summary><strong>JavaScript (ESM)</strong></summary>

```javascript
import { getCurrency, Money } from "monetra";

const eur = getCurrency("EUR");
const amount = Money.fromMajor("50.00", eur);
console.log(amount.format()); // "€50.00"
```

</details>

---

### registerCurrency() {#registercurrency}

Registers a custom currency for use with Money.

```typescript
function registerCurrency(currency: Currency): void;
```

**Parameters:**

- `currency` - Currency definition object

**Examples:**

```typescript
import { registerCurrency, money } from "monetra";

// Register a company-specific currency/points
registerCurrency({
  code: "POINTS",
  decimals: 0,
  symbol: "pts",
  locale: "en-US",
});

// Now use it like any currency
const points = money("500", "POINTS");
console.log(points.format()); // "500 pts"

// Register a fictional currency
registerCurrency({
  code: "GAL",
  decimals: 2,
  symbol: "₲",
  locale: "en-US",
});

const galleons = money("100.00", "GAL");
console.log(galleons.format()); // "₲100.00"
```

---

### Currency Interface {#currency-interface}

```typescript
interface Currency {
  /** ISO 4217 code or custom identifier */
  code: string;

  /** Number of decimal places (e.g., 2 for USD, 0 for JPY, 18 for ETH) */
  decimals: number;

  /** Display symbol (e.g., "$", "€", "Ξ") */
  symbol: string;

  /** BCP 47 locale for formatting (e.g., "en-US", "de-DE") */
  locale?: string;
}
```

### Supported Currencies

Monetra includes all ISO 4217 currencies. Common examples:

| Code | Name              | Decimals | Symbol |
| ---- | ----------------- | -------- | ------ |
| USD  | US Dollar         | 2        | $      |
| EUR  | Euro              | 2        | €      |
| GBP  | British Pound     | 2        | £      |
| JPY  | Japanese Yen      | 0        | ¥      |
| CNY  | Chinese Yuan      | 2        | ¥      |
| CHF  | Swiss Franc       | 2        | CHF    |
| AUD  | Australian Dollar | 2        | A$     |
| CAD  | Canadian Dollar   | 2        | C$     |
| BHD  | Bahraini Dinar    | 3        | BD     |
| KWD  | Kuwaiti Dinar     | 3        | KD     |
| OMR  | Omani Rial        | 3        | OMR    |

---

## Tokens {#tokens}

### defineToken() {#definetoken}

Defines a custom token or cryptocurrency.

```typescript
function defineToken(definition: {
  code: string;
  symbol: string;
  decimals: number;
  type?: "fiat" | "crypto" | "commodity" | "custom";
  locale?: string;
  chainId?: number;
  contractAddress?: string;
  standard?: string;
  coingeckoId?: string;
}): TokenDefinition;
```

**Parameters:**

- `code` - Token identifier (e.g., `"USDC"`, `"WETH"`)
- `symbol` - Display symbol
- `decimals` - Decimal precision (0-18)
- `type` - Token category (default: `"custom"`)
- `chainId` - Blockchain network ID (e.g., 1 for Ethereum mainnet)
- `contractAddress` - Smart contract address
- `standard` - Token standard (e.g., `"ERC-20"`)
- `coingeckoId` - CoinGecko API identifier

**Returns:** Frozen `TokenDefinition` object (also registers it)

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { defineToken, money } from "monetra";

// Define a custom token
const MATIC = defineToken({
  code: "MATIC",
  symbol: "MATIC",
  decimals: 18,
  type: "crypto",
  chainId: 137, // Polygon mainnet
  coingeckoId: "matic-network",
});

// Use it with Money
const balance = money("1500.123456789012345678", MATIC);
console.log(balance.format()); // "1,500.123456789012345678 MATIC"

// Define an ERC-20 token
const LINK = defineToken({
  code: "LINK",
  symbol: "LINK",
  decimals: 18,
  type: "crypto",
  chainId: 1,
  contractAddress: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  standard: "ERC-20",
  coingeckoId: "chainlink",
});

// Define a stablecoin with custom precision
const DAI = defineToken({
  code: "DAI",
  symbol: "DAI",
  decimals: 18,
  type: "crypto",
  chainId: 1,
  contractAddress: "0x6B175474E89094C44Da98b954EescdeCB5dC3c7",
  standard: "ERC-20",
});

const daiBalance = money("1000.50", DAI);
console.log(daiBalance.format()); // "1,000.50 DAI"
```

</details>

<details>
<summary><strong>JavaScript (ESM)</strong></summary>

```javascript
import { defineToken, money } from "monetra";

// Company loyalty points
const REWARDS = defineToken({
  code: "REWARDS",
  symbol: "★",
  decimals: 0,
  type: "custom",
});

const points = money(5000, REWARDS);
console.log(points.format()); // "5,000 ★"
```

</details>

<details>
<summary><strong>React.js</strong></summary>

```tsx
import { defineToken, money, Money } from "monetra";
import { useMemo } from "react";

// Define tokens once at module level
const USDC = defineToken({
  code: "USDC",
  symbol: "USDC",
  decimals: 6,
  type: "crypto",
  chainId: 1,
  contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
});

function TokenBalance({ balance, token }: { balance: string; token: string }) {
  const formatted = useMemo(() => {
    try {
      return money(balance, token).format();
    } catch {
      return "Invalid";
    }
  }, [balance, token]);

  return <span className="token-balance">{formatted}</span>;
}

// Usage
<TokenBalance balance="1000.50" token="USDC" />;
```

</details>

<details>
<summary><strong>Vue.js</strong></summary>

```vue
<script setup lang="ts">
import { defineToken, money } from "monetra";
import { computed } from "vue";

// Define token
const SOL = defineToken({
  code: "SOL",
  symbol: "◎",
  decimals: 9,
  type: "crypto",
  coingeckoId: "solana",
});

const props = defineProps<{
  balance: string;
}>();

const formatted = computed(() => money(props.balance, SOL).format());
</script>

<template>
  <span class="sol-balance">{{ formatted }}</span>
</template>
```

</details>

<details>
<summary><strong>Node.js</strong></summary>

```javascript
import { defineToken, money } from "monetra";

// Token configuration from environment/database
function initializeTokens(tokenConfigs) {
  const tokens = {};

  for (const config of tokenConfigs) {
    tokens[config.code] = defineToken({
      code: config.code,
      symbol: config.symbol,
      decimals: config.decimals,
      type: "crypto",
      chainId: config.chainId,
      contractAddress: config.address,
    });
  }

  return tokens;
}

// From config file or database
const tokens = initializeTokens([
  { code: "USDC", symbol: "USDC", decimals: 6, chainId: 1, address: "0x..." },
  { code: "WETH", symbol: "WETH", decimals: 18, chainId: 1, address: "0x..." },
]);

// API endpoint
app.get("/balances/:address", async (req, res) => {
  const balances = await fetchBalancesFromChain(req.params.address);

  const formatted = Object.entries(balances).map(([token, balance]) => ({
    token,
    balance: money(balance, token).format(),
  }));

  res.json(formatted);
});
```

</details>

---

### Built-in Tokens {#builtin-tokens}

Monetra includes pre-defined popular cryptocurrency tokens:

```typescript
import { ETH, BTC, USDC, USDT, money } from "monetra";

// Ethereum (18 decimals)
const ethBalance = money("1.5", ETH);
console.log(ethBalance.format()); // "1.50 Ξ"
console.log(ETH.decimals); // 18

// Bitcoin (8 decimals)
const btcBalance = money("0.00100000", BTC);
console.log(btcBalance.format()); // "0.00100000 ₿"
console.log(BTC.decimals); // 8

// USDC (6 decimals)
const usdcBalance = money("1000.50", USDC);
console.log(usdcBalance.format()); // "1,000.50 USDC"
console.log(USDC.decimals); // 6

// USDT (6 decimals)
const usdtBalance = money("500.00", USDT);
console.log(usdtBalance.format()); // "500.00 ₮"
console.log(USDT.decimals); // 6
```

| Token    | Code | Symbol | Decimals |
| -------- | ---- | ------ | -------- |
| Ethereum | ETH  | Ξ      | 18       |
| Bitcoin  | BTC  | ₿      | 8        |
| USD Coin | USDC | USDC   | 6        |
| Tether   | USDT | ₮      | 6        |

---

## Currency Conversion {#conversion}

### Converter {#converter}

Handles currency conversion using exchange rates.

```typescript
class Converter {
  constructor(base: string, rates: Record<string, number>);
  convert(money: Money, toCurrency: Currency | string): Money;
}
```

**Constructor Parameters:**

- `base` - Base currency code (e.g., `"USD"`)
- `rates` - Exchange rates relative to base (e.g., `{ "EUR": 0.85 }` means 1 USD = 0.85 EUR)

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { money, Converter } from "monetra";

// Create converter with USD as base
const converter = new Converter("USD", {
  EUR: 0.92, // 1 USD = 0.92 EUR
  GBP: 0.79, // 1 USD = 0.79 GBP
  JPY: 149.5, // 1 USD = 149.50 JPY
  CHF: 0.88, // 1 USD = 0.88 CHF
});

// Convert USD to EUR
const usd = money("100.00", "USD");
const eur = converter.convert(usd, "EUR");
console.log(eur.format()); // "€92.00"

// Convert EUR to GBP (cross-rate calculation)
const euros = money("100.00", "EUR");
const pounds = converter.convert(euros, "GBP");
console.log(pounds.format()); // "£85.87"

// Convert to JPY (0 decimals)
const yen = converter.convert(usd, "JPY");
console.log(yen.format()); // "¥14,950"
```

</details>

<details>
<summary><strong>JavaScript (ESM)</strong></summary>

```javascript
import { money, Converter } from "monetra";

// Fetch rates from an API
async function getConverter() {
  const response = await fetch("https://api.exchangerate.host/latest?base=USD");
  const data = await response.json();
  return new Converter("USD", data.rates);
}

// Usage
const converter = await getConverter();
const converted = converter.convert(money("50.00", "USD"), "EUR");
console.log(converted.format());
```

</details>

<details>
<summary><strong>React.js</strong></summary>

```tsx
import React, { useState, useEffect, useMemo } from "react";
import { money, Converter, Money } from "monetra";

function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [rates, setRates] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    // Fetch rates (simplified - use a real API)
    setRates({
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 149.5,
    });
  }, []);

  const converted = useMemo(() => {
    if (!rates) return null;
    try {
      const converter = new Converter("USD", rates);
      return converter.convert(money(amount, fromCurrency), toCurrency);
    } catch {
      return null;
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const currencies = ["USD", "EUR", "GBP", "JPY"];

  return (
    <div className="converter">
      <div className="input-group">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <span className="arrow">→</span>

      <div className="output-group">
        <span className="result">{converted?.format() ?? "—"}</span>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
```

</details>

<details>
<summary><strong>Node.js</strong></summary>

```javascript
import { money, Converter } from "monetra";
import express from "express";

const app = express();

// Cache rates (refresh periodically)
let converter = null;
let lastUpdate = 0;

async function getConverter() {
  const now = Date.now();
  if (!converter || now - lastUpdate > 3600000) {
    // 1 hour cache
    const response = await fetch(
      "https://api.exchangerate.host/latest?base=USD"
    );
    const data = await response.json();
    converter = new Converter("USD", data.rates);
    lastUpdate = now;
  }
  return converter;
}

app.get("/api/convert", async (req, res) => {
  const { amount, from, to } = req.query;

  try {
    const conv = await getConverter();
    const source = money(amount, from);
    const result = conv.convert(source, to);

    res.json({
      from: { amount, currency: from },
      to: { amount: result.format({ symbol: false }), currency: to },
      formatted: result.format(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

</details>

---

## Multi-Currency Portfolios {#portfolio}

### MoneyBag {#moneybag}

A collection of Money objects in different currencies—useful for wallets and portfolios.

```typescript
class MoneyBag {
  add(money: Money): void;
  subtract(money: Money): void;
  get(currency: Currency | string): Money;
  total(targetCurrency: Currency | string, converter: Converter): Money;
  getAll(): Money[];
  toJSON(): Array<{ amount: string; currency: string; precision: number }>;
}
```

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { money, MoneyBag, Converter } from "monetra";

// Create a portfolio
const portfolio = new MoneyBag();

// Add multiple currencies
portfolio.add(money("10000.00", "USD"));
portfolio.add(money("5000.00", "EUR"));
portfolio.add(money("3000.00", "GBP"));
portfolio.add(money("2000.00", "USD")); // Adds to existing USD

// Check individual balances
console.log(portfolio.get("USD").format()); // "$12,000.00"
console.log(portfolio.get("EUR").format()); // "€5,000.00"
console.log(portfolio.get("GBP").format()); // "£3,000.00"
console.log(portfolio.get("JPY").format()); // "¥0" (not added)

// Get total in USD
const converter = new Converter("USD", {
  EUR: 0.92,
  GBP: 0.79,
});

const totalUSD = portfolio.total("USD", converter);
console.log(`Total portfolio value: ${totalUSD.format()}`);
// "Total portfolio value: $21,221.52"

// Subtract from portfolio
portfolio.subtract(money("500.00", "EUR"));
console.log(portfolio.get("EUR").format()); // "€4,500.00"

// Get all holdings
const holdings = portfolio.getAll();
holdings.forEach((m) => {
  console.log(`${m.currency.code}: ${m.format()}`);
});

// Serialize
const json = portfolio.toJSON();
console.log(JSON.stringify(json, null, 2));
```

</details>

<details>
<summary><strong>React.js</strong></summary>

```tsx
import React, { useState, useCallback } from "react";
import { money, MoneyBag, Converter, Money } from "monetra";

function Portfolio() {
  const [bag] = useState(() => new MoneyBag());
  const [holdings, setHoldings] = useState<Money[]>([]);
  const [totalUSD, setTotalUSD] = useState<Money | null>(null);

  const converter = new Converter("USD", {
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.5,
  });

  const addFunds = useCallback(
    (amount: string, currency: string) => {
      bag.add(money(amount, currency));
      setHoldings(bag.getAll().filter((m) => !m.isZero()));
      setTotalUSD(bag.total("USD", converter));
    },
    [bag, converter]
  );

  return (
    <div className="portfolio">
      <h2>My Portfolio</h2>

      <div className="add-funds">
        <button onClick={() => addFunds("1000", "USD")}>+ $1,000 USD</button>
        <button onClick={() => addFunds("1000", "EUR")}>+ €1,000 EUR</button>
        <button onClick={() => addFunds("1000", "GBP")}>+ £1,000 GBP</button>
      </div>

      <div className="holdings">
        <h3>Holdings</h3>
        {holdings.map((m) => (
          <div key={m.currency.code} className="holding">
            <span>{m.currency.code}</span>
            <span>{m.format()}</span>
          </div>
        ))}
      </div>

      {totalUSD && (
        <div className="total">
          <strong>Total (USD): {totalUSD.format()}</strong>
        </div>
      )}
    </div>
  );
}
```

</details>

<details>
<summary><strong>Node.js</strong></summary>

```javascript
import { money, MoneyBag, Converter, Money } from "monetra";

// User wallet service
class WalletService {
  constructor() {
    this.wallets = new Map(); // userId -> MoneyBag
  }

  getWallet(userId) {
    if (!this.wallets.has(userId)) {
      this.wallets.set(userId, new MoneyBag());
    }
    return this.wallets.get(userId);
  }

  deposit(userId, amount, currency) {
    const wallet = this.getWallet(userId);
    wallet.add(money(amount, currency));
    return wallet.get(currency);
  }

  withdraw(userId, amount, currency) {
    const wallet = this.getWallet(userId);
    const current = wallet.get(currency);
    const withdrawAmount = money(amount, currency);

    if (current.lessThan(withdrawAmount)) {
      throw new Error("Insufficient funds");
    }

    wallet.subtract(withdrawAmount);
    return wallet.get(currency);
  }

  getBalance(userId, currency) {
    return this.getWallet(userId).get(currency);
  }

  getTotalValue(userId, targetCurrency, converter) {
    return this.getWallet(userId).total(targetCurrency, converter);
  }

  getAllBalances(userId) {
    return this.getWallet(userId).getAll();
  }
}

// API routes
const walletService = new WalletService();

app.post("/api/wallet/deposit", (req, res) => {
  const { userId, amount, currency } = req.body;
  const newBalance = walletService.deposit(userId, amount, currency);
  res.json({ balance: newBalance.format() });
});

app.get("/api/wallet/:userId/total", async (req, res) => {
  const converter = await getConverter(); // Fetch latest rates
  const total = walletService.getTotalValue(
    req.params.userId,
    "USD",
    converter
  );
  res.json({ totalUSD: total.format() });
});
```

</details>

---

## Best Practices

### Use Tokens for Non-Standard Currencies

```typescript
// Good: Define custom tokens properly
const REWARDS = defineToken({
  code: "REWARDS",
  symbol: "R",
  decimals: 0,
  type: "custom",
});

// Avoid: Misusing ISO currency codes
// registerCurrency({ code: 'USD', decimals: 4, ... }); // Don't override!
```

### Keep Exchange Rates Updated

```typescript
// Implement rate caching with refresh
class ExchangeRateService {
  private converter: Converter | null = null;
  private lastUpdate = 0;
  private cacheMs = 300000; // 5 minutes

  async getConverter(): Promise<Converter> {
    if (!this.converter || Date.now() - this.lastUpdate > this.cacheMs) {
      await this.refresh();
    }
    return this.converter!;
  }

  private async refresh() {
    const rates = await fetchRatesFromAPI();
    this.converter = new Converter("USD", rates);
    this.lastUpdate = Date.now();
  }
}
```

### Handle Missing Rates Gracefully

```typescript
function safeConvert(
  amount: Money,
  targetCurrency: string,
  converter: Converter
): Money | null {
  try {
    return converter.convert(amount, targetCurrency);
  } catch (error) {
    console.warn(`Cannot convert ${amount.currency.code} to ${targetCurrency}`);
    return null;
  }
}
```

---

## Next Steps

- **[Custom Tokens Guide](../guides/custom-tokens.md)** - Deep dive into token creation
- **[Formatting Guide](../guides/formatting.md)** - Display options for currencies
- **[Best Practices](../best-practices.md)** - Production patterns
