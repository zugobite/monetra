import { Money } from "../money/Money";
import { Currency } from "../currency/Currency";
import { Account, AccountConfig, AccountType } from "./Account";
import {
  JournalEntry,
  JournalEntryInput,
  JournalLine,
  JournalQueryOptions,
  TrialBalance,
  TrialBalanceEntry,
  DoubleEntrySnapshot,
} from "./JournalEntry";
import { generateHashSync } from "./verification";
import { InvalidArgumentError } from "../errors/InvalidArgumentError";
import { randomUUID } from "crypto";

/**
 * Current snapshot format version.
 */
const SNAPSHOT_VERSION = 1;

/**
 * Error thrown when a journal entry is not balanced.
 */
export class UnbalancedEntryError extends Error {
  readonly debits: Money;
  readonly credits: Money;
  readonly difference: Money;

  constructor(debits: Money, credits: Money) {
    const diff = debits.subtract(credits);
    super(
      `Journal entry is not balanced. ` +
        `Debits: ${debits.format()}, Credits: ${credits.format()}, ` +
        `Difference: ${diff.format()}`,
    );
    this.name = "UnbalancedEntryError";
    this.debits = debits;
    this.credits = credits;
    this.difference = diff;
  }
}

/**
 * Error thrown when referencing a non-existent account.
 */
export class AccountNotFoundError extends Error {
  readonly accountId: string;

  constructor(accountId: string) {
    super(`Account not found: "${accountId}"`);
    this.name = "AccountNotFoundError";
    this.accountId = accountId;
  }
}

/**
 * Error thrown when trying to create a duplicate account.
 */
export class DuplicateAccountError extends Error {
  readonly accountId: string;

  constructor(accountId: string) {
    super(`Account already exists: "${accountId}"`);
    this.name = "DuplicateAccountError";
    this.accountId = accountId;
  }
}

/**
 * Double-Entry Ledger implementing GAAP-compliant bookkeeping.
 *
 * This ledger enforces the fundamental accounting equation:
 * Assets = Liabilities + Equity
 *
 * Every transaction must have equal debits and credits (balanced entries).
 * All entries are immutable and form a hash chain for audit integrity.
 *
 * @example
 * ```typescript
 * const ledger = new DoubleEntryLedger("USD");
 *
 * // Create chart of accounts
 * ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: "USD" });
 * ledger.createAccount({ id: "revenue", name: "Sales Revenue", type: "revenue", currency: "USD" });
 * ledger.createAccount({ id: "ar", name: "Accounts Receivable", type: "asset", currency: "USD" });
 *
 * // Record a sale: Debit AR, Credit Revenue
 * ledger.post({
 *   lines: [
 *     { accountId: "ar", amount: Money.fromMajor("1000", "USD"), type: "debit" },
 *     { accountId: "revenue", amount: Money.fromMajor("1000", "USD"), type: "credit" },
 *   ],
 *   metadata: { description: "Invoice #1001 - Web development services" }
 * });
 *
 * // Receive payment: Debit Cash, Credit AR
 * ledger.post({
 *   lines: [
 *     { accountId: "cash", amount: Money.fromMajor("1000", "USD"), type: "debit" },
 *     { accountId: "ar", amount: Money.fromMajor("1000", "USD"), type: "credit" },
 *   ],
 *   metadata: { description: "Payment received for Invoice #1001" }
 * });
 *
 * // Generate trial balance
 * const trialBalance = ledger.getTrialBalance();
 * console.log(trialBalance.isBalanced); // true
 * ```
 */
export class DoubleEntryLedger {
  private accounts: Map<string, Account> = new Map();
  private journalEntries: JournalEntry[] = [];
  private nextEntryNumber: number = 1;
  private currency: string;

  constructor(currency: string | Currency) {
    this.currency = typeof currency === "string" ? currency : currency.code;
  }

