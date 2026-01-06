# Getting Started

This guide will help you install Monetra and start building financially accurate applications with the framework's integrated components.

---

## Installation

Install Monetra using your preferred package manager:

```bash
# npm
npm install monetra

# yarn
yarn add monetra

# pnpm
pnpm add monetra
```

**Requirements:** Node.js 18+ or modern browsers with BigInt support.

---

## Framework Overview

Monetra provides modular access to its components through the main export and specialized subpath exports:

```typescript
// Core money and financial functions
import { money, Money, futureValue, pmt } from "monetra";

// Transaction ledger (also available via subpath)
import { Ledger } from "monetra/ledger";

// Financial calculations (also available via subpath)
import { loan, npv, irr } from "monetra/financial";

// Custom token definitions (also available via subpath)
import { defineToken } from "monetra/tokens";
```

---

## Quick Start

### TypeScript

```typescript
import { money, Money, RoundingMode } from "monetra";

// Create money from a string (major units - dollars)
const price = money("19.99", "USD");

// Create money from minor units (cents)
const tax = Money.fromMinor(199, "USD"); // $1.99

// Arithmetic operations
const subtotal = price.add(tax);
console.log(subtotal.format()); // "$21.98"

// Multiply with explicit rounding
const quantity = 3;
const total = price.multiply(quantity);
console.log(total.format()); // "$59.97"

// Compare values
console.log(price.greaterThan(tax)); // true
console.log(price.equals(money("19.99", "USD"))); // true
```

### JavaScript (ES Modules)

```javascript
import { money, Money, RoundingMode } from "monetra";

// Create money using the helper function
const price = money("29.99", "USD");
const discount = money("5.00", "USD");

// Subtract to get final price
const finalPrice = price.subtract(discount);
console.log(finalPrice.format()); // "$24.99"

// Split a bill evenly
const bill = money("100.00", "USD");
const shares = bill.split(3);
// shares = [$33.34, $33.33, $33.33]
// Note: Extra cent goes to first share - no money lost!

shares.forEach((share, i) => {
  console.log(`Person ${i + 1}: ${share.format()}`);
});
```

### JavaScript (CommonJS)

```javascript
const { money, Money, RoundingMode } = require("monetra");

// Create money values
const revenue = money("1250.50", "USD");
const expenses = money("823.75", "USD");

// Calculate profit
const profit = revenue.subtract(expenses);
console.log(`Profit: ${profit.format()}`); // "Profit: $426.75"

// Check if profitable
if (profit.isPositive()) {
  console.log("Business is profitable!");
}

// Calculate percentage
const margin = profit.divide(revenue.minor, {
  rounding: RoundingMode.HALF_EVEN,
});
console.log(
  `Margin: ${((Number(profit.minor) / Number(revenue.minor)) * 100).toFixed(2)}%`
);
```

---

## Creating Money Objects {#creating-money}

There are several ways to create `Money` instances:

### Using the `money()` Helper

The `money()` helper is the recommended way to create money:

```typescript
import { money } from "monetra";

// String amounts are treated as major units (dollars)
const dollars = money("10.50", "USD"); // $10.50

// Numbers are treated as minor units (cents)
const cents = money(1050, "USD"); // $10.50

// BigInt for large amounts
const large = money(100000000000n, "USD"); // $1,000,000,000.00
```

### Using Static Factory Methods

For more control, use the static methods on the `Money` class:

```typescript
import { Money } from "monetra";

// From minor units (cents)
const a = Money.fromMinor(1050, "USD"); // $10.50
const b = Money.fromCents(1050, "USD"); // Alias for fromMinor

// From major units (string)
const c = Money.fromMajor("10.50", "USD"); // $10.50
const d = Money.fromDecimal("10.50", "USD"); // Alias for fromMajor

// Zero value
const zero = Money.zero("USD"); // $0.00

// From float (use with caution!)
const f = Money.fromFloat(10.5, "USD", {
  suppressWarning: true,
}); // $10.50
```

