import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  target: 'es2022',
  dts: true,
  format: ['esm', 'cjs'],
  minify: false,
});
