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
import { registerCurrency } from "./registry";

// ============================================================================
// MAJOR WORLD CURRENCIES
// ============================================================================

/**
 * United States Dollar (USD).
 */
export const USD: Currency = stryMutAct_9fa48("0") ? {} : (stryCov_9fa48("0"), {
  code: stryMutAct_9fa48("1") ? "" : (stryCov_9fa48("1"), "USD"),
  decimals: 2,
  symbol: stryMutAct_9fa48("2") ? "" : (stryCov_9fa48("2"), "$"),
  locale: stryMutAct_9fa48("3") ? "" : (stryCov_9fa48("3"), "en-US")
});
registerCurrency(USD);

/**
 * Euro (EUR).
 */
export const EUR: Currency = stryMutAct_9fa48("4") ? {} : (stryCov_9fa48("4"), {
  code: stryMutAct_9fa48("5") ? "" : (stryCov_9fa48("5"), "EUR"),
  decimals: 2,
  symbol: stryMutAct_9fa48("6") ? "" : (stryCov_9fa48("6"), "€"),
  locale: stryMutAct_9fa48("7") ? "" : (stryCov_9fa48("7"), "de-DE")
});
registerCurrency(EUR);

/**
 * British Pound Sterling (GBP).
 */
export const GBP: Currency = stryMutAct_9fa48("8") ? {} : (stryCov_9fa48("8"), {
  code: stryMutAct_9fa48("9") ? "" : (stryCov_9fa48("9"), "GBP"),
  decimals: 2,
  symbol: stryMutAct_9fa48("10") ? "" : (stryCov_9fa48("10"), "£"),
  locale: stryMutAct_9fa48("11") ? "" : (stryCov_9fa48("11"), "en-GB")
});
registerCurrency(GBP);

/**
 * Japanese Yen (JPY).
 */
export const JPY: Currency = stryMutAct_9fa48("12") ? {} : (stryCov_9fa48("12"), {
  code: stryMutAct_9fa48("13") ? "" : (stryCov_9fa48("13"), "JPY"),
  decimals: 0,
  symbol: stryMutAct_9fa48("14") ? "" : (stryCov_9fa48("14"), "¥"),
  locale: stryMutAct_9fa48("15") ? "" : (stryCov_9fa48("15"), "ja-JP")
});
registerCurrency(JPY);

/**
 * Swiss Franc (CHF).
 */
export const CHF: Currency = stryMutAct_9fa48("16") ? {} : (stryCov_9fa48("16"), {
  code: stryMutAct_9fa48("17") ? "" : (stryCov_9fa48("17"), "CHF"),
  decimals: 2,
  symbol: stryMutAct_9fa48("18") ? "" : (stryCov_9fa48("18"), "CHF"),
  locale: stryMutAct_9fa48("19") ? "" : (stryCov_9fa48("19"), "de-CH")
});
registerCurrency(CHF);

/**
 * Canadian Dollar (CAD).
 */
export const CAD: Currency = stryMutAct_9fa48("20") ? {} : (stryCov_9fa48("20"), {
  code: stryMutAct_9fa48("21") ? "" : (stryCov_9fa48("21"), "CAD"),
  decimals: 2,
  symbol: stryMutAct_9fa48("22") ? "" : (stryCov_9fa48("22"), "CA$"),
  locale: stryMutAct_9fa48("23") ? "" : (stryCov_9fa48("23"), "en-CA")
});
registerCurrency(CAD);

/**
 * Australian Dollar (AUD).
 */
export const AUD: Currency = stryMutAct_9fa48("24") ? {} : (stryCov_9fa48("24"), {
  code: stryMutAct_9fa48("25") ? "" : (stryCov_9fa48("25"), "AUD"),
  decimals: 2,
  symbol: stryMutAct_9fa48("26") ? "" : (stryCov_9fa48("26"), "A$"),
  locale: stryMutAct_9fa48("27") ? "" : (stryCov_9fa48("27"), "en-AU")
});
registerCurrency(AUD);

/**
 * New Zealand Dollar (NZD).
 */
export const NZD: Currency = stryMutAct_9fa48("28") ? {} : (stryCov_9fa48("28"), {
  code: stryMutAct_9fa48("29") ? "" : (stryCov_9fa48("29"), "NZD"),
  decimals: 2,
  symbol: stryMutAct_9fa48("30") ? "" : (stryCov_9fa48("30"), "NZ$"),
  locale: stryMutAct_9fa48("31") ? "" : (stryCov_9fa48("31"), "en-NZ")
});
registerCurrency(NZD);

