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
import { RoundingMode, divideWithRounding } from "../rounding";
import { RoundingRequiredError } from "../errors";

/**
 * Adds two BigInt values.
 */
export function add(a: bigint, b: bigint): bigint {
  if (stryMutAct_9fa48("1321")) {
    {}
  } else {
    stryCov_9fa48("1321");
    return stryMutAct_9fa48("1322") ? a - b : (stryCov_9fa48("1322"), a + b);
  }
}

/**
 * Subtracts two BigInt values.
 */
export function subtract(a: bigint, b: bigint): bigint {
  if (stryMutAct_9fa48("1323")) {
    {}
  } else {
    stryCov_9fa48("1323");
    return stryMutAct_9fa48("1324") ? a + b : (stryCov_9fa48("1324"), a - b);
  }
}

/**
 * Multiplies a BigInt amount by a multiplier.
 *
 * Handles fractional multipliers by converting them to a rational number (numerator/denominator).
 * If the result is not an integer, a rounding mode must be provided.
 *
 * @param amount - The amount to multiply.
 * @param multiplier - The multiplier (number or string).
 * @param rounding - Optional rounding mode.
 * @returns The result as a BigInt.
 * @throws {RoundingRequiredError} If rounding is needed but not provided.
 */
export function multiply(amount: bigint, multiplier: string | number, rounding?: RoundingMode): bigint {
  if (stryMutAct_9fa48("1325")) {
    {}
  } else {
    stryCov_9fa48("1325");
    const {
      numerator,
      denominator
    } = parseMultiplier(multiplier);

    // result = amount * (numerator / denominator)
    // result = (amount * numerator) / denominator

    const product = stryMutAct_9fa48("1326") ? amount / numerator : (stryCov_9fa48("1326"), amount * numerator);
    if (stryMutAct_9fa48("1329") ? product % denominator !== 0n : stryMutAct_9fa48("1328") ? false : stryMutAct_9fa48("1327") ? true : (stryCov_9fa48("1327", "1328", "1329"), (stryMutAct_9fa48("1330") ? product * denominator : (stryCov_9fa48("1330"), product % denominator)) === 0n)) {
      if (stryMutAct_9fa48("1331")) {
        {}
      } else {
        stryCov_9fa48("1331");
        return stryMutAct_9fa48("1332") ? product * denominator : (stryCov_9fa48("1332"), product / denominator);
      }
    }
    if (stryMutAct_9fa48("1335") ? false : stryMutAct_9fa48("1334") ? true : stryMutAct_9fa48("1333") ? rounding : (stryCov_9fa48("1333", "1334", "1335"), !rounding)) {
      if (stryMutAct_9fa48("1336")) {
        {}
      } else {
        stryCov_9fa48("1336");
        throw new RoundingRequiredError(stryMutAct_9fa48("1337") ? "" : (stryCov_9fa48("1337"), "multiply"), stryMutAct_9fa48("1338") ? Number(product) * Number(denominator) : (stryCov_9fa48("1338"), Number(product) / Number(denominator)));
      }
    }
    return divideWithRounding(product, denominator, rounding);
  }
}

/**
 * Divides a BigInt amount by a divisor.
 *
 * @param amount - The amount to divide.
 * @param divisor - The divisor (number or string).
 * @param rounding - Optional rounding mode.
 * @returns The result as a BigInt.
 * @throws {RoundingRequiredError} If rounding is needed but not provided.
 */
export function divide(amount: bigint, divisor: string | number, rounding?: RoundingMode): bigint {
  if (stryMutAct_9fa48("1339")) {
    {}
  } else {
    stryCov_9fa48("1339");
    const {
      numerator,
      denominator
    } = parseMultiplier(divisor);

    // result = amount / (numerator / denominator)
    // result = (amount * denominator) / numerator

    const product = stryMutAct_9fa48("1340") ? amount / denominator : (stryCov_9fa48("1340"), amount * denominator);
    if (stryMutAct_9fa48("1343") ? product % numerator !== 0n : stryMutAct_9fa48("1342") ? false : stryMutAct_9fa48("1341") ? true : (stryCov_9fa48("1341", "1342", "1343"), (stryMutAct_9fa48("1344") ? product * numerator : (stryCov_9fa48("1344"), product % numerator)) === 0n)) {
      if (stryMutAct_9fa48("1345")) {
        {}
      } else {
        stryCov_9fa48("1345");
        return stryMutAct_9fa48("1346") ? product * numerator : (stryCov_9fa48("1346"), product / numerator);
      }
    }
    if (stryMutAct_9fa48("1349") ? false : stryMutAct_9fa48("1348") ? true : stryMutAct_9fa48("1347") ? rounding : (stryCov_9fa48("1347", "1348", "1349"), !rounding)) {
      if (stryMutAct_9fa48("1350")) {
        {}
      } else {
        stryCov_9fa48("1350");
        throw new RoundingRequiredError(stryMutAct_9fa48("1351") ? "" : (stryCov_9fa48("1351"), "divide"), stryMutAct_9fa48("1352") ? Number(product) * Number(numerator) : (stryCov_9fa48("1352"), Number(product) / Number(numerator)));
      }
    }
    return divideWithRounding(product, numerator, rounding);
  }
}
function parseMultiplier(multiplier: string | number): {
  numerator: bigint;
  denominator: bigint;
} {
  if (stryMutAct_9fa48("1353")) {
    {}
  } else {
    stryCov_9fa48("1353");
    const s = multiplier.toString();

    // Check for scientific notation
    if (stryMutAct_9fa48("1355") ? false : stryMutAct_9fa48("1354") ? true : (stryCov_9fa48("1354", "1355"), (stryMutAct_9fa48("1356") ? /[^eE]/ : (stryCov_9fa48("1356"), /[eE]/)).test(s))) {
      if (stryMutAct_9fa48("1357")) {
        {}
      } else {
        stryCov_9fa48("1357");
        throw new Error(stryMutAct_9fa48("1358") ? "" : (stryCov_9fa48("1358"), "Scientific notation not supported"));
      }
    }
    const parts = s.split(stryMutAct_9fa48("1359") ? "" : (stryCov_9fa48("1359"), "."));
    if (stryMutAct_9fa48("1363") ? parts.length <= 2 : stryMutAct_9fa48("1362") ? parts.length >= 2 : stryMutAct_9fa48("1361") ? false : stryMutAct_9fa48("1360") ? true : (stryCov_9fa48("1360", "1361", "1362", "1363"), parts.length > 2)) {
      if (stryMutAct_9fa48("1364")) {
        {}
      } else {
        stryCov_9fa48("1364");
        throw new Error(stryMutAct_9fa48("1365") ? "" : (stryCov_9fa48("1365"), "Invalid number format"));
      }
    }
    const integerPart = parts[0];
    const fractionalPart = stryMutAct_9fa48("1368") ? parts[1] && "" : stryMutAct_9fa48("1367") ? false : stryMutAct_9fa48("1366") ? true : (stryCov_9fa48("1366", "1367", "1368"), parts[1] || (stryMutAct_9fa48("1369") ? "Stryker was here!" : (stryCov_9fa48("1369"), "")));
    const denominator = 10n ** BigInt(fractionalPart.length);
    const numerator = BigInt(stryMutAct_9fa48("1370") ? integerPart - fractionalPart : (stryCov_9fa48("1370"), integerPart + fractionalPart));
    return stryMutAct_9fa48("1371") ? {} : (stryCov_9fa48("1371"), {
      numerator,
      denominator
    });
  }
}