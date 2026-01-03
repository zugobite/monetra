# Node.js Examples

Comprehensive examples for using Monetra in Node.js server applications. Covers Express APIs, database integration, background jobs, and payment processing.

---

## Table of Contents

- [Basic Setup](#setup)
- [Express API](#express)
- [Database Integration](#database)
- [Payment Processing](#payments)
- [Background Jobs](#jobs)
- [Microservices](#microservices)
- [CLI Tools](#cli)

---

## Basic Setup {#setup}

### Installation

```bash
npm install monetra
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "lib": ["ES2020"]
  }
}
```

### Basic Usage

```typescript
// CommonJS
const { money, Money, Ledger, RoundingMode } = require("monetra");

// ESM
import { money, Money, Ledger, RoundingMode } from "monetra";

// Create money
const price = money("99.99", "USD");
console.log(price.format()); // "$99.99"

// Arithmetic
const withTax = price.multiply(1.08, { rounding: RoundingMode.HALF_UP });
console.log(withTax.format()); // "$107.99"
```

---

## Express API {#express}

### Money API Middleware

```typescript
// middleware/money.ts
import { Request, Response, NextFunction } from "express";
import {
  money,
  Money,
  MonetraError,
  MonetraErrorCode,
  getCurrency,
} from "monetra";

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      money?: {
        parse: (amount: string, currency: string) => Money;
        fromMinor: (minor: bigint | string, currency: string) => Money;
      };
    }
  }
}

// Money utilities middleware
export function moneyMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    req.money = {
      parse: (amount: string, currency: string) => money(amount, currency),
      fromMinor: (minor: bigint | string, currency: string) => {
        const minorBigInt = typeof minor === "string" ? BigInt(minor) : minor;
        return Money.fromMinor(minorBigInt, currency);
      },
    };
    next();
  };
}

// Error handler for Monetra errors
export function monetraErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof MonetraError) {
    const statusMap: Record<string, number> = {
      [MonetraErrorCode.CURRENCY_MISMATCH]: 400,
      [MonetraErrorCode.INVALID_PRECISION]: 400,
      [MonetraErrorCode.ROUNDING_REQUIRED]: 400,
      [MonetraErrorCode.INSUFFICIENT_FUNDS]: 422,
      [MonetraErrorCode.OVERFLOW]: 400,
    };

    return res.status(statusMap[err.code] ?? 500).json({
      error: {
        code: err.code,
        type: err.name,
        message: err.message,
      },
    });
  }
  next(err);
}

// Serialize Money for JSON responses
export function serializeMoney(m: Money) {
  return {
    amount: m.format({ symbol: false }),
    formatted: m.format(),
    minor: m.minor.toString(),
    currency: m.currency.code,
  };
}
```

### Complete Express API

```typescript
// app.ts
import express, { Request, Response, NextFunction } from "express";
import {
  money,
  Money,
  Ledger,
  Converter,
  RoundingMode,
  MonetraError,
} from "monetra";
import {
  moneyMiddleware,
  monetraErrorHandler,
  serializeMoney,
} from "./middleware/money";

const app = express();
app.use(express.json());
app.use(moneyMiddleware());

// In-memory ledger (use database in production)
const ledger = new Ledger({ currency: "USD" });

// Exchange rates
const converter = new Converter("USD", {
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
});

// ====================
// Account Endpoints
// ====================

// Create account with initial deposit
app.post("/api/accounts", (req, res, next) => {
  try {
    const { accountId, initialDeposit, currency = "USD" } = req.body;

    if (!accountId) {
      return res.status(400).json({ error: "Account ID required" });
    }

    if (initialDeposit) {
      const deposit = money(initialDeposit, currency);
      ledger.credit(accountId, deposit, "Initial deposit");
    }

    const balance = ledger.getBalance(accountId);

    res.status(201).json({
      accountId,
      balance: serializeMoney(balance),
    });
  } catch (error) {
    next(error);
  }
});

// Get account balance
app.get("/api/accounts/:id/balance", (req, res) => {
  const balance = ledger.getBalance(req.params.id);
  res.json({
    accountId: req.params.id,
    balance: serializeMoney(balance),
  });
});

// Deposit
app.post("/api/accounts/:id/deposit", (req, res, next) => {
  try {
    const { amount, description = "Deposit" } = req.body;
    const deposit = money(amount, "USD");

    const txId = ledger.credit(req.params.id, deposit, description);
    const balance = ledger.getBalance(req.params.id);

    res.json({
      transactionId: txId,
      deposited: serializeMoney(deposit),
      newBalance: serializeMoney(balance),
    });
  } catch (error) {
    next(error);
  }
});

// Withdraw
app.post("/api/accounts/:id/withdraw", (req, res, next) => {
  try {
    const { amount, description = "Withdrawal" } = req.body;
    const withdrawal = money(amount, "USD");

    const txId = ledger.debit(req.params.id, withdrawal, description);
    const balance = ledger.getBalance(req.params.id);

    res.json({
      transactionId: txId,
      withdrawn: serializeMoney(withdrawal),
      newBalance: serializeMoney(balance),
    });
  } catch (error) {
    next(error);
  }
});

// Transfer between accounts
app.post("/api/transfers", (req, res, next) => {
  try {
    const { from, to, amount, description = "Transfer" } = req.body;

    if (!from || !to || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transferAmount = money(amount, "USD");
    const txId = ledger.transfer(from, to, transferAmount, description);

    res.json({
      transactionId: txId,
      from: {
        accountId: from,
        balance: serializeMoney(ledger.getBalance(from)),
      },
      to: {
        accountId: to,
        balance: serializeMoney(ledger.getBalance(to)),
      },
      amount: serializeMoney(transferAmount),
    });
  } catch (error) {
    next(error);
  }
});

// ====================
// Currency Endpoints
// ====================

// Convert currency
app.post("/api/convert", (req, res, next) => {
  try {
    const { amount, from, to } = req.body;

    const source = money(amount, from);
    const result = converter.convert(source, to);

    res.json({
      from: serializeMoney(source),
      to: serializeMoney(result),
      rate: converter.getRate(from, to),
    });
  } catch (error) {
    next(error);
  }
});

// Split bill
app.post("/api/split", (req, res, next) => {
  try {
    const { amount, currency = "USD", ways, weights } = req.body;

    const total = money(amount, currency);
    const parts = weights ? total.allocate(weights) : total.split(ways);

    res.json({
      total: serializeMoney(total),
      parts: parts.map(serializeMoney),
      perPerson: serializeMoney(parts[0]),
    });
  } catch (error) {
    next(error);
  }
});

// ====================
// Ledger Endpoints
// ====================

// Get all transactions
app.get("/api/transactions", (req, res) => {
  const { account, limit = 100, offset = 0 } = req.query;

  let transactions = ledger.getTransactions();

  if (account) {
    transactions = transactions.filter((tx) => tx.account === account);
  }

  const paginated = transactions.slice(
    Number(offset),
    Number(offset) + Number(limit)
  );

  res.json({
    transactions: paginated.map((tx) => ({
      ...tx,
      amount: serializeMoney(tx.amount),
    })),
    total: transactions.length,
    limit: Number(limit),
    offset: Number(offset),
  });
});

// Verify ledger integrity
app.get("/api/ledger/verify", (req, res) => {
  const isValid = ledger.verify();

  res.json({
    valid: isValid,
    transactionCount: ledger.getTransactions().length,
    totalBalance: serializeMoney(ledger.getTotalBalance()),
  });
});

// Error handler
app.use(monetraErrorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Request/Response Types

```typescript
// types/api.ts
import { Money } from "monetra";

// Serialized Money for API responses
export interface MoneyDTO {
  amount: string;
  formatted: string;
  minor: string;
  currency: string;
}

// Account
export interface AccountResponse {
  accountId: string;
  balance: MoneyDTO;
}

// Transfer
export interface TransferRequest {
  from: string;
  to: string;
  amount: string;
  description?: string;
}

export interface TransferResponse {
  transactionId: string;
  from: AccountResponse;
  to: AccountResponse;
  amount: MoneyDTO;
}

// Conversion
export interface ConvertRequest {
  amount: string;
  from: string;
  to: string;
}

export interface ConvertResponse {
  from: MoneyDTO;
  to: MoneyDTO;
  rate: number;
}
```

---

## Database Integration {#database}

### PostgreSQL with Prisma

```prisma
// prisma/schema.prisma
model Account {
  id           String        @id @default(uuid())
  name         String
  currency     String        @default("USD")
  balanceMinor BigInt        @default(0)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  transactions Transaction[]
}

model Transaction {
  id          String   @id @default(uuid())
  accountId   String
  account     Account  @relation(fields: [accountId], references: [id])
  type        String   // 'credit' | 'debit'
  amountMinor BigInt
  currency    String
  description String
  hash        String?
  createdAt   DateTime @default(now())
}
```

```typescript
// services/accountService.ts
import { PrismaClient } from "@prisma/client";
import { money, Money, MonetraError, InsufficientFundsError } from "monetra";

const prisma = new PrismaClient();

export class AccountService {
  async createAccount(name: string, currency: string = "USD") {
    return prisma.account.create({
      data: { name, currency },
    });
  }

  async getBalance(accountId: string): Promise<Money> {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    return Money.fromMinor(account.balanceMinor, account.currency);
  }

  async deposit(
    accountId: string,
    amount: Money,
    description: string
  ): Promise<string> {
    const result = await prisma.$transaction(async (tx) => {
      // Update balance
      const account = await tx.account.update({
        where: { id: accountId },
        data: {
          balanceMinor: {
            increment: amount.minor,
          },
        },
      });

      // Record transaction
      const transaction = await tx.transaction.create({
        data: {
          accountId,
          type: "credit",
          amountMinor: amount.minor,
          currency: amount.currency.code,
          description,
        },
      });

      return transaction;
    });

    return result.id;
  }

  async withdraw(
    accountId: string,
    amount: Money,
    description: string
  ): Promise<string> {
    const result = await prisma.$transaction(async (tx) => {
      // Check balance
      const account = await tx.account.findUnique({
        where: { id: accountId },
      });

      if (!account || account.balanceMinor < amount.minor) {
        throw new InsufficientFundsError("Not enough funds for withdrawal");
      }

      // Update balance
      await tx.account.update({
        where: { id: accountId },
        data: {
          balanceMinor: {
            decrement: amount.minor,
          },
        },
      });

      // Record transaction
      const transaction = await tx.transaction.create({
        data: {
          accountId,
          type: "debit",
          amountMinor: amount.minor,
          currency: amount.currency.code,
          description,
        },
      });

      return transaction;
    });

    return result.id;
  }

  async transfer(
    fromId: string,
    toId: string,
    amount: Money,
    description: string
  ): Promise<{ fromTxId: string; toTxId: string }> {
    const result = await prisma.$transaction(async (tx) => {
      // Check source balance
      const fromAccount = await tx.account.findUnique({
        where: { id: fromId },
      });

      if (!fromAccount || fromAccount.balanceMinor < amount.minor) {
        throw new InsufficientFundsError("Not enough funds for transfer");
      }

      // Debit source
      await tx.account.update({
        where: { id: fromId },
        data: { balanceMinor: { decrement: amount.minor } },
      });

      // Credit destination
      await tx.account.update({
        where: { id: toId },
        data: { balanceMinor: { increment: amount.minor } },
      });

      // Record transactions
      const fromTx = await tx.transaction.create({
        data: {
          accountId: fromId,
          type: "debit",
          amountMinor: amount.minor,
          currency: amount.currency.code,
          description: `Transfer to ${toId}: ${description}`,
        },
      });

      const toTx = await tx.transaction.create({
        data: {
          accountId: toId,
          type: "credit",
          amountMinor: amount.minor,
          currency: amount.currency.code,
          description: `Transfer from ${fromId}: ${description}`,
        },
      });

      return { fromTxId: fromTx.id, toTxId: toTx.id };
    });

    return result;
  }
}
```

### MongoDB with Mongoose

```typescript
// models/Transaction.ts
import mongoose, { Schema, Document } from "mongoose";
import { Money } from "monetra";

interface ITransaction extends Document {
  accountId: string;
  type: "credit" | "debit";
  amountMinor: string; // Store BigInt as string
  currency: string;
  description: string;
  hash?: string;
  createdAt: Date;
}

const TransactionSchema = new Schema({
  accountId: { type: String, required: true, index: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  amountMinor: { type: String, required: true },
  currency: { type: String, required: true },
  description: { type: String, required: true },
  hash: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Virtual for Money object
TransactionSchema.virtual("amount").get(function (this: ITransaction) {
  return Money.fromMinor(BigInt(this.amountMinor), this.currency);
});

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
```

---

## Payment Processing {#payments}

### Stripe Integration

```typescript
// services/stripeService.ts
import Stripe from "stripe";
import { money, Money, RoundingMode } from "monetra";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class StripeService {
  // Create payment intent with Money amount
  async createPaymentIntent(
    amount: Money,
    customerId?: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.PaymentIntent> {
    return stripe.paymentIntents.create({
      // Stripe expects amount in smallest currency unit (cents)
      amount: Number(amount.minor),
      currency: amount.currency.code.toLowerCase(),
      customer: customerId,
      metadata: {
        ...metadata,
        amountFormatted: amount.format(),
      },
    });
  }

  // Create subscription with Money price
  async createSubscription(
    customerId: string,
    priceAmount: Money,
    interval: "month" | "year"
  ): Promise<Stripe.Subscription> {
    // Create price
    const price = await stripe.prices.create({
      unit_amount: Number(priceAmount.minor),
      currency: priceAmount.currency.code.toLowerCase(),
      recurring: { interval },
      product_data: {
        name: `Subscription - ${priceAmount.format()}/${interval}`,
      },
    });

    // Create subscription
    return stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: price.id }],
    });
  }

  // Parse webhook payment
  parsePaymentAmount(paymentIntent: Stripe.PaymentIntent): Money {
    return Money.fromMinor(
      BigInt(paymentIntent.amount),
      paymentIntent.currency.toUpperCase()
    );
  }

  // Calculate platform fee
  calculatePlatformFee(amount: Money, feePercent: number): Money {
    return amount.multiply(feePercent / 100, {
      rounding: RoundingMode.CEIL, // Round up for fees
    });
  }

  // Split payment for marketplace
  async createConnectPayment(
    amount: Money,
    connectedAccountId: string,
    platformFeePercent: number
  ): Promise<Stripe.PaymentIntent> {
    const platformFee = this.calculatePlatformFee(amount, platformFeePercent);

    return stripe.paymentIntents.create({
      amount: Number(amount.minor),
      currency: amount.currency.code.toLowerCase(),
      application_fee_amount: Number(platformFee.minor),
      transfer_data: {
        destination: connectedAccountId,
      },
    });
  }
}

// Usage
const stripeService = new StripeService();

// Create $99.99 payment
const amount = money("99.99", "USD");
const intent = await stripeService.createPaymentIntent(amount, "cus_xxx", {
  orderId: "order_123",
});

// Marketplace payment with 10% platform fee
const saleAmount = money("100.00", "USD");
const marketplaceIntent = await stripeService.createConnectPayment(
  saleAmount,
  "acct_xxx",
  10 // 10% fee
);
```

### Webhook Handler

```typescript
// routes/webhooks.ts
import express from "express";
import Stripe from "stripe";
import { Money, money } from "monetra";
import { AccountService } from "../services/accountService";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const accountService = new AccountService();

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed");
      return res.status(400).send("Webhook Error");
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Convert Stripe amount to Money
        const amount = Money.fromMinor(
          BigInt(paymentIntent.amount),
          paymentIntent.currency.toUpperCase()
        );

        const customerId = paymentIntent.customer as string;
        const accountId = paymentIntent.metadata?.accountId;

        if (accountId) {
          await accountService.deposit(
            accountId,
            amount,
            `Stripe payment: ${paymentIntent.id}`
          );
        }

        console.log(`Payment received: ${amount.format()}`);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;

        const refundedAmount = Money.fromMinor(
          BigInt(charge.amount_refunded),
          charge.currency.toUpperCase()
        );

        console.log(`Refund processed: ${refundedAmount.format()}`);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;

        const amount = Money.fromMinor(
          BigInt(invoice.amount_paid),
          invoice.currency.toUpperCase()
        );

        console.log(`Invoice paid: ${amount.format()}`);
        break;
      }
    }

    res.json({ received: true });
  }
);

export default router;
```

---

## Background Jobs {#jobs}

### Bull Queue for Money Processing

```typescript
// jobs/paymentProcessor.ts
import Bull from "bull";
import { money, Money, Ledger, RoundingMode } from "monetra";

interface PaymentJob {
  paymentId: string;
  accountId: string;
  amountMinor: string;
  currency: string;
  type: "payout" | "refund" | "fee";
}

const paymentQueue = new Bull<PaymentJob>("payment-processing", {
  redis: process.env.REDIS_URL,
});

// Ledger for tracking
const ledger = new Ledger({ currency: "USD" });

// Process payments
paymentQueue.process(async (job) => {
  const { paymentId, accountId, amountMinor, currency, type } = job.data;

  const amount = Money.fromMinor(BigInt(amountMinor), currency);

  console.log(`Processing ${type}: ${amount.format()} for ${accountId}`);

  try {
    switch (type) {
      case "payout":
        ledger.debit(accountId, amount, `Payout: ${paymentId}`);
        // Trigger actual bank transfer here
        break;

      case "refund":
        ledger.credit(accountId, amount, `Refund: ${paymentId}`);
        break;

      case "fee":
        ledger.debit(accountId, amount, `Fee: ${paymentId}`);
        ledger.credit("platform_fees", amount, `Fee from ${accountId}`);
        break;
    }

    return { success: true, processed: amount.format() };
  } catch (error) {
    console.error(`Payment failed: ${paymentId}`, error);
    throw error;
  }
});

// Add job
export async function queuePayment(
  paymentId: string,
  accountId: string,
  amount: Money,
  type: PaymentJob["type"]
) {
  return paymentQueue.add(
    {
      paymentId,
      accountId,
      amountMinor: amount.minor.toString(),
      currency: amount.currency.code,
      type,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    }
  );
}

// Usage
await queuePayment("pay_123", "user_456", money("100.00", "USD"), "payout");
```

### Recurring Billing Job

```typescript
// jobs/billingJob.ts
import cron from "node-cron";
import { money, Money, Ledger, RoundingMode } from "monetra";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ledger = new Ledger({ currency: "USD" });

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  priceMinor: bigint;
  currency: string;
  nextBillingDate: Date;
}

async function processBilling() {
  console.log("Starting billing run...");

  // Get due subscriptions
  const dueSubscriptions = await prisma.subscription.findMany({
    where: {
      status: "active",
      nextBillingDate: {
        lte: new Date(),
      },
    },
  });

  console.log(`Found ${dueSubscriptions.length} subscriptions to bill`);

  const results = {
    success: 0,
    failed: 0,
    revenue: money("0", "USD"),
  };

  for (const sub of dueSubscriptions) {
    try {
      const amount = Money.fromMinor(sub.priceMinor, sub.currency);

      // Charge the subscription
      ledger.credit("revenue", amount, `Subscription ${sub.id}`);
      ledger.debit(`user:${sub.userId}`, amount, `Subscription charge`);

      // Update next billing date
      const nextDate = new Date(sub.nextBillingDate);
      nextDate.setMonth(nextDate.getMonth() + 1);

      await prisma.subscription.update({
        where: { id: sub.id },
        data: { nextBillingDate: nextDate },
      });

      results.success++;
      results.revenue = results.revenue.add(amount);

      console.log(`Billed ${sub.id}: ${amount.format()}`);
    } catch (error) {
      results.failed++;
      console.error(`Failed to bill ${sub.id}:`, error);

      // Mark subscription as past_due
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { status: "past_due" },
      });
    }
  }

  console.log(
    `Billing complete: ${results.success} success, ${results.failed} failed`
  );
  console.log(`Total revenue: ${results.revenue.format()}`);
}

