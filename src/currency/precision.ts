import { Currency } from "./Currency";

export function getMinorUnitExponent(currency: Currency): bigint {
  return 10n ** BigInt(currency.decimals);
}