/**
 * Chinese Yuan Renminbi (CNY).
 */
export const CNY: Currency = stryMutAct_9fa48("32") ? {} : (stryCov_9fa48("32"), {
  code: stryMutAct_9fa48("33") ? "" : (stryCov_9fa48("33"), "CNY"),
  decimals: 2,
  symbol: stryMutAct_9fa48("34") ? "" : (stryCov_9fa48("34"), "¥"),
  locale: stryMutAct_9fa48("35") ? "" : (stryCov_9fa48("35"), "zh-CN")
});
registerCurrency(CNY);

/**
 * Hong Kong Dollar (HKD).
 */
export const HKD: Currency = stryMutAct_9fa48("36") ? {} : (stryCov_9fa48("36"), {
  code: stryMutAct_9fa48("37") ? "" : (stryCov_9fa48("37"), "HKD"),
  decimals: 2,
  symbol: stryMutAct_9fa48("38") ? "" : (stryCov_9fa48("38"), "HK$"),
  locale: stryMutAct_9fa48("39") ? "" : (stryCov_9fa48("39"), "zh-HK")
});
registerCurrency(HKD);

/**
 * Singapore Dollar (SGD).
 */
export const SGD: Currency = stryMutAct_9fa48("40") ? {} : (stryCov_9fa48("40"), {
  code: stryMutAct_9fa48("41") ? "" : (stryCov_9fa48("41"), "SGD"),
  decimals: 2,
  symbol: stryMutAct_9fa48("42") ? "" : (stryCov_9fa48("42"), "S$"),
  locale: stryMutAct_9fa48("43") ? "" : (stryCov_9fa48("43"), "en-SG")
});
registerCurrency(SGD);

/**
 * South Korean Won (KRW).
 */
export const KRW: Currency = stryMutAct_9fa48("44") ? {} : (stryCov_9fa48("44"), {
  code: stryMutAct_9fa48("45") ? "" : (stryCov_9fa48("45"), "KRW"),
  decimals: 0,
  symbol: stryMutAct_9fa48("46") ? "" : (stryCov_9fa48("46"), "₩"),
  locale: stryMutAct_9fa48("47") ? "" : (stryCov_9fa48("47"), "ko-KR")
});
registerCurrency(KRW);

/**
 * Indian Rupee (INR).
 */
export const INR: Currency = stryMutAct_9fa48("48") ? {} : (stryCov_9fa48("48"), {
  code: stryMutAct_9fa48("49") ? "" : (stryCov_9fa48("49"), "INR"),
  decimals: 2,
  symbol: stryMutAct_9fa48("50") ? "" : (stryCov_9fa48("50"), "₹"),
  locale: stryMutAct_9fa48("51") ? "" : (stryCov_9fa48("51"), "en-IN")
});
registerCurrency(INR);

// ============================================================================
// EUROPEAN CURRENCIES
// ============================================================================

/**
 * Swedish Krona (SEK).
 */
export const SEK: Currency = stryMutAct_9fa48("52") ? {} : (stryCov_9fa48("52"), {
  code: stryMutAct_9fa48("53") ? "" : (stryCov_9fa48("53"), "SEK"),
  decimals: 2,
  symbol: stryMutAct_9fa48("54") ? "" : (stryCov_9fa48("54"), "kr"),
  locale: stryMutAct_9fa48("55") ? "" : (stryCov_9fa48("55"), "sv-SE")
});
registerCurrency(SEK);

/**
 * Norwegian Krone (NOK).
 */
export const NOK: Currency = stryMutAct_9fa48("56") ? {} : (stryCov_9fa48("56"), {
  code: stryMutAct_9fa48("57") ? "" : (stryCov_9fa48("57"), "NOK"),
  decimals: 2,
  symbol: stryMutAct_9fa48("58") ? "" : (stryCov_9fa48("58"), "kr"),
  locale: stryMutAct_9fa48("59") ? "" : (stryCov_9fa48("59"), "nb-NO")
});
registerCurrency(NOK);

/**
 * Danish Krone (DKK).
 */
