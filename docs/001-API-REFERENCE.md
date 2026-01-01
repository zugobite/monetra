# API Reference

## Money

### Static Methods

#### `Money.fromMinor(minor: bigint | number, currency: Currency): Money`

Creates a Money instance from minor units (e.g., cents).

#### `Money.fromMajor(amount: string, currency: Currency): Money`

Creates a Money instance from major units (e.g., "10.50"). Throws if precision exceeds currency decimals.

#### `Money.zero(currency: Currency): Money`

Creates a zero value for the given currency.

### Instance Methods

#### `add(other: Money): Money`

Adds another Money value. Throws `CurrencyMismatchError` if currencies differ.

#### `subtract(other: Money): Money`

Subtracts another Money value. Throws `CurrencyMismatchError` if currencies differ.

#### `multiply(multiplier: string | number, options?: { rounding?: RoundingMode }): Money`

Multiplies by a scalar. Requires `rounding` option if the result is not an integer.

#### `allocate(ratios: number[]): Money[]`

Splits the money according to the given ratios. Distributes remainders to ensure the sum equals the original amount.

#### `format(options?: { locale?: string; symbol?: boolean }): string`

Formats the money as a string using `Intl.NumberFormat`.

#### `equals(other: Money): boolean`

Checks if two Money values are equal in amount and currency.

#### `greaterThan(other: Money): boolean`

Checks if this value is greater than the other.

#### `lessThan(other: Money): boolean`

Checks if this value is less than the other.

#### `isZero(): boolean`

Returns true if the amount is zero.

#### `isNegative(): boolean`

Returns true if the amount is negative.

## Currency

Defines currency metadata.

```typescript
interface Currency {
  code: string; // e.g., "USD"
  decimals: number; // e.g., 2
  symbol: string; // e.g., "$"
  locale?: string; // e.g., "en-US"
}
```

## RoundingMode

Strategies for rounding fractional minor units.

- `HALF_UP`: Round towards nearest neighbor. If equidistant, round away from zero.
- `HALF_DOWN`: Round towards nearest neighbor. If equidistant, round towards zero.
- `HALF_EVEN`: Round towards nearest neighbor. If equidistant, round towards the nearest even integer (Banker's rounding).
- `FLOOR`: Round towards negative infinity.
- `CEIL`: Round towards positive infinity.

## Errors

- `CurrencyMismatchError`: Thrown when operating on different currencies.
- `InvalidPrecisionError`: Thrown when input precision exceeds currency decimals.
- `RoundingRequiredError`: Thrown when an operation requires rounding but none was provided.
- `InsufficientFundsError`: (Reserved for future use)
- `OverflowError`: (Reserved for future use)