  /**
   * Creates a new account in the chart of accounts.
   */
  createAccount(config: AccountConfig): Account {
    if (this.accounts.has(config.id)) {
      throw new DuplicateAccountError(config.id);
    }

    // Validate currency matches ledger
    const accountCurrency =
      typeof config.currency === "string"
        ? config.currency
        : config.currency.code;

    if (accountCurrency !== this.currency) {
      throw new InvalidArgumentError(
        `Account currency (${accountCurrency}) must match ledger currency (${this.currency})`,
      );
    }

    const account = new Account(config);
    this.accounts.set(config.id, account);
    return account;
  }

  /**
   * Creates multiple accounts at once (for setting up chart of accounts).
   */
  createAccounts(configs: AccountConfig[]): Account[] {
    return configs.map((config) => this.createAccount(config));
  }

  /**
   * Gets an account by ID.
   */
  getAccount(id: string): Account | undefined {
    return this.accounts.get(id);
  }

  /**
   * Gets an account by ID or throws if not found.
   */
  getAccountOrThrow(id: string): Account {
    const account = this.accounts.get(id);
    if (!account) {
      throw new AccountNotFoundError(id);
    }
    return account;
  }

  /**
   * Gets all accounts, optionally filtered by type.
   */
  getAccounts(filter?: { type?: AccountType; isActive?: boolean }): Account[] {
    let accounts = Array.from(this.accounts.values());

    if (filter?.type) {
      accounts = accounts.filter((a) => a.type === filter.type);
    }
    if (filter?.isActive !== undefined) {
      accounts = accounts.filter((a) => a.isActive === filter.isActive);
    }

    return accounts;
  }

  /**
   * Posts a journal entry to the ledger.
   *
   * The entry must be balanced (total debits = total credits).
   * All account IDs must exist in the chart of accounts.
   *
   * @throws UnbalancedEntryError if debits don't equal credits
   * @throws AccountNotFoundError if any account ID is invalid
   */
  post(input: JournalEntryInput): JournalEntry {
    // Validate all accounts exist
    for (const line of input.lines) {
      if (!this.accounts.has(line.accountId)) {
        throw new AccountNotFoundError(line.accountId);
      }
    }

    // Calculate totals
    const totalDebits = input.lines
      .filter((l) => l.type === "debit")
      .reduce((sum, l) => sum.add(l.amount), Money.zero(this.currency));

    const totalCredits = input.lines
      .filter((l) => l.type === "credit")
      .reduce((sum, l) => sum.add(l.amount), Money.zero(this.currency));

    // Verify balanced
    if (!totalDebits.equals(totalCredits)) {
      throw new UnbalancedEntryError(totalDebits, totalCredits);
    }

    // Create the entry
    const previousHash =
      this.journalEntries.length > 0
        ? this.journalEntries[this.journalEntries.length - 1].hash
        : null;

    const entryContent = {
      id: randomUUID(),
      entryNumber: this.nextEntryNumber,
      lines: input.lines.map((l) => Object.freeze({ ...l })),
      metadata: Object.freeze({
        ...input.metadata,
        date: input.metadata.date ?? new Date(),
      }),
      createdAt: new Date(),
      previousHash,
      isPosted: true,
      isVoided: false,
    };

    const hash = generateHashSync(entryContent);

    const entry: JournalEntry = Object.freeze({
      ...entryContent,
      hash,
    });

    // Post to accounts
    for (const line of input.lines) {
      const account = this.accounts.get(line.accountId)!;
      if (line.type === "debit") {
        account.debit(line.amount);
      } else {
        account.credit(line.amount);
      }
    }

    this.journalEntries.push(entry);
    this.nextEntryNumber++;

    return entry;
  }