export const DKK: Currency = stryMutAct_9fa48("60") ? {} : (stryCov_9fa48("60"), {
  code: stryMutAct_9fa48("61") ? "" : (stryCov_9fa48("61"), "DKK"),
  decimals: 2,
  symbol: stryMutAct_9fa48("62") ? "" : (stryCov_9fa48("62"), "kr"),
  locale: stryMutAct_9fa48("63") ? "" : (stryCov_9fa48("63"), "da-DK")
});
registerCurrency(DKK);

/**
 * Polish Zloty (PLN).
 */
export const PLN: Currency = stryMutAct_9fa48("64") ? {} : (stryCov_9fa48("64"), {
  code: stryMutAct_9fa48("65") ? "" : (stryCov_9fa48("65"), "PLN"),
  decimals: 2,
  symbol: stryMutAct_9fa48("66") ? "" : (stryCov_9fa48("66"), "zł"),
  locale: stryMutAct_9fa48("67") ? "" : (stryCov_9fa48("67"), "pl-PL")
});
registerCurrency(PLN);

/**
 * Czech Koruna (CZK).
 */
export const CZK: Currency = stryMutAct_9fa48("68") ? {} : (stryCov_9fa48("68"), {
  code: stryMutAct_9fa48("69") ? "" : (stryCov_9fa48("69"), "CZK"),
  decimals: 2,
  symbol: stryMutAct_9fa48("70") ? "" : (stryCov_9fa48("70"), "Kč"),
  locale: stryMutAct_9fa48("71") ? "" : (stryCov_9fa48("71"), "cs-CZ")
});
registerCurrency(CZK);

/**
 * Hungarian Forint (HUF).
 */
export const HUF: Currency = stryMutAct_9fa48("72") ? {} : (stryCov_9fa48("72"), {
  code: stryMutAct_9fa48("73") ? "" : (stryCov_9fa48("73"), "HUF"),
  decimals: 2,
  symbol: stryMutAct_9fa48("74") ? "" : (stryCov_9fa48("74"), "Ft"),
  locale: stryMutAct_9fa48("75") ? "" : (stryCov_9fa48("75"), "hu-HU")
});
registerCurrency(HUF);

/**
 * Romanian Leu (RON).
 */
export const RON: Currency = stryMutAct_9fa48("76") ? {} : (stryCov_9fa48("76"), {
  code: stryMutAct_9fa48("77") ? "" : (stryCov_9fa48("77"), "RON"),
  decimals: 2,
  symbol: stryMutAct_9fa48("78") ? "" : (stryCov_9fa48("78"), "lei"),
  locale: stryMutAct_9fa48("79") ? "" : (stryCov_9fa48("79"), "ro-RO")
});
registerCurrency(RON);

/**
 * Bulgarian Lev (BGN).
 */
export const BGN: Currency = stryMutAct_9fa48("80") ? {} : (stryCov_9fa48("80"), {
  code: stryMutAct_9fa48("81") ? "" : (stryCov_9fa48("81"), "BGN"),
  decimals: 2,
  symbol: stryMutAct_9fa48("82") ? "" : (stryCov_9fa48("82"), "лв"),
  locale: stryMutAct_9fa48("83") ? "" : (stryCov_9fa48("83"), "bg-BG")
});
registerCurrency(BGN);

/**
 * Croatian Kuna (HRK).
 * Note: Croatia adopted EUR on Jan 1, 2023, but HRK may still be needed for historical data.
 */
export const HRK: Currency = stryMutAct_9fa48("84") ? {} : (stryCov_9fa48("84"), {
  code: stryMutAct_9fa48("85") ? "" : (stryCov_9fa48("85"), "HRK"),
  decimals: 2,
  symbol: stryMutAct_9fa48("86") ? "" : (stryCov_9fa48("86"), "kn"),
  locale: stryMutAct_9fa48("87") ? "" : (stryCov_9fa48("87"), "hr-HR")
});
registerCurrency(HRK);

/**
 * Turkish Lira (TRY).
 */
export const TRY: Currency = stryMutAct_9fa48("88") ? {} : (stryCov_9fa48("88"), {
  code: stryMutAct_9fa48("89") ? "" : (stryCov_9fa48("89"), "TRY"),
  decimals: 2,
  symbol: stryMutAct_9fa48("90") ? "" : (stryCov_9fa48("90"), "₺"),
  locale: stryMutAct_9fa48("91") ? "" : (stryCov_9fa48("91"), "tr-TR")
});
registerCurrency(TRY);

