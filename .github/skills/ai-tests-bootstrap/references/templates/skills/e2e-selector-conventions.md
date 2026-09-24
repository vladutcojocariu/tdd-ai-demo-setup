---
name: e2e-selector-conventions
description: >
  Standards for adding test-id attributes and page-object locators. Use when a journey step needs a
  selector that does not exist yet.
---

# Selector Conventions

## Rule

Page-object locators must be deterministic. Prefer an explicit test id. An accessible-role selector is
acceptable only when the name is specific, unique in context, and stable across translations.

## Never

```
page.getByRole('button').first()          // positional — breaks on any layout change
page.getByRole('button', { name: 'Button' })  // generic name — matches anything
page.locator('.some-css-class')           // styling hook — changes with the design
```

## Naming

Pattern: `{context}-{element}`, kebab-case, no dynamic values.

| Element       | Pattern               | Example               |
| ------------- | --------------------- | --------------------- |
| Action button | `{action}-button`     | `submit-order-button` |
| Trigger       | `{action}-trigger`    | `filters-trigger`     |
| Input         | `input-{field}`       | `input-postcode`      |
| Container     | `{feature}-container` | `results-container`   |
| State marker  | `{feature}-{state}`   | `results-empty`       |

Check the existing ids before inventing a pattern. Match what is already there.

## Adding one

1. Find the component that renders the element.
2. Add the attribute to the element itself, not a wrapper.
3. Add the locator to the page object.
4. Use the framework's test-id getter, never a raw attribute selector.

Adding a test id changes no behavior and no appearance. When the requester is non-technical, say so
plainly and ask before touching source: "I need to add an invisible marker to one component so the test
can find it reliably. It changes nothing visible. May I?"
