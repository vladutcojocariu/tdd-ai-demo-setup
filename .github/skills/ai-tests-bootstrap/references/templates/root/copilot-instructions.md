<!-- ai-tests-bootstrap:start -->

# Project Instructions

## Architecture

<<FILL: 2 to 6 lines — what this project is, its major modules, and which directories are shared versus
isolated. Derive from the repository; do not invent. If the file already had an architecture section,
delete this section instead of duplicating it.>>

## Critical rules

1. **Tests are {{TEST_STRICTNESS_WORD}} for every change to {{LANG}} source.** TDD red-green-refactor is
   the default. See the `tdd-requirement` skill.
2. **{{UNIT_RUNNER}} is the unit test runner.** <<FILL: if TEST_GLOBALS is yes, write "Test functions
   are globals; do not import them." Otherwise delete this sentence.>>
3. **Never claim completion without fresh verification output.** See `verification-before-completion`.
4. **Use {{PKG_MGR}}**, never another package manager.
5. **Scope discipline.** When asked to change one thing, treat everything else as immutable. Surface
   improvements as questions; never silently delete a mechanism you assume is redundant.
6. **Never replace these with test doubles:** <<FILL: the protected dependencies confirmed in Phase 1,
   comma-separated>>. See `test-doubles-policy`.
   <<FILL: further numbered rules the team already follows that change how code is written, found in
   existing docs, lint config, or contributing guides. Delete this line if there are none.>>

## Commands

```bash
{{TEST_CMD}}            # all unit tests
{{TEST_ONE_CMD}}        # one file
{{E2E_CMD}}             # end-to-end suite
{{TYPECHECK_CMD}}       # types
{{LINT_CMD}}            # lint
{{FORMAT_CMD}}          # format
{{BUILD_CMD}}           # build
```

## Workflow principles

- **Lessons capture.** After any correction from a human, append the pattern and the reason to
  `{{MEMORY_DIR}}/lessons.md`. Read that file at the start of non-trivial work.
- **Re-plan on failure.** If an approach fails twice, stop and re-plan rather than trying a third variant.
- **Verification before done.** `{{TEST_CMD}}` and `{{LINT_CMD}}` must pass before you claim completion.
- **Simplicity first.** Minimal diff. Root causes, not workarounds.

## Skill routing

Skills live in `{{SKILLS_DIR}}` and load automatically when their description matches the task. If one
did not load and the area below applies, read `{{SKILLS_DIR}}/<name>/SKILL.md` yourself.

| Area                       | Skill                                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| Any source change          | `tdd-requirement`, `static-analysis-gates`                                                           |
| Before claiming done       | `verification-before-completion`                                                                     |
| Mocking decisions          | `test-doubles-policy`                                                                                |
| Bug tickets                | `bugfix-tdd`                                                                                         |
| Multi-phase implementation | `batch-execution`, `phase-verification`                                                              |
| New feature, unclear shape | `design-exploration`                                                                                 |
| E2E tests                  | `e2e-fundamentals`, `e2e-journey-vocabulary`, `e2e-selector-conventions`, `e2e-environment-and-auth` |
| Failing E2E test           | `e2e-test-triage`                                                                                    |
| Review and pre-PR          | `code-review-checklist`, `regression-risk`, `pr-readiness`                                           |
| Editing this setup         | `skill-authoring`                                                                                    |

## Agents

Pick one from the agents dropdown in Copilot Chat.

| Agent               | Use for                                                         |
| ------------------- | --------------------------------------------------------------- |
| `solo-dev`          | Trivial and simple tasks: one file, a test, a small fix         |
| `conductor`         | Complex multi-phase features; orchestrates subagents with gates |
| `e2e-journey`       | Turning a plain-language user journey into a passing E2E test   |
| `planning-subagent` | Writes TDD plans to `{{PLANS_DIR}}`; also usable directly       |

`explorer-subagent`, `architect-review-subagent`, `implement-subagent`, and `code-review-subagent` are
dispatched by the agents above and do not appear in the dropdown.
<!-- ai-tests-bootstrap:end -->
