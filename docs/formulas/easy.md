# 🎯 Easy Financial Formulas - Quick Wins

This document contains all **easy-level** financial formulas that can be implemented quickly for maximum impact. These are foundational calculations with straightforward implementations.

---

## ✅ Already Implemented

### Rate Management

#### 1. Rate Class

- **Purpose**: Type-safe representation of interest rates
- **Formula**: Rate as decimal or percentage with precision
- **Operations**: Addition, subtraction, multiplication, division
- **Conversions**: `percent()`, `decimal()`, `periodic()`

#### 2. Periodic Rate Conversion

- **Purpose**: Convert annual rate to periodic rate
- **Formula**: `Periodic Rate = Annual Rate / Periods Per Year`
- **Example**: 12% annual → 1% monthly (12 periods/year)

### Time Value of Money

#### 3. Future Value with Compound Interest

- **Function**: `futureValue(presentValue, options)`
- **Formula**: `FV = PV × (1 + r/n)^(n×t)`
- **Example**: $1,000 at 7% for 5 years compounded monthly

#### 4. Present Value / Discounting

- **Function**: `presentValue(futureValue, options)`
- **Formula**: `PV = FV / (1 + r/n)^(n×t)`
- **Example**: What's $10,000 in 10 years worth today at 5%?

#### 5. Compound Factor

- **Method**: `Rate.compoundFactor(periods)`
- **Formula**: `(1 + r)^n`
- **Example**: Growth multiplier for compound interest

#### 6. Simple Interest

- **Functions**: `simpleInterest(principal, options)`, `simpleInterestTotal(principal, options)`
- **Formula**: `Interest = P × r × t`, `Total = P × (1 + r × t)`
- **Use**: Short-term loans, bonds between coupon payments
- **Implementation**: Direct multiplication with Rate class integration

#### 7. Total Interest Paid

- **Functions**: `totalInterest(options)`, `totalInterestFromSchedule(schedule)`
- **Formula**: `Total Interest = (PMT × n) - P`
- **Use**: Calculate total cost of borrowing, compare loan offers
- **Implementation**: Direct calculation from payment formula or sum of schedule interest column

### Investment Analysis

#### 8. Return on Investment (ROI)

- **Function**: `roi(initialValue, finalValue)`
- **Formula**: `ROI = (Final Value - Initial Value) / Initial Value`
- **Use**: Simple profitability metric
- **Implementation**: Basic arithmetic with Money objects

### Financial Ratios

#### 9. Leverage Ratios

- **Functions**: `debtToEquity()`, `debtToAssets()`, `interestCoverage()`, `equityMultiplier()`, `leverageRatios()`
- **Formulas**:
  - D/E: `Total Debt / Total Equity`
  - D/A: `Total Debt / Total Assets`
  - Interest Coverage: `EBIT / Interest Expense`
  - Equity Multiplier: `Total Assets / Total Equity`
- **Use**: Risk assessment, capital structure analysis
- **Implementation**: Division operations with currency checks

---

## 🔮 To Implement

### Investment Analysis

#### 7. Payback Period

- **Formula**: Time until `Σ CFt = Initial Investment`
- **Use**: How long to recover investment (ignores time value)
- **Implementation**: Cumulative sum until threshold reached

#### 9. Holding Period Return (HPR)

- **Formula**: `HPR = (Ending Value - Beginning Value + Income) / Beginning Value`
- **Use**: Total return over holding period
- **Implementation**: Single calculation

### Loan Calculations

#### 10. Remaining Balance

- **Formula**: `Balance = P × [(1 + r)^n - (1 + r)^p] / [(1 + r)^n - 1]`
- **Use**: Current loan payoff amount
- **Implementation**: Power and division operations

#### 11. Interest-Only Loan Payment

- **Formula**: `Payment = Principal × Periodic Rate`
- **Use**: Commercial real estate, construction loans
- **Implementation**: Direct multiplication

### Bond Valuation

#### 13. Current Yield

- **Formula**: `Current Yield = Annual Coupon / Current Price`
- **Use**: Quick income measure
- **Implementation**: Simple division

### Risk Analysis

#### 14. Expected Return

- **Formula**: `E(R) = Σ [Probability × Return]`
- **Use**: Weighted average of possible returns
- **Implementation**: Loop with multiply and sum

### Foreign Exchange

#### 15. Cross Rate

- **Formula**: `EUR/GBP = (EUR/USD) / (GBP/USD)`
- **Use**: Derive exchange rate between two currencies
- **Implementation**: Simple division

#### 16. Currency Conversion with Fees

- **Formula**: `Amount Received = Amount × Rate × (1 - Fee)`
- **Use**: Real-world currency exchange
- **Implementation**: Chain multiplication

### Financial Ratios

#### 17. Profitability Ratios

