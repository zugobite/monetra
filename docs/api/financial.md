# Financial API Reference

Monetra provides financial calculation functions for compound interest, loan amortization, and investment analysis using integer-based arithmetic.

---

## Table of Contents

- [Compound Interest](#compound)
  - [futureValue()](#futurevalue)
  - [presentValue()](#presentvalue)
- [Simple Interest](#simple)
  - [simpleInterest()](#simpleinterest)
  - [simpleInterestTotal()](#simpleinteresttotal)
- [Loan Calculations](#loans)
  - [pmt()](#pmt)
  - [loan()](#loan)
- [Investment Analysis](#investment)
  - [roi()](#roi)
  - [currentYield()](#currentyield)
  - [npv()](#npv)
  - [irr()](#irr)
- [Rate Utilities](#rates)

---

## Compound Interest {#compound}

### futureValue() {#futurevalue}

Calculates the future value of an investment with compound interest.

**Formula:** $FV = PV \times (1 + \frac{r}{n})^{n \times t}$

```typescript
function futureValue(
  presentValue: Money,
  options: {
    rate: number; // Annual interest rate (e.g., 0.07 for 7%)
    years: number; // Investment period
    compoundingPerYear?: number; // Compounding frequency (default: 12)
    rounding?: RoundingMode; // Rounding strategy (default: HALF_EVEN)
  }
): Money;
```

**Alias:** `compound()`

**Parameters:**

- `presentValue` - Initial investment amount
- `options.rate` - Annual interest rate as decimal
- `options.years` - Investment duration in years
- `options.compoundingPerYear` - How often interest compounds (default: 12)
- `options.rounding` - Rounding mode for calculations

**Returns:** Future value as `Money`

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { money, futureValue, RoundingMode } from "monetra";

const principal = money("10000.00", "USD");

// 7% annual interest, compounded monthly, for 10 years
const future = futureValue(principal, {
  rate: 0.07,
  years: 10,
  compoundingPerYear: 12,
});
console.log(future.format()); // "$20,096.61"

// Compare compounding frequencies
const yearly = futureValue(principal, {
  rate: 0.07,
  years: 10,
  compoundingPerYear: 1,
});
const quarterly = futureValue(principal, {
  rate: 0.07,
  years: 10,
  compoundingPerYear: 4,
});
const monthly = futureValue(principal, {
  rate: 0.07,
  years: 10,
  compoundingPerYear: 12,
});
const daily = futureValue(principal, {
  rate: 0.07,
  years: 10,
  compoundingPerYear: 365,
});

console.log("Yearly:   ", yearly.format()); // "$19,671.51"
console.log("Quarterly:", quarterly.format()); // "$19,931.62"
console.log("Monthly:  ", monthly.format()); // "$20,096.61"
console.log("Daily:    ", daily.format()); // "$20,137.53"
```

</details>

<details>
<summary><strong>JavaScript (ESM)</strong></summary>

```javascript
import { money, futureValue } from "monetra";

const principal = money("5000.00", "USD");

// How much will $5,000 grow to in 5 years at 5% interest?
const result = futureValue(principal, {
  rate: 0.05,
  years: 5,
});
console.log(`$5,000 becomes ${result.format()} after 5 years`);
// "$5,000 becomes $6,416.79 after 5 years"
```

</details>

<details>
<summary><strong>React.js</strong></summary>

```tsx
import React, { useState, useMemo } from "react";
import { money, futureValue, Money } from "monetra";

function InvestmentCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("10");

  const result = useMemo(() => {
    try {
      const pv = money(principal, "USD");
      return futureValue(pv, {
        rate: parseFloat(rate) / 100,
        years: parseInt(years),
      });
    } catch {
      return null;
    }
  }, [principal, rate, years]);

  return (
    <div className="calculator">
      <h2>Investment Growth Calculator</h2>

      <label>
        Principal: $
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
        />
      </label>

      <label>
        Annual Rate:
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        %
      </label>

      <label>
        Years:
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
      </label>

      {result && (
        <div className="result">
          <strong>Future Value: {result.format()}</strong>
        </div>
      )}
    </div>
  );
}
```

</details>

<details>
<summary><strong>Vue.js</strong></summary>

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { money, futureValue } from "monetra";

const principal = ref("10000");
const rate = ref("7");
const years = ref("10");

const result = computed(() => {
  try {
    const pv = money(principal.value, "USD");
    return futureValue(pv, {
      rate: parseFloat(rate.value) / 100,
      years: parseInt(years.value),
    });
  } catch {
    return null;
  }
});
</script>

<template>
  <div class="calculator">
    <h2>Investment Calculator</h2>
    <div>
      <label>Principal: $<input v-model="principal" type="number" /></label>
    </div>
    <div>
      <label>Rate: <input v-model="rate" type="number" />%</label>
    </div>
    <div>
      <label>Years: <input v-model="years" type="number" /></label>
    </div>
    <div v-if="result">
      <strong>Future Value: {{ result.format() }}</strong>
    </div>
  </div>
</template>
```

</details>

<details>
<summary><strong>Node.js</strong></summary>

```javascript
import { money, futureValue } from "monetra";

// Retirement planning endpoint
app.get("/api/retirement/projection", (req, res) => {
  const {
    currentSavings,
    annualContribution,
    yearsToRetirement,
    expectedReturn,
  } = req.query;

  const current = money(currentSavings, "USD");
  const rate = parseFloat(expectedReturn) / 100;
  const years = parseInt(yearsToRetirement);

  // Project growth of current savings
  const currentGrowth = futureValue(current, { rate, years });

  // Calculate future value of annual contributions (annuity)
  // For simplicity, we'll sum yearly contributions with their growth
  let contributionsGrowth = Money.zero("USD");
  const annualAmount = money(annualContribution, "USD");

  for (let y = 0; y < years; y++) {
    const yearsToGrow = years - y;
    contributionsGrowth = contributionsGrowth.add(
      futureValue(annualAmount, { rate, years: yearsToGrow })
    );
  }

  const totalProjected = currentGrowth.add(contributionsGrowth);

  res.json({
    currentSavingsGrowth: currentGrowth.format(),
    contributionsGrowth: contributionsGrowth.format(),
    totalProjected: totalProjected.format(),
  });
});
```

</details>

---

### presentValue() {#presentvalue}

Calculates the present value of a future amount (discounting).

**Formula:** $PV = \frac{FV}{(1 + \frac{r}{n})^{n \times t}}$

```typescript
function presentValue(
  futureValue: Money,
  options: {
    rate: number;
    years: number;
    compoundingPerYear?: number;
    rounding?: RoundingMode;
  }
): Money;
```

**Alias:** `discount()`

**Parameters:**

- `futureValue` - Target future amount
- `options` - Same as `futureValue()`

**Returns:** Present value as `Money`

**Examples:**

```typescript
import { money, presentValue } from "monetra";

// How much do I need to invest today to have $100,000 in 20 years?
const target = money("100000.00", "USD");
const needed = presentValue(target, {
  rate: 0.06, // 6% expected return
  years: 20,
});
console.log(needed.format()); // "$31,180.47"

// If you want $1,000,000 at retirement in 30 years...
const million = money("1000000.00", "USD");
const todayNeed = presentValue(million, {
  rate: 0.07,
  years: 30,
});
console.log(`Invest ${todayNeed.format()} today to become a millionaire`);
// "Invest $131,367.12 today to become a millionaire"
```

---

## Simple Interest {#simple}

Simple interest calculations for short-term loans and basic interest computations.

### simpleInterest() {#simpleinterest}

Calculates the simple interest earned on a principal amount.

**Formula:** $Interest = P \times r \times t$

```typescript
function simpleInterest(
  principal: Money,
  options: {
    rate: Rate; // Annual interest rate
    years: number; // Time period in years
    rounding?: RoundingMode; // Rounding strategy (default: HALF_EVEN)
  }
): Money;
```

**Parameters:**

- `principal` - The principal amount as Money
- `options.rate` - Annual interest rate as Rate object
- `options.years` - Time period in years (can be fractional)
- `options.rounding` - Rounding mode for calculations

**Returns:** Interest amount as `Money`

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { Money, Rate, simpleInterest } from "monetra";

const principal = Money.fromMajor("1000.00", "USD");
const rate = Rate.percent(5); // 5% annual rate

// Calculate interest for 2 years
const interest = simpleInterest(principal, { rate, years: 2 });
console.log(interest.format()); // "$100.00"

// Short-term loan: 6 months at 8% annual rate
const shortTerm = simpleInterest(principal, {
  rate: Rate.percent(8),
  years: 0.5, // 6 months
});
console.log(shortTerm.format()); // "$40.00"

// Bond accrued interest between coupon payments
const bondPrincipal = Money.fromMajor("10000.00", "USD");
const accruedInterest = simpleInterest(bondPrincipal, {
  rate: Rate.percent(4.5),
  years: 91 / 365, // 91 days between payments
});
console.log(accruedInterest.format()); // "$112.47"
```

</details>

### simpleInterestTotal() {#simpleinteresttotal}

Calculates the total amount (principal + simple interest).

**Formula:** $Total = P \times (1 + r \times t)$

```typescript
function simpleInterestTotal(
  principal: Money,
  options: {
    rate: Rate; // Annual interest rate
    years: number; // Time period in years
    rounding?: RoundingMode; // Rounding strategy (default: HALF_EVEN)
  }
): Money;
```

**Parameters:**

- `principal` - The principal amount as Money
- `options.rate` - Annual interest rate as Rate object
- `options.years` - Time period in years (can be fractional)
- `options.rounding` - Rounding mode for calculations

**Returns:** Total amount (principal + interest) as `Money`

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { Money, Rate, simpleInterestTotal } from "monetra";

const principal = Money.fromMajor("1000.00", "USD");
const rate = Rate.percent(5);

// Total amount after 2 years
const total = simpleInterestTotal(principal, { rate, years: 2 });
console.log(total.format()); // "$1,100.00"

// Compare simple vs compound interest
const simpleTotal = simpleInterestTotal(principal, {
  rate: Rate.percent(7),
  years: 10,
});
const compoundTotal = futureValue(principal, {
  rate: 0.07,
  years: 10,
  compoundingPerYear: 1,
});

console.log("Simple:  ", simpleTotal.format()); // "$1,700.00"
console.log("Compound:", compoundTotal.format()); // "$1,967.15"

// Relationship verification
const interest = simpleInterest(principal, { rate, years: 2 });
const totalCheck = principal.add(interest);
const directTotal = simpleInterestTotal(principal, { rate, years: 2 });

console.log(totalCheck.equals(directTotal)); // true
```

</details>

---

## Loan Calculations {#loans}

### pmt() {#pmt}

Calculates the periodic payment amount for a loan.

**Formula:** $PMT = P \times \frac{r(1+r)^n}{(1+r)^n - 1}$

```typescript
function pmt(options: {
  principal: Money; // Loan amount
  annualRate: number; // Annual interest rate (e.g., 0.05 for 5%)
  periods: number; // Total number of payments
  periodsPerYear?: number; // Payments per year (default: 12)
  rounding?: RoundingMode; // Rounding strategy
}): Money;
```

**Parameters:**

- `principal` - Loan amount
- `annualRate` - Annual interest rate as decimal
- `periods` - Total number of payment periods
- `periodsPerYear` - Payments per year (12 = monthly, 52 = weekly)
- `rounding` - Rounding mode

**Returns:** Payment amount as `Money`

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { money, pmt, RoundingMode } from "monetra";

// Mortgage: $250,000 at 6.5% for 30 years
const mortgage = pmt({
  principal: money("250000.00", "USD"),
  annualRate: 0.065,
  periods: 360, // 30 years * 12 months
  periodsPerYear: 12,
});
console.log(`Monthly mortgage payment: ${mortgage.format()}`);
// "Monthly mortgage payment: $1,580.17"

// Car loan: $35,000 at 7% for 5 years
const carPayment = pmt({
  principal: money("35000.00", "USD"),
  annualRate: 0.07,
  periods: 60, // 5 years * 12 months
});
console.log(`Monthly car payment: ${carPayment.format()}`);
// "Monthly car payment: $693.02"

// Interest-free financing
const zeroInterest = pmt({
  principal: money("1200.00", "USD"),
  annualRate: 0,
  periods: 12,
});
console.log(`Monthly (0% APR): ${zeroInterest.format()}`);
// "Monthly (0% APR): $100.00"
```

</details>

<details>
<summary><strong>React.js</strong></summary>

```tsx
import React, { useState, useMemo } from "react";
import { money, pmt } from "monetra";

function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState("250000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTermYears, setLoanTermYears] = useState("30");

  const monthlyPayment = useMemo(() => {
    try {
      return pmt({
        principal: money(loanAmount, "USD"),
        annualRate: parseFloat(interestRate) / 100,
        periods: parseInt(loanTermYears) * 12,
      });
    } catch {
      return null;
    }
  }, [loanAmount, interestRate, loanTermYears]);

  const totalCost = monthlyPayment
    ? monthlyPayment.multiply(parseInt(loanTermYears) * 12)
    : null;

  const totalInterest =
    totalCost && loanAmount
      ? totalCost.subtract(money(loanAmount, "USD"))
      : null;

  return (
    <div className="mortgage-calc">
      <h2>Mortgage Calculator</h2>

      <div className="inputs">
        <label>
          Loan Amount: $
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
        </label>

        <label>
          Interest Rate:
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
          %
        </label>

        <label>
          Term:
          <select
            value={loanTermYears}
            onChange={(e) => setLoanTermYears(e.target.value)}
          >
            <option value="15">15 years</option>
            <option value="20">20 years</option>
            <option value="30">30 years</option>
          </select>
        </label>
      </div>

      {monthlyPayment && (
        <div className="results">
          <div className="monthly">
            <span>Monthly Payment</span>
            <strong>{monthlyPayment.format()}</strong>
          </div>
          <div className="total-interest">
            <span>Total Interest</span>
            <strong>{totalInterest?.format()}</strong>
          </div>
          <div className="total-cost">
            <span>Total Cost</span>
            <strong>{totalCost?.format()}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
```

</details>

---

### loan() {#loan}

Generates a complete loan amortization schedule.

```typescript
function loan(options: {
  principal: Money;
  annualRate: number;
  periods: number;
  periodsPerYear?: number;
  rounding?: RoundingMode;
}): LoanScheduleEntry[];
```

**Returns:** Array of `LoanScheduleEntry` objects

```typescript
interface LoanScheduleEntry {
  period: number; // Payment number (1, 2, 3, ...)
  payment: Money; // Total payment amount
  principal: Money; // Principal portion of payment
  interest: Money; // Interest portion of payment
  balance: Money; // Remaining balance after payment
}
```

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { money, loan } from "monetra";

// Generate amortization schedule for $10,000 loan at 5% for 12 months
const schedule = loan({
  principal: money("10000.00", "USD"),
  annualRate: 0.05,
  periods: 12,
});

// Print schedule
console.log("Period | Payment   | Principal | Interest | Balance");
console.log("-------|-----------|-----------|----------|----------");

schedule.forEach((entry) => {
  console.log(
    `${String(entry.period).padStart(6)} | ` +
      `${entry.payment.format().padStart(9)} | ` +
      `${entry.principal.format().padStart(9)} | ` +
      `${entry.interest.format().padStart(8)} | ` +
      `${entry.balance.format().padStart(9)}`
  );
});

/*
Period | Payment   | Principal | Interest | Balance
-------|-----------|-----------|----------|----------
     1 |   $856.07 |   $814.40 |   $41.67 | $9,185.60
     2 |   $856.07 |   $817.80 |   $38.27 | $8,367.80
     3 |   $856.07 |   $821.21 |   $34.87 | $7,546.59
   ...
    12 |   $856.07 |   $852.52 |    $3.55 |     $0.00
*/

// Summary statistics
const totalPayments = schedule.reduce(
  (sum, e) => sum.add(e.payment),
  Money.zero("USD")
);
const totalInterest = schedule.reduce(
  (sum, e) => sum.add(e.interest),
  Money.zero("USD")
);

console.log(`Total Payments: ${totalPayments.format()}`);
console.log(`Total Interest: ${totalInterest.format()}`);
```

</details>

<details>
<summary><strong>Node.js</strong></summary>

```javascript
import { money, loan, Money } from "monetra";
import express from "express";

const app = express();

app.get("/api/loan/amortization", (req, res) => {
  const { principal, rate, months } = req.query;

  const schedule = loan({
    principal: money(principal, "USD"),
    annualRate: parseFloat(rate) / 100,
    periods: parseInt(months),
  });

  // Calculate summary
  const totalPrincipal = money(principal, "USD");
  const totalInterest = schedule.reduce(
    (sum, e) => sum.add(e.interest),
    Money.zero("USD")
  );
  const totalCost = totalPrincipal.add(totalInterest);

  res.json({
    monthlyPayment: schedule[0].payment.format(),
    summary: {
      principal: totalPrincipal.format(),
      totalInterest: totalInterest.format(),
      totalCost: totalCost.format(),
      numberOfPayments: schedule.length,
    },
    schedule: schedule.map((entry) => ({
      period: entry.period,
      payment: entry.payment.format(),
      principal: entry.principal.format(),
      interest: entry.interest.format(),
      balance: entry.balance.format(),
    })),
  });
});
```

</details>

<details>
<summary><strong>Vue.js</strong></summary>

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { money, loan, Money } from "monetra";

const principal = ref("10000");
const rate = ref("5");
const months = ref("12");

const schedule = computed(() => {
  try {
    return loan({
      principal: money(principal.value, "USD"),
      annualRate: parseFloat(rate.value) / 100,
      periods: parseInt(months.value),
    });
  } catch {
    return [];
  }
});

const totalInterest = computed(() =>
  schedule.value.reduce((sum, e) => sum.add(e.interest), Money.zero("USD"))
);
</script>

<template>
  <div class="amortization">
    <h2>Loan Amortization</h2>

    <div class="inputs">
      <input v-model="principal" placeholder="Principal" type="number" />
      <input v-model="rate" placeholder="Rate %" type="number" step="0.1" />
      <input v-model="months" placeholder="Months" type="number" />
    </div>

    <div v-if="schedule.length" class="summary">
      <p>Monthly Payment: {{ schedule[0].payment.format() }}</p>
      <p>Total Interest: {{ totalInterest.format() }}</p>
    </div>

    <table v-if="schedule.length">
      <thead>
        <tr>
          <th>#</th>
          <th>Payment</th>
          <th>Principal</th>
          <th>Interest</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in schedule" :key="entry.period">
          <td>{{ entry.period }}</td>
          <td>{{ entry.payment.format() }}</td>
          <td>{{ entry.principal.format() }}</td>
          <td>{{ entry.interest.format() }}</td>
          <td>{{ entry.balance.format() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

</details>

---

### totalInterest() {#totalinterest}

Calculates the total interest paid over the life of a loan using the payment formula.

**Formula:** $\text{Total Interest} = (PMT \times n) - P$

```typescript
function totalInterest(options: {
  principal: Money; // Loan amount
  annualRate: number; // Annual interest rate (e.g., 0.05 for 5%)
  periods: number; // Total number of payments
  periodsPerYear?: number; // Payments per year (default: 12)
  rounding?: RoundingMode; // Rounding strategy
}): Money;
```

**Parameters:**

- `principal` - Loan amount
- `annualRate` - Annual interest rate as decimal
- `periods` - Total number of payment periods
- `periodsPerYear` - Payments per year (12 = monthly, 52 = weekly)
- `rounding` - Rounding mode

**Returns:** Total interest as `Money`

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { money, totalInterest } from "monetra";

// Calculate total interest on a $10,000 loan at 5% for 12 months
const interest = totalInterest({
  principal: money("10000.00", "USD"),
  annualRate: 0.05,
  periods: 12,
});
console.log(`Total interest: ${interest.format()}`); // "Total interest: $272.84"

// Compare loan offers
const offer1 = totalInterest({
  principal: money("25000.00", "USD"),
  annualRate: 0.049, // 4.9%
  periods: 60,
});
const offer2 = totalInterest({
  principal: money("25000.00", "USD"),
  annualRate: 0.059, // 5.9%
  periods: 48,
});

console.log(`Offer 1 (4.9% / 60 mo): ${offer1.format()}`);
console.log(`Offer 2 (5.9% / 48 mo): ${offer2.format()}`);
// Compare to find the cheaper option
```

</details>

<details>
<summary><strong>JavaScript (ESM)</strong></summary>

```javascript
import { money, totalInterest } from "monetra";

// Zero-interest loan returns zero
const zeroInterest = totalInterest({
  principal: money("5000.00", "USD"),
  annualRate: 0,
  periods: 24,
});
console.log(`Interest on 0% loan: ${zeroInterest.format()}`); // "$0.00"
```

</details>

---

### totalInterestFromSchedule() {#totalinterestfromschedule}

Sums the interest column from an existing loan amortization schedule.

```typescript
function totalInterestFromSchedule(schedule: LoanScheduleEntry[]): Money;
```

**Parameters:**

- `schedule` - Array of `LoanScheduleEntry` objects from `loan()`

**Returns:** Total interest as `Money`

**Throws:** `Error` if schedule is empty

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { money, loan, totalInterestFromSchedule } from "monetra";

// Generate schedule then calculate total interest
const schedule = loan({
  principal: money("10000.00", "USD"),
  annualRate: 0.05,
  periods: 12,
});

const interest = totalInterestFromSchedule(schedule);
console.log(`Total interest from schedule: ${interest.format()}`);
// "Total interest from schedule: $272.84"
```

</details>

::: tip When to use which?

- Use `totalInterest()` for a quick calculation without generating a full schedule
- Use `totalInterestFromSchedule()` when you already have a schedule and need the interest total
  :::

---

## Investment Analysis {#investment}

### roi() {#roi}

Calculates the Return on Investment (ROI).

**Formula:** $ROI = \frac{Final Value - Initial Value}{Initial Value}$

```typescript
function roi(initialValue: Money, finalValue: Money): number;
```

**Parameters:**

- `initialValue` - The initial investment cost
- `finalValue` - The final value of the investment

**Returns:** ROI as a decimal (e.g., 0.15 for 15%)

**Examples:**

```typescript
import { money, roi } from "monetra";

const initial = money("1000.00", "USD");
const final = money("1150.00", "USD");

const result = roi(initial, final);
console.log(`ROI: ${(result * 100).toFixed(2)}%`); // "ROI: 15.00%"
```

### currentYield() {#currentyield}

Calculates the Current Yield of a bond.

**Formula:** $Current Yield = \frac{Annual Coupon Payment}{Current Market Price}$

```typescript
function currentYield(annualCoupon: Money, currentPrice: Money): number;
```

**Parameters:**

- `annualCoupon` - The total annual coupon payment
- `currentPrice` - The current market price of the bond

**Returns:** Current yield as a decimal (e.g., 0.05 for 5%)

**Throws:**

- `CurrencyMismatchError` if currencies differ
- `InvalidArgumentError` if price is zero or negative

**Examples:**

```typescript
import { money, currentYield } from "monetra";

const coupon = money("50.00", "USD");
const price = money("980.00", "USD");

const yield = currentYield(coupon, price);
console.log(`Current Yield: ${(yield * 100).toFixed(2)}%`); // "Current Yield: 5.10%"
```

### npv() {#npv}

Calculates the Net Present Value of a series of cash flows.

**Formula:** $NPV = \sum_{t=0}^{n} \frac{CF_t}{(1+r)^t}$

```typescript
function npv(discountRate: number, cashFlows: Money[]): Money;
```

**Parameters:**

- `discountRate` - Discount rate as decimal (e.g., 0.10 for 10%)
- `cashFlows` - Array of cash flows (first is typically negative - initial investment)

**Returns:** Net Present Value as `Money`

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { money, npv } from "monetra";

// Investment: -$100,000 initial, then $30,000/year for 5 years
const cashFlows = [
  money("-100000", "USD"), // Initial investment (Year 0)
  money("30000", "USD"), // Year 1
  money("30000", "USD"), // Year 2
  money("35000", "USD"), // Year 3
  money("35000", "USD"), // Year 4
  money("40000", "USD"), // Year 5
];

// NPV at 10% discount rate
const netPV = npv(0.1, cashFlows);
console.log(`NPV: ${netPV.format()}`); // "NPV: $26,373.42"

// If NPV > 0, the investment is expected to be profitable
if (netPV.isPositive()) {
  console.log("Investment is attractive!");
}

// Compare different discount rates
const npv8 = npv(0.08, cashFlows);
const npv12 = npv(0.12, cashFlows);
const npv15 = npv(0.15, cashFlows);

console.log(`NPV at 8%:  ${npv8.format()}`); // "$35,487.12"
console.log(`NPV at 12%: ${npv12.format()}`); // "$18,159.74"
console.log(`NPV at 15%: ${npv15.format()}`); // "$8,234.92"
```

</details>

<details>
<summary><strong>JavaScript (ESM)</strong></summary>

```javascript
import { money, npv } from "monetra";

// Real estate investment analysis
const initialCost = money("-500000", "USD");
const yearlyRent = money("60000", "USD");
const salePrice = money("650000", "USD");

// 10-year holding period
const cashFlows = [
  initialCost,
  ...Array(9).fill(yearlyRent),
  yearlyRent.add(salePrice), // Year 10: rent + sale
];

const investmentNPV = npv(0.08, cashFlows);
console.log(`Investment NPV: ${investmentNPV.format()}`);
```

</details>

<details>
<summary><strong>Node.js</strong></summary>

```javascript
import { money, npv, Money } from "monetra";

// API endpoint for investment analysis
app.post("/api/investments/analyze", (req, res) => {
  const { initialInvestment, projectedReturns, discountRate } = req.body;

  const cashFlows = [
    money(initialInvestment, "USD").negate(),
    ...projectedReturns.map((r) => money(r, "USD")),
  ];

  const result = npv(discountRate, cashFlows);

  res.json({
    npv: result.format(),
    isPositive: result.isPositive(),
    recommendation: result.isPositive()
      ? "Investment appears profitable"
      : "Investment may not meet return requirements",
  });
});
```

</details>

---

### irr() {#irr}

Calculates the Internal Rate of Return for a series of cash flows.

```typescript
function irr(cashFlows: Money[], guess?: number): number;
```

**Parameters:**

- `cashFlows` - Array of cash flows (must have at least one sign change)
- `guess` - Initial guess for IRR (default: 0.1)

**Returns:** IRR as a decimal (e.g., 0.15 for 15%)

**Throws:** Error if IRR doesn't converge (uncommon cash flow patterns)

**Examples:**

<details open>
<summary><strong>TypeScript</strong></summary>

```typescript
import { money, irr, npv } from "monetra";

// Same investment as NPV example
const cashFlows = [
  money("-100000", "USD"), // Initial investment
  money("30000", "USD"), // Year 1
  money("30000", "USD"), // Year 2
  money("35000", "USD"), // Year 3
  money("35000", "USD"), // Year 4
  money("40000", "USD"), // Year 5
];

const internalRate = irr(cashFlows);
console.log(`IRR: ${(internalRate * 100).toFixed(2)}%`); // "IRR: 21.04%"

// Verify: NPV at IRR should be approximately 0
const verification = npv(internalRate, cashFlows);
console.log(`NPV at IRR: ${verification.format()}`); // "$0.00" (or very close)

// Decision rule: If IRR > required rate of return, accept
const requiredReturn = 0.15;
if (internalRate > requiredReturn) {
  console.log("Investment exceeds required return!");
}
```

</details>

<details>
<summary><strong>React.js</strong></summary>

```tsx
import React, { useState, useMemo } from "react";
import { money, irr, npv } from "monetra";

function IRRCalculator() {
  const [initialInvestment, setInitialInvestment] = useState("100000");
  const [annualReturns, setAnnualReturns] = useState([
    "30000",
    "30000",
    "35000",
    "35000",
    "40000",
  ]);

  const result = useMemo(() => {
    try {
      const cashFlows = [
        money(initialInvestment, "USD").negate(),
        ...annualReturns.filter((r) => r).map((r) => money(r, "USD")),
      ];

      const rate = irr(cashFlows);
      const netPV = npv(0.1, cashFlows);

      return { irr: rate, npv: netPV };
    } catch (e) {
      return null;
    }
  }, [initialInvestment, annualReturns]);

  const updateReturn = (index: number, value: string) => {
    const updated = [...annualReturns];
    updated[index] = value;
    setAnnualReturns(updated);
  };

  const addYear = () => setAnnualReturns([...annualReturns, ""]);

  return (
    <div className="irr-calculator">
      <h2>IRR Calculator</h2>

      <label>
        Initial Investment: $
        <input
          type="number"
          value={initialInvestment}
          onChange={(e) => setInitialInvestment(e.target.value)}
        />
      </label>

      <h3>Projected Annual Returns</h3>
      {annualReturns.map((ret, i) => (
        <label key={i}>
          Year {i + 1}: $
          <input
            type="number"
            value={ret}
            onChange={(e) => updateReturn(i, e.target.value)}
          />
        </label>
      ))}
      <button onClick={addYear}>+ Add Year</button>

      {result && (
        <div className="results">
          <p>
            <strong>IRR: {(result.irr * 100).toFixed(2)}%</strong>
          </p>
          <p>NPV (at 10%): {result.npv.format()}</p>
        </div>
      )}
    </div>
  );
}
```

</details>

---

## Rate Utilities {#rates}

Monetra includes utilities for rate conversions:

```typescript
import { money, futureValue } from "monetra";

// Converting between rate frequencies
function effectiveAnnualRate(
  nominalRate: number,
  compoundingsPerYear: number
): number {
  return (
    Math.pow(1 + nominalRate / compoundingsPerYear, compoundingsPerYear) - 1
  );
}

// 6% nominal compounded monthly → effective annual rate
const ear = effectiveAnnualRate(0.06, 12);
console.log(`Effective Annual Rate: ${(ear * 100).toFixed(3)}%`); // "6.168%"

// Real vs Nominal rates (Fisher equation)
function realRate(nominalRate: number, inflationRate: number): number {
  return (1 + nominalRate) / (1 + inflationRate) - 1;
}

const nominal = 0.08;
const inflation = 0.03;
const real = realRate(nominal, inflation);
console.log(`Real return: ${(real * 100).toFixed(2)}%`); // "4.85%"
```

---

## Best Practices

### Use Consistent Periods

```typescript
// Good: Matching periods
const monthly = pmt({
  principal: money("100000", "USD"),
  annualRate: 0.06,
  periods: 360, // 30 years * 12 months
  periodsPerYear: 12, // Monthly payments
});

// Bad: Mismatched periods
const wrong = pmt({
  principal: money("100000", "USD"),
  annualRate: 0.06,
  periods: 30, // Years, not months!
  periodsPerYear: 12, // Mismatch!
});
```

### Handle Negative NPV

```typescript
import { money, npv } from "monetra";

function evaluateInvestment(cashFlows: Money[], requiredReturn: number) {
  const netPV = npv(requiredReturn, cashFlows);

  return {
    npv: netPV.format(),
    decision: netPV.isPositive() ? "ACCEPT" : "REJECT",
    margin: netPV.isPositive()
      ? `Exceeds threshold by ${netPV.format()}`
      : `Falls short by ${netPV.abs().format()}`,
  };
}
```

### Validate Inputs

```typescript
function calculateMortgage(principalStr: string, rate: number, years: number) {
  // Validate rate is reasonable
  if (rate < 0 || rate > 1) {
    throw new Error("Rate should be decimal (e.g., 0.065 for 6.5%)");
  }

  // Validate term
  if (years <= 0 || years > 50) {
    throw new Error("Invalid loan term");
  }

  return pmt({
    principal: money(principalStr, "USD"),
    annualRate: rate,
    periods: years * 12,
  });
}
```

---

## Next Steps

- **[Currency & Tokens](./currency.md)** - Custom currencies and crypto
- **[Best Practices](../best-practices.md)** - Production patterns
- **[Allocation Guide](../guides/allocation.md)** - Splitting payments
