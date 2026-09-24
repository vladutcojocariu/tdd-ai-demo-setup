---
name: e2e-journey-vocabulary
description: >
  Maps the words non-technical stakeholders use to concrete test actions, page objects, and fixtures.
  Reference when parsing a plain-language user journey into an automated E2E test.
---

# Journey Vocabulary

## How to use

Read the journey description one clause at a time. Look each clause up in the tables. Produce a numbered
list of action-and-assertion pairs before writing any code.

## Vocabulary tables

Create one table per feature area. Each row maps a phrase to an action and the object that owns it.

| They say              | Test action                                    | Owner        |
| --------------------- | ---------------------------------------------- | ------------ |
| "logs in"             | Handled by stored session; no step             | global setup |
| "as a new user"       | Fresh context with no stored session           | test         |
| "searches for X"      | `searchPage.searchFor(x)`                      | searchPage   |
| "sees the results"    | `expect(searchPage.results).toBeVisible()`     | searchPage   |
| "a second user joins" | New browser context, navigate to the shared id | test         |

<<FILL: replace the example table above with real tables generated from the project's page objects
and fixtures, one per area: authentication, navigation, the primary domain flow, secondary flows,
teardown. Only map phrases to methods that exist.>>

## Test type classification

| If the journey mentions      | Test shape                                      |
| ---------------------------- | ----------------------------------------------- |
| A second participant joining | Multi-context                                   |
| Real-time or media features  | Extended timeout, permissions granted at launch |
| A feature behind a flag      | Flag stubbed before navigation                  |
| None of the above            | Single context                                  |

## Unrecognized phrase

Ask the stakeholder what they mean. Do not guess a mapping. After they clarify, add the phrase to the
table so the next run resolves it automatically.
