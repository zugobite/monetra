# Ledger API Reference

The `Ledger` class provides an append-only transaction log with hash chain verification. It supports audit trails, balance tracking, and tamper detection.

---

## Table of Contents

- [Overview](#overview)
- [Creating a Ledger](#creating)
- [Recording Transactions](#recording)
- [Querying](#querying)
- [Verification](#verification)
- [Snapshots](#snapshots)
- [Types](#types)

---

## Overview {#overview}

The Ledger is designed for:

- **Immutable History**: Every transaction is permanently recorded
- **Hash Chain Verification**: Hash chains detect tampering
- **Audit Compliance**: Full transaction history with metadata
- **Balance Tracking**: Real-time balance calculation

```typescript
import { Ledger, money } from "monetra";

const ledger = new Ledger("USD");

// Record transactions
ledger.record(money("1000.00", "USD"), {
  type: "credit",
  description: "Initial deposit",
});

ledger.record(money("-50.00", "USD"), {
  type: "debit",
  description: "Purchase",
});

// Check balance
console.log(ledger.getBalance().format()); // "$950.00"

// Verify integrity
console.log(ledger.verify()); // true
```

---

## Creating a Ledger {#creating}

### Constructor

```typescript
constructor(currency: string | Currency)
```

Creates a new Ledger for a specific currency.

**Parameters:**

- `currency` - Currency code (e.g., `"USD"`) or Currency object

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { Ledger, getCurrency } from "monetra";

// Using currency code
const usdLedger = new Ledger("USD");

// Using Currency object
const eur = getCurrency("EUR");
const eurLedger = new Ledger(eur);

// For crypto
import { ETH } from "monetra";
const ethLedger = new Ledger(ETH);
```

</details>

<details>
<summary><strong>JavaScript (ESM)</strong></summary>

```javascript
import { Ledger } from "monetra";

const ledger = new Ledger("USD");
```

</details>

<details>
<summary><strong>JavaScript (CommonJS)</strong></summary>

```javascript
const { Ledger } = require("monetra");

const ledger = new Ledger("USD");
```

</details>

---

## Recording Transactions {#recording}

### record()

Records a transaction synchronously (Node.js).

```typescript
record(money: Money, metadata: TransactionMetadata): Entry
```

**Parameters:**

- `money` - The amount (positive for credit, negative for debit)
- `metadata` - Transaction metadata

**Returns:** The created `Entry` with hash and ID

**Throws:** `CurrencyMismatchError` if money currency doesn't match ledger

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { Ledger, money } from "monetra";

const ledger = new Ledger("USD");

// Credit (positive amount)
const deposit = ledger.record(money("500.00", "USD"), {
  type: "credit",
  description: "Direct deposit",
  reference: "PAY-2024-001",
  tags: ["payroll", "salary"],
});

console.log(deposit.id); // UUID
console.log(deposit.hash); // SHA-256 hash
console.log(deposit.createdAt); // Date

// Debit (negative amount)
const withdrawal = ledger.record(money("-100.00", "USD"), {
  type: "debit",
  description: "ATM withdrawal",
  reference: "ATM-12345",
});

// Or use negate for clarity
const purchase = ledger.record(money("25.99", "USD").negate(), {
  type: "debit",
  description: "Coffee shop",
});
```

</details>

<details>
<summary><strong>Node.js</strong></summary>

```javascript
import { Ledger, money } from "monetra";
import express from "express";

const app = express();
const userLedgers = new Map();

app.post("/transactions", (req, res) => {
  const { userId, amount, type, description } = req.body;

  if (!userLedgers.has(userId)) {
    userLedgers.set(userId, new Ledger("USD"));
  }

  const ledger = userLedgers.get(userId);
  const moneyAmount = money(amount, "USD");

  const entry = ledger.record(
    type === "debit" ? moneyAmount.negate() : moneyAmount,
    { type, description, reference: `TXN-${Date.now()}` }
  );

  res.json({
    transactionId: entry.id,
    newBalance: ledger.getBalance().format(),
  });
});
```

</details>

---

### recordAsync()

Records a transaction asynchronously (browser-compatible).

```typescript
async recordAsync(money: Money, metadata: TransactionMetadata): Promise<Entry>
```

**Parameters:** Same as `record()`

**Returns:** Promise resolving to the created `Entry`

**Examples:**

<details open>
<summary><strong>TypeScript (Browser)</strong></summary>

```typescript
import { Ledger, money } from "monetra";

const ledger = new Ledger("USD");

async function recordTransaction() {
  const entry = await ledger.recordAsync(money("100.00", "USD"), {
    type: "credit",
    description: "Funds added",
  });

  console.log("Transaction recorded:", entry.id);
  return entry;
}
```

</details>

<details>
<summary><strong>React.js</strong></summary>

```tsx
import { useState, useCallback } from "react";
import { Ledger, money, Money } from "monetra";

function useWallet(currency: string) {
  const [ledger] = useState(() => new Ledger(currency));
  const [balance, setBalance] = useState<Money>(() => Money.zero(currency));

  const addFunds = useCallback(
    async (amount: string) => {
      await ledger.recordAsync(money(amount, currency), {
        type: "credit",
        description: "Funds added",
      });
      setBalance(ledger.getBalance());
    },
    [ledger, currency]
  );

  const spend = useCallback(
    async (amount: string, description: string) => {
      const expense = money(amount, currency);
      if (balance.lessThan(expense)) {
        throw new Error("Insufficient funds");
      }
      await ledger.recordAsync(expense.negate(), {
        type: "debit",
        description,
      });
      setBalance(ledger.getBalance());
    },
    [ledger, currency, balance]
  );

  return { balance, addFunds, spend };
}
```

</details>

<details>
<summary><strong>Vue.js</strong></summary>

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { Ledger, money, Money } from "monetra";

const ledger = new Ledger("USD");
const balance = ref<Money>(Money.zero("USD"));
const loading = ref(false);

async function deposit(amount: string) {
  loading.value = true;
  try {
    await ledger.recordAsync(money(amount, "USD"), {
      type: "credit",
      description: "User deposit",
    });
    balance.value = ledger.getBalance();
  } finally {
    loading.value = false;
  }
}

async function withdraw(amount: string) {
  if (balance.value.lessThan(money(amount, "USD"))) {
    throw new Error("Insufficient funds");
  }
  loading.value = true;
  try {
    await ledger.recordAsync(money(amount, "USD").negate(), {
      type: "debit",
      description: "Withdrawal",
    });
    balance.value = ledger.getBalance();
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="wallet">
    <h2>Balance: {{ balance.format() }}</h2>
    <button @click="deposit('100.00')" :disabled="loading">Deposit $100</button>
  </div>
</template>
```

</details>

---

## Querying {#querying}

### getBalance()

Returns the current balance.

```typescript
getBalance(): Money
```

**Returns:** The sum of all transactions

**Examples:**

```typescript
import { Ledger, money } from "monetra";

const ledger = new Ledger("USD");

ledger.record(money("1000.00", "USD"), {
  type: "credit",
  description: "Deposit",
});
ledger.record(money("-250.00", "USD"), {
  type: "debit",
  description: "Purchase",
});
ledger.record(money("-50.00", "USD"), { type: "debit", description: "Fee" });

const balance = ledger.getBalance();
console.log(balance.format()); // "$700.00"

// Balance is calculated from immutable history
// It's always accurate, even if transactions span years
```

---

### getHistory()

Returns the complete transaction history.

```typescript
getHistory(): ReadonlyArray<Entry>
```

**Returns:** Immutable array of all entries

**Examples:**

```typescript
import { Ledger, money } from "monetra";

const ledger = new Ledger("USD");
// ... record some transactions

const history = ledger.getHistory();

// Iterate over history
history.forEach((entry) => {
  console.log(
    `${entry.createdAt.toISOString()}: ${entry.money.format()} - ${entry.metadata.description}`
  );
});

// History is immutable
history.push({} as any); // This won't modify the actual ledger
```

---

### query()

Filters entries by criteria.

```typescript
query(filter: {
  type?: TransactionType | TransactionType[];
  from?: Date;
  to?: Date;
  reference?: string;
  minAmount?: Money;
  maxAmount?: Money;
  tags?: string[];
}): Entry[]
```

**Parameters:**

- `filter.type` - Transaction type(s) to include
- `filter.from` - Start date (inclusive)
- `filter.to` - End date (inclusive)
- `filter.reference` - Exact reference match
- `filter.minAmount` - Minimum amount (inclusive)
- `filter.maxAmount` - Maximum amount (inclusive)
- `filter.tags` - Must have all specified tags

**Returns:** Filtered array of entries

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { Ledger, money } from "monetra";

const ledger = new Ledger("USD");
// ... record transactions

// Find all credits
const credits = ledger.query({ type: "credit" });

// Find debits over $100
const largeDebits = ledger.query({
  type: "debit",
  minAmount: money("100.00", "USD"),
});

// Find transactions in date range
const thisMonth = ledger.query({
  from: new Date("2024-01-01"),
  to: new Date("2024-01-31"),
});

// Find by reference
const specific = ledger.query({
  reference: "INV-2024-001",
});

// Combine filters
const filtered = ledger.query({
  type: ["credit", "transfer"],
  from: new Date("2024-01-01"),
  minAmount: money("50.00", "USD"),
  tags: ["payroll"],
});
```

</details>

<details>
<summary><strong>Node.js</strong></summary>

```javascript
import { Ledger, money } from "monetra";

// Generate monthly statement
function generateStatement(ledger, year, month) {
  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 0); // Last day of month

  const transactions = ledger.query({ from, to });

  const credits = transactions
    .filter((e) => e.money.isPositive())
    .reduce((sum, e) => sum.add(e.money), Money.zero("USD"));

  const debits = transactions
    .filter((e) => e.money.isNegative())
    .reduce((sum, e) => sum.add(e.money.abs()), Money.zero("USD"));

  return {
    period: `${year}-${String(month).padStart(2, "0")}`,
    transactionCount: transactions.length,
    totalCredits: credits.format(),
    totalDebits: debits.format(),
    netChange: credits.subtract(debits).format(),
  };
}
```

</details>

---

## Verification {#verification}

### verify()

Verifies the cryptographic integrity of the hash chain (synchronous).

```typescript
verify(): boolean
```

**Returns:** `true` if the entire chain is valid, `false` if tampered

**Examples:**

```typescript
import { Ledger, money } from "monetra";

const ledger = new Ledger("USD");
ledger.record(money("100.00", "USD"), {
  type: "credit",
  description: "Deposit",
});
ledger.record(money("-25.00", "USD"), {
  type: "debit",
  description: "Purchase",
});

// Verify integrity
const isValid = ledger.verify();
console.log(isValid); // true

// The verification ensures:
// 1. Each entry's hash matches its content
// 2. Each entry's previousHash matches the prior entry's hash
// 3. The chain is unbroken
```

---

### verifyAsync()

Verifies integrity asynchronously (browser-compatible).

```typescript
async verifyAsync(): Promise<boolean>
```

**Returns:** Promise resolving to verification result

**Examples:**

```typescript
import { Ledger, money } from "monetra";

const ledger = new Ledger("USD");
// ... record transactions

async function auditLedger() {
  const isValid = await ledger.verifyAsync();

  if (!isValid) {
    console.error("ALERT: Ledger integrity compromised!");
    // Trigger incident response
  }

  return isValid;
}
```

---

## Snapshots {#snapshots}

### snapshot()

Exports the ledger state for storage.

```typescript
snapshot(): LedgerSnapshot
```

**Returns:** Serializable snapshot object

**Examples:**

```typescript
import { Ledger, money } from "monetra";

const ledger = new Ledger("USD");
ledger.record(money("100.00", "USD"), {
  type: "credit",
  description: "Deposit",
});

// Export snapshot
const snapshot = ledger.snapshot();

// Store in database
await db.ledgers.save({
  userId: "user-123",
  snapshot: JSON.stringify(snapshot),
});
```

---

### Ledger.fromSnapshot()

Restores a ledger from a snapshot.

```typescript
static fromSnapshot(snapshot: LedgerSnapshot): Ledger
```

**Parameters:**

- `snapshot` - Previously saved snapshot

**Returns:** Restored `Ledger` instance

**Throws:** Error if snapshot integrity verification fails

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { Ledger } from "monetra";

// Load from database
const stored = await db.ledgers.findOne({ userId: "user-123" });
const snapshotData = JSON.parse(stored.snapshot);

// Restore ledger
const ledger = Ledger.fromSnapshot(snapshotData);

// Ledger is fully restored with all history
console.log(ledger.getBalance().format());
console.log(ledger.getHistory().length);

// Integrity is verified during restoration
// If tampered, an error is thrown
```

</details>

<details>
<summary><strong>Node.js</strong></summary>

```javascript
import { Ledger, money } from "monetra";
import fs from "fs/promises";

// Save ledger to file
async function saveLedger(ledger, filepath) {
  const snapshot = ledger.snapshot();
  await fs.writeFile(filepath, JSON.stringify(snapshot, null, 2));
}

// Load ledger from file
async function loadLedger(filepath) {
  const data = await fs.readFile(filepath, "utf-8");
  const snapshot = JSON.parse(data);
  return Ledger.fromSnapshot(snapshot);
}

// Usage
const ledger = new Ledger("USD");
ledger.record(money("1000.00", "USD"), {
  type: "credit",
  description: "Initial",
});

await saveLedger(ledger, "./ledger.json");

// Later...
const restored = await loadLedger("./ledger.json");
console.log(restored.getBalance().format()); // "$1,000.00"
```

</details>

---

## Types {#types}

### TransactionMetadata

```typescript
interface TransactionMetadata {
  type: TransactionType;
  description: string;
  reference?: string;
  tags?: string[];
  timestamp?: Date;
  [key: string]: unknown; // Custom fields allowed
}
```

### TransactionType

```typescript
type TransactionType =
  | "credit"
  | "debit"
  | "transfer"
  | "adjustment"
  | "reversal"
  | "fee"
  | string; // Custom types allowed
```

### Entry

```typescript
interface Entry {
  id: string; // UUID
  money: Money; // The transaction amount
  metadata: TransactionMetadata;
  createdAt: Date;
  previousHash: string | null;
  hash: string; // SHA-256 hash
}
```

### LedgerSnapshot

```typescript
interface LedgerSnapshot {
  version: number;
  currency: string;
  entries: SerializedEntry[];
  createdAt: string;
  hash: string;
}
```

---

## Best Practices

### Use Meaningful References

```typescript
// Good - traceable
ledger.record(amount, {
  type: "credit",
  description: "Payment for Invoice #1234",
  reference: "INV-2024-001234",
  tags: ["invoice", "client-acme"],
});

// Avoid - hard to audit
ledger.record(amount, {
  type: "credit",
  description: "Money in",
});
```

### Handle Credits and Debits Consistently

```typescript
// Convention: positive = credit, negative = debit
function deposit(ledger, amount) {
  return ledger.record(amount, { type: "credit", description: "Deposit" });
}

function withdraw(ledger, amount) {
  return ledger.record(amount.negate(), {
    type: "debit",
    description: "Withdrawal",
  });
}
```

### Regular Verification

```typescript
// Verify before critical operations
async function processWithdrawal(ledger, amount) {
  if (!(await ledger.verifyAsync())) {
    throw new Error("Ledger integrity check failed");
  }

  // Proceed with withdrawal
  return ledger.recordAsync(amount.negate(), {
    type: "debit",
    description: "Withdrawal",
  });
}
```

---

## Next Steps

- **[Financial API](./financial.md)** - Compound interest, loans, NPV, IRR
- **[Currency & Tokens](./currency.md)** - Custom currencies and crypto tokens
- **[Error Handling Guide](../guides/error-handling.md)** - Handling ledger errors
