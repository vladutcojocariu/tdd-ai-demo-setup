---
name: tdd-requirement
description: >
  Every change to {{LANG}} source MUST be accompanied by tests, written first. Use when implementing
  any feature or bug fix, when the user mentions tests, TDD, coverage, or red-green-refactor.
  Do NOT trigger for end-to-end test authoring (see e2e-fundamentals).
---

# Test-Driven Development Requirement

## The iron law

**NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.**

Any code written before its test must be deleted entirely — not kept as reference, not adapted, not
examined. Start over with the test. This is not ceremony: tests written first discover edge cases and
force a clean interface, while tests written after only re-describe what was already built.

## Red-green-refactor

| Phase        | Action                              | Verification                                                                                    |
| ------------ | ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| **RED**      | Write one minimal failing test      | Run `{{TEST_ONE_CMD}}`. The test **fails**, not errors. The message matches what you predicted. |
| **GREEN**    | Write the simplest code that passes | Run `{{TEST_ONE_CMD}}`. Target passes, everything else still passes.                            |
| **REFACTOR** | Remove duplication, improve naming  | Run `{{TEST_CMD}}`. All pass. No new behavior added during refactor.                            |

One cycle per behavior. Not one cycle per file.

## Anti-rationalization

| Thought                                    | Reality                                                                                       |
| ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| "Delete hours of work? That's wasteful"    | Sunk cost. Tests-first catch bugs tests-after miss. Delete and restart.                       |
| "Tests after give identical results"       | No. Tests-before shape the interface. Tests-after memorialize whatever you happened to build. |
| "Too simple to need a test"                | Simple code still breaks. The test takes thirty seconds.                                      |
| "Just this once"                           | There is no just-this-once. Exceptions compound into a codebase with no safety net.           |
| "The test is obvious, I'll write it after" | If it is obvious, writing it first costs the same.                                            |

## Red flags requiring restart

Go back to RED if any of these is true:

- You wrote production code before its test.
- A new test passed immediately with no code change. It is not testing anything.
- You cannot state what the failure message will say before running it.

## What to test

**Must:** happy path, edge cases (empty, null, boundary), error conditions, business rules, user-visible
behavior.
**Skip:** third-party library internals, pure pass-through wrappers, type declarations.

## Test structure

- **Name tests by behavior**, not by method: "returns an empty list when the filter matches nothing",
  not "test getFiltered".
- **One behavior per test case.** A test that checks five things tells you nothing useful when it fails.
- **Test behavior, not implementation.** Never assert on private state, internal call counts, or
  framework internals.
- **Never assert only that a mock was called.** Assert the observable result.
- **Use factory functions with partial overrides** for test data. Each test states only what matters:

```
function makeUser(overrides) {
  return { id: '1', name: 'Ada', role: 'member', ...overrides };
}
```

Duplicated inline fixtures drift, and drifting fixtures hide real failures.

## File placement

{{UNIT_TEST_LOCATION}}. Follow the convention already present in the repository; do not introduce a
second one.

## Workflows

**New feature:** write the tests for the behavior, implement until green, refactor.
**Bug fix:** reproduce the bug in a failing test first. See the `bugfix-tdd` skill.

## Verification

```bash
{{TEST_ONE_CMD}}   # the file you changed
{{TEST_CMD}}       # no regressions
```
