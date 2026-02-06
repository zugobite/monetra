import { Money } from "../money/Money";
import { Currency } from "../currency/Currency";

/**
 * Standard account types following GAAP classification.
 * Each type has a natural balance side (debit or credit).
 */
export type AccountType =
  | "asset" // Natural debit balance (increases with debits)
  | "liability" // Natural credit balance (increases with credits)
  | "equity" // Natural credit balance (increases with credits)
  | "revenue" // Natural credit balance (increases with credits)
  | "expense" // Natural debit balance (increases with debits)
  | "contra-asset" // Natural credit balance (reduces assets)
  | "contra-liability" // Natural debit balance (reduces liabilities)
  | "contra-equity" // Natural debit balance (reduces equity)
  | "contra-revenue" // Natural debit balance (reduces revenue)
  | "contra-expense"; // Natural credit balance (reduces expenses)

/**
 * Account classification for financial statements.
 */
export interface AccountClassification {
  /** Primary category for financial statements */
  statement: "balance-sheet" | "income-statement";
  /** Sub-category within the statement */
  category: string;
  /** Whether this account typically has a debit or credit balance */
  normalBalance: "debit" | "credit";
}

/**
 * Configuration for creating an account.
 */
export interface AccountConfig {
  /** Unique account identifier (e.g., "1000", "accounts-receivable") */
  id: string;
  /** Human-readable account name */
  name: string;
  /** Account type following GAAP classification */
  type: AccountType;
  /** Currency for this account */
  currency: string | Currency;
  /** Optional description */
  description?: string;
  /** Optional parent account ID for hierarchical chart of accounts */
  parentId?: string;
  /** Optional account number for sorting/display */
  accountNumber?: string;
  /** Whether this account is active */
  isActive?: boolean;
  /** Custom metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Represents a ledger account in double-entry bookkeeping.
 *
 * Accounts follow GAAP classification with natural balance sides:
 * - Assets & Expenses: Increase with debits, decrease with credits
 * - Liabilities, Equity & Revenue: Increase with credits, decrease with debits
 *
 * @example
 * ```typescript
 * const cash = new Account({
 *   id: "1000",
 *   name: "Cash",
 *   type: "asset",
 *   currency: "USD"
 * });
 *
 * cash.debit(Money.fromMajor("1000", "USD")); // Increases cash
 * cash.credit(Money.fromMajor("500", "USD")); // Decreases cash
 * console.log(cash.getBalance()); // $500.00
 * ```
 */
export class Account {
  readonly id: string;
  readonly name: string;
  readonly type: AccountType;
  readonly currency: string;
  readonly description?: string;
  readonly parentId?: string;
  readonly accountNumber?: string;
  readonly isActive: boolean;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly createdAt: Date;

  private debits: Money;
  private credits: Money;

  constructor(config: AccountConfig) {
    this.id = config.id;
    this.name = config.name;
    this.type = config.type;
    this.currency =
      typeof config.currency === "string"
        ? config.currency
        : config.currency.code;
    this.description = config.description;
    this.parentId = config.parentId;
    this.accountNumber = config.accountNumber;
    this.isActive = config.isActive ?? true;
    this.metadata = Object.freeze({ ...config.metadata });
    this.createdAt = new Date();

    // Initialize with zero balances
    this.debits = Money.zero(this.currency);
    this.credits = Money.zero(this.currency);
  }

  /**
   * Gets the classification of this account type.
   */
  getClassification(): AccountClassification {
    return Account.getClassificationForType(this.type);
  }

  /**
   * Gets classification for any account type.
   */
  static getClassificationForType(type: AccountType): AccountClassification {
    switch (type) {
      case "asset":
        return {
          statement: "balance-sheet",
          category: "assets",
          normalBalance: "debit",
        };
      case "contra-asset":
        return {
          statement: "balance-sheet",
          category: "assets",
          normalBalance: "credit",
        };
      case "liability":
        return {
          statement: "balance-sheet",
          category: "liabilities",
          normalBalance: "credit",
        };
      case "contra-liability":
        return {
          statement: "balance-sheet",
          category: "liabilities",
          normalBalance: "debit",
        };
      case "equity":
        return {
          statement: "balance-sheet",
          category: "equity",
          normalBalance: "credit",
        };
      case "contra-equity":
        return {
          statement: "balance-sheet",
          category: "equity",
          normalBalance: "debit",
        };
      case "revenue":
        return {
          statement: "income-statement",
          category: "revenue",
          normalBalance: "credit",
        };
      case "contra-revenue":
        return {
          statement: "income-statement",
          category: "revenue",
          normalBalance: "debit",
        };
      case "expense":
        return {
          statement: "income-statement",
          category: "expenses",
          normalBalance: "debit",
        };
      case "contra-expense":
        return {
          statement: "income-statement",
          category: "expenses",
          normalBalance: "credit",
        };
    }
  }

  /**
   * Returns whether this account increases with debits.
   */
  increasesWithDebit(): boolean {
    return this.getClassification().normalBalance === "debit";
  }

  /**
   * Records a debit to this account.
   * @internal Used by DoubleEntryLedger - not meant for direct use.
   */
  debit(amount: Money): void {
    this.validateCurrency(amount);
    this.debits = this.debits.add(amount);
  }

  /**
   * Records a credit to this account.
   * @internal Used by DoubleEntryLedger - not meant for direct use.
   */
  credit(amount: Money): void {
    this.validateCurrency(amount);
    this.credits = this.credits.add(amount);
  }

  /**
   * Gets the current balance following the natural balance convention.
   *
   * For debit-normal accounts (assets, expenses):
   *   Balance = Debits - Credits
   *
   * For credit-normal accounts (liabilities, equity, revenue):
   *   Balance = Credits - Debits
   *
   * A positive balance means the account is in its natural state.
   * A negative balance indicates a contra position.
   */
  getBalance(): Money {
    if (this.increasesWithDebit()) {
      return this.debits.subtract(this.credits);
    }
    return this.credits.subtract(this.debits);
  }

  /**
   * Gets total debits posted to this account.
   */
  getTotalDebits(): Money {
    return this.debits;
  }

  /**
   * Gets total credits posted to this account.
   */
  getTotalCredits(): Money {
    return this.credits;
  }

  /**
   * Returns a summary of the account for debugging/display.
   */
  toSummary(): {
    id: string;
    name: string;
    type: AccountType;
    balance: Money;
    debits: Money;
    credits: Money;
    isActive: boolean;
  } {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      balance: this.getBalance(),
      debits: this.debits,
      credits: this.credits,
      isActive: this.isActive,
    };
  }

  private validateCurrency(amount: Money): void {
    if (amount.currency.code !== this.currency) {
      throw new Error(
        `Currency mismatch: Account "${this.name}" uses ${this.currency}, ` +
          `but received ${amount.currency.code}`,
      );
    }
  }
}
