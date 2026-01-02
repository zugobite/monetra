/**
 * Allocates a monetary amount according to a list of ratios.
 *
 * Uses the "Largest Remainder Method" to ensure that the sum of the allocated
 * parts equals the original amount. Remainders are distributed to the parts
 * that had the largest fractional remainders during the division.
 *
 * @param amount - The total amount to allocate (in minor units).
 * @param ratios - An array of ratios (e.g., [1, 1] for 50/50 split).
 * @returns An array of allocated amounts (in minor units).
 * @throws {Error} If ratios are empty or total ratio is zero.
 */
export function allocate(amount: bigint, ratios: number[]): bigint[] {
  if (ratios.length === 0) {
    throw new Error("Cannot allocate to empty ratios");
  }

  // Scale ratios to integers
  const scaledRatios = ratios.map((r) => {
    const s = r.toString();
    if (/[eE]/.test(s)) throw new Error("Scientific notation not supported");
    const parts = s.split(".");
    const decimals = parts[1] ? parts[1].length : 0;
    const value = BigInt(parts[0] + (parts[1] || ""));
    return { value, decimals };
  });

  const maxDecimals = Math.max(...scaledRatios.map((r) => r.decimals));

  const normalizedRatios = scaledRatios.map((r) => {
    const factor = 10n ** BigInt(maxDecimals - r.decimals);
    return r.value * factor;
  });

  const total = normalizedRatios.reduce((sum, r) => sum + r, 0n);

  if (total === 0n) {
    throw new Error("Total ratio must be greater than zero");
  }

  const results: { share: bigint; remainder: bigint; index: number }[] = [];
  let allocatedTotal = 0n;

  for (let i = 0; i < normalizedRatios.length; i++) {
    const ratio = normalizedRatios[i];
    const share = (amount * ratio) / total;
    const remainder = (amount * ratio) % total;

    results.push({ share, remainder, index: i });
    allocatedTotal += share;
  }

  let leftOver = amount - allocatedTotal;

  // Distribute leftover to those with largest remainder
  // Sort by remainder desc
  results.sort((a, b) => {
    if (b.remainder > a.remainder) return 1;
    if (b.remainder < a.remainder) return -1;
    return 0;
  });

  for (let i = 0; i < Number(leftOver); i++) {
    results[i].share += 1n;
  }

  // Sort back by index
  results.sort((a, b) => a.index - b.index);

  return results.map((r) => r.share);
}