- **Gross Margin**: `(Revenue - COGS) / Revenue`
- **Operating Margin**: `Operating Income / Revenue`
- **Net Margin**: `Net Income / Revenue`
- **ROE**: `Net Income / Equity`
- **ROA**: `Net Income / Assets`
- **Implementation**: Basic division operations

#### 18. Liquidity Ratios

- **Current Ratio**: `Current Assets / Current Liabilities`
- **Quick Ratio**: `(Current Assets - Inventory) / Current Liabilities`
- **Cash Ratio**: `Cash / Current Liabilities`
- **Implementation**: Arithmetic operations



### Depreciation

#### 20. Straight-Line Depreciation

- **Formula**: `Annual Depreciation = (Cost - Salvage) / Useful Life`
- **Use**: Equal expense each year
- **Implementation**: Single division

---

## 🎯 Implementation Strategy

### Why Start with Easy Formulas?

1. **Quick Wins**: Fast implementation builds momentum
2. **Foundation**: These are building blocks for complex formulas
3. **User Value**: Immediate utility for common financial tasks
4. **Testing**: Simple formulas are easier to verify and test
5. **Documentation**: Clear examples for users to understand

### Estimated Implementation Time

- **Per Formula**: 30 minutes - 2 hours each
- **Total Easy Formulas**: ~15-40 hours
- **Includes**: Implementation, tests, documentation

### Order of Implementation

**Phase 1** (v2.2.0): Formulas 6-13 (8 formulas)
**Phase 2** (v2.3.0): Formulas 14-20 (7 formulas)

This creates a solid foundation for medium and hard formulas in subsequent releases.

- **Formula**: `Periodic Rate = Annual Rate / Periods Per Year`
- **Example**: 12% annual → 1% monthly (12 periods/year)

### Time Value of Money

#### 3. Future Value with Compound Interest

- **Function**: `futureValue(presentValue, options)`
- **Formula**: `FV = PV × (1 + r/n)^(n×t)`
- **Example**: $1,000 at 7% for 5 years compounded monthly

#### 4. Present Value / Discounting

- **Function**: `presentValue(futureValue, options)`
- **Formula**: `PV = FV / (1 + r/n)^(n×t)`
- **Example**: What's $10,000 in 10 years worth today at 5%?

#### 5. Compound Factor

- **Method**: `Rate.compoundFactor(periods)`
- **Formula**: `(1 + r)^n`
- **Example**: Growth multiplier for compound interest

---

## 🔮 To Implement (Quick Wins)

### Time Value of Money

#### 1. Simple Interest

- **Formula**: `Interest = P × r × t`
  - P = Principal amount
  - r = Annual interest rate (decimal)
  - t = Time in years
- **Total Amount**: `A = P × (1 + r × t)`
- **Use Cases**: Short-term loans, bonds between coupon payments, savings accounts
- **Complexity**: Very Low
- **Estimated Time**: 1-2 hours

---

### Investment Analysis

#### 2. Payback Period

- **Formula**: Time until `Σ CFt = Initial Investment`
- **Simple Version**: `Payback = Initial Investment / Annual Cash Flow`
- **With Uneven CFs**: Cumulative sum until break-even
- **Use Cases**: Quick project screening, risk assessment
- **Limitations**: Ignores time value of money
- **Complexity**: Low
- **Estimated Time**: 2-3 hours

#### 3. Return on Investment (ROI)

- **Formula**: `ROI = (Gain - Cost) / Cost × 100%`
- **Alternative**: `ROI = (Final Value - Initial Value) / Initial Value × 100%`
- **Use Cases**: Investment comparison, marketing campaign effectiveness
- **Complexity**: Very Low
- **Estimated Time**: 1 hour

#### 4. Holding Period Return (HPR)

- **Formula**: `HPR = (Ending Value - Beginning Value + Income) / Beginning Value`
- **With dividends**: `HPR = (P₁ - P₀ + D) / P₀`
  - P₁ = Ending price
  - P₀ = Beginning price
  - D = Dividends received
- **Use Cases**: Stock performance, total return measurement
- **Complexity**: Low
- **Estimated Time**: 1-2 hours

---

### Loan & Mortgage Calculations

#### 5. Remaining Balance

- **Formula**: `Balance = P × [(1 + r)^n - (1 + r)^p] / [(1 + r)^n - 1]`
  - P = Original principal
  - r = Periodic interest rate
  - n = Total number of payments
  - p = Payments already made
- **Use Cases**: Loan payoff quotes, refinancing decisions
- **Complexity**: Low
- **Estimated Time**: 2 hours

#### 6. Total Interest Paid

- **Formula**: `Total Interest = (PMT × n) - P`
  - PMT = Payment amount
  - n = Number of payments
  - P = Principal
