import { bench, describe } from "vitest";
import { Money } from "../src/money/Money";
import { Ledger } from "../src/ledger/Ledger";
import { USD, EUR } from "../src/currency/iso4217";

describe("High-Volume Scenarios - Stress Tests", () => {
  // Test constants
  const SMALL_BATCH = 1_000;
  const MEDIUM_BATCH = 10_000;
  const LARGE_BATCH = 100_000;

  bench("Bulk Money Creation (1k objects)", () => {
    const amounts = [];
    for (let i = 0; i < SMALL_BATCH; i++) {
      amounts.push(
        Money.fromMinor(BigInt(Math.floor(Math.random() * 100000)), USD)
      );
    }
  });

  bench("Mass Allocation (1k recipients)", () => {
    const pot = Money.fromMinor(1_000_000_00n, USD); // $1M
    const ratios = new Array(SMALL_BATCH).fill(1);
    pot.allocate(ratios);
  });

  bench("Sequential Additions (10k operations)", () => {
    let total = Money.zero(USD);
    const amount = Money.fromMinor(100n, USD);

    for (let i = 0; i < MEDIUM_BATCH; i++) {
      total = total.add(amount);
    }
  });

  bench("Array Summation (10k Money objects)", () => {
    const amounts = Array.from({ length: MEDIUM_BATCH }, (_, i) =>
      Money.fromMinor(BigInt(i * 100), USD)
    );

    let sum = Money.zero(USD);
    for (const amount of amounts) {
      sum = sum.add(amount);
    }
  });
});

describe("Ledger Performance - Transaction Processing", () => {
  // Generate test transactions
  const generateTransactions = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `txn_${i.toString().padStart(6, "0")}`,
      amount: Money.fromMinor(BigInt(Math.floor(Math.random() * 50000)), USD),
      type: i % 2 === 0 ? ("credit" as const) : ("debit" as const),
      description: `Transaction ${i}`,
      metadata: { batch: Math.floor(i / 100) },
    }));
  };

  bench("Ledger: Add 1k transactions", () => {
    const ledger = new Ledger(USD);
    const transactions = generateTransactions(1_000);

    transactions.forEach((tx) => {
      ledger.record(tx.amount, {
        type: tx.type,
        description: tx.description,
        metadata: { id: tx.id, ...tx.metadata },
      });
    });
  });

  bench("Ledger: Balance calculation (1k entries)", () => {
    const ledger = new Ledger(USD);
    const transactions = generateTransactions(1_000);

    // Pre-populate ledger
    transactions.forEach((tx) => {
      ledger.record(tx.amount, {
        type: tx.type,
        description: tx.description,
        metadata: { id: tx.id, ...tx.metadata },
      });
    });

    // Benchmark balance calculation
    ledger.getBalance();
  });

  bench("Ledger: Snapshot creation (1k entries)", () => {
    const ledger = new Ledger(USD);
    const transactions = generateTransactions(1_000);

    // Pre-populate ledger
    transactions.forEach((tx) => {
      ledger.record(tx.amount, {
        type: tx.type,
        description: tx.description,
        metadata: { id: tx.id, ...tx.metadata },
      });
    });

    // Benchmark snapshot creation
    ledger.snapshot();
  });
});

describe("Memory Allocation - Large Datasets", () => {
  bench("Memory: 100k Money objects creation", () => {
    const objects = [];
    for (let i = 0; i < 100_000; i++) {
      objects.push(Money.fromMinor(BigInt(i), USD));
    }
    // Force GC by clearing reference
    objects.length = 0;
  });

  bench("Memory: Massive allocation (10k recipients)", () => {
    const pot = Money.fromMinor(100_000_000_00n, USD); // $100M
    const ratios = new Array(10_000).fill(1);
    const result = pot.allocate(ratios);
    // Clear reference to help GC
    result.length = 0;
  });
});

describe("Real-World Financial Scenarios", () => {
  bench("Scenario: Daily trading settlement (1k trades)", () => {
    const trades = Array.from({ length: 1_000 }, (_, i) => ({
      buy: Money.fromMinor(BigInt(Math.floor(Math.random() * 1000000)), USD),
      sell: Money.fromMinor(BigInt(Math.floor(Math.random() * 1000000)), USD),
      fee: Money.fromMinor(BigInt(Math.floor(Math.random() * 10000)), USD),
    }));

    let totalVolume = Money.zero(USD);
    let totalFees = Money.zero(USD);

    for (const trade of trades) {
      totalVolume = totalVolume.add(trade.buy).add(trade.sell);
      totalFees = totalFees.add(trade.fee);
    }
  });

  bench("Scenario: Payroll distribution (500 employees)", () => {
    const totalPayroll = Money.fromMinor(500_000_00n, USD); // $500k
    const employees = 500;

    // Simulate different salary weights
    const weights = Array.from(
      { length: employees },
      () => Math.floor(Math.random() * 100) + 50 // 50-149 weight
    );

    totalPayroll.allocate(weights);
  });

  bench("Scenario: Multi-currency portfolio (100 assets)", () => {
    const currencies = [USD, EUR];
    const assets = Array.from({ length: 100 }, (_, i) => ({
      amount: Money.fromMinor(
        BigInt(Math.floor(Math.random() * 1000000)),
        currencies[i % currencies.length]
      ),
    }));

    // Group by currency and sum
    const usdTotal = assets
      .filter((a) => a.amount.currency.code === "USD")
      .reduce((sum, a) => sum.add(a.amount), Money.zero(USD));

    const eurTotal = assets
      .filter((a) => a.amount.currency.code === "EUR")
      .reduce((sum, a) => sum.add(a.amount), Money.zero(EUR));
  });
});
