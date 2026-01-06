# Best Practices

This guide covers recommended patterns, anti-patterns to avoid, testing strategies, and performance tips for building reliable financial applications with the Monetra framework.

---

## Table of Contents

- [Framework Organization](#framework-organization)
- [Design Patterns](#patterns)
- [Anti-Patterns to Avoid](#anti-patterns)
- [Testing Money](#testing)
- [Performance Tips](#performance)
- [Production Checklist](#production)

---

## Framework Organization {#framework-organization}

### Modular Imports for Optimal Bundle Size

Monetra supports both main exports and subpath exports. Use subpath exports in production for optimal tree-shaking:

```typescript
// ✅ Good: Subpath exports (optimal for tree-shaking)
import { Ledger } from "monetra/ledger";
import { loan, npv, irr } from "monetra/financial";
import { defineToken } from "monetra/tokens";

// ✅ Also good: Main export (convenient for development)
import { money, Money, futureValue, Ledger } from "monetra";

// ❌ Avoid: Importing entire framework when only using specific modules
import * as Monetra from "monetra";
```

### Feature-Based Architecture

Organize your application code by feature, with each feature importing only the Monetra components it needs:

```
src/
  features/
    payments/
      - usePayments.ts         (imports: money, Ledger)
      - PaymentService.ts      (imports: Ledger, Converter)
    investments/
      - useInvestments.ts      (imports: money, futureValue, npv)
      - InvestmentCalc.ts      (imports: financial module)
    billing/
      - useBilling.ts          (imports: money, pmt, loan)
      - BillingService.ts      (imports: Ledger)
```

---

## Design Patterns {#patterns}

### 1. Centralize Currency Configuration

Define currencies and tokens in a single module:

```typescript
// config/currencies.ts
import { getCurrency, defineToken, type Currency } from "monetra";

// Standard currencies
export const USD = getCurrency("USD");
export const EUR = getCurrency("EUR");
export const GBP = getCurrency("GBP");

// Custom tokens
export const REWARDS = defineToken({
  code: "REWARDS",
  symbol: "★",
  decimals: 0,
  type: "custom",
});

// Crypto tokens
export const ETH = defineToken({
  code: "ETH",
  symbol: "Ξ",
  decimals: 18,
  type: "crypto",
});

// Supported currencies type
export type SupportedCurrency = "USD" | "EUR" | "GBP" | "REWARDS" | "ETH";

// Currency list for UI
export const CURRENCY_OPTIONS = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
] as const;
```

### 2. Create Money Factory Functions

Wrap money creation with validation:

```typescript
// utils/money.ts
import { money, Money, RoundingMode } from "monetra";
import { SupportedCurrency, USD } from "../config/currencies";

export function createMoney(
  amount: string | number,
  currency: SupportedCurrency = "USD"
): Money {
  return money(amount, currency);
}

export function createMoneyFromCents(
  cents: number | bigint,
  currency: SupportedCurrency = "USD"
): Money {
  return Money.fromMinor(BigInt(cents), currency);
}

export function parseUserMoney(
  input: string,
  currency: SupportedCurrency
): Money | null {
  // Remove currency symbols and formatting
  const cleaned = input.replace(/[$€£,\s]/g, "");

  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) {
    return null;
  }

  try {
    return money(cleaned, currency);
  } catch {
    return null;
  }
}
```

### 3. Use Immutable Data Flow

Money objects are immutable—embrace this:

```typescript
import { money, Money, RoundingMode } from "monetra";

// Good: Immutable chain
function calculateTotal(
  subtotal: Money,
  taxRate: number,
  discount: Money
): Money {
  return subtotal
    .multiply(1 + taxRate, { rounding: RoundingMode.HALF_UP })
    .subtract(discount);
}

// Bad: Trying to mutate
function badCalculation(amount: Money): Money {
  // This doesn't work - multiply returns a NEW Money object
  amount.multiply(2); // Result is discarded!
  return amount; // Original unchanged
}
```

### 4. Separate Display from Storage

```typescript
import { money, Money } from "monetra";

interface Order {
  id: string;
  // Store as minor units (cents)
  totalMinor: string; // BigInt as string for JSON
  currency: string;
}

// Convert for storage
function orderToDatabase(total: Money): Partial<Order> {
  return {
    totalMinor: total.minor.toString(),
    currency: total.currency.code,
  };
}

// Convert for display
function orderFromDatabase(order: Order): Money {
  return Money.fromMinor(BigInt(order.totalMinor), order.currency);
}

// Usage
const total = money("99.99", "USD");
const dbRecord = orderToDatabase(total);
// { totalMinor: "9999", currency: "USD" }

const restored = orderFromDatabase(dbRecord as Order);
console.log(restored.format()); // "$99.99"
```

### 5. Use MoneyBag for Multi-Currency

```typescript
import { money, MoneyBag, Converter, RoundingMode } from "monetra";

function calculatePortfolioValue(
  holdings: Array<{ amount: string; currency: string }>
): { total: Money; breakdown: Money[] } {
  const bag = new MoneyBag();

  for (const { amount, currency } of holdings) {
    bag.add(money(amount, currency));
  }

  // Get total in USD
  const converter = new Converter("USD", {
    EUR: 0.92,
    GBP: 0.79,
  });

  return {
    total: bag.total("USD", converter),
    breakdown: bag.getAll(),
  };
}
```

---

## Anti-Patterns to Avoid {#anti-patterns}

### Avoid: Using Floating Point

```typescript
// BAD: Floating point arithmetic
const price = 0.1 + 0.2; // 0.30000000000000004
const total = price * 100; // 30.000000000000004

// GOOD: Use Money objects
import { money, RoundingMode } from "monetra";

const price = money("0.10", "USD").add("0.20");
const total = price.multiply(100);
console.log(total.format()); // "$30.00"
```

### Avoid: Storing Formatted Strings

```typescript
// BAD: Storing formatted values
const order = {
  total: "$1,234.56", // Loses precision, locale-dependent
};

// GOOD: Store minor units
const order = {
  totalMinor: "123456",
  currency: "USD",
};
```

### Avoid: Ignoring Rounding in Division

```typescript
import { money, RoundingMode } from "monetra";

const total = money("100.00", "USD");

// BAD: Will throw RoundingRequiredError
// const third = total.divide(3);

// GOOD: Specify rounding mode
const third = total.divide(3, { rounding: RoundingMode.HALF_UP });

// BETTER: Use allocate for lossless division
const parts = total.allocate([1, 1, 1]);
// ["$33.34", "$33.33", "$33.33"] - All cents accounted for!
```

### Avoid: Comparing Across Currencies

```typescript
import { money, Converter } from "monetra";

const usd = money("100.00", "USD");
const eur = money("92.00", "EUR");

// BAD: Will throw CurrencyMismatchError
// if (usd.gt(eur)) { ... }

// GOOD: Convert first
const converter = new Converter("USD", { EUR: 0.92 });
const eurInUsd = converter.convert(eur, "USD");

if (usd.gt(eurInUsd)) {
  console.log("USD amount is greater");
}
```

### Avoid: Creating Money in Loops

```typescript
import { money, Money, getCurrency } from "monetra";

const items = [
  /* many items */
];

// SUBOPTIMAL: Currency lookup on every iteration
for (const item of items) {
  const price = money(item.price, "USD");
}

// BETTER: Cache currency reference
const USD = getCurrency("USD");
for (const item of items) {
  const price = money(item.price, USD); // Faster
}
```

### Avoid: Not Handling Errors

```typescript
import { money, MonetraError } from "monetra";

// BAD: No error handling
function processPayment(amount: string) {
  const payment = money(amount, "USD"); // May throw!
  // ...
}

// GOOD: Handle errors appropriately
function processPayment(amount: string) {
  try {
    const payment = money(amount, "USD");
    // ...
  } catch (error) {
    if (error instanceof MonetraError) {
      return { error: error.message };
    }
    throw error;
  }
}
```

---

## Testing Money {#testing}

### Basic Test Setup

```typescript
import { describe, it, expect } from "vitest"; // or jest
import { money, Money, RoundingMode } from "monetra";

describe("Money calculations", () => {
  it("should add amounts correctly", () => {
    const a = money("10.00", "USD");
    const b = money("5.50", "USD");

    const result = a.add(b);

    expect(result.format()).toBe("$15.50");
    expect(result.minor).toBe(1550n);
  });

  it("should split bill evenly", () => {
    const total = money("100.00", "USD");
    const parts = total.split(3);

    // Check all parts add up
    const sum = parts.reduce((a, b) => a.add(b));
    expect(sum.equals(total)).toBe(true);

    // Check individual amounts
    expect(parts[0].format()).toBe("$33.34");
    expect(parts[1].format()).toBe("$33.33");
    expect(parts[2].format()).toBe("$33.33");
  });
});
```

### Testing Edge Cases

```typescript
import { describe, it, expect } from "vitest";
import {
  money,
  CurrencyMismatchError,
  RoundingRequiredError,
  RoundingMode,
} from "monetra";

describe("Edge cases", () => {
  it("should throw on currency mismatch", () => {
    const usd = money("100", "USD");
    const eur = money("50", "EUR");

    expect(() => usd.add(eur)).toThrow(CurrencyMismatchError);
  });

  it("should throw on division without rounding", () => {
    const amount = money("100", "USD");

    expect(() => amount.divide(3)).toThrow(RoundingRequiredError);
  });

  it("should handle zero correctly", () => {
    const zero = money("0", "USD");

    expect(zero.isZero()).toBe(true);
    expect(zero.isPositive()).toBe(false);
    expect(zero.isNegative()).toBe(false);
  });

  it("should handle negative amounts", () => {
    const negative = money("-50.00", "USD");

    expect(negative.isNegative()).toBe(true);
    expect(negative.abs().format()).toBe("$50.00");
    expect(negative.negate().format()).toBe("$50.00");
  });
});
```

### Property-Based Testing

```typescript
import { describe, it, expect } from "vitest";
import { money, Money, RoundingMode } from "monetra";
import fc from "fast-check";

describe("Money properties", () => {
  it("addition should be commutative", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000000 }),
        fc.integer({ min: 0, max: 1000000 }),
        (a, b) => {
          const moneyA = Money.fromMinor(BigInt(a), "USD");
          const moneyB = Money.fromMinor(BigInt(b), "USD");

          return moneyA.add(moneyB).equals(moneyB.add(moneyA));
        }
      )
    );
  });

  it("multiplication should distribute over addition", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10000 }),
        fc.integer({ min: 0, max: 10000 }),
        fc.integer({ min: 1, max: 100 }),
        (a, b, n) => {
          const moneyA = Money.fromMinor(BigInt(a), "USD");
          const moneyB = Money.fromMinor(BigInt(b), "USD");

          // (a + b) * n = a*n + b*n
          const left = moneyA.add(moneyB).multiply(n);
          const right = moneyA.multiply(n).add(moneyB.multiply(n));

          return left.equals(right);
        }
      )
    );
  });

  it("split should preserve total", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000000 }),
        fc.integer({ min: 1, max: 10 }),
        (amount, parts) => {
          const total = Money.fromMinor(BigInt(amount), "USD");
          const split = total.split(parts);

          const sum = split.reduce((a, b) => a.add(b));
          return sum.equals(total);
        }
      )
    );
  });
});
```

### Testing Ledger Operations

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { Ledger, money } from "monetra";

describe("Ledger", () => {
  let ledger: Ledger;

  beforeEach(() => {
    ledger = new Ledger({ currency: "USD" });
  });

  it("should track account balances", () => {
    ledger.credit("savings", money("1000", "USD"), "Initial deposit");
    ledger.debit("savings", money("250", "USD"), "Withdrawal");

    const balance = ledger.getBalance("savings");
    expect(balance.format()).toBe("$750.00");
  });

  it("should maintain balanced books", () => {
    ledger.credit("revenue", money("500", "USD"), "Sale");
    ledger.debit("expenses", money("200", "USD"), "Cost");

    const totalBalance = ledger.getTotalBalance();
    expect(totalBalance.format()).toBe("$300.00");
  });

  it("should verify integrity", () => {
    ledger.credit("account", money("100", "USD"), "Test");

    expect(ledger.verify()).toBe(true);
  });
});
```

---

## Performance Tips {#performance}

### 1. Cache Currency References

```typescript
import { getCurrency, money, Currency } from "monetra";

// Slower: Currency lookup each time
function processItems(items: Array<{ price: string }>) {
  return items.map((item) => money(item.price, "USD"));
}

// Faster: Cache currency reference
function processItemsOptimized(items: Array<{ price: string }>) {
  const USD = getCurrency("USD");
  return items.map((item) => money(item.price, USD));
}
```

### 2. Use fromMinor for Integer Data

```typescript
import { Money, money } from "monetra";

// Slower: Parsing string
const price = money("19.99", "USD");

// Faster: Direct from cents
const priceOptimized = Money.fromMinor(1999n, "USD");
```

### 3. Batch Operations

```typescript
import { money, Money, MoneyBag, RoundingMode } from "monetra";

// Slower: Individual additions
function sumPrices(prices: Money[]): Money {
  let total = money("0", "USD");
  for (const price of prices) {
    total = total.add(price);
  }
  return total;
}

// Faster: Use reduce
function sumPricesOptimized(prices: Money[]): Money {
  if (prices.length === 0) return money("0", "USD");
  return prices.reduce((sum, price) => sum.add(price));
}

// Also: MoneyBag for multi-currency
function sumMultiCurrency(amounts: Money[]): MoneyBag {
  const bag = new MoneyBag();
  for (const amount of amounts) {
    bag.add(amount);
  }
  return bag;
}
```

### 4. Avoid Unnecessary Formatting

```typescript
import { money, Money } from "monetra";

// Wasteful: Format then compare
function isExpensive(price: Money): boolean {
  return price.format() === "$100.00"; // Creates string
}

// Better: Compare values directly
function isExpensiveOptimized(price: Money): boolean {
  return price.minor === 10000n; // Direct comparison
}

// Or use comparison methods
function isExpensiveSemantic(price: Money): boolean {
  const threshold = money("100.00", "USD");
  return price.gte(threshold);
}
```

### 5. Pre-compute Exchange Rates

```typescript
import { Converter, money, Money } from "monetra";

// Creating converter per operation
function convertPrices(prices: Money[], targetCurrency: string): Money[] {
  return prices.map((price) => {
    const converter = new Converter("USD", { EUR: 0.92 }); // Recreated each time
    return converter.convert(price, targetCurrency);
  });
}

// Reuse converter
function convertPricesOptimized(
  prices: Money[],
  targetCurrency: string
): Money[] {
  const converter = new Converter("USD", { EUR: 0.92 });
  return prices.map((price) => converter.convert(price, targetCurrency));
}
```

---

## Production Checklist {#production}

### Before Deployment

- [ ] **Validate all user input** before creating Money objects
- [ ] **Handle all MonetraError types** in API responses
- [ ] **Use appropriate rounding modes** for your business logic
- [ ] **Store amounts as minor units** (cents/smallest unit) in database
- [ ] **Use BigInt string serialization** for JSON (minor units as strings)
- [ ] **Configure Ledger verification** for audit requirements
- [ ] **Test with edge cases**: zero, negative, very large amounts

### Database Schema

```sql
-- Recommended schema for storing money
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  amount_minor BIGINT NOT NULL,        -- Store in minor units (cents)
  currency_code VARCHAR(3) NOT NULL,   -- ISO 4217 code
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- For high-precision crypto
CREATE TABLE crypto_transactions (
  id UUID PRIMARY KEY,
  amount_minor TEXT NOT NULL,          -- BigInt as string for 18 decimals
  token_code VARCHAR(10) NOT NULL,
  decimals SMALLINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Response Format

```typescript
// Consistent API response format
interface MoneyResponse {
  amount: string; // Human-readable: "1,234.56"
  minor: string; // Minor units as string: "123456"
  currency: string; // Currency code: "USD"
}

function toMoneyResponse(m: Money): MoneyResponse {
  return {
    amount: m.format({ symbol: false }),
    minor: m.minor.toString(),
    currency: m.currency.code,
  };
}
```

### Logging

```typescript
import { money, Money, MonetraError } from "monetra";

// Log monetary operations for audit trail
function logTransaction(
  operation: string,
  amount: Money,
  metadata: Record<string, unknown>
) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      operation,
      amount: {
        value: amount.format({ symbol: false }),
        minor: amount.minor.toString(),
        currency: amount.currency.code,
      },
      ...metadata,
    })
  );
}
```

---

## Next Steps

- **[Error Handling](./guides/error-handling.md)** - Handle errors gracefully
- **[React Examples](./examples/react.md)** - React.js patterns
- **[Vue Examples](./examples/vue.md)** - Vue.js patterns
- **[Node.js Examples](./examples/node.md)** - Server-side patterns
