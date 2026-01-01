# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
