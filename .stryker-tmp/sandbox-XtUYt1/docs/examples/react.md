# React.js Examples

Comprehensive examples for using Monetra in React applications. Each example includes TypeScript types and follows React best practices.

---

## Table of Contents

- [Basic Setup](#setup)
- [Hooks](#hooks)
- [Components](#components)
- [State Management](#state-management)
- [Forms](#forms)
- [Shopping Cart](#shopping-cart)
- [Payment Processing](#payment-processing)

---

## Basic Setup {#setup}

### Installation

```bash
npm install monetra
```

### Currency Configuration

```tsx
// config/currencies.ts
import { getCurrency, defineToken, type Currency } from "monetra";

export const currencies = {
  USD: getCurrency("USD"),
  EUR: getCurrency("EUR"),
  GBP: getCurrency("GBP"),
} as const;

export type SupportedCurrency = keyof typeof currencies;

export const currencyOptions: Array<{
  code: SupportedCurrency;
  name: string;
  symbol: string;
}> = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
];
```

---

## Hooks {#hooks}

### useMoney Hook

```tsx
// hooks/useMoney.ts
import { useState, useCallback, useMemo } from "react";
import {
  money,
  Money,
  MonetraError,
  RoundingMode,
  type Currency,
} from "monetra";

interface UseMoneyOptions {
  currency?: string | Currency;
  initialValue?: string | number;
}

interface UseMoneyReturn {
  value: Money;
  formatted: string;
  set: (amount: string | number) => void;
  add: (amount: string | number | Money) => void;
  subtract: (amount: string | number | Money) => void;
  multiply: (factor: number) => void;
  reset: () => void;
  error: string | null;
}

export function useMoney(options: UseMoneyOptions = {}): UseMoneyReturn {
  const { currency = "USD", initialValue = "0" } = options;

  const [value, setValue] = useState<Money>(() =>
    money(initialValue, currency)
  );
  const [error, setError] = useState<string | null>(null);

  const formatted = useMemo(() => value.format(), [value]);

  const set = useCallback(
    (amount: string | number) => {
      try {
        setValue(money(amount, currency));
        setError(null);
      } catch (e) {
        setError(e instanceof MonetraError ? e.message : "Invalid amount");
      }
    },
    [currency]
  );

  const add = useCallback(
    (amount: string | number | Money) => {
      try {
        const addend =
          amount instanceof Money ? amount : money(amount, currency);
        setValue((prev) => prev.add(addend));
        setError(null);
      } catch (e) {
        setError(e instanceof MonetraError ? e.message : "Invalid operation");
      }
    },
    [currency]
  );

  const subtract = useCallback(
    (amount: string | number | Money) => {
      try {
        const subtrahend =
          amount instanceof Money ? amount : money(amount, currency);
        setValue((prev) => prev.subtract(subtrahend));
        setError(null);
      } catch (e) {
        setError(e instanceof MonetraError ? e.message : "Invalid operation");
      }
    },
    [currency]
  );

  const multiply = useCallback((factor: number) => {
    try {
      setValue((prev) =>
        prev.multiply(factor, { rounding: RoundingMode.HALF_UP })
      );
      setError(null);
    } catch (e) {
      setError(e instanceof MonetraError ? e.message : "Invalid operation");
    }
  }, []);

  const reset = useCallback(() => {
    setValue(money(initialValue, currency));
    setError(null);
  }, [currency, initialValue]);

  return { value, formatted, set, add, subtract, multiply, reset, error };
}
```

### useMoneyFormatter Hook

```tsx
// hooks/useMoneyFormatter.ts
import { useMemo } from "react";
import { Money } from "monetra";

type DisplayFormat = "symbol" | "code" | "name" | "none";

interface UseMoneyFormatterOptions {
  display?: DisplayFormat;
  locale?: string;
  compact?: boolean;
}

export function useMoneyFormatter(options: UseMoneyFormatterOptions = {}) {
  const { display = "symbol", locale = "en-US", compact = false } = options;

  return useMemo(() => {
    return (m: Money): string => {
      if (compact) {
        const value = Number(m.minor) / Math.pow(10, m.currency.decimals);
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency: m.currency.code,
          notation: "compact",
          currencyDisplay: display === "none" ? undefined : display,
        }).format(value);
      }

      return m.format({
        locale,
        symbol: display !== "none",
        code: display === "code",
      });
    };
  }, [display, locale, compact]);
}
```

### useLedger Hook

```tsx
// hooks/useLedger.ts
import { useState, useCallback, useMemo } from "react";
import { Ledger, money, Money, MonetraError } from "monetra";

interface UseLedgerReturn {
  ledger: Ledger;
  balances: Map<string, Money>;
  credit: (account: string, amount: Money, description: string) => string;
  debit: (account: string, amount: Money, description: string) => string;
  transfer: (
    from: string,
    to: string,
    amount: Money,
    description: string
  ) => string;
  getBalance: (account: string) => Money;
  transactions: ReturnType<Ledger["getTransactions"]>;
  error: string | null;
}

export function useLedger(currency: string = "USD"): UseLedgerReturn {
  const [ledger] = useState(() => new Ledger({ currency }));
  const [version, setVersion] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const balances = useMemo(() => {
    // Trigger on version change
    void version;
    return ledger.getAllBalances();
  }, [ledger, version]);

  const credit = useCallback(
    (account: string, amount: Money, description: string) => {
      try {
        const txId = ledger.credit(account, amount, description);
        setError(null);
        refresh();
        return txId;
      } catch (e) {
        const msg = e instanceof MonetraError ? e.message : "Credit failed";
        setError(msg);
        throw e;
      }
    },
    [ledger, refresh]
  );

  const debit = useCallback(
    (account: string, amount: Money, description: string) => {
      try {
        const txId = ledger.debit(account, amount, description);
        setError(null);
        refresh();
        return txId;
      } catch (e) {
        const msg = e instanceof MonetraError ? e.message : "Debit failed";
        setError(msg);
        throw e;
      }
    },
    [ledger, refresh]
  );

  const transfer = useCallback(
    (from: string, to: string, amount: Money, description: string) => {
      try {
        const txId = ledger.transfer(from, to, amount, description);
        setError(null);
        refresh();
        return txId;
      } catch (e) {
        const msg = e instanceof MonetraError ? e.message : "Transfer failed";
        setError(msg);
        throw e;
      }
    },
    [ledger, refresh]
  );

  const getBalance = useCallback(
    (account: string) => {
      return ledger.getBalance(account);
    },
    [ledger]
  );

  const transactions = useMemo(() => {
    void version;
    return ledger.getTransactions();
  }, [ledger, version]);

  return {
    ledger,
    balances,
    credit,
    debit,
    transfer,
    getBalance,
    transactions,
    error,
  };
}
```

---

## Components {#components}

### MoneyDisplay Component

```tsx
// components/MoneyDisplay.tsx
import React from "react";
import { Money } from "monetra";

interface MoneyDisplayProps {
  value: Money;
  locale?: string;
  showCurrency?: boolean;
  className?: string;
  colorize?: boolean; // Red for negative, green for positive
}

export function MoneyDisplay({
  value,
  locale = "en-US",
  showCurrency = true,
  className = "",
  colorize = false,
}: MoneyDisplayProps) {
  const formatted = value.format({ locale, symbol: showCurrency });

  let colorClass = "";
  if (colorize) {
    if (value.isNegative()) colorClass = "text-red-600";
    else if (value.isPositive()) colorClass = "text-green-600";
  }

  return (
    <span className={`money-display ${colorClass} ${className}`.trim()}>
      {formatted}
    </span>
  );
}
```

### MoneyInput Component

```tsx
// components/MoneyInput.tsx
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { money, Money, getCurrency, MonetraError } from "monetra";

interface MoneyInputProps {
  value?: Money;
  currency?: string;
  onChange?: (value: Money | null) => void;
  onError?: (error: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
}

export function MoneyInput({
  value,
  currency = "USD",
  onChange,
  onError,
  placeholder = "0.00",
  disabled = false,
  className = "",
  label,
  required = false,
}: MoneyInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const currencyInfo = getCurrency(currency);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with external value
  useEffect(() => {
    if (value) {
      setInputValue(value.format({ symbol: false }));
    }
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Allow empty, numbers, and single decimal point
    if (!/^-?\d*\.?\d*$/.test(raw)) {
      return;
    }

    setInputValue(raw);

    if (!raw) {
      setError(null);
      onError?.(null);
      onChange?.(null);
      return;
    }

    try {
      const m = money(raw, currency);
      setError(null);
      onError?.(null);
      onChange?.(m);
    } catch (e) {
      const msg =
        e instanceof MonetraError
          ? e.message
          : `Enter up to ${currencyInfo.decimals} decimal places`;
      setError(msg);
      onError?.(msg);
    }
  };

  const handleBlur = () => {
    // Format on blur if valid
    if (inputValue && !error) {
      try {
        const m = money(inputValue, currency);
        setInputValue(m.format({ symbol: false }));
      } catch {
        // Keep current value
      }
    }
  };

  const id = `money-input-${currency}`;

  return (
    <div className={`money-input-wrapper ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className="money-input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div className="money-input-container">
        <span className="money-input-symbol">{currencyInfo.symbol}</span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`money-input ${error ? "has-error" : ""}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span className="money-input-code">{currency}</span>
      </div>

      {error && (
        <span id={`${id}-error`} className="money-input-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
```

### CurrencyConverter Component

```tsx
// components/CurrencyConverter.tsx
import React, { useState, useMemo } from "react";
import { money, Money, Converter, getCurrency } from "monetra";
import { MoneyInput } from "./MoneyInput";
import { MoneyDisplay } from "./MoneyDisplay";
import { currencyOptions, SupportedCurrency } from "../config/currencies";

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyConverterProps {
  rates: ExchangeRates;
  baseCurrency?: SupportedCurrency;
}

export function CurrencyConverter({
  rates,
  baseCurrency = "USD",
}: CurrencyConverterProps) {
  const [fromCurrency, setFromCurrency] = useState<SupportedCurrency>("USD");
  const [toCurrency, setToCurrency] = useState<SupportedCurrency>("EUR");
  const [amount, setAmount] = useState<Money | null>(null);

  const converter = useMemo(() => {
    return new Converter(baseCurrency, rates);
  }, [baseCurrency, rates]);

  const convertedAmount = useMemo(() => {
    if (!amount) return null;
    try {
      return converter.convert(amount, toCurrency);
    } catch {
      return null;
    }
  }, [amount, converter, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (convertedAmount) {
      setAmount(convertedAmount);
    }
  };

  return (
    <div className="currency-converter">
      <h2>Currency Converter</h2>

      <div className="converter-row">
        <div className="converter-input">
          <label>From</label>
          <select
            value={fromCurrency}
            onChange={(e) =>
              setFromCurrency(e.target.value as SupportedCurrency)
            }
          >
            {currencyOptions.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.code} - {opt.name}
              </option>
            ))}
          </select>
          <MoneyInput
            currency={fromCurrency}
            value={amount ?? undefined}
            onChange={setAmount}
          />
        </div>

        <button onClick={swapCurrencies} className="swap-button">
          ⇄
        </button>

        <div className="converter-output">
          <label>To</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value as SupportedCurrency)}
          >
            {currencyOptions.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.code} - {opt.name}
              </option>
            ))}
          </select>
          <div className="converted-amount">
            {convertedAmount ? (
              <MoneyDisplay value={convertedAmount} />
            ) : (
              <span className="placeholder">—</span>
            )}
          </div>
        </div>
      </div>

      {amount && convertedAmount && (
        <div className="exchange-rate">
          1 {fromCurrency} = {rates[toCurrency] || 1} {toCurrency}
        </div>
      )}
    </div>
  );
}
```

---

## State Management {#state-management}

### Redux Toolkit Integration

```tsx
// store/moneySlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { money, Money } from "monetra";

interface SerializedMoney {
  minor: string;
  currency: string;
}

interface MoneyState {
  balance: SerializedMoney;
  transactions: Array<{
    id: string;
    amount: SerializedMoney;
    description: string;
    timestamp: string;
  }>;
}

// Serialization helpers
function serialize(m: Money): SerializedMoney {
  return {
    minor: m.minor.toString(),
    currency: m.currency.code,
  };
}

function deserialize(s: SerializedMoney): Money {
  return Money.fromMinor(BigInt(s.minor), s.currency);
}

const initialState: MoneyState = {
  balance: serialize(money("0", "USD")),
  transactions: [],
};

const moneySlice = createSlice({
  name: "money",
  initialState,
  reducers: {
    deposit: (
      state,
      action: PayloadAction<{ amount: string; description: string }>
    ) => {
      const current = deserialize(state.balance);
      const deposit = money(action.payload.amount, current.currency.code);
      const newBalance = current.add(deposit);

      state.balance = serialize(newBalance);
      state.transactions.push({
        id: crypto.randomUUID(),
        amount: serialize(deposit),
        description: action.payload.description,
        timestamp: new Date().toISOString(),
      });
    },

    withdraw: (
      state,
      action: PayloadAction<{ amount: string; description: string }>
    ) => {
      const current = deserialize(state.balance);
      const withdrawal = money(action.payload.amount, current.currency.code);

      if (current.lt(withdrawal)) {
        throw new Error("Insufficient funds");
      }

      const newBalance = current.subtract(withdrawal);
      state.balance = serialize(newBalance);
      state.transactions.push({
        id: crypto.randomUUID(),
        amount: serialize(withdrawal.negate()),
        description: action.payload.description,
        timestamp: new Date().toISOString(),
      });
    },
  },
});

export const { deposit, withdraw } = moneySlice.actions;
export default moneySlice.reducer;

// Selectors
export const selectBalance = (state: { money: MoneyState }) =>
  deserialize(state.money.balance);

export const selectTransactions = (state: { money: MoneyState }) =>
  state.money.transactions.map((tx) => ({
    ...tx,
    amount: deserialize(tx.amount),
  }));
```

### Zustand Integration

```tsx
// store/useWalletStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { money, Money, Ledger } from "monetra";

interface WalletStore {
  ledger: Ledger;
  deposit: (amount: string, description: string) => void;
  withdraw: (amount: string, description: string) => void;
  transfer: (to: string, amount: string, description: string) => void;
  getBalance: () => Money;
  getTransactionHistory: () => ReturnType<Ledger["getTransactions"]>;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => {
      const ledger = new Ledger({ currency: "USD" });

      return {
        ledger,

        deposit: (amount, description) => {
          const m = money(amount, "USD");
          get().ledger.credit("wallet", m, description);
          set({}); // Trigger re-render
        },

        withdraw: (amount, description) => {
          const m = money(amount, "USD");
          get().ledger.debit("wallet", m, description);
          set({});
        },

        transfer: (to, amount, description) => {
          const m = money(amount, "USD");
          get().ledger.transfer("wallet", to, m, description);
          set({});
        },

        getBalance: () => get().ledger.getBalance("wallet"),

        getTransactionHistory: () => get().ledger.getTransactions(),
      };
    },
    {
      name: "wallet-storage",
      partialize: (state) => ({
        // Serialize ledger for storage
        transactions: state.ledger.getTransactions(),
      }),
    }
  )
);
```

---

## Forms {#forms}

### React Hook Form Integration

```tsx
// components/PaymentForm.tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { money, Money, MonetraError, getCurrency } from "monetra";
import { MoneyInput } from "./MoneyInput";

interface PaymentFormData {
  amount: Money | null;
  currency: string;
  recipient: string;
  note: string;
}

interface PaymentFormProps {
  onSubmit: (data: { amount: Money; recipient: string; note: string }) => void;
}

export function PaymentForm({ onSubmit }: PaymentFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    defaultValues: {
      amount: null,
      currency: "USD",
      recipient: "",
      note: "",
    },
  });

  const currency = watch("currency");

  const processSubmit = (data: PaymentFormData) => {
    if (!data.amount) return;

    onSubmit({
      amount: data.amount,
      recipient: data.recipient,
      note: data.note,
    });
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="payment-form">
      <div className="form-group">
        <label>Currency</label>
        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <select {...field}>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          )}
        />
      </div>

      <div className="form-group">
        <Controller
          name="amount"
          control={control}
          rules={{
            required: "Amount is required",
            validate: (value) => {
              if (!value) return "Amount is required";
              if (value.isZero()) return "Amount must be greater than zero";
              if (value.isNegative()) return "Amount cannot be negative";
              return true;
            },
          }}
          render={({ field, fieldState }) => (
            <MoneyInput
              value={field.value ?? undefined}
              currency={currency}
              onChange={field.onChange}
              label="Amount"
              required
              className={fieldState.error ? "has-error" : ""}
            />
          )}
        />
        {errors.amount && (
          <span className="error">{errors.amount.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Recipient</label>
        <Controller
          name="recipient"
          control={control}
          rules={{ required: "Recipient is required" }}
          render={({ field }) => (
            <input {...field} type="text" placeholder="Enter recipient" />
          )}
        />
        {errors.recipient && (
          <span className="error">{errors.recipient.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Note (optional)</label>
        <Controller
          name="note"
          control={control}
          render={({ field }) => (
            <textarea {...field} placeholder="Add a note" />
          )}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Send Payment"}
      </button>
    </form>
  );
}
```

---

## Shopping Cart {#shopping-cart}

### Complete Shopping Cart

```tsx
// components/ShoppingCart.tsx
import React, { useMemo, useCallback } from "react";
import { money, Money, RoundingMode } from "monetra";
import { MoneyDisplay } from "./MoneyDisplay";

interface CartItem {
  id: string;
  name: string;
  priceMinor: number; // Price in cents
  quantity: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  taxRate?: number;
  discountCode?: string;
}

const discounts: Record<string, number> = {
  SAVE10: 0.1,
  SAVE20: 0.2,
};

export function ShoppingCart({
  items,
  onUpdateQuantity,
  onRemove,
  taxRate = 0.08,
  discountCode,
}: ShoppingCartProps) {
  // Calculate item totals
  const itemTotals = useMemo(() => {
    return items.map((item) => ({
      ...item,
      price: Money.fromMinor(BigInt(item.priceMinor), "USD"),
      total: Money.fromMinor(BigInt(item.priceMinor * item.quantity), "USD"),
    }));
  }, [items]);

  // Calculate subtotal
  const subtotal = useMemo(() => {
    if (itemTotals.length === 0) return money("0", "USD");
    return itemTotals.reduce(
      (sum, item) => sum.add(item.total),
      money("0", "USD")
    );
  }, [itemTotals]);

  // Calculate discount
  const discount = useMemo(() => {
    if (!discountCode || !discounts[discountCode]) {
      return money("0", "USD");
    }
    return subtotal.multiply(discounts[discountCode], {
      rounding: RoundingMode.HALF_UP,
    });
  }, [subtotal, discountCode]);

  // Calculate tax
  const tax = useMemo(() => {
    const taxableAmount = subtotal.subtract(discount);
    return taxableAmount.multiply(taxRate, {
      rounding: RoundingMode.HALF_UP,
    });
  }, [subtotal, discount, taxRate]);

  // Calculate total
  const total = useMemo(() => {
    return subtotal.subtract(discount).add(tax);
  }, [subtotal, discount, tax]);

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>

      {itemTotals.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <table className="cart-items">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {itemTotals.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <MoneyDisplay value={item.price} />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                      className="quantity-input"
                    />
                  </td>
                  <td>
                    <MoneyDisplay value={item.total} />
                  </td>
                  <td>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="remove-btn"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <MoneyDisplay value={subtotal} />
            </div>

            {!discount.isZero() && (
              <div className="summary-row discount">
                <span>Discount ({discountCode})</span>
                <MoneyDisplay value={discount.negate()} colorize />
              </div>
            )}

            <div className="summary-row">
              <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
              <MoneyDisplay value={tax} />
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <MoneyDisplay value={total} />
            </div>
          </div>

          <button className="checkout-btn">Proceed to Checkout</button>
        </>
      )}
    </div>
  );
}
```

---

## Payment Processing {#payment-processing}

### Stripe Integration Example

```tsx
// components/StripePayment.tsx
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { money, Money } from "monetra";
import { MoneyDisplay } from "./MoneyDisplay";

const stripePromise = loadStripe("pk_test_...");

interface PaymentProps {
  amount: Money;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

function PaymentFormInner({ amount, onSuccess, onError }: PaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // Create payment intent on server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Send amount in minor units (cents)
          amount: amount.minor.toString(),
          currency: amount.currency.code.toLowerCase(),
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (error) {
        onError(error.message || "Payment failed");
      } else if (paymentIntent) {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      onError("Payment processing error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="payment-amount">
        <span>Amount to pay:</span>
        <MoneyDisplay value={amount} />
      </div>

      <div className="card-element-wrapper">
        <CardElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="pay-button"
      >
        {processing ? "Processing..." : `Pay ${amount.format()}`}
      </button>
    </form>
  );
}

export function StripePayment(props: PaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormInner {...props} />
    </Elements>
  );
}
```

---

## Next Steps

- **[Vue.js Examples](./vue.md)** - Vue.js patterns
- **[Node.js Examples](./node.md)** - Server-side patterns
- **[Best Practices](../best-practices.md)** - Production guidelines
