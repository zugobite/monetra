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
import { MonetraError, MonetraErrorCode } from "./BaseError";
export class RoundingRequiredError extends MonetraError {
  constructor(operation?: string, result?: number) {
    if (stryMutAct_9fa48("258")) {
      {}
    } else {
      stryCov_9fa48("258");
      let message = stryMutAct_9fa48("259") ? "" : (stryCov_9fa48("259"), "Rounding is required for this operation but was not provided.");
      if (stryMutAct_9fa48("262") ? operation || result !== undefined : stryMutAct_9fa48("261") ? false : stryMutAct_9fa48("260") ? true : (stryCov_9fa48("260", "261", "262"), operation && (stryMutAct_9fa48("264") ? result === undefined : stryMutAct_9fa48("263") ? true : (stryCov_9fa48("263", "264"), result !== undefined)))) {
        if (stryMutAct_9fa48("265")) {
          {}
        } else {
          stryCov_9fa48("265");
          message = (stryMutAct_9fa48("266") ? `` : (stryCov_9fa48("266"), `Rounding required for ${operation}: result ${result} is not an integer.\n`)) + (stryMutAct_9fa48("267") ? `` : (stryCov_9fa48("267"), `💡 Tip: Provide a rounding mode:\n`)) + (stryMutAct_9fa48("268") ? `` : (stryCov_9fa48("268"), `   money.${operation}(value, { rounding: RoundingMode.HALF_UP })\n`)) + (stryMutAct_9fa48("269") ? `` : (stryCov_9fa48("269"), `   Available modes: HALF_UP, HALF_DOWN, HALF_EVEN, FLOOR, CEIL, TRUNCATE`));
        }
      }
      super(message, MonetraErrorCode.ROUNDING_REQUIRED);
    }
  }
}