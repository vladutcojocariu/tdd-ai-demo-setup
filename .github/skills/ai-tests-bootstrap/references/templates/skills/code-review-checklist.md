---
name: code-review-checklist
description: >
  Review changed code for correctness, security, convention compliance, and test coverage. Produces
  findings ranked by severity. Use when reviewing a diff or a pull request.
---

# Code Review Checklist

## Goal

Find defects that break production, violate the project's rules, or leave behavior untested. Prefer
specific file-and-line findings over general commentary. If the change is clean, say so and name the
remaining gaps.

## Severity ranking

Rank every finding on two axes and lead with the combination.

**Sensitivity** — the production risk: high (security, data loss, outage), medium (bugs, regressions,
degraded experience), low (minor, unlikely to be user-visible), none (style).

**Importance** — the urgency: critical (blocks merge), high (fix before merge), medium (follow-up
acceptable), low (author's discretion).

## Critical — block the merge

- Changed behavior with no test.
- A protected dependency replaced by a test double. See `test-doubles-policy`.
- Injection, cross-site scripting, exposed secrets, missing authorization, unsafe path or URL handling.
- A call to a function, field, or endpoint that does not exist.
- A changed signature whose callers were not updated.
  <<FILL: one bullet per project-specific rule from the root instructions whose violation should block a merge, or delete this line if there are none.>>

## Major — fix before approval

- Escape-hatch types or unsafe casts.
- Business logic placed in a presentation layer.
- Over-broad error handling that swallows the failure.
- Resource work inside a hot path that belongs at initialization.
- A user-facing change with no end-to-end coverage.

## Minor — note, do not block

Naming and readability, missing cleanup of listeners or timers, small maintainability issues.

Do not leave generic style comments, and do not ask for a broad refactor unless the changed code creates
a real bug or maintenance risk.

## Conditional lenses

Apply only the ones the diff touches.

**Asynchronous and event-driven code.** Re-entrancy from repeated user actions; state set optimistically
before the async call with no rollback; listeners that stack; stale closures; fire-and-forget promises
that can fail silently; cleanup that does not run on every exit path. If a note claims "cannot happen
today", require the reviewer to name the present-day user action that triggers it — back navigation, a
double click, closing the tab. If such an action exists, it is a live finding.

**Persistence and services.** Client and connection setup at module scope rather than per call;
targeted queries rather than full scans; errors that do not leak internals.

**Tests.** New behavior covered; bug fixes carry a regression test; no protected dependency mocked.

## Verify independently

Run `{{TEST_CMD}}` and `{{TYPECHECK_CMD}}` yourself. Do not trust the implementer's claim that they pass.

## Output

```markdown
## Review: {scope}

**Status:** APPROVED | NEEDS_REVISION | FAILED
**Summary:** {one or two sentences}
**Strengths:** {what was done well}

### Findings

- [S:high | I:critical] {finding with file and line}
- [S:medium | I:high] {finding with file and line}

**Tests:** {fresh result} **Types:** {fresh result} **Lint:** {fresh result}
**Next steps:** {what the requester should do}
```
