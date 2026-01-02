import { Money } from "../money/Money";

export type TransactionType =
  | "credit"
  | "debit"
  | "transfer"
  | "adjustment"
  | "refund"
  | "fee"
  | string; // Allow custom types

export interface TransactionMetadata {
  type: TransactionType;
  reference?: string;
  description?: string;
  timestamp?: Date;
  tags?: string[];
  [key: string]: unknown; // Extensible
}

export interface Entry {
  id: string;
  money: Money;
  metadata: TransactionMetadata;
  createdAt: Date;
  hash: string; // For integrity verification
  previousHash: string | null;
}

export interface LedgerSnapshot {
  entries: Entry[];
  balance: Money;
  currency: string;
  createdAt: Date;
  checksum: string;
}
