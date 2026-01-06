# Monetra

The Financial Integrity Framework for TypeScript.

### Security & Correctness

[![CI](https://github.com/zugobite/monetra/actions/workflows/ci.yml/badge.svg)](https://github.com/zugobite/monetra/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/zugobite/monetra/branch/main/graph/badge.svg)](https://codecov.io/gh/zugobite/monetra)
[![Test Coverage](https://img.shields.io/badge/Coverage-97.76%25-brightgreen)](coverage/index.html)
[![Mutation Score](https://img.shields.io/badge/Mutation_Score-89.16%25-green)](reports/mutation/mutation.html)
[![Mathematically Verified](https://img.shields.io/badge/Verified-Property--Based_Tests-purple.svg)](tests/property-based.test.ts)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen.svg)]()

### Package Information

[![npm version](https://img.shields.io/npm/v/monetra.svg)](https://www.npmjs.com/package/monetra)
[![npm downloads](https://img.shields.io/npm/dm/monetra.svg)](https://www.npmjs.com/package/monetra)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Stability](https://img.shields.io/badge/stability-stable-green.svg)](https://github.com/zugobite/monetra)

---

## Overview

**Monetra is not just a money library.** It is a cohesive financial development framework designed for robust fintech applications.

While other libraries rely on floating-point math or simple wrappers, Monetra provides a full-stack architecture for the **lifecycle of value**: from safe storage and precise allocation to complex financial modeling and immutable audit logging.

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

- **`Ledger`**: Append-only, double-entry accounting system.
- **`Verification`**: Cryptographic hashing of transaction chains to detect data tampering.
- **`Enforcement`**: Strict rules for credit/debit operations to ensure books always balance.

---

## Installation

```bash
npm install monetra
```

```bash
yarn add monetra
```

```bash
pnpm add monetra
```

**Requirements:** Node.js 18+ or modern browsers with BigInt support.

---

## Why Choose Monetra?

### Compliance by Default

Every design choice in Monetra favors correctness over convenience. We force explicit rounding modes, forbid unsafe float coercion, and strictly type all operation results.

### Mathematically Verified

Monetra is battle-tested using **Property-Based Testing** (via `fast-check`). We don't just test `1 + 1 = 2`; we test thousands of random permutations to prove that our algebraic properties (associativity, commutativity, distributivity) hold true for _all_ inputs.

### Zero-Dependency Security

Financial code is a high-risk target for supply chain attacks. Monetra has **zero dependencies**, significantly reducing your attack surface.

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

### 3. The Audit: Immutable Ledger

Record the transaction and verify integrity.

```typescript
import { Ledger, money } from "monetra";

// Initialize a ledger for USD
const bankLedger = new Ledger("USD");

// Record a transaction
bankLedger.record({
  description: "Mortgage Payment - Jan",
  entries: [
    { account: "user_wallet", credit: money("1419.47", "USD") },
    { account: "bank_receivables", debit: money("1419.47", "USD") },
  ],
});

// Verify the cryptographic chain
const isClean = bankLedger.verify(); // true
```

---

## API Summary

### Money Class

| Method                              | Description                          |
| ----------------------------------- | ------------------------------------ |
| `money(amount, currency)`           | Create Money from string or number   |
| `Money.fromMinor(cents, currency)`  | Create from minor units              |
| `Money.fromMajor(amount, currency)` | Create from major units (string)     |
| `Money.zero(currency)`              | Create zero amount                   |
| `.add(other)`                       | Add two Money values                 |
| `.subtract(other)`                  | Subtract Money values                |
| `.multiply(factor, options?)`       | Multiply by scalar                   |
| `.divide(divisor, options)`         | Divide by scalar (requires rounding) |
| `.percentage(percent, rounding?)`   | Calculate percentage                 |
| `.split(n)`                         | Split into n equal parts             |
| `.allocate(ratios)`                 | Allocate by ratios                   |
| `.format(options?)`                 | Format for display                   |
| `.equals(other)`                    | Check equality                       |
| `.lessThan(other)`                  | Compare values                       |
| `.greaterThan(other)`               | Compare values                       |
| `.isPositive()`                     | Check if positive                    |
| `.isNegative()`                     | Check if negative                    |
| `.isZero()`                         | Check if zero                        |

### Financial Functions

| Function                                  | Description                                   |
| ----------------------------------------- | --------------------------------------------- |
| `futureValue(principal, options)`         | Calculate future value with compound interest |
| `presentValue(futureAmount, options)`     | Calculate present value                       |
| `pmt(options)`                            | Calculate loan payment amount                 |
| `loan(options)`                           | Generate amortization schedule                |
| `npv(initialInvestment, cashFlows, rate)` | Net present value                             |
| `irr(initialInvestment, cashFlows)`       | Internal rate of return                       |

### Classes

| Class       | Description                                   |
| ----------- | --------------------------------------------- |
| `Ledger`    | Append-only transaction log with verification |
| `Converter` | Currency conversion with rate management      |
| `MoneyBag`  | Multi-currency aggregation                    |

---

## Documentation

Full documentation is available in the [docs](docs/index.md) directory:

**Getting Started**

- [Core Concepts](docs/core-concepts.md)
- [Installation & Setup](docs/getting-started.md)

**The Framework API**

- [Layer 1: Money & Currency](docs/core/money.md)
- [Layer 2: Financial Math](docs/logic/financial.md)
- [Layer 3: Ledger & Audit](docs/audit/ledger.md)

**Guides & Best Practices**

- [Precise Allocation (Splitting)](docs/guides/allocation.md)
- [Handling Custom Tokens](docs/guides/custom-tokens.md)
- [Error Handling Strategies](docs/guides/error-handling.md)
- [Integration Examples (React, Vue, Node)](docs/examples/node.md)

---

## Testing & Support

```bash
# Run the test suite
pnpm test

# Run property-based verification
pnpm test:property
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
