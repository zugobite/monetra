# Ledger System

The Ledger module provides an immutable, cryptographically verifiable transaction history for your application. It uses SHA-256 hash chains to ensure that no transaction can be altered without breaking the chain.

## Installation

The Ledger module is part of the core package but can be imported separately:

```typescript
import { Ledger } from "monetra/ledger";
```

## Basic Usage

### Creating a Ledger

```typescript
import { Ledger } from "monetra/ledger";
import { USD } from "monetra/currency";

const ledger = new Ledger(USD);
```

### Recording Transactions

```typescript
import { Money } from "monetra";

const entry = ledger.record(
  Money.fromMajor("100.00", USD),
  {
    type: "DEPOSIT",
    description: "Initial funding",
    reference: "REF-001"
  }
);

console.log(entry.hash); // SHA-256 hash of the entry
```

### Verifying Integrity

You can verify the integrity of the ledger at any time. This checks that every entry's `previousHash` matches the hash of the preceding entry and that the content hashes are correct.

```typescript
const isValid = ledger.verify();
if (!isValid) {
  console.error("Ledger has been tampered with!");
}
```

### Querying History

```typescript
const history = ledger.getHistory();

// Filter transactions
const deposits = ledger.query({
  type: "DEPOSIT",
  minAmount: Money.fromMajor("50.00", USD)
});
```

## Immutability

The ledger entries are frozen upon creation. Attempting to modify them will throw an error in strict mode or fail silently in non-strict mode.

```typescript
const history = ledger.getHistory();
// history[0].metadata.description = "Changed"; // Throws Error
```

## Snapshots

You can export and import snapshots for backup or auditing.

```typescript
const snapshot = ledger.snapshot();
// Save snapshot to database or file...

// Restore
const restoredLedger = Ledger.fromSnapshot(snapshot);
```

## Next Steps

- [Financial Math](003-FINANCIAL-MATH.md)
