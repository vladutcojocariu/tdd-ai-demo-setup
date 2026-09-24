---
name: pr-readiness
description: >
  Pre-PR go/no-go gate scoring the branch on objective checks. Threshold to proceed is 80. Use when
  asked "can I open the PR", "is this ready to push", "pre-PR check", or before raising a pull request.
  Do NOT trigger for reviewing someone else's diff (see code-review-checklist).
---

# PR Readiness

| #   | Check                                 | Points | Method                                                                               |
| --- | ------------------------------------- | ------ | ------------------------------------------------------------------------------------ |
| 1   | Unit tests pass                       | 25     | `npm test` — and the collected count is non-zero                                     |
| 2   | Types clean                           | 20     | `npx tsc -b`                                                                         |
| 3   | Lint clean                            | 15     | `npm run lint`; warnings only scores 10                                              |
| 4   | Issue reference present               | 10     | branch name or commit trailer                                                        |
| 5   | No leftover TODO or FIXME in the diff | 10     | grep the diff, excluding test files                                                  |
| 6   | Changed source has changed tests      | 10     | pair each `src/**/x.ts` with its co-located `src/**/x.test.ts`                       |
| 7   | Shared contract changes have coverage | 5      | if `src/config.ts` or `src/types/**` changed, check every importer has updated tests |
| 8   | No debug output in the diff           | 5      | grep the diff for `console.log`                                                      |

Formatting is not scored: `npx prettier --write .` fixes it in one step, so fix it rather than
counting it.

| Score    | Verdict      | Action                         |
| -------- | ------------ | ------------------------------ |
| 90-100   | Ship it      | Open the PR                    |
| 80-89    | Review-ready | Open it; the gaps are warnings |
| Below 80 | Not ready    | Fix the listed blockers first  |

Output the table with points and the evidence per row, then list blockers and warnings separately.
