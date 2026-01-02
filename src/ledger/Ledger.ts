import { Money } from "../money/Money";
import { Currency } from "../currency/Currency";
import { CurrencyMismatchError } from "../errors/CurrencyMismatchError";
import {
  Entry,
  TransactionMetadata,
  LedgerSnapshot,
  TransactionType,
} from "./types";
import {
  generateHash,
  generateHashSync,
  verifyChain,
  verifyChainSync,
} from "./verification";
import { randomUUID } from "crypto";

/**
 * Current snapshot format version.
 */
const SNAPSHOT_VERSION = 2;

export class Ledger {
  private entries: Entry[] = [];
  private currency: string;

  constructor(currency: string | Currency) {
    this.currency = typeof currency === "string" ? currency : currency.code;
  }

  /**
   * Records a transaction in the ledger.
   * Returns the created entry for reference.
   * Note: This is the synchronous version for Node.js. Use recordAsync for browser support.
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

    // Calculate hash (sync)
    const hash = generateHashSync(content);

    // Create full entry
    const entry: Entry = {
      ...content,
      hash,
    };

    this.entries.push(Object.freeze(entry)); // Immutable

    return entry;
  }

  /**
   * Records a transaction in the ledger (async version for browser support).
   * Returns the created entry for reference.
   */
  async recordAsync(money: Money, metadata: TransactionMetadata): Promise<Entry> {
    if (money.currency.code !== this.currency) {
      throw new CurrencyMismatchError(this.currency, money.currency.code);
    }

    const previousHash =
      this.entries.length > 0
        ? this.entries[this.entries.length - 1].hash
        : null;

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

    const hash = await generateHash(content);

    const entry: Entry = {
      ...content,
      hash: typeof hash === "string" ? hash : await hash,
    };

    this.entries.push(Object.freeze(entry));

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
   * Verifies the integrity of the ledger using hash chain (sync version).
   * @returns true if all hashes are valid and chain is unbroken.
   */
  verify(): boolean {
    return verifyChainSync(this.entries);
  }

  /**
   * Verifies the integrity of the ledger using hash chain (async version for browsers).
   * @returns Promise resolving to true if all hashes are valid and chain is unbroken.
   */
  async verifyAsync(): Promise<boolean> {
    return verifyChain(this.entries);
  }

  /**
   * Exports a snapshot for backup/audit purposes (sync version).
   */
  snapshot(): LedgerSnapshot {
    return {
      version: SNAPSHOT_VERSION,
      entries: [...this.entries],
      balance: this.getBalance(),
      currency: this.currency,
      createdAt: new Date(),
      checksum: generateHashSync({ entries: this.entries }),
    };
  }

  /**
   * Exports a snapshot for backup/audit purposes (async version for browsers).
   */
  async snapshotAsync(): Promise<LedgerSnapshot> {
    const checksum = await generateHash({ entries: this.entries });
    return {
      version: SNAPSHOT_VERSION,
      entries: [...this.entries],
      balance: this.getBalance(),
      currency: this.currency,
      createdAt: new Date(),
      checksum: typeof checksum === "string" ? checksum : await checksum,
    };
  }

  /**
   * Restores from a snapshot (sync version).
   */
  static fromSnapshot(snapshot: LedgerSnapshot): Ledger {
    const ledger = new Ledger(snapshot.currency);
    // Verify integrity before restoring
    if (!verifyChainSync(snapshot.entries)) {
      throw new Error("Ledger snapshot integrity check failed");
    }
    ledger.entries = [...snapshot.entries];
    return ledger;
  }

  /**
   * Restores from a snapshot (async version for browsers).
   */
  static async fromSnapshotAsync(snapshot: LedgerSnapshot): Promise<Ledger> {
    const ledger = new Ledger(snapshot.currency);
    // Verify integrity before restoring
    const isValid = await verifyChain(snapshot.entries);
    if (!isValid) {
      throw new Error("Ledger snapshot integrity check failed");
    }
    ledger.entries = [...snapshot.entries];
    return ledger;
  }
}
