# Financial Math

The Financial module provides standard financial formulas for loan amortization, investment analysis, and compound interest calculations.

## Installation

```typescript
import { pmt } from "monetra/financial"; // Loan functions
import { futureValue, presentValue } from "monetra/financial"; // TVM functions
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
const rate = 0.05; // 5% annual
const periods = 36; // 3 years

const monthlyPayment = pmt({
  annualRate: rate,
  periods: periods,
  principal: principal,
  periodsPerYear: 12
});
console.log(monthlyPayment.format()); // "$304.17"
```

## Time Value of Money (TVM)

### Future Value (FV)

Calculate the future value of an investment.

```typescript
import { futureValue } from "monetra/financial";

const presentValue = Money.fromMajor("1000", USD);
const rate = 0.05; // 5%
const years = 10; // 10 years

const futureVal = futureValue(presentValue, {
  rate,
  years
});
console.log(futureVal.format()); // "$1,628.89"
```

### Present Value (PV)

Calculate the present value of a future sum.

```typescript
import { presentValue } from "monetra/financial";

const futureVal = Money.fromMajor("10000", USD);
const presentVal = presentValue(futureVal, {
  rate: 0.05,
  years: 10
});
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
