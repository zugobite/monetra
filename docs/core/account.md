# Account API Reference

The `Account` class represents a ledger account in a double-entry bookkeeping system.

---

## Table of Contents

- [Creating Accounts](#creating-accounts)
  - [Constructor](#constructor)
  - [Account Types](#account-types)
- [Properties](#properties)
- [Methods](#methods)
  - [debit()](#debit)
  - [credit()](#credit)
  - [getBalance()](#getbalance)
  - [getClassification()](#getclassification)
  - [isDebitNormal()](#isdebitnormal)
- [Examples](#examples)

---

## Creating Accounts {#creating-accounts}

### Constructor {#constructor}

Creates a new account with the specified configuration.

```typescript
import { Account, AccountType } from "monetra";
import { USD } from "monetra/currency";

const cashAccount = new Account({
  id: "cash",
  name: "Cash",
  type: "asset",
  currency: USD,
  accountNumber: "1000",
  description: "Petty cash and cash on hand",
  parentId: "current-assets",
  isActive: true,
  metadata: { department: "finance" },
});
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `string` | ✅ | Unique identifier for the account |
| `name` | `string` | ✅ | Human-readable account name |
| `type` | `AccountType` | ✅ | Account classification (see below) |
| `currency` | `Currency \| string` | ✅ | Account currency |
| `accountNumber` | `string` | ❌ | Standard account number (e.g., "1000") |
| `description` | `string` | ❌ | Detailed description |
| `parentId` | `string` | ❌ | Parent account ID for hierarchies |
| `isActive` | `boolean` | ❌ | Whether account accepts new entries (default: `true`) |
| `metadata` | `Record<string, unknown>` | ❌ | Custom metadata |

### Account Types {#account-types}

Monetra supports 10 GAAP-compliant account types:

```typescript
type AccountType =
  | "asset"           // Debit normal - Cash, Inventory, Equipment
  | "liability"       // Credit normal - Accounts Payable, Loans
  | "equity"          // Credit normal - Owner's Equity, Retained Earnings
  | "revenue"         // Credit normal - Sales, Service Income
  | "expense"         // Debit normal - Wages, Rent, Utilities
  | "contra-asset"    // Credit normal - Accumulated Depreciation
  | "contra-liability"// Debit normal - Bond Discount
  | "contra-equity"   // Debit normal - Owner's Draws, Treasury Stock
  | "contra-revenue"  // Debit normal - Sales Returns, Discounts
  | "contra-expense"; // Credit normal - Purchase Returns
```

#### Normal Balance Sides

| Account Type | Normal Balance | Increases With | Decreases With |
|--------------|----------------|----------------|----------------|
| Asset | Debit | Debit | Credit |
| Liability | Credit | Credit | Debit |
| Equity | Credit | Credit | Debit |
| Revenue | Credit | Credit | Debit |
| Expense | Debit | Debit | Credit |
| Contra-Asset | Credit | Credit | Debit |
| Contra-Liability | Debit | Debit | Credit |
| Contra-Equity | Debit | Debit | Credit |
| Contra-Revenue | Debit | Debit | Credit |
| Contra-Expense | Credit | Credit | Debit |

---

## Properties {#properties}

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique account identifier |
| `name` | `string` | Account display name |
| `type` | `AccountType` | Account classification |
| `currency` | `Currency` | Account currency |
| `accountNumber` | `string \| undefined` | Standard account number |
| `description` | `string \| undefined` | Account description |
| `parentId` | `string \| undefined` | Parent account for hierarchies |
| `isActive` | `boolean` | Whether account accepts entries |
| `metadata` | `Record<string, unknown> \| undefined` | Custom metadata |

---

## Methods {#methods}

### debit() {#debit}

Records a debit entry to this account.

```typescript
debit(amount: Money): void
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `amount` | `Money` | The amount to debit |

#### Example

```typescript
const cash = new Account({ id: "cash", name: "Cash", type: "asset", currency: USD });
cash.debit(Money.fromMajor("500", "USD"));
console.log(cash.getBalance().toDecimalString()); // "500.00"
```

---

### credit() {#credit}

Records a credit entry to this account.

```typescript
credit(amount: Money): void
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `amount` | `Money` | The amount to credit |

#### Example

```typescript
const revenue = new Account({ id: "revenue", name: "Sales", type: "revenue", currency: USD });
revenue.credit(Money.fromMajor("500", "USD"));
console.log(revenue.getBalance().toDecimalString()); // "500.00"
```

---

### getBalance() {#getbalance}

Returns the current account balance as a Money object. The balance is calculated based on the account's natural balance side.

```typescript
getBalance(): Money
```

#### Returns

`Money` - The current balance

#### How Balance is Calculated

For **debit-normal accounts** (asset, expense, contra-liability, contra-equity, contra-revenue):
```
Balance = Total Debits - Total Credits
```

For **credit-normal accounts** (liability, equity, revenue, contra-asset, contra-expense):
```
Balance = Total Credits - Total Debits
```

#### Example

```typescript
const cash = new Account({ id: "cash", name: "Cash", type: "asset", currency: USD });
cash.debit(Money.fromMajor("1000", "USD"));  // Increase
cash.credit(Money.fromMajor("300", "USD"));  // Decrease
console.log(cash.getBalance().toDecimalString()); // "700.00"
```

---

### getClassification() {#getclassification}

Returns whether this account appears on the Balance Sheet or Income Statement.

```typescript
getClassification(): "balance-sheet" | "income-statement"
```

#### Returns

- `"balance-sheet"` - For asset, liability, equity, and their contra accounts
- `"income-statement"` - For revenue, expense, and their contra accounts

#### Example

```typescript
const cash = new Account({ id: "cash", name: "Cash", type: "asset", currency: USD });
const sales = new Account({ id: "sales", name: "Sales", type: "revenue", currency: USD });

console.log(cash.getClassification());  // "balance-sheet"
console.log(sales.getClassification()); // "income-statement"
```

---

### isDebitNormal() {#isdebitnormal}

Returns whether this account has a normal debit balance.

```typescript
isDebitNormal(): boolean
```

#### Returns

`boolean` - `true` if debit-normal, `false` if credit-normal

#### Example

```typescript
const cash = new Account({ id: "cash", type: "asset", ... });
const revenue = new Account({ id: "revenue", type: "revenue", ... });

console.log(cash.isDebitNormal());    // true
console.log(revenue.isDebitNormal()); // false
```

---

## Examples {#examples}

### Creating a Chart of Accounts

```typescript
import { Account } from "monetra";
import { USD } from "monetra/currency";

// Assets (1000s)
const cash = new Account({
  id: "cash",
  name: "Cash",
  type: "asset",
  currency: USD,
  accountNumber: "1000",
});

const accountsReceivable = new Account({
  id: "ar",
  name: "Accounts Receivable",
  type: "asset",
  currency: USD,
  accountNumber: "1200",
});

// Liabilities (2000s)
const accountsPayable = new Account({
  id: "ap",
  name: "Accounts Payable",
  type: "liability",
  currency: USD,
  accountNumber: "2000",
});

// Revenue (4000s)
const salesRevenue = new Account({
  id: "sales",
  name: "Sales Revenue",
  type: "revenue",
  currency: USD,
  accountNumber: "4000",
});

// Expenses (5000s-6000s)
const rentExpense = new Account({
  id: "rent",
  name: "Rent Expense",
  type: "expense",
  currency: USD,
  accountNumber: "6100",
});
```

### Recording a Sale

```typescript
// Customer pays $500 cash for a product
cash.debit(Money.fromMajor("500", "USD"));
salesRevenue.credit(Money.fromMajor("500", "USD"));

console.log(cash.getBalance().format());         // "$500.00"
console.log(salesRevenue.getBalance().format()); // "$500.00"
```

### Using Contra Accounts

```typescript
// Accumulated Depreciation is a contra-asset
const equipment = new Account({
  id: "equipment",
  name: "Equipment",
  type: "asset",
  currency: USD,
  accountNumber: "1500",
});

const accumulatedDepreciation = new Account({
  id: "accum-dep",
  name: "Accumulated Depreciation - Equipment",
  type: "contra-asset",
  currency: USD,
  accountNumber: "1510",
});

// Equipment cost $10,000
equipment.debit(Money.fromMajor("10000", "USD"));

// Record $2,000 depreciation
accumulatedDepreciation.credit(Money.fromMajor("2000", "USD"));

// Net book value = $10,000 - $2,000 = $8,000
const netBookValue = equipment.getBalance().subtract(accumulatedDepreciation.getBalance());
console.log(netBookValue.format()); // "$8,000.00"
```
