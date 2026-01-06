# Monetra Documentation

## The Financial Integrity Framework

Welcome to the official documentation for **Monetra**, the TypeScript framework designed to bring strict financial integrity to modern applications.

Unlike simple math libraries, Monetra is an architectural solution that helps you structure your financial domain into three safe layers.

---

## The 3-Layer Architecture

Monetra is organized into three decoupled layers. You can use the Core alone, or adopt the full stack for a complete financial system.

### [Layer 1: Core (Precision)](core/money.md)
The foundation of the framework. It handles the low-level mechanics of safe value storage.
- **[Money Object](core/money.md)**: Immutable, infinite-precision value handling.
- **[Currency Registry](core/currency.md)**: ISO 4217 & Custom Token definitions.
- **Allocation**: Mathematically perfect splitting of funds.

### [Layer 2: Logic (Intelligence)](logic/financial.md)
The application layer that processes value. It implements standard financial formulas verified against established standards.
- **[Financial Math](logic/financial.md)**: Loan Amortization, NPV, IRR, PMT.
- **Interest Engine**: Compound vs Simple interest, Day Counting conventions.
- **Depreciation**: Asset lifecycle tracking.

### [Layer 3: Audit (Compliance)](audit/ledger.md)
The persistence layer that ensures accountability.
- **[Immutable Ledger](audit/ledger.md)**: Trusted Append-Only Logs.
- **Verification**: Cryptographic Hashing (SHA-256) of transaction chains.
- **Governance**: Strict Double-Entry constraints.

---

## Getting Started

If you are new to the framework, start here:

1.  **[Installation & Setup](getting-started.md)** - Add Monetra to your project.
2.  **[Core Concepts](core-concepts.md)** - Understand `BigInt`, Minor Units, and Rounding.
3.  **[Guides](guides/allocation.md)** - Learn common patterns like Splitting and Formatting.

