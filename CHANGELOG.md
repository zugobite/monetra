# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.2.0] - 2026-01-05

### Added

#### Simple Interest Calculations

- **`simpleInterest(principal, options)`** - Calculates simple interest earned on principal
  - Formula: `Interest = P × r × t`
  - Uses Rate class for type-safe interest rate handling
  - Supports fractional years for precise time calculations
  - Handles edge cases (zero rate, zero time) gracefully
  - Example: `simpleInterest(Money.fromMajor("1000", "USD"), { rate: Rate.percent(5), years: 2 })` returns `$100.00`

- **`simpleInterestTotal(principal, options)`** - Calculates total amount (principal + simple interest)  
  - Formula: `Total = P × (1 + r × t)`
  - Returns final amount after simple interest accrual
  - Mathematically equivalent to `principal.add(simpleInterest(...))`
  - Example: `simpleInterestTotal(Money.fromMajor("1000", "USD"), { rate: Rate.percent(5), years: 2 })` returns `$1,100.00`

#### Documentation Updates

- Added Simple Interest section to Financial API Reference (`docs/api/financial.md`)
- Updated formulas tracking in `docs/formulas/easy.md` marking simple interest as ✅ implemented
- Comprehensive examples covering short-term loans, bond accrued interest, and comparative analysis
- Mathematical formulas with LaTeX notation for clarity

#### Testing

- Complete test suite for simple interest functions (`tests/financial/simple.test.ts`)
- Tests cover known values, fractional years, different currencies, edge cases, and rounding modes  
- Property-based testing verifying mathematical relationships between functions
- Edge case testing for minimal amounts, large amounts, and currency consistency

### Technical Details

- Implementation uses existing `Rate` class for type-safe rate handling
- Integrates seamlessly with `Money` class arithmetic operations  
- Follows existing patterns in financial module for consistency
- Proper BigInt-based precision arithmetic prevents floating-point errors
- Full TypeScript support with comprehensive JSDoc documentation

---

## [2.1.0] - 2026-01-03

### Added

- **Project Management Workflow**: Integrated GitHub Projects for roadmap and issue tracking.
- Comprehensive developer documentation with framework-specific examples
- New documentation structure in `docs/` directory:
  - Getting Started guide with installation and quick start
  - Core Concepts explaining integer arithmetic, immutability, and rounding
  - API Reference for Money, Ledger, Financial functions, and Currency/Tokens
  - Guides for allocation, formatting, custom tokens, and error handling
  - Framework examples for React.js, Vue.js, and Node.js
  - Best practices with patterns, anti-patterns, and performance tips
  - Library comparison with Dinero.js, currency.js, big.js, and decimal.js

### Changed

- Restructured documentation from numbered files to organized directory structure
- Updated README.md with cleaner, more professional format
- Simplified README.md feature descriptions and API summary tables

### Removed

- Old documentation files (000-INTRODUCTION.md through 007-COOKBOOK.md)

---

## [2.0.0] - 2026-01-02

### Added

#### Core Money Improvements

- `Money.fromCents(amount, currency)` - Alias for `fromMinor` for better discoverability.
- `Money.fromDecimal(amount, currency)` - Alias for `fromMajor` for better discoverability.
- `Money.clamp(min, max)` - Clamp a Money value between minimum and maximum bounds.
- `Money.toDecimalString()` - Returns raw decimal string without locale formatting.
- `Money.reviver` - Static JSON reviver function for deserializing Money objects.

#### Extended Currency Support

- **60+ ISO 4217 currencies** now included out of the box:
  - Major: USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD, CNY, HKD, SGD, KRW, INR
  - European: SEK, NOK, DKK, PLN, CZK, HUF, RON, BGN, HRK, TRY, RUB, UAH, ILS
  - Americas: MXN, BRL, ARS, CLP, COP, PEN
  - Africa: ZAR, NGN, KES, EGP, MAD, GHS, TZS, UGX
  - Asia-Pacific: THB, MYR, IDR, PHP, VND, TWD, PKR, BDT, LKR
  - Middle East: AED, SAR, QAR, KWD, BHD, OMR, JOD
  - Special: ISK, MRU
