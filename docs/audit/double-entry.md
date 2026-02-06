# Double-Entry Bookkeeping

Monetra includes a complete GAAP-compliant double-entry bookkeeping system, purpose-built for fintech applications in small to medium businesses.

## Why Double-Entry?

Double-entry bookkeeping is the foundation of modern accounting. Every transaction affects at least two accounts with equal and opposite entries:

- **Debits** = **Credits** (always)
- Creates a self-balancing ledger
- Provides audit trail and error detection
- Required for professional financial reporting

## Quick Start

```typescript
import { DoubleEntryLedger, ChartOfAccountsTemplates, Money } from "monetra";

// Create ledger with SMB chart of accounts
const ledger = new DoubleEntryLedger("USD");
ledger.createAccounts(ChartOfAccountsTemplates.smallBusiness("USD"));

// Record a sale: Customer pays $500 cash
ledger.post({
  lines: [
    { accountId: "cash", amount: Money.fromMajor("500", "USD"), type: "debit" },
    { accountId: "sales-revenue", amount: Money.fromMajor("500", "USD"), type: "credit" },
  ],
  metadata: {
    description: "Cash sale - Invoice #1001",
    reference: "INV-1001",
  },
});

// Verify the ledger is balanced
const trialBalance = ledger.getTrialBalance();
console.log(trialBalance.isBalanced); // true
```

## Core Concepts

### Account Types

Accounts are classified by their natural balance side:

| Type | Normal Balance | Increases With | Statement |
|------|---------------|----------------|-----------|
| Asset | Debit | Debit | Balance Sheet |
| Liability | Credit | Credit | Balance Sheet |
| Equity | Credit | Credit | Balance Sheet |
| Revenue | Credit | Credit | Income Statement |
| Expense | Debit | Debit | Income Statement |

Contra accounts have the opposite normal balance (e.g., `contra-asset` for accumulated depreciation).

### Creating Accounts

```typescript
import { DoubleEntryLedger } from "monetra";

const ledger = new DoubleEntryLedger("USD");

// Create individual accounts
ledger.createAccount({
  id: "cash",
  name: "Cash",
  type: "asset",
  currency: "USD",
  accountNumber: "1000",
  description: "Petty cash and cash on hand",
});

ledger.createAccount({
  id: "accounts-receivable",
  name: "Accounts Receivable",
  type: "asset",
  currency: "USD",
  accountNumber: "1200",
});
```

### Using Chart of Accounts Templates

Monetra provides ready-made templates for common business types:

```typescript
import { DoubleEntryLedger, ChartOfAccountsTemplates } from "monetra";

const ledger = new DoubleEntryLedger("USD");

// Small business (30+ accounts)
ledger.createAccounts(ChartOfAccountsTemplates.smallBusiness("USD"));

// E-commerce (adds Stripe, PayPal, shipping accounts)
ledger.createAccounts(ChartOfAccountsTemplates.ecommerce("USD"));

// SaaS (adds deferred revenue, subscription accounts)
ledger.createAccounts(ChartOfAccountsTemplates.saas("USD"));
```

## Recording Transactions

### Basic Journal Entry

Every journal entry must balance (total debits = total credits):

```typescript
// Record office supplies purchase with cash
ledger.post({
  lines: [
    { accountId: "office-supplies", amount: Money.fromMajor("150", "USD"), type: "debit" },
    { accountId: "cash", amount: Money.fromMajor("150", "USD"), type: "credit" },
  ],
  metadata: {
    description: "Office supplies from Staples",
    reference: "REC-2024-001",
    tags: ["supplies", "Q1"],
  },
});
```

### Multi-Line Entries

Complex transactions can have multiple debits and/or credits:

```typescript
// Record a sale with sales tax
ledger.post({
  lines: [
    { accountId: "accounts-receivable", amount: Money.fromMajor("1070", "USD"), type: "debit" },
    { accountId: "sales-revenue", amount: Money.fromMajor("1000", "USD"), type: "credit" },
    { accountId: "sales-tax-payable", amount: Money.fromMajor("70", "USD"), type: "credit" },
  ],
  metadata: {
    description: "Invoice #1002 - Web development services",
    reference: "INV-1002",
  },
});
```

### Common Transaction Patterns

#### Receive Payment on Account

```typescript
ledger.post({
  lines: [
    { accountId: "cash", amount: Money.fromMajor("1070", "USD"), type: "debit" },
    { accountId: "accounts-receivable", amount: Money.fromMajor("1070", "USD"), type: "credit" },
  ],
  metadata: { description: "Payment received for INV-1002" },
});
```

#### Pay a Bill

```typescript
ledger.post({
  lines: [
    { accountId: "accounts-payable", amount: Money.fromMajor("500", "USD"), type: "debit" },
    { accountId: "bank", amount: Money.fromMajor("500", "USD"), type: "credit" },
  ],
  metadata: { description: "Paid vendor invoice #V-1234" },
});
```

#### Record Payroll

```typescript
ledger.post({
  lines: [
    { accountId: "wages-expense", amount: Money.fromMajor("5000", "USD"), type: "debit" },
    { accountId: "payroll-liabilities", amount: Money.fromMajor("1000", "USD"), type: "credit" },
    { accountId: "bank", amount: Money.fromMajor("4000", "USD"), type: "credit" },
  ],
  metadata: { description: "Payroll for January 2024" },
});
```

## Voiding Entries