/**
 * Russian Ruble (RUB).
 */
export const RUB: Currency = stryMutAct_9fa48("92") ? {} : (stryCov_9fa48("92"), {
  code: stryMutAct_9fa48("93") ? "" : (stryCov_9fa48("93"), "RUB"),
  decimals: 2,
  symbol: stryMutAct_9fa48("94") ? "" : (stryCov_9fa48("94"), "₽"),
  locale: stryMutAct_9fa48("95") ? "" : (stryCov_9fa48("95"), "ru-RU")
});
registerCurrency(RUB);

/**
 * Ukrainian Hryvnia (UAH).
 */
export const UAH: Currency = stryMutAct_9fa48("96") ? {} : (stryCov_9fa48("96"), {
  code: stryMutAct_9fa48("97") ? "" : (stryCov_9fa48("97"), "UAH"),
  decimals: 2,
  symbol: stryMutAct_9fa48("98") ? "" : (stryCov_9fa48("98"), "₴"),
  locale: stryMutAct_9fa48("99") ? "" : (stryCov_9fa48("99"), "uk-UA")
});
registerCurrency(UAH);

/**
 * Israeli New Shekel (ILS).
 */
export const ILS: Currency = stryMutAct_9fa48("100") ? {} : (stryCov_9fa48("100"), {
  code: stryMutAct_9fa48("101") ? "" : (stryCov_9fa48("101"), "ILS"),
  decimals: 2,
  symbol: stryMutAct_9fa48("102") ? "" : (stryCov_9fa48("102"), "₪"),
  locale: stryMutAct_9fa48("103") ? "" : (stryCov_9fa48("103"), "he-IL")
});
registerCurrency(ILS);

// ============================================================================
// AMERICAS
// ============================================================================

/**
 * Mexican Peso (MXN).
 */
export const MXN: Currency = stryMutAct_9fa48("104") ? {} : (stryCov_9fa48("104"), {
  code: stryMutAct_9fa48("105") ? "" : (stryCov_9fa48("105"), "MXN"),
  decimals: 2,
  symbol: stryMutAct_9fa48("106") ? "" : (stryCov_9fa48("106"), "MX$"),
  locale: stryMutAct_9fa48("107") ? "" : (stryCov_9fa48("107"), "es-MX")
});
registerCurrency(MXN);

/**
 * Brazilian Real (BRL).
 */
export const BRL: Currency = stryMutAct_9fa48("108") ? {} : (stryCov_9fa48("108"), {
  code: stryMutAct_9fa48("109") ? "" : (stryCov_9fa48("109"), "BRL"),
  decimals: 2,
  symbol: stryMutAct_9fa48("110") ? "" : (stryCov_9fa48("110"), "R$"),
  locale: stryMutAct_9fa48("111") ? "" : (stryCov_9fa48("111"), "pt-BR")
});
registerCurrency(BRL);

/**
 * Argentine Peso (ARS).
 */
export const ARS: Currency = stryMutAct_9fa48("112") ? {} : (stryCov_9fa48("112"), {
  code: stryMutAct_9fa48("113") ? "" : (stryCov_9fa48("113"), "ARS"),
  decimals: 2,
  symbol: stryMutAct_9fa48("114") ? "" : (stryCov_9fa48("114"), "AR$"),
  locale: stryMutAct_9fa48("115") ? "" : (stryCov_9fa48("115"), "es-AR")
});
registerCurrency(ARS);

/**
 * Chilean Peso (CLP).
 */
export const CLP: Currency = stryMutAct_9fa48("116") ? {} : (stryCov_9fa48("116"), {
  code: stryMutAct_9fa48("117") ? "" : (stryCov_9fa48("117"), "CLP"),
  decimals: 0,
  symbol: stryMutAct_9fa48("118") ? "" : (stryCov_9fa48("118"), "CL$"),
  locale: stryMutAct_9fa48("119") ? "" : (stryCov_9fa48("119"), "es-CL")
});
registerCurrency(CLP);

/**
 * Colombian Peso (COP).
 */