- **Use Cases**: True cost of borrowing, loan comparison
- **Complexity**: Very Low
- **Estimated Time**: 1 hour

#### 7. Interest-Only Loan Payment

- **Formula**: `Payment = Principal × Periodic Rate`
- **Monthly**: `Payment = P × (Annual Rate / 12)`
- **Note**: Principal due at end or refinanced
- **Use Cases**: Commercial real estate, construction loans, HELOCs
- **Complexity**: Very Low
- **Estimated Time**: 1 hour

---

### Bond Valuation

#### 8. Current Yield

- **Formula**: `Current Yield = Annual Coupon / Current Price`
- **Example**: $50 coupon / $980 price = 5.10%
- **Use Cases**: Quick bond income comparison
- **Limitations**: Ignores capital gains/losses
- **Complexity**: Very Low
- **Estimated Time**: 1 hour

---

### Risk & Portfolio Analysis

#### 9. Expected Return

- **Formula**: `E(R) = Σ [Probability × Return]`
- **Example**:
  ```
  60% chance of 10% return
  40% chance of -5% return
  E(R) = 0.6 × 0.10 + 0.4 × (-0.05) = 4%
  ```
- **Use Cases**: Investment decision making, scenario analysis
- **Complexity**: Low
- **Estimated Time**: 2 hours

---

### Derivatives & Options

#### 10. Option Payoffs

- **Call Payoff**: `max(S - K, 0)`
- **Put Payoff**: `max(K - S, 0)`
  - S = Stock price at expiration
  - K = Strike price
- **Profit (Call)**: `max(S - K, 0) - Premium`
- **Profit (Put)**: `max(K - S, 0) - Premium`
- **Use Cases**: Options education, payoff diagrams, break-even analysis
- **Complexity**: Very Low
- **Estimated Time**: 1-2 hours

---

### Depreciation & Tax

#### 11. Straight-Line Depreciation

- **Formula**: `Annual Depreciation = (Cost - Salvage Value) / Useful Life`
- **Book Value**: `Book Value = Cost - (Depreciation × Years)`
- **Example**: $10,000 asset, $1,000 salvage, 5 years → $1,800/year
- **Use Cases**: Accounting, tax planning, asset management
- **Complexity**: Very Low
- **Estimated Time**: 1 hour

---

### Foreign Exchange & Currency

#### 12. Cross Rate

- **Formula**: `EUR/GBP = (EUR/USD) / (GBP/USD)`
- **General**: `A/C = (A/B) × (B/C)` or `A/C = (A/B) / (C/B)`
- **Use Cases**: Currency arbitrage detection, FX trading
- **Complexity**: Very Low
- **Estimated Time**: 1 hour

#### 13. Currency Conversion with Fees

- **Formula**: `Amount Received = Amount × Rate × (1 - Fee)`
- **With Spread**: `Effective Rate = Mid Rate - Spread`
- **Use Cases**: Remittance calculations, travel money, FX cost analysis
- **Complexity**: Very Low
- **Estimated Time**: 1 hour

---

### Financial Ratios & Analysis

#### 14. Profitability Ratios

- **Gross Margin**: `(Revenue - COGS) / Revenue × 100%`
- **Operating Margin**: `Operating Income / Revenue × 100%`
- **Net Margin**: `Net Income / Revenue × 100%`
- **ROE**: `Net Income / Shareholders' Equity × 100%`
- **ROA**: `Net Income / Total Assets × 100%`
- **Use Cases**: Company analysis, peer comparison
- **Complexity**: Low
- **Estimated Time**: 2-3 hours (all ratios)

#### 15. Liquidity Ratios

- **Current Ratio**: `Current Assets / Current Liabilities`
- **Quick Ratio**: `(Current Assets - Inventory) / Current Liabilities`
- **Cash Ratio**: `Cash & Equivalents / Current Liabilities`
- **Use Cases**: Credit analysis, financial health assessment
- **Complexity**: Low
- **Estimated Time**: 2 hours (all ratios)



---

## 📋 Implementation Priority

### Tier 1: Very Low Complexity (1 hour each)

1. Simple Interest
2. ROI
3. Total Interest Paid
4. Interest-Only Loan Payment
5. Current Yield
6. Straight-Line Depreciation
7. Cross Rate
8. Currency Conversion with Fees

### Tier 2: Low Complexity (2-3 hours each)

9. Holding Period Return
10. Payback Period
11. Remaining Balance
12. Option Payoffs
13. Expected Return
14. Profitability Ratios
15. Liquidity Ratios

---

## 🏁 Total Estimated Effort

- **Tier 1**: ~8 functions, ~8-10 hours
- **Tier 2**: ~8 functions, ~16-20 hours
- **Total**: ~16 functions, ~24-30 hours

These quick wins will significantly expand Monetra's capabilities with minimal development effort!
