---
name: e2e-test-triage
description: >
  Diagnose a failing E2E test in priority order: flake, stale data, selector drift, timing, then code
  regression. Trigger on E2E failure, flaky test, "test broke after my change", 4xx or 5xx in test
  output. Do NOT trigger for writing new tests or for unit test failures.
---

# E2E Triage

**The key insight: most E2E failures are data or environment problems, not code regressions.** Check the
cheap hypotheses first. Do not open the source diff until levels 0 through 3 are ruled out.

## Before triaging: group the failures

When several tests fail, group them by error signature — same status code and URL, or the same selector
or timeout string. One expired credential or one rotated fixture usually explains an entire cohort. Fix
the shared cause once and re-run the group.

## Level 0 — flake

Re-run the failing test twice. Passes on retry: record it as a known flake and file the work to make it
deterministic. Fails both times: continue.

## Level 1 — stale test data

**Signals:** 4xx or 5xx in the output; "not found" or "invalid" messages; the test uses a fixture
identifier that points at real, mutable data.

**Diagnosis:** call the API directly with the fixture value. This takes seconds and answers the question
definitively.

**Fix:** replace the fixture value, re-run. Fixtures that point at real records expire; treat that as
normal maintenance rather than a regression.

## Level 2 — selector drift

**Signals:** element not found; a locator resolves to zero elements; recent UI refactoring.

**Diagnosis:** search the source for the test id. Absent means it was renamed or removed. Present means
the page object no longer matches the DOM. Open the failure trace for the exact DOM at the moment of
failure.

**Fix:** restore the id, or update the page object. Never work around it with a positional selector.

## Level 3 — timing and environment

**Signals:** timeouts, especially intermittent; passes locally, fails in CI; the flow depends on a slow
or external service.

**Fix:** add an explicit auto-retrying assertion before the interaction; raise the assertion timeout for
the genuinely slow step; never add a fixed sleep as a fix. A sleep converts a race into a slower race.

## Level 4 — code regression

Only now read the diff. Decide the real question: is the test's expectation outdated, or did the code
regress? Update the test if behavior legitimately changed. Fix the code if it did not.

## Verify the fix in widening scope

The failing test, then its directory, then the full suite before committing.

## Anti-patterns

| Bad                                      | Good                                        |
| ---------------------------------------- | ------------------------------------------- |
| Open the source diff first               | Validate the test data with one direct call |
| Read hundreds of lines of implementation | Read the failure trace                      |
| Assume the branch broke it               | Cheapest hypothesis first: data expires     |
| Add a sleep until it passes              | Find the actual signal to wait for          |
