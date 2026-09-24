# Detection and the question message (Phases 0 and 1)

## 0.1 Preflight

Check these before detecting anything. Each one feeds the single question message in 0.5.

| Check                | How                                                                                                                              | If it fails                                                                                                                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Git working tree     | `git status --porcelain`                                                                                                         | Uncommitted changes exist: say so in the question message and recommend committing or stashing first, so the bootstrap's output is reviewable as its own diff. Proceed if the user says so. |
| Previous run         | `<memory dir>/stack-profile.md` exists                                                                                           | Offer to **resume**: reuse its values and skip files that already exist and contain no `{{` or `<<` markers.                                                                                |
| Existing agent setup | `.github/copilot-instructions.md`, `.github/instructions/`, `.github/agents/`, `.github/skills/`, `.claude/skills/`, `AGENTS.md` | Note every file the bootstrap would touch that already exists. They are listed as conflicts in 0.5.                                                                                         |
| Unit test runner     | see 0.2                                                                                                                          | None found: ask whether to continue. Without a runner the TDD layer cannot be verified. Installing a runner is application work and out of scope.                                           |
| Monorepo             | several manifests with their own test scripts (workspaces, `packages/*`, `apps/*`)                                               | Use root-level scripts if they run every package. Otherwise ask which package is the target. One bootstrap run serves one profile.                                                          |

## 0.2 Detect

Inspect the repository. Sources to check, in order:

