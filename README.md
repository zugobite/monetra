# Monetra

A TypeScript library for handling monetary values with precision.

[![CI](https://github.com/zugobite/monetra/actions/workflows/ci.yml/badge.svg)](https://github.com/zugobite/monetra/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/monetra.svg)](https://www.npmjs.com/package/monetra)
[![npm downloads](https://img.shields.io/npm/dm/monetra.svg)](https://www.npmjs.com/package/monetra)
[![codecov](https://codecov.io/gh/zugobite/monetra/branch/main/graph/badge.svg)](https://codecov.io/gh/zugobite/monetra)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen.svg)]()

---as

## Overview

Monetra is a zero-dependency TypeScript library that handles monetary values using integer arithmetic. By storing amounts in minor units (cents, satoshis, wei) as `BigInt`, it avoids the floating-point precision errors inherent in JavaScript's `number` type.

```typescript
// JavaScript floating-point issue
0.1 + 0.2 === 0.3; // false (0.30000000000000004)

// Monetra
import { money } from "monetra";
money("0.10", "USD").add("0.20").equals(money("0.30", "USD")); // true
```

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

## Features

- **Integer-based storage** - All values stored as `BigInt` in minor units
- **Explicit rounding** - Six rounding modes (HALF_UP, HALF_DOWN, HALF_EVEN, FLOOR, CEIL, TRUNCATE)
- **Currency support** - ISO 4217 currencies with automatic precision handling
- **Custom tokens** - Define cryptocurrencies and tokens with up to 18 decimal places
- **Allocation** - Split amounts without losing cents
- **Financial calculations** - Compound interest, loan amortization, NPV, IRR
- **Ledger** - Append-only transaction log with hash chain verification
- **Currency conversion** - Rate management with historical lookups
- **Multi-currency** - MoneyBag for aggregating different currencies
- **Immutable** - All operations return new instances
- **Type-safe** - Full TypeScript support with strict types

---

## Quick Start

### Basic Usage

```typescript
import { money, Money, RoundingMode } from "monetra";

// Create money from string (major units)
const price = money("19.99", "USD");

// Create from minor units (cents)
const tax = Money.fromMinor(199, "USD");

// Arithmetic
const subtotal = price.add(tax);
const total = subtotal.multiply(2);

// Formatting
console.log(total.format()); // "$43.96"
console.log(total.format({ locale: "de-DE" })); // "43,96 $"
```

### Allocation

Split money without losing cents:

```typescript
const bill = money("100.00", "USD");
const shares = bill.split(3);
// [money("33.34"), money("33.33"), money("33.33")]

// Verify sum equals original
shares.reduce((a, b) => a.add(b)).equals(bill); // true
```

### Rounding

Operations that produce fractional minor units require explicit rounding:

```typescript
const price = money("100.00", "USD");

// Division requires rounding mode
const third = price.divide(3, { rounding: RoundingMode.HALF_UP });
console.log(third.format()); // "$33.33"

// Or use allocate for lossless division
const parts = price.allocate([1, 1, 1]);
// ["$33.34", "$33.33", "$33.33"]
```

### Custom Tokens

Define cryptocurrencies or custom tokens:

```typescript
import { defineToken, money } from "monetra";

const USDC = defineToken({
  code: "USDC",
  symbol: "USDC",
  decimals: 6,
  type: "crypto",
});

const balance = money("1000.50", USDC);
console.log(balance.format()); // "1,000.50 USDC"
```

### Financial Calculations

```typescript
import { money, futureValue, pmt, loan } from "monetra";

// Future value of investment
const principal = money("10000", "USD");
const future = futureValue(principal, {
  rate: 0.07,
  years: 10,
  compoundingPerYear: 12,
});
console.log(future.format()); // "$20,096.61"

// Monthly loan payment
const payment = pmt({
  principal: money("200000", "USD"),
  annualRate: 0.065,
  years: 30,
});
console.log(payment.format()); // "$1,264.14"
```

### Ledger

Track transactions with verification:

```typescript
import { Ledger, money } from "monetra";

const ledger = new Ledger("USD");

ledger.credit("account", money("1000.00", "USD"), "Deposit");
ledger.debit("account", money("50.00", "USD"), "Purchase");

console.log(ledger.getBalance("account").format()); // "$950.00"
console.log(ledger.verify()); // true
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

- [Installation & Setup](docs/getting-started.md)
- [Core Concepts](docs/core-concepts.md)

**API Reference**

- [Money](docs/api/money.md) - Core monetary value class
- [Ledger](docs/api/ledger.md) - Transaction log with verification
- [Financial](docs/api/financial.md) - Financial calculations
- [Currency & Tokens](docs/api/currency.md) - Currency and token definitions

**Guides**

- [Allocation & Splitting](docs/guides/allocation.md)
- [Formatting & Parsing](docs/guides/formatting.md)
- [Custom Tokens](docs/guides/custom-tokens.md)
- [Error Handling](docs/guides/error-handling.md)

**Framework Examples**

- [React.js](docs/examples/react.md)
- [Vue.js](docs/examples/vue.md)
- [Node.js](docs/examples/node.md)

**Reference**

- [Best Practices](docs/best-practices.md)
- [Library Comparison](docs/comparison.md)

---

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
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
