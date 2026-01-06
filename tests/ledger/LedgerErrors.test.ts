import { describe, it, expect } from "vitest";
import { Ledger } from "../../src/ledger/Ledger";
import { Money } from "../../src/money";
import { USD } from "../../src/currency/iso4217";

// Mocking money helper since it's not exported from index properly here or we need to import specifically
const money = (amount: string, currency: any) => Money.fromMajor(amount, currency);
const TransactionType = { DEPOSIT: "DEPOSIT", WITHDRAWAL: "WITHDRAWAL" };

describe("Ledger Error Handling", () => {
    // const USD = "USD"; // Removed to use imported object directly
    const amount = money("100.00", USD);

    it("should return zero balance for empty ledger", () => {
        const ledger = new Ledger(USD);
        // getBalance() returns Money, which has an isZero() method
        // It does not accept an account argument in this implementation of Ledger
        expect(ledger.getBalance().isZero()).toBe(true);
    });
    
    it("should fail verification if history is tampered with", () => {
        const ledger = new Ledger(USD);
        // record() takes (amount, metadata)
        ledger.record(amount, { type: TransactionType.DEPOSIT, description: "init" });
        
        // Simulate tampering by manually editing the internal array (using specific 'any' cast to bypass private access)
        // In a real database, this would be an SQL injection or direct DB edit
        // The entry object is frozen, so we must replace it in the array
        const originalEntry = (ledger as any).entries[0];
        const tamperedEntry = { ...originalEntry, money: money("999999.00", USD) };
        (ledger as any).entries[0] = tamperedEntry;
        
        // This should now fail
        expect(ledger.verify()).toBe(false);
    });

    it("should verify clean ledger", () => {
        const ledger = new Ledger(USD);
        ledger.record(amount, { type: TransactionType.DEPOSIT, description: "clean" });
        expect(ledger.verify()).toBe(true);
    });
});
