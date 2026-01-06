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
import { TokenDefinition } from "./types";
import { registerCurrency } from "../currency/registry";

/**
 * Defines a custom token that can be used with Money.
 *
 * @example
 * const ETH = defineToken({
 *   code: 'ETH',
 *   symbol: 'Ξ',
 *   decimals: 18,
 *   type: 'crypto',
 *   chainId: 1,
 * });
 *
 * const balance = money('1.5', ETH);
 */
export function defineToken(definition: {
  code: string;
  symbol: string;
  decimals: number;
  type?: "fiat" | "crypto" | "commodity" | "custom";
  locale?: string;
  chainId?: number;
  contractAddress?: string;
  standard?: string;
  coingeckoId?: string;
}): TokenDefinition {
  if (stryMutAct_9fa48("1484")) {
    {}
  } else {
    stryCov_9fa48("1484");
    const token: TokenDefinition = stryMutAct_9fa48("1485") ? {} : (stryCov_9fa48("1485"), {
      code: stryMutAct_9fa48("1486") ? definition.code.toLowerCase() : (stryCov_9fa48("1486"), definition.code.toUpperCase()),
      symbol: definition.symbol,
      decimals: definition.decimals,
      locale: definition.locale,
      type: stryMutAct_9fa48("1487") ? definition.type && "custom" : (stryCov_9fa48("1487"), definition.type ?? (stryMutAct_9fa48("1488") ? "" : (stryCov_9fa48("1488"), "custom"))),
      chainId: definition.chainId,
      contractAddress: definition.contractAddress,
      standard: definition.standard,
      coingeckoId: definition.coingeckoId
    });

    // Register so it can be used with currency codes
    registerCurrency(token);
    return Object.freeze(token);
  }
}

// Pre-defined popular crypto tokens
export const ETH = defineToken(stryMutAct_9fa48("1489") ? {} : (stryCov_9fa48("1489"), {
  code: stryMutAct_9fa48("1490") ? "" : (stryCov_9fa48("1490"), "ETH"),
  symbol: stryMutAct_9fa48("1491") ? "" : (stryCov_9fa48("1491"), "Ξ"),
  decimals: 18,
  type: stryMutAct_9fa48("1492") ? "" : (stryCov_9fa48("1492"), "crypto"),
  chainId: 1,
  coingeckoId: stryMutAct_9fa48("1493") ? "" : (stryCov_9fa48("1493"), "ethereum")
}));
export const BTC = defineToken(stryMutAct_9fa48("1494") ? {} : (stryCov_9fa48("1494"), {
  code: stryMutAct_9fa48("1495") ? "" : (stryCov_9fa48("1495"), "BTC"),
  symbol: stryMutAct_9fa48("1496") ? "" : (stryCov_9fa48("1496"), "₿"),
  decimals: 8,
  type: stryMutAct_9fa48("1497") ? "" : (stryCov_9fa48("1497"), "crypto"),
  coingeckoId: stryMutAct_9fa48("1498") ? "" : (stryCov_9fa48("1498"), "bitcoin")
}));
export const USDC = defineToken(stryMutAct_9fa48("1499") ? {} : (stryCov_9fa48("1499"), {
  code: stryMutAct_9fa48("1500") ? "" : (stryCov_9fa48("1500"), "USDC"),
  symbol: stryMutAct_9fa48("1501") ? "" : (stryCov_9fa48("1501"), "USDC"),
  decimals: 6,
  type: stryMutAct_9fa48("1502") ? "" : (stryCov_9fa48("1502"), "crypto"),
  chainId: 1,
  contractAddress: stryMutAct_9fa48("1503") ? "" : (stryCov_9fa48("1503"), "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"),
  standard: stryMutAct_9fa48("1504") ? "" : (stryCov_9fa48("1504"), "ERC-20"),
  coingeckoId: stryMutAct_9fa48("1505") ? "" : (stryCov_9fa48("1505"), "usd-coin")
}));
export const USDT = defineToken(stryMutAct_9fa48("1506") ? {} : (stryCov_9fa48("1506"), {
  code: stryMutAct_9fa48("1507") ? "" : (stryCov_9fa48("1507"), "USDT"),
  symbol: stryMutAct_9fa48("1508") ? "" : (stryCov_9fa48("1508"), "₮"),
  decimals: 6,
  type: stryMutAct_9fa48("1509") ? "" : (stryCov_9fa48("1509"), "crypto"),
  chainId: 1,
  contractAddress: stryMutAct_9fa48("1510") ? "" : (stryCov_9fa48("1510"), "0xdac17f958d2ee523a2206206994597c13d831ec7"),
  standard: stryMutAct_9fa48("1511") ? "" : (stryCov_9fa48("1511"), "ERC-20"),
  coingeckoId: stryMutAct_9fa48("1512") ? "" : (stryCov_9fa48("1512"), "tether")
}));