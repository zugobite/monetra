# Vue.js Examples

Comprehensive examples for using Monetra in Vue.js applications. All examples use Vue 3 with Composition API and TypeScript.

---

## Table of Contents

- [Basic Setup](#setup)
- [Composables](#composables)
- [Components](#components)
- [State Management (Pinia)](#pinia)
- [Forms](#forms)
- [E-commerce](#ecommerce)
- [Multi-Currency Wallet](#wallet)

---

## Basic Setup {#setup}

### Installation

```bash
npm install monetra
```

### Plugin Setup (Optional)

```typescript
// plugins/monetra.ts
import { App, inject, InjectionKey } from "vue";
import { money, Money, Converter, getCurrency } from "monetra";

export interface MonetraPlugin {
  money: typeof money;
  getCurrency: typeof getCurrency;
  converter: Converter | null;
}

export const monetraKey: InjectionKey<MonetraPlugin> = Symbol("monetra");

export function createMonetra(options?: { rates?: Record<string, number> }) {
  return {
    install(app: App) {
      const converter = options?.rates
        ? new Converter("USD", options.rates)
        : null;

      const plugin: MonetraPlugin = {
        money,
        getCurrency,
        converter,
      };

      app.provide(monetraKey, plugin);
      app.config.globalProperties.$money = money;
    },
  };
}

// Usage in main.ts:
// import { createMonetra } from './plugins/monetra';
// app.use(createMonetra({ rates: { EUR: 0.92, GBP: 0.79 } }));
```

---

## Composables {#composables}

### useMoney Composable

```typescript
// composables/useMoney.ts
import { ref, computed, Ref } from "vue";
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

export function useMoney(options: UseMoneyOptions = {}) {
  const { currency = "USD", initialValue = "0" } = options;

  const value = ref<Money>(money(initialValue, currency));
  const error = ref<string | null>(null);

  const formatted = computed(() => value.value.format());
  const isPositive = computed(() => value.value.isPositive());
  const isNegative = computed(() => value.value.isNegative());
  const isZero = computed(() => value.value.isZero());

  function set(amount: string | number) {
    try {
      value.value = money(amount, currency);
      error.value = null;
    } catch (e) {
      error.value = e instanceof MonetraError ? e.message : "Invalid amount";
    }
  }

  function add(amount: string | number | Money) {
    try {
      const addend = amount instanceof Money ? amount : money(amount, currency);
      value.value = value.value.add(addend);
      error.value = null;
    } catch (e) {
      error.value = e instanceof MonetraError ? e.message : "Invalid operation";
    }
  }

  function subtract(amount: string | number | Money) {
    try {
      const subtrahend =
        amount instanceof Money ? amount : money(amount, currency);
      value.value = value.value.subtract(subtrahend);
      error.value = null;
    } catch (e) {
      error.value = e instanceof MonetraError ? e.message : "Invalid operation";
    }
  }

  function multiply(factor: number) {
    try {
      value.value = value.value.multiply(factor, {
        rounding: RoundingMode.HALF_UP,
      });
      error.value = null;
    } catch (e) {
      error.value = e instanceof MonetraError ? e.message : "Invalid operation";
    }
  }

  function reset() {
    value.value = money(initialValue, currency);
    error.value = null;
  }

  return {
    value,
    formatted,
    isPositive,
    isNegative,
    isZero,
    error,
    set,
    add,
    subtract,
    multiply,
    reset,
  };
}
```

### useMoneyFormatter Composable

```typescript
// composables/useMoneyFormatter.ts
import { computed, MaybeRef, toValue } from "vue";
import { Money } from "monetra";

type DisplayFormat = "symbol" | "code" | "name" | "none";

interface UseMoneyFormatterOptions {
  display?: DisplayFormat;
  locale?: string;
  compact?: boolean;
}

export function useMoneyFormatter(options: UseMoneyFormatterOptions = {}) {
  const { display = "symbol", locale = "en-US", compact = false } = options;

  function format(m: Money): string {
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
  }

  // Reactive formatter
  function formatReactive(m: MaybeRef<Money>) {
    return computed(() => format(toValue(m)));
  }

  return { format, formatReactive };
}
```

### useLedger Composable

```typescript
// composables/useLedger.ts
import { ref, computed, shallowRef } from "vue";
import { Ledger, money, Money, MonetraError } from "monetra";

export function useLedger(currency: string = "USD") {
  const ledger = shallowRef(new Ledger({ currency }));
  const version = ref(0);
  const error = ref<string | null>(null);

  const refresh = () => version.value++;

  const balances = computed(() => {
    void version.value; // Dependency
    return ledger.value.getAllBalances();
  });

  const transactions = computed(() => {
    void version.value;
    return ledger.value.getTransactions();
  });

  function credit(account: string, amount: Money, description: string) {
    try {
      const txId = ledger.value.credit(account, amount, description);
      error.value = null;
      refresh();
      return txId;
    } catch (e) {
      error.value = e instanceof MonetraError ? e.message : "Credit failed";
      throw e;
    }
  }

  function debit(account: string, amount: Money, description: string) {
    try {
      const txId = ledger.value.debit(account, amount, description);
      error.value = null;
      refresh();
      return txId;
    } catch (e) {
      error.value = e instanceof MonetraError ? e.message : "Debit failed";
      throw e;
    }
  }

  function transfer(
    from: string,
    to: string,
    amount: Money,
    description: string
  ) {
    try {
      const txId = ledger.value.transfer(from, to, amount, description);
      error.value = null;
      refresh();
      return txId;
    } catch (e) {
      error.value = e instanceof MonetraError ? e.message : "Transfer failed";
      throw e;
    }
  }

  function getBalance(account: string): Money {
    return ledger.value.getBalance(account);
  }

  return {
    ledger,
    balances,
    transactions,
    error,
    credit,
    debit,
    transfer,
    getBalance,
  };
}
```

### useCurrencyConverter Composable

```typescript
// composables/useCurrencyConverter.ts
import { ref, computed, MaybeRef, toValue } from "vue";
import { money, Money, Converter, RoundingMode } from "monetra";

interface ExchangeRates {
  [currency: string]: number;
}

export function useCurrencyConverter(
  baseCurrency: string = "USD",
  initialRates: ExchangeRates = {}
) {
  const rates = ref<ExchangeRates>(initialRates);

  const converter = computed(() => new Converter(baseCurrency, rates.value));

  function updateRates(newRates: ExchangeRates) {
    rates.value = { ...rates.value, ...newRates };
  }

  function convert(amount: MaybeRef<Money>, toCurrency: string): Money {
    const m = toValue(amount);
    return converter.value.convert(m, toCurrency);
  }

  function convertReactive(
    amount: MaybeRef<Money>,
    toCurrency: MaybeRef<string>
  ) {
    return computed(() => {
      try {
        return converter.value.convert(toValue(amount), toValue(toCurrency));
      } catch {
        return null;
      }
    });
  }

  function getRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return 1;
    if (fromCurrency === baseCurrency) return rates.value[toCurrency] ?? 1;
    if (toCurrency === baseCurrency)
      return 1 / (rates.value[fromCurrency] ?? 1);

    // Cross rate
    const fromRate = rates.value[fromCurrency] ?? 1;
    const toRate = rates.value[toCurrency] ?? 1;
    return toRate / fromRate;
  }

  return {
    rates,
    converter,
    updateRates,
    convert,
    convertReactive,
    getRate,
  };
}
```

---

## Components {#components}

### MoneyDisplay Component

```vue
<!-- components/MoneyDisplay.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { Money } from "monetra";

interface Props {
  value: Money;
  locale?: string;
  showCurrency?: boolean;
  colorize?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  locale: "en-US",
  showCurrency: true,
  colorize: false,
});

const formatted = computed(() =>
  props.value.format({ locale: props.locale, symbol: props.showCurrency })
);

const colorClass = computed(() => {
  if (!props.colorize) return "";
  if (props.value.isNegative()) return "text-red-600";
  if (props.value.isPositive()) return "text-green-600";
  return "";
});
</script>

<template>
  <span :class="['money-display', colorClass]">
    {{ formatted }}
  </span>
</template>

<style scoped>
.money-display {
  font-variant-numeric: tabular-nums;
}
.text-red-600 {
  color: #dc2626;
}
.text-green-600 {
  color: #16a34a;
}
</style>
```

### MoneyInput Component

```vue
<!-- components/MoneyInput.vue -->
<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { money, Money, getCurrency, MonetraError } from "monetra";

interface Props {
  modelValue?: Money | null;
  currency?: string;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  currency: "USD",
  placeholder: "0.00",
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: Money | null];
  error: [error: string | null];
}>();

const inputValue = ref("");
const error = ref<string | null>(null);
const currencyInfo = computed(() => getCurrency(props.currency));

// Sync with external value
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      inputValue.value = newValue.format({ symbol: false });
    }
  },
  { immediate: true }
);

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const raw = target.value;

  // Allow empty, numbers, and single decimal point
  if (!/^-?\d*\.?\d*$/.test(raw)) {
    return;
  }

  inputValue.value = raw;

  if (!raw) {
    error.value = null;
    emit("error", null);
    emit("update:modelValue", null);
    return;
  }

  try {
    const m = money(raw, props.currency);
    error.value = null;
    emit("error", null);
    emit("update:modelValue", m);
  } catch (e) {
    const msg =
      e instanceof MonetraError
        ? e.message
        : `Enter up to ${currencyInfo.value.decimals} decimal places`;
    error.value = msg;
    emit("error", msg);
  }
}

function handleBlur() {
  if (inputValue.value && !error.value) {
    try {
      const m = money(inputValue.value, props.currency);
      inputValue.value = m.format({ symbol: false });
    } catch {
      // Keep current value
    }
  }
}
</script>

<template>
  <div class="money-input-wrapper">
    <label v-if="label" class="money-input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <div class="money-input-container">
      <span class="money-input-symbol">{{ currencyInfo.symbol }}</span>
      <input
        type="text"
        inputmode="decimal"
        :value="inputValue"
        @input="handleInput"
        @blur="handleBlur"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="['money-input', { 'has-error': error }]"
        :aria-invalid="!!error"
      />
      <span class="money-input-code">{{ currency }}</span>
    </div>

    <span v-if="error" class="money-input-error" role="alert">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.money-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.money-input-container {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  overflow: hidden;
}

.money-input-symbol,
.money-input-code {
  padding: 0.5rem;
  background: #f3f4f6;
  color: #6b7280;
}

.money-input {
  flex: 1;
  padding: 0.5rem;
  border: none;
  outline: none;
  font-size: 1rem;
}

.money-input.has-error {
  background: #fef2f2;
}

.money-input-error {
  color: #dc2626;
  font-size: 0.875rem;
}

.required {
  color: #dc2626;
}
</style>
```

### CurrencySelector Component

```vue
<!-- components/CurrencySelector.vue -->
<script setup lang="ts">
import { computed } from "vue";

interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

interface Props {
  modelValue: string;
  currencies?: CurrencyOption[];
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currencies: () => [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  ],
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <div class="currency-selector">
    <label v-if="label" class="selector-label">{{ label }}</label>
    <select v-model="selected" class="selector-input">
      <option
        v-for="currency in currencies"
        :key="currency.code"
        :value="currency.code"
      >
        {{ currency.symbol }} {{ currency.code }} - {{ currency.name }}
      </option>
    </select>
  </div>
</template>
```

---

## State Management (Pinia) {#pinia}

### Wallet Store

```typescript
// stores/wallet.ts
import { defineStore } from "pinia";
import { money, Money, Ledger, MonetraError } from "monetra";

interface SerializedMoney {
  minor: string;
  currency: string;
}

interface Transaction {
  id: string;
  type: "credit" | "debit" | "transfer";
  amount: SerializedMoney;
  account: string;
  toAccount?: string;
  description: string;
  timestamp: string;
}

function serialize(m: Money): SerializedMoney {
  return {
    minor: m.minor.toString(),
    currency: m.currency.code,
  };
}

function deserialize(s: SerializedMoney): Money {
  return Money.fromMinor(BigInt(s.minor), s.currency);
}

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    ledger: new Ledger({ currency: "USD" }),
    transactions: [] as Transaction[],
    error: null as string | null,
  }),

  getters: {
    balance: (state) => (account: string) => state.ledger.getBalance(account),

    allBalances: (state) => state.ledger.getAllBalances(),

    totalBalance: (state) => state.ledger.getTotalBalance(),

    transactionHistory: (state) =>
      state.transactions.map((tx) => ({
        ...tx,
        amount: deserialize(tx.amount),
      })),
  },

  actions: {
    deposit(account: string, amount: string, description: string) {
      try {
        const m = money(amount, "USD");
        const txId = this.ledger.credit(account, m, description);

        this.transactions.push({
          id: txId,
          type: "credit",
          amount: serialize(m),
          account,
          description,
          timestamp: new Date().toISOString(),
        });

        this.error = null;
        return txId;
      } catch (e) {
        this.error = e instanceof MonetraError ? e.message : "Deposit failed";
        throw e;
      }
    },

    withdraw(account: string, amount: string, description: string) {
      try {
        const m = money(amount, "USD");
        const txId = this.ledger.debit(account, m, description);

        this.transactions.push({
          id: txId,
          type: "debit",
          amount: serialize(m),
          account,
          description,
          timestamp: new Date().toISOString(),
        });

        this.error = null;
        return txId;
      } catch (e) {
        this.error =
          e instanceof MonetraError ? e.message : "Withdrawal failed";
        throw e;
      }
    },

    transfer(from: string, to: string, amount: string, description: string) {
      try {
        const m = money(amount, "USD");
        const txId = this.ledger.transfer(from, to, m, description);

        this.transactions.push({
          id: txId,
          type: "transfer",
          amount: serialize(m),
          account: from,
          toAccount: to,
          description,
          timestamp: new Date().toISOString(),
        });

        this.error = null;
        return txId;
      } catch (e) {
        this.error = e instanceof MonetraError ? e.message : "Transfer failed";
        throw e;
      }
    },
  },

  // Persist transactions (ledger reconstructed on hydration)
  persist: {
    paths: ["transactions"],
    afterRestore: (ctx) => {
      // Reconstruct ledger from transactions
      const store = ctx.store;
      store.ledger = new Ledger({ currency: "USD" });

      for (const tx of store.transactions) {
        const amount = deserialize(tx.amount);

        if (tx.type === "credit") {
          store.ledger.credit(tx.account, amount, tx.description);
        } else if (tx.type === "debit") {
          store.ledger.debit(tx.account, amount, tx.description);
        } else if (tx.type === "transfer" && tx.toAccount) {
          store.ledger.transfer(
            tx.account,
            tx.toAccount,
            amount,
            tx.description
          );
        }
      }
    },
  },
});
```

### Cart Store

```typescript
// stores/cart.ts
import { defineStore } from "pinia";
import { money, Money, RoundingMode } from "monetra";

interface CartItem {
  id: string;
  name: string;
  priceMinor: number;
  quantity: number;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
    currency: "USD",
    taxRate: 0.08,
    discountCode: null as string | null,
  }),

  getters: {
    itemCount: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    itemsWithTotals: (state) =>
      state.items.map((item) => ({
        ...item,
        price: Money.fromMinor(BigInt(item.priceMinor), state.currency),
        total: Money.fromMinor(
          BigInt(item.priceMinor * item.quantity),
          state.currency
        ),
      })),

    subtotal(): Money {
      if (this.itemsWithTotals.length === 0) {
        return money("0", this.currency);
      }
      return this.itemsWithTotals.reduce(
        (sum, item) => sum.add(item.total),
        money("0", this.currency)
      );
    },

    discount(): Money {
      const discounts: Record<string, number> = {
        SAVE10: 0.1,
        SAVE20: 0.2,
      };

      if (!this.discountCode || !discounts[this.discountCode]) {
        return money("0", this.currency);
      }

      return this.subtotal.multiply(discounts[this.discountCode], {
        rounding: RoundingMode.HALF_UP,
      });
    },

    tax(): Money {
      const taxable = this.subtotal.subtract(this.discount);
      return taxable.multiply(this.taxRate, {
        rounding: RoundingMode.HALF_UP,
      });
    },

    total(): Money {
      return this.subtotal.subtract(this.discount).add(this.tax);
    },
  },

  actions: {
    addItem(item: Omit<CartItem, "quantity">) {
      const existing = this.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...item, quantity: 1 });
      }
    },

    removeItem(id: string) {
      const index = this.items.findIndex((i) => i.id === id);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },

    updateQuantity(id: string, quantity: number) {
      const item = this.items.find((i) => i.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },

    applyDiscount(code: string) {
      this.discountCode = code.toUpperCase();
    },

    clearCart() {
      this.items = [];
      this.discountCode = null;
    },
  },
});
```

---

## Forms {#forms}

### Payment Form with VeeValidate

```vue
<!-- views/PaymentForm.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { useForm, useField } from "vee-validate";
import { money, Money, MonetraError, getCurrency } from "monetra";
import MoneyInput from "../components/MoneyInput.vue";
import CurrencySelector from "../components/CurrencySelector.vue";

const emit = defineEmits<{
  submit: [data: { amount: Money; recipient: string; note: string }];
}>();

// Form validation schema
const validationSchema = {
  amount: (value: Money | null) => {
    if (!value) return "Amount is required";
    if (value.isZero()) return "Amount must be greater than zero";
    if (value.isNegative()) return "Amount cannot be negative";
    return true;
  },
  recipient: (value: string) => {
    if (!value) return "Recipient is required";
    if (value.length < 2) return "Recipient name too short";
    return true;
  },
};

const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema,
  initialValues: {
    amount: null as Money | null,
    currency: "USD",
    recipient: "",
    note: "",
  },
});

const { value: amount, setValue: setAmount } = useField<Money | null>("amount");
const { value: currency } = useField<string>("currency");
const { value: recipient } = useField<string>("recipient");
const { value: note } = useField<string>("note");

const onSubmit = handleSubmit((values) => {
  if (!values.amount) return;

  emit("submit", {
    amount: values.amount,
    recipient: values.recipient,
    note: values.note,
  });
});
</script>

<template>
  <form @submit="onSubmit" class="payment-form">
    <div class="form-group">
      <CurrencySelector v-model="currency" label="Currency" />
    </div>

    <div class="form-group">
      <MoneyInput
        :model-value="amount"
        @update:model-value="setAmount"
        :currency="currency"
        label="Amount"
        required
      />
      <span v-if="errors.amount" class="error">{{ errors.amount }}</span>
    </div>

    <div class="form-group">
      <label>Recipient</label>
      <input v-model="recipient" type="text" placeholder="Enter recipient" />
      <span v-if="errors.recipient" class="error">{{ errors.recipient }}</span>
    </div>

    <div class="form-group">
      <label>Note (optional)</label>
      <textarea v-model="note" placeholder="Add a note"></textarea>
    </div>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? "Processing..." : "Send Payment" }}
    </button>
  </form>
</template>

<style scoped>
.payment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.error {
  color: #dc2626;
  font-size: 0.875rem;
}

button {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

---

## E-commerce {#ecommerce}

### Shopping Cart Component

```vue
<!-- components/ShoppingCart.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { money, Money, RoundingMode } from "monetra";
import MoneyDisplay from "./MoneyDisplay.vue";

interface CartItem {
  id: string;
  name: string;
  priceMinor: number;
  quantity: number;
}

interface Props {
  items: CartItem[];
  taxRate?: number;
  discountCode?: string;
}

const props = withDefaults(defineProps<Props>(), {
  taxRate: 0.08,
});

const emit = defineEmits<{
  updateQuantity: [id: string, quantity: number];
  remove: [id: string];
  checkout: [];
}>();

const discounts: Record<string, number> = {
  SAVE10: 0.1,
  SAVE20: 0.2,
};

const itemTotals = computed(() =>
  props.items.map((item) => ({
    ...item,
    price: Money.fromMinor(BigInt(item.priceMinor), "USD"),
    total: Money.fromMinor(BigInt(item.priceMinor * item.quantity), "USD"),
  }))
);

const subtotal = computed(() => {
  if (itemTotals.value.length === 0) return money("0", "USD");
  return itemTotals.value.reduce(
    (sum, item) => sum.add(item.total),
    money("0", "USD")
  );
});

const discount = computed(() => {
  if (!props.discountCode || !discounts[props.discountCode]) {
    return money("0", "USD");
  }
  return subtotal.value.multiply(discounts[props.discountCode], {
    rounding: RoundingMode.HALF_UP,
  });
});

const tax = computed(() => {
  const taxable = subtotal.value.subtract(discount.value);
  return taxable.multiply(props.taxRate, {
    rounding: RoundingMode.HALF_UP,
  });
});

const total = computed(() =>
  subtotal.value.subtract(discount.value).add(tax.value)
);
</script>

<template>
  <div class="shopping-cart">
    <h2>Shopping Cart</h2>

    <div v-if="items.length === 0" class="empty-cart">Your cart is empty</div>

    <template v-else>
      <table class="cart-items">
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
          <tr v-for="item in itemTotals" :key="item.id">
            <td>{{ item.name }}</td>
            <td><MoneyDisplay :value="item.price" /></td>
            <td>
              <input
                type="number"
                min="1"
                :value="item.quantity"
                @input="
                  emit(
                    'updateQuantity',
                    item.id,
                    parseInt(($event.target as HTMLInputElement).value) || 1
                  )
                "
                class="quantity-input"
              />
            </td>
            <td><MoneyDisplay :value="item.total" /></td>
            <td>
              <button @click="emit('remove', item.id)" class="remove-btn">
                ✕
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="cart-summary">
        <div class="summary-row">
          <span>Subtotal</span>
          <MoneyDisplay :value="subtotal" />
        </div>

        <div v-if="!discount.isZero()" class="summary-row discount">
          <span>Discount ({{ discountCode }})</span>
          <MoneyDisplay :value="discount.negate()" colorize />
        </div>

        <div class="summary-row">
          <span>Tax ({{ (taxRate * 100).toFixed(0) }}%)</span>
          <MoneyDisplay :value="tax" />
        </div>

        <div class="summary-row total">
          <span>Total</span>
          <MoneyDisplay :value="total" />
        </div>
      </div>

      <button @click="emit('checkout')" class="checkout-btn">
        Proceed to Checkout
      </button>
    </template>
  </div>
</template>

<style scoped>
.shopping-cart {
  padding: 1rem;
}

.cart-items {
  width: 100%;
  border-collapse: collapse;
}

.cart-items th,
.cart-items td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.quantity-input {
  width: 60px;
  padding: 0.25rem;
}

.remove-btn {
  background: transparent;
  border: none;
  color: #dc2626;
  cursor: pointer;
}

.cart-summary {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.summary-row.total {
  font-weight: bold;
  font-size: 1.25rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

.summary-row.discount {
  color: #16a34a;
}

.checkout-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>
```

---

## Multi-Currency Wallet {#wallet}

### Wallet Dashboard

```vue
<!-- views/WalletDashboard.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import {
  money,
  Money,
  MoneyBag,
  Converter,
  defineToken,
  RoundingMode,
} from "monetra";
import MoneyDisplay from "../components/MoneyDisplay.vue";

// Define tokens
const ETH = defineToken({
  code: "ETH",
  symbol: "Ξ",
  decimals: 18,
  type: "crypto",
});
const BTC = defineToken({
  code: "BTC",
  symbol: "₿",
  decimals: 8,
  type: "crypto",
});
const USDC = defineToken({
  code: "USDC",
  symbol: "USDC",
  decimals: 6,
  type: "crypto",
});

// Simulated balances
const balances = ref([
  { token: "USD", amount: money("5000.00", "USD") },
  { token: "ETH", amount: money("2.5", ETH) },
  { token: "BTC", amount: money("0.15", BTC) },
  { token: "USDC", amount: money("1000.00", USDC) },
]);

// Exchange rates to USD
const rates = ref({
  EUR: 0.92,
  ETH: 0.0003, // 1 USD = 0.0003 ETH (ETH @ $3,333)
  BTC: 0.000016, // 1 USD = 0.000016 BTC (BTC @ $62,500)
  USDC: 1.0,
});

const converter = computed(() => new Converter("USD", rates.value));

// Calculate USD values
const portfolioItems = computed(() => {
  return balances.value.map(({ token, amount }) => {
    let usdValue: Money;

    if (token === "USD") {
      usdValue = amount;
    } else {
      try {
        usdValue = converter.value.convert(amount, "USD");
      } catch {
        usdValue = money("0", "USD");
      }
    }

    return {
      token,
      amount,
      usdValue,
    };
  });
});

// Calculate total portfolio value
const totalValue = computed(() => {
  const bag = new MoneyBag();

  for (const item of portfolioItems.value) {
    bag.add(item.usdValue);
  }

  return bag.total("USD", converter.value);
});

// Send money modal
const showSendModal = ref(false);
const selectedToken = ref("USD");

function openSendModal(token: string) {
  selectedToken.value = token;
  showSendModal.value = true;
}
</script>

<template>
  <div class="wallet-dashboard">
    <header class="wallet-header">
      <h1>My Wallet</h1>
      <div class="total-value">
        <span class="label">Total Value</span>
        <MoneyDisplay :value="totalValue" class="total-amount" />
      </div>
    </header>

    <section class="balances">
      <h2>Balances</h2>

      <div class="balance-list">
        <div
          v-for="item in portfolioItems"
          :key="item.token"
          class="balance-card"
        >
          <div class="token-info">
            <span class="token-name">{{ item.token }}</span>
            <MoneyDisplay :value="item.amount" :show-currency="false" />
          </div>

          <div class="usd-value">≈ <MoneyDisplay :value="item.usdValue" /></div>

          <div class="actions">
            <button @click="openSendModal(item.token)" class="send-btn">
              Send
            </button>
            <button class="receive-btn">Receive</button>
          </div>
        </div>
      </div>
    </section>

    <section class="allocation">
      <h2>Allocation</h2>
      <div class="allocation-chart">
        <div
          v-for="item in portfolioItems"
          :key="item.token"
          class="allocation-bar"
          :style="{
            width: `${((Number(item.usdValue.minor) / Number(totalValue.minor)) * 100).toFixed(1)}%`,
          }"
        >
          <span>{{ item.token }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.wallet-dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.wallet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.total-value {
  text-align: right;
}

.total-value .label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
}

.total-value :deep(.total-amount) {
  font-size: 2rem;
  font-weight: bold;
}

.balance-list {
  display: grid;
  gap: 1rem;
}

.balance-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.token-info {
  display: flex;
  flex-direction: column;
}

.token-name {
  font-weight: 600;
  font-size: 1.125rem;
}

.usd-value {
  color: #6b7280;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.send-btn,
.receive-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.send-btn {
  background: #2563eb;
  color: white;
}

.receive-btn {
  background: #e5e7eb;
}

.allocation {
  margin-top: 2rem;
}

.allocation-chart {
  display: flex;
  height: 2rem;
  border-radius: 0.25rem;
  overflow: hidden;
}

.allocation-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  min-width: 40px;
}

.allocation-bar:nth-child(1) {
  background: #2563eb;
}
.allocation-bar:nth-child(2) {
  background: #7c3aed;
}
.allocation-bar:nth-child(3) {
  background: #f59e0b;
}
.allocation-bar:nth-child(4) {
  background: #10b981;
}
</style>
```

---

## Next Steps

- **[Node.js Examples](./node.md)** - Server-side patterns
- **[React Examples](./react.md)** - React.js patterns
- **[Best Practices](../best-practices.md)** - Production guidelines
