// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Money } from "../money/Money";
import { Currency } from "../currency/Currency";
import { CurrencyMismatchError } from "../errors/CurrencyMismatchError";
import { Entry, TransactionMetadata, LedgerSnapshot, TransactionType } from "./types";
import { generateHash, generateHashSync, verifyChain, verifyChainSync } from "./verification";
import { randomUUID } from "crypto";

/**
 * Current snapshot format version.
 */
const SNAPSHOT_VERSION = 2;
export class Ledger {
  private entries: Entry[] = stryMutAct_9fa48("763") ? ["Stryker was here"] : (stryCov_9fa48("763"), []);
  private currency: string;
  constructor(currency: string | Currency) {
    if (stryMutAct_9fa48("764")) {
      {}
    } else {
      stryCov_9fa48("764");
      this.currency = (stryMutAct_9fa48("767") ? typeof currency !== "string" : stryMutAct_9fa48("766") ? false : stryMutAct_9fa48("765") ? true : (stryCov_9fa48("765", "766", "767"), typeof currency === (stryMutAct_9fa48("768") ? "" : (stryCov_9fa48("768"), "string")))) ? currency : currency.code;
    }
  }

  /**
   * Records a transaction in the ledger.
   * Returns the created entry for reference.
   * Note: This is the synchronous version for Node.js. Use recordAsync for browser support.
   */
  record(money: Money, metadata: TransactionMetadata): Entry {
    if (stryMutAct_9fa48("769")) {
      {}
    } else {
      stryCov_9fa48("769");
      if (stryMutAct_9fa48("772") ? money.currency.code === this.currency : stryMutAct_9fa48("771") ? false : stryMutAct_9fa48("770") ? true : (stryCov_9fa48("770", "771", "772"), money.currency.code !== this.currency)) {
        if (stryMutAct_9fa48("773")) {
          {}
        } else {
          stryCov_9fa48("773");
          throw new CurrencyMismatchError(this.currency, money.currency.code);
        }
      }
      const previousHash = (stryMutAct_9fa48("777") ? this.entries.length <= 0 : stryMutAct_9fa48("776") ? this.entries.length >= 0 : stryMutAct_9fa48("775") ? false : stryMutAct_9fa48("774") ? true : (stryCov_9fa48("774", "775", "776", "777"), this.entries.length > 0)) ? this.entries[stryMutAct_9fa48("778") ? this.entries.length + 1 : (stryCov_9fa48("778"), this.entries.length - 1)].hash : null;

      // Construct the entry content first
      const content = stryMutAct_9fa48("779") ? {} : (stryCov_9fa48("779"), {
        id: randomUUID(),
        money,
        metadata: Object.freeze(stryMutAct_9fa48("780") ? {} : (stryCov_9fa48("780"), {
          ...metadata,
          timestamp: stryMutAct_9fa48("781") ? metadata.timestamp && new Date() : (stryCov_9fa48("781"), metadata.timestamp ?? new Date())
        })),
        createdAt: new Date(),
        previousHash
      });

      // Calculate hash (sync)
      const hash = generateHashSync(content);

      // Create full entry
      const entry: Entry = stryMutAct_9fa48("782") ? {} : (stryCov_9fa48("782"), {
        ...content,
        hash
      });
      this.entries.push(Object.freeze(entry)); // Immutable

      return entry;
    }
  }

