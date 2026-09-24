# Conventions for generating files

Read this before writing any file in Phases 2 to 6.

## Markers in the templates

Templates contain four kinds of marker. The first three must be gone from every generated file. The
fourth must be kept.

| Marker                                                    | Meaning                                                            | What to do                                                                                                                                                                    |
| --------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{{TOKEN}}`                                               | A Stack Profile value                                              | Replace with the profile value                                                                                                                                                |
| `<<FILL: instruction>>`                                   | Content only the repository can supply                             | Replace the whole marker with content written from what you found. Never leave an example in place of real content. If the instruction says a line may be deleted, delete it. |
| `<<GATE: batch>>`, `<<GATE: commit>>`, `<<HANDOFF: e2e>>` | Switches driven by the Phase 1 answers                             | Replace as described below                                                                                                                                                    |
| `{name}`, `<name>` inside output formats                  | Placeholders for the generated agent to fill in later, at run time | Keep as they are                                                                                                                                                              |

### Gates

`BATCH_CHECKPOINTS` controls these. Plan approval is always required and is not a marker.

| Marker             | When `on`                                                                                                               | When `off`                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `<<GATE: batch>>`  | `**MANDATORY STOP** after each batch — present the batch report and wait for the human before starting the next batch.` | `After each batch, present the batch report and continue.`  |
| `<<GATE: commit>>` | `**MANDATORY STOP** — wait for the human to review and commit.`                                                         | `Do not commit. Leave the changes for the human to review.` |

When `off`, also edit the `batch-execution` skill:

- In its description, replace "a mandatory human checkpoint after each batch" with "a batch report after
  each batch".
- In its model block, replace `MANDATORY STOP → wait for human` with `continue with the next batch`.
- Delete the anti-rationalization rows for "This batch is small, skip the checkpoint", "The human trusts
  me to continue", and "One more task before stopping". Keep the section with its first row.

### Handoff

`<<HANDOFF: e2e>>` in the `solo-dev` agent's frontmatter. When `E2E_ACTIVE` is `yes`, replace it with:

```yaml
handoffs:
  - label: Create E2E tests for this change
    agent: e2e-journey
    prompt: Create end-to-end tests for the change just implemented.
```

When `no`, delete the line.

## Pruning what does not apply

A generated file that points at a missing command, skill, or agent teaches the agent to ignore the file.
Prune instead:

1. **`n/a` commands.** Delete every line, table row, list item, or code-block line that uses a token
   whose value is `n/a`. If that leaves a section empty, delete the section. Example: with no type
   checker, `static-analysis-gates` keeps only its lint half.
2. **E2E inactive.** Do not generate the five `e2e-*` skills, the `e2e-journey` agent, or
   `e2e.instructions.md`. Then remove every reference to them: routing-table rows, agent-table rows,
   the E2E command line, "see `e2e-fundamentals`" clauses, and the E2E rows in `phase-verification`,
   `verification-before-completion`, `bugfix-tdd`, and `code-review-checklist`.
3. **Minimal install.** Remove every reference to a skill or agent that is not generated. Where
   `solo-dev` redirects complex work to `conductor`, write instead: "tell the user this needs a plan
   and a design discussion before implementation, and stop."
4. **Test strictness `expected`.** In `tdd-requirement`, change "MUST" to "SHOULD" in the description,
   replace the "iron law" section with one paragraph ("Write the test first by default. If you write
   code first, write its tests before claiming completion."), and delete the "Red flags requiring
   restart" section and the anti-rationalization row about deleting work.

## Adapting code samples

Several skills contain short code samples written in JavaScript-like syntax. Rewrite each one in
idiomatic `LANG` for the detected runners — for example a pytest fixture instead of a factory function,
or a Go table test. Keep what each sample demonstrates. Do not add samples.

## Skill file contract

A skill is `SKILLS_DIR/<name>/SKILL.md`.

- **Frontmatter fields:** only `name`, `description`, `argument-hint`, `user-invocable`,
  `disable-model-invocation`, `license`, `allowed-tools`. **`applyTo` is not a skill field** and is
  ignored; automatic loading by file pattern is done by instructions files (below).
- **`name`:** lowercase letters, digits, and hyphens, at most 64 characters, identical to the directory
  name.
- **`description`:** at most 1024 characters. It is the routing mechanism: the model sees only the name
  and description when deciding whether to load the skill. Include the phrases users actually type and
  "Do NOT trigger for X (see other-skill)" for each likely mis-route.
- **Body:** under 500 lines. Explain why a rule exists, give BAD and GOOD examples for commonly broken
  rules, use imperative voice, and reference sibling skills instead of duplicating them.

## Instructions file contract

An instructions file is `.github/instructions/<name>.instructions.md`. Copilot attaches it automatically
when the agent creates or modifies a file matching `applyTo`.

- **Frontmatter fields:** `name`, `description`, `applyTo`.
- **`applyTo`:** globs relative to the repository root, comma-separated with no spaces. Every glob must
  match at least one existing file.
- **Body:** a few short, self-contained statements plus which skills to load. The skills hold the depth.

## Agent file contract

An agent is `.github/agents/<name>.agent.md`.

- **Frontmatter fields used here:** `name`, `description`, `argument-hint`, `tools`, `agents`,
  `user-invocable`, `handoffs` (each with `label`, `agent`, `prompt`).
- **`name`** must equal the filename without `.agent.md`. `agents:` entries and handoff targets refer to
  these names.
- **`tools`** uses Copilot tool sets — `read`, `search`, `edit`, `execute`, `agent`, `todo`, `web` — or
  single tools such as `edit/createFile`. MCP servers are added as `'<server-name>/*'`, using the server
  key from `.vscode/mcp.json`, and only for servers configured in Phase 6. Unavailable tools are
  silently ignored, so a wrong name fails without an error.
- **Restrictions are enforced by `tools`, not prose.** The conductor, explorer, architect, and reviewer
  templates have no `edit` tool on purpose. Do not add one.
- **An agent with a non-empty `agents:` list must have the `agent` tool**, or it cannot dispatch.
- **`model` is omitted.** Without it, the model selected in the chat picker is used. Available models
  depend on each user's plan and organization policy, so a hardcoded name can break the agent for
  colleagues. The completion report lists the suggested tier per agent so the team can pin models later.

## Existing files

- **`.github/copilot-instructions.md` exists:** do not replace it. Insert the template, including its
  `<!-- ai-tests-bootstrap:start -->` and `<!-- ai-tests-bootstrap:end -->` comments, at the end. Merge
  rather than duplicate: if the file already lists commands or rules, keep the existing wording and
  drop the duplicates from the inserted section. On a re-run, replace only the text between the two
  comments.
- **A skill, agent, or instructions file with the same name exists:** follow what the user chose for
  that conflict in Phase 1. Never overwrite without that decision.
- **`.gitignore`:** add `.context/` if absent. Create the file if needed.
