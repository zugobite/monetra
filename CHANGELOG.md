# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-01-02

### Added

- **Arithmetic**: Added `divide()` method with explicit rounding support.
- **Utilities**: Added `abs()`, `negate()`, `min()`, `max()` methods.
- **Comparisons**: Added `greaterThanOrEqual()`, `lessThanOrEqual()`, `compare()`, `isPositive()`.
- **Float Support**: Added `Money.fromFloat()` static method (with precision warnings).
- **Enhanced Errors**: Improved error messages for `CurrencyMismatchError` and `RoundingRequiredError` with actionable tips.

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