> **Warning**: Avoid `Money.fromFloat()` when possible. Floating-point numbers can have precision issues. Always prefer string-based creation for exact values.

---

## Basic Operations

### Arithmetic

```typescript
import { money, RoundingMode } from "monetra";

const a = money("100.00", "USD");
const b = money("25.50", "USD");

// Addition and subtraction
const sum = a.add(b); // $125.50
const diff = a.subtract(b); // $74.50

// Multiplication (by scalar)
const doubled = a.multiply(2); // $200.00

// Division (requires rounding for non-exact results)
const split = a.divide(3, { rounding: RoundingMode.HALF_UP }); // $33.33

// Percentage operations
const tax = a.percentage(8.5, RoundingMode.HALF_UP); // $8.50
const withTax = a.addPercent(8.5, RoundingMode.HALF_UP); // $108.50
const discounted = a.subtractPercent(10, RoundingMode.HALF_UP); // $90.00
```

### Comparison

```typescript
import { money } from "monetra";

const a = money("50.00", "USD");
const b = money("75.00", "USD");

a.equals(b); // false
a.lessThan(b); // true
a.greaterThan(b); // false
a.lessThanOrEqual(b); // true
a.greaterThanOrEqual(b); // false
a.compare(b); // -1 (a < b)

// Sign checks
a.isPositive(); // true
a.isNegative(); // false
a.isZero(); // false
```

### Formatting

```typescript
import { money } from "monetra";

const amount = money("1234.56", "USD");

// Default formatting (uses currency's locale)
amount.format(); // "$1,234.56"

// Custom locale
amount.format({ locale: "de-DE" }); // "1.234,56 $"

// Display options
amount.format({ display: "code" }); // "USD 1,234.56"
amount.format({ display: "name" }); // "1,234.56 US dollars"
amount.format({ symbol: false }); // "1,234.56"

// Serialization
amount.toJSON(); // { amount: "123456", currency: "USD", precision: 2 }
JSON.stringify(amount); // '{"amount":"123456","currency":"USD","precision":2}'
```

---

## Framework Integration {#framework-integration}

### React.js

```tsx
import React, { useState } from "react";
import { money, Money, RoundingMode } from "monetra";

interface Product {
  id: string;
  name: string;
  price: Money;
}

function ShoppingCart() {
  const [items, setItems] = useState<Product[]>([
    { id: "1", name: "Widget", price: money("29.99", "USD") },
    { id: "2", name: "Gadget", price: money("49.99", "USD") },
  ]);

  const subtotal = items.reduce(
    (sum, item) => sum.add(item.price),
    Money.zero("USD")
  );

  const tax = subtotal.percentage(8.25, RoundingMode.HALF_UP);
  const total = subtotal.add(tax);

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}: {item.price.format()}
          </li>
        ))}
      </ul>
      <div className="totals">
        <p>Subtotal: {subtotal.format()}</p>
        <p>Tax (8.25%): {tax.format()}</p>
        <p>
          <strong>Total: {total.format()}</strong>
        </p>
      </div>
    </div>
  );
}

export default ShoppingCart;
```

### Vue.js

