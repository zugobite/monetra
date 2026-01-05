# Security Policy

## Supported Versions

The following versions of Monetra are currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :white_check_mark: |
| 0.x.x   | :x:                |

We recommend always using the latest stable release.

## Reporting a Vulnerability

We take the security of Monetra seriously. If you discover a security vulnerability, please follow these steps:

1. **Do not open a public issue.** Security vulnerabilities should be reported privately.
2. Email the maintainers directly at [info@zasciahugo.com](mailto:info@zasciahugo.com).
3. Include a detailed description of the vulnerability and steps to reproduce it.
4. If possible, provide a proof-of-concept or test case demonstrating the issue.

We will acknowledge your report within 48 hours and provide an estimated timeline for a fix. You can expect:

- **Initial response**: Within 48 hours
- **Status update**: Within 7 days
- **Fix timeline**: Depends on severity (critical: 24-72 hours, high: 1-2 weeks, medium/low: next release)

### Critical Financial Invariants

Since Monetra is a financial library handling monetary calculations, we consider the following to be **critical security vulnerabilities**:

- **Silent Rounding**: Any operation that loses precision without explicit user consent or proper rounding mode specification.
- **Currency Mismatch**: Any operation that allows arithmetic between different currencies without throwing `CurrencyMismatchError`.
- **Overflow/Underflow**: Any operation that results in incorrect values due to integer limits (though BigInt mitigates this, implementation bugs are possible).
- **Ledger Tampering**: Any way to modify ledger entries or bypass hash chain verification in the `Ledger` class.
- **Allocation Discrepancy**: Any allocation that doesn't sum exactly to the original amount (penny loss/gain).

### Out of Scope

The following are **not** considered security vulnerabilities:

- Floating-point precision issues when using `Money.fromFloat()` (documented behavior with explicit warning)
- Performance issues or denial of service via large inputs
- Issues in development dependencies that don't affect production builds

## Security Best Practices

When using Monetra in your application:

1. **Always specify rounding modes** explicitly for division and percentage operations.
2. **Validate currency codes** before creating Money objects from user input.
3. **Use the Ledger's `verify()` method** before trusting restored snapshots.
4. **Keep Monetra updated** to receive the latest security patches.

## Acknowledgments

We appreciate security researchers who responsibly disclose vulnerabilities. Contributors who report valid security issues will be acknowledged in the release notes (unless they prefer to remain anonymous).

Thank you for helping keep Monetra secure!
