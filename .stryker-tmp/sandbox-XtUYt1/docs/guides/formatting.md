# Formatting & Parsing Guide

Monetra provides flexible formatting options for displaying monetary values and robust parsing for converting user input back to Money objects.

---

## Table of Contents

- [Formatting Basics](#formatting-basics)
- [Locale Support](#locale-support)
- [Display Options](#display-options)
- [Parsing Input](#parsing)
- [Serialization](#serialization)
- [Framework Examples](#framework-examples)

---

## Formatting Basics {#formatting-basics}

Every `Money` object can be formatted using the `format()` method:

```typescript
import { money } from "monetra";

const amount = money("1234567.89", "USD");

// Default formatting
console.log(amount.format()); // "$1,234,567.89"

// Currency determines default format
const yen = money("123456", "JPY");
console.log(yen.format()); // "¥123,456"

const euro = money("1234.56", "EUR");
console.log(euro.format()); // "€1,234.56"
```

### Format Signature

```typescript
format(options?: {
  locale?: string;           // BCP 47 locale (e.g., "en-US", "de-DE")
  symbol?: boolean;          // Include currency symbol (default: true)
  display?: 'symbol' | 'code' | 'name';  // How to show currency
}): string
```

---

## Locale Support {#locale-support}

Format money according to different regional conventions:

```typescript
import { money } from "monetra";

const amount = money("1234567.89", "USD");

// Different locales
console.log(amount.format({ locale: "en-US" })); // "$1,234,567.89"
console.log(amount.format({ locale: "en-GB" })); // "US$1,234,567.89"
console.log(amount.format({ locale: "de-DE" })); // "1.234.567,89 $"
console.log(amount.format({ locale: "fr-FR" })); // "1 234 567,89 $US"
console.log(amount.format({ locale: "ja-JP" })); // "$1,234,567.89"
console.log(amount.format({ locale: "ar-SA" })); // "١٬٢٣٤٬٥٦٧٫٨٩ US$"

// Euro with different locales
const euro = money("1234.56", "EUR");
console.log(euro.format({ locale: "de-DE" })); // "1.234,56 €"
console.log(euro.format({ locale: "fr-FR" })); // "1 234,56 €"
console.log(euro.format({ locale: "en-IE" })); // "€1,234.56"
```

### Common Locale Patterns

| Locale | Number Format | Example      |
| ------ | ------------- | ------------ |
| en-US  | 1,234.56      | $1,234.56    |
| de-DE  | 1.234,56      | 1.234,56 €   |
| fr-FR  | 1 234,56      | 1 234,56 €   |
| ja-JP  | 1,234         | ¥1,234       |
| ar-SA  | ١٬٢٣٤         | ١٬٢٣٤ ر.س    |
| hi-IN  | 1,23,456      | ₹1,23,456.00 |
| pt-BR  | 1.234,56      | R$ 1.234,56  |

---

## Display Options {#display-options}

### Currency Display

Control how the currency identifier appears:

```typescript
import { money } from "monetra";

const amount = money("99.99", "USD");

// Symbol (default)
console.log(amount.format({ display: "symbol" }));
// "$99.99"

// ISO code
console.log(amount.format({ display: "code" }));
// "USD 99.99"

// Full name
console.log(amount.format({ display: "name" }));
// "99.99 US dollars"
```

### Without Symbol

```typescript
import { money } from "monetra";

const amount = money("1234.56", "USD");

// No symbol - just the number
console.log(amount.format({ symbol: false }));
// "1,234.56"

// Useful for tabular data
const prices = [
  money("29.99", "USD"),
  money("149.99", "USD"),
  money("9.99", "USD"),
];

console.log("USD");
prices.forEach((p) => {
  console.log(p.format({ symbol: false }).padStart(10));
});
// USD
//      29.99
//     149.99
//       9.99
```

### Combining Options

```typescript
import { money } from "monetra";

const amount = money("1234.56", "EUR");

// German format with code
console.log(
  amount.format({
    locale: "de-DE",
    display: "code",
  })
);
// "1.234,56 EUR"

// French format with name
console.log(
  amount.format({
    locale: "fr-FR",
    display: "name",
  })
);
// "1 234,56 euros"
```

---

## Parsing Input {#parsing}

### From Strings (Recommended)

The safest way to parse user input:

```typescript
import { money, Money } from "monetra";

// Parse from string (major units)
const a = money("10.50", "USD"); // $10.50
const b = money("1,234.56", "USD"); // Note: May not work with commas

// Use Money.fromMajor for explicit parsing
const c = Money.fromMajor("10.50", "USD"); // $10.50

// Clean user input before parsing
function parseUserInput(input: string, currency: string): Money {
  // Remove currency symbols, spaces, and thousand separators
  const cleaned = input
    .replace(/[$€£¥]/g, "")
    .replace(/\s/g, "")
    .replace(/,/g, ""); // Assumes US format - be careful!

  return Money.fromMajor(cleaned, currency);
}

console.log(parseUserInput("$1,234.56", "USD").format()); // "$1,234.56"
console.log(parseUserInput("€ 999,99", "EUR").format()); // Note: Careful with EU format!
```

### Locale-Aware Parsing

```typescript
import { money, Money } from "monetra";

/**
 * Parse money from a localized string
 */
function parseLocalized(
  input: string,
  currency: string,
  locale: string
): Money {
  // Get locale's number format
  const formatter = new Intl.NumberFormat(locale);
  const parts = formatter.formatToParts(1234.56);

  const groupSep = parts.find((p) => p.type === "group")?.value || ",";
  const decimalSep = parts.find((p) => p.type === "decimal")?.value || ".";

  // Clean input based on locale
  let cleaned = input
    .replace(/[^\d.,\-]/g, "") // Keep only digits, dots, commas, minus
    .replace(new RegExp(`\\${groupSep}`, "g"), ""); // Remove thousand separators

  // Normalize decimal separator
  if (decimalSep !== ".") {
    cleaned = cleaned.replace(decimalSep, ".");
  }

  return Money.fromMajor(cleaned, currency);
}

// US format
console.log(parseLocalized("$1,234.56", "USD", "en-US").format());
// "$1,234.56"

// German format
console.log(parseLocalized("1.234,56 €", "EUR", "de-DE").format());
// "€1,234.56"
```

### From Form Inputs

```typescript
import { Money, money } from "monetra";

interface MoneyInputResult {
  money: Money | null;
  error: string | null;
}

function validateMoneyInput(
  value: string,
  currency: string,
  options?: {
    min?: Money;
    max?: Money;
    required?: boolean;
  }
): MoneyInputResult {
  // Handle empty
  if (!value || value.trim() === "") {
    if (options?.required) {
      return { money: null, error: "Amount is required" };
    }
    return { money: Money.zero(currency), error: null };
  }

  try {
    // Clean and parse
    const cleaned = value.replace(/[^\d.\-]/g, "");
    const parsed = Money.fromMajor(cleaned, currency);

    // Validate range
    if (options?.min && parsed.lessThan(options.min)) {
      return {
        money: null,
        error: `Minimum amount is ${options.min.format()}`,
      };
    }

    if (options?.max && parsed.greaterThan(options.max)) {
      return {
        money: null,
        error: `Maximum amount is ${options.max.format()}`,
      };
    }

    return { money: parsed, error: null };
  } catch (e) {
    return { money: null, error: "Invalid amount format" };
  }
}

// Usage
const result = validateMoneyInput("1234.56", "USD", {
  min: money("1.00", "USD"),
  max: money("10000.00", "USD"),
  required: true,
});

if (result.error) {
  console.log("Error:", result.error);
} else {
  console.log("Parsed:", result.money?.format());
}
```

---

## Serialization {#serialization}

### JSON Serialization

```typescript
import { money, Money } from "monetra";

const amount = money("99.99", "USD");

// Serialize
const json = amount.toJSON();
console.log(json);
// { amount: "9999", currency: "USD", precision: 2 }

const jsonString = JSON.stringify(amount);
console.log(jsonString);
// '{"amount":"9999","currency":"USD","precision":2}'

// Deserialize
function deserializeMoney(json: string | object): Money {
  const data = typeof json === "string" ? JSON.parse(json) : json;
  return Money.fromMinor(BigInt(data.amount), data.currency);
}

const restored = deserializeMoney(jsonString);
console.log(restored.format()); // "$99.99"
```

### Database Storage

```typescript
import { Money, money } from "monetra";

// Option 1: Store as minor units (integer) + currency code
interface MoneyRecord {
  amount_minor: bigint; // or string for databases without BigInt
  currency_code: string;
}

function toRecord(m: Money): MoneyRecord {
  return {
    amount_minor: m.minor,
    currency_code: m.currency.code,
  };
}

function fromRecord(record: MoneyRecord): Money {
  return Money.fromMinor(record.amount_minor, record.currency_code);
}

// Option 2: Store as decimal string + currency
interface MoneyStringRecord {
  amount: string; // "123.45"
  currency: string; // "USD"
}

function toStringRecord(m: Money): MoneyStringRecord {
  return {
    amount: m.format({ symbol: false }).replace(/,/g, ""),
    currency: m.currency.code,
  };
}

function fromStringRecord(record: MoneyStringRecord): Money {
  return Money.fromMajor(record.amount, record.currency);
}
```

---

## Framework Examples {#framework-examples}

<details open>
<summary><strong>React.js - Money Input Component</strong></summary>

```tsx
import React, { useState, useCallback, useEffect } from "react";
import { Money, money, getCurrency } from "monetra";

interface MoneyInputProps {
  value: Money | null;
  onChange: (value: Money | null) => void;
  currency: string;
  placeholder?: string;
  min?: Money;
  max?: Money;
}

function MoneyInput({
  value,
  onChange,
  currency,
  placeholder = "0.00",
  min,
  max,
}: MoneyInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const currencyInfo = getCurrency(currency);

  // Sync external value changes
  useEffect(() => {
    if (value) {
      setInputValue(value.format({ symbol: false }).replace(/,/g, ""));
    } else {
      setInputValue("");
    }
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setInputValue(raw);

      // Allow empty
      if (!raw.trim()) {
        setError(null);
        onChange(null);
        return;
      }

      // Validate format
      const regex = new RegExp(`^-?\\d*\\.?\\d{0,${currencyInfo.decimals}}$`);
      if (!regex.test(raw)) {
        setError(`Maximum ${currencyInfo.decimals} decimal places`);
        return;
      }

      try {
        const parsed = Money.fromMajor(raw, currency);

        if (min && parsed.lessThan(min)) {
          setError(`Minimum: ${min.format()}`);
          return;
        }

        if (max && parsed.greaterThan(max)) {
          setError(`Maximum: ${max.format()}`);
          return;
        }

        setError(null);
        onChange(parsed);
      } catch {
        setError("Invalid amount");
      }
    },
    [currency, currencyInfo.decimals, min, max, onChange]
  );

  return (
    <div className="money-input">
      <span className="currency-symbol">{currencyInfo.symbol}</span>
      <input
        type="text"
        inputMode="decimal"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={error ? "error" : ""}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

// Usage
function PaymentForm() {
  const [amount, setAmount] = useState<Money | null>(null);

  return (
    <div>
      <label>Payment Amount</label>
      <MoneyInput
        value={amount}
        onChange={setAmount}
        currency="USD"
        min={money("1.00", "USD")}
        max={money("10000.00", "USD")}
      />
      {amount && <p>You'll pay: {amount.format()}</p>}
    </div>
  );
}
```

</details>

<details>
<summary><strong>Vue.js - Currency Display Component</strong></summary>

```vue
<script setup lang="ts">
import { computed, PropType } from "vue";
import { Money, money } from "monetra";

type DisplayFormat = "symbol" | "code" | "name";

const props = defineProps({
  value: {
    type: [Object, String, Number] as PropType<Money | string | number>,
    required: true,
  },
  currency: {
    type: String,
    default: "USD",
  },
  locale: {
    type: String,
    default: undefined,
  },
  display: {
    type: String as PropType<DisplayFormat>,
    default: "symbol",
  },
  showSign: {
    type: Boolean,
    default: false,
  },
});

const moneyValue = computed((): Money => {
  if (props.value instanceof Money) {
    return props.value;
  }
  if (typeof props.value === "number") {
    return Money.fromMinor(props.value, props.currency);
  }
  return money(props.value, props.currency);
});

const formatted = computed(() => {
  const m = moneyValue.value;
  let result = m.format({
    locale: props.locale,
    display: props.display,
  });

  if (props.showSign && m.isPositive()) {
    result = "+" + result;
  }

  return result;
});

const colorClass = computed(() => {
  const m = moneyValue.value;
  if (m.isPositive()) return "positive";
  if (m.isNegative()) return "negative";
  return "zero";
});
</script>

<template>
  <span :class="['money-display', colorClass]">
    {{ formatted }}
  </span>
</template>

<style scoped>
.money-display {
  font-variant-numeric: tabular-nums;
}
.positive {
  color: #22c55e;
}
.negative {
  color: #ef4444;
}
.zero {
  color: #6b7280;
}
</style>
```

</details>

<details>
<summary><strong>Node.js - API Responses</strong></summary>

```javascript
import { Money, money } from "monetra";
import express from "express";

const app = express();

/**
 * Serialize Money for API responses
 */
function serializeMoney(m) {
  return {
    amount: m.format({ symbol: false }).replace(/,/g, ""),
    amountMinor: m.minor.toString(),
    currency: m.currency.code,
    formatted: m.format(),
    formattedCode: m.format({ display: "code" }),
  };
}

/**
 * Deserialize Money from API requests
 */
function deserializeMoney(data) {
  if (data.amountMinor) {
    return Money.fromMinor(BigInt(data.amountMinor), data.currency);
  }
  return Money.fromMajor(data.amount, data.currency);
}

// Middleware to parse money fields in request body
function parseMoneyFields(...fields) {
  return (req, res, next) => {
    for (const field of fields) {
      if (req.body[field]) {
        try {
          req.body[field] = deserializeMoney(req.body[field]);
        } catch (e) {
          return res.status(400).json({
            error: `Invalid money format for field: ${field}`,
          });
        }
      }
    }
    next();
  };
}

// Example endpoints
app.get("/api/products/:id", async (req, res) => {
  const product = await getProduct(req.params.id);

  res.json({
    id: product.id,
    name: product.name,
    price: serializeMoney(product.price),
    salePrice: product.salePrice ? serializeMoney(product.salePrice) : null,
  });
});

app.post(
  "/api/orders",
  parseMoneyFields("total", "shipping"),
  async (req, res) => {
    const { items, total, shipping } = req.body;

    // total and shipping are now Money objects
    const order = await createOrder({
      items,
      total: total, // Money instance
      shipping: shipping, // Money instance
    });

    res.json({
      orderId: order.id,
      total: serializeMoney(order.total),
      shipping: serializeMoney(order.shipping),
    });
  }
);
```

</details>

---

## Custom Formatters

### Compact Notation

```typescript
import { Money, money } from "monetra";

function formatCompact(m: Money): string {
  const value = Number(m.minor) / 10 ** m.currency.decimals;

  if (Math.abs(value) >= 1_000_000_000) {
    return `${m.currency.symbol}${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `${m.currency.symbol}${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${m.currency.symbol}${(value / 1_000).toFixed(1)}K`;
  }

  return m.format();
}

console.log(formatCompact(money("1234567890", "USD"))); // "$1.2B"
console.log(formatCompact(money("5432100", "USD"))); // "$5.4M"
console.log(formatCompact(money("42500", "USD"))); // "$42.5K"
console.log(formatCompact(money("999", "USD"))); // "$999.00"
```

### Accounting Format

```typescript
import { Money, money } from "monetra";

function formatAccounting(m: Money): string {
  if (m.isNegative()) {
    return `(${m.abs().format()})`;
  }
  return m.format();
}

console.log(formatAccounting(money("1234.56", "USD"))); // "$1,234.56"
console.log(formatAccounting(money("-1234.56", "USD"))); // "($1,234.56)"
```

---

## Best Practices

1. **Store amounts as minor units (integers)** - More precise than decimals
2. **Store currency code with every amount** - Never assume currency
3. **Use locale for display, not storage** - Formatting is a view concern
4. **Validate on input** - Reject invalid formats early
5. **Use `toJSON()` for serialization** - Consistent format across your app

---

## Next Steps

- **[Allocation Guide](./allocation.md)** - Splitting money
- **[Custom Tokens](./custom-tokens.md)** - Define custom currencies
- **[API Reference](../api/money.md)** - Full Money API
