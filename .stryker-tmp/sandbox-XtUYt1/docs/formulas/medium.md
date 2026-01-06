# ⚡ Medium Financial Formulas - Building Complexity

This document contains **medium-level** financial formulas that require more sophisticated mathematical operations, iterative algorithms, or complex business logic.

---

## ✅ Already Implemented

### Rate Management

#### 1. Effective Annual Rate (EAR)

- **Function**: `Rate.toEffective()`
- **Formula**: `EAR = (1 + r/n)^n - 1`
- **Complexity**: Power operations with compounding periods
- **Example**: 12% nominal compounded monthly → 12.68% effective

#### 2. Nominal Rate Conversion

- **Function**: `Rate.toNominal()`
- **Formula**: `Nominal = n × [(1 + EAR)^(1/n) - 1]`
- **Complexity**: Fractional exponents and inverse operations

### Investment Analysis

#### 3. Net Present Value (NPV)

- **Function**: `npv(discountRate, cashFlows[])`
- **Formula**: `NPV = Σ [CFt / (1 + r)^t]` for t = 0 to n
- **Complexity**: Array processing, power calculations for each period

### Loan Calculations

#### 4. Loan Payment (PMT)

- **Function**: `pmt(options)`
- **Formula**: `PMT = P × [r(1+r)^n] / [(1+r)^n - 1]`
- **Complexity**: Combined power operations and fractions

#### 5. Amortization Schedule

- **Function**: `loan(options)` → Returns schedule array
- **Complexity**: Iterative calculations with changing balances

---

## 🔮 To Implement

### Time Value of Money

#### 6. Continuous Compounding

- **Formula**: `FV = PV × e^(r×t)`
- **Complexity**: Natural exponential function
- **Use**: Theoretical maximum compounding
- **Implementation**: `Math.exp()` for e^x

#### 7. Present Value of Perpetuity

- **Formula**: `PV = PMT / r`
- **Complexity**: Division with validation (r > 0)
- **Use**: Value of infinite cash flow stream

#### 8. Present Value of Annuity

- **Formula**: `PV = PMT × [(1 - (1 + r)^-n) / r]`
- **Complexity**: Negative exponents, fraction operations
- **Use**: Valuing regular payment streams

#### 9. Future Value of Annuity

- **Formula**: `FV = PMT × [((1 + r)^n - 1) / r]`
- **Complexity**: Power operations with series calculations
- **Use**: Savings plan future value

#### 10. Deferred Annuity

- **Formula**: `PV = (PMT / r) × [(1 - (1 + r)^-n) / (1 + r)^t]`
- **Complexity**: Multiple power operations, deferral logic
- **Use**: Delayed pension payments

### Investment Analysis

#### 11. Discounted Payback Period

- **Formula**: Time until `Σ [CFt / (1 + r)^t] = Initial Investment`
- **Complexity**: Iterative discounting until threshold
- **Use**: Payback period considering time value of money

#### 12. Profitability Index (PI)

- **Formula**: `PI = NPV / Initial Investment`
- **Complexity**: Requires NPV calculation first
- **Decision**: Accept if PI > 1

#### 13. Annualized Return

- **Formula**: `Annualized Return = (1 + HPR)^(1/years) - 1`
- **Complexity**: Fractional exponents for time normalization
- **Use**: Standardize returns across different time periods

### Loan Calculations

#### 14. Loan with Extra Payments

- **Complexity**: Recalculate each period with adjusted balance
- **Implementation**: Conditional logic for extra payments
- **Effect**: Reduces total interest and loan term

#### 15. Balloon Payment

- **Complexity**: Regular amortization until final period, then lump sum
- **Implementation**: Special handling for final payment
- **Use**: Auto loans, commercial mortgages

#### 16. Points and APR Calculation

- **Formula**: Solve for rate r where PV of payments equals (loan - points)
- **Complexity**: Iterative solution, rate-finding algorithm
- **Use**: Compare loan offers with different fee structures

#### 17. Loan Break-Even Analysis

- **Formula**: `Break-even months = Extra fees / Monthly savings`
- **Complexity**: Comparative analysis between loan options
- **Use**: When do lower-rate-higher-fee loans break even?

### Bond Valuation

#### 18. Bond Price

- **Formula**: `Price = Σ[Coupon / (1+r)^t] + [Face Value / (1+r)^n]`
- **Complexity**: Series of discounted cash flows
- **Use**: Fair value of bond given yield

#### 19. Accrued Interest

- **Formula**: `Accrued = (Coupon / Days in Period) × Days Since Last Payment`
- **Complexity**: Date calculations, day-count conventions
- **Use**: Calculate settlement price

### Risk Analysis

#### 20. Variance and Standard Deviation

- **Variance**: `σ² = Σ[(Rt - R̄)²] / (n-1)`
- **Standard Deviation**: `σ = √(σ²)`
- **Complexity**: Statistical calculations with arrays
- **Use**: Measure of volatility/risk

#### 21. Portfolio Return

- **Formula**: `Rp = Σ [wi × Ri]`
- **Complexity**: Weighted calculations across multiple assets
- **Use**: Overall portfolio performance

#### 22. Covariance

- **Formula**: `Cov(X,Y) = Σ[(Xi - X̄)(Yi - Ȳ)] / (n-1)`
- **Complexity**: Dual array processing with mean calculations
- **Use**: How two assets move together

#### 23. Correlation