- Currencies with non-standard decimals properly configured (KWD, BHD, OMR, JOD with 3 decimals; JPY, KRW, VND, CLP, ISK, UGX with 0 decimals)

#### Rounding

- `RoundingMode.TRUNCATE` - Truncate towards zero (removes fractional part).

#### Formatting

- Accounting format support via `{ accounting: true }` option - displays negatives in parentheses.
- Locale-aware parsing with `parseLocaleString()` and `parseLocaleToMinor()` functions.

#### Error Handling

- Error codes on all error classes (`MonetraErrorCode` enum) for programmatic handling.
- Extended error properties (e.g., `expected` and `received` on `CurrencyMismatchError`).

#### Financial Math

- `Rate` class - Type-safe abstraction for interest rates and percentages.
  - `Rate.percent(5)` and `Rate.decimal(0.05)` constructors.
  - `compoundFactor()`, `periodic()`, `toNominal()`, `toEffective()` methods.
  - Arithmetic: `add`, `subtract`, `multiply`, `divide`.

#### Converter Enhancements

- Historical exchange rate support via `addHistoricalRate()`.
- `getRate(currency, date?)` for date-based rate lookups.
- `setRate(currency, rate)` for updating current rates.
- `ConvertOptions` with `date` and `rounding` parameters.

#### Ledger Improvements

- Versioned snapshot format (`version: 2` in `LedgerSnapshot`).
- Browser-compatible crypto using `SubtleCrypto` fallback.
- Async methods for browser support: `recordAsync`, `verifyAsync`, `snapshotAsync`, `fromSnapshotAsync`.
- `setHashFunction()` for injecting custom hash implementations.

#### Testing

- Property-based tests using fast-check for arithmetic operations.
- Tests for commutativity, associativity, identity elements, and serialization round-trips.

### Changed

- **BREAKING**: Ledger `snapshot()` now includes a `version` field.
- **BREAKING**: `MonetraError` constructor now requires an error code parameter.
- Ledger verification methods are now async by default in browsers (sync versions still available for Node.js).

### Deprecated

- None

### Removed

- None

### Fixed

- Documentation for financial functions (`pmt`, `futureValue`, `presentValue`) now correctly reflects the implementation signatures using options objects.
- Removed references to unimplemented functions (`ipmt`, `ppmt`, `addHistoricalRate`) from documentation.
- Corrected `amortizationSchedule` to `loan` in Cookbook examples.
- Corrected `wallet.totalIn()` to `wallet.total()` in Cookbook examples.
- Error message for `RoundingRequiredError` now includes `TRUNCATE` in available modes.

### Security

- Browser-compatible SHA-256 hashing via `SubtleCrypto` API.

---

## [1.2.0] - 2026-01-02

### Added

#### Ledger System (`monetra/ledger`)

- `Ledger` class for recording immutable, cryptographically verifiable transactions.
- SHA-256 hash chain verification to detect tampering.
- `record(money, metadata)` method for recording transactions.
- `getBalance()` method to retrieve current ledger balance.
- `getHistory()` method for full transaction history.
- `query(filter)` method for filtering transactions by type, date, reference, or amount.
- `verify()` method to validate the integrity of the hash chain.
- `snapshot()` method for exporting ledger state for backup/audit.
- `Ledger.fromSnapshot()` static method for restoring from a snapshot.

#### Financial Math (`monetra/financial`)

- **Loan Amortization**:
  - `pmt(rate, periods, presentValue)` - Calculate loan payment amount.
  - `ipmt(rate, period, periods, presentValue)` - Calculate interest portion of a payment.
  - `ppmt(rate, period, periods, presentValue)` - Calculate principal portion of a payment.
- **Time Value of Money**:
  - `fv(rate, periods, presentValue)` - Calculate future value.
  - `pv(rate, periods, futureValue)` - Calculate present value.
- **Investment Analysis**:
  - `npv(rate, cashFlows)` - Calculate Net Present Value.
  - `irr(cashFlows)` - Calculate Internal Rate of Return using Newton-Raphson method.

#### Tokens & Crypto (`monetra/tokens`)