export const COP: Currency = stryMutAct_9fa48("120") ? {} : (stryCov_9fa48("120"), {
  code: stryMutAct_9fa48("121") ? "" : (stryCov_9fa48("121"), "COP"),
  decimals: 2,
  symbol: stryMutAct_9fa48("122") ? "" : (stryCov_9fa48("122"), "CO$"),
  locale: stryMutAct_9fa48("123") ? "" : (stryCov_9fa48("123"), "es-CO")
});
registerCurrency(COP);

/**
 * Peruvian Sol (PEN).
 */
export const PEN: Currency = stryMutAct_9fa48("124") ? {} : (stryCov_9fa48("124"), {
  code: stryMutAct_9fa48("125") ? "" : (stryCov_9fa48("125"), "PEN"),
  decimals: 2,
  symbol: stryMutAct_9fa48("126") ? "" : (stryCov_9fa48("126"), "S/"),
  locale: stryMutAct_9fa48("127") ? "" : (stryCov_9fa48("127"), "es-PE")
});
registerCurrency(PEN);

// ============================================================================
// AFRICA
// ============================================================================

/**
 * South African Rand (ZAR).
 */
export const ZAR: Currency = stryMutAct_9fa48("128") ? {} : (stryCov_9fa48("128"), {
  code: stryMutAct_9fa48("129") ? "" : (stryCov_9fa48("129"), "ZAR"),
  decimals: 2,
  symbol: stryMutAct_9fa48("130") ? "" : (stryCov_9fa48("130"), "R"),
  locale: stryMutAct_9fa48("131") ? "" : (stryCov_9fa48("131"), "en-ZA")
});
registerCurrency(ZAR);

/**
 * Nigerian Naira (NGN).
 */
export const NGN: Currency = stryMutAct_9fa48("132") ? {} : (stryCov_9fa48("132"), {
  code: stryMutAct_9fa48("133") ? "" : (stryCov_9fa48("133"), "NGN"),
  decimals: 2,
  symbol: stryMutAct_9fa48("134") ? "" : (stryCov_9fa48("134"), "₦"),
  locale: stryMutAct_9fa48("135") ? "" : (stryCov_9fa48("135"), "en-NG")
});
registerCurrency(NGN);

/**
 * Kenyan Shilling (KES).
 */
export const KES: Currency = stryMutAct_9fa48("136") ? {} : (stryCov_9fa48("136"), {
  code: stryMutAct_9fa48("137") ? "" : (stryCov_9fa48("137"), "KES"),
  decimals: 2,
  symbol: stryMutAct_9fa48("138") ? "" : (stryCov_9fa48("138"), "KSh"),
  locale: stryMutAct_9fa48("139") ? "" : (stryCov_9fa48("139"), "en-KE")
});
registerCurrency(KES);

/**
 * Egyptian Pound (EGP).
 */
export const EGP: Currency = stryMutAct_9fa48("140") ? {} : (stryCov_9fa48("140"), {
  code: stryMutAct_9fa48("141") ? "" : (stryCov_9fa48("141"), "EGP"),
  decimals: 2,
  symbol: stryMutAct_9fa48("142") ? "" : (stryCov_9fa48("142"), "E£"),
  locale: stryMutAct_9fa48("143") ? "" : (stryCov_9fa48("143"), "ar-EG")
});
registerCurrency(EGP);

/**
 * Moroccan Dirham (MAD).
 */
export const MAD: Currency = stryMutAct_9fa48("144") ? {} : (stryCov_9fa48("144"), {
  code: stryMutAct_9fa48("145") ? "" : (stryCov_9fa48("145"), "MAD"),
  decimals: 2,
  symbol: stryMutAct_9fa48("146") ? "" : (stryCov_9fa48("146"), "د.م."),
  locale: stryMutAct_9fa48("147") ? "" : (stryCov_9fa48("147"), "ar-MA")
});
registerCurrency(MAD);

/**
 * Ghanaian Cedi (GHS).
 */
export const GHS: Currency = stryMutAct_9fa48("148") ? {} : (stryCov_9fa48("148"), {
  code: stryMutAct_9fa48("149") ? "" : (stryCov_9fa48("149"), "GHS"),
  decimals: 2,
  symbol: stryMutAct_9fa48("150") ? "" : (stryCov_9fa48("150"), "GH₵"),
  locale: stryMutAct_9fa48("151") ? "" : (stryCov_9fa48("151"), "en-GH")
});
registerCurrency(GHS);

