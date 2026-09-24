---
name: design-exploration
description: >
  Mandatory design gate BEFORE any complex implementation. Triggers when four or more files will change,
  when an architectural decision is needed, or when the user says build, create, implement, design, or
  add something non-trivial. Skip only for trivial changes or an already-approved plan.
---

# Design Exploration

## The gate rule

Write no code until you have presented a design and a human has approved the direction.

## Six steps

1. **Explore context.** Read the relevant existing code, `memory-bank/lessons.md` for prior decisions,
   and `memory-bank/testing-strategy.md` for what the tests are expected to cover.
2. **Ask clarifying questions**, one at a time, multiple-choice where possible. Two to four is usually
   enough. Stop when you can propose concrete approaches.
3. **Propose two or three distinct approaches.** For each: how it works in two sentences, the trade-off,
   the rough scope, and which one you recommend and why.
4. **Present the design**, scaled to size: a paragraph for a small feature, a structured summary for a
   medium one, a document with data flow and integration points for a large one.
5. **MANDATORY STOP.** Wait for approval. Iterate if the human wants a different direction.
6. **Transition to planning.** The approved direction becomes the plan; the plan needs its own approval.

## What the design must settle here

Because this codebase is a thin scaffold, most designs have to answer the same few questions. Cover
them explicitly rather than leaving them to the implementer:

- Which layer owns what: `src/api/**` for requests and mapping, `src/hooks/**` for state and effects,
  `src/components/**` for presentation only.
- The shape of the types added to `src/types/**`, since they become the contract everything else uses.
- How loading, empty, and error states surface to the user — these are testable behaviors, so they are
  design decisions, not implementation details.

## Anti-rationalization

| Thought                                  | Reality                                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| "This is too simple for design work"     | Simple work is where unexamined assumptions waste the most time. Keep it short, but present it. |
| "I already know the right approach"      | Then presenting it costs thirty seconds and buys alignment.                                     |
| "The user just wants me to start coding" | They want working code. Design produces better working code.                                    |
| "I can design while coding"              | Code creates momentum that resists design change.                                               |
