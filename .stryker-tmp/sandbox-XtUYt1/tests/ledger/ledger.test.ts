// @ts-nocheck
import { describe, it, expect } from "vitest";
import { Ledger } from "../../src/ledger/Ledger";
import { Money } from "../../src/money/Money";
import { USD } from "../../src/currency/iso4217";

describe("Ledger", () => {
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

  it("should maintain hash chain integrity", () => {
    const ledger = new Ledger(USD);
    ledger.record(Money.fromMajor("100.00", USD), { type: "deposit" });
    ledger.record(Money.fromMajor("-50.00", USD), { type: "withdrawal" });

    expect(ledger.verify()).toBe(true);
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

  it("should filter queries", () => {
    const ledger = new Ledger(USD);
    ledger.record(Money.fromMajor("100.00", USD), { type: "deposit" });
    ledger.record(Money.fromMajor("-50.00", USD), { type: "withdrawal" });

    const deposits = ledger.query({ type: "deposit" });
    expect(deposits.length).toBe(1);
    expect(deposits[0].metadata.type).toBe("deposit");
  });
});
