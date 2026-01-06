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
import { RoundingMode } from "./strategies";
export * from "./strategies";
export function divideWithRounding(numerator: bigint, denominator: bigint, mode: RoundingMode): bigint {
  if (stryMutAct_9fa48("1382")) {
    {}
  } else {
    stryCov_9fa48("1382");
    if (stryMutAct_9fa48("1385") ? denominator !== 0n : stryMutAct_9fa48("1384") ? false : stryMutAct_9fa48("1383") ? true : (stryCov_9fa48("1383", "1384", "1385"), denominator === 0n)) {
      if (stryMutAct_9fa48("1386")) {
        {}
      } else {
        stryCov_9fa48("1386");
        throw new Error(stryMutAct_9fa48("1387") ? "" : (stryCov_9fa48("1387"), "Division by zero"));
      }
    }
    const quotient = stryMutAct_9fa48("1388") ? numerator * denominator : (stryCov_9fa48("1388"), numerator / denominator);
    const remainder = stryMutAct_9fa48("1389") ? numerator * denominator : (stryCov_9fa48("1389"), numerator % denominator);
    if (stryMutAct_9fa48("1392") ? remainder !== 0n : stryMutAct_9fa48("1391") ? false : stryMutAct_9fa48("1390") ? true : (stryCov_9fa48("1390", "1391", "1392"), remainder === 0n)) {
      if (stryMutAct_9fa48("1393")) {
        {}
      } else {
        stryCov_9fa48("1393");
        return quotient;
      }
    }
    const sign = stryMutAct_9fa48("1394") ? (numerator >= 0n ? 1n : -1n) / (denominator >= 0n ? 1n : -1n) : (stryCov_9fa48("1394"), ((stryMutAct_9fa48("1398") ? numerator < 0n : stryMutAct_9fa48("1397") ? numerator > 0n : stryMutAct_9fa48("1396") ? false : stryMutAct_9fa48("1395") ? true : (stryCov_9fa48("1395", "1396", "1397", "1398"), numerator >= 0n)) ? 1n : stryMutAct_9fa48("1399") ? +1n : (stryCov_9fa48("1399"), -1n)) * ((stryMutAct_9fa48("1403") ? denominator < 0n : stryMutAct_9fa48("1402") ? denominator > 0n : stryMutAct_9fa48("1401") ? false : stryMutAct_9fa48("1400") ? true : (stryCov_9fa48("1400", "1401", "1402", "1403"), denominator >= 0n)) ? 1n : stryMutAct_9fa48("1404") ? +1n : (stryCov_9fa48("1404"), -1n)));
    const absRemainder = (stryMutAct_9fa48("1408") ? remainder >= 0n : stryMutAct_9fa48("1407") ? remainder <= 0n : stryMutAct_9fa48("1406") ? false : stryMutAct_9fa48("1405") ? true : (stryCov_9fa48("1405", "1406", "1407", "1408"), remainder < 0n)) ? stryMutAct_9fa48("1409") ? +remainder : (stryCov_9fa48("1409"), -remainder) : remainder;
    const absDenominator = (stryMutAct_9fa48("1413") ? denominator >= 0n : stryMutAct_9fa48("1412") ? denominator <= 0n : stryMutAct_9fa48("1411") ? false : stryMutAct_9fa48("1410") ? true : (stryCov_9fa48("1410", "1411", "1412", "1413"), denominator < 0n)) ? stryMutAct_9fa48("1414") ? +denominator : (stryCov_9fa48("1414"), -denominator) : denominator;

    // Check for exact half
    const isHalf = stryMutAct_9fa48("1417") ? absRemainder * 2n !== absDenominator : stryMutAct_9fa48("1416") ? false : stryMutAct_9fa48("1415") ? true : (stryCov_9fa48("1415", "1416", "1417"), (stryMutAct_9fa48("1418") ? absRemainder / 2n : (stryCov_9fa48("1418"), absRemainder * 2n)) === absDenominator);
    const isMoreThanHalf = stryMutAct_9fa48("1422") ? absRemainder * 2n <= absDenominator : stryMutAct_9fa48("1421") ? absRemainder * 2n >= absDenominator : stryMutAct_9fa48("1420") ? false : stryMutAct_9fa48("1419") ? true : (stryCov_9fa48("1419", "1420", "1421", "1422"), (stryMutAct_9fa48("1423") ? absRemainder / 2n : (stryCov_9fa48("1423"), absRemainder * 2n)) > absDenominator);
    switch (mode) {
      case RoundingMode.FLOOR:
        if (stryMutAct_9fa48("1424")) {} else {
          stryCov_9fa48("1424");
          // If positive, quotient is already floor (truncation).
          // If negative, quotient is ceil (truncation towards zero), so we need to subtract 1.
          return (stryMutAct_9fa48("1428") ? sign <= 0n : stryMutAct_9fa48("1427") ? sign >= 0n : stryMutAct_9fa48("1426") ? false : stryMutAct_9fa48("1425") ? true : (stryCov_9fa48("1425", "1426", "1427", "1428"), sign > 0n)) ? quotient : stryMutAct_9fa48("1429") ? quotient + 1n : (stryCov_9fa48("1429"), quotient - 1n);
        }
      case RoundingMode.CEIL:
        if (stryMutAct_9fa48("1430")) {} else {
          stryCov_9fa48("1430");
          // If positive, quotient is floor, so add 1.
          // If negative, quotient is ceil, so keep it.
          return (stryMutAct_9fa48("1434") ? sign <= 0n : stryMutAct_9fa48("1433") ? sign >= 0n : stryMutAct_9fa48("1432") ? false : stryMutAct_9fa48("1431") ? true : (stryCov_9fa48("1431", "1432", "1433", "1434"), sign > 0n)) ? stryMutAct_9fa48("1435") ? quotient - 1n : (stryCov_9fa48("1435"), quotient + 1n) : quotient;
        }
      case RoundingMode.HALF_UP:
        if (stryMutAct_9fa48("1436")) {} else {
          stryCov_9fa48("1436");
          if (stryMutAct_9fa48("1439") ? isMoreThanHalf && isHalf : stryMutAct_9fa48("1438") ? false : stryMutAct_9fa48("1437") ? true : (stryCov_9fa48("1437", "1438", "1439"), isMoreThanHalf || isHalf)) {
            if (stryMutAct_9fa48("1440")) {
              {}
            } else {
              stryCov_9fa48("1440");
              return (stryMutAct_9fa48("1444") ? sign <= 0n : stryMutAct_9fa48("1443") ? sign >= 0n : stryMutAct_9fa48("1442") ? false : stryMutAct_9fa48("1441") ? true : (stryCov_9fa48("1441", "1442", "1443", "1444"), sign > 0n)) ? stryMutAct_9fa48("1445") ? quotient - 1n : (stryCov_9fa48("1445"), quotient + 1n) : stryMutAct_9fa48("1446") ? quotient + 1n : (stryCov_9fa48("1446"), quotient - 1n);
            }
          }
          return quotient;
        }
      case RoundingMode.HALF_DOWN:
        if (stryMutAct_9fa48("1447")) {} else {
          stryCov_9fa48("1447");
          if (stryMutAct_9fa48("1449") ? false : stryMutAct_9fa48("1448") ? true : (stryCov_9fa48("1448", "1449"), isMoreThanHalf)) {
            if (stryMutAct_9fa48("1450")) {
              {}
            } else {
              stryCov_9fa48("1450");
              return (stryMutAct_9fa48("1454") ? sign <= 0n : stryMutAct_9fa48("1453") ? sign >= 0n : stryMutAct_9fa48("1452") ? false : stryMutAct_9fa48("1451") ? true : (stryCov_9fa48("1451", "1452", "1453", "1454"), sign > 0n)) ? stryMutAct_9fa48("1455") ? quotient - 1n : (stryCov_9fa48("1455"), quotient + 1n) : stryMutAct_9fa48("1456") ? quotient + 1n : (stryCov_9fa48("1456"), quotient - 1n);
            }
          }
          return quotient;
        }
      case RoundingMode.HALF_EVEN:
        if (stryMutAct_9fa48("1457")) {} else {
          stryCov_9fa48("1457");
          if (stryMutAct_9fa48("1459") ? false : stryMutAct_9fa48("1458") ? true : (stryCov_9fa48("1458", "1459"), isMoreThanHalf)) {
            if (stryMutAct_9fa48("1460")) {
              {}
            } else {
              stryCov_9fa48("1460");
              return (stryMutAct_9fa48("1464") ? sign <= 0n : stryMutAct_9fa48("1463") ? sign >= 0n : stryMutAct_9fa48("1462") ? false : stryMutAct_9fa48("1461") ? true : (stryCov_9fa48("1461", "1462", "1463", "1464"), sign > 0n)) ? stryMutAct_9fa48("1465") ? quotient - 1n : (stryCov_9fa48("1465"), quotient + 1n) : stryMutAct_9fa48("1466") ? quotient + 1n : (stryCov_9fa48("1466"), quotient - 1n);
            }
          }
          if (stryMutAct_9fa48("1468") ? false : stryMutAct_9fa48("1467") ? true : (stryCov_9fa48("1467", "1468"), isHalf)) {
            if (stryMutAct_9fa48("1469")) {
              {}
            } else {
              stryCov_9fa48("1469");
              // If quotient is odd, round up (away from zero? no, to nearest even).
              // If quotient is even, keep it.
              if (stryMutAct_9fa48("1472") ? quotient % 2n === 0n : stryMutAct_9fa48("1471") ? false : stryMutAct_9fa48("1470") ? true : (stryCov_9fa48("1470", "1471", "1472"), (stryMutAct_9fa48("1473") ? quotient * 2n : (stryCov_9fa48("1473"), quotient % 2n)) !== 0n)) {
                if (stryMutAct_9fa48("1474")) {
                  {}
                } else {
                  stryCov_9fa48("1474");
                  return (stryMutAct_9fa48("1478") ? sign <= 0n : stryMutAct_9fa48("1477") ? sign >= 0n : stryMutAct_9fa48("1476") ? false : stryMutAct_9fa48("1475") ? true : (stryCov_9fa48("1475", "1476", "1477", "1478"), sign > 0n)) ? stryMutAct_9fa48("1479") ? quotient - 1n : (stryCov_9fa48("1479"), quotient + 1n) : stryMutAct_9fa48("1480") ? quotient + 1n : (stryCov_9fa48("1480"), quotient - 1n);
                }
              }
            }
          }
          return quotient;
        }
      case RoundingMode.TRUNCATE:
        if (stryMutAct_9fa48("1481")) {} else {
          stryCov_9fa48("1481");
          // Truncate towards zero (simply return the quotient without adjustment)
          return quotient;
        }
      default:
        if (stryMutAct_9fa48("1482")) {} else {
          stryCov_9fa48("1482");
          throw new Error(stryMutAct_9fa48("1483") ? `` : (stryCov_9fa48("1483"), `Unsupported rounding mode: ${mode}`));
        }
    }
  }
}