/**
 * Tanzanian Shilling (TZS).
 */
export const TZS: Currency = stryMutAct_9fa48("152") ? {} : (stryCov_9fa48("152"), {
  code: stryMutAct_9fa48("153") ? "" : (stryCov_9fa48("153"), "TZS"),
  decimals: 2,
  symbol: stryMutAct_9fa48("154") ? "" : (stryCov_9fa48("154"), "TSh"),
  locale: stryMutAct_9fa48("155") ? "" : (stryCov_9fa48("155"), "sw-TZ")
});
registerCurrency(TZS);

/**
 * Ugandan Shilling (UGX).
 */
export const UGX: Currency = stryMutAct_9fa48("156") ? {} : (stryCov_9fa48("156"), {
  code: stryMutAct_9fa48("157") ? "" : (stryCov_9fa48("157"), "UGX"),
  decimals: 0,
  symbol: stryMutAct_9fa48("158") ? "" : (stryCov_9fa48("158"), "USh"),
  locale: stryMutAct_9fa48("159") ? "" : (stryCov_9fa48("159"), "en-UG")
});
registerCurrency(UGX);

// ============================================================================
// ASIA-PACIFIC
// ============================================================================

/**
 * Thai Baht (THB).
 */
export const THB: Currency = stryMutAct_9fa48("160") ? {} : (stryCov_9fa48("160"), {
  code: stryMutAct_9fa48("161") ? "" : (stryCov_9fa48("161"), "THB"),
  decimals: 2,
  symbol: stryMutAct_9fa48("162") ? "" : (stryCov_9fa48("162"), "฿"),
  locale: stryMutAct_9fa48("163") ? "" : (stryCov_9fa48("163"), "th-TH")
});
registerCurrency(THB);

/**
 * Malaysian Ringgit (MYR).
 */
export const MYR: Currency = stryMutAct_9fa48("164") ? {} : (stryCov_9fa48("164"), {
  code: stryMutAct_9fa48("165") ? "" : (stryCov_9fa48("165"), "MYR"),
  decimals: 2,
  symbol: stryMutAct_9fa48("166") ? "" : (stryCov_9fa48("166"), "RM"),
  locale: stryMutAct_9fa48("167") ? "" : (stryCov_9fa48("167"), "ms-MY")
});
registerCurrency(MYR);

/**
 * Indonesian Rupiah (IDR).
 */
export const IDR: Currency = stryMutAct_9fa48("168") ? {} : (stryCov_9fa48("168"), {
  code: stryMutAct_9fa48("169") ? "" : (stryCov_9fa48("169"), "IDR"),
  decimals: 2,
  symbol: stryMutAct_9fa48("170") ? "" : (stryCov_9fa48("170"), "Rp"),
  locale: stryMutAct_9fa48("171") ? "" : (stryCov_9fa48("171"), "id-ID")
});
registerCurrency(IDR);

/**
 * Philippine Peso (PHP).
 */
export const PHP: Currency = stryMutAct_9fa48("172") ? {} : (stryCov_9fa48("172"), {
  code: stryMutAct_9fa48("173") ? "" : (stryCov_9fa48("173"), "PHP"),
  decimals: 2,
  symbol: stryMutAct_9fa48("174") ? "" : (stryCov_9fa48("174"), "₱"),
  locale: stryMutAct_9fa48("175") ? "" : (stryCov_9fa48("175"), "en-PH")
});
registerCurrency(PHP);

/**
 * Vietnamese Dong (VND).
 */
export const VND: Currency = stryMutAct_9fa48("176") ? {} : (stryCov_9fa48("176"), {
  code: stryMutAct_9fa48("177") ? "" : (stryCov_9fa48("177"), "VND"),
  decimals: 0,
  symbol: stryMutAct_9fa48("178") ? "" : (stryCov_9fa48("178"), "₫"),
  locale: stryMutAct_9fa48("179") ? "" : (stryCov_9fa48("179"), "vi-VN")
});
registerCurrency(VND);

/**
 * Taiwan Dollar (TWD).
 */
export const TWD: Currency = stryMutAct_9fa48("180") ? {} : (stryCov_9fa48("180"), {
  code: stryMutAct_9fa48("181") ? "" : (stryCov_9fa48("181"), "TWD"),
  decimals: 2,
  symbol: stryMutAct_9fa48("182") ? "" : (stryCov_9fa48("182"), "NT$"),
  locale: stryMutAct_9fa48("183") ? "" : (stryCov_9fa48("183"), "zh-TW")
});
registerCurrency(TWD);