  /**
   * Voids a journal entry by creating a reversing entry.
   *
   * The original entry is marked as voided, and a new entry is created
   * with all debits and credits reversed.
   *
   * @param entryId - ID of the entry to void
   * @param reason - Reason for voiding
   */
  void(entryId: string, reason: string): JournalEntry {
    const originalIndex = this.journalEntries.findIndex(
      (e) => e.id === entryId,
    );
    if (originalIndex === -1) {
      throw new InvalidArgumentError(`Journal entry not found: ${entryId}`);
    }

    const original = this.journalEntries[originalIndex];
    if (original.isVoided) {
      throw new InvalidArgumentError(
        `Journal entry ${entryId} is already voided`,
      );
    }

    // Create reversing entry (swap debits and credits)
    const reversingLines: JournalLine[] = original.lines.map((line) => ({
      accountId: line.accountId,
      amount: line.amount,
      type: line.type === "debit" ? "credit" : "debit",
      memo: `Reversal: ${line.memo ?? ""}`.trim(),
    }));

    const reversingEntry = this.post({
      lines: reversingLines,
      metadata: {
        description: `VOID: ${original.metadata.description} - ${reason}`,
        reference: original.metadata.reference,
        tags: [...(original.metadata.tags ?? []), "void", "reversal"],
      },
    });

    // Mark original as voided (create new frozen object)
    const voidedOriginal: JournalEntry = Object.freeze({
      ...original,
      isVoided: true,
      voidedBy: reversingEntry.id,
    });

    // Update in place (the array slot)
    this.journalEntries[originalIndex] = voidedOriginal;

    // Mark reversing entry with reference to original
    const lastIndex = this.journalEntries.length - 1;
    const reversingWithRef: JournalEntry = Object.freeze({
      ...this.journalEntries[lastIndex],
      voids: entryId,
    });
    this.journalEntries[lastIndex] = reversingWithRef;

    return reversingWithRef;
  }

  /**
   * Queries journal entries with various filters.
   */
  query(options: JournalQueryOptions = {}): JournalEntry[] {
    let entries = [...this.journalEntries];

    // Filter voided entries (excluded by default)
    if (!options.includeVoided) {
      entries = entries.filter((e) => !e.isVoided);
    }

    // Filter by date range
    if (options.fromDate) {
      entries = entries.filter(
        (e) =>
          (e.metadata.date ?? e.createdAt) >=
          (options.fromDate ?? new Date(0)),
      );
    }
    if (options.toDate) {
      entries = entries.filter(
        (e) =>
          (e.metadata.date ?? e.createdAt) <=
          (options.toDate ?? new Date(8640000000000000)),
      );
    }

    // Filter by account
    if (options.accountId) {
      entries = entries.filter((e) =>
        e.lines.some((l) => l.accountId === options.accountId),
      );
    }

    // Filter by reference
    if (options.reference) {
      entries = entries.filter(
        (e) => e.metadata.reference === options.reference,
      );
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      entries = entries.filter((e) =>
        options.tags!.some((tag) => e.metadata.tags?.includes(tag)),
      );
    }

    // Pagination
    if (options.offset) {
      entries = entries.slice(options.offset);
    }
    if (options.limit) {
      entries = entries.slice(0, options.limit);
    }

    return entries;
  }

  /**
   * Gets the account balance history for a specific account.
   */
  getAccountHistory(
    accountId: string,
  ): Array<{ entry: JournalEntry; line: JournalLine; runningBalance: Money }> {
    const account = this.getAccountOrThrow(accountId);
    const history: Array<{
      entry: JournalEntry;
      line: JournalLine;
      runningBalance: Money;
    }> = [];

    let runningDebits = Money.zero(this.currency);
    let runningCredits = Money.zero(this.currency);

    for (const entry of this.journalEntries) {
      if (entry.isVoided) continue;

      for (const line of entry.lines) {
        if (line.accountId === accountId) {
          if (line.type === "debit") {
            runningDebits = runningDebits.add(line.amount);
          } else {
            runningCredits = runningCredits.add(line.amount);
          }

          const runningBalance = account.increasesWithDebit()
            ? runningDebits.subtract(runningCredits)
            : runningCredits.subtract(runningDebits);

          history.push({
            entry,
            line: line as JournalLine,
            runningBalance,
          });
        }
      }
    }

    return history;
  }

