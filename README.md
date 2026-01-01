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

## Table of Contents

- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Usage Examples](#usage-examples)
- [Documentation](#documentation)
- [Testing](#testing)
- [Contributing](#contributing)
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
import { Money, USD, RoundingMode } from "monetra";

// Create money from major units (e.g., "10.50")
const price = Money.fromMajor("10.50", USD);

// Create money from minor units (e.g., 100 cents)
const tax = Money.fromMinor(100, USD); // $1.00

// Arithmetic
const total = price.add(tax); // $11.50

// Formatting
console.log(total.format()); // "$11.50"
console.log(total.format({ locale: "de-DE" })); // "11,50 $"

// Multiplication with explicit rounding
const discount = total.multiply(0.15, { rounding: RoundingMode.HALF_UP });
const finalPrice = total.subtract(discount);
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

- [API Reference](docs/001-API-REFERENCE.md)
- [Feature Guide](docs/002-FEATURE-GUIDE.md)

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
