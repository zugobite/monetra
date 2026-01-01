# Feature Guide

This guide provides an in-depth look at the core features of **Monetra** and how to use them effectively in your applications.

## 1. Safe Integer Arithmetic

Monetra uses `BigInt` internally to represent all monetary values in their minor units (e.g., cents). This ensures that you never encounter floating-point errors like `0.1 + 0.2 = 0.30000000000000004`.

### Basic Operations

Addition and subtraction are straightforward but strict. You cannot operate on Money objects of different currencies.

```typescript
import { Money, USD } from 'monetra';

const price = Money.fromMajor('19.99', USD);
const shipping = Money.fromMajor('5.00', USD);

const total = price.add(shipping); // $24.99
const discount = total.subtract(Money.fromMajor('2.00', USD)); // $22.99
```

### Error Handling

If you try to add or subtract different currencies, Monetra will throw a `CurrencyMismatchError`.

```typescript
import { Money, USD, EUR } from 'monetra';

const dollars = Money.fromMajor('10.00', USD);
const euros = Money.fromMajor('10.00', EUR);

try {
  dollars.add(euros); // Throws CurrencyMismatchError
} catch (e) {
  console.error(e.message); // "Currency mismatch: expected USD, got EUR"
}
```

## 2. Multiplication & Explicit Rounding

Multiplication often results in fractional minor units (e.g., calculating 15% tax on $1.00 results in 15 cents, but 15% on $0.10 results in 1.5 cents). Monetra forces you to define how to handle these fractions.

### Rounding Modes

We support several rounding strategies via the `RoundingMode` enum:

- **HALF_UP**: Standard rounding (rounds 0.5 up).
- **HALF_DOWN**: Rounds 0.5 down.
- **HALF_EVEN**: Banker's rounding (rounds 0.5 to the nearest even number).
- **FLOOR**: Always rounds down.
- **CEIL**: Always rounds up.

### Example: Tax Calculation

```typescript
import { Money, USD, RoundingMode } from 'monetra';

const price = Money.fromMajor('10.25', USD); // 1025 cents
const taxRate = 0.0825; // 8.25%

// 1025 * 0.0825 = 84.5625 cents
// We must decide how to round this.

const tax = price.multiply(taxRate, { rounding: RoundingMode.HALF_UP });
// 84.5625 -> 85 cents -> $0.85
```

If the result is an exact integer, rounding is not required.

```typescript
const price = Money.fromMajor('10.00', USD);
const quantity = 2;
const total = price.multiply(quantity); // $20.00 (No rounding needed)
```

## 3. Allocation (Splitting Money)

Dividing money is tricky. If you split $100.00 among 3 people, you get $33.3333...
Monetra's `allocate` method ensures that not a single cent is lost or created. It distributes the remainder to the first recipients.

### Example: Splitting a Bill

```typescript
import { Money, USD } from 'monetra';

const bill = Money.fromMajor('100.00', USD);
const [personA, personB, personC] = bill.allocate([1, 1, 1]);

console.log(personA.format()); // "$33.34"
console.log(personB.format()); // "$33.33"
console.log(personC.format()); // "$33.33"

// Total is exactly $100.00
```

### Example: Prorated Payments

You can also allocate by unequal ratios.

```typescript
const profit = Money.fromMajor('1000.00', USD);
// Split 70% / 30%
const [owner, partner] = profit.allocate([70, 30]);

console.log(owner.format());   // "$700.00"
console.log(partner.format()); // "$300.00"
```

## 4. Formatting & Parsing

Monetra leverages the standard `Intl.NumberFormat` API for robust, locale-aware formatting.

### Parsing

Always use `Money.fromMajor` for user input (strings) and `Money.fromMinor` for database values (integers).

```typescript
// Safe parsing
const m1 = Money.fromMajor('1,234.56', USD); // Error! No commas allowed in parsing for safety.
const m2 = Money.fromMajor('1234.56', USD);  // OK
```

### Formatting

You can format money for any locale, regardless of the currency.

```typescript
const m = Money.fromMajor('1234.56', USD);

// Default (uses currency's default locale, en-US for USD)
console.log(m.format()); // "$1,234.56"

// German locale (uses comma for decimals)
console.log(m.format({ locale: 'de-DE' })); // "1.234,56 $"
```

## 5. Comparison

Money objects are immutable and compared by value.

```typescript
const a = Money.fromMajor('10.00', USD);
const b = Money.fromMajor('10.00', USD);
const c = Money.fromMajor('20.00', USD);

console.log(a.equals(b));      // true
console.log(a.lessThan(c));    // true
console.log(c.greaterThan(a)); // true
console.log(a.isZero());       // false
```
