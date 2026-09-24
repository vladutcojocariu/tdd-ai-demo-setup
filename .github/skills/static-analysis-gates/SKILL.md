---
name: static-analysis-gates
description: >
  Enforce type checking and linting for every source change. Work is not complete until `npx tsc -b`
  passes and `npm run lint` reports zero errors and warnings on changed files. Trigger on lint errors,
  type errors, red squiggles, and "why won't it compile". Do NOT trigger for which types to use or
  style preferences — this skill is about running the gates, not about design.
---

# Static Analysis Gates

## The two-check requirement

Every source change must satisfy both:

1. **Types:** `npx tsc -b` exits clean.
2. **Lint:** `npm run lint` reports zero errors and zero warnings on the changed files.

If either fails, the work is incomplete. Not "mostly done with a known warning" — incomplete.

The lint script already runs at `--max-warnings=0`, so ESLint treats a warning as a build failure. The
`react-refresh/only-export-components` rule is configured as a warning and will therefore fail the
build like any error.

## Order matters

Run the type check first. Type errors cause spurious lint findings, so fixing lint before types
produces churn. After any fix, re-run **both**, not just the one that failed.

```bash
npx tsc -b
npm run lint
```

## Formatting is not linting

`eslint-config-prettier` is applied last in `eslint.config.js`, which switches off every formatting
rule. ESLint will never complain about quotes, semicolons, or line width — Prettier owns those. If
formatting looks wrong, run `npx prettier --write .`; do not add a formatting rule to ESLint.

## Common failures and fixes

| Symptom                                 | Fix                                                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `any` or an implicit `any`              | Give the value a real type, or `unknown` plus a type guard that narrows it                           |
| `noUnusedLocals` / `noUnusedParameters` | Delete the symbol. If a parameter must stay for arity, prefix it with `_`                            |
| `@typescript-eslint/no-unused-vars`     | Same — delete it rather than suppress it                                                             |
| `react-hooks/exhaustive-deps`           | Add the dependency, or restructure so it is not needed. Do not silence the rule                      |
| `react-refresh/only-export-components`  | Move the non-component export into its own module                                                    |
| Deprecated API                          | Use the replacement; do not suppress                                                                 |
| Genuine false positive                  | Suppress the single line with a comment naming the rule and the reason. Never suppress a whole file. |

`tsc -b` is incremental and writes to `node_modules/.tmp`. If it reports a stale error you believe is
fixed, delete that directory and run it again rather than assuming the error is wrong.

## Not complete if

- Any type error remains.
- Any lint error or warning remains on a changed file.
- The checks were never run, or their output was never read.