- **Formula**: `ρ = Cov(X,Y) / (σx × σy)`
- **Complexity**: Requires covariance and standard deviation calculations
- **Use**: Standardized covariance

#### 24. Beta

- **Formula**: `β = Cov(Ri, Rm) / Var(Rm)`
- **Complexity**: Statistical regression concepts
- **Use**: Systematic risk measure

#### 25. CAPM (Capital Asset Pricing Model)

- **Formula**: `E(Ri) = Rf + βi[E(Rm) - Rf]`
- **Complexity**: Requires beta calculation, risk premium concepts
- **Use**: Expected return based on systematic risk

#### 26. Sharpe Ratio

- **Formula**: `Sharpe = (Rp - Rf) / σp`
- **Complexity**: Risk-adjusted return calculations
- **Use**: Excess return per unit of total risk

#### 27. Sortino Ratio

- **Formula**: `Sortino = (Rp - Rf) / σdownside`
- **Complexity**: Downside deviation calculations (asymmetric risk)
- **Use**: Like Sharpe, but only penalizes downside volatility

#### 28. Treynor Ratio

- **Formula**: `Treynor = (Rp - Rf) / βp`
- **Complexity**: Requires beta calculation
- **Use**: Excess return per unit of systematic risk

#### 29. Information Ratio

- **Formula**: `IR = (Rp - Rb) / Tracking Error`
- **Complexity**: Benchmark comparisons, tracking error calculations
- **Use**: Active return vs active risk

#### 30. Jensen's Alpha

- **Formula**: `α = Ri - [Rf + βi(Rm - Rf)]`
- **Complexity**: Requires CAPM calculation as baseline
- **Use**: Excess return beyond CAPM prediction

#### 31. Maximum Drawdown

- **Formula**: `Max DD = (Trough Value - Peak Value) / Peak Value`
- **Complexity**: Time series analysis, peak/trough detection
- **Use**: Worst peak-to-trough decline

### Depreciation

#### 32. Declining Balance Depreciation

- **Formula**: `Depreciation = Book Value × Rate`
- **Complexity**: Iterative calculations with changing base
- **Use**: Accelerated depreciation

#### 33. Sum-of-Years-Digits

- **Formula**: `Depreciation = (Cost - Salvage) × (Remaining Life / Sum of Years)`
- **Complexity**: Fraction calculations with changing numerator
- **Use**: Accelerated depreciation method

#### 34. Units of Production

- **Formula**: `Depreciation = (Cost - Salvage) × (Units Produced / Total Expected Units)`
- **Complexity**: Activity-based calculations
- **Use**: Activity-based depreciation

#### 35. After-Tax Cash Flows

- **Formula**: `After-Tax CF = Before-Tax CF × (1 - Tax Rate) + Depreciation × Tax Rate`
- **Complexity**: Tax shield calculations
- **Use**: Corporate finance analysis

### Foreign Exchange

#### 36. Forward Exchange Rate

- **Formula**: `F = S × [(1 + rd) / (1 + rf)]^t`
- **Complexity**: Interest rate parity calculations
- **Use**: Currency hedging

#### 37. Real Exchange Rate

- **Formula**: `Real Rate = Nominal Rate × (Foreign CPI / Domestic CPI)`
- **Complexity**: Purchasing power parity adjustments
- **Use**: Economic analysis

### Financial Ratios

#### 38. Efficiency Ratios

- **Asset Turnover**: `Revenue / Total Assets`
- **Inventory Turnover**: `COGS / Average Inventory`
- **Receivables Turnover**: `Revenue / Average Receivables`
- **Days Sales Outstanding**: `365 / Receivables Turnover`
- **Complexity**: Average calculations, time-based metrics

#### 39. Market Ratios

- **P/E Ratio**: `Price per Share / Earnings per Share`
- **P/B Ratio**: `Price per Share / Book Value per Share`
- **Dividend Yield**: `Annual Dividend / Price`
- **Payout Ratio**: `Dividends / Net Income`
- **Complexity**: Market data integration

### Derivatives

#### 40. Option Payoffs

- **Call Payoff**: `max(S - K, 0)`
- **Put Payoff**: `max(K - S, 0)`
- **Complexity**: Conditional logic, max functions
- **Use**: Options valuation foundations

#### 41. Put-Call Parity

- **Formula**: `C - P = S - K × e^(-r×t)`
- **Complexity**: Arbitrage relationship calculations
- **Use**: Options pricing validation

#### 42. Forward and Futures Pricing

- **Formula**: `F = S × e^(r×t)`
- **With dividends**: `F = S × e^[(r-q)×t]`
- **Complexity**: Exponential calculations with yield adjustments

---

## 🎯 Implementation Strategy

### Complexity Factors

1. **Mathematical**: Power operations, exponentials, square roots
2. **Iterative**: Loops, convergence algorithms
3. **Statistical**: Array processing, mean/variance calculations
4. **Conditional**: Business logic, special cases
5. **Integration**: Requires multiple other functions

### Estimated Implementation Time

- **Per Formula**: 2-8 hours each
- **Total Medium Formulas**: ~100-300 hours
- **Includes**: Complex algorithms, comprehensive testing, detailed documentation

### Implementation Order

**Phase 1**: Time Value of Money (formulas 6-10)
**Phase 2**: Investment Analysis (formulas 11-13)
**Phase 3**: Risk Analysis (formulas 20-31)
**Phase 4**: Advanced Applications (remaining formulas)
