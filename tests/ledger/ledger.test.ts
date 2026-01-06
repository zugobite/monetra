import { describe, it, expect, vi } from "vitest";
import { Ledger } from "../../src/ledger/Ledger";
import { Money } from "../../src/money/Money";
import { USD, EUR } from "../../src/currency/iso4217";

import * as verification from "../../src/ledger/verification";

describe("Ledger", () => {
  it("should accept currency as string", () => {
    const ledger = new Ledger("USD");
    expect(() => ledger.record(Money.fromMajor("1.00", USD), { type: "deposit" })).not.toThrow();
  });

  it("should record transactions", () => {
    const ledger = new Ledger(USD);
    const m = Money.fromMajor("100.00", USD);

    const entry = ledger.record(m, {
      type: "deposit",
      description: "Initial deposit",
    });

    expect(entry.money.equals(m)).toBe(true);
    expect(entry.metadata.type).toBe("deposit");
    expect(ledger.getBalance().equals(m)).toBe(true);
  });

  it("should throw on currency mismatch (sync)", () => {
    const ledger = new Ledger(USD);
    const eur = Money.fromMajor("1.00", EUR);
    expect(() => ledger.record(eur, { type: "deposit" })).toThrow(/Currency mismatch/i);
  });

  it("should default timestamp when not provided", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));

    try {
      const ledger = new Ledger(USD);
      const entry = ledger.record(Money.fromMajor("1.00", USD), { type: "deposit" });
      expect(entry.metadata.timestamp).toEqual(new Date("2025-01-01T00:00:00.000Z"));
    } finally {
      vi.useRealTimers();
    }
  });

  it("should preserve provided timestamp", () => {
    const ledger = new Ledger(USD);
    const ts = new Date("2020-01-01T00:00:00.000Z");
    const entry = ledger.record(Money.fromMajor("1.00", USD), { type: "deposit", timestamp: ts });
    expect(entry.metadata.timestamp).toEqual(ts);
  });

  it("should maintain hash chain integrity", () => {
    const ledger = new Ledger(USD);
    ledger.record(Money.fromMajor("100.00", USD), { type: "deposit" });
    ledger.record(Money.fromMajor("-50.00", USD), { type: "withdrawal" });

    expect(ledger.verify()).toBe(true);
  });

  it("should verify asynchronously", async () => {
    const ledger = new Ledger(USD);
    await ledger.recordAsync(Money.fromMajor("100.00", USD), { type: "deposit" });
    await ledger.recordAsync(Money.fromMajor("-50.00", USD), { type: "withdrawal" });
    await expect(ledger.verifyAsync()).resolves.toBe(true);
  });

  it("should throw on currency mismatch (async)", async () => {
    const ledger = new Ledger(USD);
    const eur = Money.fromMajor("1.00", EUR);
    await expect(ledger.recordAsync(eur, { type: "deposit" })).rejects.toThrow(
      /Currency mismatch/i
    );
  });

  it("should preserve metadata in async record", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));

    try {
      const ledger = new Ledger(USD);
      const entry = await ledger.recordAsync(Money.fromMajor("1.00", USD), {
        type: "deposit",
        reference: "ref-1",
        tags: ["a"],
      });

      expect(entry.metadata.type).toBe("deposit");
      expect(entry.metadata.reference).toBe("ref-1");
      expect(entry.metadata.tags).toEqual(["a"]);
      expect(entry.metadata.timestamp).toEqual(new Date("2025-01-01T00:00:00.000Z"));
    } finally {
      vi.useRealTimers();
    }
  });

  it("should prevent tampering via immutability", () => {
    const ledger = new Ledger(USD);
    ledger.record(Money.fromMajor("100.00", USD), { type: "deposit" });

    const history = ledger.getHistory() as any;
    
    // In strict mode, assigning to read-only property throws
    expect(() => {
      history[0].metadata.description = "Tampered";
    }).toThrow();
  });

  it("getHistory should include recorded entries", () => {
    const ledger = new Ledger(USD);
    ledger.record(Money.fromMajor("100.00", USD), { type: "deposit" });
    ledger.record(Money.fromMajor("-50.00", USD), { type: "withdrawal" });

    const history = ledger.getHistory();
    expect(history.length).toBe(2);
    expect(history[0].metadata.type).toBe("deposit");
    expect(history[1].metadata.type).toBe("withdrawal");
  });

  it("should filter queries", () => {
    vi.useFakeTimers();
    try {
      const ledger = new Ledger(USD);

      vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
      ledger.record(Money.fromMajor("100.00", USD), {
        type: "deposit",
        reference: "r1",
        tags: ["a"],
      });

      vi.setSystemTime(new Date("2025-01-02T00:00:00.000Z"));
      ledger.record(Money.fromMajor("-50.00", USD), {
        type: "withdrawal",
        reference: "r2",
        tags: ["b"],
      });

      const deposits = ledger.query({ type: "deposit" });
      expect(deposits.length).toBe(1);
      expect(deposits[0].metadata.type).toBe("deposit");

      const types = ledger.query({ type: ["deposit", "withdrawal"] });
      expect(types.length).toBe(2);

      const byFrom = ledger.query({ from: new Date("2025-01-02T00:00:00.000Z") });
      expect(byFrom.length).toBe(1);
      expect(byFrom[0].metadata.reference).toBe("r2");

      const byTo = ledger.query({ to: new Date("2025-01-01T12:00:00.000Z") });
      expect(byTo.length).toBe(1);
      expect(byTo[0].metadata.reference).toBe("r1");

      // Boundary: createdAt === to should be included
      const toBoundary = ledger.query({ to: new Date("2025-01-02T00:00:00.000Z") });
      expect(toBoundary.length).toBe(2);

      const byReference = ledger.query({ reference: "r1" });
      expect(byReference.length).toBe(1);
      expect(byReference[0].metadata.type).toBe("deposit");

      const minAmount = ledger.query({ minAmount: Money.fromMajor("-10.00", USD) });
      // withdrawal is less than -10; deposit is not
      expect(minAmount.length).toBe(1);
      expect(minAmount[0].metadata.type).toBe("deposit");

      const maxAmount = ledger.query({ maxAmount: Money.fromMajor("0.00", USD) });
      expect(maxAmount.length).toBe(1);
      expect(maxAmount[0].metadata.type).toBe("withdrawal");

      const byTags = ledger.query({ tags: ["a"] });
      expect(byTags.length).toBe(1);
      expect(byTags[0].metadata.reference).toBe("r1");

      // Tags match should be "some", not "every"
      const someTags = ledger.query({ tags: ["a", "missing"] });
      expect(someTags.length).toBe(1);
      expect(someTags[0].metadata.reference).toBe("r1");
    } finally {
      vi.useRealTimers();
    }
  });

  it("should snapshot and restore (sync)", () => {
    const ledger = new Ledger(USD);
    ledger.record(Money.fromMajor("10.00", USD), { type: "deposit" });
    ledger.record(Money.fromMajor("-2.00", USD), { type: "withdrawal" });

    const snapshot = ledger.snapshot();
    expect(snapshot.currency).toBe("USD");
    expect(snapshot.entries.length).toBe(2);
    expect(snapshot.balance.equals(Money.fromMajor("8.00", USD))).toBe(true);
    expect(typeof snapshot.checksum).toBe("string");

    const restored = Ledger.fromSnapshot(snapshot);
    expect(restored.getBalance().equals(Money.fromMajor("8.00", USD))).toBe(true);
    expect(restored.verify()).toBe(true);
  });

  it("snapshot checksum should be computed from entries", () => {
    const ledger = new Ledger(USD);
    ledger.record(Money.fromMajor("1.00", USD), { type: "deposit" });

    verification.setHashFunction((data) => {
      if (!data.includes('"entries"')) {
        throw new Error("missing entries in snapshot checksum input");
      }
      return "CHECK";
    });

    try {
      const snap = ledger.snapshot();
      expect(snap.checksum).toBe("CHECK");
    } finally {
      // Restore default sync hashing
      const nodeCrypto = require("crypto");
      verification.setHashFunction((data) =>
        nodeCrypto.createHash("sha256").update(data).digest("hex")
      );
    }
  });

  it("fromSnapshot should throw on invalid snapshot chain", () => {
    const ledger = new Ledger(USD);
    ledger.record(Money.fromMajor("10.00", USD), { type: "deposit" });
    const snapshot = ledger.snapshot();

    // Tamper with an entry without fixing its hash.
    const tampered = {
      ...snapshot,
      entries: [
        {
          ...snapshot.entries[0],
          previousHash: "WRONG",
        },
      ],
    };

    expect(() => Ledger.fromSnapshot(tampered)).toThrow(
      /Ledger snapshot integrity check failed/
    );
  });

  it("should snapshot and restore (async)", async () => {
    const ledger = new Ledger(USD);

    // Force async hashing so snapshotAsync/recordAsync paths are exercised.
    verification.setHashFunction(async (data) => {
      if (data.includes('"entries"')) return "ASYNC_CHECK";
      return `ENTRY:${data}`;
    });

    try {
      await ledger.recordAsync(Money.fromMajor("10.00", USD), { type: "deposit" });
      await ledger.recordAsync(Money.fromMajor("-2.00", USD), { type: "withdrawal" });

      const snapshot = await ledger.snapshotAsync();
      expect(snapshot.entries.length).toBe(2);
      expect(snapshot.balance.equals(Money.fromMajor("8.00", USD))).toBe(true);
      expect(snapshot.checksum).toBe("ASYNC_CHECK");

      const restored = await Ledger.fromSnapshotAsync(snapshot);
      expect(restored.getBalance().equals(Money.fromMajor("8.00", USD))).toBe(true);
      await expect(restored.verifyAsync()).resolves.toBe(true);
    } finally {
      const nodeCrypto = await import("crypto");
      verification.setHashFunction((data) =>
        (nodeCrypto as any).createHash("sha256").update(data).digest("hex")
      );
    }
  });

  it("fromSnapshotAsync should throw on invalid snapshot chain", async () => {
    const ledger = new Ledger(USD);
    ledger.record(Money.fromMajor("10.00", USD), { type: "deposit" });
    const snapshot = ledger.snapshot();

    const tampered = {
      ...snapshot,
      entries: [
        {
          ...snapshot.entries[0],
          previousHash: "WRONG",
        },
      ],
    };

    await expect(Ledger.fromSnapshotAsync(tampered)).rejects.toThrow(
      /Ledger snapshot integrity check failed/
    );
  });
});
