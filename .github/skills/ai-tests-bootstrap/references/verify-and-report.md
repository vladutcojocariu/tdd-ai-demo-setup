# Verification and completion report (Phase 7)

Do not report success before completing every check. Use the search and file tools rather than shell
pipelines, so the checks work on any operating system. Fix every failure you find, then re-run the
check that found it.

"Generated files" means every file this run created or changed, as listed in the confirmed file plan.

## Structural checks

1. **Every planned file exists**, or is deliberately absent with the reason recorded for the report.
2. **No markers remain.** Search the generated files for `{{` and for `<<`. Any hit is a bug. Output
   placeholders such as `{name}` or `<file>` are expected and are not hits.
3. **Skill frontmatter is valid.** For each generated `SKILL.md`: `name` equals its directory name and
   uses only lowercase letters, digits, and hyphens, at most 64 characters; `description` is at most
   1024 characters; no field outside the list in `conventions.md`; no `applyTo`.
4. **Skill bodies are under 500 lines.**
5. **Agents are wired correctly.** For each generated agent:
   - `name` equals the filename without `.agent.md`;
   - every `agents:` entry and handoff target is the name of an existing agent;
   - a non-empty `agents:` list comes with the `agent` tool;
   - `conductor`, `explorer-subagent`, `architect-review-subagent`, and `code-review-subagent` have no
     `edit` tool;
   - every `<server>/*` tool names a server in `.vscode/mcp.json`.
6. **No dangling references.** For every skill and agent in the full catalogue that was _not_
   generated (E2E inactive, minimal install, or a skipped conflict), search the generated files for its
   name. Any hit must be removed or rewritten.
7. **Every `applyTo` glob matches at least one existing file.** Use file search with each glob.
8. **The routing table matches the skills.** Every skill in the root instructions' routing table exists,
   and every generated skill appears in the table.
9. **`.context/` is in `.gitignore`.**

## Functional checks

10. **Lint and format the generated files.** Run `LINT_CMD` and the format check, if the project has
    one, now. If either reports a problem **in a generated file**, fix it — usually by running
    `FORMAT_CMD` on just those files — and run the check again.
11. **Test and type-check results.** The bootstrap changed no source code, so reuse the results from
    Phase 0 and say that you did. Any failure there is **pre-existing**: report it with its count and
    do not try to fix application code.
12. **E2E.** If E2E is active, run `E2E_LIST_CMD` to confirm the configuration loads. Do not run the
    full `E2E_CMD`: it needs a running environment and credentials this run cannot assume. List it in
    the next steps instead.
13. **No hanging commands.** Stop any command that waits for input or runs longer than ten minutes.
    Record it in the report as not verified, with the reason.

## Completion report

Present this in chat. Do not write it to a file.

```markdown
## AI test setup bootstrapped

**Stack:** LANG / UNIT_RUNNER / E2E_RUNNER / PKG_MGR **Skills directory:** SKILLS_DIR
**Created:** <n> skills, <n> agents, <n> instructions files, <n> memory files, root instructions<, MCP configuration>
**Changed:** <existing files merged, with what changed>

**Verification**

| Check                              | Result                             |
| ---------------------------------- | ---------------------------------- |
| Structural checks 1–9              | <pass, or what was fixed>          |
| Lint / format on generated files   | <actual output summary>            |
| Unit tests (Phase 0 run)           | <passed / n failing, pre-existing> |
| Type check (Phase 0 run)           | <result>                           |
| E2E configuration (`E2E_LIST_CMD`) | <result or n/a>                    |

**Assumptions made:** <every default used because a question went unanswered>
**Not configured:** <skipped items and why>
**Suggested model tier per agent** (optional — pin with `model:` once the team agrees on available models):
explorer-subagent fast; conductor, implement-subagent, solo-dev balanced; planning-subagent,
architect-review-subagent, code-review-subagent, e2e-journey most capable.

**Next steps for you**

1. Review the diff and commit it. The bootstrap did not commit anything.
2. Check the project-specific content I wrote: the protected list in `test-doubles-policy`, the phrase
   tables in `e2e-journey-vocabulary`, and the anti-pattern searches in `phase-verification`.
3. Smoke test in a new chat with the `solo-dev` agent: "Add a function that formats a currency amount."
   It should write a failing test first, then the function, then quote fresh test output. If it writes
   the function first, the instructions are not loading or the `tdd-requirement` description is not
   specific enough.
4. If E2E is active, tell `e2e-journey` "this test is failing" about a real failure. It should check
   flake and test data before opening the source diff.
5. If E2E is active, run `E2E_CMD` once against a working environment.
6. Optional: set up Copilot content exclusion in the GitHub settings for generated or large files.
```

Checks 3 and 4 in "Next steps" are for the human. Never claim you ran them: a new chat session is not
something this run can open.
