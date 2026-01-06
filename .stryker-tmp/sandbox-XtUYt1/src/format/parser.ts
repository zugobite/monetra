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
import { Currency } from "../currency/Currency";
import { InvalidPrecisionError } from "../errors";

/**
 * Options for locale-aware parsing.
 */
export interface LocaleParseOptions {
  /**
   * The locale to use for parsing (e.g., "en-US", "de-DE").
   * Used to detect decimal and grouping separators.
   */
  locale: string;
}

/**
 * Parses a locale-formatted string into a normalized decimal string.
 *
 * Handles locale-specific decimal separators (e.g., comma in German "1.234,56")
 * and grouping separators (e.g., period in German "1.234").
 *
 * @param amount - The locale-formatted amount string (e.g., "1,234.56" or "1.234,56").
 * @param options - The locale options.
 * @returns A normalized decimal string (e.g., "1234.56").
 * @example
 * parseLocaleString("1.234,56", { locale: "de-DE" }); // "1234.56"
 * parseLocaleString("1,234.56", { locale: "en-US" }); // "1234.56"
 */
export function parseLocaleString(amount: string, options: LocaleParseOptions): string {
  if (stryMutAct_9fa48("676")) {
    {}
  } else {
    stryCov_9fa48("676");
    // Use Intl.NumberFormat to determine the locale's separators
    const parts = new Intl.NumberFormat(options.locale, stryMutAct_9fa48("677") ? {} : (stryCov_9fa48("677"), {
      style: stryMutAct_9fa48("678") ? "" : (stryCov_9fa48("678"), "decimal"),
      minimumFractionDigits: 1,
      useGrouping: stryMutAct_9fa48("679") ? false : (stryCov_9fa48("679"), true)
    })).formatToParts(1234.5);
    let decimalSeparator = stryMutAct_9fa48("680") ? "" : (stryCov_9fa48("680"), ".");
    let groupSeparator = stryMutAct_9fa48("681") ? "" : (stryCov_9fa48("681"), ",");
    for (const part of parts) {
      if (stryMutAct_9fa48("682")) {
        {}
      } else {
        stryCov_9fa48("682");
        if (stryMutAct_9fa48("685") ? part.type !== "decimal" : stryMutAct_9fa48("684") ? false : stryMutAct_9fa48("683") ? true : (stryCov_9fa48("683", "684", "685"), part.type === (stryMutAct_9fa48("686") ? "" : (stryCov_9fa48("686"), "decimal")))) {
          if (stryMutAct_9fa48("687")) {
            {}
          } else {
            stryCov_9fa48("687");
            decimalSeparator = part.value;
          }
        } else if (stryMutAct_9fa48("690") ? part.type !== "group" : stryMutAct_9fa48("689") ? false : stryMutAct_9fa48("688") ? true : (stryCov_9fa48("688", "689", "690"), part.type === (stryMutAct_9fa48("691") ? "" : (stryCov_9fa48("691"), "group")))) {
          if (stryMutAct_9fa48("692")) {
            {}
          } else {
            stryCov_9fa48("692");
            groupSeparator = part.value;
          }
        }
      }
    }

    // Handle the case where group and decimal separators are the same
    // (shouldn't happen, but be defensive)
    if (stryMutAct_9fa48("695") ? groupSeparator !== decimalSeparator : stryMutAct_9fa48("694") ? false : stryMutAct_9fa48("693") ? true : (stryCov_9fa48("693", "694", "695"), groupSeparator === decimalSeparator)) {
      if (stryMutAct_9fa48("696")) {
        {}
      } else {
        stryCov_9fa48("696");
        throw new Error(stryMutAct_9fa48("697") ? `` : (stryCov_9fa48("697"), `Invalid locale configuration: group and decimal separators are the same for locale ${options.locale}`));
      }
    }

    // Remove currency symbols and whitespace
    let normalized = stryMutAct_9fa48("698") ? amount.replace(/[^\d.,\-\s]/g, "") : (stryCov_9fa48("698"), amount.replace(stryMutAct_9fa48("701") ? /[^\d.,\-\S]/g : stryMutAct_9fa48("700") ? /[^\D.,\-\s]/g : stryMutAct_9fa48("699") ? /[\d.,\-\s]/g : (stryCov_9fa48("699", "700", "701"), /[^\d.,\-\s]/g), stryMutAct_9fa48("702") ? "Stryker was here!" : (stryCov_9fa48("702"), "")).trim());

    // Handle negative sign
    const isNegative = stryMutAct_9fa48("705") ? normalized.startsWith("-") && amount.includes("(") : stryMutAct_9fa48("704") ? false : stryMutAct_9fa48("703") ? true : (stryCov_9fa48("703", "704", "705"), (stryMutAct_9fa48("706") ? normalized.endsWith("-") : (stryCov_9fa48("706"), normalized.startsWith(stryMutAct_9fa48("707") ? "" : (stryCov_9fa48("707"), "-")))) || amount.includes(stryMutAct_9fa48("708") ? "" : (stryCov_9fa48("708"), "(")));
    normalized = normalized.replace(stryMutAct_9fa48("709") ? /[^-()]/g : (stryCov_9fa48("709"), /[-()]/g), stryMutAct_9fa48("710") ? "Stryker was here!" : (stryCov_9fa48("710"), ""));

    // Remove all grouping separators
    const groupRegex = new RegExp(stryMutAct_9fa48("711") ? `` : (stryCov_9fa48("711"), `\\${groupSeparator}`), stryMutAct_9fa48("712") ? "" : (stryCov_9fa48("712"), "g"));
    normalized = normalized.replace(groupRegex, stryMutAct_9fa48("713") ? "Stryker was here!" : (stryCov_9fa48("713"), ""));

    // Replace locale decimal separator with standard period
    if (stryMutAct_9fa48("716") ? decimalSeparator === "." : stryMutAct_9fa48("715") ? false : stryMutAct_9fa48("714") ? true : (stryCov_9fa48("714", "715", "716"), decimalSeparator !== (stryMutAct_9fa48("717") ? "" : (stryCov_9fa48("717"), ".")))) {
      if (stryMutAct_9fa48("718")) {
        {}
      } else {
        stryCov_9fa48("718");
        normalized = normalized.replace(decimalSeparator, stryMutAct_9fa48("719") ? "" : (stryCov_9fa48("719"), "."));
      }
    }
    return isNegative ? stryMutAct_9fa48("720") ? `` : (stryCov_9fa48("720"), `-${normalized}`) : normalized;
  }
}

