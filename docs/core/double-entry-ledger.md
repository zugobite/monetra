# DoubleEntryLedger API Reference

The `DoubleEntryLedger` class provides a complete GAAP-compliant double-entry bookkeeping system with journal entries, trial balance, and audit trail.

---

## Table of Contents

- [Creating a Ledger](#creating-a-ledger)
  - [Constructor](#constructor)
- [Account Management](#account-management)
  - [createAccount()](#createaccount)
  - [createAccounts()](#createaccounts)
  - [getAccount()](#getaccount)
  - [getAccounts()](#getaccounts)
- [Journal Entries](#journal-entries)
  - [post()](#post)
  - [void()](#void)
  - [getJournalEntries()](#getjournalentries)
  - [query()](#query)
- [Reporting](#reporting)
  - [getTrialBalance()](#gettrialbalance)
  - [getAccountHistory()](#getaccounthistory)
  - [getSummary()](#getsummary)
- [Verification & Audit](#verification)
  - [verify()](#verify)
  - [snapshot()](#snapshot)
  - [fromSnapshot()](#fromsnapshot)
- [Chart of Accounts Templates](#templates)

---

## Creating a Ledger {#creating-a-ledger}

### Constructor {#constructor}

Creates a new double-entry ledger for a specific currency.

```typescript
import { DoubleEntryLedger } from "monetra";

const ledger = new DoubleEntryLedger("USD");
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `currency` | `string` | ISO 4217 currency code for this ledger |

---

## Account Management {#account-management}

### createAccount() {#createaccount}

Creates a new account in the ledger.

```typescript
createAccount(config: AccountConfig): Account
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `string` | ✅ | Unique account identifier |
| `name` | `string` | ✅ | Account display name |
| `type` | `AccountType` | ✅ | Account classification |
| `currency` | `Currency \| string` | ✅ | Account currency |
| `accountNumber` | `string` | ❌ | Standard account number |
| `description` | `string` | ❌ | Account description |
| `parentId` | `string` | ❌ | Parent account ID |
| `isActive` | `boolean` | ❌ | Accept new entries (default: `true`) |
| `metadata` | `Record<string, unknown>` | ❌ | Custom metadata |

#### Returns

`Account` - The created account

#### Throws

- `InvalidArgumentError` - If account ID already exists

#### Example

```typescript
const ledger = new DoubleEntryLedger("USD");

ledger.createAccount({
  id: "cash",
  name: "Cash",
  type: "asset",
  currency: "USD",
  accountNumber: "1000",
});
```

---

### createAccounts() {#createaccounts}

Creates multiple accounts at once.

```typescript
createAccounts(configs: AccountConfig[]): Account[]
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `configs` | `AccountConfig[]` | Array of account configurations |

#### Returns

`Account[]` - Array of created accounts

#### Example

```typescript
import { ChartOfAccountsTemplates } from "monetra";

const ledger = new DoubleEntryLedger("USD");
ledger.createAccounts(ChartOfAccountsTemplates.smallBusiness("USD"));
```

---

### getAccount() {#getaccount}

Retrieves an account by ID.

```typescript
getAccount(id: string): Account | undefined
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Account identifier |

#### Returns

`Account | undefined` - The account, or undefined if not found

#### Example

```typescript
const cash = ledger.getAccount("cash");
if (cash) {
  console.log(cash.getBalance().format());
}
```

---

### getAccounts() {#getaccounts}

Retrieves all accounts, optionally filtered.

```typescript
getAccounts(filter?: AccountFilter): Account[]
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `AccountType` | Filter by account type |
| `isActive` | `boolean` | Filter by active status |

#### Returns

`Account[]` - Array of matching accounts

#### Example

```typescript
// Get all accounts
const allAccounts = ledger.getAccounts();

// Get only expense accounts
const expenses = ledger.getAccounts({ type: "expense" });

// Get active accounts only
const activeAccounts = ledger.getAccounts({ isActive: true });
```

---

## Journal Entries {#journal-entries}

### post() {#post}

Posts a balanced journal entry to the ledger.

```typescript
post(entry: JournalEntryInput): JournalEntry
```

#### Parameters

**JournalEntryInput**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lines` | `JournalLine[]` | ✅ | Debit and credit lines |
| `metadata` | `EntryMetadata` | ✅ | Entry description and metadata |

**JournalLine**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `accountId` | `string` | ✅ | Account to debit/credit |
| `amount` | `Money` | ✅ | Amount for this line |
| `type` | `"debit" \| "credit"` | ✅ | Entry type |
| `memo` | `string` | ❌ | Line-level memo |

**EntryMetadata**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `description` | `string` | ✅ | Entry description |
| `date` | `Date` | ❌ | Entry date (default: now) |
| `reference` | `string` | ❌ | External reference (invoice #) |
| `tags` | `string[]` | ❌ | Categorization tags |

#### Returns

`JournalEntry` - The posted journal entry with ID and hash

#### Throws

- `InvalidArgumentError` - If debits ≠ credits
- `InvalidArgumentError` - If account not found

#### Example

```typescript
// Record a cash sale
const entry = ledger.post({
  lines: [
    { accountId: "cash", amount: Money.fromMajor("500", "USD"), type: "debit" },
    { accountId: "sales-revenue", amount: Money.fromMajor("500", "USD"), type: "credit" },
  ],
  metadata: {
    description: "Cash sale - Invoice #1001",
    reference: "INV-1001",
    tags: ["sales", "q1-2026"],
  },
});

console.log(entry.id);   // "je_abc123..."
console.log(entry.hash); // "a1b2c3d4..." (SHA-256)
```

---

### void() {#void}

Voids a journal entry by creating a reversing entry.

```typescript
void(entryId: string, reason: string): JournalEntry
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `entryId` | `string` | ID of entry to void |
| `reason` | `string` | Reason for voiding |

#### Returns

`JournalEntry` - The reversing entry

#### Throws

- `InvalidArgumentError` - If entry not found
- `InvalidArgumentError` - If entry already voided

#### Example

```typescript
// Void an incorrect entry
const reversing = ledger.void(entry.id, "Incorrect amount - re-entering");

// Original entry is marked as voided
const original = ledger.getJournalEntries().find(e => e.id === entry.id);
console.log(original.isVoided);    // true
console.log(original.voidedBy);    // reversing.id

// Reversing entry references original
console.log(reversing.voids);      // entry.id
```

---

### getJournalEntries() {#getjournalentries}

Returns all journal entries in the ledger.

```typescript
getJournalEntries(): JournalEntry[]
```

#### Returns

`JournalEntry[]` - All entries in chronological order

---

### query() {#query}

Queries journal entries with filters.

```typescript
query(filter: EntryFilter): JournalEntry[]
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `string` | Filter by account |
| `fromDate` | `Date` | Entries on or after date |
| `toDate` | `Date` | Entries on or before date |
| `tags` | `string[]` | Filter by any matching tag |
| `includeVoided` | `boolean` | Include voided entries (default: `true`) |

#### Returns

`JournalEntry[]` - Matching entries

#### Example

```typescript
// Get January 2026 entries
const janEntries = ledger.query({
  fromDate: new Date("2026-01-01"),
  toDate: new Date("2026-01-31"),
});

// Get all sales-tagged entries
const salesEntries = ledger.query({ tags: ["sales"] });

// Get entries for a specific account
const cashEntries = ledger.query({ accountId: "cash" });
```

---

## Reporting {#reporting}

### getTrialBalance() {#gettrialbalance}

Generates a trial balance report.

```typescript
getTrialBalance(): TrialBalance
```

#### Returns

**TrialBalance**

| Property | Type | Description |
|----------|------|-------------|
| `entries` | `TrialBalanceEntry[]` | Per-account balances |
| `totalDebits` | `Money` | Sum of all debit balances |
| `totalCredits` | `Money` | Sum of all credit balances |
| `isBalanced` | `boolean` | Whether debits = credits |
| `generatedAt` | `Date` | Report timestamp |

**TrialBalanceEntry**

| Property | Type | Description |
|----------|------|-------------|
| `accountId` | `string` | Account identifier |
| `accountName` | `string` | Account name |
| `accountType` | `AccountType` | Account type |
| `debitBalance` | `Money` | Debit balance (or zero) |
| `creditBalance` | `Money` | Credit balance (or zero) |

#### Example

```typescript
const tb = ledger.getTrialBalance();

console.log(tb.isBalanced); // true

for (const entry of tb.entries) {
  console.log(
    `${entry.accountName}: DR ${entry.debitBalance.format()} CR ${entry.creditBalance.format()}`
  );
}

console.log(`Total Debits:  ${tb.totalDebits.format()}`);
console.log(`Total Credits: ${tb.totalCredits.format()}`);
```

---

### getAccountHistory() {#getaccounthistory}

Returns transaction history for an account with running balance.

```typescript
getAccountHistory(accountId: string): AccountHistoryEntry[]
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | `string` | Account to get history for |

#### Returns

**AccountHistoryEntry[]**

| Property | Type | Description |
|----------|------|-------------|
| `entryId` | `string` | Journal entry ID |
| `date` | `Date` | Entry date |
| `description` | `string` | Entry description |
| `debit` | `Money` | Debit amount (or zero) |
| `credit` | `Money` | Credit amount (or zero) |
| `runningBalance` | `Money` | Balance after this entry |

#### Example

```typescript
const history = ledger.getAccountHistory("cash");

for (const h of history) {
  console.log(`${h.date.toLocaleDateString()}: ${h.description}`);
  console.log(`  DR: ${h.debit.format()} CR: ${h.credit.format()}`);
  console.log(`  Balance: ${h.runningBalance.format()}`);
}
```

---

### getSummary() {#getsummary}

Returns a summary of the ledger.

```typescript
getSummary(): LedgerSummary
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `accountCount` | `number` | Total accounts |
| `entryCount` | `number` | Total journal entries |
| `currency` | `string` | Ledger currency |
| `isBalanced` | `boolean` | Whether ledger is balanced |

---

## Verification & Audit {#verification}

### verify() {#verify}

Verifies the integrity of the ledger's hash chain.

```typescript
verify(): boolean
```

#### Returns

`boolean` - `true` if hash chain is valid

#### How It Works

Each journal entry contains:
- `hash` - SHA-256 hash of the entry content
- `previousHash` - Hash of the previous entry

This creates an immutable chain where tampering with any entry breaks the chain.

#### Example

```typescript
const isValid = ledger.verify();

if (!isValid) {
  console.error("⚠️ Ledger integrity compromised!");
}
```

---

### snapshot() {#snapshot}

Creates a serializable snapshot of the entire ledger.

```typescript
snapshot(): LedgerSnapshot
```

#### Returns

`LedgerSnapshot` - JSON-serializable ledger state

#### Example

```typescript
// Create backup
const backup = ledger.snapshot();

// Save to file/database
const json = JSON.stringify(backup);
fs.writeFileSync("ledger-backup.json", json);
```

---

### fromSnapshot() {#fromsnapshot}

Restores a ledger from a snapshot.

```typescript
static fromSnapshot(snapshot: LedgerSnapshot): DoubleEntryLedger
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `snapshot` | `LedgerSnapshot` | Previously saved snapshot |

#### Returns

`DoubleEntryLedger` - Restored ledger

#### Example

```typescript
// Load from file/database
const json = fs.readFileSync("ledger-backup.json", "utf-8");
const backup = JSON.parse(json);

// Restore ledger
const ledger = DoubleEntryLedger.fromSnapshot(backup);

// Verify integrity after restore
console.log(ledger.verify()); // true
```

---

## Chart of Accounts Templates {#templates}

Monetra provides ready-made templates for common business types.

### ChartOfAccountsTemplates.smallBusiness()

General template for small businesses with 30+ accounts.

```typescript
import { ChartOfAccountsTemplates } from "monetra";

const accounts = ChartOfAccountsTemplates.smallBusiness("USD");
```

**Included Accounts:**

| Category | Accounts |
|----------|----------|
| Assets (1000s) | Cash, Accounts Receivable, Inventory, Prepaid Expenses, Equipment |
| Liabilities (2000s) | Accounts Payable, Credit Card Payable, Payroll Liabilities, Sales Tax Payable, Loans Payable |
| Equity (3000s) | Owner's Equity, Retained Earnings, Owner's Draws |
| Revenue (4000s) | Sales Revenue, Service Revenue, Other Income |
| Expenses (5000s-6000s) | COGS, Wages, Rent, Utilities, Office Supplies, Insurance, Professional Services, Marketing |

---

### ChartOfAccountsTemplates.ecommerce()

Template for e-commerce businesses. Extends smallBusiness with:

```typescript
const accounts = ChartOfAccountsTemplates.ecommerce("USD");
```

**Additional Accounts:**

| Account | Type | Number |
|---------|------|--------|
| Stripe Clearing | Asset | 1020 |
| PayPal Clearing | Asset | 1021 |
| Shipping Income | Revenue | 4200 |
| Payment Processing Fees | Expense | 5100 |
| Shipping Expense | Expense | 5200 |
| Refunds Expense | Expense | 5300 |

---

### ChartOfAccountsTemplates.saas()

Template for SaaS/subscription businesses. Extends smallBusiness with:

```typescript
const accounts = ChartOfAccountsTemplates.saas("USD");
```

**Additional Accounts:**

| Account | Type | Number |
|---------|------|--------|
| Deferred Revenue | Liability | 2400 |
| Subscription Revenue | Revenue | 4000 |
| Usage Revenue | Revenue | 4100 |
| Hosting & Infrastructure | Expense | 5100 |
| Customer Success | Expense | 6900 |

---

## Complete Example

```typescript
import { DoubleEntryLedger, ChartOfAccountsTemplates, Money } from "monetra";

// Create ledger with SaaS chart of accounts
const ledger = new DoubleEntryLedger("USD");
ledger.createAccounts(ChartOfAccountsTemplates.saas("USD"));

// Record annual subscription payment ($1,200 for 12 months)
ledger.post({
  lines: [
    { accountId: "cash", amount: Money.fromMajor("1200", "USD"), type: "debit" },
    { accountId: "deferred-revenue", amount: Money.fromMajor("1200", "USD"), type: "credit" },
  ],
  metadata: {
    description: "Annual subscription - Customer #1234",
    reference: "SUB-1234",
    tags: ["subscription", "annual"],
  },
});

// Monthly revenue recognition ($100)
ledger.post({
  lines: [
    { accountId: "deferred-revenue", amount: Money.fromMajor("100", "USD"), type: "debit" },
    { accountId: "subscription-revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
  ],
  metadata: {
    description: "Revenue recognition - January 2026",
    tags: ["revenue-recognition"],
  },
});

// Check balances
const deferred = ledger.getAccount("deferred-revenue")!;
const revenue = ledger.getAccount("subscription-revenue")!;

console.log(`Deferred Revenue: ${deferred.getBalance().format()}`);    // "$1,100.00"
console.log(`Subscription Revenue: ${revenue.getBalance().format()}`); // "$100.00"

// Generate trial balance
const tb = ledger.getTrialBalance();
console.log(`Balanced: ${tb.isBalanced}`); // true

// Verify integrity
console.log(`Integrity: ${ledger.verify()}`); // true
```
