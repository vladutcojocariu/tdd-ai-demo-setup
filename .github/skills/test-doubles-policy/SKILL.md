---
name: test-doubles-policy
description: >
  Decide what may be mocked and what must be real in tests. Use when writing any test that touches
  configuration, the API layer, or a hook. Trigger on "mock", "stub", "fake", "spy", "test double",
  "vi.mock", "mock fetch", and on any question about isolating a dependency. Do NOT trigger for
  deciding whether to write a test at all (see tdd-requirement).
---

# Test Doubles Policy

## Principle

A test double is a debt. It buys speed and isolation, and it pays for them with the risk that the test
passes while production breaks. Take the debt only where the alternative is worse.

In this project that line is drawn in one place: **fake the HTTP call, run everything else for real.**

## Always real

Never replace these with a double. Configure them instead:

- **`src/config.ts`** — the real `API_BASE_URL`, including its `import.meta.env` fallback. Mocking it
  means no test ever exercises how the base URL is actually resolved, which is exactly where a
  misconfigured deployment breaks.
- **`src/types/**`** — type contracts. There is nothing to mock; a stubbed type is a lie the compiler
  will happily accept.
- **Mapping and validation helpers in `src/api/**`** — the pure functions that turn a JSON payload into
  a domain object. This is the logic under test. Doubling it deletes the test's reason to exist.
- **Hooks in `src/hooks/**`** — test through the real hook with `renderHook` or through a component
  that uses it. A mocked hook tests your mock's return value, not your hook.
- **React rendering itself** — render real components with React Testing Library. Never shallow-render
  or stub a child component to make an assertion easier.

**Why:** these encode the rules the test is supposed to be checking. A mocked mapper turns a behavior
test into a test of your mocking, which cannot fail for the right reason.

Reset shared state between tests rather than mocking it away:

```ts
afterEach(() => {
  vi.restoreAllMocks()
  cleanup()
})
```

## Always doubled

- **`fetch`** — the JSONPlaceholder API is a service you do not control. A test that hits the real
  network is slow, flaky, and fails in CI when the network does.
- Clocks, randomness, and id generators, when the assertion depends on their value — `vi.useFakeTimers()`.
- Anything slow or irreversible.

Prefer stubbing the global over mocking your own module, so the request your code actually builds is
still asserted:

```ts
function stubFetch(body: unknown, init: ResponseInit = { status: 200 }) {
  return vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify(body), init))
}
```

Cover the failure paths too: a non-2xx status, a malformed body, and a rejected promise.

## Judgment call

A component that pulls in a heavy third-party widget with no test seam may be stubbed. Say which you
chose and why in the test file. There is no such dependency in the project today.

## Anti-patterns

**BAD — mocking the module under test's own collaborator, so the test asserts nothing real:**

```ts
vi.mock('../api/posts')
vi.mock('../config')

it('loads posts', async () => {
  renderHook(() => usePosts())
  expect(fetchPosts).toHaveBeenCalled() // passes even if the URL is wrong
})
```

**GOOD — real config, real mapper, real hook, faked network, observable assertion:**

```ts
it('exposes the posts returned by the API', async () => {
  stubFetch([makePost({ id: 1, title: 'Analytical Engine' })])

  const { result } = renderHook(() => usePosts())

  await waitFor(() => expect(result.current.posts).toHaveLength(1))
  expect(result.current.posts[0].title).toBe('Analytical Engine')
  expect(globalThis.fetch).toHaveBeenCalledWith(
    `${API_BASE_URL}/posts`,
    expect.anything(),
  )
})
```

The last line asserts the real base URL was used — possible only because `src/config.ts` was not mocked.

## Checklist

- [ ] No double for anything in the "always real" list
- [ ] `fetch` is the only thing faked
- [ ] Every double replaces an external or irreversible dependency
- [ ] No test asserts only that a double was called
- [ ] Error and empty responses are covered, not just the happy path
- [ ] Mocks are restored between tests