/**
 * Parses a locale-formatted amount string and converts it to Money minor units.
 *
 * This is a convenience function that combines locale parsing with currency validation.
 *
 * @param amount - The locale-formatted amount string.
 * @param currency - The currency to validate against.
 * @param options - The locale options.
 * @returns The amount in minor units as a BigInt.
 * @throws {InvalidPrecisionError} If the precision exceeds the currency's decimals.
 * @example
 * parseLocaleToMinor("1.234,56", EUR, { locale: "de-DE" }); // 123456n
 */
export function parseLocaleToMinor(amount: string, currency: Currency, options: LocaleParseOptions): bigint {
  if (stryMutAct_9fa48("721")) {
    {}
  } else {
    stryCov_9fa48("721");
    const normalized = parseLocaleString(amount, options);
    return parseToMinor(normalized, currency);
  }
}

/**
 * Parses a string representation of a major unit amount into minor units.
 *
 * Validates the input format to ensure it is a valid decimal number without
 * scientific notation or ambiguous characters. Checks that the precision
 * does not exceed the currency's allowed decimals.
 *
 * @param amount - The amount string (e.g., "10.50").
 * @param currency - The currency to validate against.
 * @returns The amount in minor units as a BigInt.
 * @throws {Error} If the format is invalid (scientific notation, non-numeric chars).
 * @throws {InvalidPrecisionError} If the precision exceeds the currency's decimals.
 */
