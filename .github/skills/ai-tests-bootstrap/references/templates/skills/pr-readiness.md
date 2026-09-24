---
name: pr-readiness
description: Pre-PR go/no-go gate scoring the branch on objective checks. Threshold to proceed is 80.
---

# PR Readiness

| #   | Check                                                                             | Points | Method                                  |
| --- | --------------------------------------------------------------------------------- | ------ | --------------------------------------- |
| 1   | Unit tests pass                                                                   | 25     | `{{TEST_CMD}}`                          |
| 2   | Types clean                                                                       | 20     | `{{TYPECHECK_CMD}}`                     |
| 3   | Lint clean                                                                        | 15     | `{{LINT_CMD}}`; warnings only scores 10 |
| 4   | Issue reference present                                                           | 10     | branch name or commit trailer           |
| 5   | No leftover TODO or FIXME in the diff                                             | 10     | grep the diff, excluding test files     |
| 6   | Changed source has changed tests                                                  | 10     | pair each source file with its test     |
| 7   | <<FILL: project blast-radius check, or "Changed public API has updated callers">> | 5      | <<FILL: how to check it>>               |
| 8   | No debug output in the diff                                                       | 5      | grep the diff                           |

| Score    | Verdict      | Action                         |
| -------- | ------------ | ------------------------------ |
| 90-100   | Ship it      | Open the PR                    |
| 80-89    | Review-ready | Open it; the gaps are warnings |
| Below 80 | Not ready    | Fix the listed blockers first  |

Output the table with points and the evidence per row, then list blockers and warnings separately.
