---
name: code-review-checklist
description: >
  Review changed code for correctness, security, convention compliance, and test coverage. Produces
  findings ranked by severity. Use when reviewing a diff or a pull request, and on "review this",
  "what's wrong with this change", "code review". Do NOT trigger for deciding whether your own branch
  is ready to push (see pr-readiness).
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
- A protected dependency replaced by a test double — `src/config.ts`, `src/types/**`, the mapping
  helpers in `src/api/**`, or a hook in `src/hooks/**`. See `test-doubles-policy`.
- Injection, cross-site scripting, exposed secrets, missing authorization, unsafe path or URL handling.
- A call to a function, field, or endpoint that does not exist.
- A changed signature whose callers were not updated.
- A test that reaches the real network instead of stubbing `fetch`.
- `@ts-ignore`, `@ts-expect-error`, or `eslint-disable` added to get past the gates rather than to
  document a genuine false positive.

## Major — fix before approval

- Escape-hatch types or unsafe casts — `any`, `as unknown as T`.
- Business logic placed in a presentation layer: fetching, mapping, or validation inside
  `src/components/**`.
- Over-broad error handling that swallows the failure.
- Resource work inside a hot path that belongs at initialization.
- A `fetch` response used without checking `response.ok` — a 404 body parsed as success.
- Queries by test ID or CSS class where an accessible role and name would work.

## Minor — note, do not block

Naming and readability, missing cleanup of listeners or timers, small maintainability issues.

Do not leave generic style comments, and do not ask for a broad refactor unless the changed code creates
a real bug or maintenance risk. Never comment on formatting — Prettier owns it.

## Conditional lenses

Apply only the ones the diff touches.

**Asynchronous and event-driven code.** Re-entrancy from repeated user actions; state set optimistically
before the async call with no rollback; listeners that stack; stale closures; fire-and-forget promises
that can fail silently; cleanup that does not run on every exit path. If a note claims "cannot happen
today", require the reviewer to name the present-day user action that triggers it — back navigation, a
double click, closing the tab. If such an action exists, it is a live finding.

**React specifics.** Effects with a missing or over-broad dependency array; state updates after unmount;
a `key` taken from the array index; a fetch in an effect with no abort on unmount or on a changed input.

**Tests.** New behavior covered; bug fixes carry a regression test; no protected dependency mocked;
error and empty responses covered, not only the happy path.

## Verify independently

Run `npm test` and `npx tsc -b` yourself. Do not trust the implementer's claim that they pass. Check
the test count — `passWithNoTests` makes an empty run exit zero.

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
