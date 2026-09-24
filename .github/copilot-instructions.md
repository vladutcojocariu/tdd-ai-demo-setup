<!-- ai-tests-bootstrap:start -->

# Project Instructions

## Architecture

A Vite + React 19 + TypeScript single-page app that talks to the public JSONPlaceholder REST API over
native `fetch`. All source lives under `src/`: `api/` for HTTP access and response mapping, `hooks/`
for stateful React logic, `components/` for presentation, `types/` for shared contracts, and
`config.ts` for the `API_BASE_URL` resolution. `src/test/setup.ts` is loaded by Vitest and registers
the `jest-dom` matchers. The repository is a deliberately thin scaffold — most feature code is still
to be written, so prefer adding to these directories over introducing new top-level ones.

## Critical rules

1. **Tests are mandatory for every change to TypeScript source.** TDD red-green-refactor is
   the default. See the `tdd-requirement` skill.
2. **Vitest is the unit test runner.** Test functions are globals; do not import them.
3. **Never claim completion without fresh verification output.** See `verification-before-completion`.
4. **Use npm**, never another package manager.
5. **Scope discipline.** When asked to change one thing, treat everything else as immutable. Surface
   improvements as questions; never silently delete a mechanism you assume is redundant.
6. **Never replace these with test doubles:** `src/config.ts`, `src/types/**`, the mapping and
   validation helpers in `src/api/**`, and the hooks in `src/hooks/**`. Fake `fetch` instead. See
   `test-doubles-policy`.
7. **Lint runs at `--max-warnings=0`.** A warning fails the build, so treat warnings as errors.
8. **Prettier owns formatting:** single quotes, no semicolons, trailing commas. Do not hand-format
   against it, and do not add formatting rules to ESLint — `eslint-config-prettier` disables them.

## Commands

```bash
npm test                 # all unit tests
npx vitest run <file>    # one file
npx tsc -b               # types
npm run lint             # lint
npx prettier --write .   # format
npm run build            # build
```

## Workflow principles

- **Lessons capture.** After any correction from a human, append the pattern and the reason to
  `memory-bank/lessons.md`. Read that file at the start of non-trivial work.
- **Re-plan on failure.** If an approach fails twice, stop and re-plan rather than trying a third variant.
- **Verification before done.** `npm test` and `npm run lint` must pass before you claim completion.
- **Simplicity first.** Minimal diff. Root causes, not workarounds.

## Skill routing

Skills live in `.github/skills` and load automatically when their description matches the task. If one
did not load and the area below applies, read `.github/skills/<name>/SKILL.md` yourself.

| Area                       | Skill                                                      |
| -------------------------- | ---------------------------------------------------------- |
| Any source change          | `tdd-requirement`, `static-analysis-gates`                 |
| Before claiming done       | `verification-before-completion`                           |
| Mocking decisions          | `test-doubles-policy`                                      |
| Bug tickets                | `bugfix-tdd`                                               |
| Multi-phase implementation | `batch-execution`, `phase-verification`                    |
| New feature, unclear shape | `design-exploration`                                       |
| Review and pre-PR          | `code-review-checklist`, `regression-risk`, `pr-readiness` |
| Editing this setup         | `skill-authoring`                                          |

## Agents

Pick one from the agents dropdown in Copilot Chat.

| Agent               | Use for                                                         |
| ------------------- | --------------------------------------------------------------- |
| `solo-dev`          | Trivial and simple tasks: one file, a test, a small fix         |
| `conductor`         | Complex multi-phase features; orchestrates subagents with gates |
| `planning-subagent` | Writes TDD plans to `plans`; also usable directly               |

`explorer-subagent`, `architect-review-subagent`, `implement-subagent`, and `code-review-subagent` are
dispatched by the agents above and do not appear in the dropdown.
<!-- ai-tests-bootstrap:end -->