/**
 * Pakistani Rupee (PKR).
 */
export const PKR: Currency = stryMutAct_9fa48("184") ? {} : (stryCov_9fa48("184"), {
  code: stryMutAct_9fa48("185") ? "" : (stryCov_9fa48("185"), "PKR"),
  decimals: 2,
  symbol: stryMutAct_9fa48("186") ? "" : (stryCov_9fa48("186"), "₨"),
  locale: stryMutAct_9fa48("187") ? "" : (stryCov_9fa48("187"), "ur-PK")
});
registerCurrency(PKR);

/**
 * Bangladeshi Taka (BDT).
 */
export const BDT: Currency = stryMutAct_9fa48("188") ? {} : (stryCov_9fa48("188"), {
  code: stryMutAct_9fa48("189") ? "" : (stryCov_9fa48("189"), "BDT"),
  decimals: 2,
  symbol: stryMutAct_9fa48("190") ? "" : (stryCov_9fa48("190"), "৳"),
  locale: stryMutAct_9fa48("191") ? "" : (stryCov_9fa48("191"), "bn-BD")
});
registerCurrency(BDT);

/**
 * Sri Lankan Rupee (LKR).
 */
export const LKR: Currency = stryMutAct_9fa48("192") ? {} : (stryCov_9fa48("192"), {
  code: stryMutAct_9fa48("193") ? "" : (stryCov_9fa48("193"), "LKR"),
  decimals: 2,
  symbol: stryMutAct_9fa48("194") ? "" : (stryCov_9fa48("194"), "Rs"),
  locale: stryMutAct_9fa48("195") ? "" : (stryCov_9fa48("195"), "si-LK")
});
registerCurrency(LKR);

// ============================================================================
// MIDDLE EAST
// ============================================================================

/**
 * United Arab Emirates Dirham (AED).
 */
export const AED: Currency = stryMutAct_9fa48("196") ? {} : (stryCov_9fa48("196"), {
  code: stryMutAct_9fa48("197") ? "" : (stryCov_9fa48("197"), "AED"),
  decimals: 2,
  symbol: stryMutAct_9fa48("198") ? "" : (stryCov_9fa48("198"), "د.إ"),
  locale: stryMutAct_9fa48("199") ? "" : (stryCov_9fa48("199"), "ar-AE")
});
registerCurrency(AED);

/**
 * Saudi Riyal (SAR).
 */
export const SAR: Currency = stryMutAct_9fa48("200") ? {} : (stryCov_9fa48("200"), {
  code: stryMutAct_9fa48("201") ? "" : (stryCov_9fa48("201"), "SAR"),
  decimals: 2,
  symbol: stryMutAct_9fa48("202") ? "" : (stryCov_9fa48("202"), "﷼"),
  locale: stryMutAct_9fa48("203") ? "" : (stryCov_9fa48("203"), "ar-SA")
});
registerCurrency(SAR);

/**
 * Qatari Riyal (QAR).
 */
export const QAR: Currency = stryMutAct_9fa48("204") ? {} : (stryCov_9fa48("204"), {
  code: stryMutAct_9fa48("205") ? "" : (stryCov_9fa48("205"), "QAR"),
  decimals: 2,
  symbol: stryMutAct_9fa48("206") ? "" : (stryCov_9fa48("206"), "﷼"),
  locale: stryMutAct_9fa48("207") ? "" : (stryCov_9fa48("207"), "ar-QA")
});
registerCurrency(QAR);

/**
 * Kuwaiti Dinar (KWD).
 * Note: 3 decimal places (fils).
 */
export const KWD: Currency = stryMutAct_9fa48("208") ? {} : (stryCov_9fa48("208"), {
  code: stryMutAct_9fa48("209") ? "" : (stryCov_9fa48("209"), "KWD"),
  decimals: 3,
  symbol: stryMutAct_9fa48("210") ? "" : (stryCov_9fa48("210"), "د.ك"),
  locale: stryMutAct_9fa48("211") ? "" : (stryCov_9fa48("211"), "ar-KW")
});
registerCurrency(KWD);

