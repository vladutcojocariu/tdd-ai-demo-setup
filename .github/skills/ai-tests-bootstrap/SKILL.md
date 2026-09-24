---
name: ai-tests-bootstrap
description: Bootstrap an AI test and TDD setup for GitHub Copilot in this repository — root instructions, auto-loading instructions files, seventeen skills, eight custom agents, a memory bank, and optional MCP servers — generated from the repository's detected stack. Run it explicitly with /ai-tests-bootstrap in VS Code Copilot Chat, Agent mode. Pass "minimal" for the reduced install.
argument-hint: 'Optional: "minimal" for the reduced install'
disable-model-invocation: true
---

# AI Test and TDD Bootstrap

Generate, in the current repository, a GitHub Copilot configuration that makes the AI write unit and
end-to-end tests by default, follow test-driven development, and refuse to claim completion without
fresh evidence.

You are configuring how Copilot behaves in this repository. You are **not** writing the project's tests,
installing a test framework, or changing CI.

**Runs in:** VS Code Copilot Chat in Agent mode, which provides the file, terminal, and search tools
this needs. Custom agents and instructions files are VS Code features; the Copilot CLI and cloud agent
use only part of what is generated.

## Rules

1. **Detect before you write.** Every value comes from the repository or from the user's answers.
   Never invent a command, path, module name, or package.
2. **One stop for questions, at the start.** Phase 1 sends a single message with the findings, at most
   five questions, and the file plan, then waits. After that, do not ask again — use the confirmed
   plan. The only later stop is a blocker you cannot resolve (see "When to stop").
3. **Write only configuration and documentation.** No application code, no dependency installs, no CI
   changes. The only exception is `.gitignore`.
4. **Never overwrite what the team wrote.** Existing files are merged or skipped as agreed in Phase 1.
5. **Do not commit or push.** Leave the changes for the user to review.
6. **Leave nothing unfilled.** Every `{{TOKEN}}` and `<<…>>` marker is resolved or its line removed.
   Every reference to a skill, agent, or command that is not generated is removed.
7. **Evidence before claims.** The completion report quotes real command output from this run.

## Before you start

1. Read `references/conventions.md` in full. It defines the markers, the file contracts, and the
   pruning rules every later phase relies on.
2. Create a to-do list with the `todo` tool, one item per phase below. Mark each item done only when its
   exit condition is met. This run is long; the list is how later phases stay as careful as early ones.
3. If the argument is `minimal`, apply "Minimal install" below to every phase.

## Where files come from

All templates are under `references/templates/`, next to this file:

| Template                              | Generated file                                          |
| ------------------------------------- | ------------------------------------------------------- |
| `root/copilot-instructions.md`        | `.github/copilot-instructions.md`                       |
| `instructions/source.instructions.md` | `.github/instructions/source.instructions.md`           |
| `instructions/tests.instructions.md`  | `.github/instructions/tests.instructions.md`            |
| `instructions/e2e.instructions.md`    | `.github/instructions/e2e.instructions.md` _(E2E only)_ |
| `skills/<name>.md`                    | `SKILLS_DIR/<name>/SKILL.md`                            |
| `agents/<name>.md`                    | `.github/agents/<name>.agent.md`                        |
| `memory/<name>.md`                    | `MEMORY_DIR/<name>.md`                                  |

**Skills (17):** `tdd-requirement`, `verification-before-completion`, `static-analysis-gates`,
`test-doubles-policy`, `phase-verification`, `batch-execution`, `design-exploration`, `bugfix-tdd`,
`regression-risk`, `pr-readiness`, `code-review-checklist`, `skill-authoring`, and — only when E2E is
active — `e2e-fundamentals`, `e2e-journey-vocabulary`, `e2e-selector-conventions`,
`e2e-environment-and-auth`, `e2e-test-triage`.

**Agents (8):** `solo-dev`, `conductor`, `explorer-subagent`, `planning-subagent`,
`architect-review-subagent`, `implement-subagent`, `code-review-subagent`, and — only when E2E is
active — `e2e-journey`.

**Memory (4):** `stack-profile.md` (written from the profile, no template), `lessons.md`,
`agent-learnings.md`, `testing-strategy.md`.

Read each template when you are about to generate its file, not all at once.

## Phase 0 — Preflight and detection

Read `references/detect-and-ask.md` and follow sections 0.1 to 0.4 and 0.6: preflight checks, stack
detection, command validation, and the Stack Profile.

**Exit condition:** every profile row has a value or `n/a`, and every command except the full E2E suite
has been run once with its result recorded.

## Phase 1 — The single question message

Follow section 0.5 of `references/detect-and-ask.md`. Send the one message — findings, questions, file
plan, defaults — and **stop until the user replies**.

**Exit condition:** the user replied. Apply their answers, fill the defaults for anything unanswered,
and record those defaults as assumptions.

## Phase 2 — Memory bank and profile

Write `MEMORY_DIR/stack-profile.md` first, so an interrupted run can resume. Then generate `lessons.md`,
`agent-learnings.md`, and `testing-strategy.md` from their templates, filling `testing-strategy.md` from
what Phase 0 found. Add `.context/` to `.gitignore`.

## Phase 3 — Root instructions

Generate `.github/copilot-instructions.md` from its template, merging into an existing file as
`conventions.md` describes. Keep it short — this file is loaded into every request. Target 100 to 150
lines for the bootstrap's section.

## Phase 4 — Skills

Generate each skill in the catalogue. For each one: replace tokens, resolve `<<FILL>>` markers from the
repository, rewrite code samples in idiomatic `LANG`, apply pruning and strictness rules, and resolve
gates. Skills with the most project-specific content, which need the most care:

- `test-doubles-policy` — the protected list from Phase 1, with real module paths.
- `phase-verification` — concrete searches for this language and runner.
- `e2e-journey-vocabulary` — phrase tables built from the real page objects and fixtures, if any exist.
  If there are none yet, keep one example table and say so in the report.
- `e2e-fundamentals` — the real E2E layout if one exists.

## Phase 5 — Instructions files

Generate the instructions files. These are what make the TDD and test rules load automatically when
matching files are edited — skills alone do not. Check that each `applyTo` glob matches existing files
before moving on.

## Phase 6 — Agents and MCP

1. Read `references/mcp-servers.md` and configure `.vscode/mcp.json` as it describes.
2. Generate each agent in the catalogue. Resolve the gate and handoff markers, add MCP tools only for
   servers you just configured, and change nothing in a `tools` list beyond that. The absence of `edit`
   in the orchestrator and reviewer agents is deliberate.

## Phase 7 — Verify and report

Read `references/verify-and-report.md`. Run every check, fix what fails, and present the completion
report. Do not report success before this phase is complete.

## Minimal install

For `/ai-tests-bootstrap minimal`, generate only:

- `.github/copilot-instructions.md`, with routing and agent tables limited to what exists;
- `source.instructions.md` and `tests.instructions.md`;
- skills `tdd-requirement`, `verification-before-completion`, `test-doubles-policy`, plus
  `e2e-test-triage` if E2E is active;
- agents `solo-dev` and `explorer-subagent`;
- memory files `stack-profile.md` and `lessons.md`;
- no MCP configuration.

Apply the minimal-install pruning rule in `conventions.md`. The full setup can be added later by
running the bootstrap again without `minimal`; it resumes from the saved profile.

## When to stop

Stop and ask only when:

- a command you need cannot be made to work, and no alternative exists in the manifest or CI;
- the repository's structure contradicts an answer the user gave;
- a file you must change was modified by someone else during the run.

Say what you found, what you tried, and what you need. Do not work around a blocker by inventing values.
