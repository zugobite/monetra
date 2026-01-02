import { Money } from "../money/Money";
import { Currency } from "../currency/Currency";
import { CurrencyMismatchError } from "../errors/CurrencyMismatchError";
import {
  Entry,
  TransactionMetadata,
  LedgerSnapshot,
  TransactionType,
} from "./types";
import { generateHash, verifyChain } from "./verification";
import { randomUUID } from "crypto";

export class Ledger {
  private entries: Entry[] = [];
  private currency: string;

  constructor(currency: string | Currency) {
    this.currency = typeof currency === "string" ? currency : currency.code;
  }

  /**
   * Records a transaction in the ledger.
   * Returns the created entry for reference.
   */
  record(money: Money, metadata: TransactionMetadata): Entry {
    if (money.currency.code !== this.currency) {
      throw new CurrencyMismatchError(this.currency, money.currency.code);
    }

    const previousHash =
      this.entries.length > 0
        ? this.entries[this.entries.length - 1].hash
        : null;

    // Construct the entry content first
    const content = {
      id: randomUUID(),
      money,
      metadata: Object.freeze({
        ...metadata,
        timestamp: metadata.timestamp ?? new Date(),
      }),
      createdAt: new Date(),
      previousHash,
    };

    // Calculate hash
    const hash = generateHash(content);

    // Create full entry
    const entry: Entry = {
      ...content,
      hash,
    };

    this.entries.push(Object.freeze(entry)); // Immutable

    return entry;
  }

  /**
   * Gets the current balance.
   */
  getBalance(): Money {
    return this.entries.reduce(
      (balance, entry) => balance.add(entry.money),
      Money.zero(this.currency)
    );
  }

  /**
   * Returns the complete transaction history.
   */
  getHistory(): ReadonlyArray<Entry> {
    return Object.freeze([...this.entries]);
  }

  /**
   * Filters entries by criteria.
   */
  query(filter: {
    type?: TransactionType | TransactionType[];
    from?: Date;
    to?: Date;
    reference?: string;
    minAmount?: Money;
    maxAmount?: Money;
    tags?: string[];
  }): Entry[] {
    return this.entries.filter((entry) => {
      if (filter.type) {
        const types = Array.isArray(filter.type) ? filter.type : [filter.type];
        if (!types.includes(entry.metadata.type)) return false;
      }
      if (filter.from && entry.createdAt < filter.from) return false;
      if (filter.to && entry.createdAt > filter.to) return false;
      if (filter.reference && entry.metadata.reference !== filter.reference)
        return false;
      if (filter.minAmount && entry.money.lessThan(filter.minAmount))
        return false;
      if (filter.maxAmount && entry.money.greaterThan(filter.maxAmount))
        return false;
      if (filter.tags && entry.metadata.tags) {
        const hasTag = filter.tags.some((tag) =>
          entry.metadata.tags?.includes(tag)
        );
        if (!hasTag) return false;
      }
      return true;
    });
  }

  /**
   * Verifies the integrity of the ledger using hash chain.
   * @returns true if all hashes are valid and chain is unbroken.
   */
  verify(): boolean {
    return verifyChain(this.entries);
  }

  /**
   * Exports a snapshot for backup/audit purposes.
   */
  snapshot(): LedgerSnapshot {
    return {
      entries: [...this.entries],
      balance: this.getBalance(),
      currency: this.currency,
      createdAt: new Date(),
      checksum: generateHash({ entries: this.entries }),
    };
  }

  /**
   * Restores from a snapshot.
   */
  static fromSnapshot(snapshot: LedgerSnapshot): Ledger {
    const ledger = new Ledger(snapshot.currency);
    // Verify integrity before restoring
    if (!verifyChain(snapshot.entries)) {
      throw new Error("Ledger snapshot integrity check failed");
    }
    ledger.entries = [...snapshot.entries];
    return ledger;
  }
}
