/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
    "This config checks your tests by deliberately breaking your code (mutating it).",
  packageManager: "pnpm",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "vitest",
  plugins: ["@stryker-mutator/vitest-runner"],
  coverageAnalysis: "perTest",
  tsconfigFile: "tsconfig.json",
  mutate: [
    "src/**/*.ts",
    "!src/index.ts",
    "!src/**/types.ts",
    "!src/test/**",
    "!src/**/*.d.ts",
  ],
  ignoreStatic: true,
  thresholds: { high: 80, low: 60, break: 50 },
  timeoutMS: 10000,
  timeoutFactor: 1.5,
  vitest: {
    configFile: "vitest.config.mts",
  },
};

export default config;
