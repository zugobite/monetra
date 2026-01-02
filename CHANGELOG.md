# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
