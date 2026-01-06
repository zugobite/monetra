import { Currency } from "./Currency";
import { registerCurrency } from "./registry";

// ============================================================================
// MAJOR WORLD CURRENCIES
// ============================================================================

/**
 * United States Dollar (USD).
 */
export const USD: Currency = {
  code: "USD",
  decimals: 2,
  symbol: "$",
  locale: "en-US",
};
registerCurrency(USD);

/**
 * Euro (EUR).
 */
export const EUR: Currency = {
  code: "EUR",
  decimals: 2,
  symbol: "€",
  locale: "de-DE",
};
registerCurrency(EUR);

/**
 * British Pound Sterling (GBP).
 */
export const GBP: Currency = {
  code: "GBP",
  decimals: 2,
  symbol: "£",
  locale: "en-GB",
};
registerCurrency(GBP);

/**
 * Japanese Yen (JPY).
 */
export const JPY: Currency = {
  code: "JPY",
  decimals: 0,
  symbol: "¥",
  locale: "ja-JP",
};
registerCurrency(JPY);

/**
 * Swiss Franc (CHF).
 */
export const CHF: Currency = {
  code: "CHF",
  decimals: 2,
  symbol: "CHF",
  locale: "de-CH",
};
registerCurrency(CHF);

/**
 * Canadian Dollar (CAD).
 */
export const CAD: Currency = {
  code: "CAD",
  decimals: 2,
  symbol: "CA$",
  locale: "en-CA",
};
registerCurrency(CAD);

/**
 * Australian Dollar (AUD).
 */
export const AUD: Currency = {
  code: "AUD",
  decimals: 2,
  symbol: "A$",
  locale: "en-AU",
};
registerCurrency(AUD);

/**
 * New Zealand Dollar (NZD).
 */
export const NZD: Currency = {
  code: "NZD",
  decimals: 2,
  symbol: "NZ$",
  locale: "en-NZ",
};
registerCurrency(NZD);

/**
 * Chinese Yuan Renminbi (CNY).
 */
export const CNY: Currency = {
  code: "CNY",
  decimals: 2,
  symbol: "¥",
  locale: "zh-CN",
};
registerCurrency(CNY);

/**
 * Hong Kong Dollar (HKD).
 */
export const HKD: Currency = {
  code: "HKD",
  decimals: 2,
  symbol: "HK$",
  locale: "zh-HK",
};
registerCurrency(HKD);

/**
 * Singapore Dollar (SGD).
 */
export const SGD: Currency = {
  code: "SGD",
  decimals: 2,
  symbol: "S$",
  locale: "en-SG",
};
registerCurrency(SGD);

/**
 * South Korean Won (KRW).
 */
export const KRW: Currency = {
  code: "KRW",
  decimals: 0,
  symbol: "₩",
  locale: "ko-KR",
};
registerCurrency(KRW);

/**
 * Indian Rupee (INR).
 */
export const INR: Currency = {
  code: "INR",
  decimals: 2,
  symbol: "₹",
  locale: "en-IN",
};
registerCurrency(INR);

// ============================================================================
// EUROPEAN CURRENCIES
// ============================================================================

/**
 * Swedish Krona (SEK).
 */
export const SEK: Currency = {
  code: "SEK",
  decimals: 2,
  symbol: "kr",
  locale: "sv-SE",
};
registerCurrency(SEK);

/**
 * Norwegian Krone (NOK).
 */
export const NOK: Currency = {
  code: "NOK",
  decimals: 2,
  symbol: "kr",
  locale: "nb-NO",
};
registerCurrency(NOK);

/**
 * Danish Krone (DKK).
 */
export const DKK: Currency = {
  code: "DKK",
  decimals: 2,
  symbol: "kr",
  locale: "da-DK",
};
registerCurrency(DKK);

/**
 * Polish Zloty (PLN).
 */
export const PLN: Currency = {
  code: "PLN",
  decimals: 2,
  symbol: "zł",
  locale: "pl-PL",
};
registerCurrency(PLN);

/**
 * Czech Koruna (CZK).
 */
export const CZK: Currency = {
  code: "CZK",
  decimals: 2,
  symbol: "Kč",
  locale: "cs-CZ",
};
registerCurrency(CZK);

/**
 * Hungarian Forint (HUF).
 */
export const HUF: Currency = {
  code: "HUF",
  decimals: 2,
  symbol: "Ft",
  locale: "hu-HU",
};
registerCurrency(HUF);

/**
 * Romanian Leu (RON).
 */
export const RON: Currency = {
  code: "RON",
  decimals: 2,
  symbol: "lei",
  locale: "ro-RO",
};
registerCurrency(RON);

