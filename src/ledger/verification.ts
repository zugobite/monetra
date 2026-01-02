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
  if (hashFunction) return hashFunction;

  // Try Node.js crypto first
  if (typeof globalThis !== "undefined") {
    try {
      // Dynamic import to avoid bundler issues
      const nodeCrypto = require("crypto");
      if (nodeCrypto && nodeCrypto.createHash) {
        hashFunction = (data: string): string => {
          return nodeCrypto.createHash("sha256").update(data).digest("hex");
        };
        return hashFunction;
      }
    } catch {
      // Node crypto not available
    }
  }

  // Fall back to SubtleCrypto (browser)
  if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    globalThis.crypto.subtle
  ) {
    hashFunction = async (data: string): Promise<string> => {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await globalThis.crypto.subtle.digest(
        "SHA-256",
        dataBuffer
      );
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    };
    return hashFunction;
  }

  // No crypto available
  throw new Error(
    "No cryptographic hash function available. " +
      "Ensure you are running in Node.js or a browser with SubtleCrypto support."
  );
}

/**
 * Allows injecting a custom hash function for testing or special environments.
 */
export function setHashFunction(
  fn: (data: string) => string | Promise<string>
): void {
  hashFunction = fn;
}

function serialize(data: unknown): string {
  return JSON.stringify(data, (_key, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    // Handle Money objects if they are passed directly and not via toJSON
    if (
      value &&
      typeof value === "object" &&
      "minor" in value &&
      "currency" in value
    ) {
      return {
        minor: (value as { minor: bigint }).minor.toString(),
        currency: (value as { currency: { code: string } }).currency.code,
      };
    }
    return value;
  });
}

/**
 * Generates a SHA-256 hash of the provided data.
 * Works in both Node.js and browser environments.
 *
 * @param data - The data to hash.
 * @returns The hash as a hex string (sync in Node.js, may be async in browser).
 */
export function generateHash(data: unknown): string | Promise<string> {
  const serialized = serialize(data);
  const fn = getHashFunction();
  return fn(serialized);
}

/**
 * Synchronous version of generateHash for environments that support it.
 * Throws if only async hashing is available (browser without await).
 *
 * @param data - The data to hash.
 * @returns The hash as a hex string.
 */
export function generateHashSync(data: unknown): string {
  const result = generateHash(data);
  if (result instanceof Promise) {
    throw new Error(
      "Synchronous hashing not available in this environment. " +
        "Use generateHash() with await instead."
    );
  }
  return result;
}

/**
 * Verifies the integrity of a chain of ledger entries.
 * Checks that each entry's hash is correct and that previousHash pointers form a valid chain.
 *
 * @param entries - The entries to verify.
 * @returns True if the chain is valid, false if tampered.
 */
export async function verifyChain(entries: Entry[]): Promise<boolean> {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const previousEntry = i > 0 ? entries[i - 1] : null;

    // Check previous hash pointer
    if (previousEntry) {
      if (entry.previousHash !== previousEntry.hash) return false;
    } else {
      if (entry.previousHash !== null) return false;
    }

    // Check integrity of current entry
    const { hash, ...content } = entry;
    const calculatedHash = await generateHash(content);

    if (hash !== calculatedHash) return false;
  }
  return true;
}

/**
 * Synchronous version of verifyChain for Node.js environments.
 *
 * @param entries - The entries to verify.
 * @returns True if the chain is valid.
 */
export function verifyChainSync(entries: Entry[]): boolean {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const previousEntry = i > 0 ? entries[i - 1] : null;

    if (previousEntry) {
      if (entry.previousHash !== previousEntry.hash) return false;
    } else {
      if (entry.previousHash !== null) return false;
    }

    const { hash, ...content } = entry;
    const calculatedHash = generateHashSync(content);

    if (hash !== calculatedHash) return false;
  }
  return true;
}