  /**
   * Records a transaction in the ledger (async version for browser support).
   * Returns the created entry for reference.
   */
  async recordAsync(money: Money, metadata: TransactionMetadata): Promise<Entry> {
    if (stryMutAct_9fa48("783")) {
      {}
    } else {
      stryCov_9fa48("783");
      if (stryMutAct_9fa48("786") ? money.currency.code === this.currency : stryMutAct_9fa48("785") ? false : stryMutAct_9fa48("784") ? true : (stryCov_9fa48("784", "785", "786"), money.currency.code !== this.currency)) {
        if (stryMutAct_9fa48("787")) {
          {}
        } else {
          stryCov_9fa48("787");
          throw new CurrencyMismatchError(this.currency, money.currency.code);
        }
      }
      const previousHash = (stryMutAct_9fa48("791") ? this.entries.length <= 0 : stryMutAct_9fa48("790") ? this.entries.length >= 0 : stryMutAct_9fa48("789") ? false : stryMutAct_9fa48("788") ? true : (stryCov_9fa48("788", "789", "790", "791"), this.entries.length > 0)) ? this.entries[stryMutAct_9fa48("792") ? this.entries.length + 1 : (stryCov_9fa48("792"), this.entries.length - 1)].hash : null;
      const content = stryMutAct_9fa48("793") ? {} : (stryCov_9fa48("793"), {
        id: randomUUID(),
        money,
        metadata: Object.freeze(stryMutAct_9fa48("794") ? {} : (stryCov_9fa48("794"), {
          ...metadata,
          timestamp: stryMutAct_9fa48("795") ? metadata.timestamp && new Date() : (stryCov_9fa48("795"), metadata.timestamp ?? new Date())
        })),
        createdAt: new Date(),
        previousHash
      });
      const hash = await generateHash(content);
      const entry: Entry = stryMutAct_9fa48("796") ? {} : (stryCov_9fa48("796"), {
        ...content,
        hash: (stryMutAct_9fa48("799") ? typeof hash !== "string" : stryMutAct_9fa48("798") ? false : stryMutAct_9fa48("797") ? true : (stryCov_9fa48("797", "798", "799"), typeof hash === (stryMutAct_9fa48("800") ? "" : (stryCov_9fa48("800"), "string")))) ? hash : await hash
      });
      this.entries.push(Object.freeze(entry));
      return entry;
    }
  }

  /**
   * Gets the current balance.
   */
  getBalance(): Money {
    if (stryMutAct_9fa48("801")) {
      {}
    } else {
      stryCov_9fa48("801");
      return this.entries.reduce(stryMutAct_9fa48("802") ? () => undefined : (stryCov_9fa48("802"), (balance, entry) => balance.add(entry.money)), Money.zero(this.currency));
    }
  }

