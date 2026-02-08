import { Money } from "../money/Money";

/**
 * Represents a single line item in a journal entry.
 * Each line is either a debit or credit to a specific account.
 */
export interface JournalLine {
  /** Account ID to post to */
  accountId: string;
  /** Amount to post (always positive) */
  amount: Money;
  /** Whether this is a debit or credit */
  type: "debit" | "credit";
  /** Optional memo for this specific line */
  memo?: string;
}

/**
 * Metadata for a journal entry.
 */
export interface JournalMetadata {
  /** Reference number (invoice #, check #, etc.) */
  reference?: string;
  /** Description of the transaction */
  description: string;
  /** Transaction date (defaults to now) */
  date?: Date;
  /** Who created this entry */
  createdBy?: string;
  /** Tags for categorization */
  tags?: string[];
  /** Custom metadata */
  [key: string]: unknown;
}

/**
 * Input for creating a journal entry.
 */
export interface JournalEntryInput {
  /** Lines to post (debits and credits) */
  lines: JournalLine[];
  /** Transaction metadata */
  metadata: JournalMetadata;
}

/**
 * A complete, immutable journal entry.
 * Represents a balanced double-entry transaction.
 */
export interface JournalEntry {
  /** Unique identifier */
  readonly id: string;
  /** Journal entry number (sequential) */
  readonly entryNumber: number;
  /** All lines in this entry */
  readonly lines: ReadonlyArray<Readonly<JournalLine>>;
  /** Transaction metadata */
  readonly metadata: Readonly<JournalMetadata>;
  /** When the entry was created */
  readonly createdAt: Date;
  /** Hash for integrity verification */
  readonly hash: string;
  /** Previous entry hash for chain verification */
  readonly previousHash: string | null;
  /** Whether this entry has been posted */
  readonly isPosted: boolean;
  /** Whether this entry has been voided */
  readonly isVoided: boolean;
  /** If voided, reference to the reversing entry */
  readonly voidedBy?: string;
  /** If this entry voids another, reference to the original */
  readonly voids?: string;
}

/**
 * Summary of a journal entry for display.
 */
export interface JournalEntrySummary {
  id: string;
  entryNumber: number;
  date: Date;
  description: string;
  totalDebits: Money;
  totalCredits: Money;
  isBalanced: boolean;
  lineCount: number;
  isVoided: boolean;
}

/**
 * Trial balance entry for a single account.
 */
export interface TrialBalanceEntry {
  accountId: string;
  accountName: string;
  accountType: string;
  debitBalance: Money;
  creditBalance: Money;
}

/**
 * Complete trial balance report.
 */
export interface TrialBalance {
  /** Date the trial balance was generated */
  asOf: Date;
  /** Individual account balances */
  entries: TrialBalanceEntry[];
  /** Total of all debit balances */
  totalDebits: Money;
  /** Total of all credit balances */
  totalCredits: Money;
  /** Whether debits equal credits */
  isBalanced: boolean;
  /** Currency of the trial balance */
  currency: string;
}

/**
 * Options for querying journal entries.
 */
export interface JournalQueryOptions {
  /** Filter by date range */
  fromDate?: Date;
  toDate?: Date;
  /** Filter by account ID */
  accountId?: string;
  /** Filter by reference */
  reference?: string;
  /** Filter by tags */
  tags?: string[];
  /** Include voided entries */
  includeVoided?: boolean;
  /** Limit results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

/**
 * Snapshot of the double-entry ledger for backup/restore.
 */
export interface DoubleEntrySnapshot {
  /** Snapshot format version */
  version: number;
  /** All accounts */
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    currency: string;
    description?: string;
    parentId?: string;
    accountNumber?: string;
    isActive: boolean;
    metadata: Record<string, unknown>;
    debits: string; // Serialized Money
    credits: string; // Serialized Money
  }>;
  /** All journal entries */
  journalEntries: JournalEntry[];
  /** Next entry number */
  nextEntryNumber: number;
  /** Currency */
  currency: string;
  /** When snapshot was created */
  createdAt: Date;
  /** Checksum for integrity */
  checksum: string;
}
