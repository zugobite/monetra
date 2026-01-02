# Monetra

**Monetra** is a currency-aware, integer-based money engine designed for financial correctness. It explicitly avoids floating-point arithmetic and enforces strict monetary invariants.

It is intended for use in wallet-based financial systems where correctness is paramount.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue.svg)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

## Features

- ❌ **No floating-point arithmetic**: All values are stored in minor units (BigInt).
- ❌ **No silent rounding**: Rounding must be explicit.
- ❌ **No implicit currency conversion**: Operations between different currencies throw errors.
- ✅ **Immutable**: All operations return new objects.
- ✅ **Locale-aware formatting**: Built on `Intl` standards.
- ✅ **Allocation Engine**: Deterministic splitting of funds (e.g., 33% / 33% / 34%).
- ✅ **Smart Syntax**: Intuitive API that accepts numbers and strings directly.
- ✅ **Multi-Currency Wallets**: Built-in `MoneyBag` for managing portfolios.
- ✅ **Currency Conversion**: Robust `Converter` with exchange rate support.
- ✅ **Financial Primitives**: Helpers for tax, discounts, and splitting.
- ✅ **Ledger System**: Immutable, cryptographically verifiable transaction history.
- ✅ **Financial Math**: Standard formulas for loans (PMT), TVM (FV/PV), and Investment (NPV/IRR).
- ✅ **Crypto & Tokens**: Support for high-precision tokens (18 decimals) and custom currencies.

## Table of Contents

- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Usage Examples](#usage-examples)
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

## Documentation

For more detailed information, please refer to the documentation in the `docs` folder:

1. [Core Concepts](docs/001-CORE-CONCEPTS.md)
2. [Ledger System](docs/002-LEDGER-SYSTEM.md)
3. [Financial Math](docs/003-FINANCIAL-MATH.md)
4. [Tokens & Crypto](docs/004-TOKENS-AND-CRYPTO.md)
5. [API Reference](docs/005-API-REFERENCE.md)

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
