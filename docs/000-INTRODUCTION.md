# What is Monetra?

## For Everyone (Non-Technical Explanation)

### The Problem with Money in Software

When you type "$10.50" on a calculator, you expect simple math to work. But inside computers, numbers like 10.50 are stored as approximations. This causes tiny errors that can compound into real financial discrepancies:

```
What you expect:   $0.10 + $0.20 = $0.30
What can happen:   $0.10 + $0.20 = $0.30000000000000004
```

In a banking app processing millions of transactions, these tiny errors add up to significant problems—missing cents, audit failures, and unhappy customers.

### The Monetra Solution

Monetra is a software library that handles money the way banks do: **in whole cents (or satoshis, or wei), never in decimals**.

Instead of storing "$10.50", Monetra stores "1050 cents". This eliminates floating-point errors entirely because computers handle whole numbers perfectly.

---

## Who Should Use Monetra?

### Financial Technology (FinTech)

- Payment processors
- Banking applications
- Investment platforms
- Cryptocurrency exchanges

### E-commerce

- Shopping carts and checkout
- Subscription billing
- Multi-currency storefronts
- Tax calculations

### Enterprise

- Accounting systems
- Payroll software
- Expense management
- Financial reporting

### Any Application Handling Money

- If your app deals with money, Monetra helps you do it correctly.

---

## Key Benefits

### 🔒 Financial Accuracy

- **Zero rounding errors**: Uses integer math internally
- **Penny-perfect splitting**: Divide $100 among 3 people without losing a cent
- **Explicit rounding**: When rounding is needed, you choose how—no surprises

### 🌍 Multi-Currency Support

- **ISO 4217 currencies**: USD, EUR, GBP, JPY, and more built-in
- **Cryptocurrency support**: 18-decimal precision for ETH, BTC, and ERC-20 tokens
- **Custom currencies**: Define your own loyalty points, in-game currencies, etc.

### 📊 Built-in Financial Functions

- **Loan calculations**: Monthly payments, amortization schedules
- **Investment analysis**: NPV, IRR, time-value-of-money
- **Interest rate handling**: Type-safe rate conversions

### 📝 Audit-Ready

- **Tamper-evident ledger**: Cryptographic hash chains detect unauthorized changes
- **Transaction history**: Full audit trail with metadata
- **Snapshot/restore**: Backup and verify financial state

### 🔧 Developer-Friendly

- **TypeScript-first**: Full type safety and IntelliSense
- **Zero dependencies**: Nothing extra to install or worry about
- **Works everywhere**: Node.js, browsers, serverless functions

---

## Common Questions

### "We already handle money with regular numbers. What's wrong with that?"

Regular JavaScript numbers work fine for display, but they're dangerous for calculations:

```javascript
// Regular JavaScript
0.1 + 0.2 === 0.3; // false! (it's 0.30000000000000004)

// With Monetra
Money.fromDecimal("0.10", "USD").add("0.20").equals("0.30"); // true
```

### "Can't we just round the results?"

You can, but where do you round? After every operation? Only at the end? Different choices give different results, leading to discrepancies between systems. Monetra makes this explicit—you choose the rounding strategy, and it's documented in your code.

### "Is this just for big enterprise applications?"

No! Monetra is designed for projects of any size. Whether you're building a personal finance tracker or a multi-million dollar payment system, correct money handling matters. Starting with Monetra is easier than fixing bugs later.

### "What about cryptocurrencies?"

Monetra natively supports high-precision tokens. Ethereum uses 18 decimal places, and Monetra handles this correctly:

```typescript
import { ETH } from "monetra";
const amount = Money.fromDecimal("0.000000000000000001", ETH); // 1 wei
```

### "How does the audit ledger work?"

Every transaction is recorded with a cryptographic hash. Each new entry includes the previous entry's hash, creating an unbreakable chain. If anyone tries to modify historical transactions, the chain breaks and `verify()` returns false.

---

## Getting Started

### Installation

```bash
npm install monetra
```

### Basic Usage

```typescript
import { Money } from "monetra";

// Create money from a decimal string
const price = Money.fromDecimal("19.99", "USD");

// Arithmetic
const withTax = price.addPercent(8.25); // Add 8.25% tax
const quantity = 3;
const total = withTax.multiply(quantity);

// Display
console.log(total.format()); // "$64.92"
```

---

## Comparison with Other Approaches

| Approach             | Accuracy       | Type Safety | Audit Trail | Crypto Support |
| -------------------- | -------------- | ----------- | ----------- | -------------- |
| Raw floats           | ❌ Poor        | ❌ No       | ❌ No       | ❌ No          |
| String concatenation | ⚠️ Error-prone | ❌ No       | ❌ No       | ❌ No          |
| Decimal.js           | ✅ Good        | ⚠️ Partial  | ❌ No       | ⚠️ Limited     |
| Dinero.js            | ✅ Good        | ⚠️ Partial  | ❌ No       | ❌ No          |
| **Monetra**          | ✅ Excellent   | ✅ Full     | ✅ Built-in | ✅ Native      |

---

## Trust & Reliability

- **Open Source**: Full source code available for audit
- **Tested**: Comprehensive unit tests and property-based testing
- **No Hidden State**: All operations are explicit and predictable
- **Zero Dependencies**: No supply chain risk from third-party packages

---

## Next Steps

- **Developers**: Read the [Quick Start Guide](../README.md#quick-start)
- **Technical Deep-Dive**: Explore the [Core Concepts](./001-CORE-CONCEPTS.md)
- **Examples**: Check out the [Cookbook](./007-COOKBOOK.md)
- **API Reference**: See the [Full API Documentation](./005-API-REFERENCE.md)

---

## Summary

Monetra is a library that makes handling money in software **safe, accurate, and auditable**. It prevents the tiny errors that cause big problems, supports multiple currencies including cryptocurrency, and provides built-in tools for financial calculations and audit trails.

**If your application handles money, Monetra helps you do it right.**