export function parseToMinor(amount: string, currency: Currency): bigint {
  if (stryMutAct_9fa48("722")) {
    {}
  } else {
    stryCov_9fa48("722");
    // Validate format
    if (stryMutAct_9fa48("724") ? false : stryMutAct_9fa48("723") ? true : (stryCov_9fa48("723", "724"), (stryMutAct_9fa48("725") ? /[^eE]/ : (stryCov_9fa48("725"), /[eE]/)).test(amount))) {
      if (stryMutAct_9fa48("726")) {
        {}
      } else {
        stryCov_9fa48("726");
        throw new Error(stryMutAct_9fa48("727") ? "" : (stryCov_9fa48("727"), "Scientific notation not supported"));
      }
    }

    // Reject ambiguous separators (commas, spaces, etc.)
    if (stryMutAct_9fa48("729") ? false : stryMutAct_9fa48("728") ? true : (stryCov_9fa48("728", "729"), (stryMutAct_9fa48("730") ? /[0-9.-]/ : (stryCov_9fa48("730"), /[^0-9.-]/)).test(amount))) {
      if (stryMutAct_9fa48("731")) {
        {}
      } else {
        stryCov_9fa48("731");
        throw new Error(stryMutAct_9fa48("732") ? "" : (stryCov_9fa48("732"), "Invalid characters in amount"));
      }
    }
    const parts = amount.split(stryMutAct_9fa48("733") ? "" : (stryCov_9fa48("733"), "."));
    if (stryMutAct_9fa48("737") ? parts.length <= 2 : stryMutAct_9fa48("736") ? parts.length >= 2 : stryMutAct_9fa48("735") ? false : stryMutAct_9fa48("734") ? true : (stryCov_9fa48("734", "735", "736", "737"), parts.length > 2)) {
      if (stryMutAct_9fa48("738")) {
        {}
      } else {
        stryCov_9fa48("738");
        throw new Error(stryMutAct_9fa48("739") ? "" : (stryCov_9fa48("739"), "Invalid format: multiple decimal points"));
      }
    }
    const integerPart = parts[0];
    const fractionalPart = stryMutAct_9fa48("742") ? parts[1] && "" : stryMutAct_9fa48("741") ? false : stryMutAct_9fa48("740") ? true : (stryCov_9fa48("740", "741", "742"), parts[1] || (stryMutAct_9fa48("743") ? "Stryker was here!" : (stryCov_9fa48("743"), "")));
    if (stryMutAct_9fa48("747") ? fractionalPart.length <= currency.decimals : stryMutAct_9fa48("746") ? fractionalPart.length >= currency.decimals : stryMutAct_9fa48("745") ? false : stryMutAct_9fa48("744") ? true : (stryCov_9fa48("744", "745", "746", "747"), fractionalPart.length > currency.decimals)) {
      if (stryMutAct_9fa48("748")) {
        {}
      } else {
        stryCov_9fa48("748");
        throw new InvalidPrecisionError(stryMutAct_9fa48("749") ? `` : (stryCov_9fa48("749"), `Precision ${fractionalPart.length} exceeds currency decimals ${currency.decimals}`));
      }
    }

    // Pad fractional part
    const paddedFractional = fractionalPart.padEnd(currency.decimals, stryMutAct_9fa48("750") ? "" : (stryCov_9fa48("750"), "0"));
    const combined = stryMutAct_9fa48("751") ? integerPart - paddedFractional : (stryCov_9fa48("751"), integerPart + paddedFractional);

    // Handle edge case where integer part is just "-"
    if (stryMutAct_9fa48("754") ? combined === "-" && combined === "" : stryMutAct_9fa48("753") ? false : stryMutAct_9fa48("752") ? true : (stryCov_9fa48("752", "753", "754"), (stryMutAct_9fa48("756") ? combined !== "-" : stryMutAct_9fa48("755") ? false : (stryCov_9fa48("755", "756"), combined === (stryMutAct_9fa48("757") ? "" : (stryCov_9fa48("757"), "-")))) || (stryMutAct_9fa48("759") ? combined !== "" : stryMutAct_9fa48("758") ? false : (stryCov_9fa48("758", "759"), combined === (stryMutAct_9fa48("760") ? "Stryker was here!" : (stryCov_9fa48("760"), "")))))) {
      if (stryMutAct_9fa48("761")) {
        {}
      } else {
        stryCov_9fa48("761");
        throw new Error(stryMutAct_9fa48("762") ? "" : (stryCov_9fa48("762"), "Invalid format"));
      }
    }
    return BigInt(combined);
  }
}