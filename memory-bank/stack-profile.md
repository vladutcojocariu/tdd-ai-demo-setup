# Stack Profile

Detected by `ai-tests-bootstrap` on 2026-09-24 and confirmed by the user. Every generated skill,
instruction file, and agent was filled from this table. If a command here changes, update this file and
re-run the bootstrap so the generated files stay in step.

Token names are written without braces on purpose, so a search for unfilled template tokens does not
match this file.

| Token                | Value                                                                      |
| -------------------- | -------------------------------------------------------------------------- |
| LANG                 | TypeScript                                                                 |
| PKG_MGR              | npm                                                                        |
| UNIT_RUNNER          | Vitest                                                                     |
| TEST_GLOBALS         | yes                                                                        |
| TEST_CMD             | `npm test`                                                                 |
| TEST_ONE_CMD         | `npx vitest run <file>`                                                    |
| TYPECHECK_CMD        | `npx tsc -b`                                                               |
| LINT_CMD             | `npm run lint`                                                             |
| FORMAT_CMD           | `npx prettier --write .`                                                   |
| BUILD_CMD            | `npm run build`                                                            |
| SRC_GLOBS            | `src/**/*.ts,src/**/*.tsx`                                                 |
| TEST_GLOBS           | `src/**/*.test.ts,src/**/*.test.tsx,src/**/*.spec.ts,src/**/*.spec.tsx`    |
| UNIT_TEST_LOCATION   | Co-located next to the source file as `<name>.test.ts` / `<name>.test.tsx` |
| E2E_ACTIVE           | no                                                                         |
| E2E_RUNNER           | n/a                                                                        |
| E2E_CMD              | n/a                                                                        |
| E2E_LIST_CMD         | n/a                                                                        |
| E2E_TEST_DIR         | n/a                                                                        |
| E2E_TEST_GLOBS       | n/a                                                                        |
| SKILLS_DIR           | .github/skills                                                             |
| MEMORY_DIR           | memory-bank                                                                |
| PLANS_DIR            | plans                                                                      |
| CONTEXT_FILE         | .context/current-task.md                                                   |
| MAIN_BRANCH          | main                                                                       |
| TEST_STRICTNESS_WORD | mandatory                                                                  |
| BATCH_CHECKPOINTS    | off                                                                        |

## Command verification

Each command was run once during detection. Results:

| Command                  | Result                                                                      |
| ------------------------ | --------------------------------------------------------------------------- |
| `npm test`               | Pass — `No test files found, exiting with code 0` (`passWithNoTests: true`) |
| `npx vitest run <file>`  | Pass — the path is accepted as a filter                                     |
| `npx tsc -b`             | Pass — no diagnostics                                                       |
| `npm run lint`           | Pass — clean at `--max-warnings=0`                                          |
| `npx prettier --write .` | Runs — `--check` reported 3 pre-existing unformatted files                  |
| `npm run build`          | Pass — `✓ built in 257ms`                                                   |

There are no pre-existing test failures, because there are no tests yet.

## Protected dependencies

Confirmed by the user. These must never be replaced by a mock, stub, or spy in a test.

| Module                                      | Why                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------- |
| `src/config.ts`                             | Resolves `API_BASE_URL`, including the env-var fallback. Mocking it hides bugs. |
| `src/types/**`                              | Type contracts. Never stubbed.                                                  |
| `src/api/**` mapping and validation helpers | Pure request/response transforms — the logic under test.                        |
| `src/hooks/**`                              | Test through the real hook, not a fake implementation of it.                    |

The one boundary that **should** be faked is the network call itself: `fetch` against the
JSONPlaceholder API.

## Assumptions

Recorded because they were not asked about. Reverse any of them by editing the generated files.

- `memory-bank/` and `plans/` are committed, so lessons and plans are shared across the team.
- `.context/` is gitignored — it holds throwaway per-task state.
- No `typecheck` script exists in `package.json`, so `npx tsc -b` is used directly. It is the same
  compiler invocation that `npm run build` performs first.
- No `format` script exists, so `npx prettier --write .` is used directly. `.prettierignore` already
  excludes `dist`, `coverage`, and `node_modules`.

## Deviations from the detection contract

- **`TEST_GLOBS` matches no existing file.** The repository intentionally ships with zero tests;
  `src/__tests__/` contains only a `.gitkeep`. The globs mirror the `include` pattern already set in
  `vitest.config.ts`, so they will match as soon as the first test is written. Normally every glob must
  match an existing file — this is the documented exception.
- **`node_modules/` was absent at detection time.** It was restored with `npm ci`, which does not
  modify `package.json` or `package-lock.json`. Both were verified unchanged afterwards.

## Install scope

Full install — not minimal. Every skill and agent in the catalogue was generated except the E2E ones.

E2E is inactive, so the five `e2e-*` skills, the `e2e-journey` agent, and `e2e.instructions.md` were
not generated, and every reference to them was pruned. To add the E2E layer later: install an E2E
runner, write at least one spec, then re-run the bootstrap. It resumes from this file.

## Pinned models

Confirmed by the user, so every agent carries an explicit `model:` field rather than inheriting the
chat picker. Each name must match the picker exactly — an unrecognised value is ignored silently and
the agent runs on whatever happens to be selected.

| Tier         | Model                      | Agents                                                                   |
| ------------ | -------------------------- | ------------------------------------------------------------------------ |
| Fast         | `Gemini 3.8 Flash` | `explorer-subagent`                                                      |
| Balanced     | `Claude Sonnet 5`          | `conductor`, `implement-subagent`, `solo-dev`                            |
| Most capable | `Claude Opus 5`            | `planning-subagent`, `architect-review-subagent`, `code-review-subagent` |

If a model is renamed or retired, update both the agent files and this table.
