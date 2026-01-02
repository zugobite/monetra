# Monetra

**The money library that makes financial correctness impossible to get wrong.**

Monetra is a TypeScript-first, zero-dependency money engine built for applications where every cent matters. It eliminates floating-point errors, enforces explicit rounding, and provides built-in audit trails—making it ideal for fintech, e-commerce, accounting, and cryptocurrency applications.

[![npm version](https://img.shields.io/npm/v/monetra.svg)](https://www.npmjs.com/package/monetra)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue.svg)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)

## Why Monetra?

```javascript
// ❌ Regular JavaScript
0.1 + 0.2 === 0.3  // false! (0.30000000000000004)

// ✅ Monetra
Money.fromDecimal('0.10', 'USD').add('0.20').equals('0.30')  // true
```

### The Problem

Most programming languages store decimals as floating-point numbers, leading to tiny precision errors that compound over millions of transactions. These errors cause audit failures, reconciliation nightmares, and lost customer trust.

### The Solution

Monetra stores all values as integers (cents, satoshis, wei) using BigInt, eliminating floating-point errors entirely. When rounding is necessary, you explicitly choose how—no hidden surprises.

## Features

| Feature | Description |
|---------|-------------|
| 🔢 **Integer-Based** | All values stored in minor units (BigInt). No floats, ever. |
| 🎯 **Explicit Rounding** | 6 rounding modes. You choose when and how. |
| 🌍 **Multi-Currency** | ISO 4217 currencies + custom tokens + crypto (18 decimals) |
| 📊 **Financial Math** | Loan payments, NPV, IRR, amortization schedules |
| 📝 **Audit Ledger** | Tamper-evident transaction history with SHA-256 hashing |
| 🔄 **Currency Conversion** | Rate management with historical lookups |
| 💼 **Wallet/MoneyBag** | Multi-currency portfolio management |
| ⚡ **Zero Dependencies** | Nothing to audit, nothing to break |
| 🌐 **Runs Everywhere** | Node.js, browsers, serverless, edge functions |

## Table of Contents

- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Usage Examples](#usage-examples)
- [What's New in v2.0](#whats-new-in-v20)
- [Documentation](#documentation)
- [Testing](#testing)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Quick Start

### Installation

```bash
npm install monetra
# or
yarn add monetra
# or
pnpm add monetra
```

### Basic Usage

```typescript
import { money, USD } from "monetra";

// Create money easily
const price = money("10.50", "USD"); // $10.50
const tax = price.percentage(10); // $1.05

// Smart arithmetic
const total = price.add(tax); // $11.55
const discounted = total.subtract("2.00"); // $9.55

console.log(discounted.format()); // "$9.55"
```

## Core Concepts

### Integer-Only Representation

Monetra stores all values in minor units (e.g., cents) using `BigInt`. This avoids the precision errors common with floating-point math.

- `$10.50` is stored as `1050n`.
- `¥100` is stored as `100n`.

### Immutability

Money objects are immutable. Operations like `add` or `multiply` return new instances.

```typescript
const a = Money.fromMajor("10.00", USD);
const b = a.add(Money.fromMajor("5.00", USD));

console.log(a.format()); // "$10.00" (unchanged)
console.log(b.format()); // "$15.00"
```

### Explicit Rounding

Operations that result in fractional minor units (like multiplication) require an explicit rounding mode.

```typescript
const m = Money.fromMajor("10.00", USD);
// m.multiply(0.333); // Throws RoundingRequiredError
m.multiply(0.333, { rounding: RoundingMode.HALF_UP }); // OK
```

## Usage Examples

### Allocation (Splitting Funds)

Split money without losing a cent. Remainders are distributed deterministically using the largest remainder method.

```typescript
const pot = Money.fromMajor("100.00", USD);
const [part1, part2, part3] = pot.allocate([1, 1, 1]);

// part1: $33.34
// part2: $33.33
// part3: $33.33
// Sum: $100.00
```

## What's New in v2.0

### New Money Methods

```typescript
// Convenient aliases
Money.fromCents(1000, 'USD');      // Same as fromMinor
Money.fromDecimal('10.50', 'USD'); // Same as fromMajor

// Clamp between bounds
const clamped = price.clamp(minPrice, maxPrice);

// Raw decimal string (no locale formatting)
const decimal = price.toDecimalString(); // "10.50"

// JSON serialization support
const json = JSON.stringify(money);
const restored = JSON.parse(json, Money.reviver);
```

### TRUNCATE Rounding Mode

```typescript
money.divide(3, { rounding: RoundingMode.TRUNCATE }); // Truncate towards zero
```

### Accounting Format

```typescript
const negative = Money.fromDecimal('-100.00', 'USD');
negative.format({ accounting: true }); // "($100.00)"
```

### Rate Abstraction for Interest Calculations

```typescript
import { Rate } from 'monetra';

const annual = Rate.percent(12);
const monthly = annual.periodic(12);        // 1%
const effective = annual.toEffective(12);   // ~12.68%
```

### Historical Exchange Rates

```typescript
const converter = new Converter('USD', { EUR: 0.92 });
converter.addHistoricalRate('EUR', 0.85, new Date('2024-01-01'));
converter.convert(money, 'EUR', { date: new Date('2024-06-01') });
```

### Error Codes for Programmatic Handling

```typescript
try {
  usd.add(eur);
} catch (error) {
  if (error.code === MonetraErrorCode.CURRENCY_MISMATCH) {
    // Handle programmatically
  }
}
```

### Browser-Compatible Ledger

```typescript
// Async methods for browser environments
const entry = await ledger.recordAsync(money, metadata);
const isValid = await ledger.verifyAsync();
```

📖 **See [Migration Guide](docs/006-MIGRATION-v2.md) for upgrade instructions.**

## Documentation

For detailed information, please refer to the documentation in the `docs` folder:

0. [Introduction (Non-Technical)](docs/000-INTRODUCTION.md) - What is Monetra and who should use it
1. [Core Concepts](docs/001-CORE-CONCEPTS.md) - Fundamental principles and design decisions
2. [Ledger System](docs/002-LEDGER-SYSTEM.md) - Audit trails and transaction history
3. [Financial Math](docs/003-FINANCIAL-MATH.md) - Loans, investments, and time-value-of-money
4. [Tokens & Crypto](docs/004-TOKENS-AND-CRYPTO.md) - Cryptocurrency and custom token support
5. [API Reference](docs/005-API-REFERENCE.md) - Complete API documentation
6. [Migration Guide v2.0](docs/006-MIGRATION-v2.md) - Upgrading from v1.x
7. [Cookbook](docs/007-COOKBOOK.md) - Practical recipes and patterns

## Testing

We maintain 100% test coverage to ensure financial correctness.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

We also have a [Code of Conduct](CODE_OF_CONDUCT.md) that all contributors are expected to follow.

## Security

If you discover a security vulnerability, please review our [Security Policy](SECURITY.md) for instructions on how to report it responsibly.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
