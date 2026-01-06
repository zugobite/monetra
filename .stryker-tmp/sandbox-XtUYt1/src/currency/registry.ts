// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Currency } from "./Currency";
const registry: Map<string, Currency> = new Map();

/**
 * Registers a currency in the global registry.
 * @param currency The currency to register.
 */
export function registerCurrency(currency: Currency): void {
  if (stryMutAct_9fa48("234")) {
    {}
  } else {
    stryCov_9fa48("234");
    registry.set(currency.code, currency);
  }
}

/**
 * Retrieves a currency by its code.
 * @param code The currency code (e.g., "USD").
 * @returns The Currency object.
 * @throws Error if the currency is not found.
 */
export function getCurrency(code: string): Currency {
  if (stryMutAct_9fa48("235")) {
    {}
  } else {
    stryCov_9fa48("235");
    const currency = registry.get(code);
    if (stryMutAct_9fa48("238") ? false : stryMutAct_9fa48("237") ? true : stryMutAct_9fa48("236") ? currency : (stryCov_9fa48("236", "237", "238"), !currency)) {
      if (stryMutAct_9fa48("239")) {
        {}
      } else {
        stryCov_9fa48("239");
        throw new Error(stryMutAct_9fa48("240") ? `` : (stryCov_9fa48("240"), `Currency '${code}' not found in registry.`));
      }
    }
    return currency;
  }
}

/**
 * Checks if a currency is registered.
 */
export function isCurrencyRegistered(code: string): boolean {
  if (stryMutAct_9fa48("241")) {
    {}
  } else {
    stryCov_9fa48("241");
    return registry.has(code);
  }
}

/**
 * Returns all registered currencies as a map.
 * @internal Use for testing only.
 */
export function getAllCurrencies(): Record<string, Currency> {
  if (stryMutAct_9fa48("242")) {
    {}
  } else {
    stryCov_9fa48("242");
    return Object.fromEntries(registry);
  }
}