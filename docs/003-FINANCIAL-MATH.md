# Financial Math

The Financial module provides standard financial formulas for loan amortization, investment analysis, and compound interest calculations.

## Installation

```typescript
import { pmt, ipmt, ppmt } from "monetra/financial"; // Loan functions
import { fv, pv } from "monetra/financial"; // TVM functions
import { npv, irr } from "monetra/financial"; // Investment functions
```

## Loan Amortization

Calculate payments for loans.

### PMT (Payment)

Calculate the total payment for a period.

```typescript
import { pmt } from "monetra/financial";
import { Money } from "monetra";
import { USD } from "monetra/currency";

const principal = Money.fromMajor("10000", USD);
const rate = 0.05 / 12; // Monthly rate (5% annual)
const periods = 36; // 3 years

const monthlyPayment = pmt(rate, periods, principal);
console.log(monthlyPayment.format()); // "$304.17"
```

### IPMT (Interest Payment) & PPMT (Principal Payment)

Calculate the interest and principal portions of a specific payment.

```typescript
import { ipmt, ppmt } from "monetra/financial";

const period = 1; // First payment

const interest = ipmt(rate, period, periods, principal);
const principalPortion = ppmt(rate, period, periods, principal);

console.log(`Interest: ${interest.format()}`);
console.log(`Principal: ${principalPortion.format()}`);
```

## Time Value of Money (TVM)

### Future Value (FV)

Calculate the future value of an investment.

```typescript
import { fv } from "monetra/financial";

const presentValue = Money.fromMajor("1000", USD);
const rate = 0.05; // 5%
const periods = 10; // 10 years

const futureVal = fv(rate, periods, presentValue);
console.log(futureVal.format()); // "$1,628.89"
```

### Present Value (PV)

Calculate the present value of a future sum.

```typescript
import { pv } from "monetra/financial";

const futureValue = Money.fromMajor("10000", USD);
const presentVal = pv(rate, periods, futureValue);
```

## Investment Analysis

### Net Present Value (NPV)

Calculate the net present value of a series of cash flows.

```typescript
import { npv } from "monetra/financial";

const cashFlows = [
  Money.fromMajor("-1000", USD), // Initial investment
  Money.fromMajor("200", USD),
  Money.fromMajor("300", USD),
  Money.fromMajor("500", USD)
];

const netValue = npv(0.1, cashFlows); // 10% discount rate
```

### Internal Rate of Return (IRR)

Calculate the internal rate of return for a series of cash flows.

```typescript
import { irr } from "monetra/financial";

const rate = irr(cashFlows);
console.log(`IRR: ${(rate * 100).toFixed(2)}%`);
```

## Next Steps

- [Tokens & Crypto](004-TOKENS-AND-CRYPTO.md)
