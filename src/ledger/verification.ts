import { createHash } from "crypto";
import { Entry } from "./types";

function serialize(data: any): string {
  return JSON.stringify(data, (key, value) => {
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
        minor: value.minor.toString(),
        currency: value.currency.code,
      };
    }
    return value;
  });
}

export function generateHash(data: unknown): string {
  return createHash("sha256").update(serialize(data)).digest("hex");
}

export function verifyChain(entries: Entry[]): boolean {
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
    const calculatedHash = generateHash(content);

    if (hash !== calculatedHash) return false;
  }
  return true;
}
