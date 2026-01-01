# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Monetra seriously. If you discover a security vulnerability, please follow these steps:

1.  **Do not open a public issue.**
2.  Email the maintainers directly at [info@zasciahugo.com](mailto:info@zasciahugo.com).
3.  Include a detailed description of the vulnerability and steps to reproduce it.

We will acknowledge your report within 48 hours and provide an estimated timeline for a fix.

### Critical Financial Invariants

Since Monetra is a financial library, we consider the following to be critical security vulnerabilities:

- **Silent Rounding**: Any operation that loses precision without explicit user consent.
- **Currency Mismatch**: Any operation that allows arithmetic between different currencies without error.
- **Overflow/Underflow**: Any operation that results in incorrect values due to integer limits (though BigInt mitigates this, implementation bugs are possible).

Thank you for helping keep Monetra secure!
