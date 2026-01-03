# Monetra Documentation

<p class="subtitle">A currency-aware money library for TypeScript and JavaScript</p>

---

## Introduction

**Monetra** is a zero-dependency TypeScript library designed for **financial correctness**. It handles monetary values using integer arithmetic (storing amounts in minor units like cents) to eliminate floating-point precision errors that plague traditional number-based approaches.

```typescript
// The problem Monetra solves
0.1 + 0.2 === 0.3; // false (JavaScript floating-point)

// With Monetra
import { money } from "monetra";
const a = money("0.10", "USD");
const b = money("0.20", "USD");
a.add(b).equals(money("0.30", "USD")); // true
```

---

## Why Monetra?

| Challenge             | Traditional Approach   | Monetra Solution                     |
| --------------------- | ---------------------- | ------------------------------------ |
| Floating-point errors | `0.1 + 0.2 !== 0.3`    | Integer-based arithmetic with BigInt |
| Currency mixing       | Silent bugs            | Type-safe currency enforcement       |
| Rounding mistakes     | Ad-hoc rounding        | Explicit rounding strategies         |
| Audit trails          | Custom implementations | Built-in ledger with hash chains     |
| Crypto precision      | Limited to ~15 digits  | Up to 18 decimal places              |

---

## Key Features

### Integer Arithmetic

All calculations use integer math internally, eliminating floating-point errors.

### Currency-Aware

Built-in support for ISO 4217 currencies with automatic precision handling. Mix-currency operations throw explicit errors.

### Ledger System

Append-only transaction log with hash chain verification for data integrity.

### Crypto & Token Support

Handle cryptocurrencies (ETH, BTC, USDC) with up to 18 decimal places. Define custom tokens.

### Financial Mathematics

Compound interest, loan amortization, NPV, IRR, and other financial calculations.

### Zero Dependencies

No runtime dependencies. TypeScript-first with full type definitions.

---

## Quick Example

```typescript
import { money, Money, Ledger, futureValue, RoundingMode } from "monetra";

// Create money
const price = money("99.99", "USD");
const quantity = 3;
const total = price.multiply(quantity);
console.log(total.format()); // "$299.97"

// Split a bill
const bill = money("100.00", "USD");
const shares = bill.split(3);
// [$33.34, $33.33, $33.33] - no cents lost!

// Calculate investment growth
const principal = money("10000", "USD");
const future = futureValue(principal, {
  rate: 0.07, // 7% annual
  years: 10,
  compoundingPerYear: 12,
});
console.log(future.format()); // "$20,096.61"

// Track transactions with audit trail
const ledger = new Ledger("USD");
ledger.record(money("1000", "USD"), {
  type: "credit",
  description: "Initial deposit",
});
ledger.record(money("-50", "USD"), {
  type: "debit",
  description: "Coffee subscription",
});
console.log(ledger.getBalance().format()); // "$950.00"
console.log(ledger.verify()); // true - integrity verified
```

---

## Documentation Structure

<div class="doc-grid">

### Getting Started

- [Installation & Setup](./getting-started.md)
- [Your First Money Object](./getting-started.md#creating-money)
- [Framework Integration](./getting-started.md#framework-integration)

### Core Concepts

- [Integer-Based Arithmetic](./core-concepts.md#integer-arithmetic)
- [Currency & Precision](./core-concepts.md#currency-precision)
- [Immutability](./core-concepts.md#immutability)
- [Rounding Strategies](./core-concepts.md#rounding)

### API Reference

- [Money](./api/money.md) - Core monetary value class
- [Ledger](./api/ledger.md) - Audit-ready transaction log
- [Financial](./api/financial.md) - Financial calculations
- [Currency & Tokens](./api/currency.md) - Currency definitions

### Guides

- [Allocation & Splitting](./guides/allocation.md)
- [Formatting & Parsing](./guides/formatting.md)
- [Custom Tokens](./guides/custom-tokens.md)
- [Error Handling](./guides/error-handling.md)

### Framework Examples

- [React.js](./examples/react.md)
- [Vue.js](./examples/vue.md)
- [Node.js](./examples/node.md)

### Best Practices

- [Patterns & Anti-patterns](./best-practices.md)
- [Testing Strategies](./best-practices.md#testing)
- [Performance Tips](./best-practices.md#performance)

### Comparison

- [Library Comparison](./comparison.md)

</div>

---

## Installation

```bash
# npm
npm install monetra

# yarn
yarn add monetra

# pnpm
pnpm add monetra
```

---

## Browser & Node.js Support

Monetra supports:

- **Node.js** 18+ (ESM and CommonJS)
- **Modern Browsers** (ES2020+)
- **TypeScript** 4.7+
- **Bundlers**: Vite, Webpack, Rollup, esbuild

---

## License

MIT © [Monetra Contributors](https://github.com/zugobite/monetra)

---

<div class="next-step">

**Next:** [Getting Started →](./getting-started.md)

</div>