  /**
   * Generates a trial balance report.
   *
   * A trial balance lists all accounts with their debit or credit balances.
   * In a properly maintained ledger, total debits must equal total credits.
   */
  getTrialBalance(asOf?: Date): TrialBalance {
    const entries: TrialBalanceEntry[] = [];
    let totalDebits = Money.zero(this.currency);
    let totalCredits = Money.zero(this.currency);

    for (const account of this.accounts.values()) {
      if (!account.isActive) continue;

      const balance = account.getBalance();
      const classification = account.getClassification();

      let debitBalance = Money.zero(this.currency);
      let creditBalance = Money.zero(this.currency);

      // Place balance on appropriate side
      if (balance.isPositive()) {
        if (classification.normalBalance === "debit") {
          debitBalance = balance;
          totalDebits = totalDebits.add(balance);
        } else {
          creditBalance = balance;
          totalCredits = totalCredits.add(balance);
        }
      } else if (balance.isNegative()) {
        // Contra balance - put on opposite side
        const absBalance = balance.abs();
        if (classification.normalBalance === "debit") {
          creditBalance = absBalance;
          totalCredits = totalCredits.add(absBalance);
        } else {
          debitBalance = absBalance;
          totalDebits = totalDebits.add(absBalance);
        }
      }

      // Only include accounts with activity
      if (!debitBalance.isZero() || !creditBalance.isZero()) {
        entries.push({
          accountId: account.id,
          accountName: account.name,
          accountType: account.type,
          debitBalance,
          creditBalance,
        });
      }
    }

    return {
      asOf: asOf ?? new Date(),
      entries,
      totalDebits,
      totalCredits,
      isBalanced: totalDebits.equals(totalCredits),
      currency: this.currency,
    };
  }

  /**
   * Gets all journal entries (read-only).
   */
  getJournalEntries(): ReadonlyArray<JournalEntry> {
    return Object.freeze([...this.journalEntries]);
  }

  /**
   * Verifies the integrity of the journal entry chain.
   *
   * Note: Voided entries are verified based on their original content.
   * The isVoided and voidedBy fields are added after creation and not
   * part of the hash integrity check.
   */
  verify(): boolean {
    for (let i = 0; i < this.journalEntries.length; i++) {
      const entry = this.journalEntries[i];
      const previousEntry = i > 0 ? this.journalEntries[i - 1] : null;

      // Check previous hash pointer
      if (previousEntry) {
        if (entry.previousHash !== previousEntry.hash) return false;
      } else {
        if (entry.previousHash !== null) return false;
      }

      // Check integrity of current entry
      // Reconstruct content as it was when the hash was originally calculated
      // (before any post-creation modifications like voiding)
      const content = {
        id: entry.id,
        entryNumber: entry.entryNumber,
        lines: entry.lines,
        metadata: entry.metadata,
        createdAt: entry.createdAt,
        previousHash: entry.previousHash,
        isPosted: true, // Always true at creation time
        isVoided: entry.voids ? true : false, // Reversing entries have voids set at creation
      };

      const calculatedHash = generateHashSync(content);
      if (entry.hash !== calculatedHash) return false;
    }
    return true;
  }