/**
 * Bahraini Dinar (BHD).
 * Note: 3 decimal places (fils).
 */
export const BHD: Currency = stryMutAct_9fa48("212") ? {} : (stryCov_9fa48("212"), {
  code: stryMutAct_9fa48("213") ? "" : (stryCov_9fa48("213"), "BHD"),
  decimals: 3,
  symbol: stryMutAct_9fa48("214") ? "" : (stryCov_9fa48("214"), "د.ب"),
  locale: stryMutAct_9fa48("215") ? "" : (stryCov_9fa48("215"), "ar-BH")
});
registerCurrency(BHD);

/**
 * Omani Rial (OMR).
 * Note: 3 decimal places (baisa).
 */
export const OMR: Currency = stryMutAct_9fa48("216") ? {} : (stryCov_9fa48("216"), {
  code: stryMutAct_9fa48("217") ? "" : (stryCov_9fa48("217"), "OMR"),
  decimals: 3,
  symbol: stryMutAct_9fa48("218") ? "" : (stryCov_9fa48("218"), "﷼"),
  locale: stryMutAct_9fa48("219") ? "" : (stryCov_9fa48("219"), "ar-OM")
});
registerCurrency(OMR);

/**
 * Jordanian Dinar (JOD).
 * Note: 3 decimal places (fils).
 */
export const JOD: Currency = stryMutAct_9fa48("220") ? {} : (stryCov_9fa48("220"), {
  code: stryMutAct_9fa48("221") ? "" : (stryCov_9fa48("221"), "JOD"),
  decimals: 3,
  symbol: stryMutAct_9fa48("222") ? "" : (stryCov_9fa48("222"), "د.ا"),
  locale: stryMutAct_9fa48("223") ? "" : (stryCov_9fa48("223"), "ar-JO")
});
registerCurrency(JOD);

// ============================================================================
// SPECIAL CURRENCIES
// ============================================================================

/**
 * Icelandic Króna (ISK).
 * Note: 0 decimal places.
 */
export const ISK: Currency = stryMutAct_9fa48("224") ? {} : (stryCov_9fa48("224"), {
  code: stryMutAct_9fa48("225") ? "" : (stryCov_9fa48("225"), "ISK"),
  decimals: 0,
  symbol: stryMutAct_9fa48("226") ? "" : (stryCov_9fa48("226"), "kr"),
  locale: stryMutAct_9fa48("227") ? "" : (stryCov_9fa48("227"), "is-IS")
});
registerCurrency(ISK);

/**
 * Mauritanian Ouguiya (MRU).
 * Note: Uses 2 decimals (khoums), but often displayed without.
 */
export const MRU: Currency = stryMutAct_9fa48("228") ? {} : (stryCov_9fa48("228"), {
  code: stryMutAct_9fa48("229") ? "" : (stryCov_9fa48("229"), "MRU"),
  decimals: 2,
  symbol: stryMutAct_9fa48("230") ? "" : (stryCov_9fa48("230"), "UM"),
  locale: stryMutAct_9fa48("231") ? "" : (stryCov_9fa48("231"), "ar-MR")
});
registerCurrency(MRU);

/**
 * A collection of common currencies.
 * @deprecated Use registry instead. Import individual currencies or use getCurrency().
 */
export const CURRENCIES: Record<string, Currency> = stryMutAct_9fa48("232") ? {} : (stryCov_9fa48("232"), {
  // Major world currencies
  USD,
  EUR,
  GBP,
  JPY,
  CHF,
  CAD,
  AUD,
  NZD,
  CNY,
  HKD,
  SGD,
  KRW,
  INR,
  // European
  SEK,
  NOK,
  DKK,
  PLN,
  CZK,
  HUF,
  RON,
  BGN,
  HRK,
  TRY,
  RUB,
  UAH,
  ILS,
  // Americas
  MXN,
  BRL,
  ARS,
  CLP,
  COP,
  PEN,
  // Africa
  ZAR,
  NGN,
  KES,
  EGP,
  MAD,
  GHS,
  TZS,
  UGX,
  // Asia-Pacific
  THB,
  MYR,
  IDR,
  PHP,
  VND,
  TWD,
  PKR,
  BDT,
  LKR,
  // Middle East
  AED,
  SAR,
  QAR,
  KWD,
  BHD,
  OMR,
  JOD,
  // Special
  ISK,
  MRU
});