# Monetra v2.0 Migration Guide

This guide helps you upgrade from Monetra v1.x to v2.0. While v2.0 is largely backward compatible, there are a few breaking changes and many new features to be aware of.

## Table of Contents

1. [Breaking Changes](#breaking-changes)
2. [New Features](#new-features)
3. [Migration Steps](#migration-steps)
4. [Deprecation Notices](#deprecation-notices)

---

## Breaking Changes

### 1. LedgerSnapshot now includes a `version` field

If you're persisting ledger snapshots, the shape has changed:

```typescript
// v1.x
interface LedgerSnapshot {
  entries: Entry[];
  balance: Money;
  currency: string;
  createdAt: Date;
  checksum: string;
}

// v2.0
interface LedgerSnapshot {
  version: number; // NEW - always 2 in v2.0
  entries: Entry[];
  balance: Money;
  currency: string;
  createdAt: Date;
  checksum: string;
}
```

**Migration**: Add a version check when loading old snapshots:

```typescript
function loadSnapshot(data: unknown): LedgerSnapshot {
  const snapshot = data as LedgerSnapshot;
  // Handle v1.x snapshots that don't have version
  if (!("version" in snapshot)) {
    return { ...snapshot, version: 1 };
  }
  return snapshot;
}
```

### 2. Custom Error Classes now require error codes

If you extend `MonetraError`, you must now pass an error code:

```typescript
// v1.x
class MyError extends MonetraError {
  constructor(message: string) {
    super(message);
  }
}

// v2.0
import { MonetraError, MonetraErrorCode } from "monetra";

class MyError extends MonetraError {
  constructor(message: string) {
    super(message, MonetraErrorCode.INVALID_PRECISION); // or a custom code
  }
}
```

### 3. Ledger async methods in browsers

In browser environments, the synchronous `record()`, `verify()`, and `snapshot()` methods may throw if SubtleCrypto is the only available crypto implementation. Use the async versions instead:

```typescript
// Node.js (sync still works)
const entry = ledger.record(money, metadata);

// Browser (use async)
const entry = await ledger.recordAsync(money, metadata);
await ledger.verifyAsync();
const snapshot = await ledger.snapshotAsync();
```

---

## New Features

### Method Aliases for Discoverability

```typescript
// These are now available alongside the original methods:
Money.fromCents(100, "USD"); // Same as fromMinor
Money.fromDecimal("10.50", "USD"); // Same as fromMajor
```

### New Money Methods

```typescript
const money = Money.fromDecimal("75.00", "USD");

// Clamp between bounds
const clamped = money.clamp(
  Money.fromDecimal("50.00", "USD"),
  Money.fromDecimal("100.00", "USD")
);

// Get raw decimal string (no formatting)
const decimal = money.toDecimalString(); // "75.00"

// JSON round-trip support
const json = JSON.stringify(money);
const restored = JSON.parse(json, Money.reviver);
```

### TRUNCATE Rounding Mode

```typescript
import { RoundingMode } from "monetra";

const money = Money.fromCents(999, "USD"); // $9.99
const divided = money.divide(4, { rounding: RoundingMode.TRUNCATE });
// Truncates towards zero
```

### Accounting Format

```typescript
const negative = Money.fromDecimal("-100.00", "USD");
negative.format({ accounting: true }); // "($100.00)"
```

### Locale-Aware Parsing

```typescript
import { parseLocaleString, parseLocaleToMinor } from "monetra";

// Parse German-formatted numbers
parseLocaleString("1.234,56", { locale: "de-DE" }); // "1234.56"

// Parse directly to minor units
parseLocaleToMinor("1.234,56", EUR, { locale: "de-DE" }); // 123456n
```

### Rate Abstraction

```typescript
import { Rate } from "monetra";

const annualRate = Rate.percent(12); // 12% annual
const monthlyRate = annualRate.periodic(12); // 1% monthly

monthlyRate.toPercent(); // 1
monthlyRate.toDecimal(); // 0.01
monthlyRate.compoundFactor(12); // (1.01)^12
```

### Historical Exchange Rates

```typescript
import { Converter } from "monetra";

const converter = new Converter("USD", { EUR: 0.92 });

// Add historical rates
converter.addHistoricalRate("EUR", 0.85, new Date("2024-01-01"));
converter.addHistoricalRate("EUR", 0.88, new Date("2024-06-01"));

// Convert using historical rate
const money = Money.fromDecimal("100", "USD");
const converted = converter.convert(money, "EUR", {
  date: new Date("2024-03-15"),
});
```

### Error Codes for Programmatic Handling

```typescript
import { MonetraErrorCode, CurrencyMismatchError } from "monetra";

try {
  usd.add(eur);
} catch (error) {
  if (error instanceof CurrencyMismatchError) {
    console.log(error.code); // "MONETRA_CURRENCY_MISMATCH"
    console.log(error.expected); // "USD"
    console.log(error.received); // "EUR"
  }
}
```

---

## Migration Steps

### Step 1: Update Dependencies

```bash
npm install monetra@2.0.0
```

### Step 2: Update Snapshot Handling (if using Ledger)

```typescript
// Before loading snapshots, add version handling
const snapshot = loadSnapshotFromStorage();
if (!snapshot.version) {
  snapshot.version = 1; // Mark as v1 format
}
const ledger = Ledger.fromSnapshot(snapshot);
```

### Step 3: Update Browser Code to Use Async Methods

```typescript
// Old (may fail in browser)
const entry = ledger.record(money, metadata);

// New (works everywhere)
const entry = await ledger.recordAsync(money, metadata);
```

### Step 4: Update Custom Error Classes

```typescript
import { MonetraError, MonetraErrorCode } from "monetra";

class CustomError extends MonetraError {
  constructor(message: string) {
    super(message, MonetraErrorCode.INVALID_PRECISION);
  }
}
```

### Step 5: Take Advantage of New Features

- Replace `fromMinor` with `fromCents` for better readability
- Use `toDecimalString()` for storage instead of parsing `format()` output
- Use `Money.reviver` for JSON serialization/deserialization
- Use `Rate` class for interest rate calculations

---

## Deprecation Notices

No methods were deprecated in v2.0. All v1.x APIs remain fully functional.

---

## Getting Help

If you encounter issues during migration:

1. Check the [API Reference](./005-API-REFERENCE.md)
2. Open an issue on [GitHub](https://github.com/zugobite/monetra/issues)
3. Review the [CHANGELOG](../CHANGELOG.md) for detailed changes
