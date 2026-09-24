---
name: bugfix-tdd
description: >
  Structured bug-fixing workflow that reproduces the defect in a failing test before any fix code.
  Use for any bug report, defect, regression, crash, or "it should do X but does Y". Do NOT trigger for
  new features or refactoring (see tdd-requirement and design-exploration).
---

# Bug Fix Workflow

## Steps

0. **Load context.** Read `memory-bank/lessons.md`. If `.context/current-task.md` exists, read it.
1. **Understand.** Restate the failure condition in two or three specific sentences. If the report is
   vague, ask one clarifying question and stop until answered.
2. **Locate.** Find the relevant source and its tests. Prefer symbol-aware search over text search.
3. **Root cause.** Trace the actual code path. Do not guess. Record what is wrong, where, and why the
   current code produces the wrong result.
4. **RED.** Write a test that reproduces the exact bug. Consult `tdd-requirement` for conventions.
5. **Confirm the failure is real.** Run `npx vitest run <file>`. If it passes, it does not reproduce the
   bug — go back to step 4. If it fails for the wrong reason (import error, typo), fix the test, not the
   source.
6. **GREEN.** Fix only the root cause. No drive-by refactoring.
7. **Confirm the fix.** Run `npx vitest run <file>`. Maximum three attempts, then re-analyze from step 3.
8. **Full verification.** `npm test`, `npx tsc -b`, and `npm run lint`. If any fails, fix and re-run
   **all** of them.
9. **Document.** Report the bug, the root cause, the fix, and the tests added. Append anything novel to
   `memory-bank/lessons.md`.

## Test type by bug type

| Bug type                                  | Test type                                                     |
| ----------------------------------------- | ------------------------------------------------------------- |
| Request building, response mapping, logic | Unit test on the `src/api/**` module                          |
| Wrong state, stale data, effect ordering  | `renderHook` test on the `src/hooks/**` module                |
| Wrong rendering or interaction            | React Testing Library test on the component                   |
| Spans layers                              | A test at each layer that is actually wrong, not one big test |

If the bug only reproduces against a specific HTTP response, encode that response in the `fetch` stub.
Never reach the real API to reproduce a bug.

## Critical rules

1. Never write fix code before the failing test exists.
2. Never declare done before full verification passes.
3. Verify a function exists before calling it. Never add a parameter that is not in the signature.
