---
name: Source changes
description: Test-first and static-analysis rules for any change to TypeScript source files.
applyTo: 'src/**/*.ts,src/**/*.tsx'
---

When you create or modify these files:

- Load the `tdd-requirement` and `static-analysis-gates` skills before writing code.
- Write the failing test first and run `npx vitest run <file>`. It must fail for the reason you
  predicted before you write production code.
- Put the test next to the source file: `src/api/posts.ts` is tested by `src/api/posts.test.ts`.
- Keep the layers separate: requests and mapping in `src/api/**`, state and effects in `src/hooks/**`,
  presentation only in `src/components/**`.
- Before claiming completion, follow `verification-before-completion`: fresh `npm test`, `npx tsc -b`,
  and `npm run lint` output produced after your last edit. Lint runs at `--max-warnings=0`.