/**
 * Bulgarian Lev (BGN).
 */
export const BGN: Currency = {
  code: "BGN",
  decimals: 2,
  symbol: "лв",
  locale: "bg-BG",
};
registerCurrency(BGN);

/**
 * Croatian Kuna (HRK).
 * Note: Croatia adopted EUR on Jan 1, 2023, but HRK may still be needed for historical data.
 */
export const HRK: Currency = {
  code: "HRK",
  decimals: 2,
  symbol: "kn",
  locale: "hr-HR",
};
registerCurrency(HRK);

/**
 * Turkish Lira (TRY).
 */
export const TRY: Currency = {
  code: "TRY",
  decimals: 2,
  symbol: "₺",
  locale: "tr-TR",
};
registerCurrency(TRY);

/**
 * Russian Ruble (RUB).
 */
export const RUB: Currency = {
  code: "RUB",
  decimals: 2,
  symbol: "₽",
  locale: "ru-RU",
};
registerCurrency(RUB);

/**
 * Ukrainian Hryvnia (UAH).
 */
export const UAH: Currency = {
  code: "UAH",
  decimals: 2,
  symbol: "₴",
  locale: "uk-UA",
};
registerCurrency(UAH);

/**
 * Israeli New Shekel (ILS).
 */
export const ILS: Currency = {
  code: "ILS",
  decimals: 2,
  symbol: "₪",
  locale: "he-IL",
};
registerCurrency(ILS);

// ============================================================================
// AMERICAS
// ============================================================================

/**
 * Mexican Peso (MXN).
 */
export const MXN: Currency = {
  code: "MXN",
  decimals: 2,
  symbol: "MX$",
  locale: "es-MX",
};
registerCurrency(MXN);

/**
 * Brazilian Real (BRL).
 */
export const BRL: Currency = {
  code: "BRL",
  decimals: 2,
  symbol: "R$",
  locale: "pt-BR",
};
registerCurrency(BRL);

/**
 * Argentine Peso (ARS).
 */
export const ARS: Currency = {
  code: "ARS",
  decimals: 2,
  symbol: "AR$",
  locale: "es-AR",
};
registerCurrency(ARS);

/**
 * Chilean Peso (CLP).
 */
export const CLP: Currency = {
  code: "CLP",
  decimals: 0,
  symbol: "CL$",
  locale: "es-CL",
};
registerCurrency(CLP);

/**
 * Colombian Peso (COP).
 */
export const COP: Currency = {
  code: "COP",
  decimals: 2,
  symbol: "CO$",
  locale: "es-CO",
};
registerCurrency(COP);

/**
 * Peruvian Sol (PEN).
 */
export const PEN: Currency = {
  code: "PEN",
  decimals: 2,
  symbol: "S/",
  locale: "es-PE",
};
registerCurrency(PEN);

// ============================================================================
// AFRICA
// ============================================================================

/**
 * South African Rand (ZAR).
 */
export const ZAR: Currency = {
  code: "ZAR",
  decimals: 2,
  symbol: "R",
  locale: "en-ZA",
};
registerCurrency(ZAR);

/**
 * Nigerian Naira (NGN).
 */
export const NGN: Currency = {
  code: "NGN",
  decimals: 2,
  symbol: "₦",
  locale: "en-NG",
};
registerCurrency(NGN);

/**
 * Kenyan Shilling (KES).
 */
export const KES: Currency = {
  code: "KES",
  decimals: 2,
  symbol: "KSh",
  locale: "en-KE",
};
registerCurrency(KES);

/**
 * Egyptian Pound (EGP).
 */
export const EGP: Currency = {
  code: "EGP",
  decimals: 2,
  symbol: "E£",
  locale: "ar-EG",
};
registerCurrency(EGP);

/**
 * Moroccan Dirham (MAD).
 */
export const MAD: Currency = {
  code: "MAD",
  decimals: 2,
  symbol: "د.م.",
  locale: "ar-MA",
};
registerCurrency(MAD);

/**
 * Ghanaian Cedi (GHS).
 */
export const GHS: Currency = {
  code: "GHS",
  decimals: 2,
  symbol: "GH₵",
  locale: "en-GH",
};
registerCurrency(GHS);

/**
 * Tanzanian Shilling (TZS).
 */
export const TZS: Currency = {
  code: "TZS",
  decimals: 2,
  symbol: "TSh",
  locale: "sw-TZ",
};
registerCurrency(TZS);

/**
 * Ugandan Shilling (UGX).
 */
export const UGX: Currency = {
  code: "UGX",
  decimals: 0,
  symbol: "USh",
  locale: "en-UG",
};
registerCurrency(UGX);

// ============================================================================
// ASIA-PACIFIC
// ============================================================================

