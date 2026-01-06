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
export function allocate(amount: bigint, ratios: number[]): bigint[] {
  if (stryMutAct_9fa48("1257")) {
    {}
  } else {
    stryCov_9fa48("1257");
    if (stryMutAct_9fa48("1260") ? ratios.length !== 0 : stryMutAct_9fa48("1259") ? false : stryMutAct_9fa48("1258") ? true : (stryCov_9fa48("1258", "1259", "1260"), ratios.length === 0)) {
      if (stryMutAct_9fa48("1261")) {
        {}
      } else {
        stryCov_9fa48("1261");
        throw new Error(stryMutAct_9fa48("1262") ? "" : (stryCov_9fa48("1262"), "Cannot allocate to empty ratios"));
      }
    }

    // Scale ratios to integers
    const scaledRatios = ratios.map(r => {
      if (stryMutAct_9fa48("1263")) {
        {}
      } else {
        stryCov_9fa48("1263");
        const s = r.toString();
        if (stryMutAct_9fa48("1265") ? false : stryMutAct_9fa48("1264") ? true : (stryCov_9fa48("1264", "1265"), (stryMutAct_9fa48("1266") ? /[^eE]/ : (stryCov_9fa48("1266"), /[eE]/)).test(s))) throw new Error(stryMutAct_9fa48("1267") ? "" : (stryCov_9fa48("1267"), "Scientific notation not supported"));
        const parts = s.split(stryMutAct_9fa48("1268") ? "" : (stryCov_9fa48("1268"), "."));
        const decimals = parts[1] ? parts[1].length : 0;
        const value = BigInt(stryMutAct_9fa48("1269") ? parts[0] - (parts[1] || "") : (stryCov_9fa48("1269"), parts[0] + (stryMutAct_9fa48("1272") ? parts[1] && "" : stryMutAct_9fa48("1271") ? false : stryMutAct_9fa48("1270") ? true : (stryCov_9fa48("1270", "1271", "1272"), parts[1] || (stryMutAct_9fa48("1273") ? "Stryker was here!" : (stryCov_9fa48("1273"), ""))))));
        return stryMutAct_9fa48("1274") ? {} : (stryCov_9fa48("1274"), {
          value,
          decimals
        });
      }
    });
    const maxDecimals = stryMutAct_9fa48("1275") ? Math.min(...scaledRatios.map(r => r.decimals)) : (stryCov_9fa48("1275"), Math.max(...scaledRatios.map(stryMutAct_9fa48("1276") ? () => undefined : (stryCov_9fa48("1276"), r => r.decimals))));
    const normalizedRatios = scaledRatios.map(r => {
      if (stryMutAct_9fa48("1277")) {
        {}
      } else {
        stryCov_9fa48("1277");
        const factor = 10n ** BigInt(stryMutAct_9fa48("1278") ? maxDecimals + r.decimals : (stryCov_9fa48("1278"), maxDecimals - r.decimals));
        return stryMutAct_9fa48("1279") ? r.value / factor : (stryCov_9fa48("1279"), r.value * factor);
      }
    });
    const total = normalizedRatios.reduce(stryMutAct_9fa48("1280") ? () => undefined : (stryCov_9fa48("1280"), (sum, r) => stryMutAct_9fa48("1281") ? sum - r : (stryCov_9fa48("1281"), sum + r)), 0n);
    if (stryMutAct_9fa48("1284") ? total !== 0n : stryMutAct_9fa48("1283") ? false : stryMutAct_9fa48("1282") ? true : (stryCov_9fa48("1282", "1283", "1284"), total === 0n)) {
      if (stryMutAct_9fa48("1285")) {
        {}
      } else {
        stryCov_9fa48("1285");
        throw new Error(stryMutAct_9fa48("1286") ? "" : (stryCov_9fa48("1286"), "Total ratio must be greater than zero"));
      }
    }
    const results: {
      share: bigint;
      remainder: bigint;
      index: number;
    }[] = stryMutAct_9fa48("1287") ? ["Stryker was here"] : (stryCov_9fa48("1287"), []);
    let allocatedTotal = 0n;
    for (let i = 0; stryMutAct_9fa48("1290") ? i >= normalizedRatios.length : stryMutAct_9fa48("1289") ? i <= normalizedRatios.length : stryMutAct_9fa48("1288") ? false : (stryCov_9fa48("1288", "1289", "1290"), i < normalizedRatios.length); stryMutAct_9fa48("1291") ? i-- : (stryCov_9fa48("1291"), i++)) {
      if (stryMutAct_9fa48("1292")) {
        {}
      } else {
        stryCov_9fa48("1292");
        const ratio = normalizedRatios[i];
        const share = stryMutAct_9fa48("1293") ? amount * ratio * total : (stryCov_9fa48("1293"), (stryMutAct_9fa48("1294") ? amount / ratio : (stryCov_9fa48("1294"), amount * ratio)) / total);
        const remainder = stryMutAct_9fa48("1295") ? amount * ratio * total : (stryCov_9fa48("1295"), (stryMutAct_9fa48("1296") ? amount / ratio : (stryCov_9fa48("1296"), amount * ratio)) % total);
        results.push(stryMutAct_9fa48("1297") ? {} : (stryCov_9fa48("1297"), {
          share,
          remainder,
          index: i
        }));
        stryMutAct_9fa48("1298") ? allocatedTotal -= share : (stryCov_9fa48("1298"), allocatedTotal += share);
      }
    }
    let leftOver = stryMutAct_9fa48("1299") ? amount + allocatedTotal : (stryCov_9fa48("1299"), amount - allocatedTotal);

    // Distribute leftover to those with largest remainder
    // Sort by remainder desc
    stryMutAct_9fa48("1300") ? results : (stryCov_9fa48("1300"), results.sort((a, b) => {
      if (stryMutAct_9fa48("1301")) {
        {}
      } else {
        stryCov_9fa48("1301");
        if (stryMutAct_9fa48("1305") ? b.remainder <= a.remainder : stryMutAct_9fa48("1304") ? b.remainder >= a.remainder : stryMutAct_9fa48("1303") ? false : stryMutAct_9fa48("1302") ? true : (stryCov_9fa48("1302", "1303", "1304", "1305"), b.remainder > a.remainder)) return 1;
        if (stryMutAct_9fa48("1309") ? b.remainder >= a.remainder : stryMutAct_9fa48("1308") ? b.remainder <= a.remainder : stryMutAct_9fa48("1307") ? false : stryMutAct_9fa48("1306") ? true : (stryCov_9fa48("1306", "1307", "1308", "1309"), b.remainder < a.remainder)) return stryMutAct_9fa48("1310") ? +1 : (stryCov_9fa48("1310"), -1);
        return 0;
      }
    }));
    for (let i = 0; stryMutAct_9fa48("1313") ? i >= Number(leftOver) : stryMutAct_9fa48("1312") ? i <= Number(leftOver) : stryMutAct_9fa48("1311") ? false : (stryCov_9fa48("1311", "1312", "1313"), i < Number(leftOver)); stryMutAct_9fa48("1314") ? i-- : (stryCov_9fa48("1314"), i++)) {
      if (stryMutAct_9fa48("1315")) {
        {}
      } else {
        stryCov_9fa48("1315");
        stryMutAct_9fa48("1316") ? results[i].share -= 1n : (stryCov_9fa48("1316"), results[i].share += 1n);
      }
    }

    // Sort back by index
    stryMutAct_9fa48("1317") ? results : (stryCov_9fa48("1317"), results.sort(stryMutAct_9fa48("1318") ? () => undefined : (stryCov_9fa48("1318"), (a, b) => stryMutAct_9fa48("1319") ? a.index + b.index : (stryCov_9fa48("1319"), a.index - b.index))));
    return results.map(stryMutAct_9fa48("1320") ? () => undefined : (stryCov_9fa48("1320"), r => r.share));
  }
}