- `defineToken(definition)` factory function for creating custom currencies and tokens.
- High-precision support up to 18 decimals for cryptocurrencies.
- Built-in token presets: `ETH` (18 decimals), `BTC` (8 decimals), `USDC` (6 decimals), `USDT` (6 decimals).
- Custom symbol support in formatting (e.g., `Ξ` for ETH, `₿` for BTC).
- Token metadata: `chainId`, `contractAddress`, `standard`, `coingeckoId`.

### Changed

- Reorganized documentation into logical reading order: Core Concepts → Ledger → Financial → Tokens → API Reference.
- Updated `package.json` exports to expose new subpaths: `./ledger`, `./financial`, `./tokens`.

### Fixed

- Fixed non-breaking space handling in custom token formatting.

## [1.1.0] - 2026-01-02

### Added

#### Money Class Enhancements

- `divide(divisor, options?)` - Divide by a scalar with explicit rounding.
- `abs()` - Return the absolute value.
- `negate()` - Return the negated value.
- `Money.min(...values)` - Static method to get minimum of multiple Money values.
- `Money.max(...values)` - Static method to get maximum of multiple Money values.
- `greaterThanOrEqual(other)` - Comparison method.
- `lessThanOrEqual(other)` - Comparison method.
- `compare(other)` - Returns `-1`, `0`, or `1` for sorting.
- `isPositive()` - Check if amount is greater than zero.
- `Money.fromFloat(amount, currency, options?)` - Create Money from floating-point numbers (with precision warning).

#### Enhanced Error Messages

- `CurrencyMismatchError` now includes actionable tips showing how to use a `Converter`.
- `RoundingRequiredError` now includes available rounding modes and usage examples.

### Changed

- Improved type definitions for `Money` arithmetic operations to accept `number | string | bigint`.

## [1.0.1] - 2026-01-02

### Fixed

- Included missing `package-lock.json` and backward compatibility fixes for `iso4217.ts` that were omitted in v1.0.0.

## [1.0.0] - 2026-01-02

### Changed

- **Stable Release**: Promoted version 0.0.3 to 1.0.0.
- This release marks the first stable version of Monetra, including all features from 0.0.3 (Smart Syntax, MoneyBag, Converter, etc.).

## [0.0.3] - 2026-01-02

### Added

- **Smart Syntax**: `money()` helper function for easier instantiation.
- **Smart Arithmetic**: `add`, `subtract`, `equals`, `greaterThan`, `lessThan` now accept numbers (minor units) and strings (major units) directly.
- **Financial Helpers**: `percentage`, `addPercent`, `subtractPercent`, and `split` methods for common financial operations.
- **Currency Registry**: Global registry for looking up currencies by string code (e.g., 'USD').
- **Currency Conversion**: `Converter` class for handling exchange rates and conversions.
- **Multi-Currency Wallet**: `MoneyBag` class for managing portfolios of multiple currencies.
- **Serialization**: `toJSON()` method for JSON compatibility.
- **Enhanced Formatting**: Support for currency codes and names in `format()` (e.g., "USD 10.00").

### Fixed

- Restored `CURRENCIES` export in `iso4217` (deprecated) to maintain backward compatibility.
- Resolved export conflict between `iso4217` and `registry` for `getCurrency`.

## [0.0.2] - 2026-01-02

### Added

- Security policy (SECURITY.md) with vulnerability reporting guidelines.
- Code of Conduct (CODE_OF_CONDUCT.md) based on Contributor Covenant.
- GitHub Funding configuration for sponsorship support.

### Changed

- Added repository, bugs, and homepage links to package.json.
- Removed SPEC.md from package.json files list.

## [0.0.1] - 2026-01-02

### Added

- Initial release of Monetra.
- Core `Money` class with BigInt support.
- `Currency` metadata and ISO 4217 support.
- Arithmetic operations: `add`, `subtract`, `multiply`.
- Deterministic `allocate` method for splitting funds.
- Explicit rounding strategies (`HALF_UP`, `HALF_DOWN`, `HALF_EVEN`, `FLOOR`, `CEIL`).
- Locale-aware formatting via `Intl.NumberFormat`.
- Strict string parsing to prevent floating-point errors.
- Comprehensive test suite with 100% coverage of core logic.
- Documentation in `docs/`.