// Run daily at 2 AM
cron.schedule("0 2 * * *", processBilling);

export { processBilling };
```

---

## Microservices {#microservices}

### gRPC Service Definition

```protobuf
// proto/money.proto
syntax = "proto3";

package money;

service MoneyService {
  rpc GetBalance(GetBalanceRequest) returns (BalanceResponse);
  rpc Transfer(TransferRequest) returns (TransferResponse);
  rpc Convert(ConvertRequest) returns (ConvertResponse);
}

message Money {
  string minor = 1;  // BigInt as string
  string currency = 2;
  string formatted = 3;
}

message GetBalanceRequest {
  string account_id = 1;
}

message BalanceResponse {
  string account_id = 1;
  Money balance = 2;
}

message TransferRequest {
  string from_account = 1;
  string to_account = 2;
  string amount_minor = 3;
  string currency = 4;
  string description = 5;
}

message TransferResponse {
  string transaction_id = 1;
  Money amount = 2;
  Money from_balance = 3;
  Money to_balance = 4;
}

message ConvertRequest {
  string amount_minor = 1;
  string from_currency = 2;
  string to_currency = 3;
}

message ConvertResponse {
  Money from = 1;
  Money to = 2;
  double rate = 3;
}
```

### gRPC Server Implementation

```typescript
// services/grpcServer.ts
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { money, Money, Ledger, Converter } from "monetra";

