![Monetra](./monetra.png)

# Monetra

The TypeScript framework for fintech. Build production-ready financial applications with precision, auditability, and compliance built-in.

[![CI](https://github.com/zugobite/monetra/actions/workflows/ci.yml/badge.svg)](https://github.com/zugobite/monetra/actions/workflows/ci.yml)
[![Test Coverage](https://img.shields.io/badge/Coverage-99.87%25-brightgreen)](coverage/index.html)
[![Mutation Score](https://img.shields.io/badge/Mutation_Score-92.09%25-brightgreen)](reports/mutation/mutation.html)
[![Mathematically Verified](https://img.shields.io/badge/Verified-Property--Based_Tests-purple.svg)](tests/property-based.test.ts)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen.svg)]()

### Package Information

[![npm version](https://img.shields.io/npm/v/monetra.svg)](https://www.npmjs.com/package/monetra)
[![npm downloads](https://img.shields.io/npm/dm/monetra.svg)](https://www.npmjs.com/package/monetra)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Stability](https://img.shields.io/badge/stability-stable-brightgreen.svg)](https://github.com/zugobite/monetra)

---

## Why Fintech Teams Choose Monetra

**🎯 Built for SMB Fintech** — Invoice systems, payment processing, expense tracking, and subscription billing with ready-to-use templates.

**📊 True Double-Entry Bookkeeping** — GAAP-compliant ledger with journal entries, trial balance, and chart of accounts templates for SaaS, e-commerce, and small business.

**🔐 Audit-Ready by Default** — SHA-256 hash chain verification on every transaction. Immutable entries with void/reversal patterns. Your auditors will thank you.

**💰 BigInt Precision** — No floating-point surprises. Ever. Store values in minor units with up to 18 decimal places for crypto.

**📦 Zero Dependencies** — No supply chain risks. No transitive vulnerabilities. Just TypeScript.

```typescript
import { DoubleEntryLedger, ChartOfAccountsTemplates, Money } from "monetra";

// Set up GAAP-compliant books in 3 lines
const ledger = new DoubleEntryLedger("USD");
ledger.createAccounts(ChartOfAccountsTemplates.smallBusiness("USD"));

// Record a sale with proper accounting
ledger.post({
  lines: [
    { accountId: "cash", amount: Money.fromMajor("500", "USD"), type: "debit" },
    { accountId: "sales-revenue", amount: Money.fromMajor("500", "USD"), type: "credit" },
  ],
  metadata: { description: "Invoice #1001", reference: "INV-1001" },
});

// Verify your books balance
console.log(ledger.getTrialBalance().isBalanced); // true
```

---

## Overview

Monetra is a **zero-dependency TypeScript framework** that provides everything you need to build financially accurate applications. From precise money handling to transaction ledgers, from loan calculations to currency conversion - Monetra offers a complete, integrated solution.

**Built for financial correctness:** By storing amounts in minor units (cents, satoshis, wei) as `BigInt`, Monetra eliminates floating-point precision errors that plague traditional approaches.

While other libraries rely on floating-point math or simple wrappers, Monetra provides a full stack architecture for the **lifecycle of value**: from safe storage and precise allocation to complex financial modeling and immutable audit logging.

It bridges the gap between simple e-commerce math and complex ledger systems, offering a unified, type-safe environment for building:

- **Neobanks & Digital Wallets**
- **Billing & Invoicing Engines**
- **Loan & Mortgage Calculators**
- **Double-Entry Ledgers**

### The Monetra Stack

Monetra is architected in three distinct layers to ensure separation of concerns while maintaining type safety across your entire financial domain.

#### Layer 1: The Core (Precision & Safety)

- **`Money`**: Immutable, integer-based monetary value object using `BigInt` to prevent the [`0.1 + 0.2` problem](https://0.30000000000000004.com/).
- **`Currency`**: ISO 4217 compliance out of the box, with support for custom tokens (crypto/loyalty points).
- **`Allocation`**: GAAP-compliant splitting algorithms (Distribute value without losing cents).

#### Layer 2: The Logic (Business Intelligence)

- **`Financial`**: Standardized implementation of TVM (Time Value of Money) formulas like `PMT`, `NPV`, `IRR`, and `Loan Amortization`.
- **`Interest`**: Exact calculation of Compound vs. Simple interest with day-count conventions.
- **`Depreciation`**: Asset lifecycle management (Straight-line, Declining balance).

#### Layer 3: The Audit (Compliance & Verification)

- **`Ledger`**: Simple append-only transaction log with hash chain verification.
- **`DoubleEntryLedger`**: Full GAAP-compliant double-entry bookkeeping with accounts, journal entries, and trial balance.
- **`Account`**: Asset, liability, equity, revenue, and expense accounts with natural balance sides.
- **`ChartOfAccountsTemplates`**: Ready-made templates for small business, e-commerce, and SaaS.
- **`Verification`**: Cryptographic hashing of transaction chains to detect data tampering.

---

## Installation

```bash
pnpm add monetra
```

**Requirements:** Node.js 18+ or modern browsers with BigInt support.

---

## Why Monetra?

Monetra is more than a money library - it's a complete financial framework designed to handle the full spectrum of monetary operations in modern applications.

### Framework Capabilities

**Core Money Operations**

- Integer-based storage (BigInt) eliminates floating-point errors
- ISO 4217 currency support with automatic precision handling
- Custom token definitions for cryptocurrencies (up to 18 decimals)
- Explicit rounding strategies (6 modes: HALF_UP, HALF_DOWN, HALF_EVEN, FLOOR, CEIL, TRUNCATE)
- Immutable API-all operations return new instances

**Financial Mathematics**

- Compound interest calculations with flexible compounding periods
- Loan amortization schedules and payment calculations
- Present/future value computations
- Net Present Value (NPV) and Internal Rate of Return (IRR)
- Depreciation methods (straight-line, declining balance)
- Bond yield calculations and leverage metrics

**Transaction Ledger System**

- Append-only transaction log with hash chain verification
- Double-entry bookkeeping support
- Auditable history with cryptographic integrity
- Account balance tracking and reconciliation
- Async transaction processing with event handling

**Currency Management**

- Multi-currency support with type-safe operations
- Currency conversion with rate management
- Historical exchange rate lookups
- MoneyBag for aggregating different currencies
- Mix-currency operation protection

**Developer Experience**

- Zero runtime dependencies - no supply chain risks
- Full TypeScript support with strict types
- Comprehensive error handling with custom error classes
- Extensive test coverage (>95%) and mutation testing
- Tree-shakeable modular exports
- Framework integrations (React, Vue, Node.js)

---

## Use Cases

Monetra is built for applications that require financial precision:

- **Invoice & Billing Systems** - Create, send, and track invoices with proper revenue recognition
- **Payment Processing** - Stripe/PayPal integration with fee tracking and reconciliation
- **Expense Management** - Employee expense reports with approval workflows
- **Subscription Billing** - SaaS recurring payments with deferred revenue handling
- **E-commerce Platforms** - Shopping carts, pricing, tax calculations, multi-currency
- **Accounting Software** - Ledgers, reconciliation, trial balance, financial reporting
- **Cryptocurrency Apps** - Wallet balances, token transfers, DeFi calculations (18 decimals)
- **Banking & Neobanks** - Account management, transactions, interest calculations
- **Investment Platforms** - Portfolio tracking, return calculations, tax reporting

### Coming from Dinero.js?

Check out our [Migration Guide](docs/guides/migration-dinero.md) for a smooth transition.

---

## Quick Start: The Framework in Action

### 1. The Core: Safe Money Handling

Stop worrying about floating-point errors.

```typescript
import { money, Money } from "monetra";

// Safe integer math
const price = money("19.99", "USD");
const tax = Money.fromMinor(199, "USD"); // 199 cents
const total = price.add(tax);

console.log(total.format()); // "$21.98"
```

### 2. The Logic: Build a Loan Calculator

Implement complex financial products without external formulas.

```typescript
import { money, pmt, loan } from "monetra";

// Calculate monthly mortgage payment
const payment = pmt({
  principal: money("250000", "USD"), // $250k Loan
  annualRate: 0.055, // 5.5% APR
  years: 30,
});
// result: "$1,419.47"

// Generate the full amortization schedule
const schedule = loan({
  principal: money("250000", "USD"),
  rate: 0.055,
  periods: 360, // 30 years * 12 months
});

console.log(`Total Interest: ${schedule.totalInterest.format()}`);
```

### 3. The Audit: Double-Entry Bookkeeping

Real accounting with balanced entries.

```typescript
import { DoubleEntryLedger, ChartOfAccountsTemplates, Money } from "monetra";

// Initialize with SMB chart of accounts
const ledger = new DoubleEntryLedger("USD");
ledger.createAccounts(ChartOfAccountsTemplates.smallBusiness("USD"));

// Record a sale (debit AR, credit Revenue)
ledger.post({
  lines: [
    { accountId: "accounts-receivable", amount: Money.fromMajor("1000", "USD"), type: "debit" },
    { accountId: "sales-revenue", amount: Money.fromMajor("1000", "USD"), type: "credit" },
  ],
  metadata: { description: "Invoice #1001", reference: "INV-1001" },
});

// Receive payment (debit Cash, credit AR)
ledger.post({
  lines: [
    { accountId: "cash", amount: Money.fromMajor("1000", "USD"), type: "debit" },
    { accountId: "accounts-receivable", amount: Money.fromMajor("1000", "USD"), type: "credit" },
  ],
  metadata: { description: "Payment for INV-1001" },
});

// Generate trial balance
const tb = ledger.getTrialBalance();
console.log(`Balanced: ${tb.isBalanced}`); // true

// Verify ledger integrity (SHA-256 hash chain)
console.log(`Integrity: ${ledger.verify()}`); // true
```

---

## Documentation

Full documentation is available in the [docs](docs/index.md) directory:

**Getting Started**

- [Core Concepts](docs/core-concepts.md)
- [Installation & Setup](docs/getting-started.md)

**The Framework API**

- [Layer 1: Money & Currency](docs/core/money.md)
- [Layer 2: Financial Math](docs/logic/financial.md)
- [Layer 3: Double-Entry Ledger](docs/audit/double-entry.md)
- [Layer 3: Simple Ledger](docs/audit/ledger.md)

**Guides & Best Practices**

- [Precise Allocation (Splitting)](docs/guides/allocation.md)
- [Handling Custom Tokens](docs/guides/custom-tokens.md)
- [Error Handling Strategies](docs/guides/error-handling.md)
- [Migrating from Dinero.js](docs/guides/migration-dinero.md)
- [SMB Integration Examples](docs/examples/smb.md)
- [Framework Examples (React, Vue, Node)](docs/examples/node.md)

---

## Testing & Support

```bash
# Run the test suite
pnpm test

# Run property-based verification
pnpm test:property

# Run coverage report
pnpm test:coverage

# Run mutation testing
pnpm test:mutation
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Check our [Project Roadmap](https://github.com/users/zugobite/projects/2) to see what we're working on.

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## Security

Report security vulnerabilities according to our [Security Policy](SECURITY.md).

---

## License

MIT - see [LICENSE](LICENSE) for details.
