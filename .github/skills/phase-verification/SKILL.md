---
name: phase-verification
description: >
  Fast automated gate after an implementation phase: functional checks, anti-pattern greps, and quality
  spot checks. Use after any phase of work before committing, and when asked to "verify the phase" or
  "check the batch". Do NOT trigger for planning or docs. This is a command-driven gate; deep analysis
  belongs to code-review-subagent.
---

# Phase Verification Gate

Run all three checks even when the first fails. You want the complete picture, not the first error.

## Check 1 — functional

```bash
npm test
npx tsc -b
npm run lint
```

`npm test` runs with `passWithNoTests: true`. Read the test count — `No test files found` exits zero
and is a failure of this gate, not a pass.

Report:

```
Functional: PASS | FAIL
- Tests: N passed / N failed (name the failures)
- Types: pass | N errors (name the files)
- Lint: pass | N errors (name the files)
```

## Check 2 — anti-pattern detection

Get the changed files, including uncommitted and untracked work — this gate runs before the commit:

```bash
git diff --name-only main
git ls-files --others --exclude-standard
```

Search each changed file for the patterns below. When a critical rule is added to the root instructions
and can be expressed as a search, add a row here.

| Pattern                  | Detection                                                               | Why it is banned                                                 |
| ------------------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Escape-hatch types       | `grep -nE ':\s*any\b\|as any\b\|<any>' -- 'src/**/*.ts' 'src/**/*.tsx'` | Defeats `strict` mode; the bug surfaces at runtime instead       |
| Suppressed type errors   | `grep -n '@ts-ignore\|@ts-expect-error\|@ts-nocheck' -- 'src/**'`       | Hides the very error the type checker exists to report           |
| Suppressed lint rules    | `grep -n 'eslint-disable' -- 'src/**'`                                  | Lint runs at `--max-warnings=0`; suppression is not a fix        |
| Mocked config            | `grep -n "vi.mock(.*config" -- 'src/**'`                                | `src/config.ts` is protected — see `test-doubles-policy`         |
| Mocked API mappers       | `grep -n "vi.mock(.*api/" -- 'src/**'`                                  | The mapping helpers in `src/api/**` are the logic under test     |
| Mocked hooks             | `grep -n "vi.mock(.*hooks/" -- 'src/**'`                                | Hooks in `src/hooks/**` must be exercised for real               |
| Debug output             | `grep -n 'console\.\(log\|debug\|dir\)' -- 'src/**'`                    | Ships noise to the browser console                               |
| Focused or skipped tests | `grep -nE '\.(only\|skip\|todo)\(' -- 'src/**'`                         | `.only` silently hides the rest of the suite                     |
| Test-ID queries          | `grep -n 'getByTestId\|data-testid' -- 'src/**'`                        | Query by accessible role and name; test IDs bypass accessibility |
| Live network in tests    | `grep -n 'jsonplaceholder.typicode.com' -- 'src/**/*.test.*'`           | Tests must stub `fetch`, never reach the real API                |
| Invented API             | For each new call in the diff, confirm the symbol exists                | Models hallucinate plausible functions                           |

Report: `Anti-patterns: CLEAN | N violations` with file and line for each.

## Check 3 — quality spot check

1. Any new file over 300 lines.
2. Business logic added to a presentation layer — fetching, mapping, or validation inside
   `src/components/**` instead of `src/api/**` or `src/hooks/**`.
3. Blast radius: `src/config.ts` and `src/types/**` are consumed by every other module. A change to
   either needs test coverage in each consumer it affects, not only where it was edited.

## Gate logic

All three pass, proceed. Any fail, return the specific failures to the implementer. Maximum three
retries per phase, then escalate to the human with:

```
FAILURE REPORT
Phase: {name}
Attempts: {n} of 3
Persistent failures: {specifics}
Recommendation: {what to try next}
```
