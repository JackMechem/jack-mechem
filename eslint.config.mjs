// ESLint (flat config): Next.js + React + TypeScript rules. Run with `pnpm lint`.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // eslint-plugin-react can't auto-detect the version under ESLint 10, so name it.
  { settings: { react: { version: "19" } } },
  // allow `const { unwanted, ...rest } = obj` and _-prefixed placeholders
  { rules: { "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true, argsIgnorePattern: "^_", varsIgnorePattern: "^_" }] } },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "convex/_generated/**", "mockups/**", "scripts/brand/**"]),
]);