  /**
   * Returns the complete transaction history.
   */
  getHistory(): ReadonlyArray<Entry> {
    if (stryMutAct_9fa48("803")) {
      {}
    } else {
      stryCov_9fa48("803");
      return Object.freeze(stryMutAct_9fa48("804") ? [] : (stryCov_9fa48("804"), [...this.entries]));
    }
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
    if (stryMutAct_9fa48("805")) {
      {}
    } else {
      stryCov_9fa48("805");
      return stryMutAct_9fa48("806") ? this.entries : (stryCov_9fa48("806"), this.entries.filter(entry => {
        if (stryMutAct_9fa48("807")) {
          {}
        } else {
          stryCov_9fa48("807");
          if (stryMutAct_9fa48("809") ? false : stryMutAct_9fa48("808") ? true : (stryCov_9fa48("808", "809"), filter.type)) {
            if (stryMutAct_9fa48("810")) {
              {}
            } else {
              stryCov_9fa48("810");
              const types = Array.isArray(filter.type) ? filter.type : stryMutAct_9fa48("811") ? [] : (stryCov_9fa48("811"), [filter.type]);
              if (stryMutAct_9fa48("814") ? false : stryMutAct_9fa48("813") ? true : stryMutAct_9fa48("812") ? types.includes(entry.metadata.type) : (stryCov_9fa48("812", "813", "814"), !types.includes(entry.metadata.type))) return stryMutAct_9fa48("815") ? true : (stryCov_9fa48("815"), false);
            }
          }
          if (stryMutAct_9fa48("818") ? filter.from || entry.createdAt < filter.from : stryMutAct_9fa48("817") ? false : stryMutAct_9fa48("816") ? true : (stryCov_9fa48("816", "817", "818"), filter.from && (stryMutAct_9fa48("821") ? entry.createdAt >= filter.from : stryMutAct_9fa48("820") ? entry.createdAt <= filter.from : stryMutAct_9fa48("819") ? true : (stryCov_9fa48("819", "820", "821"), entry.createdAt < filter.from)))) return stryMutAct_9fa48("822") ? true : (stryCov_9fa48("822"), false);
          if (stryMutAct_9fa48("825") ? filter.to || entry.createdAt > filter.to : stryMutAct_9fa48("824") ? false : stryMutAct_9fa48("823") ? true : (stryCov_9fa48("823", "824", "825"), filter.to && (stryMutAct_9fa48("828") ? entry.createdAt <= filter.to : stryMutAct_9fa48("827") ? entry.createdAt >= filter.to : stryMutAct_9fa48("826") ? true : (stryCov_9fa48("826", "827", "828"), entry.createdAt > filter.to)))) return stryMutAct_9fa48("829") ? true : (stryCov_9fa48("829"), false);
          if (stryMutAct_9fa48("832") ? filter.reference || entry.metadata.reference !== filter.reference : stryMutAct_9fa48("831") ? false : stryMutAct_9fa48("830") ? true : (stryCov_9fa48("830", "831", "832"), filter.reference && (stryMutAct_9fa48("834") ? entry.metadata.reference === filter.reference : stryMutAct_9fa48("833") ? true : (stryCov_9fa48("833", "834"), entry.metadata.reference !== filter.reference)))) return stryMutAct_9fa48("835") ? true : (stryCov_9fa48("835"), false);
          if (stryMutAct_9fa48("838") ? filter.minAmount || entry.money.lessThan(filter.minAmount) : stryMutAct_9fa48("837") ? false : stryMutAct_9fa48("836") ? true : (stryCov_9fa48("836", "837", "838"), filter.minAmount && entry.money.lessThan(filter.minAmount))) return stryMutAct_9fa48("839") ? true : (stryCov_9fa48("839"), false);
          if (stryMutAct_9fa48("842") ? filter.maxAmount || entry.money.greaterThan(filter.maxAmount) : stryMutAct_9fa48("841") ? false : stryMutAct_9fa48("840") ? true : (stryCov_9fa48("840", "841", "842"), filter.maxAmount && entry.money.greaterThan(filter.maxAmount))) return stryMutAct_9fa48("843") ? true : (stryCov_9fa48("843"), false);
          if (stryMutAct_9fa48("846") ? filter.tags || entry.metadata.tags : stryMutAct_9fa48("845") ? false : stryMutAct_9fa48("844") ? true : (stryCov_9fa48("844", "845", "846"), filter.tags && entry.metadata.tags)) {
            if (stryMutAct_9fa48("847")) {
              {}
            } else {
              stryCov_9fa48("847");
              const hasTag = stryMutAct_9fa48("848") ? filter.tags.every(tag => entry.metadata.tags?.includes(tag)) : (stryCov_9fa48("848"), filter.tags.some(stryMutAct_9fa48("849") ? () => undefined : (stryCov_9fa48("849"), tag => stryMutAct_9fa48("850") ? entry.metadata.tags.includes(tag) : (stryCov_9fa48("850"), entry.metadata.tags?.includes(tag)))));
              if (stryMutAct_9fa48("853") ? false : stryMutAct_9fa48("852") ? true : stryMutAct_9fa48("851") ? hasTag : (stryCov_9fa48("851", "852", "853"), !hasTag)) return stryMutAct_9fa48("854") ? true : (stryCov_9fa48("854"), false);
            }
          }
          return stryMutAct_9fa48("855") ? false : (stryCov_9fa48("855"), true);
        }
      }));
    }
  }

  /**
   * Verifies the integrity of the ledger using hash chain (sync version).
   * @returns true if all hashes are valid and chain is unbroken.
   */
  verify(): boolean {
    if (stryMutAct_9fa48("856")) {
      {}
    } else {
      stryCov_9fa48("856");
      return verifyChainSync(this.entries);
    }
  }

  /**
   * Verifies the integrity of the ledger using hash chain (async version for browsers).
   * @returns Promise resolving to true if all hashes are valid and chain is unbroken.
   */
  async verifyAsync(): Promise<boolean> {
    if (stryMutAct_9fa48("857")) {
      {}
    } else {
      stryCov_9fa48("857");
      return verifyChain(this.entries);
    }
  }

