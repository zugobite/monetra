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
import { Money } from "../money/Money";

/**
 * Options for formatting Money values.
 */
export interface FormatOptions {
  /**
   * The locale to use for formatting (e.g., "en-US", "de-DE").
   * If not provided, defaults to the currency's default locale or "en-US".
   */
  locale?: string;

  /**
   * Whether to include the currency symbol in the output.
   * Defaults to true.
   */
  symbol?: boolean;

  /**
   * How to display the currency.
   * 'symbol' (default): "$1.00"
   * 'code': "USD 1.00"
   * 'name': "1.00 US dollars"
   */
  display?: "symbol" | "code" | "name";

  /**
   * Whether to use accounting format for negative numbers.
   * When true, negative values are wrapped in parentheses instead of using a minus sign.
   * Defaults to false.
   * @example
   * // accounting: false (default): "-$1.00"
   * // accounting: true: "($1.00)"
   */
  accounting?: boolean;
}

/**
 * Formats a Money object into a string representation.
 *
 * Uses `Intl.NumberFormat` for locale-aware formatting of numbers and currency symbols.
 *
 * @param money - The Money object to format.
 * @param options - Formatting options.
 * @returns The formatted string.
 */
export function format(money: Money, options?: FormatOptions): string {
  if (stryMutAct_9fa48("553")) {
    {}
  } else {
    stryCov_9fa48("553");
    const locale = stryMutAct_9fa48("556") ? (options?.locale || money.currency.locale) && "en-US" : stryMutAct_9fa48("555") ? false : stryMutAct_9fa48("554") ? true : (stryCov_9fa48("554", "555", "556"), (stryMutAct_9fa48("558") ? options?.locale && money.currency.locale : stryMutAct_9fa48("557") ? false : (stryCov_9fa48("557", "558"), (stryMutAct_9fa48("559") ? options.locale : (stryCov_9fa48("559"), options?.locale)) || money.currency.locale)) || (stryMutAct_9fa48("560") ? "" : (stryCov_9fa48("560"), "en-US")));
    const showSymbol = stryMutAct_9fa48("561") ? options?.symbol && true : (stryCov_9fa48("561"), (stryMutAct_9fa48("562") ? options.symbol : (stryCov_9fa48("562"), options?.symbol)) ?? (stryMutAct_9fa48("563") ? false : (stryCov_9fa48("563"), true)));
    const display = stryMutAct_9fa48("566") ? options?.display && "symbol" : stryMutAct_9fa48("565") ? false : stryMutAct_9fa48("564") ? true : (stryCov_9fa48("564", "565", "566"), (stryMutAct_9fa48("567") ? options.display : (stryCov_9fa48("567"), options?.display)) || (stryMutAct_9fa48("568") ? "" : (stryCov_9fa48("568"), "symbol")));
    const useAccounting = stryMutAct_9fa48("569") ? options?.accounting && false : (stryCov_9fa48("569"), (stryMutAct_9fa48("570") ? options.accounting : (stryCov_9fa48("570"), options?.accounting)) ?? (stryMutAct_9fa48("571") ? true : (stryCov_9fa48("571"), false)));
    const decimals = money.currency.decimals;
    const minor = money.minor;
    const isNegative = stryMutAct_9fa48("575") ? minor >= 0n : stryMutAct_9fa48("574") ? minor <= 0n : stryMutAct_9fa48("573") ? false : stryMutAct_9fa48("572") ? true : (stryCov_9fa48("572", "573", "574", "575"), minor < 0n);
    const absMinor = isNegative ? stryMutAct_9fa48("576") ? +minor : (stryCov_9fa48("576"), -minor) : minor;
    const divisor = 10n ** BigInt(decimals);
    const integerPart = stryMutAct_9fa48("577") ? absMinor * divisor : (stryCov_9fa48("577"), absMinor / divisor);
    const fractionalPart = stryMutAct_9fa48("578") ? absMinor * divisor : (stryCov_9fa48("578"), absMinor % divisor);

    // Pad fractional
    const fractionalStr = fractionalPart.toString().padStart(decimals, stryMutAct_9fa48("579") ? "" : (stryCov_9fa48("579"), "0"));

    // Get separators
    // We use a dummy format to extract the decimal separator for the locale
    const parts = new Intl.NumberFormat(locale, stryMutAct_9fa48("580") ? {} : (stryCov_9fa48("580"), {
      style: stryMutAct_9fa48("581") ? "" : (stryCov_9fa48("581"), "decimal"),
      minimumFractionDigits: 1
    })).formatToParts(1.1);
    const decimalSeparator = stryMutAct_9fa48("584") ? parts.find(p => p.type === "decimal")?.value && "." : stryMutAct_9fa48("583") ? false : stryMutAct_9fa48("582") ? true : (stryCov_9fa48("582", "583", "584"), (stryMutAct_9fa48("585") ? parts.find(p => p.type === "decimal").value : (stryCov_9fa48("585"), parts.find(stryMutAct_9fa48("586") ? () => undefined : (stryCov_9fa48("586"), p => stryMutAct_9fa48("589") ? p.type !== "decimal" : stryMutAct_9fa48("588") ? false : stryMutAct_9fa48("587") ? true : (stryCov_9fa48("587", "588", "589"), p.type === (stryMutAct_9fa48("590") ? "" : (stryCov_9fa48("590"), "decimal")))))?.value)) || (stryMutAct_9fa48("591") ? "" : (stryCov_9fa48("591"), ".")));

    // Format integer part with grouping using Intl (supports BigInt)
    const integerFormatted = new Intl.NumberFormat(locale, stryMutAct_9fa48("592") ? {} : (stryCov_9fa48("592"), {
      style: stryMutAct_9fa48("593") ? "" : (stryCov_9fa48("593"), "decimal"),
      useGrouping: stryMutAct_9fa48("594") ? false : (stryCov_9fa48("594"), true)
    })).format(integerPart);
    const absString = (stryMutAct_9fa48("598") ? decimals <= 0 : stryMutAct_9fa48("597") ? decimals >= 0 : stryMutAct_9fa48("596") ? false : stryMutAct_9fa48("595") ? true : (stryCov_9fa48("595", "596", "597", "598"), decimals > 0)) ? stryMutAct_9fa48("599") ? `` : (stryCov_9fa48("599"), `${integerFormatted}${decimalSeparator}${fractionalStr}`) : integerFormatted;
    if (stryMutAct_9fa48("602") ? false : stryMutAct_9fa48("601") ? true : stryMutAct_9fa48("600") ? showSymbol : (stryCov_9fa48("600", "601", "602"), !showSymbol)) {
      if (stryMutAct_9fa48("603")) {
        {}
      } else {
        stryCov_9fa48("603");
        if (stryMutAct_9fa48("605") ? false : stryMutAct_9fa48("604") ? true : (stryCov_9fa48("604", "605"), isNegative)) {
          if (stryMutAct_9fa48("606")) {
            {}
          } else {
            stryCov_9fa48("606");
            return useAccounting ? stryMutAct_9fa48("607") ? `` : (stryCov_9fa48("607"), `(${absString})`) : stryMutAct_9fa48("608") ? `` : (stryCov_9fa48("608"), `-${absString}`);
          }
        }
        return absString;
      }
    }

    // Use formatToParts to get the template (sign position, currency position)
    let templateParts: Intl.NumberFormatPart[];
    try {
      if (stryMutAct_9fa48("609")) {
        {}
      } else {
        stryCov_9fa48("609");
        templateParts = new Intl.NumberFormat(locale, stryMutAct_9fa48("610") ? {} : (stryCov_9fa48("610"), {
          style: stryMutAct_9fa48("611") ? "" : (stryCov_9fa48("611"), "currency"),
          currency: money.currency.code,
          currencyDisplay: display
        })).formatToParts(isNegative ? stryMutAct_9fa48("612") ? +1 : (stryCov_9fa48("612"), -1) : 1);
      }
    } catch (e) {
      if (stryMutAct_9fa48("613")) {
        {}
      } else {
        stryCov_9fa48("613");
        // Fallback for custom currencies or invalid codes
        const symbol = (stryMutAct_9fa48("616") ? display !== "symbol" : stryMutAct_9fa48("615") ? false : stryMutAct_9fa48("614") ? true : (stryCov_9fa48("614", "615", "616"), display === (stryMutAct_9fa48("617") ? "" : (stryCov_9fa48("617"), "symbol")))) ? money.currency.symbol : money.currency.code;
        if (stryMutAct_9fa48("619") ? false : stryMutAct_9fa48("618") ? true : (stryCov_9fa48("618", "619"), isNegative)) {
          if (stryMutAct_9fa48("620")) {
            {}
          } else {
            stryCov_9fa48("620");
            return useAccounting ? stryMutAct_9fa48("621") ? `` : (stryCov_9fa48("621"), `(${symbol}${absString})`) : stryMutAct_9fa48("622") ? `` : (stryCov_9fa48("622"), `-${symbol}${absString}`);
          }
        }
        return stryMutAct_9fa48("623") ? `` : (stryCov_9fa48("623"), `${symbol}${absString}`);
      }
    }
    let result = stryMutAct_9fa48("624") ? "Stryker was here!" : (stryCov_9fa48("624"), "");
    let numberInserted = stryMutAct_9fa48("625") ? true : (stryCov_9fa48("625"), false);
    let hasMinusSign = stryMutAct_9fa48("626") ? true : (stryCov_9fa48("626"), false);
    for (const part of templateParts) {
      if (stryMutAct_9fa48("627")) {
        {}
      } else {
        stryCov_9fa48("627");
        if (stryMutAct_9fa48("630") ? part.type !== "minusSign" : stryMutAct_9fa48("629") ? false : stryMutAct_9fa48("628") ? true : (stryCov_9fa48("628", "629", "630"), part.type === (stryMutAct_9fa48("631") ? "" : (stryCov_9fa48("631"), "minusSign")))) {
          if (stryMutAct_9fa48("632")) {
            {}
          } else {
            stryCov_9fa48("632");
            hasMinusSign = stryMutAct_9fa48("633") ? false : (stryCov_9fa48("633"), true);
            // Skip the minus sign, we'll handle it later for accounting format
            if (stryMutAct_9fa48("636") ? false : stryMutAct_9fa48("635") ? true : stryMutAct_9fa48("634") ? useAccounting : (stryCov_9fa48("634", "635", "636"), !useAccounting)) {
              if (stryMutAct_9fa48("637")) {
                {}
              } else {
                stryCov_9fa48("637");
                stryMutAct_9fa48("638") ? result -= part.value : (stryCov_9fa48("638"), result += part.value);
              }
            }
            continue;
          }
        }
        if (stryMutAct_9fa48("640") ? false : stryMutAct_9fa48("639") ? true : (stryCov_9fa48("639", "640"), (stryMutAct_9fa48("641") ? [] : (stryCov_9fa48("641"), [stryMutAct_9fa48("642") ? "" : (stryCov_9fa48("642"), "integer"), stryMutAct_9fa48("643") ? "" : (stryCov_9fa48("643"), "group"), stryMutAct_9fa48("644") ? "" : (stryCov_9fa48("644"), "decimal"), stryMutAct_9fa48("645") ? "" : (stryCov_9fa48("645"), "fraction")])).includes(part.type))) {
          if (stryMutAct_9fa48("646")) {
            {}
          } else {
            stryCov_9fa48("646");
            if (stryMutAct_9fa48("649") ? false : stryMutAct_9fa48("648") ? true : stryMutAct_9fa48("647") ? numberInserted : (stryCov_9fa48("647", "648", "649"), !numberInserted)) {
              if (stryMutAct_9fa48("650")) {
                {}
              } else {
                stryCov_9fa48("650");
                stryMutAct_9fa48("651") ? result -= absString : (stryCov_9fa48("651"), result += absString);
                numberInserted = stryMutAct_9fa48("652") ? false : (stryCov_9fa48("652"), true);
              }
            }
          }
        } else if (stryMutAct_9fa48("655") ? part.type !== "currency" : stryMutAct_9fa48("654") ? false : stryMutAct_9fa48("653") ? true : (stryCov_9fa48("653", "654", "655"), part.type === (stryMutAct_9fa48("656") ? "" : (stryCov_9fa48("656"), "currency")))) {
          if (stryMutAct_9fa48("657")) {
            {}
          } else {
            stryCov_9fa48("657");
            if (stryMutAct_9fa48("660") ? display === "symbol" || money.currency.symbol : stryMutAct_9fa48("659") ? false : stryMutAct_9fa48("658") ? true : (stryCov_9fa48("658", "659", "660"), (stryMutAct_9fa48("662") ? display !== "symbol" : stryMutAct_9fa48("661") ? true : (stryCov_9fa48("661", "662"), display === (stryMutAct_9fa48("663") ? "" : (stryCov_9fa48("663"), "symbol")))) && money.currency.symbol)) {
              if (stryMutAct_9fa48("664")) {
                {}
              } else {
                stryCov_9fa48("664");
                stryMutAct_9fa48("665") ? result -= money.currency.symbol : (stryCov_9fa48("665"), result += money.currency.symbol);
              }
            } else {
              if (stryMutAct_9fa48("666")) {
                {}
              } else {
                stryCov_9fa48("666");
                stryMutAct_9fa48("667") ? result -= part.value : (stryCov_9fa48("667"), result += part.value);
              }
            }
          }
        } else {
          if (stryMutAct_9fa48("668")) {
            {}
          } else {
            stryCov_9fa48("668");
            stryMutAct_9fa48("669") ? result -= part.value : (stryCov_9fa48("669"), result += part.value); // literals, parentheses, etc.
          }
        }
      }
    }

    // Apply accounting format if negative
    if (stryMutAct_9fa48("672") ? useAccounting || isNegative : stryMutAct_9fa48("671") ? false : stryMutAct_9fa48("670") ? true : (stryCov_9fa48("670", "671", "672"), useAccounting && isNegative)) {
      if (stryMutAct_9fa48("673")) {
        {}
      } else {
        stryCov_9fa48("673");
        return stryMutAct_9fa48("674") ? `` : (stryCov_9fa48("674"), `(${stryMutAct_9fa48("675") ? result : (stryCov_9fa48("675"), result.trim())})`);
      }
    }
    return result;
  }
}