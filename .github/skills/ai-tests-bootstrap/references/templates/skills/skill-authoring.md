---
name: skill-authoring
description: >
  Create, review, and improve the skills and agents in this setup. Trigger on "new skill", "create an
  agent", "audit skill", "skill routing", "improve skill". Do NOT trigger for merely using a skill.
---

# Skill Authoring

## Six stages

1. **Research.** What phrases and file patterns should activate it? What does it produce? Scan the
   existing skills for overlapping territory and name the three closest neighbors.
2. **Plan.** Pick the body shape: prescriptive (rules with BAD/GOOD), reference (tables and templates),
   workflow (numbered stages with checkpoints), or guidance (principles and decision trees). Draft the
   frontmatter and a section outline.
3. **Review the plan.** Does the description beat its neighbors for a typical user phrasing? Are the
   "do not trigger" clauses present? Is it under 500 lines? If it must load automatically when certain
   files are edited, plan a `.github/instructions/<name>.instructions.md` file with an `applyTo` glob
   that points to the skill — `applyTo` is not a SKILL.md field and is ignored there.
4. **Write it.**
5. **Score it** against the checklist below and fix anything below pass.
6. **Integrate.** Add it to the routing table in `.github/copilot-instructions.md`, and to an
   instructions file if it needs auto-loading. Note anything novel in `{{MEMORY_DIR}}/lessons.md`.

## Quality checklist

| #   | Dimension         | What good looks like                                                                                                                                                                                                                                                              |
| --- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Frontmatter       | `name` matches the directory, lowercase and hyphens, at most 64 characters; `description` states what and when, at most 1024 characters; only supported fields (`name`, `description`, `argument-hint`, `user-invocable`, `disable-model-invocation`, `license`, `allowed-tools`) |
| 2   | Routing           | Territory does not overlap a neighbor; boundaries explicit                                                                                                                                                                                                                        |
| 3   | Step structure    | Multi-step work is numbered with explicit handoffs and checkpoints                                                                                                                                                                                                                |
| 4   | Self-verification | Falsifiable criteria, ideally a command, before delivery                                                                                                                                                                                                                          |
| 5   | Memory            | Reads lessons at the start, suggests writing them at the end                                                                                                                                                                                                                      |
| 6   | Failure handling  | Validates inputs, fails loudly, offers a recovery path                                                                                                                                                                                                                            |
| 7   | Guardrails        | Confirmation before irreversible actions; scope constraints stated                                                                                                                                                                                                                |
| 8   | Composition       | Predictable output location; does not claim a neighbor's territory                                                                                                                                                                                                                |
| 9   | Conventions       | Correct commands, correct package manager, correct terminology                                                                                                                                                                                                                    |
| 10  | Delegation        | Read-heavy research delegated; interactive work kept in the main context                                                                                                                                                                                                          |

Score each as pass, warn, fail, or not applicable. Any fail means the skill is not yet reliable.

## Description writing

The description is the routing mechanism. The model sees only the name and description when deciding
whether to load the skill.

**Bad:** `description: Helps with testing`

**Good:** `description: Enforce unit test requirements for all source changes using {{UNIT_RUNNER}} with
red-green-refactor. Trigger whenever code is written or modified, or the user mentions test, TDD, or
coverage. Do NOT trigger for end-to-end tests (see e2e-fundamentals).`

Be slightly pushy. Models under-trigger far more often than they over-trigger.

## Agents

Agents live in `.github/agents/<name>.agent.md`. When you create or change one:

- **Enforce restrictions with the `tools` list, not prose.** An agent that must not edit files gets no
  `edit` tool. Prose restrictions are ignored under pressure.
- **An agent that lists `agents:` must also have the `agent` tool**, or it cannot dispatch them.
- **Every name in `agents:` and every handoff target must be an existing agent's `name`.**
- **List MCP tools (`<server>/*`) only for servers configured in `.vscode/mcp.json`.** Unavailable
  tools are silently ignored, so a typo fails without an error.
- Omit `model` unless the team has agreed on a model everyone can access; the chat model picker is used
  when it is absent.