/**
 * Thai Baht (THB).
 */
export const THB: Currency = {
  code: "THB",
  decimals: 2,
  symbol: "฿",
  locale: "th-TH",
};
registerCurrency(THB);

/**
 * Malaysian Ringgit (MYR).
 */
export const MYR: Currency = {
  code: "MYR",
  decimals: 2,
  symbol: "RM",
  locale: "ms-MY",
};
registerCurrency(MYR);

/**
 * Indonesian Rupiah (IDR).
 */
export const IDR: Currency = {
  code: "IDR",
  decimals: 2,
  symbol: "Rp",
  locale: "id-ID",
};
registerCurrency(IDR);

/**
 * Philippine Peso (PHP).
 */
export const PHP: Currency = {
  code: "PHP",
  decimals: 2,
  symbol: "₱",
  locale: "en-PH",
};
registerCurrency(PHP);

/**
 * Vietnamese Dong (VND).
 */
export const VND: Currency = {
  code: "VND",
  decimals: 0,
  symbol: "₫",
  locale: "vi-VN",
};
registerCurrency(VND);

/**
 * Taiwan Dollar (TWD).
 */
export const TWD: Currency = {
  code: "TWD",
  decimals: 2,
  symbol: "NT$",
  locale: "zh-TW",
};
registerCurrency(TWD);

/**
 * Pakistani Rupee (PKR).
 */
export const PKR: Currency = {
  code: "PKR",
  decimals: 2,
  symbol: "₨",
  locale: "ur-PK",
};
registerCurrency(PKR);

/**
 * Bangladeshi Taka (BDT).
 */
export const BDT: Currency = {
  code: "BDT",
  decimals: 2,
  symbol: "৳",
  locale: "bn-BD",
};
registerCurrency(BDT);

/**
 * Sri Lankan Rupee (LKR).
 */
export const LKR: Currency = {
  code: "LKR",
  decimals: 2,
  symbol: "Rs",
  locale: "si-LK",
};
registerCurrency(LKR);

// ============================================================================
// MIDDLE EAST
// ============================================================================

/**
 * United Arab Emirates Dirham (AED).
 */
export const AED: Currency = {
  code: "AED",
  decimals: 2,
  symbol: "د.إ",
  locale: "ar-AE",
};
registerCurrency(AED);

/**
 * Saudi Riyal (SAR).
 */
export const SAR: Currency = {
  code: "SAR",
  decimals: 2,
  symbol: "﷼",
  locale: "ar-SA",
};
registerCurrency(SAR);

/**
 * Qatari Riyal (QAR).
 */
export const QAR: Currency = {
  code: "QAR",
  decimals: 2,
  symbol: "﷼",
  locale: "ar-QA",
};
registerCurrency(QAR);

/**
 * Kuwaiti Dinar (KWD).
 * Note: 3 decimal places (fils).
 */
export const KWD: Currency = {
  code: "KWD",
  decimals: 3,
  symbol: "د.ك",
  locale: "ar-KW",
};
registerCurrency(KWD);

/**
 * Bahraini Dinar (BHD).
 * Note: 3 decimal places (fils).
 */
export const BHD: Currency = {
  code: "BHD",
  decimals: 3,
  symbol: "د.ب",
  locale: "ar-BH",
};
registerCurrency(BHD);

/**
 * Omani Rial (OMR).
 * Note: 3 decimal places (baisa).
 */
export const OMR: Currency = {
  code: "OMR",
  decimals: 3,
  symbol: "﷼",
  locale: "ar-OM",
};
registerCurrency(OMR);

/**
 * Jordanian Dinar (JOD).
 * Note: 3 decimal places (fils).
 */
export const JOD: Currency = {
  code: "JOD",
  decimals: 3,
  symbol: "د.ا",
  locale: "ar-JO",
};
registerCurrency(JOD);

// ============================================================================
// SPECIAL CURRENCIES
// ============================================================================

/**
 * Icelandic Króna (ISK).
 * Note: 0 decimal places.
 */
export const ISK: Currency = {
  code: "ISK",
  decimals: 0,
  symbol: "kr",
  locale: "is-IS",
};
registerCurrency(ISK);

/**
 * Mauritanian Ouguiya (MRU).
 * Note: Uses 2 decimals (khoums), but often displayed without.
 */
export const MRU: Currency = {
  code: "MRU",
  decimals: 2,
  symbol: "UM",
  locale: "ar-MR",
};
registerCurrency(MRU);

/**
 * A collection of common currencies.
 * @deprecated Use registry instead. Import individual currencies or use getCurrency().
 */
export const CURRENCIES: Record<string, Currency> = {
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
  MRU,
};
