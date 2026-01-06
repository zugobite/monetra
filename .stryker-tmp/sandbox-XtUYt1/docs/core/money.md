# Money API Reference

The `Money` class is the core of Monetra, representing an immutable monetary value in a specific currency.

---

## Table of Contents

- [Creating Money](#creating-money)
  - [money() Helper](#money-helper)
  - [fromMinor()](#frommminor)
  - [fromMajor()](#frommajor)
  - [fromFloat()](#fromfloat)
  - [zero()](#zero)
- [Arithmetic Operations](#arithmetic)
  - [add()](#add)
  - [subtract()](#subtract)
  - [multiply()](#multiply)
  - [divide()](#divide)
  - [percentage()](#percentage)
  - [addPercent()](#addpercent)
  - [subtractPercent()](#subtractpercent)
  - [abs()](#abs)
  - [negate()](#negate)
- [Comparison](#comparison)
  - [equals()](#equals)
  - [compare()](#compare)
  - [greaterThan()](#greaterthan)
  - [lessThan()](#lessthan)
  - [isPositive()](#ispositive)
  - [isNegative()](#isnegative)
  - [isZero()](#iszero)
- [Allocation](#allocation)
  - [split()](#split)
  - [allocate()](#allocate)
- [Static Methods](#static-methods)
  - [Money.min()](#moneymin)
  - [Money.max()](#moneymax)
- [Formatting & Serialization](#formatting)
  - [format()](#format)
  - [toJSON()](#tojson)
- [Properties](#properties)

---

## Creating Money {#creating-money}

### money() Helper {#money-helper}

The recommended way to create Money instances.

```typescript
function money(
  amount: number | bigint | string,
  currency: string | Currency
): Money;
```

**Parameters:**

- `amount` - The monetary amount
  - `string`: Interpreted as major units (e.g., `"10.50"` = $10.50)
  - `number | bigint`: Interpreted as minor units (e.g., `1050` = $10.50)
- `currency` - Currency code (e.g., `"USD"`) or Currency object

**Returns:** A new `Money` instance

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { money } from "monetra";

// From string (major units)
const dollars = money("10.50", "USD"); // $10.50

// From number (minor units - cents)
const cents = money(1050, "USD"); // $10.50

// From bigint (minor units)
const bigAmount = money(100000000000n, "USD"); // $1,000,000,000.00
```

</details>

<details>
<summary><strong>JavaScript (ESM)</strong></summary>

```javascript
import { money } from "monetra";

// From string (major units)
const dollars = money("10.50", "USD"); // $10.50

// From number (minor units - cents)
const cents = money(1050, "USD"); // $10.50

// From bigint (minor units)
const bigAmount = money(100000000000n, "USD"); // $1,000,000,000.00
```

</details>

<details>
<summary><strong>JavaScript (CommonJS)</strong></summary>

```javascript
const { money } = require("monetra");

// From string (major units)
const dollars = money("10.50", "USD"); // $10.50

// From number (minor units - cents)
const cents = money(1050, "USD"); // $10.50
```

</details>

---

### Money.fromMinor() {#fromminor}

Creates a Money instance from minor units (cents, pence, etc.).

```typescript
static fromMinor(minor: bigint | number, currency: Currency | string): Money
```

**Alias:** `Money.fromCents()`

**Parameters:**

- `minor` - Amount in minor units
- `currency` - Currency code or object

**Returns:** A new `Money` instance

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { Money } from "monetra";

const amount = Money.fromMinor(1050, "USD"); // $10.50
const precise = Money.fromMinor(1050n, "USD"); // Same, with BigInt

// For different precisions
const yen = Money.fromMinor(1050, "JPY"); // ¥1,050 (0 decimals)
const dinar = Money.fromMinor(10500, "BHD"); // 10.500 BHD (3 decimals)
```

</details>

<details>
<summary><strong>JavaScript (ESM)</strong></summary>

```javascript
import { Money } from "monetra";

const amount = Money.fromMinor(1050, "USD"); // $10.50
const yen = Money.fromMinor(1050, "JPY"); // ¥1,050
```

</details>

<details>
<summary><strong>JavaScript (CommonJS)</strong></summary>

```javascript
const { Money } = require("monetra");

const amount = Money.fromMinor(1050, "USD"); // $10.50
```

</details>

---

### Money.fromMajor() {#frommajor}

Creates a Money instance from major units (dollars, euros, etc.).

```typescript
static fromMajor(amount: string, currency: Currency | string): Money
```

**Alias:** `Money.fromDecimal()`

**Parameters:**

- `amount` - Amount as a decimal string (e.g., `"10.50"`)
- `currency` - Currency code or object

**Returns:** A new `Money` instance

**Throws:** `InvalidPrecisionError` if decimal places exceed currency precision

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { Money } from "monetra";

const amount = Money.fromMajor("10.50", "USD"); // $10.50
const large = Money.fromMajor("1000000.00", "USD"); // $1,000,000.00

// Precision validation
try {
  Money.fromMajor("10.505", "USD"); // Too many decimals for USD
} catch (e) {
  console.log(e.message); // "Invalid precision"
}
```

</details>

<details>
<summary><strong>JavaScript (ESM)</strong></summary>

```javascript
import { Money } from "monetra";

const amount = Money.fromMajor("10.50", "USD"); // $10.50
const large = Money.fromMajor("1000000.00", "USD"); // $1,000,000.00
```

</details>

<details>
<summary><strong>JavaScript (CommonJS)</strong></summary>

```javascript
const { Money } = require("monetra");

const amount = Money.fromMajor("10.50", "USD");
```

</details>

---

### Money.fromFloat() {#fromfloat}

Creates a Money instance from a floating-point number.

```typescript
static fromFloat(
  amount: number,
  currency: Currency | string,
  options?: {
    rounding?: RoundingMode;
    suppressWarning?: boolean;
  }
): Money
```

**Parameters:**

- `amount` - Floating-point amount in major units
- `currency` - Currency code or object
- `options.rounding` - Rounding mode for conversion (default: rounds to nearest)
- `options.suppressWarning` - Suppress console warning about precision

**Returns:** A new `Money` instance

> **Warning:** Floating-point numbers can have precision issues. Prefer `Money.fromMajor()` with strings for exact values.

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { Money, RoundingMode } from "monetra";

// Use with caution - may have precision issues
const amount = Money.fromFloat(10.5, "USD", {
  suppressWarning: true,
});

// The warning exists because:
const problematic = 0.1 + 0.2; // 0.30000000000000004
// Money.fromFloat rounds to the nearest minor unit
```

</details>

<details>
<summary><strong>JavaScript (ESM)</strong></summary>

```javascript
import { Money } from "monetra";

const amount = Money.fromFloat(10.5, "USD", {
  suppressWarning: true,
});
```

</details>

---

### Money.zero() {#zero}

Creates a zero value for the given currency.

```typescript
static zero(currency: Currency | string): Money
```

**Parameters:**

- `currency` - Currency code or object

**Returns:** A new `Money` instance with zero value

**Examples:**

```typescript
import { Money } from "monetra";

const zero = Money.zero("USD");
console.log(zero.format()); // "$0.00"
console.log(zero.isZero()); // true
console.log(zero.minor); // 0n
```

---

## Arithmetic Operations {#arithmetic}

All arithmetic operations return a **new Money instance** (immutable).

### add() {#add}

Adds another amount to this Money.

```typescript
add(other: Money | number | bigint | string): Money
```

**Parameters:**

- `other` - Amount to add
  - `Money`: Must be same currency
  - `number | bigint`: Treated as minor units
  - `string`: Treated as major units

**Returns:** A new `Money` instance with the sum

**Throws:** `CurrencyMismatchError` if currencies don't match

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { money, Money } from "monetra";

const base = money("100.00", "USD");

// Add Money objects
const sum1 = base.add(money("25.50", "USD")); // $125.50

// Add minor units (number)
const sum2 = base.add(2550); // $125.50

// Add major units (string)
const sum3 = base.add("25.50"); // $125.50

// Chain operations
const total = base.add("10.00").add("20.00").add(500); // $135.00
```

</details>

<details>
<summary><strong>JavaScript (ESM)</strong></summary>

```javascript
import { money } from "monetra";

const base = money("100.00", "USD");
const sum = base.add(money("25.50", "USD")); // $125.50
const sum2 = base.add("25.50"); // $125.50
```

</details>

<details>
<summary><strong>React.js</strong></summary>

```tsx
import { money, Money } from "monetra";
import { useMemo } from "react";

function CartTotal({ items }: { items: Array<{ price: Money }> }) {
  const total = useMemo(
    () => items.reduce((sum, item) => sum.add(item.price), Money.zero("USD")),
    [items]
  );

  return <span>{total.format()}</span>;
}
```

</details>

<details>
<summary><strong>Vue.js</strong></summary>

```vue
<script setup lang="ts">
import { computed } from "vue";
import { money, Money } from "monetra";

const items = [
  { price: money("10.00", "USD") },
  { price: money("20.00", "USD") },
];

const total = computed(() =>
  items.reduce((sum, item) => sum.add(item.price), Money.zero("USD"))
);
</script>

<template>
  <span>{{ total.format() }}</span>
</template>
```

</details>

<details>
<summary><strong>Node.js</strong></summary>

```javascript
import { money, Money } from "monetra";

async function calculateOrderTotal(orderItems) {
  return orderItems.reduce(
    (total, item) => total.add(item.price.multiply(item.quantity)),
    Money.zero("USD")
  );
}

const order = [
  { name: "Widget", price: money("29.99", "USD"), quantity: 2 },
  { name: "Gadget", price: money("49.99", "USD"), quantity: 1 },
];

const total = await calculateOrderTotal(order);
console.log(`Order total: ${total.format()}`);
```

</details>

---

### subtract() {#subtract}

Subtracts another amount from this Money.

```typescript
subtract(other: Money | number | bigint | string): Money
```

**Parameters:** Same as `add()`

**Returns:** A new `Money` instance with the difference

**Throws:** `CurrencyMismatchError` if currencies don't match

**Examples:**

```typescript
import { money } from "monetra";

const price = money("100.00", "USD");
const discount = money("15.00", "USD");

const final = price.subtract(discount); // $85.00

// Can produce negative values
const balance = money("50.00", "USD");
const expense = money("75.00", "USD");
const negative = balance.subtract(expense); // -$25.00
console.log(negative.isNegative()); // true
```

---

### multiply() {#multiply}

Multiplies this Money by a scalar value.

```typescript
multiply(
  multiplier: string | number,
  options?: { rounding?: RoundingMode }
): Money
```

**Parameters:**

- `multiplier` - Scalar to multiply by (not a Money object)
- `options.rounding` - Required if result has fractional minor units

**Returns:** A new `Money` instance with the product

**Throws:** `RoundingRequiredError` if rounding is needed but not provided

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { money, RoundingMode } from "monetra";

const price = money("10.00", "USD");

// Integer multiplication - no rounding needed
const quantity = 3;
const subtotal = price.multiply(quantity); // $30.00

// Decimal multiplication - requires rounding
const taxRate = 1.0825; // 8.25% tax
const withTax = price.multiply(taxRate, {
  rounding: RoundingMode.HALF_UP,
}); // $10.83

// String multiplier for precision
const precise = price.multiply("1.5", {
  rounding: RoundingMode.HALF_EVEN,
}); // $15.00
```

</details>

<details>
<summary><strong>JavaScript (ESM)</strong></summary>

```javascript
import { money, RoundingMode } from "monetra";

const price = money("10.00", "USD");
const quantity = 3;
const subtotal = price.multiply(quantity); // $30.00
```

</details>

---

### divide() {#divide}

Divides this Money by a scalar value.

```typescript
divide(
  divisor: string | number,
  options?: { rounding?: RoundingMode }
): Money
```

**Parameters:**

- `divisor` - Scalar to divide by (must be non-zero)
- `options.rounding` - Required if result has fractional minor units

**Returns:** A new `Money` instance with the quotient

**Throws:**

- `RoundingRequiredError` if rounding is needed but not provided
- `Error` if divisor is zero

**Examples:**

```typescript
import { money, RoundingMode } from "monetra";

const total = money("100.00", "USD");

// Exact division - no rounding needed
const half = total.divide(2); // $50.00

// Inexact division - requires rounding
const third = total.divide(3, {
  rounding: RoundingMode.HALF_UP,
}); // $33.33

// Division by zero throws error
try {
  total.divide(0);
} catch (e) {
  console.log(e.message); // "Division by zero"
}
```

---

### percentage() {#percentage}

Calculates a percentage of this Money.

```typescript
percentage(percent: number, rounding?: RoundingMode): Money
```

**Parameters:**

- `percent` - Percentage value (e.g., `8.5` for 8.5%)
- `rounding` - Rounding mode (default: `HALF_EVEN`)

**Returns:** A new `Money` instance representing the percentage

**Examples:**

```typescript
import { money, RoundingMode } from "monetra";

const amount = money("100.00", "USD");

// Calculate 8.5% tax
const tax = amount.percentage(8.5, RoundingMode.HALF_UP); // $8.50

// Calculate 15% tip
const tip = amount.percentage(15); // $15.00

// Calculate small percentage
const fee = amount.percentage(0.5, RoundingMode.CEIL); // $0.50
```

---

### addPercent() {#addpercent}

Adds a percentage to this Money (e.g., adding tax).

```typescript
addPercent(percent: number, rounding?: RoundingMode): Money
```

**Parameters:**

- `percent` - Percentage to add (e.g., `8.25` for 8.25%)
- `rounding` - Rounding mode (default: `HALF_EVEN`)

**Returns:** A new `Money` instance with the percentage added

**Examples:**

```typescript
import { money, RoundingMode } from "monetra";

const subtotal = money("100.00", "USD");

// Add 8.25% sales tax
const withTax = subtotal.addPercent(8.25, RoundingMode.HALF_UP);
console.log(withTax.format()); // "$108.25"

// Add 20% VAT
const withVat = subtotal.addPercent(20);
console.log(withVat.format()); // "$120.00"
```

---

### subtractPercent() {#subtractpercent}

Subtracts a percentage from this Money (e.g., applying a discount).

```typescript
subtractPercent(percent: number, rounding?: RoundingMode): Money
```

**Parameters:**

- `percent` - Percentage to subtract (e.g., `10` for 10% discount)
- `rounding` - Rounding mode (default: `HALF_EVEN`)

**Returns:** A new `Money` instance with the percentage subtracted

**Examples:**

```typescript
import { money, RoundingMode } from "monetra";

const price = money("100.00", "USD");

// Apply 10% discount
const discounted = price.subtractPercent(10);
console.log(discounted.format()); // "$90.00"

// Apply 15% off
const sale = price.subtractPercent(15, RoundingMode.FLOOR);
console.log(sale.format()); // "$85.00"
```

---

### abs() {#abs}

Returns the absolute value of this Money.

```typescript
abs(): Money
```

**Returns:** A new `Money` instance with the absolute value

**Examples:**

```typescript
import { money } from "monetra";

const negative = money("-50.00", "USD");
const positive = negative.abs();
console.log(positive.format()); // "$50.00"

const alreadyPositive = money("50.00", "USD");
console.log(alreadyPositive.abs().equals(alreadyPositive)); // true
```

---

### negate() {#negate}

Returns the negated value of this Money.

```typescript
negate(): Money
```

**Returns:** A new `Money` instance with the opposite sign

**Examples:**

```typescript
import { money } from "monetra";

const income = money("100.00", "USD");
const expense = income.negate();
console.log(expense.format()); // "-$100.00"

const debt = money("-50.00", "USD");
const credit = debt.negate();
console.log(credit.format()); // "$50.00"
```

---

## Comparison {#comparison}

### equals() {#equals}

Checks if this Money equals another value.

```typescript
equals(other: Money | number | bigint | string): boolean
```

**Parameters:**

- `other` - Value to compare (same currency required for Money)

**Returns:** `true` if values are equal

**Examples:**

```typescript
import { money } from "monetra";

const a = money("100.00", "USD");
const b = money("100.00", "USD");
const c = money("100.00", "EUR");

a.equals(b); // true
a.equals("100.00"); // true (compared as major units)
a.equals(10000); // true (compared as minor units)
a.equals(c); // false (different currency)
```

---

### compare() {#compare}

Compares this Money to another value.

```typescript
compare(other: Money | number | bigint | string): -1 | 0 | 1
```

**Returns:**

- `-1` if this < other
- `0` if this === other
- `1` if this > other

**Examples:**

```typescript
import { money } from "monetra";

const a = money("50.00", "USD");
const b = money("100.00", "USD");

a.compare(b); // -1
b.compare(a); // 1
a.compare(a); // 0

// Useful for sorting
const amounts = [
  money("30.00", "USD"),
  money("10.00", "USD"),
  money("20.00", "USD"),
];
amounts.sort((x, y) => x.compare(y));
// [10.00, 20.00, 30.00]
```

---

### greaterThan() / lessThan() {#greaterthan}

Comparison operators.

```typescript
greaterThan(other: Money | number | bigint | string): boolean
lessThan(other: Money | number | bigint | string): boolean
greaterThanOrEqual(other: Money | number | bigint | string): boolean
lessThanOrEqual(other: Money | number | bigint | string): boolean
```

**Examples:**

```typescript
import { money } from "monetra";

const price = money("50.00", "USD");
const budget = money("40.00", "USD");

price.greaterThan(budget); // true
price.lessThan(budget); // false
price.greaterThanOrEqual("50"); // true
price.lessThanOrEqual(5000); // true (5000 cents = $50)
```

---

### isPositive() / isNegative() / isZero() {#ispositive}

Sign checks.

```typescript
isPositive(): boolean
isNegative(): boolean
isZero(): boolean
```

**Examples:**

```typescript
import { money, Money } from "monetra";

const positive = money("100.00", "USD");
const negative = money("-50.00", "USD");
const zero = Money.zero("USD");

positive.isPositive(); // true
positive.isNegative(); // false
positive.isZero(); // false

negative.isPositive(); // false
negative.isNegative(); // true

zero.isZero(); // true
```

---

## Allocation {#allocation}

### split() {#split}

Splits money into equal parts, distributing remainders.

```typescript
split(parts: number): Money[]
```

**Parameters:**

- `parts` - Number of parts to split into (must be positive integer)

**Returns:** Array of `Money` instances totaling the original amount

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { money } from "monetra";

const bill = money("100.00", "USD");

// Split evenly
const even = bill.split(4);
// [$25.00, $25.00, $25.00, $25.00]

// Split with remainder (100 / 3 = 33.33...)
const uneven = bill.split(3);
// [$33.34, $33.33, $33.33]
// Note: Extra cent goes to first share

// Verify total
const total = uneven.reduce((a, b) => a.add(b));
console.log(total.equals(bill)); // true - no cents lost!
```

</details>

<details>
<summary><strong>React.js</strong></summary>

```tsx
import { money } from "monetra";

function BillSplitter({ total, people }: { total: string; people: number }) {
  const bill = money(total, "USD");
  const shares = bill.split(people);

  return (
    <div>
      <h3>Bill Split ({people} people)</h3>
      <ul>
        {shares.map((share, i) => (
          <li key={i}>
            Person {i + 1}: {share.format()}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

</details>

---

### allocate() {#allocate}

Allocates money according to ratios.

```typescript
allocate(ratios: number[]): Money[]
```

**Parameters:**

- `ratios` - Array of ratio values (e.g., `[50, 30, 20]` for 50/30/20 split)

**Returns:** Array of `Money` instances allocated proportionally

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { money } from "monetra";

const revenue = money("1000.00", "USD");

// Allocate by percentage (50%, 30%, 20%)
const shares = revenue.allocate([50, 30, 20]);
// [$500.00, $300.00, $200.00]

// Allocate by parts (3:2:1)
const parts = revenue.allocate([3, 2, 1]);
// [$500.00, $333.33, $166.67]

// Handles remainders
const tricky = money("100.00", "USD").allocate([1, 1, 1]);
// [$33.34, $33.33, $33.33]
```

</details>

<details>
<summary><strong>Node.js</strong></summary>

```javascript
import { money } from "monetra";

// Commission split example
function calculateCommissions(saleAmount, team) {
  const sale = money(saleAmount, "USD");
  const ratios = team.map((member) => member.commissionRate);
  const allocations = sale.allocate(ratios);

  return team.map((member, i) => ({
    name: member.name,
    commission: allocations[i].format(),
  }));
}

const team = [
  { name: "Alice", commissionRate: 50 },
  { name: "Bob", commissionRate: 30 },
  { name: "Charlie", commissionRate: 20 },
];

const commissions = calculateCommissions("10000.00", team);
console.log(commissions);
// [
//   { name: 'Alice', commission: '$5,000.00' },
//   { name: 'Bob', commission: '$3,000.00' },
//   { name: 'Charlie', commission: '$2,000.00' }
// ]
```

</details>

---

## Static Methods {#static-methods}

### Money.min() / Money.max() {#moneymin}

Find minimum or maximum among Money values.

```typescript
static min(...values: Money[]): Money
static max(...values: Money[]): Money
```

**Parameters:**

- `values` - Money values to compare (must all be same currency)

**Returns:** The smallest/largest `Money` value

**Throws:** `CurrencyMismatchError` if currencies don't match

**Examples:**

```typescript
import { money, Money } from "monetra";

const prices = [
  money("29.99", "USD"),
  money("19.99", "USD"),
  money("39.99", "USD"),
];

const lowest = Money.min(...prices);
console.log(lowest.format()); // "$19.99"

const highest = Money.max(...prices);
console.log(highest.format()); // "$39.99"
```

---

## Formatting & Serialization {#formatting}

### format() {#format}

Formats the Money as a localized string.

```typescript
format(options?: {
  locale?: string;
  symbol?: boolean;
  display?: 'symbol' | 'code' | 'name';
}): string
```

**Parameters:**

- `options.locale` - BCP 47 locale (default: currency's locale)
- `options.symbol` - Whether to include currency symbol (default: `true`)
- `options.display` - How to display currency

**Returns:** Formatted string

**Examples:**

```typescript
import { money } from "monetra";

const amount = money("1234.56", "USD");

// Default (uses currency locale)
amount.format(); // "$1,234.56"

// Different locales
amount.format({ locale: "de-DE" }); // "1.234,56 $"
amount.format({ locale: "fr-FR" }); // "1 234,56 $US"

// Display options
amount.format({ display: "code" }); // "USD 1,234.56"
amount.format({ display: "name" }); // "1,234.56 US dollars"
amount.format({ symbol: false }); // "1,234.56"

// Euro example
const euro = money("1234.56", "EUR");
euro.format(); // "€1,234.56"
euro.format({ locale: "de-DE" }); // "1.234,56 €"
```

---

### toJSON() {#tojson}

Returns a JSON-serializable representation.

```typescript
toJSON(): {
  amount: string;
  currency: string;
  precision: number;
}
```

**Returns:** Object suitable for JSON serialization

**Examples:**

```typescript
import { money, Money } from "monetra";

const amount = money("99.99", "USD");

// Serialize
const json = amount.toJSON();
// { amount: "9999", currency: "USD", precision: 2 }

const jsonString = JSON.stringify(amount);
// '{"amount":"9999","currency":"USD","precision":2}'

// Deserialize
const parsed = JSON.parse(jsonString);
const restored = Money.fromMinor(BigInt(parsed.amount), parsed.currency);
console.log(restored.format()); // "$99.99"
```

---

## Properties {#properties}

### minor

The amount in minor units as a BigInt.

```typescript
readonly minor: bigint
```

**Example:**

```typescript
const amount = money("10.50", "USD");
console.log(amount.minor); // 1050n
```

### currency

The Currency object for this Money.

```typescript
readonly currency: Currency
```

**Example:**

```typescript
const amount = money("10.50", "USD");
console.log(amount.currency.code); // "USD"
console.log(amount.currency.decimals); // 2
console.log(amount.currency.symbol); // "$"
```

---

## Next Steps

- **[Ledger API](./ledger.md)** - Transaction logging and audit trails
- **[Financial API](./financial.md)** - Compound interest, loans, NPV, IRR
- **[Allocation Guide](../guides/allocation.md)** - Advanced splitting techniques
