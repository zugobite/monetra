# Core Concepts

Understanding the fundamental principles behind Monetra will help you use it effectively and avoid common pitfalls when working with monetary values.

---

## Table of Contents

- [Integer-Based Arithmetic](#integer-arithmetic)
- [Minor Units](#minor-units)
- [Currency & Precision](#currency-precision)
- [Immutability](#immutability)
- [Rounding Strategies](#rounding)
- [Type Safety](#type-safety)

---

## Integer-Based Arithmetic {#integer-arithmetic}

### The Floating-Point Problem

JavaScript's `number` type uses IEEE 754 floating-point representation, which cannot accurately represent many decimal fractions:

```javascript
// Classic floating-point issues
0.1 + 0.2; // 0.30000000000000004
0.3 - 0.1; // 0.19999999999999998
1.005 * 100; // 100.49999999999999
Math.round(1.005 * 100) / 100; // 1 (should be 1.01)
```

These tiny errors compound in financial applications, leading to:

- Incorrect totals
- Failed reconciliations
- Lost cents over many transactions
- Audit failures

### Monetra's Solution

Monetra stores all monetary values as **integers in minor units** (cents, pence, etc.) using JavaScript's `BigInt`:

```typescript
import { Money } from "monetra";

// Internally stored as 1050n (cents), not 10.50
const amount = Money.fromMajor("10.50", "USD");

console.log(amount.minor); // 1050n (BigInt)

// All arithmetic is integer-based
const a = Money.fromMinor(10, "USD"); // 10 cents
const b = Money.fromMinor(20, "USD"); // 20 cents
const sum = a.add(b);
console.log(sum.minor); // 30n - exact, no floating-point error
```

### Why BigInt?

JavaScript's `number` can only safely represent integers up to `2^53 - 1` (about 9 quadrillion). For high-precision currencies like cryptocurrencies (18 decimals), this is insufficient:

```typescript
// Regular JavaScript numbers lose precision
const unsafeNumber = 9007199254740993; // 2^53 + 1
console.log(unsafeNumber); // 9007199254740992 (wrong!)

// BigInt handles any size
const safeBigInt = 9007199254740993n;
console.log(safeBigInt); // 9007199254740993n (correct!)

// Monetra leverages this for crypto
import { money, ETH } from "monetra";
const balance = money("1.234567890123456789", ETH);
console.log(balance.minor); // 1234567890123456789n (18 decimals preserved)
```

---

## Minor Units {#minor-units}

### What Are Minor Units?

A **minor unit** is the smallest denomination of a currency:

| Currency | Minor Unit | Factor | Example                    |
| -------- | ---------- | ------ | -------------------------- |
| USD      | Cent       | 100    | $10.50 = 1050 cents        |
| EUR      | Cent       | 100    | €10.50 = 1050 cents        |
| JPY      | Yen        | 1      | ¥1050 = 1050 (no decimals) |
| BHD      | Fils       | 1000   | 10.500 BHD = 10500 fils    |
| ETH      | Wei        | 10^18  | 1 ETH = 10^18 wei          |

### Working with Minor Units

```typescript
import { Money } from "monetra";

// Create from minor units (cents)
const fromCents = Money.fromMinor(1050, "USD");

// Create from major units (dollars) - parsed to minor internally
const fromDollars = Money.fromMajor("10.50", "USD");

// Both are identical
console.log(fromCents.equals(fromDollars)); // true
console.log(fromCents.minor); // 1050n
console.log(fromDollars.minor); // 1050n

// Access the major value as a string
console.log(fromCents.format({ symbol: false })); // "10.50"
```

### Different Currency Precisions

```typescript
import { Money } from "monetra";

// USD: 2 decimal places
const usd = Money.fromMajor("10.50", "USD");
console.log(usd.minor); // 1050n (10.50 * 100)

// JPY: 0 decimal places
const jpy = Money.fromMajor("1050", "JPY");
console.log(jpy.minor); // 1050n (no conversion)

// BTC: 8 decimal places
import { BTC } from "monetra";
const btc = Money.fromMajor("0.00100000", BTC);
console.log(btc.minor); // 100000n (0.001 * 10^8)

// ETH: 18 decimal places
import { ETH } from "monetra";
const eth = Money.fromMajor("1.5", ETH);
console.log(eth.minor); // 1500000000000000000n
```

---

## Currency & Precision {#currency-precision}

### Currency Objects

Each currency in Monetra is defined by:

```typescript
interface Currency {
  code: string; // ISO 4217 code (e.g., "USD")
  decimals: number; // Number of decimal places (e.g., 2)
  symbol: string; // Display symbol (e.g., "$")
  locale?: string; // Default locale for formatting
}
```

### Built-in Currencies

Monetra includes all ISO 4217 currencies:

```typescript
import { getCurrency } from "monetra";

const usd = getCurrency("USD");
// { code: 'USD', decimals: 2, symbol: '$', locale: 'en-US' }

const jpy = getCurrency("JPY");
// { code: 'JPY', decimals: 0, symbol: '¥', locale: 'ja-JP' }

const eur = getCurrency("EUR");
// { code: 'EUR', decimals: 2, symbol: '€', locale: 'de-DE' }
```

### Currency Enforcement

Monetra prevents accidental mixing of currencies:

```typescript
import { money } from "monetra";

const usd = money("100", "USD");
const eur = money("100", "EUR");

try {
  usd.add(eur); // Throws CurrencyMismatchError!
} catch (error) {
  console.log(error.message);
  // "Currency mismatch: cannot operate on USD and EUR"
}
```

### Precision Validation

Monetra validates that input doesn't exceed currency precision:

```typescript
import { Money } from "monetra";

// Valid: USD has 2 decimal places
const valid = Money.fromMajor("10.50", "USD");

// Invalid: Too many decimal places
try {
  Money.fromMajor("10.505", "USD"); // Throws InvalidPrecisionError!
} catch (error) {
  console.log(error.message);
  // "Amount 10.505 has 3 decimal places, but USD only allows 2"
}
```

---

## Immutability {#immutability}

### Value Objects

`Money` objects are **immutable value objects**. Every operation returns a new instance:

```typescript
import { money } from "monetra";

const original = money("100", "USD");
const modified = original.add(money("50", "USD"));

console.log(original.format()); // "$100.00" - unchanged!
console.log(modified.format()); // "$150.00" - new instance
console.log(original === modified); // false
```

### Why Immutability?

1. **Predictability**: No side effects or unexpected mutations
2. **Thread Safety**: Safe to share across async operations
3. **React/Vue Compatibility**: Works naturally with state management
4. **Debugging**: Easy to trace value history
5. **Equality**: Value comparison instead of reference comparison

### Equality Comparison

Because Money is a value object, use `.equals()` for comparison:

```typescript
import { money } from "monetra";

const a = money("100", "USD");
const b = money("100", "USD");
const c = a;

// Reference comparison (avoid for Money)
console.log(a === b); // false (different objects)
console.log(a === c); // true (same reference)

// Value comparison (recommended)
console.log(a.equals(b)); // true (same value)
console.log(a.equals(c)); // true (same value)
```

---

## Rounding Strategies {#rounding}

### When Rounding is Required

Division and multiplication can produce fractional minor units. Monetra requires **explicit rounding** when this happens:

```typescript
import { money, RoundingMode } from "monetra";

const amount = money("100", "USD");

// Division that produces a fraction
try {
  amount.divide(3); // Throws RoundingRequiredError!
} catch (error) {
  console.log(error.message);
  // "Division requires rounding: 10000 / 3 = 3333.333..."
}

// Provide a rounding strategy
const result = amount.divide(3, { rounding: RoundingMode.HALF_UP });
console.log(result.format()); // "$33.33"
```

### Available Rounding Modes

| Mode        | Description                               | 2.5 → | -2.5 → |
| ----------- | ----------------------------------------- | ----- | ------ |
| `HALF_UP`   | Round away from zero if equidistant       | 3     | -3     |
| `HALF_DOWN` | Round towards zero if equidistant         | 2     | -2     |
| `HALF_EVEN` | Round to nearest even (Banker's Rounding) | 2     | -2     |
| `FLOOR`     | Round towards negative infinity           | 2     | -3     |
| `CEIL`      | Round towards positive infinity           | 3     | -2     |
| `TRUNCATE`  | Remove fractional part (towards zero)     | 2     | -2     |

### Choosing the Right Mode

```typescript
import { money, RoundingMode } from "monetra";

const price = money("10.00", "USD");

// HALF_UP: Traditional rounding (common for user-facing amounts)
const taxUp = price.percentage(8.75, RoundingMode.HALF_UP);
console.log(taxUp.format()); // "$0.88"

// HALF_EVEN: Banker's rounding (minimizes cumulative bias)
const taxEven = price.percentage(8.75, RoundingMode.HALF_EVEN);
console.log(taxEven.format()); // "$0.88"

// FLOOR: Always round down (conservative estimates)
const taxFloor = price.percentage(8.75, RoundingMode.FLOOR);
console.log(taxFloor.format()); // "$0.87"

// CEIL: Always round up (fees, ensuring coverage)
const taxCeil = price.percentage(8.75, RoundingMode.CEIL);
console.log(taxCeil.format()); // "$0.88"
```

### Banker's Rounding

`HALF_EVEN` (Banker's Rounding) is recommended for financial calculations that involve many transactions, as it minimizes cumulative rounding bias:

```typescript
import { money, RoundingMode } from "monetra";

// With HALF_UP, 0.5 always rounds up → bias towards larger values
// With HALF_EVEN, 0.5 rounds to nearest even → balanced over many operations

const amounts = ["1.5", "2.5", "3.5", "4.5", "5.5"];

let sumUp = money("0", "USD");
let sumEven = money("0", "USD");

for (const amt of amounts) {
  // Simulating rounding of intermediate calculations
  const m = money(amt, "USD");
  sumUp = sumUp.add(Money.fromMinor(Math.round(Number(m.minor) * 1), "USD"));
  // HALF_EVEN would alternate between rounding up and down for .5 cases
}

// Over millions of transactions, HALF_EVEN produces less bias
```

---

## Type Safety {#type-safety}

### TypeScript Integration

Monetra is written in TypeScript and provides comprehensive type definitions:

```typescript
import { Money, Currency, RoundingMode, money } from "monetra";

// Type inference
const price = money("99.99", "USD"); // Type: Money

// Method chaining is fully typed
const total = price
  .multiply(3)
  .addPercent(8.5, RoundingMode.HALF_UP)
  .subtract(money("10", "USD"));
// Type: Money

// Currency type
function processPayment(amount: Money, currency: Currency): void {
  if (amount.currency.code !== currency.code) {
    throw new Error("Currency mismatch");
  }
  // ...
}

// Rounding mode is type-safe
function calculateTax(amount: Money, rate: number, mode: RoundingMode): Money {
  return amount.percentage(rate, mode);
}
```

### Discriminated Unions for Errors

```typescript
import { money, CurrencyMismatchError, InvalidPrecisionError } from "monetra";

try {
  const result = money("10.505", "USD");
} catch (error) {
  if (error instanceof InvalidPrecisionError) {
    console.log("Precision issue:", error.decimals, "vs", error.maxDecimals);
  } else if (error instanceof CurrencyMismatchError) {
    console.log("Currency issue:", error.expected, "vs", error.received);
  }
}
```

---

## Summary

| Concept                  | Key Point                                                     |
| ------------------------ | ------------------------------------------------------------- |
| **Integer Arithmetic**   | All values stored as BigInt minor units - no floating-point   |
| **Minor Units**          | Smallest currency denomination (cents, wei, etc.)             |
| **Currency Enforcement** | Operations on different currencies throw errors               |
| **Precision Validation** | Input precision must not exceed currency decimals             |
| **Immutability**         | Every operation returns a new Money instance                  |
| **Explicit Rounding**    | Division/multiplication require rounding mode when fractional |
| **Type Safety**          | Full TypeScript support with comprehensive types              |

---

## Next Steps

- **[Money API Reference](./api/money.md)** - Complete API documentation
- **[Allocation & Splitting](./guides/allocation.md)** - Distribute money without losing cents
- **[Rounding Guide](./guides/formatting.md)** - Deep dive into formatting options
