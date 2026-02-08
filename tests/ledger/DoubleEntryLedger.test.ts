import { describe, it, expect, beforeEach } from "vitest";
import {
  DoubleEntryLedger,
  UnbalancedEntryError,
  AccountNotFoundError,
  DuplicateAccountError,
  ChartOfAccountsTemplates,
} from "../../src/ledger/DoubleEntryLedger";
import { Money } from "../../src/money/Money";
import { USD, EUR } from "../../src/currency/iso4217";

describe("DoubleEntryLedger", () => {
  let ledger: DoubleEntryLedger;

  beforeEach(() => {
    ledger = new DoubleEntryLedger("USD");
  });

  describe("account management", () => {
    it("creates an account", () => {
      const account = ledger.createAccount({
        id: "cash",
        name: "Cash",
        type: "asset",
        currency: USD,
      });

      expect(account.id).toBe("cash");
      expect(ledger.getAccount("cash")).toBe(account);
    });

    it("creates multiple accounts at once", () => {
      const accounts = ledger.createAccounts([
        { id: "cash", name: "Cash", type: "asset", currency: USD },
        { id: "bank", name: "Bank", type: "asset", currency: USD },
      ]);

      expect(accounts).toHaveLength(2);
      expect(ledger.getAccount("cash")).toBeDefined();
      expect(ledger.getAccount("bank")).toBeDefined();
    });

    it("throws on duplicate account ID", () => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });

      expect(() => {
        ledger.createAccount({ id: "cash", name: "Cash 2", type: "asset", currency: USD });
      }).toThrow(DuplicateAccountError);
    });

    it("throws on currency mismatch", () => {
      expect(() => {
        ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: EUR });
      }).toThrow("Account currency (EUR) must match ledger currency (USD)");
    });

    it("getAccountOrThrow throws for missing account", () => {
      expect(() => {
        ledger.getAccountOrThrow("nonexistent");
      }).toThrow(AccountNotFoundError);
    });

    it("filters accounts by type", () => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });
      ledger.createAccount({ id: "revenue", name: "Revenue", type: "revenue", currency: USD });
      ledger.createAccount({ id: "equipment", name: "Equipment", type: "asset", currency: USD });

      const assets = ledger.getAccounts({ type: "asset" });
      expect(assets).toHaveLength(2);
      expect(assets.map((a) => a.id)).toContain("cash");
      expect(assets.map((a) => a.id)).toContain("equipment");
    });
  });

  describe("journal entry posting", () => {
    beforeEach(() => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });
      ledger.createAccount({ id: "revenue", name: "Revenue", type: "revenue", currency: USD });
      ledger.createAccount({ id: "ar", name: "Accounts Receivable", type: "asset", currency: USD });
      ledger.createAccount({ id: "expense", name: "Expense", type: "expense", currency: USD });
    });

    it("posts a balanced journal entry", () => {
      const entry = ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Cash sale" },
      });

      expect(entry.id).toBeDefined();
      expect(entry.entryNumber).toBe(1);
      expect(entry.isPosted).toBe(true);
      expect(entry.isVoided).toBe(false);
      expect(entry.hash).toBeDefined();
    });

    it("updates account balances correctly", () => {
      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Cash sale" },
      });

      const cash = ledger.getAccount("cash")!;
      const revenue = ledger.getAccount("revenue")!;

      expect(cash.getBalance().toDecimalString()).toBe("100.00");
      expect(revenue.getBalance().toDecimalString()).toBe("100.00");
    });

    it("throws for unbalanced entry", () => {
      expect(() => {
        ledger.post({
          lines: [
            { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
            { accountId: "revenue", amount: Money.fromMajor("50", "USD"), type: "credit" },
          ],
          metadata: { description: "Unbalanced" },
        });
      }).toThrow(UnbalancedEntryError);
    });

    it("throws for non-existent account", () => {
      expect(() => {
        ledger.post({
          lines: [
            { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
            { accountId: "nonexistent", amount: Money.fromMajor("100", "USD"), type: "credit" },
          ],
          metadata: { description: "Bad account" },
        });
      }).toThrow(AccountNotFoundError);
    });

    it("supports multi-line entries", () => {
      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("50", "USD"), type: "debit" },
          { accountId: "ar", amount: Money.fromMajor("50", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Split payment" },
      });

      expect(ledger.getAccount("cash")!.getBalance().toDecimalString()).toBe("50.00");
      expect(ledger.getAccount("ar")!.getBalance().toDecimalString()).toBe("50.00");
      expect(ledger.getAccount("revenue")!.getBalance().toDecimalString()).toBe("100.00");
    });

    it("increments entry numbers sequentially", () => {
      const entry1 = ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Entry 1" },
      });

      const entry2 = ledger.post({
        lines: [
          { accountId: "expense", amount: Money.fromMajor("25", "USD"), type: "debit" },
          { accountId: "cash", amount: Money.fromMajor("25", "USD"), type: "credit" },
        ],
        metadata: { description: "Entry 2" },
      });

      expect(entry1.entryNumber).toBe(1);
      expect(entry2.entryNumber).toBe(2);
    });

    it("creates hash chain", () => {
      const entry1 = ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Entry 1" },
      });

      const entry2 = ledger.post({
        lines: [
          { accountId: "expense", amount: Money.fromMajor("25", "USD"), type: "debit" },
          { accountId: "cash", amount: Money.fromMajor("25", "USD"), type: "credit" },
        ],
        metadata: { description: "Entry 2" },
      });

      expect(entry1.previousHash).toBeNull();
      expect(entry2.previousHash).toBe(entry1.hash);
    });
  });

  describe("voiding entries", () => {
    beforeEach(() => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });
      ledger.createAccount({ id: "revenue", name: "Revenue", type: "revenue", currency: USD });
    });

    it("voids an entry by creating a reversal", () => {
      const original = ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Cash sale" },
      });

      const reversal = ledger.void(original.id, "Customer returned goods");

      expect(reversal.voids).toBe(original.id);
      expect(reversal.metadata.tags).toContain("void");
      expect(reversal.metadata.tags).toContain("reversal");
    });

    it("marks original entry as voided", () => {
      const original = ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Cash sale" },
      });

      ledger.void(original.id, "Error");

      const entries = ledger.getJournalEntries();
      const voidedEntry = entries.find((e) => e.id === original.id);
      expect(voidedEntry?.isVoided).toBe(true);
    });

    it("reverses account balances", () => {
      const original = ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Cash sale" },
      });

      ledger.void(original.id, "Refund");

      // After voiding, net effect should be zero
      expect(ledger.getAccount("cash")!.getBalance().isZero()).toBe(true);
      expect(ledger.getAccount("revenue")!.getBalance().isZero()).toBe(true);
    });

    it("throws when voiding non-existent entry", () => {
      expect(() => {
        ledger.void("non-existent-id", "Testing");
      }).toThrow("Journal entry not found");
    });

    it("throws when voiding already voided entry", () => {
      const original = ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Cash sale" },
      });

      ledger.void(original.id, "First void");

      expect(() => {
        ledger.void(original.id, "Second void");
      }).toThrow("already voided");
    });
  });

  describe("trial balance", () => {
    beforeEach(() => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });
      ledger.createAccount({ id: "ar", name: "Accounts Receivable", type: "asset", currency: USD });
      ledger.createAccount({ id: "revenue", name: "Revenue", type: "revenue", currency: USD });
      ledger.createAccount({ id: "expense", name: "Expense", type: "expense", currency: USD });
    });

    it("generates balanced trial balance", () => {
      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("1000", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("1000", "USD"), type: "credit" },
        ],
        metadata: { description: "Sale" },
      });

      ledger.post({
        lines: [
          { accountId: "expense", amount: Money.fromMajor("200", "USD"), type: "debit" },
          { accountId: "cash", amount: Money.fromMajor("200", "USD"), type: "credit" },
        ],
        metadata: { description: "Expense paid" },
      });

      const tb = ledger.getTrialBalance();

      expect(tb.isBalanced).toBe(true);
      expect(tb.totalDebits.equals(tb.totalCredits)).toBe(true);
    });

    it("includes only active accounts with activity", () => {
      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Sale" },
      });

      const tb = ledger.getTrialBalance();

      // AR has no activity, shouldn't appear
      expect(tb.entries.find((e) => e.accountId === "ar")).toBeUndefined();
      expect(tb.entries.find((e) => e.accountId === "cash")).toBeDefined();
      expect(tb.entries.find((e) => e.accountId === "revenue")).toBeDefined();
    });
  });

  describe("querying", () => {
    beforeEach(() => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });
      ledger.createAccount({ id: "revenue", name: "Revenue", type: "revenue", currency: USD });
    });

    it("queries by account", () => {
      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Entry 1" },
      });

      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("50", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("50", "USD"), type: "credit" },
        ],
        metadata: { description: "Entry 2" },
      });

      const cashEntries = ledger.query({ accountId: "cash" });
      expect(cashEntries).toHaveLength(2);
    });

    it("excludes voided entries by default", () => {
      const entry = ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "To be voided" },
      });

      ledger.void(entry.id, "Void it");

      const entries = ledger.query({});
      // Should only see the reversal entry, not the voided original
      expect(entries.filter((e) => e.id === entry.id)).toHaveLength(0);
    });

    it("includes voided entries when requested", () => {
      const entry = ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "To be voided" },
      });

      ledger.void(entry.id, "Void it");

      const entries = ledger.query({ includeVoided: true });
      expect(entries.find((e) => e.id === entry.id)).toBeDefined();
    });

    it("queries by reference", () => {
      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Invoice 1", reference: "INV-001" },
      });

      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("200", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("200", "USD"), type: "credit" },
        ],
        metadata: { description: "Invoice 2", reference: "INV-002" },
      });

      const entries = ledger.query({ reference: "INV-001" });
      expect(entries).toHaveLength(1);
      expect(entries[0].metadata.reference).toBe("INV-001");
    });

    it("supports pagination", () => {
      for (let i = 0; i < 10; i++) {
        ledger.post({
          lines: [
            { accountId: "cash", amount: Money.fromMajor("10", "USD"), type: "debit" },
            { accountId: "revenue", amount: Money.fromMajor("10", "USD"), type: "credit" },
          ],
          metadata: { description: `Entry ${i}` },
        });
      }

      const page1 = ledger.query({ limit: 3 });
      const page2 = ledger.query({ limit: 3, offset: 3 });

      expect(page1).toHaveLength(3);
      expect(page2).toHaveLength(3);
      expect(page1[0].id).not.toBe(page2[0].id);
    });
  });

  describe("account history", () => {
    beforeEach(() => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });
      ledger.createAccount({ id: "revenue", name: "Revenue", type: "revenue", currency: USD });
    });

    it("tracks running balance for an account", () => {
      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Deposit" },
      });

      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("30", "USD"), type: "credit" },
          { accountId: "revenue", amount: Money.fromMajor("30", "USD"), type: "debit" },
        ],
        metadata: { description: "Refund" },
      });

      const history = ledger.getAccountHistory("cash");

      expect(history).toHaveLength(2);
      expect(history[0].runningBalance.toDecimalString()).toBe("100.00");
      expect(history[1].runningBalance.toDecimalString()).toBe("70.00");
    });
  });

  describe("verification", () => {
    beforeEach(() => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });
      ledger.createAccount({ id: "revenue", name: "Revenue", type: "revenue", currency: USD });
    });

    it("verifies ledger integrity", () => {
      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Entry" },
      });

      expect(ledger.verify()).toBe(true);
    });
  });

  describe("snapshot and restore", () => {
    beforeEach(() => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });
      ledger.createAccount({ id: "revenue", name: "Revenue", type: "revenue", currency: USD });
    });

    it("creates and restores from snapshot", () => {
      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("500", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("500", "USD"), type: "credit" },
        ],
        metadata: { description: "Sale" },
      });

      const snapshot = ledger.snapshot();
      const restored = DoubleEntryLedger.fromSnapshot(snapshot);

      expect(restored.getAccount("cash")?.getBalance().toDecimalString()).toBe("500.00");
      expect(restored.getAccount("revenue")?.getBalance().toDecimalString()).toBe("500.00");
      expect(restored.getJournalEntries()).toHaveLength(1);
    });
  });

  describe("ChartOfAccountsTemplates", () => {
    it("creates small business chart of accounts with correct details", () => {
      const accounts = ChartOfAccountsTemplates.smallBusiness("USD");
      ledger.createAccounts(accounts);

      expect(ledger.getAccounts()).toHaveLength(accounts.length);
      
      // Verify specific accounts exist with correct properties
      const cash = ledger.getAccount("cash")!;
      expect(cash.name).toBe("Cash");
      expect(cash.type).toBe("asset");
      expect(cash.accountNumber).toBe("1000");

      const accountsPayable = ledger.getAccount("accounts-payable")!;
      expect(accountsPayable.name).toBe("Accounts Payable");
      expect(accountsPayable.type).toBe("liability");
      expect(accountsPayable.accountNumber).toBe("2000");

      const salesRevenue = ledger.getAccount("sales-revenue")!;
      expect(salesRevenue.name).toBe("Sales Revenue");
      expect(salesRevenue.type).toBe("revenue");
      expect(salesRevenue.accountNumber).toBe("4000");

      const ownersEquity = ledger.getAccount("owner-equity")!;
      expect(ownersEquity.name).toBe("Owner's Equity");
      expect(ownersEquity.type).toBe("equity");
      expect(ownersEquity.accountNumber).toBe("3000");

      const cogs = ledger.getAccount("cost-of-goods-sold")!;
      expect(cogs.name).toBe("Cost of Goods Sold");
      expect(cogs.type).toBe("expense");
      expect(cogs.accountNumber).toBe("5000");

      const rent = ledger.getAccount("rent-expense")!;
      expect(rent.name).toBe("Rent Expense");
      expect(rent.type).toBe("expense");
      expect(rent.accountNumber).toBe("6100");
    });

    it("creates ecommerce chart of accounts with correct details", () => {
      const accounts = ChartOfAccountsTemplates.ecommerce("USD");
      ledger.createAccounts(accounts);

      // Ecommerce-specific accounts
      const stripe = ledger.getAccount("stripe-clearing")!;
      expect(stripe.name).toBe("Stripe Clearing");
      expect(stripe.type).toBe("asset");
      expect(stripe.accountNumber).toBe("1020");

      const paypal = ledger.getAccount("paypal-clearing")!;
      expect(paypal.name).toBe("PayPal Clearing");
      expect(paypal.type).toBe("asset");
      expect(paypal.accountNumber).toBe("1021");

      const shippingIncome = ledger.getAccount("shipping-income")!;
      expect(shippingIncome.name).toBe("Shipping Income");
      expect(shippingIncome.type).toBe("revenue");
      expect(shippingIncome.accountNumber).toBe("4200");

      const processingFees = ledger.getAccount("payment-processing-fees")!;
      expect(processingFees.name).toBe("Payment Processing Fees");
      expect(processingFees.type).toBe("expense");
      expect(processingFees.accountNumber).toBe("5100");

      const shippingExpense = ledger.getAccount("shipping-expense")!;
      expect(shippingExpense.name).toBe("Shipping Expense");
      expect(shippingExpense.type).toBe("expense");
      expect(shippingExpense.accountNumber).toBe("5200");

      const refunds = ledger.getAccount("refunds-expense")!;
      expect(refunds.name).toBe("Refunds Expense");
      expect(refunds.type).toBe("expense");
      expect(refunds.accountNumber).toBe("5300");

      // Also includes small business accounts
      expect(ledger.getAccount("cash")).toBeDefined();
    });

    it("creates SaaS chart of accounts with correct details", () => {
      const accounts = ChartOfAccountsTemplates.saas("USD");
      ledger.createAccounts(accounts);

      // SaaS-specific accounts
      const deferredRevenue = ledger.getAccount("deferred-revenue")!;
      expect(deferredRevenue.name).toBe("Deferred Revenue");
      expect(deferredRevenue.type).toBe("liability");
      expect(deferredRevenue.accountNumber).toBe("2400");

      const subscriptionRevenue = ledger.getAccount("subscription-revenue")!;
      expect(subscriptionRevenue.name).toBe("Subscription Revenue");
      expect(subscriptionRevenue.type).toBe("revenue");
      expect(subscriptionRevenue.accountNumber).toBe("4000");

      const usageRevenue = ledger.getAccount("usage-revenue")!;
      expect(usageRevenue.name).toBe("Usage Revenue");
      expect(usageRevenue.type).toBe("revenue");
      expect(usageRevenue.accountNumber).toBe("4100");

      const hostingCosts = ledger.getAccount("hosting-costs")!;
      expect(hostingCosts.name).toBe("Hosting & Infrastructure");
      expect(hostingCosts.type).toBe("expense");
      expect(hostingCosts.accountNumber).toBe("5100");

      const customerSuccess = ledger.getAccount("customer-success")!;
      expect(customerSuccess.name).toBe("Customer Success");
      expect(customerSuccess.type).toBe("expense");
      expect(customerSuccess.accountNumber).toBe("6900");

      // Also includes small business accounts
      expect(ledger.getAccount("cash")).toBeDefined();
    });
  });

  describe("getSummary", () => {
    it("returns ledger summary", () => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });
      ledger.createAccount({ id: "revenue", name: "Revenue", type: "revenue", currency: USD });

      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Sale" },
      });

      const summary = ledger.getSummary();

      expect(summary.accountCount).toBe(2);
      expect(summary.entryCount).toBe(1);
      expect(summary.currency).toBe("USD");
      expect(summary.isBalanced).toBe(true);
    });
  });

  describe("getCurrency", () => {
    it("returns the ledger currency", () => {
      expect(ledger.getCurrency()).toBe("USD");
    });
  });

  describe("trial balance edge cases", () => {
    it("handles contra balances (negative asset)", () => {
      // Create asset account and credit more than debit to get negative balance
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });
      ledger.createAccount({ id: "bank", name: "Bank", type: "asset", currency: USD });

      // Create a situation where cash goes negative (overdraft scenario)
      // First give bank some money
      ledger.post({
        lines: [
          { accountId: "bank", amount: Money.fromMajor("1000", "USD"), type: "debit" },
          { accountId: "cash", amount: Money.fromMajor("1000", "USD"), type: "credit" },
        ],
        metadata: { description: "Transfer to bank - overdrafts cash" },
      });

      const cash = ledger.getAccount("cash")!;
      expect(cash.getBalance().isNegative()).toBe(true);

      const tb = ledger.getTrialBalance();
      // The negative cash balance should appear on credit side
      const cashEntry = tb.entries.find((e) => e.accountId === "cash");
      expect(cashEntry?.creditBalance.toDecimalString()).toBe("1000.00");
      expect(tb.isBalanced).toBe(true);
    });

    it("handles contra balances (negative liability)", () => {
      ledger.createAccount({ id: "ap", name: "Accounts Payable", type: "liability", currency: USD });
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });

      // Over-pay a liability to make it negative
      ledger.post({
        lines: [
          { accountId: "ap", amount: Money.fromMajor("500", "USD"), type: "debit" },
          { accountId: "cash", amount: Money.fromMajor("500", "USD"), type: "credit" },
        ],
        metadata: { description: "Overpayment" },
      });

      const ap = ledger.getAccount("ap")!;
      expect(ap.getBalance().isNegative()).toBe(true);

      const tb = ledger.getTrialBalance();
      // The negative liability balance should appear on debit side
      const apEntry = tb.entries.find((e) => e.accountId === "ap");
      expect(apEntry?.debitBalance.toDecimalString()).toBe("500.00");
      expect(tb.isBalanced).toBe(true);
    });

    it("filters inactive accounts from trial balance", () => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD, isActive: false });
      ledger.createAccount({ id: "revenue", name: "Revenue", type: "revenue", currency: USD });

      const tb = ledger.getTrialBalance();
      // Inactive account with no activity shouldn't affect anything
      expect(tb.entries.find((e) => e.accountId === "cash")).toBeUndefined();
    });
  });

  describe("query edge cases", () => {
    beforeEach(() => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });
      ledger.createAccount({ id: "revenue", name: "Revenue", type: "revenue", currency: USD });
    });

    it("filters by date range - fromDate", () => {
      const entry = ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Entry", date: new Date("2025-01-15") },
      });

      const futureEntries = ledger.query({ fromDate: new Date("2025-02-01") });
      expect(futureEntries).toHaveLength(0);

      const pastEntries = ledger.query({ fromDate: new Date("2025-01-01") });
      expect(pastEntries).toHaveLength(1);
    });

    it("filters by date range - toDate", () => {
      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Entry", date: new Date("2025-01-15") },
      });

      const beforeEntries = ledger.query({ toDate: new Date("2025-01-01") });
      expect(beforeEntries).toHaveLength(0);

      const afterEntries = ledger.query({ toDate: new Date("2025-02-01") });
      expect(afterEntries).toHaveLength(1);
    });

    it("filters by tags", () => {
      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Entry", tags: ["sales", "q1"] },
      });

      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("50", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("50", "USD"), type: "credit" },
        ],
        metadata: { description: "Entry 2", tags: ["refund"] },
      });

      const salesEntries = ledger.query({ tags: ["sales"] });
      expect(salesEntries).toHaveLength(1);

      const q1OrRefund = ledger.query({ tags: ["q1", "refund"] });
      expect(q1OrRefund).toHaveLength(2);
    });
  });

  describe("verification edge cases", () => {
    beforeEach(() => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });
      ledger.createAccount({ id: "revenue", name: "Revenue", type: "revenue", currency: USD });
    });

    it("returns true for empty ledger", () => {
      expect(ledger.verify()).toBe(true);
    });

    it("verifies multiple entries in chain", () => {
      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Entry 1" },
      });

      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("50", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("50", "USD"), type: "credit" },
        ],
        metadata: { description: "Entry 2" },
      });

      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("25", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("25", "USD"), type: "credit" },
        ],
        metadata: { description: "Entry 3" },
      });

      expect(ledger.verify()).toBe(true);
    });
  });

  describe("account history edge cases", () => {
    beforeEach(() => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });
      ledger.createAccount({ id: "revenue", name: "Revenue", type: "revenue", currency: USD });
    });

    it("returns empty history for account with no transactions", () => {
      const history = ledger.getAccountHistory("cash");
      expect(history).toHaveLength(0);
    });

    it("tracks credit-normal account history correctly", () => {
      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("100", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("100", "USD"), type: "credit" },
        ],
        metadata: { description: "Sale 1" },
      });

      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("50", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("50", "USD"), type: "credit" },
        ],
        metadata: { description: "Sale 2" },
      });

      const history = ledger.getAccountHistory("revenue");

      expect(history).toHaveLength(2);
      expect(history[0].runningBalance.toDecimalString()).toBe("100.00");
      expect(history[1].runningBalance.toDecimalString()).toBe("150.00");
    });
  });

  describe("snapshot edge cases", () => {
    it("restores ledger with no entries", () => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });

      const snapshot = ledger.snapshot();
      const restored = DoubleEntryLedger.fromSnapshot(snapshot);

      expect(restored.getAccount("cash")).toBeDefined();
      expect(restored.getJournalEntries()).toHaveLength(0);
    });

    it("restores ledger with multiple accounts and entries", () => {
      ledger.createAccount({ id: "cash", name: "Cash", type: "asset", currency: USD });
      ledger.createAccount({ id: "revenue", name: "Revenue", type: "revenue", currency: USD });
      ledger.createAccount({ id: "expense", name: "Expense", type: "expense", currency: USD });

      ledger.post({
        lines: [
          { accountId: "cash", amount: Money.fromMajor("1000", "USD"), type: "debit" },
          { accountId: "revenue", amount: Money.fromMajor("1000", "USD"), type: "credit" },
        ],
        metadata: { description: "Sale" },
      });

      ledger.post({
        lines: [
          { accountId: "expense", amount: Money.fromMajor("200", "USD"), type: "debit" },
          { accountId: "cash", amount: Money.fromMajor("200", "USD"), type: "credit" },
        ],
        metadata: { description: "Expense" },
      });

      const snapshot = ledger.snapshot();
      const restored = DoubleEntryLedger.fromSnapshot(snapshot);

      expect(restored.getAccount("cash")?.getBalance().toDecimalString()).toBe("800.00");
      expect(restored.getAccount("revenue")?.getBalance().toDecimalString()).toBe("1000.00");
      expect(restored.getAccount("expense")?.getBalance().toDecimalString()).toBe("200.00");
      expect(restored.getJournalEntries()).toHaveLength(2);
    });

    it("preserves account metadata in snapshot", () => {
      ledger.createAccount({
        id: "cash",
        name: "Cash",
        type: "asset",
        currency: USD,
        description: "Main cash account",
        accountNumber: "1000",
        metadata: { department: "finance" },
      });

      const snapshot = ledger.snapshot();
      const restored = DoubleEntryLedger.fromSnapshot(snapshot);

      const account = restored.getAccount("cash")!;
      expect(account.description).toBe("Main cash account");
      expect(account.accountNumber).toBe("1000");
    });
  });

  describe("getAccounts filtering", () => {
    it("filters by active status", () => {
      ledger.createAccount({ id: "active", name: "Active", type: "asset", currency: USD, isActive: true });
      ledger.createAccount({ id: "inactive", name: "Inactive", type: "asset", currency: USD, isActive: false });

      const activeAccounts = ledger.getAccounts({ isActive: true });
      expect(activeAccounts).toHaveLength(1);
      expect(activeAccounts[0].id).toBe("active");

      const inactiveAccounts = ledger.getAccounts({ isActive: false });
      expect(inactiveAccounts).toHaveLength(1);
      expect(inactiveAccounts[0].id).toBe("inactive");
    });
  });
});
