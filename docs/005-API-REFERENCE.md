# API Reference

## Global Helpers

#### `money(amount: number | bigint | string, currency: string | Currency): Money`

Helper function to create Money instances.

- If `amount` is a number/bigint, it is treated as minor units (cents).
- If `amount` is a string, it is treated as major units (dollars).

```typescript
money(100, "USD"); // $1.00
money("10.50", "USD"); // $10.50
```

## Money

### Static Methods

#### `Money.fromMinor(minor: bigint | number, currency: Currency | string): Money`

Creates a Money instance from minor units (e.g., cents).

#### `Money.fromMajor(amount: string, currency: Currency | string): Money`

Creates a Money instance from major units (e.g., "10.50"). Throws if precision exceeds currency decimals.

#### `Money.fromFloat(amount: number, currency: Currency | string, options?: { rounding?: RoundingMode; suppressWarning?: boolean }): Money`

Creates a Money instance from a floating-point number.
**Warning:** Floating-point numbers can have precision issues. Prefer `Money.fromMajor` for exact values.

#### `Money.zero(currency: Currency | string): Money`

Creates a zero value for the given currency.

#### `Money.min(...values: Money[]): Money`

Returns the minimum of the provided Money values. All values must be in the same currency.

#### `Money.max(...values: Money[]): Money`

Returns the maximum of the provided Money values. All values must be in the same currency.

### Instance Methods

#### `add(other: Money | number | bigint | string): Money`

Adds another value. Accepts Money objects, numbers (minor units), or strings (major units).

#### `subtract(other: Money | number | bigint | string): Money`

Subtracts another value. Accepts Money objects, numbers (minor units), or strings (major units).

#### `multiply(multiplier: string | number, options?: { rounding?: RoundingMode }): Money`

Multiplies by a scalar. Requires `rounding` option if the result is not an integer.

#### `divide(divisor: string | number, options?: { rounding?: RoundingMode }): Money`

Divides by a scalar. Requires `rounding` option if the result is not an integer. Throws on division by zero.

#### `percentage(percent: number, rounding?: RoundingMode): Money`

Calculates a percentage of the amount.

#### `addPercent(percent: number, rounding?: RoundingMode): Money`

Adds a percentage to the amount (e.g., adding tax).

#### `subtractPercent(percent: number, rounding?: RoundingMode): Money`

Subtracts a percentage from the amount (e.g., discount).

#### `split(parts: number): Money[]`

Splits the money into equal parts, distributing remainders.

#### `allocate(ratios: number[]): Money[]`

Splits the money according to the given ratios. Distributes remainders to ensure the sum equals the original amount.

#### `format(options?: { locale?: string; symbol?: boolean; display?: 'symbol' | 'code' | 'name' }): string`

Formats the money as a string using `Intl.NumberFormat`.

#### `toJSON(): { amount: string; currency: string; precision: number }`

Returns a JSON-serializable representation.

#### `equals(other: Money | number | bigint | string): boolean`

Checks if two Money values are equal in amount and currency.

#### `greaterThan(other: Money | number | bigint | string): boolean`

Checks if this value is greater than the other.

#### `lessThan(other: Money | number | bigint | string): boolean`

Checks if this value is less than the other.

#### `greaterThanOrEqual(other: Money | number | bigint | string): boolean`

Checks if this value is greater than or equal to the other.

#### `lessThanOrEqual(other: Money | number | bigint | string): boolean`

Checks if this value is less than or equal to the other.

#### `compare(other: Money | number | bigint | string): -1 | 0 | 1`

Compares this Money to another. Returns -1 if less, 0 if equal, 1 if greater.

#### `isPositive(): boolean`

Checks if the amount is greater than zero.

#### `isNegative(): boolean`

Checks if the amount is less than zero.

#### `isZero(): boolean`

Checks if the amount is zero.

#### `abs(): Money`

Returns the absolute value of this Money.

#### `negate(): Money`

Returns the negated value of this Money.

## Ledger

#### `constructor(currency: string | Currency)`

Creates a new Ledger for a specific currency.

#### `record(money: Money, metadata: TransactionMetadata): Entry`

Records a transaction. Metadata includes `type`, `description`, `reference`, etc.

#### `getBalance(): Money`

Returns the current balance of the ledger.

#### `getHistory(): ReadonlyArray<Entry>`

Returns the full immutable history of transactions.

#### `verify(): boolean`

Verifies the cryptographic integrity of the hash chain.

#### `snapshot(): LedgerSnapshot`

Exports a snapshot of the ledger state.

#### `static fromSnapshot(snapshot: LedgerSnapshot): Ledger`

Restores a ledger from a snapshot, verifying integrity.

## Financial Math

#### `pmt(options: { annualRate: number; periods: number; principal: Money; periodsPerYear?: number; rounding?: RoundingMode }): Money`

Calculates the payment for a loan based on constant payments and a constant interest rate.

#### `futureValue(presentValue: Money, options: { rate: number; years: number; compoundingPerYear?: number; rounding?: RoundingMode }): Money`

Calculates the future value of an investment.

#### `presentValue(futureValue: Money, options: { rate: number; years: number; compoundingPerYear?: number; rounding?: RoundingMode }): Money`

Calculates the present value of a loan or investment.

#### `npv(rate: number, cashFlows: Money[]): Money`

Calculates the Net Present Value of an investment based on a series of cash flows.

#### `irr(cashFlows: Money[], guess?: number): number`

Calculates the Internal Rate of Return for a series of cash flows.

## Tokens

#### `defineToken(definition: TokenDefinition): TokenDefinition`

Defines a custom token or cryptocurrency.

```typescript
const MY_TOKEN = defineToken({
  code: "MYT",
  symbol: "T",
  decimals: 6
});
```

#### Built-in Tokens

- `ETH`: Ethereum (18 decimals)
- `BTC`: Bitcoin (8 decimals)
- `USDC`: USD Coin (6 decimals)
- `USDT`: Tether (6 decimals)

## Converter

#### `constructor(base: string, rates: Record<string, number>)`

Creates a new converter with a base currency and exchange rates.

#### `convert(money: Money, toCurrency: string | Currency): Money`

Converts a Money object to the target currency.

## MoneyBag (Portfolio)

#### `add(money: Money): void`

Adds money to the bag.

#### `subtract(money: Money): void`

Subtracts money from the bag.

#### `get(currency: string | Currency): Money`

Gets the total amount for a specific currency.

#### `total(targetCurrency: string | Currency, converter: Converter): Money`

Calculates the total value of the bag in the target currency.

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
- `InsufficientFundsError`: Thrown when a wallet has insufficient funds.
- `OverflowError`: Thrown when a value exceeds the safe integer limit.