Mistakes happen. Instead of deleting entries (which breaks the audit trail), void them:

```typescript
const entry = ledger.post({
  lines: [
    { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
    { accountId: "sales-revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
  ],
  metadata: { description: "Incorrect entry" },
});

// Later, realize it was wrong
const reversal = ledger.void(entry.id, "Entered wrong amount");

// reversal is a new entry that exactly reverses the original
// Original entry is marked as voided
```

## Querying the Ledger

### Filter Entries

```typescript
// Get all entries for an account
const cashEntries = ledger.query({ accountId: "cash" });

// Filter by date range
const januaryEntries = ledger.query({
  fromDate: new Date("2024-01-01"),
  toDate: new Date("2024-01-31"),
});

// Filter by reference
const invoiceEntries = ledger.query({ reference: "INV-1001" });

// Filter by tags
const q1Entries = ledger.query({ tags: ["Q1"] });

// Pagination
const page2 = ledger.query({ limit: 10, offset: 10 });
```

### Account History with Running Balance

```typescript
const history = ledger.getAccountHistory("cash");

history.forEach(({ entry, line, runningBalance }) => {
  console.log(
    `${entry.metadata.date}: ${line.type} ${line.amount.format()} → Balance: ${runningBalance.format()}`
  );
});
```

## Trial Balance

A trial balance verifies that your books are balanced:

```typescript
const trialBalance = ledger.getTrialBalance();

console.log("Trial Balance");
console.log("─".repeat(60));

for (const entry of trialBalance.entries) {
  console.log(
    `${entry.accountName.padEnd(30)} ${entry.debitBalance.format().padStart(12)} ${entry.creditBalance.format().padStart(12)}`
  );
}

console.log("─".repeat(60));
console.log(
  `${"TOTAL".padEnd(30)} ${trialBalance.totalDebits.format().padStart(12)} ${trialBalance.totalCredits.format().padStart(12)}`
);

console.log(`\nBalanced: ${trialBalance.isBalanced ? "✓ YES" : "✗ NO"}`);
```

## Integrity Verification

The ledger maintains a SHA-256 hash chain for tamper detection:

```typescript
// Verify ledger integrity
const isValid = ledger.verify();

if (!isValid) {
  console.error("⚠️ Ledger integrity compromised! Data may have been tampered with.");
}
```

## Backup and Restore

```typescript
// Create a snapshot
const snapshot = ledger.snapshot();

// Store snapshot (e.g., save to database or file)
const json = JSON.stringify(snapshot);

// Later, restore from snapshot
const restoredLedger = DoubleEntryLedger.fromSnapshot(JSON.parse(json));
```

## Error Handling

Monetra provides specific errors for accounting violations:

```typescript
import { UnbalancedEntryError, AccountNotFoundError, DuplicateAccountError } from "monetra";

try {
  ledger.post({
    lines: [
      { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
      { accountId: "revenue", amount: Money.fromMajor("50", "USD"), type: "credit" }, // Unbalanced!
    ],
    metadata: { description: "This will fail" },
  });
} catch (error) {
  if (error instanceof UnbalancedEntryError) {
    console.error(`Entry not balanced: ${error.difference.format()} difference`);
  }
}
```

## Integration Example: Invoice System

```typescript
import { DoubleEntryLedger, ChartOfAccountsTemplates, Money } from "monetra";

class InvoiceService {
  private ledger: DoubleEntryLedger;

  constructor() {
    this.ledger = new DoubleEntryLedger("USD");
    this.ledger.createAccounts(ChartOfAccountsTemplates.smallBusiness("USD"));
  }

  createInvoice(invoiceNumber: string, amount: Money, taxRate: number) {
    const tax = amount.multiply(taxRate);
    const total = amount.add(tax);

    return this.ledger.post({
      lines: [
        { accountId: "accounts-receivable", amount: total, type: "debit" },
        { accountId: "sales-revenue", amount: amount, type: "credit" },
        { accountId: "sales-tax-payable", amount: tax, type: "credit" },
      ],
      metadata: {
        description: `Invoice ${invoiceNumber}`,
        reference: invoiceNumber,
        tags: ["invoice"],
      },
    });
  }

  recordPayment(invoiceNumber: string, amount: Money) {
    return this.ledger.post({
      lines: [
        { accountId: "bank", amount, type: "debit" },
        { accountId: "accounts-receivable", amount, type: "credit" },
      ],
      metadata: {
        description: `Payment for ${invoiceNumber}`,
        reference: invoiceNumber,
        tags: ["payment"],
      },
    });
  }

  getAccountsReceivable(): Money {
    return this.ledger.getAccount("accounts-receivable")!.getBalance();
  }

  getRevenue(): Money {
    return this.ledger.getAccount("sales-revenue")!.getBalance();
  }
}
```

## Best Practices

1. **Use meaningful references** - Link journal entries to source documents (invoices, receipts, etc.)

2. **Tag consistently** - Use tags for periods (Q1, Q2), departments, or projects

3. **Never delete entries** - Use `void()` to reverse mistakes

4. **Verify regularly** - Call `verify()` periodically to ensure data integrity

5. **Backup snapshots** - Store `snapshot()` outputs for disaster recovery

6. **Use templates** - Start with `ChartOfAccountsTemplates` and customize as needed

## Next Steps

- [Formatting money for display](../guides/formatting.md)
- [Audit trail with single-entry Ledger](./ledger.md)
- [Financial calculations](../logic/financial.md)