const packageDefinition = protoLoader.loadSync("proto/money.proto");
const proto = grpc.loadPackageDefinition(packageDefinition) as any;

const ledger = new Ledger({ currency: "USD" });
const converter = new Converter("USD", { EUR: 0.92, GBP: 0.79 });

function serializeMoney(m: Money) {
  return {
    minor: m.minor.toString(),
    currency: m.currency.code,
    formatted: m.format(),
  };
}

const moneyService = {
  getBalance: (call: any, callback: any) => {
    try {
      const balance = ledger.getBalance(call.request.account_id);
      callback(null, {
        account_id: call.request.account_id,
        balance: serializeMoney(balance),
      });
    } catch (error) {
      callback(error);
    }
  },

  transfer: (call: any, callback: any) => {
    try {
      const amount = Money.fromMinor(
        BigInt(call.request.amount_minor),
        call.request.currency
      );

      const txId = ledger.transfer(
        call.request.from_account,
        call.request.to_account,
        amount,
        call.request.description
      );

      callback(null, {
        transaction_id: txId,
        amount: serializeMoney(amount),
        from_balance: serializeMoney(
          ledger.getBalance(call.request.from_account)
        ),
        to_balance: serializeMoney(ledger.getBalance(call.request.to_account)),
      });
    } catch (error) {
      callback(error);
    }
  },

  convert: (call: any, callback: any) => {
    try {
      const from = Money.fromMinor(
        BigInt(call.request.amount_minor),
        call.request.from_currency
      );

      const to = converter.convert(from, call.request.to_currency);

      callback(null, {
        from: serializeMoney(from),
        to: serializeMoney(to),
        rate: converter.getRate(
          call.request.from_currency,
          call.request.to_currency
        ),
      });
    } catch (error) {
      callback(error);
    }
  },
};

