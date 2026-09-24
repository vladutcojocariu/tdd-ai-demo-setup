---
name: static-analysis-gates
description: >
  Enforce type checking and linting for every source change. Work is not complete until
  {{TYPECHECK_CMD}} passes and {{LINT_CMD}} reports zero errors and warnings on changed files.
  Do NOT trigger for which types to use or style preferences — this skill is about running the gates.
---

# Static Analysis Gates

## The two-check requirement

Every source change must satisfy both:

1. **Types:** `{{TYPECHECK_CMD}}` exits clean.
2. **Lint:** `{{LINT_CMD}}` reports zero errors and zero warnings on the changed files.

If either fails, the work is incomplete. Not "mostly done with a known warning" — incomplete.

## Order matters

Run the type check first. Type errors cause spurious lint findings, so fixing lint before types
produces churn. After any fix, re-run **both**, not just the one that failed.

## Common failures and fixes

| Symptom                | Fix                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| Loose or dynamic types | Give the value a real type, or a constrained unknown with a guard                                    |
| Unused symbol          | Delete it, or prefix per the project's convention for intentional unused                             |
| Deprecated API         | Use the replacement; do not suppress                                                                 |
| False positive         | Suppress the single line with a comment naming the rule and the reason. Never suppress a whole file. |

## Not complete if

- Any type error remains.
- Any lint error or warning remains on a changed file.
- The checks were never run, or their output was never read.
