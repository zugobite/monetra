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
import { Entry } from "./types";

/**
 * SHA-256 hash function that works in both Node.js and browsers.
 */
let hashFunction: ((data: string) => string | Promise<string>) | null = null;

/**
 * Initializes the hash function based on the environment.
 * Uses Node.js crypto if available, falls back to SubtleCrypto for browsers.
 */
function getHashFunction(): (data: string) => string | Promise<string> {
  if (stryMutAct_9fa48("884")) {
    {}
  } else {
    stryCov_9fa48("884");
    if (stryMutAct_9fa48("886") ? false : stryMutAct_9fa48("885") ? true : (stryCov_9fa48("885", "886"), hashFunction)) return hashFunction;

    // Try Node.js crypto first
    if (stryMutAct_9fa48("889") ? typeof globalThis === "undefined" : stryMutAct_9fa48("888") ? false : stryMutAct_9fa48("887") ? true : (stryCov_9fa48("887", "888", "889"), typeof globalThis !== (stryMutAct_9fa48("890") ? "" : (stryCov_9fa48("890"), "undefined")))) {
      if (stryMutAct_9fa48("891")) {
        {}
      } else {
        stryCov_9fa48("891");
        try {
          if (stryMutAct_9fa48("892")) {
            {}
          } else {
            stryCov_9fa48("892");
            // Dynamic import to avoid bundler issues
            const nodeCrypto = require("crypto");
            if (stryMutAct_9fa48("895") ? nodeCrypto || nodeCrypto.createHash : stryMutAct_9fa48("894") ? false : stryMutAct_9fa48("893") ? true : (stryCov_9fa48("893", "894", "895"), nodeCrypto && nodeCrypto.createHash)) {
              if (stryMutAct_9fa48("896")) {
                {}
              } else {
                stryCov_9fa48("896");
                hashFunction = (data: string): string => {
                  if (stryMutAct_9fa48("897")) {
                    {}
                  } else {
                    stryCov_9fa48("897");
                    return nodeCrypto.createHash(stryMutAct_9fa48("898") ? "" : (stryCov_9fa48("898"), "sha256")).update(data).digest(stryMutAct_9fa48("899") ? "" : (stryCov_9fa48("899"), "hex"));
                  }
                };
                return hashFunction;
              }
            }
          }
        } catch {
          // Node crypto not available
        }
      }
    }

    // Fall back to SubtleCrypto (browser)
    if (stryMutAct_9fa48("902") ? typeof globalThis !== "undefined" && globalThis.crypto || globalThis.crypto.subtle : stryMutAct_9fa48("901") ? false : stryMutAct_9fa48("900") ? true : (stryCov_9fa48("900", "901", "902"), (stryMutAct_9fa48("904") ? typeof globalThis !== "undefined" || globalThis.crypto : stryMutAct_9fa48("903") ? true : (stryCov_9fa48("903", "904"), (stryMutAct_9fa48("906") ? typeof globalThis === "undefined" : stryMutAct_9fa48("905") ? true : (stryCov_9fa48("905", "906"), typeof globalThis !== (stryMutAct_9fa48("907") ? "" : (stryCov_9fa48("907"), "undefined")))) && globalThis.crypto)) && globalThis.crypto.subtle)) {
      if (stryMutAct_9fa48("908")) {
        {}
      } else {
        stryCov_9fa48("908");
        hashFunction = async (data: string): Promise<string> => {
          if (stryMutAct_9fa48("909")) {
            {}
          } else {
            stryCov_9fa48("909");
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(data);
            const hashBuffer = await globalThis.crypto.subtle.digest(stryMutAct_9fa48("910") ? "" : (stryCov_9fa48("910"), "SHA-256"), dataBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(stryMutAct_9fa48("911") ? () => undefined : (stryCov_9fa48("911"), b => b.toString(16).padStart(2, stryMutAct_9fa48("912") ? "" : (stryCov_9fa48("912"), "0")))).join(stryMutAct_9fa48("913") ? "Stryker was here!" : (stryCov_9fa48("913"), ""));
          }
        };
        return hashFunction;
      }
    }

    // No crypto available
    throw new Error((stryMutAct_9fa48("914") ? "" : (stryCov_9fa48("914"), "No cryptographic hash function available. ")) + (stryMutAct_9fa48("915") ? "" : (stryCov_9fa48("915"), "Ensure you are running in Node.js or a browser with SubtleCrypto support.")));
  }
}

/**
 * Allows injecting a custom hash function for testing or special environments.
 */
export function setHashFunction(fn: (data: string) => string | Promise<string>): void {
  if (stryMutAct_9fa48("916")) {
    {}
  } else {
    stryCov_9fa48("916");
    hashFunction = fn;
  }
}
function serialize(data: unknown): string {
  if (stryMutAct_9fa48("917")) {
    {}
  } else {
    stryCov_9fa48("917");
    return JSON.stringify(data, (_key, value) => {
      if (stryMutAct_9fa48("918")) {
        {}
      } else {
        stryCov_9fa48("918");
        if (stryMutAct_9fa48("921") ? typeof value !== "bigint" : stryMutAct_9fa48("920") ? false : stryMutAct_9fa48("919") ? true : (stryCov_9fa48("919", "920", "921"), typeof value === (stryMutAct_9fa48("922") ? "" : (stryCov_9fa48("922"), "bigint")))) {
          if (stryMutAct_9fa48("923")) {
            {}
          } else {
            stryCov_9fa48("923");
            return value.toString();
          }
        }
        // Handle Money objects if they are passed directly and not via toJSON
        if (stryMutAct_9fa48("926") ? value && typeof value === "object" && "minor" in value || "currency" in value : stryMutAct_9fa48("925") ? false : stryMutAct_9fa48("924") ? true : (stryCov_9fa48("924", "925", "926"), (stryMutAct_9fa48("928") ? value && typeof value === "object" || "minor" in value : stryMutAct_9fa48("927") ? true : (stryCov_9fa48("927", "928"), (stryMutAct_9fa48("930") ? value || typeof value === "object" : stryMutAct_9fa48("929") ? true : (stryCov_9fa48("929", "930"), value && (stryMutAct_9fa48("932") ? typeof value !== "object" : stryMutAct_9fa48("931") ? true : (stryCov_9fa48("931", "932"), typeof value === (stryMutAct_9fa48("933") ? "" : (stryCov_9fa48("933"), "object")))))) && (stryMutAct_9fa48("934") ? "" : (stryCov_9fa48("934"), "minor")) in value)) && (stryMutAct_9fa48("935") ? "" : (stryCov_9fa48("935"), "currency")) in value)) {
          if (stryMutAct_9fa48("936")) {
            {}
          } else {
            stryCov_9fa48("936");
            return stryMutAct_9fa48("937") ? {} : (stryCov_9fa48("937"), {
              minor: (value as {
                minor: bigint;
              }).minor.toString(),
              currency: (value as {
                currency: {
                  code: string;
                };
              }).currency.code
            });
          }
        }
        return value;
      }
    });
  }
}

/**
 * Generates a SHA-256 hash of the provided data.
 * Works in both Node.js and browser environments.
 *
 * @param data - The data to hash.
 * @returns The hash as a hex string (sync in Node.js, may be async in browser).
 */
export function generateHash(data: unknown): string | Promise<string> {
  if (stryMutAct_9fa48("938")) {
    {}
  } else {
    stryCov_9fa48("938");
    const serialized = serialize(data);
    const fn = getHashFunction();
    return fn(serialized);
  }
}

/**
 * Synchronous version of generateHash for environments that support it.
 * Throws if only async hashing is available (browser without await).
 *
 * @param data - The data to hash.
 * @returns The hash as a hex string.
 */
export function generateHashSync(data: unknown): string {
  if (stryMutAct_9fa48("939")) {
    {}
  } else {
    stryCov_9fa48("939");
    const result = generateHash(data);
    if (stryMutAct_9fa48("941") ? false : stryMutAct_9fa48("940") ? true : (stryCov_9fa48("940", "941"), result instanceof Promise)) {
      if (stryMutAct_9fa48("942")) {
        {}
      } else {
        stryCov_9fa48("942");
        throw new Error((stryMutAct_9fa48("943") ? "" : (stryCov_9fa48("943"), "Synchronous hashing not available in this environment. ")) + (stryMutAct_9fa48("944") ? "" : (stryCov_9fa48("944"), "Use generateHash() with await instead.")));
      }
    }
    return result;
  }
}

/**
 * Verifies the integrity of a chain of ledger entries.
 * Checks that each entry's hash is correct and that previousHash pointers form a valid chain.
 *
 * @param entries - The entries to verify.
 * @returns True if the chain is valid, false if tampered.
 */
export async function verifyChain(entries: Entry[]): Promise<boolean> {
  if (stryMutAct_9fa48("945")) {
    {}
  } else {
    stryCov_9fa48("945");
    for (let i = 0; stryMutAct_9fa48("948") ? i >= entries.length : stryMutAct_9fa48("947") ? i <= entries.length : stryMutAct_9fa48("946") ? false : (stryCov_9fa48("946", "947", "948"), i < entries.length); stryMutAct_9fa48("949") ? i-- : (stryCov_9fa48("949"), i++)) {
      if (stryMutAct_9fa48("950")) {
        {}
      } else {
        stryCov_9fa48("950");
        const entry = entries[i];
        const previousEntry = (stryMutAct_9fa48("954") ? i <= 0 : stryMutAct_9fa48("953") ? i >= 0 : stryMutAct_9fa48("952") ? false : stryMutAct_9fa48("951") ? true : (stryCov_9fa48("951", "952", "953", "954"), i > 0)) ? entries[stryMutAct_9fa48("955") ? i + 1 : (stryCov_9fa48("955"), i - 1)] : null;

        // Check previous hash pointer
        if (stryMutAct_9fa48("957") ? false : stryMutAct_9fa48("956") ? true : (stryCov_9fa48("956", "957"), previousEntry)) {
          if (stryMutAct_9fa48("958")) {
            {}
          } else {
            stryCov_9fa48("958");
            if (stryMutAct_9fa48("961") ? entry.previousHash === previousEntry.hash : stryMutAct_9fa48("960") ? false : stryMutAct_9fa48("959") ? true : (stryCov_9fa48("959", "960", "961"), entry.previousHash !== previousEntry.hash)) return stryMutAct_9fa48("962") ? true : (stryCov_9fa48("962"), false);
          }
        } else {
          if (stryMutAct_9fa48("963")) {
            {}
          } else {
            stryCov_9fa48("963");
            if (stryMutAct_9fa48("966") ? entry.previousHash === null : stryMutAct_9fa48("965") ? false : stryMutAct_9fa48("964") ? true : (stryCov_9fa48("964", "965", "966"), entry.previousHash !== null)) return stryMutAct_9fa48("967") ? true : (stryCov_9fa48("967"), false);
          }
        }

        // Check integrity of current entry
        const {
          hash,
          ...content
        } = entry;
        const calculatedHash = await generateHash(content);
        if (stryMutAct_9fa48("970") ? hash === calculatedHash : stryMutAct_9fa48("969") ? false : stryMutAct_9fa48("968") ? true : (stryCov_9fa48("968", "969", "970"), hash !== calculatedHash)) return stryMutAct_9fa48("971") ? true : (stryCov_9fa48("971"), false);
      }
    }
    return stryMutAct_9fa48("972") ? false : (stryCov_9fa48("972"), true);
  }
}

/**
 * Synchronous version of verifyChain for Node.js environments.
 *
 * @param entries - The entries to verify.
 * @returns True if the chain is valid.
 */
export function verifyChainSync(entries: Entry[]): boolean {
  if (stryMutAct_9fa48("973")) {
    {}
  } else {
    stryCov_9fa48("973");
    for (let i = 0; stryMutAct_9fa48("976") ? i >= entries.length : stryMutAct_9fa48("975") ? i <= entries.length : stryMutAct_9fa48("974") ? false : (stryCov_9fa48("974", "975", "976"), i < entries.length); stryMutAct_9fa48("977") ? i-- : (stryCov_9fa48("977"), i++)) {
      if (stryMutAct_9fa48("978")) {
        {}
      } else {
        stryCov_9fa48("978");
        const entry = entries[i];
        const previousEntry = (stryMutAct_9fa48("982") ? i <= 0 : stryMutAct_9fa48("981") ? i >= 0 : stryMutAct_9fa48("980") ? false : stryMutAct_9fa48("979") ? true : (stryCov_9fa48("979", "980", "981", "982"), i > 0)) ? entries[stryMutAct_9fa48("983") ? i + 1 : (stryCov_9fa48("983"), i - 1)] : null;
        if (stryMutAct_9fa48("985") ? false : stryMutAct_9fa48("984") ? true : (stryCov_9fa48("984", "985"), previousEntry)) {
          if (stryMutAct_9fa48("986")) {
            {}
          } else {
            stryCov_9fa48("986");
            if (stryMutAct_9fa48("989") ? entry.previousHash === previousEntry.hash : stryMutAct_9fa48("988") ? false : stryMutAct_9fa48("987") ? true : (stryCov_9fa48("987", "988", "989"), entry.previousHash !== previousEntry.hash)) return stryMutAct_9fa48("990") ? true : (stryCov_9fa48("990"), false);
          }
        } else {
          if (stryMutAct_9fa48("991")) {
            {}
          } else {
            stryCov_9fa48("991");
            if (stryMutAct_9fa48("994") ? entry.previousHash === null : stryMutAct_9fa48("993") ? false : stryMutAct_9fa48("992") ? true : (stryCov_9fa48("992", "993", "994"), entry.previousHash !== null)) return stryMutAct_9fa48("995") ? true : (stryCov_9fa48("995"), false);
          }
        }
        const {
          hash,
          ...content
        } = entry;
        const calculatedHash = generateHashSync(content);
        if (stryMutAct_9fa48("998") ? hash === calculatedHash : stryMutAct_9fa48("997") ? false : stryMutAct_9fa48("996") ? true : (stryCov_9fa48("996", "997", "998"), hash !== calculatedHash)) return stryMutAct_9fa48("999") ? true : (stryCov_9fa48("999"), false);
      }
    }
    return stryMutAct_9fa48("1000") ? false : (stryCov_9fa48("1000"), true);
  }
}