# Monetra Performance Benchmarks

This directory contains performance benchmarks for the Monetra library to ensure it can handle high-volume financial operations efficiently.

## Benchmark Structure

### 1. Micro Benchmarks (`micro.bench.ts`)

- **Purpose**: Measure the speed of individual operations
- **Scope**: Single operations like add, subtract, multiply, divide
- **Use Case**: Detect performance regressions in core arithmetic

### 2. Stress Tests (`stress.bench.ts`)

- **Purpose**: Test behavior under heavy load
- **Scope**: Large datasets, bulk operations, real-world scenarios
- **Use Case**: Ensure scalability for enterprise financial applications

## Running Benchmarks

```bash
# Run all benchmarks
pnpm run bench

# Run specific benchmark file
pnpm exec vitest bench micro.bench.ts

# Run with detailed output
pnpm exec vitest bench --reporter=verbose
```

## Performance Targets

### Micro Benchmarks

| Operation               | Target        | Notes                    |
| ----------------------- | ------------- | ------------------------ |
| Money.add               | >1M ops/sec   | Core arithmetic          |
| Money.multiply          | >500k ops/sec | Floating-point precision |
| Money.allocate (3-way)  | >100k ops/sec | Fair allocation          |
| Money.allocate (10-way) | >50k ops/sec  | Complex allocation       |

### Stress Tests

| Scenario                | Target | Memory Limit |
| ----------------------- | ------ | ------------ |
| 1k Money objects        | <10ms  | <50MB        |
| 10k sequential adds     | <100ms | <100MB       |
| 1k recipient allocation | <50ms  | <200MB       |
| 1k ledger transactions  | <200ms | <300MB       |

## Real-World Scenarios

### Trading Settlement

Simulates processing 1,000 trades with buy/sell amounts and fees - typical for a small trading firm's daily volume.

### Payroll Distribution

Distributes $500k across 500 employees with different salary weights - common enterprise payroll scenario.

### Multi-Currency Portfolio

Manages 100 assets across USD/EUR currencies with grouping and summation - hedge fund portfolio management.

## Monitoring Performance

The benchmarks output JSON results to `./benchmarks/results.json` for tracking performance over time. Use this in CI to detect:

- **Regressions**: >20% slowdown compared to baseline
- **Memory leaks**: Unexpected memory growth
- **Scalability limits**: Performance cliff at certain data sizes

## Contributing

When adding new features:

1. Add corresponding micro-benchmarks for new operations
2. Add stress tests if the feature handles bulk data
3. Ensure benchmarks pass performance targets
4. Update this README with new targets
