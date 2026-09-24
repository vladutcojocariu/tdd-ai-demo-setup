---
name: test-doubles-policy
description: >
  Decide what may be mocked and what must be real in tests. Use when writing any test that touches
  shared state, configuration, or a dependency. Trigger on "mock", "stub", "fake", "spy", "test double".
---

# Test Doubles Policy

## Principle

A test double is a debt. It buys speed and isolation, and it pays for them with the risk that the test
passes while production breaks. Take the debt only where the alternative is worse.

## Always real

Never replace these with a double. Configure them instead:

<<FILL: the protected dependencies the user confirmed in Phase 1, one bullet each, naming the real
module or directory. Typical members: the application's own state container or store, configuration
and feature-flag objects, pure business-logic modules, the framework's own rendering.>>

**Why:** these encode the rules the test is supposed to be checking. A mocked state machine turns a
behavior test into a test of your mocking, which cannot fail for the right reason.

Configure real dependencies through their public setters and reset them between tests:

```
beforeEach(() => resetAppState());
```

## Always doubled

- Network calls to services you do not control.
- Clocks, randomness, and unique-id generators, when the assertion depends on their value.
- Filesystem, mail, payment, and any other side effect that is slow or irreversible.

## Judgment call

Your own database or queue: prefer a real instance in a container for integration tests, a double for
unit tests. State which you chose and why in the test file.

## Anti-patterns

**BAD — mocking the thing under test's dependency so thoroughly the test asserts nothing:**

```
mock(stateModule);
expect(fetchData).toHaveBeenCalled();
```

**GOOD — real state, observable assertion:**

```
appState().set({ userId: 'u-1' });
render(<Profile />);
expect(await screen.findByText('Ada')).toBeVisible();
```

## Checklist

- [ ] No double for anything in the "always real" list
- [ ] Every double replaces an external or irreversible dependency
- [ ] No test asserts only that a double was called
- [ ] Shared state is reset between tests
