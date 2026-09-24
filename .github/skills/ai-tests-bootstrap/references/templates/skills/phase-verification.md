---
name: phase-verification
description: >
  Fast automated gate after an implementation phase: functional checks, anti-pattern greps, and quality
  spot checks. Use after any phase of work before committing. Do NOT trigger for planning or docs.
  This is a command-driven gate; deep analysis belongs to code-review-subagent.
---

# Phase Verification Gate

Run all three checks even when the first fails. You want the complete picture, not the first error.

## Check 1 — functional

```bash
{{TEST_CMD}}
{{TYPECHECK_CMD}}
{{LINT_CMD}}
{{E2E_CMD}}          # only if E2E specs changed in this phase
```

Report:

```
Functional: PASS | FAIL
- Tests: N passed / N failed (name the failures)
- Types: pass | N errors (name the files)
- Lint: pass | N errors (name the files)
- E2E: pass | N failed | n/a
```

## Check 2 — anti-pattern detection

Get the changed files, including uncommitted and untracked work — this gate runs before the commit:

```bash
git diff --name-only {{MAIN_BRANCH}}
git ls-files --others --exclude-standard
```

Search each changed file for the patterns below. When a critical rule is added to the root instructions
and can be expressed as a search, add a row here.

| Pattern                                                                                                  | Detection                                                | Why it is banned                       |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------- |
| <<FILL: one row per pattern, with the concrete search for LANG and the detected runners. Always include: |
| escape-hatch types (e.g. `: any` / `as any` in TypeScript, `# type: ignore` in Python — omit the row if  |
| LANG has no type checker); a mock of each protected dependency, using the runner's mock syntax and the   |
| real module paths (see `test-doubles-policy`); debug output (e.g. `console.log`, `print(`); focused or   |
| skipped tests (e.g. `.only(`, `.skip(`, `@pytest.mark.skip`). Add one row per root-instructions rule     |
| that can be expressed as a search.>>                                                                     |
| Invented API                                                                                             | For each new call in the diff, confirm the symbol exists | Models hallucinate plausible functions |

Report: `Anti-patterns: CLEAN | N violations` with file and line for each.

## Check 3 — quality spot check

1. Any new file over 300 lines.
2. Business logic added to a presentation layer.
   <<FILL: a third item for a project-specific blast-radius rule, e.g. "changes to shared modules need coverage in every consuming mode", or delete this line if the project has none.>>

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
