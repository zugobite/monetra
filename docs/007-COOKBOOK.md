# Monetra Cookbook

A collection of practical recipes and patterns for common money-handling scenarios.

## Table of Contents

1. [Basic Operations](#basic-operations)
2. [E-commerce](#e-commerce)
3. [Subscriptions & Billing](#subscriptions--billing)
4. [Multi-Currency](#multi-currency)
5. [Financial Calculations](#financial-calculations)
6. [Serialization](#serialization)
7. [Auditing & Compliance](#auditing--compliance)
8. [Cryptocurrency](#cryptocurrency)

---

## Basic Operations

### Creating Money

```typescript
import { Money, money } from "monetra";

// From cents/minor units
const fromCents = Money.fromCents(1000, "USD"); // $10.00

// From decimal string (recommended for user input)
const fromString = Money.fromDecimal("10.50", "USD"); // $10.50

// Smart helper (detects type automatically)
const smart = money("10.50", "USD"); // $10.50
const smartCents = money(1050, "USD"); // $10.50

// From floating-point (use with caution)
const fromFloat = Money.fromFloat(10.5, "USD", { suppressWarning: true });
```

### Safe Arithmetic

```typescript
const price = Money.fromDecimal("99.99", "USD");
const tax = Money.fromDecimal("8.00", "USD");

// Addition and subtraction
const total = price.add(tax); // $107.99
const discount = price.subtract("10.00"); // $89.99 (string = major units)

// Multiplication (e.g., quantity)
const quantity = 3;
const subtotal = price.multiply(quantity); // $299.97

// Division with required rounding
import { RoundingMode } from "monetra";
const split = total.divide(3, { rounding: RoundingMode.HALF_UP }); // $36.00
```

### Comparison and Validation

```typescript
const balance = Money.fromDecimal("100.00", "USD");
const minimum = Money.fromDecimal("50.00", "USD");
const withdrawal = Money.fromDecimal("75.00", "USD");

// Comparisons
if (balance.greaterThanOrEqual(withdrawal)) {
  // Process withdrawal
}

// Check bounds
if (withdrawal.lessThan(minimum)) {
  throw new Error("Minimum withdrawal is $50");
}

// Clamp to valid range
const maxWithdrawal = Money.fromDecimal("500.00", "USD");
const safeAmount = withdrawal.clamp(minimum, maxWithdrawal);

// State checks
balance.isZero(); // false
balance.isPositive(); // true
balance.isNegative(); // false
```

---

## E-commerce

### Cart Total with Tax

```typescript
interface CartItem {
  price: Money;
  quantity: number;
}

function calculateCartTotal(
  items: CartItem[],
  taxRate: number
): {
  subtotal: Money;
  tax: Money;
  total: Money;
} {
  const subtotal = items.reduce(
    (sum, item) => sum.add(item.price.multiply(item.quantity)),
    Money.zero("USD")
  );

  const tax = subtotal.percentage(taxRate, RoundingMode.HALF_UP);
  const total = subtotal.add(tax);

  return { subtotal, tax, total };
}

// Usage
const cart: CartItem[] = [
  { price: Money.fromDecimal("29.99", "USD"), quantity: 2 },
  { price: Money.fromDecimal("49.99", "USD"), quantity: 1 },
];

const { subtotal, tax, total } = calculateCartTotal(cart, 8.25);
// subtotal: $109.97
// tax: $9.07
// total: $119.04
```

### Discount Application

```typescript
function applyDiscount(price: Money, discountPercent: number): Money {
  return price.subtractPercent(discountPercent);
}

function applyPromoCode(price: Money, code: string): Money {
  const discounts: Record<string, number> = {
    SAVE10: 10,
    SAVE20: 20,
    HALFOFF: 50,
  };

  const discount = discounts[code];
  if (!discount) return price;

  return applyDiscount(price, discount);
}

const price = Money.fromDecimal("100.00", "USD");
const discounted = applyPromoCode(price, "SAVE20"); // $80.00
```

### Splitting a Bill

```typescript
const bill = Money.fromDecimal("87.50", "USD");

// Split evenly (remainders distributed fairly)
const fourWays = bill.split(4);
// [21.88, 21.88, 21.87, 21.87] - sums to exactly $87.50

// Split by custom ratios (e.g., 2 adults, 1 child at half price)
const byRatio = bill.allocate([2, 2, 1]);
// [35.00, 35.00, 17.50]
```

---

## Subscriptions & Billing

### Prorated Charges

```typescript
function prorateCharge(
  monthlyRate: Money,
  startDate: Date,
  endDate: Date
): Money {
  const daysInMonth = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    0
  ).getDate();

  const daysUsed = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const dailyRate = monthlyRate.divide(daysInMonth, {
    rounding: RoundingMode.HALF_UP,
  });

  return dailyRate.multiply(daysUsed);
}

const monthly = Money.fromDecimal("29.99", "USD");
const prorated = prorateCharge(
  monthly,
  new Date("2026-01-15"),
  new Date("2026-01-31")
);
// Charges for 16 days of January
```

### Recurring Payment Calculation

```typescript
import { pmt, Rate } from "monetra";

function calculateMonthlyPayment(
  loanAmount: Money,
  annualInterestRate: number,
  years: number
): Money {
  return pmt({
    annualRate: annualInterestRate / 100,
    periods: years * 12,
    principal: loanAmount,
    periodsPerYear: 12
  });
}

const carLoan = Money.fromDecimal("25000", "USD");
const monthly = calculateMonthlyPayment(carLoan, 6.5, 5);
// Monthly payment for 5-year car loan at 6.5%
```

---

## Multi-Currency

### Currency Conversion

```typescript
import { Converter, Money } from "monetra";

const converter = new Converter("USD", {
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
});

const usd = Money.fromDecimal("100.00", "USD");
const eur = converter.convert(usd, "EUR"); // €92.00
const gbp = converter.convert(usd, "GBP"); // £79.00
const jpy = converter.convert(usd, "JPY"); // ¥14,950
```

### Multi-Currency Wallet

```typescript
import { MoneyBag, Converter } from "monetra";

const wallet = new MoneyBag();

// Add funds in different currencies
wallet.add(Money.fromDecimal("500.00", "USD"));
wallet.add(Money.fromDecimal("300.00", "EUR"));
wallet.add(Money.fromDecimal("10000", "JPY"));

// Get individual balances
const usdBalance = wallet.get("USD"); // $500.00

// Get total value in a single currency
const converter = new Converter("USD", { EUR: 0.92, JPY: 149.5 });
const totalInUSD = wallet.total("USD", converter);
```

---

## Financial Calculations

### Loan Amortization Schedule

```typescript
import { loan, Money } from "monetra";

const principal = Money.fromDecimal("200000", "USD");
const annualRate = 0.065; // 6.5%
const years = 30;

const schedule = loan({
  principal,
  annualRate,
  periods: years * 12,
  periodsPerYear: 12
});

// First payment breakdown
const firstPayment = schedule[0];
console.log(`Payment: ${firstPayment.payment.format()}`);
console.log(`Principal: ${firstPayment.principal.format()}`);
console.log(`Interest: ${firstPayment.interest.format()}`);
console.log(`Balance: ${firstPayment.balance.format()}`);
```

### Investment Returns (NPV/IRR)

```typescript
import { npv, irr, Money } from "monetra";

// Initial investment and yearly cash flows
const cashFlows = [
  Money.fromDecimal("-100000", "USD"), // Initial investment
  Money.fromDecimal("25000", "USD"), // Year 1
  Money.fromDecimal("30000", "USD"), // Year 2
  Money.fromDecimal("35000", "USD"), // Year 3
  Money.fromDecimal("40000", "USD"), // Year 4
];

// Net Present Value at 10% discount rate
const netPresentValue = npv(0.1, cashFlows);
console.log(`NPV: ${netPresentValue.format()}`);

// Internal Rate of Return
const internalRateOfReturn = irr(cashFlows);
console.log(`IRR: ${(internalRateOfReturn * 100).toFixed(2)}%`);
```

### Interest Rate Conversions

```typescript
import { Rate } from "monetra";

// Annual rate
const annualRate = Rate.percent(12);

// Convert to monthly periodic rate
const monthlyRate = annualRate.periodic(12);
console.log(`Monthly rate: ${monthlyRate.toString()}`); // 1%

// Convert nominal to effective annual rate
const effectiveRate = annualRate.toEffective(12);
console.log(`Effective annual: ${effectiveRate.toString()}`); // ~12.68%

// Compound factor over time
const factor = monthlyRate.compoundFactor(12);
console.log(`$1 grows to: $${factor.toFixed(4)}`); // ~$1.1268
```

---

## Serialization

### JSON Storage

```typescript
import { Money } from "monetra";

const price = Money.fromDecimal("99.99", "USD");

// Serialize
const json = JSON.stringify(price);
// {"amount":"9999","currency":"USD","precision":2}

// Deserialize with reviver
const restored = JSON.parse(json, Money.reviver);
console.log(restored.format()); // $99.99
```

### Database Storage

```typescript
// Store as minor units (recommended)
function toDatabase(money: Money) {
  return {
    amount: money.minor.toString(), // Use string for BigInt
    currency: money.currency.code,
  };
}

function fromDatabase(row: { amount: string; currency: string }) {
  return Money.fromMinor(BigInt(row.amount), row.currency);
}

// Or store as decimal string
function toDecimalDatabase(money: Money) {
  return {
    amount: money.toDecimalString(),
    currency: money.currency.code,
  };
}

function fromDecimalDatabase(row: { amount: string; currency: string }) {
  return Money.fromDecimal(row.amount, row.currency);
}
```

### API Responses

```typescript
// Format for API response
function formatForApi(money: Money) {
  return {
    amount: money.toDecimalString(),
    currency: money.currency.code,
    formatted: money.format(),
    minor_units: money.minor.toString(),
  };
}
```

---

## Auditing & Compliance

### Immutable Transaction Ledger

```typescript
import { Ledger, Money } from "monetra";

const ledger = new Ledger("USD");

// Record transactions
ledger.record(Money.fromDecimal("1000.00", "USD"), {
  type: "credit",
  reference: "DEP-001",
  description: "Initial deposit",
});

ledger.record(Money.fromDecimal("-50.00", "USD"), {
  type: "debit",
  reference: "TXN-001",
  description: "Purchase",
  tags: ["retail"],
});

// Verify integrity (detects tampering)
const isValid = ledger.verify();

// Query transactions
const purchases = ledger.query({
  type: "debit",
  from: new Date("2026-01-01"),
  to: new Date("2026-01-31"),
});

// Export for audit
const snapshot = ledger.snapshot();
```

### Transaction History Report

```typescript
function generateReport(ledger: Ledger) {
  const history = ledger.getHistory();

  let totalCredits = Money.zero("USD");
  let totalDebits = Money.zero("USD");

  for (const entry of history) {
    if (entry.money.isPositive()) {
      totalCredits = totalCredits.add(entry.money);
    } else {
      totalDebits = totalDebits.add(entry.money.abs());
    }
  }

  return {
    openingBalance: Money.zero("USD"),
    totalCredits,
    totalDebits,
    closingBalance: ledger.getBalance(),
    transactionCount: history.length,
    isValid: ledger.verify(),
  };
}
```

---

## Cryptocurrency

### ERC-20 Token Handling

```typescript
import { defineToken, Money } from "monetra";

// Define a custom token
const USDC = defineToken({
  code: "USDC",
  decimals: 6,
  symbol: "$",
  name: "USD Coin",
  chainId: 1,
  contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  standard: "ERC-20",
});

// Create amount from wei
const amount = Money.fromMinor(1_000_000, USDC); // 1 USDC

// Handle 18-decimal tokens
import { ETH } from "monetra";

const ethAmount = Money.fromDecimal("0.5", ETH);
console.log(`Wei: ${ethAmount.minor}`); // 500000000000000000n

// Format with symbol
console.log(ethAmount.format()); // Ξ0.50
```

### Cross-Chain Value Comparison

```typescript
const converter = new Converter("USD", {
  ETH: 0.0003, // 1 USD = 0.0003 ETH
  BTC: 0.000024,
});

const usdAmount = Money.fromDecimal("1000", "USD");
const ethEquivalent = converter.convert(usdAmount, "ETH");
const btcEquivalent = converter.convert(usdAmount, "BTC");
```

---

## Best Practices Summary

1. **Always use strings for user input**: `Money.fromDecimal('10.50', 'USD')`
2. **Always specify rounding for division**: `money.divide(3, { rounding: RoundingMode.HALF_UP })`
3. **Use `allocate()` for fair splitting**: Guarantees no money is lost
4. **Store as minor units**: More reliable than decimals for databases
5. **Use `toDecimalString()` for storage**: Not `format()` which includes locale formatting
6. **Verify ledgers regularly**: Call `ledger.verify()` to detect tampering
7. **Handle BigInt for large amounts**: Cryptocurrency can exceed JavaScript's safe integer range