  /**
   * Exports a snapshot for backup/audit purposes (sync version).
   */
  snapshot(): LedgerSnapshot {
    if (stryMutAct_9fa48("858")) {
      {}
    } else {
      stryCov_9fa48("858");
      return stryMutAct_9fa48("859") ? {} : (stryCov_9fa48("859"), {
        version: SNAPSHOT_VERSION,
        entries: stryMutAct_9fa48("860") ? [] : (stryCov_9fa48("860"), [...this.entries]),
        balance: this.getBalance(),
        currency: this.currency,
        createdAt: new Date(),
        checksum: generateHashSync(stryMutAct_9fa48("861") ? {} : (stryCov_9fa48("861"), {
          entries: this.entries
        }))
      });
    }
  }

  /**
   * Exports a snapshot for backup/audit purposes (async version for browsers).
   */
  async snapshotAsync(): Promise<LedgerSnapshot> {
    if (stryMutAct_9fa48("862")) {
      {}
    } else {
      stryCov_9fa48("862");
      const checksum = await generateHash(stryMutAct_9fa48("863") ? {} : (stryCov_9fa48("863"), {
        entries: this.entries
      }));
      return stryMutAct_9fa48("864") ? {} : (stryCov_9fa48("864"), {
        version: SNAPSHOT_VERSION,
        entries: stryMutAct_9fa48("865") ? [] : (stryCov_9fa48("865"), [...this.entries]),
        balance: this.getBalance(),
        currency: this.currency,
        createdAt: new Date(),
        checksum: (stryMutAct_9fa48("868") ? typeof checksum !== "string" : stryMutAct_9fa48("867") ? false : stryMutAct_9fa48("866") ? true : (stryCov_9fa48("866", "867", "868"), typeof checksum === (stryMutAct_9fa48("869") ? "" : (stryCov_9fa48("869"), "string")))) ? checksum : await checksum
      });
    }
  }

  /**
   * Restores from a snapshot (sync version).
   */
  static fromSnapshot(snapshot: LedgerSnapshot): Ledger {
    if (stryMutAct_9fa48("870")) {
      {}
    } else {
      stryCov_9fa48("870");
      const ledger = new Ledger(snapshot.currency);
      // Verify integrity before restoring
      if (stryMutAct_9fa48("873") ? false : stryMutAct_9fa48("872") ? true : stryMutAct_9fa48("871") ? verifyChainSync(snapshot.entries) : (stryCov_9fa48("871", "872", "873"), !verifyChainSync(snapshot.entries))) {
        if (stryMutAct_9fa48("874")) {
          {}
        } else {
          stryCov_9fa48("874");
          throw new Error(stryMutAct_9fa48("875") ? "" : (stryCov_9fa48("875"), "Ledger snapshot integrity check failed"));
        }
      }
      ledger.entries = stryMutAct_9fa48("876") ? [] : (stryCov_9fa48("876"), [...snapshot.entries]);
      return ledger;
    }
  }

  /**
   * Restores from a snapshot (async version for browsers).
   */
  static async fromSnapshotAsync(snapshot: LedgerSnapshot): Promise<Ledger> {
    if (stryMutAct_9fa48("877")) {
      {}
    } else {
      stryCov_9fa48("877");
      const ledger = new Ledger(snapshot.currency);
      // Verify integrity before restoring
      const isValid = await verifyChain(snapshot.entries);
      if (stryMutAct_9fa48("880") ? false : stryMutAct_9fa48("879") ? true : stryMutAct_9fa48("878") ? isValid : (stryCov_9fa48("878", "879", "880"), !isValid)) {
        if (stryMutAct_9fa48("881")) {
          {}
        } else {
          stryCov_9fa48("881");
          throw new Error(stryMutAct_9fa48("882") ? "" : (stryCov_9fa48("882"), "Ledger snapshot integrity check failed"));
        }
      }
      ledger.entries = stryMutAct_9fa48("883") ? [] : (stryCov_9fa48("883"), [...snapshot.entries]);
      return ledger;
    }
  }
}