const server = new grpc.Server();
server.addService(proto.money.MoneyService.service, moneyService);

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("gRPC server running on port 50051");
  }
);
```

---

## CLI Tools {#cli}

### Money Calculator CLI

```typescript
#!/usr/bin/env node
// bin/money-calc.ts

import { Command } from "commander";
import {
  money,
  Money,
  Converter,
  RoundingMode,
  futureValue,
  presentValue,
  pmt,
  loan,
} from "monetra";

const program = new Command();

program
  .name("money-calc")
  .description("CLI tool for money calculations")
  .version("1.0.0");

// Format money
program
  .command("format <amount> <currency>")
  .description("Format an amount as currency")
  .option("-l, --locale <locale>", "Locale for formatting", "en-US")
  .action((amount, currency, options) => {
    const m = money(amount, currency);
    console.log(m.format({ locale: options.locale }));
  });

// Convert currency
program
  .command("convert <amount> <from> <to>")
  .description("Convert between currencies")
  .requiredOption("-r, --rate <rate>", "Exchange rate")
  .action((amount, from, to, options) => {
    const source = money(amount, from);
    const converter = new Converter(from, { [to]: parseFloat(options.rate) });
    const result = converter.convert(source, to);

    console.log(`${source.format()} = ${result.format()}`);
  });

