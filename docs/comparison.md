# Library Comparison

This document provides a technical comparison between Monetra and other JavaScript/TypeScript money handling libraries. Each library has its strengths and is suited for different use cases.

---

## Table of Contents

- [Overview](#overview)
- [Feature Comparison](#feature-comparison)
- [Approach Comparison](#approach-comparison)
- [Code Examples](#code-examples)
- [When to Use Each Library](#when-to-use)

---

## Overview {#overview}

| Library     | Version | Size (minified) | TypeScript      | Decimal Approach               |
| ----------- | ------- | --------------- | --------------- | ------------------------------ |
| Monetra     | 2.x     | ~15 KB          | Native          | Integer (BigInt)               |
| Dinero.js   | 2.x     | ~12 KB          | Native          | Integer (BigInt)               |
| currency.js | 2.x     | ~3 KB           | Types available | Floating-point with correction |
| big.js      | 6.x     | ~8 KB           | Types available | Arbitrary precision decimal    |
| decimal.js  | 10.x    | ~32 KB          | Types available | Arbitrary precision decimal    |

---

## Feature Comparison {#feature-comparison}

| Feature                                | Monetra      | Dinero.js        | currency.js | big.js | decimal.js |
| -------------------------------------- | ------------ | ---------------- | ----------- | ------ | ---------- |
| Integer-based storage                  | Yes (BigInt) | Yes (BigInt)     | No          | No     | No         |
| Immutable objects                      | Yes          | Yes              | Yes         | Yes    | Yes        |
| ISO 4217 currencies                    | Built-in     | Separate package | Manual      | N/A    | N/A        |
| Custom token support                   | Yes          | No               | No          | N/A    | N/A        |
| Cryptocurrency precision (18 decimals) | Yes          | Yes              | No          | Yes    | Yes        |
| Formatting with locales                | Yes          | Yes              | Limited     | No     | No         |
| Allocation/splitting                   | Yes          | Yes              | No          | No     | No         |
| Ledger/transaction log                 | Yes          | No               | No          | No     | No         |
| Financial calculations (NPV, IRR)      | Yes          | No               | No          | No     | No         |
| Loan amortization                      | Yes          | No               | No          | No     | No         |
| Zero dependencies                      | Yes          | Yes              | Yes         | Yes    | Yes        |
| Tree-shakeable                         | Yes          | Yes              | Yes         | N/A    | N/A        |

---

## Approach Comparison {#approach-comparison}

### Storage Strategy

**Integer-based (Monetra, Dinero.js)**

Stores amounts as integers in minor units (cents), avoiding floating-point precision issues entirely.

```typescript
// Monetra
const price = money("19.99", "USD");
console.log(price.minor); // 1999n (BigInt)

// Dinero.js
const price = dinero({ amount: 1999, currency: USD });
```

**Floating-point with correction (currency.js)**

Uses JavaScript numbers with rounding correction.

```javascript
// currency.js
const price = currency(19.99);
console.log(price.value); // 19.99 (number)
```

**Arbitrary precision decimal (big.js, decimal.js)**

Stores numbers as strings/arrays for arbitrary precision, not money-specific.

```javascript
// big.js
const price = new Big("19.99");
console.log(price.toString()); // "19.99"
```

### Currency Handling

| Approach             | Libraries          | Pros                              | Cons                                   |
| -------------------- | ------------------ | --------------------------------- | -------------------------------------- |
| Built-in registry    | Monetra            | Zero setup, all ISO 4217 included | Larger bundle if tree-shaking not used |
| Separate package     | Dinero.js          | Smaller core, modular             | Additional dependency required         |
| Manual configuration | currency.js        | Full control                      | Must define currencies yourself        |
| No currency concept  | big.js, decimal.js | Generic use                       | Must build currency layer yourself     |

### Rounding

| Library     | Rounding Modes                                       | Default                     |
| ----------- | ---------------------------------------------------- | --------------------------- |
| Monetra     | HALF_UP, HALF_DOWN, HALF_EVEN, FLOOR, CEIL, TRUNCATE | Explicit (throws if needed) |
| Dinero.js   | halfUp, halfDown, halfEven, floor, ceiling           | halfEven                    |
| currency.js | Default rounding only                                | Math.round equivalent       |
| big.js      | ROUND_UP, ROUND_DOWN, ROUND_HALF_UP, etc.            | ROUND_HALF_UP               |
| decimal.js  | Multiple modes                                       | ROUND_HALF_UP               |

---

## Code Examples {#code-examples}

### Basic Arithmetic

**Monetra**

```typescript
import { money, RoundingMode } from "monetra";

const price = money("29.99", "USD");
const quantity = 3;
const total = price.multiply(quantity);
const tax = total.percentage(8.25, RoundingMode.HALF_UP);
const grandTotal = total.add(tax);

console.log(grandTotal.format()); // "$97.39"
```

**Dinero.js**

```typescript
import { dinero, multiply, add, toDecimal } from "dinero.js";
import { USD } from "@dinero.js/currencies";

const price = dinero({ amount: 2999, currency: USD });
const total = multiply(price, 3);
// Tax calculation requires manual handling

console.log(toDecimal(total)); // "89.97"
```

**currency.js**

```javascript
import currency from "currency.js";

const price = currency(29.99);
const total = price.multiply(3);
const tax = total.multiply(0.0825);
const grandTotal = total.add(tax);

console.log(grandTotal.format()); // "$97.39"
```

### Splitting a Bill

**Monetra**

```typescript
import { money } from "monetra";

const bill = money("100.00", "USD");
const shares = bill.split(3);
// [money("33.34", "USD"), money("33.33", "USD"), money("33.33", "USD")]

// Verify no money lost
const sum = shares.reduce((a, b) => a.add(b));
console.log(sum.equals(bill)); // true
```

**Dinero.js**

```typescript
import { dinero, allocate, add } from "dinero.js";
import { USD } from "@dinero.js/currencies";

const bill = dinero({ amount: 10000, currency: USD });
const shares = allocate(bill, [1, 1, 1]);
// Returns array of Dinero objects
```

**currency.js**

```javascript
// No built-in allocation
// Must implement manually
```

### Currency Conversion

**Monetra**

```typescript
import { money, Converter } from "monetra";

const converter = new Converter("USD", {
  EUR: 0.92,
  GBP: 0.79,
});

const usd = money("100.00", "USD");
const eur = converter.convert(usd, "EUR");
console.log(eur.format()); // "€92.00"
```

**Dinero.js**

```typescript
import { dinero, convert } from "dinero.js";
import { USD, EUR } from "@dinero.js/currencies";

const usd = dinero({ amount: 10000, currency: USD });
const eur = convert(usd, EUR, { EUR: { amount: 92, scale: 2 } });
```

**currency.js**

```javascript
// No built-in conversion
// Must implement manually
```

### Cryptocurrency Handling

**Monetra**

```typescript
import { money, ETH, defineToken } from "monetra";

// Built-in tokens
const balance = money("1.234567890123456789", ETH);
console.log(balance.format()); // "1.234567890123456789 Ξ"

// Custom tokens
const USDC = defineToken({
  code: "USDC",
  symbol: "USDC",
  decimals: 6,
  type: "crypto",
});

const stablecoin = money("1000.50", USDC);
```

**Dinero.js**

```typescript
import { dinero } from "dinero.js";

// Define custom currency
const ETH = { code: "ETH", base: 10, exponent: 18 };
const balance = dinero({ amount: 1234567890123456789n, currency: ETH });
```

**currency.js, big.js, decimal.js**

```javascript
// Not designed for high-precision tokens
// Would need significant customization
```

### Financial Calculations

**Monetra**

```typescript
import { money, futureValue, pmt, loan, npv, irr } from "monetra";

// Future value
const principal = money("10000", "USD");
const future = futureValue(principal, {
  rate: 0.07,
  years: 10,
  compoundingPerYear: 12,
});

// Loan payment
const payment = pmt({
  principal: money("200000", "USD"),
  annualRate: 0.065,
  years: 30,
});

// Amortization schedule
const schedule = loan({
  principal: money("200000", "USD"),
  annualRate: 0.065,
  years: 30,
});

// Investment analysis
const npvResult = npv(money("0", "USD"), cashFlows, 0.1);
const irrResult = irr(money("0", "USD"), cashFlows);
```

**Other libraries**

```javascript
// No built-in financial functions
// Must use separate finance libraries or implement manually
```

### Ledger / Transaction Tracking

**Monetra**

```typescript
import { Ledger, money } from "monetra";

const ledger = new Ledger("USD");

ledger.credit("account", money("1000.00", "USD"), "Deposit");
ledger.debit("account", money("50.00", "USD"), "Purchase");

console.log(ledger.getBalance("account").format()); // "$950.00"
console.log(ledger.verify()); // true (hash chain intact)

const history = ledger.getTransactions("account");
```

**Other libraries**

```javascript
// No built-in ledger functionality
// Must implement transaction tracking separately
```

---

## When to Use Each Library {#when-to-use}

### Monetra

Consider Monetra when you need:

- Financial calculations (compound interest, loans, NPV/IRR)
- Transaction ledger with verification
- Cryptocurrency and custom token support
- Built-in ISO 4217 currencies
- Percentage operations and allocation

### Dinero.js

Consider Dinero.js when you need:

- Lightweight money handling
- Functional programming style (separate functions)
- Strong community and ecosystem
- Modular currency packages

### currency.js

Consider currency.js when you need:

- Minimal bundle size
- Simple formatting and basic arithmetic
- Quick integration without currency complexity
- Working with a single currency

### big.js / decimal.js

Consider these when you need:

- Generic arbitrary precision math (not money-specific)
- Scientific calculations
- Building your own money abstraction
- Maximum precision flexibility

---

## Migration Considerations

### From currency.js to Monetra

```typescript
// currency.js
const total = currency(19.99).add(5.0).multiply(2);

// Monetra equivalent
const total = money("19.99", "USD").add("5.00").multiply(2);
```

### From Dinero.js to Monetra

```typescript
// Dinero.js
import { dinero, add, multiply } from "dinero.js";
const price = dinero({ amount: 1999, currency: USD });
const total = multiply(add(price, dinero({ amount: 500, currency: USD })), 2);

// Monetra equivalent
const price = money("19.99", "USD");
const total = price.add("5.00").multiply(2);
```

### From big.js to Monetra

```javascript
// big.js
const price = new Big("19.99");
const total = price.plus("5.00").times(2);
// No currency handling

// Monetra equivalent
const price = money("19.99", "USD");
const total = price.add("5.00").multiply(2);
console.log(total.format()); // "$49.98"
```

---

## Summary

Each library serves different needs:

| Library     | Best For                                                                   |
| ----------- | -------------------------------------------------------------------------- |
| Monetra     | Full-featured financial applications with ledger, crypto, and calculations |
| Dinero.js   | Functional-style money handling with modular architecture                  |
| currency.js | Simple, lightweight currency formatting                                    |
| big.js      | General-purpose precise arithmetic                                         |
| decimal.js  | Scientific/financial calculations requiring arbitrary precision            |

Choose based on your specific requirements for precision, features, bundle size, and development style.
