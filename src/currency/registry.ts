import { Currency } from "./Currency";

const registry: Map<string, Currency> = new Map();

/**
 * Registers a currency in the global registry.
 * @param currency The currency to register.
 */
export function registerCurrency(currency: Currency): void {
  registry.set(currency.code, currency);
}

/**
 * Retrieves a currency by its code.
 * @param code The currency code (e.g., "USD").
 * @returns The Currency object.
 * @throws Error if the currency is not found.
 */
export function getCurrency(code: string): Currency {
  const currency = registry.get(code);
  if (!currency) {
    throw new Error(`Currency '${code}' not found in registry.`);
  }
  return currency;
}

/**
 * Checks if a currency is registered.
 */
export function isCurrencyRegistered(code: string): boolean {
  return registry.has(code);
}

/**
 * Returns all registered currencies as a map.
 * @internal Use for testing only.
 */
export function getAllCurrencies(): Record<string, Currency> {
  return Object.fromEntries(registry);
}
