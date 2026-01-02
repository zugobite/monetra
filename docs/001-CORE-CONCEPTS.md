# Core Concepts

This guide provides an in-depth look at the core features of **Monetra** and how to use them effectively in your applications.

## 1. Safe Integer Arithmetic

Monetra uses `BigInt` internally to represent all monetary values in their minor units (e.g., cents). This ensures that you never encounter floating-point errors like `0.1 + 0.2 = 0.30000000000000004`.

### Basic Operations

Addition and subtraction are straightforward but strict. You cannot operate on Money objects of different currencies.

We provide a smart syntax that allows you to pass numbers (minor units) or strings (major units) directly to arithmetic methods.

```typescript
import { money } from "monetra";

const price = money("19.99", "USD");

// Add $5.00 (using string for major units)
const total = price.add("5.00"); // $24.99

// Subtract 200 cents ($2.00) (using number for minor units)
const discount = total.subtract(200); // $22.99
```

### Financial Helpers

Monetra includes built-in helpers for common financial tasks like tax, discounts, and splitting bills.

```typescript
const subtotal = money("100.00", "USD");

// Add 10% Tax
const withTax = subtotal.addPercent(10); // $110.00

// Apply 20% Discount
const final = withTax.subtractPercent(20); // $88.00

// Split into 3 equal payments
const payments = final.split(3);
// [ $29.34, $29.33, $29.33 ] - Handles penny rounding automatically
```

### Comparison & Utilities

Monetra provides a rich set of comparison and utility methods.

```typescript
const a = money("10.00", "USD");
const b = money("20.00", "USD");

a.lessThan(b); // true
a.greaterThanOrEqual("10.00"); // true
a.compare(b); // -1

const debt = money("-50.00", "USD");
debt.abs(); // $50.00
debt.isPositive(); // false
```

### Error Handling

If you try to add or subtract different currencies, Monetra will throw a `CurrencyMismatchError`.

```typescript
import { money } from "monetra";

const dollars = money("10.00", "USD");
const euros = money("10.00", "EUR");

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
import { Money, USD, RoundingMode } from "monetra";

const price = Money.fromMajor("10.25", USD); // 1025 cents
const taxRate = 0.0825; // 8.25%

// 1025 * 0.0825 = 84.5625 cents
// We must decide how to round this.

const tax = price.multiply(taxRate, { rounding: RoundingMode.HALF_UP });
// 84.5625 -> 85 cents -> $0.85
```

If the result is an exact integer, rounding is not required.

```typescript
const price = Money.fromMajor("10.00", USD);
const quantity = 2;
const total = price.multiply(quantity); // $20.00 (No rounding needed)
```

### Division

Division works similarly to multiplication. You must provide a rounding mode if the result is not an integer.

```typescript
const total = money("10.00", "USD");
const perPerson = total.divide(3, { rounding: RoundingMode.HALF_UP }); // $3.33
```

## 3. Allocation (Splitting Money)

Dividing money is tricky. If you split $100.00 among 3 people, you get $33.3333...
Monetra's `allocate` method ensures that not a single cent is lost or created. It distributes the remainder to the first recipients.

### Example: Splitting a Bill

```typescript
import { Money, USD } from "monetra";

const bill = Money.fromMajor("100.00", USD);
const [personA, personB, personC] = bill.allocate([1, 1, 1]);

console.log(personA.format()); // "$33.34"
console.log(personB.format()); // "$33.33"
console.log(personC.format()); // "$33.33"

// Total is exactly $100.00
```

### Example: Prorated Payments

You can also allocate by unequal ratios.

```typescript
const profit = Money.fromMajor("1000.00", USD);
// Split 70% / 30%
const [owner, partner] = profit.allocate([70, 30]);

console.log(owner.format()); // "$700.00"
console.log(partner.format()); // "$300.00"
```

## 4. Formatting & Parsing

Monetra leverages the standard `Intl.NumberFormat` API for robust, locale-aware formatting.

### Parsing

Always use `Money.fromMajor` (or `money('...')`) for user input (strings) and `Money.fromMinor` (or `money(123)`) for database values (integers).

```typescript
// Safe parsing
const m1 = Money.fromMajor("1,234.56", USD); // Error! No commas allowed in parsing for safety.
const m2 = Money.fromMajor("1234.56", USD); // OK
```

### Formatting

You can format money for any locale, regardless of the currency. You can also control the display style.

```typescript
const m = money("1234.56", "USD");

// Default
console.log(m.format()); // "$1,234.56"

// With Currency Code
console.log(m.format({ display: "code" })); // "USD 1,234.56"

// With Currency Name
console.log(m.format({ display: "name" })); // "1,234.56 US dollars"
```

## 5. Multi-Currency Wallets & Conversion

For advanced use cases like wallets, Monetra provides `MoneyBag` and `Converter`.

### MoneyBag (Portfolio)

A `MoneyBag` holds multiple currencies and handles adding/subtracting them automatically.

```typescript
import { MoneyBag, money } from "monetra";

const wallet = new MoneyBag();
wallet.add(money("10.00", "USD"));
wallet.add(money("5.00", "EUR"));

console.log(wallet.get("USD").format()); // "$10.00"
```

### Currency Conversion

To get the total value of a mixed wallet, you need a `Converter`.

```typescript
import { Converter } from "monetra";

const rates = { USD: 1, EUR: 0.85 }; // 1 USD = 0.85 EUR
const converter = new Converter("USD", rates);

// Convert EUR to USD
const totalUSD = wallet.total("USD", converter);
console.log(totalUSD.format()); // "$15.88" (approx)
```

// Default (uses currency's default locale, en-US for USD)
console.log(m.format()); // "$1,234.56"

// German locale (uses comma for decimals)
console.log(m.format({ locale: 'de-DE' })); // "1.234,56 $"

````

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

## Next Steps

Now that you understand the core concepts, explore the specialized modules:

- [Ledger System](002-LEDGER-SYSTEM.md)`