  /**
   * Creates a snapshot for backup/restore.
   */
  snapshot(): DoubleEntrySnapshot {
    const accounts = Array.from(this.accounts.values()).map((account) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      currency: account.currency,
      description: account.description,
      parentId: account.parentId,
      accountNumber: account.accountNumber,
      isActive: account.isActive,
      metadata: { ...account.metadata },
      debits: JSON.stringify(account.getTotalDebits().toJSON()),
      credits: JSON.stringify(account.getTotalCredits().toJSON()),
    }));

    return {
      version: SNAPSHOT_VERSION,
      accounts,
      journalEntries: [...this.journalEntries],
      nextEntryNumber: this.nextEntryNumber,
      currency: this.currency,
      createdAt: new Date(),
      checksum: generateHashSync({
        accounts,
        journalEntries: this.journalEntries,
      }),
    };
  }

  /**
   * Restores from a snapshot.
   */
  static fromSnapshot(snapshot: DoubleEntrySnapshot): DoubleEntryLedger {
    const ledger = new DoubleEntryLedger(snapshot.currency);

    // Restore accounts
    for (const accountData of snapshot.accounts) {
      const account = new Account({
        id: accountData.id,
        name: accountData.name,
        type: accountData.type as AccountType,
        currency: accountData.currency,
        description: accountData.description,
        parentId: accountData.parentId,
        accountNumber: accountData.accountNumber,
        isActive: accountData.isActive,
        metadata: accountData.metadata,
      });

      // Restore balances directly (skip normal posting)
      const debitsData = JSON.parse(accountData.debits) as { amount: string; currency: string };
      const creditsData = JSON.parse(accountData.credits) as { amount: string; currency: string };
      const debits = Money.fromMinor(BigInt(debitsData.amount), debitsData.currency);
      const credits = Money.fromMinor(BigInt(creditsData.amount), creditsData.currency);

      if (!debits.isZero()) {
        account.debit(debits);
      }
      if (!credits.isZero()) {
        account.credit(credits);
      }

      ledger.accounts.set(account.id, account);
    }

    // Restore journal entries
    ledger.journalEntries = [...snapshot.journalEntries];
    ledger.nextEntryNumber = snapshot.nextEntryNumber;

    return ledger;
  }

  /**
   * Gets the ledger currency.
   */
  getCurrency(): string {
    return this.currency;
  }

  /**
   * Gets summary statistics about the ledger.
   */
  getSummary(): {
    accountCount: number;
    entryCount: number;
    currency: string;
    isBalanced: boolean;
  } {
    const trialBalance = this.getTrialBalance();
    return {
      accountCount: this.accounts.size,
      entryCount: this.journalEntries.length,
      currency: this.currency,
      isBalanced: trialBalance.isBalanced,
    };
  }
}

/**
 * Common chart of accounts templates for SMB use cases.
 */