```vue
<template>
  <div class="invoice">
    <h2>Invoice #{{ invoiceId }}</h2>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Quantity</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="line in lineItems" :key="line.id">
          <td>{{ line.description }}</td>
          <td>{{ line.quantity }}</td>
          <td>{{ line.unitPrice.format() }}</td>
          <td>{{ line.total.format() }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">Subtotal</td>
          <td>{{ subtotal.format() }}</td>
        </tr>
        <tr>
          <td colspan="3">Tax ({{ taxRate }}%)</td>
          <td>{{ taxAmount.format() }}</td>
        </tr>
        <tr class="total">
          <td colspan="3"><strong>Total</strong></td>
          <td>
            <strong>{{ grandTotal.format() }}</strong>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { money, Money, RoundingMode } from "monetra";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: Money;
  total: Money;
}

const invoiceId = ref("INV-2024-001");
const taxRate = ref(7.5);

const lineItems = ref<LineItem[]>([
  {
    id: "1",
    description: "Consulting Services",
    quantity: 10,
    unitPrice: money("150.00", "USD"),
    get total() {
      return this.unitPrice.multiply(this.quantity);
    },
  },
  {
    id: "2",
    description: "Software License",
    quantity: 1,
    unitPrice: money("499.00", "USD"),
    get total() {
      return this.unitPrice.multiply(this.quantity);
    },
  },
]);

const subtotal = computed(() =>
  lineItems.value.reduce((sum, line) => sum.add(line.total), Money.zero("USD"))
);

const taxAmount = computed(() =>
  subtotal.value.percentage(taxRate.value, RoundingMode.HALF_UP)
);

const grandTotal = computed(() => subtotal.value.add(taxAmount.value));
</script>

<style scoped>
.invoice table {
  width: 100%;
  border-collapse: collapse;
}
.invoice th,
.invoice td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
.invoice .total td {
  font-size: 1.2em;
  border-top: 2px solid #333;
}
</style>
```

### Node.js

```javascript
// Express.js API example
import express from "express";
import { money, Money, Ledger, RoundingMode } from "monetra";

const app = express();
app.use(express.json());

// In-memory ledger (use a database in production)
const userLedgers = new Map();

function getLedger(userId) {
  if (!userLedgers.has(userId)) {
    userLedgers.set(userId, new Ledger("USD"));
  }
  return userLedgers.get(userId);
}

// Deposit endpoint
app.post("/api/users/:userId/deposit", (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  try {
    const depositAmount = money(amount, "USD");

    if (depositAmount.isNegative() || depositAmount.isZero()) {
      return res.status(400).json({ error: "Amount must be positive" });
    }

    const ledger = getLedger(userId);
    const entry = ledger.record(depositAmount, {
      type: "credit",
      description: "User deposit",
      reference: `DEP-${Date.now()}`,
    });

    res.json({
      success: true,
      transactionId: entry.id,
      newBalance: ledger.getBalance().format(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get balance endpoint
app.get("/api/users/:userId/balance", (req, res) => {
  const { userId } = req.params;
  const ledger = getLedger(userId);

  res.json({
    balance: ledger.getBalance().toJSON(),
    formatted: ledger.getBalance().format(),
    transactionCount: ledger.getHistory().length,
  });
});

// Transfer between users
app.post("/api/transfer", (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;

  try {
    const transferAmount = money(amount, "USD");
    const fromLedger = getLedger(fromUserId);
    const toLedger = getLedger(toUserId);

    // Check sufficient funds
    if (fromLedger.getBalance().lessThan(transferAmount)) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    const reference = `TXF-${Date.now()}`;

    // Debit from sender
    fromLedger.record(transferAmount.negate(), {
      type: "debit",
      description: `Transfer to user ${toUserId}`,
      reference,
    });

    // Credit to receiver
    toLedger.record(transferAmount, {
      type: "credit",
      description: `Transfer from user ${fromUserId}`,
      reference,
    });

    res.json({
      success: true,
      reference,
      fromBalance: fromLedger.getBalance().format(),
      toBalance: toLedger.getBalance().format(),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Payment API running on port 3000");
});
```

---

## TypeScript Configuration

For the best TypeScript experience, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true
  }
}
```

> **Note**: Monetra uses `BigInt` internally, which requires ES2020 or later.

---

## What's Next?

Now that you have Monetra installed and understand the basics:

- **[Core Concepts](./core-concepts.md)** - Learn about integer arithmetic, currencies, and immutability
- **[Money API Reference](./api/money.md)** - Complete documentation for the Money class
- **[Ledger System](./api/ledger.md)** - Build audit-ready transaction logs
- **[Best Practices](./best-practices.md)** - Patterns and anti-patterns for production use
