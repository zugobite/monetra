import { describe, it, expect, beforeEach } from "vitest";
import { Account, AccountType } from "../../src/ledger/Account";
import { Money } from "../../src/money/Money";
import { USD, EUR } from "../../src/currency/iso4217";

describe("Account", () => {
  describe("creation", () => {
    it("creates an account with required fields", () => {
      const account = new Account({
        id: "cash",
        name: "Cash",
        type: "asset",
        currency: USD,
      });

      expect(account.id).toBe("cash");
      expect(account.name).toBe("Cash");
      expect(account.type).toBe("asset");
      expect(account.currency).toBe("USD");
      expect(account.isActive).toBe(true);
    });

    it("creates an account with all optional fields", () => {
      const account = new Account({
        id: "cash",
        name: "Cash",
        type: "asset",
        currency: USD,
        description: "Main cash account",
        parentId: "current-assets",
        accountNumber: "1000",
        isActive: false,
        metadata: { department: "finance" },
      });

      expect(account.description).toBe("Main cash account");
      expect(account.parentId).toBe("current-assets");
      expect(account.accountNumber).toBe("1000");
      expect(account.isActive).toBe(false);
      expect(account.metadata).toEqual({ department: "finance" });
    });

    it("freezes metadata to prevent mutation", () => {
      const account = new Account({
        id: "cash",
        name: "Cash",
        type: "asset",
        currency: USD,
        metadata: { key: "value" },
      });

      expect(() => {
        (account.metadata as Record<string, unknown>).key = "mutated";
      }).toThrow();
    });
  });

  describe("account classifications", () => {
    const testCases: Array<{
      type: AccountType;
      statement: "balance-sheet" | "income-statement";
      normalBalance: "debit" | "credit";
    }> = [
      { type: "asset", statement: "balance-sheet", normalBalance: "debit" },
      { type: "contra-asset", statement: "balance-sheet", normalBalance: "credit" },
      { type: "liability", statement: "balance-sheet", normalBalance: "credit" },
      { type: "contra-liability", statement: "balance-sheet", normalBalance: "debit" },
      { type: "equity", statement: "balance-sheet", normalBalance: "credit" },
      { type: "contra-equity", statement: "balance-sheet", normalBalance: "debit" },
      { type: "revenue", statement: "income-statement", normalBalance: "credit" },
      { type: "contra-revenue", statement: "income-statement", normalBalance: "debit" },
      { type: "expense", statement: "income-statement", normalBalance: "debit" },
      { type: "contra-expense", statement: "income-statement", normalBalance: "credit" },
    ];

    testCases.forEach(({ type, statement, normalBalance }) => {
      it(`classifies ${type} correctly`, () => {
        const account = new Account({
          id: "test",
          name: "Test",
          type,
          currency: USD,
        });

        const classification = account.getClassification();
        expect(classification.statement).toBe(statement);
        expect(classification.normalBalance).toBe(normalBalance);
      });
    });
  });

  describe("debits and credits", () => {
    it("asset accounts increase with debits", () => {
      const cash = new Account({
        id: "cash",
        name: "Cash",
        type: "asset",
        currency: USD,
      });

      cash.debit(Money.fromMajor("100", "USD"));
      expect(cash.getBalance().toDecimalString()).toBe("100.00");

      cash.credit(Money.fromMajor("30", "USD"));
      expect(cash.getBalance().toDecimalString()).toBe("70.00");
    });

    it("liability accounts increase with credits", () => {
      const payable = new Account({
        id: "accounts-payable",
        name: "Accounts Payable",
        type: "liability",
        currency: USD,
      });

      payable.credit(Money.fromMajor("500", "USD"));
      expect(payable.getBalance().toDecimalString()).toBe("500.00");

      payable.debit(Money.fromMajor("200", "USD"));
      expect(payable.getBalance().toDecimalString()).toBe("300.00");
    });

    it("revenue accounts increase with credits", () => {
      const revenue = new Account({
        id: "sales",
        name: "Sales Revenue",
        type: "revenue",
        currency: USD,
      });

      revenue.credit(Money.fromMajor("1000", "USD"));
      expect(revenue.getBalance().toDecimalString()).toBe("1000.00");
    });

    it("expense accounts increase with debits", () => {
      const expense = new Account({
        id: "rent",
        name: "Rent Expense",
        type: "expense",
        currency: USD,
      });

      expense.debit(Money.fromMajor("2000", "USD"));
      expect(expense.getBalance().toDecimalString()).toBe("2000.00");
    });

    it("tracks total debits and credits separately", () => {
      const cash = new Account({
        id: "cash",
        name: "Cash",
        type: "asset",
        currency: USD,
      });

      cash.debit(Money.fromMajor("100", "USD"));
      cash.debit(Money.fromMajor("50", "USD"));
      cash.credit(Money.fromMajor("30", "USD"));

      expect(cash.getTotalDebits().toDecimalString()).toBe("150.00");
      expect(cash.getTotalCredits().toDecimalString()).toBe("30.00");
      expect(cash.getBalance().toDecimalString()).toBe("120.00");
    });

    it("starts with zero balance", () => {
      const account = new Account({
        id: "test",
        name: "Test",
        type: "asset",
        currency: USD,
      });

      expect(account.getBalance().isZero()).toBe(true);
      expect(account.getTotalDebits().isZero()).toBe(true);
      expect(account.getTotalCredits().isZero()).toBe(true);
    });

    it("throws on currency mismatch", () => {
      const account = new Account({
        id: "cash",
        name: "Cash",
        type: "asset",
        currency: USD,
      });

      expect(() => {
        account.debit(Money.fromMajor("100", "EUR"));
      }).toThrow('Account "Cash" uses USD, but received EUR');
    });
  });

  describe("increasesWithDebit", () => {
    it("returns true for debit-normal accounts", () => {
      const asset = new Account({ id: "a", name: "A", type: "asset", currency: USD });
      const expense = new Account({ id: "e", name: "E", type: "expense", currency: USD });
      const contraLiability = new Account({ id: "cl", name: "CL", type: "contra-liability", currency: USD });

      expect(asset.increasesWithDebit()).toBe(true);
      expect(expense.increasesWithDebit()).toBe(true);
      expect(contraLiability.increasesWithDebit()).toBe(true);
    });

    it("returns false for credit-normal accounts", () => {
      const liability = new Account({ id: "l", name: "L", type: "liability", currency: USD });
      const revenue = new Account({ id: "r", name: "R", type: "revenue", currency: USD });
      const equity = new Account({ id: "eq", name: "EQ", type: "equity", currency: USD });

      expect(liability.increasesWithDebit()).toBe(false);
      expect(revenue.increasesWithDebit()).toBe(false);
      expect(equity.increasesWithDebit()).toBe(false);
    });
  });

  describe("toSummary", () => {
    it("returns a complete summary object", () => {
      const account = new Account({
        id: "cash",
        name: "Cash",
        type: "asset",
        currency: USD,
        isActive: true,
      });

      account.debit(Money.fromMajor("100", "USD"));
      account.credit(Money.fromMajor("30", "USD"));

      const summary = account.toSummary();

      expect(summary.id).toBe("cash");
      expect(summary.name).toBe("Cash");
      expect(summary.type).toBe("asset");
      expect(summary.balance.toDecimalString()).toBe("70.00");
      expect(summary.debits.toDecimalString()).toBe("100.00");
      expect(summary.credits.toDecimalString()).toBe("30.00");
      expect(summary.isActive).toBe(true);
    });
  });
});