export const ChartOfAccountsTemplates = {
  /**
   * Basic template for a small business.
   */
  smallBusiness: (currency: string): AccountConfig[] => [
    // Assets (1000s)
    {
      id: "cash",
      name: "Cash",
      type: "asset",
      currency,
      accountNumber: "1000",
    },
    {
      id: "bank",
      name: "Bank Account",
      type: "asset",
      currency,
      accountNumber: "1010",
    },
    {
      id: "accounts-receivable",
      name: "Accounts Receivable",
      type: "asset",
      currency,
      accountNumber: "1200",
    },
    {
      id: "inventory",
      name: "Inventory",
      type: "asset",
      currency,
      accountNumber: "1400",
    },
    {
      id: "prepaid-expenses",
      name: "Prepaid Expenses",
      type: "asset",
      currency,
      accountNumber: "1500",
    },
    {
      id: "equipment",
      name: "Equipment",
      type: "asset",
      currency,
      accountNumber: "1600",
    },
    {
      id: "accumulated-depreciation",
      name: "Accumulated Depreciation",
      type: "contra-asset",
      currency,
      accountNumber: "1650",
    },

    // Liabilities (2000s)
    {
      id: "accounts-payable",
      name: "Accounts Payable",
      type: "liability",
      currency,
      accountNumber: "2000",
    },
    {
      id: "credit-cards",
      name: "Credit Cards Payable",
      type: "liability",
      currency,
      accountNumber: "2100",
    },
    {
      id: "payroll-liabilities",
      name: "Payroll Liabilities",
      type: "liability",
      currency,
      accountNumber: "2200",
    },
    {
      id: "sales-tax-payable",
      name: "Sales Tax Payable",
      type: "liability",
      currency,
      accountNumber: "2300",
    },
    {
      id: "loans-payable",
      name: "Loans Payable",
      type: "liability",
      currency,
      accountNumber: "2500",
    },

    // Equity (3000s)
    {
      id: "owner-equity",
      name: "Owner's Equity",
      type: "equity",
      currency,
      accountNumber: "3000",
    },
    {
      id: "retained-earnings",
      name: "Retained Earnings",
      type: "equity",
      currency,
      accountNumber: "3200",
    },
    {
      id: "owner-draws",
      name: "Owner's Draws",
      type: "contra-equity",
      currency,
      accountNumber: "3300",
    },

    // Revenue (4000s)
    {
      id: "sales-revenue",
      name: "Sales Revenue",
      type: "revenue",
      currency,
      accountNumber: "4000",
    },
    {
      id: "service-revenue",
      name: "Service Revenue",
      type: "revenue",
      currency,
      accountNumber: "4100",
    },
    {
      id: "other-income",
      name: "Other Income",
      type: "revenue",
      currency,
      accountNumber: "4900",
    },
    {
      id: "sales-discounts",
      name: "Sales Discounts",
      type: "contra-revenue",
      currency,
      accountNumber: "4010",
    },
    {
      id: "sales-returns",
      name: "Sales Returns",
      type: "contra-revenue",
      currency,
      accountNumber: "4020",
    },

    // Expenses (5000s-6000s)
    {
      id: "cost-of-goods-sold",
      name: "Cost of Goods Sold",
      type: "expense",
      currency,
      accountNumber: "5000",
    },
    {
      id: "wages-expense",
      name: "Wages Expense",
      type: "expense",
      currency,
      accountNumber: "6000",
    },
    {
      id: "rent-expense",
      name: "Rent Expense",
      type: "expense",
      currency,
      accountNumber: "6100",
    },
    {
      id: "utilities-expense",
      name: "Utilities Expense",
      type: "expense",
      currency,
      accountNumber: "6200",
    },
    {
      id: "office-supplies",
      name: "Office Supplies",
      type: "expense",
      currency,
      accountNumber: "6300",
    },
    {
      id: "insurance-expense",
      name: "Insurance Expense",
      type: "expense",
      currency,
      accountNumber: "6400",
    },
    {
      id: "depreciation-expense",
      name: "Depreciation Expense",
      type: "expense",
      currency,
      accountNumber: "6500",
    },
    {
      id: "bank-fees",
      name: "Bank Fees",
      type: "expense",
      currency,
      accountNumber: "6600",
    },
    {
      id: "professional-services",
      name: "Professional Services",
      type: "expense",
      currency,
      accountNumber: "6700",
    },
    {
      id: "marketing-expense",
      name: "Marketing & Advertising",
      type: "expense",
      currency,
      accountNumber: "6800",
    },
  ],

  /**
   * E-commerce specific accounts.
   */
  ecommerce: (currency: string): AccountConfig[] => [
    ...ChartOfAccountsTemplates.smallBusiness(currency),
    {
      id: "stripe-clearing",
      name: "Stripe Clearing",
      type: "asset",
      currency,
      accountNumber: "1020",
    },
    {
      id: "paypal-clearing",
      name: "PayPal Clearing",
      type: "asset",
      currency,
      accountNumber: "1021",
    },
    {
      id: "shipping-income",
      name: "Shipping Income",
      type: "revenue",
      currency,
      accountNumber: "4200",
    },
    {
      id: "payment-processing-fees",
      name: "Payment Processing Fees",
      type: "expense",
      currency,
      accountNumber: "5100",
    },
    {
      id: "shipping-expense",
      name: "Shipping Expense",
      type: "expense",
      currency,
      accountNumber: "5200",
    },
    {
      id: "refunds-expense",
      name: "Refunds Expense",
      type: "expense",
      currency,
      accountNumber: "5300",
    },
  ],

  /**
   * SaaS/Subscription business accounts.
   */
  saas: (currency: string): AccountConfig[] => [
    ...ChartOfAccountsTemplates.smallBusiness(currency),
    {
      id: "deferred-revenue",
      name: "Deferred Revenue",
      type: "liability",
      currency,
      accountNumber: "2400",
    },
    {
      id: "subscription-revenue",
      name: "Subscription Revenue",
      type: "revenue",
      currency,
      accountNumber: "4000",
    },
    {
      id: "usage-revenue",
      name: "Usage Revenue",
      type: "revenue",
      currency,
      accountNumber: "4100",
    },
    {
      id: "hosting-costs",
      name: "Hosting & Infrastructure",
      type: "expense",
      currency,
      accountNumber: "5100",
    },
    {
      id: "customer-success",
      name: "Customer Success",
      type: "expense",
      currency,
      accountNumber: "6900",
    },
  ],
};
