# Monetra Documentation

<p class="subtitle">A comprehensive TypeScript framework for building financial applications</p>

---

## The 3-Layer Architecture

**Monetra** is a zero-dependency TypeScript framework designed for **financial correctness and completeness**. It provides everything you need to build financially accurate applications—from precise money handling to transaction ledgers, from loan calculations to currency conversion.

Unlike simple money libraries that only handle basic arithmetic, Monetra is a complete framework that addresses the full spectrum of financial operations in modern applications. It handles monetary values using integer arithmetic (storing amounts in minor units like cents) to eliminate floating-point precision errors that plague traditional number-based approaches.

### [Layer 1: Core (Precision)](core/money.md)
The foundation of the framework. It handles the low-level mechanics of safe value storage.
- **[Money Object](core/money.md)**: Immutable, infinite-precision value handling.
- **[Currency Registry](core/currency.md)**: ISO 4217 & Custom Token definitions.
- **Allocation**: Mathematically perfect splitting of funds.

### [Layer 2: Logic (Intelligence)](logic/financial.md)
The application layer that processes value. It implements standard financial formulas verified against established standards.
- **[Financial Math](logic/financial.md)**: Loan Amortization, NPV, IRR, PMT.
- **Interest Engine**: Compound vs Simple interest, Day Counting conventions.
- **Depreciation**: Asset lifecycle tracking.

### [Layer 3: Audit (Compliance)](audit/ledger.md)
The persistence layer that ensures accountability.
- **[Immutable Ledger](audit/ledger.md)**: Trusted Append-Only Logs.
- **Verification**: Cryptographic Hashing (SHA-256) of transaction chains.
- **Governance**: Strict Double-Entry constraints.

---

## Getting Started

Monetra is architected as a **complete financial framework**, not just a money library. It addresses the entire lifecycle of financial data in your application.

| Challenge             | Traditional Libraries         | Monetra Framework                          |
| --------------------- | ----------------------------- | ------------------------------------------ |
| Floating-point errors | `0.1 + 0.2 !== 0.3`           | Integer-based arithmetic with BigInt       |
| Currency mixing       | Silent bugs                   | Type-safe currency enforcement             |
| Rounding mistakes     | Ad-hoc rounding               | Explicit rounding strategies               |
| Audit trails          | Custom implementations        | Built-in ledger with hash chain integrity  |
| Crypto precision      | Limited to ~15 digits         | Up to 18 decimal places                    |
| Financial calcs       | External dependencies         | Integrated financial mathematics           |
| Multi-currency        | Manual conversion logic       | Built-in converter with rate management    |
| Transaction tracking  | Build from scratch            | Append-only ledger with verification       |

---

## Framework Architecture

Monetra is organized into modular components that work together seamlessly:

### Core Money Module
Integer-based money handling with ISO 4217 currency support, custom tokens, and allocation algorithms.

### Financial Mathematics Module
Compound interest, loan amortization, NPV, IRR, depreciation, and bond calculations—all precision-tested.

### Ledger Module
Append-only transaction log with cryptographic hash chains, double-entry bookkeeping, and async operations.

### Currency Conversion Module
Exchange rate management with historical lookups and type-safe multi-currency operations.

### Format & Parse Module
Locale-aware formatting and parsing with customizable templates and symbol positioning.

1.  **[Installation & Setup](getting-started.md)** - Add Monetra to your project.
2.  **[Core Concepts](core-concepts.md)** - Understand `BigInt`, Minor Units, and Rounding.
3.  **[Guides](guides/allocation.md)** - Learn common patterns like Splitting and Formatting.

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

## Framework in Action

See how Monetra's integrated components work together in a real-world scenario:

```typescript
import { money, Money, Ledger, futureValue, RoundingMode } from "monetra";

// ===== Money Operations =====
// Create money with automatic precision
const price = money("99.99", "USD");
const quantity = 3;
const total = price.multiply(quantity);
console.log(total.format()); // "$299.97"

// Split bills without losing cents
const bill = money("100.00", "USD");
const shares = bill.split(3);
// [$33.34, $33.33, $33.33] - no cents lost!

// ===== Financial Calculations =====
// Calculate investment growth with compound interest
const principal = money("10000", "USD");
const future = futureValue(principal, {
  rate: 0.07, // 7% annual
  years: 10,
  compoundingPerYear: 12,
});
console.log(future.format()); // "$20,096.61"

// ===== Transaction Ledger =====
// Track transactions with cryptographic audit trail
const ledger = new Ledger("USD");

// Record transactions with metadata
await ledger.record(money("1000", "USD"), {
  type: "credit",
  description: "Initial deposit",
  account: "savings"
});

await ledger.record(money("-50", "USD"), {
  type: "debit",
  description: "Coffee subscription",
  account: "savings"
});

// Check balance and verify integrity
console.log(ledger.getBalance("savings").format()); // "$950.00"
console.log(ledger.verify()); // true - hash chain verified
```

---

## Use Cases

Monetra is designed for applications that require financial precision and auditability:

- **E-commerce & Retail** - Shopping carts, pricing engines, tax calculations, discount allocation
- **Banking & FinTech** - Account management, transaction processing, interest calculations, fee structures
- **Accounting Software** - General ledgers, reconciliation, financial reporting, audit trails
- **Cryptocurrency Wallets** - Token balances, transaction history, multi-asset portfolios
- **SaaS & Subscription Services** - Billing systems, usage tracking, revenue recognition, proration
- **Investment Platforms** - Portfolio tracking, return calculations, tax lot accounting, performance reporting
- **Point of Sale Systems** - Transaction processing, till reconciliation, refund handling
- **Payment Processing** - Payment splitting, merchant payouts, fee calculations

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

### Performance

- [Benchmarks & Metrics](./performance.md)

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
