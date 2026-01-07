import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/ledger/index.ts',
    'src/financial/index.ts',
    'src/tokens/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: false,
  splitting: false,
  sourcemap: false,
  minify: true,
  treeshake: true,
  clean: true,
});
