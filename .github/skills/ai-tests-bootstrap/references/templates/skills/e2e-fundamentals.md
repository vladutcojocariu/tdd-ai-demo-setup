---
name: e2e-fundamentals
description: >
  Core patterns for {{E2E_RUNNER}} end-to-end tests: page objects, fixtures, selectors, waiting, and
  test organization. Use when writing or modifying any E2E test. Do NOT trigger for environment and
  credentials (see e2e-environment-and-auth) or failure diagnosis (see e2e-test-triage).
---

# E2E Fundamentals

## Structure

<<FILL: if the project already has an E2E layout, replace the tree below with the real one and adjust
the sections that follow to match it (for example, where page objects actually live). Otherwise keep
the tree as the recommended layout.>>

```
{{E2E_TEST_DIR}}/
├── pages/       # page objects: one class per screen
├── fixtures/    # shared setup injected into tests
├── workflows/   # multi-step user journeys composed from page objects
├── utils/       # helpers: interceptors, waiters, diagnostics
├── data/        # test data bank
└── specs/       # the tests themselves
```

## Import the project's test entry point, not the framework's

Tests import the test and assertion functions from the project's fixture module, never from the runner
directly.
That single indirection is what lets the project add global instrumentation later without editing
every spec.

## Page objects

One class per screen. Locators are readonly fields built in the constructor. Methods express user
intent, not clicks.

```
class CheckoutPage {
  readonly submitButton = this.page.getByTestId('checkout-submit');
  constructor(readonly page) {}
  async submitWith(card) { await this.cardField.fill(card); await this.submitButton.click(); }
}
```

Register new page objects in the fixture module so tests receive them by name.

## Workflows

When three or more specs repeat the same setup sequence, extract it into `workflows/`. A workflow
returns whatever the test needs downstream, such as a created session id. This removes the single
largest source of duplicated, drift-prone test code.

## Selector priority

1. Explicit test ids — most stable, see `e2e-selector-conventions`
2. Accessible role with a specific name
3. Visible text, for headings and labels
4. CSS selectors, last resort

## Waiting

**Use auto-retrying assertions.** They wait and retry until the condition holds or the timeout expires.

```
await expect(page.getByTestId('order-confirmation')).toBeVisible({ timeout: 15000 });
```

**Wait for the specific response** you depend on, not for general network quiet.

**Never use these.** They are the top cause of tests that pass locally and fail in CI:

| Never                             | Why                                                        | Instead                           |
| --------------------------------- | ---------------------------------------------------------- | --------------------------------- |
| Wait for network idle             | Sockets, polling, and analytics mean idle may never arrive | Assert on a ready element         |
| Fixed sleeps                      | Too short on slow CI, wasted time on fast machines         | Auto-retrying assertion           |
| Read state then assert separately | Snapshots a single instant, no retry                       | Pass the locator to the assertion |

## Timeouts

Keep named constants in one module and import them. A reviewer should never see a bare number.
Raise the **assertion** timeout for a slow element rather than the whole test timeout.

## Organization

- One file per feature, named for the feature.
- Group with nested describes; share setup in the innermost block that needs it.
- Always run with a plain list reporter in automation so an HTML report server cannot block the run.

## CI reliability

Retry once in CI and never locally, so flake shows up as a retry rather than a green run. Capture a
trace on the first retry and a screenshot on failure. When a test fails only in CI, read the trace
before changing any code.
