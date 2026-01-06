# Error Handling Guide

Monetra provides typed, descriptive errors to help you handle edge cases gracefully. All errors extend `MonetraError` and include error codes for programmatic handling.

---

## Table of Contents

- [Error Types](#error-types)
- [Error Codes](#error-codes)
- [Handling Errors](#handling-errors)
- [Validation Strategies](#validation-strategies)
- [Framework Examples](#framework-examples)
- [Best Practices](#best-practices)

---

## Error Types {#error-types}

### MonetraError (Base)

All Monetra errors extend this base class:

```typescript
import { MonetraError, MonetraErrorCode } from "monetra";

try {
  // Some operation
} catch (error) {
  if (error instanceof MonetraError) {
    console.log(error.name); // Error class name
    console.log(error.message); // Descriptive message
    console.log(error.code); // MonetraErrorCode for programmatic handling
  }
}
```

### CurrencyMismatchError

Thrown when performing operations on Money objects with different currencies:

```typescript
import { money, CurrencyMismatchError } from "monetra";

const usd = money("100.00", "USD");
const eur = money("50.00", "EUR");

try {
  usd.add(eur); // Error: Cannot add different currencies
} catch (error) {
  if (error instanceof CurrencyMismatchError) {
    console.log(error.expected); // "USD"
    console.log(error.received); // "EUR"
    console.log(error.code); // "MONETRA_CURRENCY_MISMATCH"

    // Error message includes helpful tip:
    // "Currency mismatch: expected USD, received EUR.
    //  Tip: Use a Converter to convert between currencies..."
  }
}
```

**When it occurs:**

- Adding/subtracting Money with different currencies
- Comparing Money with different currencies
- Ledger operations with mismatched currencies

**Solution:**

```typescript
import { money, Converter } from "monetra";

const usd = money("100.00", "USD");
const eur = money("50.00", "EUR");

// Convert to same currency first
const converter = new Converter("USD", { EUR: 0.92 });
const eurInUsd = converter.convert(eur, "USD");

const total = usd.add(eurInUsd); // Now works
```

---

### RoundingRequiredError

Thrown when an operation produces a non-integer result but no rounding mode is specified:

```typescript
import { money, RoundingRequiredError, RoundingMode } from "monetra";

const price = money("100.00", "USD");

try {
  price.divide(3); // Error: 100 / 3 = 33.333... requires rounding
} catch (error) {
  if (error instanceof RoundingRequiredError) {
    console.log(error.code); // "MONETRA_ROUNDING_REQUIRED"

    // Error message includes helpful tip:
    // "Rounding required for divide: result 33.33333... is not an integer.
    //  Tip: Provide a rounding mode:
    //     money.divide(value, { rounding: RoundingMode.HALF_UP })"
  }
}
```

**When it occurs:**

- Division that doesn't result in exact integers
- Percentage calculations
- Currency conversions

**Solution:**

```typescript
import { money, RoundingMode } from "monetra";

const price = money("100.00", "USD");

// Provide a rounding mode
const third = price.divide(3, { rounding: RoundingMode.HALF_UP });
console.log(third.format()); // "$33.33"

// Or use allocate() for lossless division
const parts = price.allocate([1, 1, 1]);
console.log(parts.map((p) => p.format()));
// ["$33.34", "$33.33", "$33.33"]  ← No cents lost!
```

---

### InvalidPrecisionError

Thrown when a value exceeds the currency's allowed decimal places:

```typescript
import { money, InvalidPrecisionError } from "monetra";

try {
  // USD has 2 decimal places
  money("100.001", "USD"); // Error: Too many decimals
} catch (error) {
  if (error instanceof InvalidPrecisionError) {
    console.log(error.code); // "MONETRA_INVALID_PRECISION"
    console.log(error.message);
  }
}
```

**When it occurs:**

- Creating Money with more decimals than the currency allows
- Parsing user input with invalid precision

**Solution:**

```typescript
import { money, RoundingMode } from "monetra";

// Option 1: Round the input
const amount = money("100.001", "USD", { rounding: RoundingMode.HALF_UP });
console.log(amount.format()); // "$100.00"

// Option 2: Validate input before creating
function validateDecimalPlaces(value: string, maxDecimals: number): boolean {
  const parts = value.split(".");
  return parts.length === 1 || parts[1].length <= maxDecimals;
}

if (validateDecimalPlaces("100.001", 2)) {
  // Safe to create
}
```

---

### InsufficientFundsError

Thrown when attempting a withdrawal or transfer without enough balance:

```typescript
import { Ledger, money, InsufficientFundsError } from "monetra";

const ledger = new Ledger({ currency: "USD" });
ledger.credit("wallet", money("50.00", "USD"), "deposit");

try {
  ledger.debit("wallet", money("100.00", "USD"), "withdrawal"); // Error: Not enough
} catch (error) {
  if (error instanceof InsufficientFundsError) {
    console.log(error.code); // "MONETRA_INSUFFICIENT_FUNDS"
    console.log(error.message);
  }
}
```

**When it occurs:**

- Ledger debit exceeds account balance
- Wallet withdrawal attempts

**Solution:**

```typescript
import { Ledger, money } from "monetra";

const ledger = new Ledger({ currency: "USD" });
const balance = ledger.getBalance("wallet");
const withdrawal = money("100.00", "USD");

// Check before attempting
if (balance.gte(withdrawal)) {
  ledger.debit("wallet", withdrawal, "withdrawal");
} else {
  // Handle insufficient funds gracefully
  console.log("Not enough funds");
}
```

---

### OverflowError

Thrown when arithmetic exceeds safe integer bounds:

```typescript
import { money, OverflowError } from "monetra";

try {
  const huge = money("999999999999999999999999", "USD");
  huge.multiply(999999999999); // Error: Result too large
} catch (error) {
  if (error instanceof OverflowError) {
    console.log(error.code); // "MONETRA_OVERFLOW"
    console.log(error.message);
  }
}
```

**When it occurs:**

- Multiplication of very large amounts
- Exponentiation with large values
- Compound interest calculations over many periods

**Solution:**

```typescript
// Break operations into smaller steps
// or use reasonable financial limits
const MAX_AMOUNT = 1_000_000_000_00n; // $1 billion in cents

function safeMultiply(m: Money, factor: number): Money | null {
  const result = m.multiply(factor);
  if (result.minor > MAX_AMOUNT) {
    return null; // Handle overflow case
  }
  return result;
}
```

---

## Error Codes {#error-codes}

Use error codes for programmatic error handling:

```typescript
import { MonetraError, MonetraErrorCode } from "monetra";

try {
  // Some operation
} catch (error) {
  if (error instanceof MonetraError) {
    switch (error.code) {
      case MonetraErrorCode.CURRENCY_MISMATCH:
        // Handle currency mismatch
        break;
      case MonetraErrorCode.ROUNDING_REQUIRED:
        // Handle rounding requirement
        break;
      case MonetraErrorCode.INVALID_PRECISION:
        // Handle precision error
        break;
      case MonetraErrorCode.INSUFFICIENT_FUNDS:
        // Handle insufficient funds
        break;
      case MonetraErrorCode.OVERFLOW:
        // Handle overflow
        break;
    }
  }
}
```

### Error Code Reference

| Code                         | Constant                              | Description                        |
| ---------------------------- | ------------------------------------- | ---------------------------------- |
| `MONETRA_CURRENCY_MISMATCH`  | `MonetraErrorCode.CURRENCY_MISMATCH`  | Operations on different currencies |
| `MONETRA_ROUNDING_REQUIRED`  | `MonetraErrorCode.ROUNDING_REQUIRED`  | Division requires rounding mode    |
| `MONETRA_INVALID_PRECISION`  | `MonetraErrorCode.INVALID_PRECISION`  | Too many decimal places            |
| `MONETRA_INSUFFICIENT_FUNDS` | `MonetraErrorCode.INSUFFICIENT_FUNDS` | Not enough balance                 |
| `MONETRA_OVERFLOW`           | `MonetraErrorCode.OVERFLOW`           | Arithmetic overflow                |

---

## Handling Errors {#handling-errors}

### Type-Safe Error Handling

```typescript
import {
  money,
  MonetraError,
  CurrencyMismatchError,
  RoundingRequiredError,
  InvalidPrecisionError,
  InsufficientFundsError,
  OverflowError,
  RoundingMode,
} from "monetra";

function performCalculation(amount: string, currency: string) {
  try {
    const m = money(amount, currency);
    return m.divide(3, { rounding: RoundingMode.HALF_UP });
  } catch (error) {
    if (error instanceof InvalidPrecisionError) {
      return { error: "Invalid amount format", type: "validation" };
    }
    if (error instanceof RoundingRequiredError) {
      return { error: "Calculation error", type: "internal" };
    }
    if (error instanceof MonetraError) {
      return { error: error.message, type: "money" };
    }
    throw error; // Re-throw unexpected errors
  }
}
```

### Result Pattern

```typescript
import { money, Money, MonetraError, RoundingMode } from "monetra";

type Result<T> =
  | { success: true; value: T }
  | { success: false; error: string; code: string };

function safeMoney(amount: string, currency: string): Result<Money> {
  try {
    return {
      success: true,
      value: money(amount, currency),
    };
  } catch (error) {
    if (error instanceof MonetraError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }
    return {
      success: false,
      error: "Unknown error",
      code: "UNKNOWN",
    };
  }
}

// Usage
const result = safeMoney("100.50", "USD");
if (result.success) {
  console.log(result.value.format());
} else {
  console.error(result.error);
}
```

---

## Validation Strategies {#validation-strategies}

### Input Validation

```typescript
import { getCurrency, money, MonetraError, RoundingMode } from "monetra";

interface ValidationResult {
  valid: boolean;
  error?: string;
  money?: Money;
}

function validateMoneyInput(
  amount: string,
  currencyCode: string
): ValidationResult {
  // Check currency exists
  let currency;
  try {
    currency = getCurrency(currencyCode);
  } catch {
    return { valid: false, error: `Unknown currency: ${currencyCode}` };
  }

  // Check amount format
  if (!/^-?\d+(\.\d+)?$/.test(amount)) {
    return { valid: false, error: "Invalid number format" };
  }

  // Check decimal places
  const parts = amount.split(".");
  if (parts[1] && parts[1].length > currency.decimals) {
    return {
      valid: false,
      error: `${currencyCode} only allows ${currency.decimals} decimal places`,
    };
  }

  // Check for negative (if not allowed)
  if (parseFloat(amount) < 0) {
    return { valid: false, error: "Amount cannot be negative" };
  }

  // Create Money object
  try {
    const m = money(amount, currency);
    return { valid: true, money: m };
  } catch (error) {
    if (error instanceof MonetraError) {
      return { valid: false, error: error.message };
    }
    throw error;
  }
}
```

### Ledger Validation

```typescript
import { Ledger, money, Money, MonetraError, MonetraErrorCode } from "monetra";

interface TransferResult {
  success: boolean;
  error?: string;
  transactionId?: string;
}

function safeTransfer(
  ledger: Ledger,
  from: string,
  to: string,
  amount: Money,
  description: string
): TransferResult {
  // Pre-validation
  const fromBalance = ledger.getBalance(from);
  if (fromBalance.lt(amount)) {
    return {
      success: false,
      error: `Insufficient funds: need ${amount.format()}, have ${fromBalance.format()}`,
    };
  }

  try {
    const txId = ledger.transfer(from, to, amount, description);
    return { success: true, transactionId: txId };
  } catch (error) {
    if (error instanceof MonetraError) {
      return { success: false, error: error.message };
    }
    throw error;
  }
}
```

---

## Framework Examples {#framework-examples}

<details open>
<summary><strong>React.js - Form Validation</strong></summary>

```tsx
import React, { useState, FormEvent } from "react";
import {
  money,
  Money,
  getCurrency,
  MonetraError,
  MonetraErrorCode,
  InvalidPrecisionError,
  RoundingMode,
} from "monetra";

interface FormState {
  amount: string;
  currency: string;
  error: string | null;
}

function PaymentForm() {
  const [form, setForm] = useState<FormState>({
    amount: "",
    currency: "USD",
    error: null,
  });

  const validateAndSubmit = (e: FormEvent) => {
    e.preventDefault();

    try {
      // Attempt to create Money object
      const payment = money(form.amount, form.currency);

      // Additional validation
      if (payment.isZero() || payment.isNegative()) {
        setForm((prev) => ({
          ...prev,
          error: "Amount must be greater than zero",
        }));
        return;
      }

      // Success - proceed with payment
      console.log("Processing payment:", payment.format());
      setForm((prev) => ({ ...prev, error: null }));
    } catch (error) {
      if (error instanceof InvalidPrecisionError) {
        const currency = getCurrency(form.currency);
        setForm((prev) => ({
          ...prev,
          error: `Please enter up to ${currency.decimals} decimal places`,
        }));
      } else if (error instanceof MonetraError) {
        setForm((prev) => ({ ...prev, error: error.message }));
      } else {
        setForm((prev) => ({ ...prev, error: "Invalid amount" }));
      }
    }
  };

  return (
    <form onSubmit={validateAndSubmit}>
      <div className="form-group">
        <label>Amount</label>
        <input
          type="text"
          value={form.amount}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              amount: e.target.value,
              error: null, // Clear error on change
            }))
          }
          placeholder="0.00"
        />
      </div>

      <div className="form-group">
        <label>Currency</label>
        <select
          value={form.currency}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              currency: e.target.value,
            }))
          }
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      {form.error && (
        <div className="error-message" role="alert">
          {form.error}
        </div>
      )}

      <button type="submit">Pay</button>
    </form>
  );
}
```

</details>

<details>
<summary><strong>Vue.js - Composable Error Handling</strong></summary>

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import {
  money,
  Money,
  MonetraError,
  MonetraErrorCode,
  RoundingMode,
} from "monetra";

// Composable for money operations with error handling
function useMoneyOperation() {
  const error = ref<string | null>(null);
  const errorCode = ref<string | null>(null);

  function execute<T>(
    operation: () => T,
    errorMessages?: Partial<Record<MonetraErrorCode, string>>
  ): T | null {
    error.value = null;
    errorCode.value = null;

    try {
      return operation();
    } catch (e) {
      if (e instanceof MonetraError) {
        errorCode.value = e.code;
        error.value = errorMessages?.[e.code as MonetraErrorCode] ?? e.message;
      } else {
        error.value = "An unexpected error occurred";
      }
      return null;
    }
  }

  return { error, errorCode, execute };
}

const amount = ref("100.00");
const divisor = ref("3");
const { error, execute } = useMoneyOperation();

const result = computed(() => {
  if (!amount.value || !divisor.value) return null;

  return execute(
    () => {
      const m = money(amount.value, "USD");
      return m.divide(parseFloat(divisor.value), {
        rounding: RoundingMode.HALF_UP,
      });
    },
    {
      [MonetraErrorCode.INVALID_PRECISION]:
        "Please enter a valid dollar amount",
      [MonetraErrorCode.ROUNDING_REQUIRED]: "Division requires rounding",
    }
  );
});
</script>

<template>
  <div class="calculator">
    <input v-model="amount" type="text" placeholder="Amount" />
    <span>÷</span>
    <input v-model="divisor" type="text" placeholder="Divisor" />

    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="result" class="result">Result: {{ result.format() }}</div>
  </div>
</template>
```

</details>

<details>
<summary><strong>Node.js - API Error Responses</strong></summary>

```typescript
import express, { Request, Response, NextFunction } from "express";
import {
  money,
  Ledger,
  MonetraError,
  MonetraErrorCode,
  CurrencyMismatchError,
  InsufficientFundsError,
  InvalidPrecisionError,
  RoundingRequiredError,
  RoundingMode,
} from "monetra";

const app = express();
app.use(express.json());

// Error response helper
function monetraErrorResponse(error: MonetraError) {
  const statusMap: Record<string, number> = {
    [MonetraErrorCode.CURRENCY_MISMATCH]: 400,
    [MonetraErrorCode.INVALID_PRECISION]: 400,
    [MonetraErrorCode.ROUNDING_REQUIRED]: 400,
    [MonetraErrorCode.INSUFFICIENT_FUNDS]: 422,
    [MonetraErrorCode.OVERFLOW]: 400,
  };

  return {
    status: statusMap[error.code] ?? 500,
    body: {
      error: {
        code: error.code,
        message: error.message,
        type: error.name,
      },
    },
  };
}

// Global error handler for Monetra errors
function monetraErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof MonetraError) {
    const { status, body } = monetraErrorResponse(err);
    return res.status(status).json(body);
  }
  next(err);
}

const ledger = new Ledger({ currency: "USD" });

// Transfer endpoint with error handling
app.post("/api/transfer", async (req, res, next) => {
  try {
    const { from, to, amount } = req.body;

    // Validate input
    if (!from || !to || !amount) {
      return res.status(400).json({
        error: { code: "MISSING_FIELDS", message: "Missing required fields" },
      });
    }

    // Create money object
    const transferAmount = money(amount, "USD");

    // Perform transfer
    const txId = ledger.transfer(from, to, transferAmount, "API transfer");

    res.json({
      success: true,
      transactionId: txId,
      amount: transferAmount.format(),
    });
  } catch (error) {
    next(error);
  }
});

// Calculate split with proper error handling
app.post("/api/split", async (req, res, next) => {
  try {
    const { amount, ways } = req.body;

    const total = money(amount, "USD");
    const parts = total.allocate(Array(ways).fill(1));

    res.json({
      total: total.format(),
      parts: parts.map((p) => p.format()),
      each: parts[0].format(),
    });
  } catch (error) {
    next(error);
  }
});

app.use(monetraErrorHandler);

app.listen(3000);
```

</details>

---

## Best Practices {#best-practices}

### 1. Always Catch Specific Errors

```typescript
import {
  money,
  CurrencyMismatchError,
  RoundingRequiredError,
  InvalidPrecisionError,
  MonetraError,
} from "monetra";

try {
  // Operation
} catch (error) {
  // Handle specific errors first
  if (error instanceof CurrencyMismatchError) {
    // Handle currency mismatch
  } else if (error instanceof RoundingRequiredError) {
    // Handle rounding requirement
  } else if (error instanceof InvalidPrecisionError) {
    // Handle precision error
  } else if (error instanceof MonetraError) {
    // Handle any other Monetra error
  } else {
    throw error; // Re-throw unexpected errors
  }
}
```

### 2. Validate Before Operating

```typescript
import { money, getCurrency, Ledger, Money } from "monetra";

// Validate currency exists
function isValidCurrency(code: string): boolean {
  try {
    getCurrency(code);
    return true;
  } catch {
    return false;
  }
}

// Validate balance before operation
function canWithdraw(ledger: Ledger, account: string, amount: Money): boolean {
  const balance = ledger.getBalance(account);
  return balance.gte(amount);
}
```

### 3. Use Error Codes in Logs

```typescript
import { MonetraError } from "monetra";

function logMoneyError(error: MonetraError, context: object) {
  console.error({
    errorCode: error.code,
    errorType: error.name,
    message: error.message,
    timestamp: new Date().toISOString(),
    ...context,
  });
}
```

### 4. Provide User-Friendly Messages

```typescript
import { MonetraError, MonetraErrorCode } from "monetra";

const userMessages: Record<MonetraErrorCode, string> = {
  [MonetraErrorCode.CURRENCY_MISMATCH]: "Please select matching currencies",
  [MonetraErrorCode.ROUNDING_REQUIRED]: "Unable to calculate exact amount",
  [MonetraErrorCode.INVALID_PRECISION]: "Please enter a valid amount",
  [MonetraErrorCode.INSUFFICIENT_FUNDS]:
    "Not enough balance for this transaction",
  [MonetraErrorCode.OVERFLOW]: "Amount is too large to process",
};

function getUserMessage(error: MonetraError): string {
  return userMessages[error.code as MonetraErrorCode] ?? "An error occurred";
}
```

---

## Next Steps

- **[Best Practices](../best-practices.md)** - Patterns and anti-patterns
- **[API Reference](../api/money.md)** - Full Money API
- **[Allocation Guide](./allocation.md)** - Avoid rounding errors