// Split bill
program
  .command("split <amount> <currency> <ways>")
  .description("Split a bill evenly")
  .action((amount, currency, ways) => {
    const total = money(amount, currency);
    const parts = total.split(parseInt(ways));

    console.log(`Total: ${total.format()}`);
    console.log(`Split ${ways} ways:`);
    parts.forEach((part, i) => {
      console.log(`  Person ${i + 1}: ${part.format()}`);
    });
  });

// Calculate loan payment
program
  .command("loan <principal> <rate> <years>")
  .description("Calculate monthly loan payment")
  .option("-c, --currency <currency>", "Currency code", "USD")
  .action((principal, rate, years, options) => {
    const principalMoney = money(principal, options.currency);
    const monthlyRate = parseFloat(rate) / 100 / 12;
    const months = parseInt(years) * 12;

    const payment = pmt(principalMoney, monthlyRate, months);
    const schedule = loan(principalMoney, monthlyRate, months);

    console.log(`Principal: ${principalMoney.format()}`);
    console.log(`Interest Rate: ${rate}% annual`);
    console.log(`Term: ${years} years (${months} months)`);
    console.log(`Monthly Payment: ${payment.format()}`);
    console.log(`Total Interest: ${schedule.totalInterest.format()}`);
    console.log(`Total Payment: ${schedule.totalPayment.format()}`);
  });

// Future value calculation
program
  .command("fv <principal> <rate> <periods>")
  .description("Calculate future value of an investment")
  .option("-c, --currency <currency>", "Currency code", "USD")
  .action((principal, rate, periods, options) => {
    const principalMoney = money(principal, options.currency);
    const fv = futureValue(
      principalMoney,
      parseFloat(rate) / 100,
      parseInt(periods)
    );

    console.log(`Principal: ${principalMoney.format()}`);
    console.log(`Rate: ${rate}% per period`);
    console.log(`Periods: ${periods}`);
    console.log(`Future Value: ${fv.format()}`);
  });

program.parse();

// Usage examples:
// $ money-calc format 1234.56 USD
// $ money-calc convert 100 USD EUR -r 0.92
// $ money-calc split 100 USD 3
// $ money-calc loan 250000 6.5 30
// $ money-calc fv 10000 5 10
```

### Package.json bin configuration

```json
{
  "name": "money-calc",
  "bin": {
    "money-calc": "./dist/bin/money-calc.js"
  }
}
```

---

## Next Steps

- **[React Examples](./react.md)** - React.js patterns
- **[Vue Examples](./vue.md)** - Vue.js patterns
- **[Best Practices](../best-practices.md)** - Production guidelines