| Looking for            | Where to look                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language and toolchain | Manifest files: `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, `build.gradle*`, `*.csproj`, `Gemfile`, `composer.json`                  |
| Package manager        | Lockfile: `yarn.lock`, `package-lock.json`, `pnpm-lock.yaml`, `bun.lockb`, `poetry.lock`, `uv.lock`, `Gemfile.lock`; `packageManager` field in `package.json` |
| Unit test runner       | Dev dependencies plus config files (`vitest.config.*`, `jest.config.*`, `pytest.ini`, `[tool.pytest]`, `phpunit.xml`, `_test.go` files)                       |
| E2E runner             | `playwright.config.*`, `cypress.config.*`, `wdio.conf.*`, `*.feature` files, `testcafe` or `selenium` dependencies                                            |
| Type checker           | `tsconfig.json`, `mypy.ini`, `[tool.mypy]`, `pyrightconfig.json`, a typecheck script, or a compiled language                                                  |
| Linter and formatter   | `eslint.config.*`, `.eslintrc*`, `biome.json`, `ruff.toml`, `[tool.ruff]`, `.golangci.yml`, `.prettierrc*`, `rustfmt.toml`                                    |
| Existing test layout   | Search for `*.test.*`, `*.spec.*`, `*_test.*`, `test_*.py`, `test/`, `tests/`, `__tests__/`, `spec/`                                                          |
| CI gates               | `.github/workflows/*.yml` — the commands CI runs are the most trustworthy command source                                                                      |
| Main branch            | `git symbolic-ref refs/remotes/origin/HEAD`, else `main` or `master` if it exists                                                                             |

Read the manifest's script section and the CI workflow before inventing any command. Prefer the exact
command CI runs.

## 0.3 Command rules

Every command token must be a real command that **terminates on its own and needs no input**.

- **No watch mode.** Vitest: use `vitest run` or `--run`. Jest: `--watchAll=false` or `CI=true`. Any
  script that starts a watcher or a dev server is not a test command.
- **`TEST_ONE_CMD` takes one file.** Write it with the literal text `<file>` where the path goes, for
  example `yarn vitest run <file>` or `pytest <file>` or `go test ./<package>/...`.
- **`E2E_LIST_CMD` validates configuration without running tests**, for example
  `npx playwright test --list`. Use `n/a` if the runner has no such mode.
- **Missing capability is `n/a`, never a guess.** No type checker: `TYPECHECK_CMD` is `n/a`. See
  `conventions.md` for how `n/a` values are removed from generated files.
- **Run each command once now** (except the full E2E suite) and record whether it passes. A command
  that fails now for a reason unrelated to code — missing script, wrong path — is a wrong command: fix
  the value. A command that runs but reports failing tests is a correct command with pre-existing
  failures: keep it and record the failure count.

## 0.4 The Stack Profile

Fill every row. Write the finished table to `<memory dir>/stack-profile.md` in Phase 2. In that file,
write the token names **without braces** (`LANG`, not the braced form), so the Phase 7 search for
leftover tokens does not match the profile itself.

| Token                | Example                                                | Notes                                                                                                          |
| -------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| LANG                 | TypeScript                                             | Primary source language                                                                                        |
| PKG_MGR              | yarn                                                   | From lockfile                                                                                                  |
| UNIT_RUNNER          | Vitest                                                 |                                                                                                                |
| TEST_GLOBALS         | yes                                                    | Whether test functions are globals (Vitest `globals: true`, Jest default)                                      |
| TEST_CMD             | yarn test --run                                        | All unit tests, terminates                                                                                     |
| TEST_ONE_CMD         | yarn test --run <file>                                 | One file                                                                                                       |
| TYPECHECK_CMD        | yarn typecheck                                         | or `n/a`                                                                                                       |
| LINT_CMD             | yarn lint                                              | or `n/a`                                                                                                       |
| FORMAT_CMD           | yarn format                                            | or `n/a`                                                                                                       |
| BUILD_CMD            | yarn build                                             | or `n/a`                                                                                                       |
| SRC_GLOBS            | `src/**/*.ts,src/**/*.tsx`                             | Comma-separated, no spaces, relative to the repository root. Scope to source directories, not `**` everywhere. |
| TEST_GLOBS           | `src/**/*.test.ts,src/**/*.test.tsx`                   | Must match the existing test files                                                                             |
| UNIT_TEST_LOCATION   | Co-located next to the source file as `<name>.test.ts` | One sentence describing the existing convention                                                                |
| E2E_ACTIVE           | yes                                                    | `yes` only if an E2E runner and at least one E2E spec exist, or the user asked for E2E                         |
| E2E_RUNNER           | Playwright                                             | or `n/a`                                                                                                       |
| E2E_CMD              | yarn playwright test --reporter=list                   | Non-interactive reporter; or `n/a`                                                                             |
| E2E_LIST_CMD         | yarn playwright test --list                            | or `n/a`                                                                                                       |
| E2E_TEST_DIR         | tests                                                  | No trailing slash; or `n/a`                                                                                    |
| E2E_TEST_GLOBS       | `tests/**/*.ts`                                        | or `n/a`                                                                                                       |
| SKILLS_DIR           | .claude/skills                                         | No trailing slash. See 0.6                                                                                     |
| MEMORY_DIR           | memory-bank                                            | No trailing slash. Default `memory-bank`; reuse an existing equivalent directory                               |
| PLANS_DIR            | plans                                                  | No trailing slash. Default `plans`                                                                             |
| CONTEXT_FILE         | .context/current-task.md                               | Always this value                                                                                              |
| MAIN_BRANCH          | main                                                   |                                                                                                                |
| TEST_STRICTNESS_WORD | mandatory                                              | `mandatory` or `expected`, from question 2                                                                     |
| BATCH_CHECKPOINTS    | on                                                     | `on` or `off`, from question 3. Not a template token; controls `<<GATE: …>>` markers                           |

Also record, in a section under the table: the protected dependencies (question 4), whether this is a
minimal install, and every assumption made because a question went unanswered.

## 0.5 The single question message (Phase 1)

Send **one** message, then **stop and wait**. It contains, in order:

1. **What was detected** — the profile as a compact table, with the commands and whether each one ran.
2. **Preflight findings** — dirty tree, previous run, missing runner, monorepo target, as applicable.
3. **Questions** — only the ones detection could not answer, at most five:
   1. **E2E scope.** Ask only if detection is ambiguous. "Should end-to-end testing be part of this
      setup?" If no, every E2E file is skipped.
   2. **Test strictness.** "Should tests be mandatory for every source change (recommended), or
      expected but not enforced?"
   3. **Batch checkpoints.** "Should agents stop for your approval after each batch of implementation
      work (recommended), or report and continue? Plan approval is always required."
   4. **Protected dependencies.** Propose a list from what you found — the app's own state store,
      configuration or feature-flag modules, pure business-logic modules — and ask the user to confirm
      or edit it. "These must never be replaced by mocks in tests."
   5. **Only when applicable:** which monorepo package to target, or whether to continue without a
      unit test runner.
4. **The file plan** — every file that will be created, and every existing file that will be changed,
   marked `new`, `merge`, or `conflict`. For each conflict, say what you propose (merge a delimited
   section, skip, or replace). This is the only confirmation the bootstrap asks for; do not ask again
   per file later.
5. **Defaults** — "If you reply without answering a question, I will use: E2E as detected, mandatory
   tests, batch checkpoints on, the proposed protected list, and the proposals for each conflict."

Memory and plans directories are committed by default so lessons are shared across the team. Do not
ask; record it as an assumption the user can reverse.

## 0.6 Choosing SKILLS_DIR

Copilot reads project skills from `.github/skills/`, `.claude/skills/`, and `.agents/skills/`.

1. If the repository already has skills in one of those directories, use that directory.
2. Otherwise use `.claude/skills/`. Copilot reads it natively, and Claude Code reads it too, at no cost.
3. If `.claude/` is gitignored (`git check-ignore -q .claude/skills/x/SKILL.md` succeeds), use
   `.github/skills/` instead. Skills in an ignored directory would never reach the rest of the team.
