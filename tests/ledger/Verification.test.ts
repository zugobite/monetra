import { describe, it, expect, vi, afterEach } from "vitest";

import { USD } from "../../src/currency/iso4217";
import { Money } from "../../src/money/Money";

// These tests intentionally exercise the hashing/verification helpers directly.
// We use vi.resetModules() + dynamic import to ensure a fresh module state.

describe("Ledger Verification", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("should use an injected hash function (sync) for deterministic output", async () => {
    vi.resetModules();
    const v = await import("../../src/ledger/verification");

    v.setHashFunction((data) => `HASH:${data}`);

    expect(v.generateHash({ a: 1 })).toBe("HASH:{\"a\":1}");
    expect(v.generateHashSync({ a: 1 })).toBe("HASH:{\"a\":1}");
  });

  it("should serialize bigint values as strings", async () => {
    vi.resetModules();
    const v = await import("../../src/ledger/verification");

    v.setHashFunction((data) => data);

    expect(v.generateHashSync({ amount: 10n })).toBe('{"amount":"10"}');
  });

  it("should serialize Money objects when passed directly", async () => {
    vi.resetModules();
    const v = await import("../../src/ledger/verification");

    v.setHashFunction((data) => data);

    // Note: Money has a toJSON, so JSON.stringify will not hit the special-case branch.
    // Use a Money-like object to exercise that code path.
    const moneyLike = { minor: 123n, currency: { code: "USD" } };
    expect(v.generateHashSync(moneyLike)).toBe('{"minor":"123","currency":"USD"}');
  });

  it("generateHashSync should throw when only async hashing is available", async () => {
    vi.resetModules();
    const v = await import("../../src/ledger/verification");

    v.setHashFunction(async (data) => `ASYNC:${data}`);

    expect(() => v.generateHashSync({ a: 1 })).toThrow(
      /Synchronous hashing not available[\s\S]*Use generateHash\(\) with await instead\./
    );
  });

  it("verifyChain should validate previousHash and content (async)", async () => {
    vi.resetModules();
    const v = await import("../../src/ledger/verification");

    v.setHashFunction((data) => `H:${data}`);

    const entry1Content = {
      id: "1",
      money: Money.fromMajor("1.00", USD),
      metadata: { type: "deposit" },
      createdAt: new Date(0),
      previousHash: null,
    };
    const entry1 = { ...entry1Content, hash: v.generateHashSync(entry1Content) };

    const entry2Content = {
      id: "2",
      money: Money.fromMajor("2.00", USD),
      metadata: { type: "deposit" },
      createdAt: new Date(1),
      previousHash: entry1.hash,
    };
    const entry2 = { ...entry2Content, hash: v.generateHashSync(entry2Content) };

    await expect(v.verifyChain([entry1, entry2])).resolves.toBe(true);

    const badFirst = { ...entry1, previousHash: "NOT_NULL" };
    await expect(v.verifyChain([badFirst, entry2])).resolves.toBe(false);

    const badHash = { ...entry2, hash: "WRONG" };
    await expect(v.verifyChain([entry1, badHash])).resolves.toBe(false);
  });

  it("should prefer Node crypto when available (not call SubtleCrypto)", async () => {
    vi.resetModules();
    delete (globalThis as any).__MONETRA_DISABLE_NODE_CRYPTO__;

    const subtle = (globalThis as any).crypto?.subtle;
    expect(subtle).toBeTruthy();

    const digestSpy = vi
      .spyOn(subtle, "digest")
      .mockImplementation(() => {
        throw new Error("SubtleCrypto should not be used in Node by default");
      });

    try {
      const v = await import("../../src/ledger/verification");
      expect(() => v.generateHashSync({ a: 1 })).not.toThrow();
    } finally {
      digestSpy.mockRestore();
    }
  });

  it("should throw a helpful error when no crypto is available", async () => {
    vi.resetModules();

    (globalThis as any).__MONETRA_DISABLE_NODE_CRYPTO__ = true;
    vi.stubGlobal("crypto", undefined);

    try {
      const v = await import("../../src/ledger/verification");
      expect(() => v.generateHashSync({ a: 1 })).toThrow(
        /No cryptographic hash function available[\s\S]*Ensure you are running in Node\.js or a browser with SubtleCrypto support\./
      );
    } finally {
      delete (globalThis as any).__MONETRA_DISABLE_NODE_CRYPTO__;
    }
  });

  it("verifyChainSync should detect tampering (hash mismatch)", async () => {
    vi.resetModules();
    const v = await import("../../src/ledger/verification");

    v.setHashFunction((data) => `H:${data}`);

    const entry1Content = {
      id: "1",
      money: Money.fromMajor("1.00", USD),
      metadata: { type: "deposit" },
      createdAt: new Date(0),
      previousHash: null,
    };

    const entry1 = {
      ...entry1Content,
      hash: v.generateHashSync(entry1Content),
    };

    const entry2Content = {
      id: "2",
      money: Money.fromMajor("2.00", USD),
      metadata: { type: "deposit" },
      createdAt: new Date(1),
      previousHash: entry1.hash,
    };

    const entry2 = {
      ...entry2Content,
      hash: v.generateHashSync(entry2Content),
    };

    expect(v.verifyChainSync([entry1, entry2])).toBe(true);

    const tampered = { ...entry2, previousHash: "WRONG" };
    expect(v.verifyChainSync([entry1, tampered])).toBe(false);

    const badFirst = { ...entry1, previousHash: "NOT_NULL" };
    expect(v.verifyChainSync([badFirst, entry2])).toBe(false);

    const badHash = { ...entry2, hash: "WRONG" };
    expect(v.verifyChainSync([entry1, badHash])).toBe(false);
  });

  it("should fall back to SubtleCrypto when node crypto createHash is unavailable", async () => {
    // Ensure a fresh module instance with hashFunction unset.
    vi.resetModules();

    (globalThis as any).__MONETRA_DISABLE_NODE_CRYPTO__ = true;

    // Provide a deterministic SubtleCrypto digest.
    const bytes = new Uint8Array(32);
    for (let i = 0; i < bytes.length; i++) bytes[i] = i;

    const subtle = (globalThis as any).crypto?.subtle;
    expect(subtle).toBeTruthy();

    const digestSpy = vi
      .spyOn(subtle, "digest")
      .mockImplementation(() => Promise.resolve(bytes.buffer));

    try {
      const v = await import("../../src/ledger/verification");
      const hash = await v.generateHash({ a: 1 });
      expect(typeof hash).toBe("string");
      expect(hash).toHaveLength(64);
      expect(hash.startsWith("00")).toBe(true);
      expect(hash.endsWith("1f")).toBe(true);
    } finally {
      digestSpy.mockRestore();
      delete (globalThis as any).__MONETRA_DISABLE_NODE_CRYPTO__;
    }
  });

  it("verifyChain (async) should detect when first entry has non-null previousHash", async () => {
    vi.resetModules();
    const v = await import("../../src/ledger/verification");

    v.setHashFunction((data) => `H:${data}`);

    const badFirstContent = {
      id: "1",
      money: Money.fromMajor("1.00", USD),
      metadata: { type: "deposit" },
      createdAt: new Date(0),
      previousHash: "SHOULD_BE_NULL",
    };
    const badFirst = { ...badFirstContent, hash: v.generateHashSync(badFirstContent) };

    await expect(v.verifyChain([badFirst])).resolves.toBe(false);
  });

  it("verifyChainSync should detect when first entry has non-null previousHash", async () => {
    vi.resetModules();
    const v = await import("../../src/ledger/verification");

    v.setHashFunction((data) => `H:${data}`);

    const badFirstContent = {
      id: "1",
      money: Money.fromMajor("1.00", USD),
      metadata: { type: "deposit" },
      createdAt: new Date(0),
      previousHash: "SHOULD_BE_NULL",
    };
    const badFirst = { ...badFirstContent, hash: v.generateHashSync(badFirstContent) };

    expect(v.verifyChainSync([badFirst])).toBe(false);
  });

  it("should use Node.js crypto by default in Node environment", async () => {
    // Reset to get a fresh module and let it use the default Node crypto
    vi.resetModules();
    const v = await import("../../src/ledger/verification");

    // Don't inject a custom hash function - let it use Node crypto
    const hash = v.generateHashSync({ test: "data" });

    // Should produce a valid SHA-256 hex string
    expect(typeof hash).toBe("string");
    expect(hash).toHaveLength(64);
    expect(/^[0-9a-f]{64}$/.test(hash)).toBe(true);
  });

  it("verifyChain should detect previousHash mismatch in middle of chain", async () => {
    vi.resetModules();
    const v = await import("../../src/ledger/verification");

    v.setHashFunction((data) => `H:${data}`);

    const entry1Content = {
      id: "1",
      money: Money.fromMajor("1.00", USD),
      metadata: { type: "deposit" },
      createdAt: new Date(0),
      previousHash: null,
    };
    const entry1 = { ...entry1Content, hash: v.generateHashSync(entry1Content) };

    const entry2Content = {
      id: "2",
      money: Money.fromMajor("2.00", USD),
      metadata: { type: "deposit" },
      createdAt: new Date(1),
      previousHash: entry1.hash,
    };
    const entry2 = { ...entry2Content, hash: v.generateHashSync(entry2Content) };

    const entry3Content = {
      id: "3",
      money: Money.fromMajor("3.00", USD),
      metadata: { type: "deposit" },
      createdAt: new Date(2),
      previousHash: entry2.hash,
    };
    const entry3 = { ...entry3Content, hash: v.generateHashSync(entry3Content) };

    // Valid chain
    await expect(v.verifyChain([entry1, entry2, entry3])).resolves.toBe(true);

    // Break the chain in the middle
    const entry2Tampered = { ...entry2, previousHash: "WRONG_HASH" };
    await expect(v.verifyChain([entry1, entry2Tampered, entry3])).resolves.toBe(false);
  });
});
