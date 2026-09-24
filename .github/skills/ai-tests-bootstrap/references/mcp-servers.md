# MCP servers (Phase 6)

Model Context Protocol servers give Copilot capabilities it does not have on its own. In VS Code they
are configured in `.vscode/mcp.json` under a `servers` key. Configure only servers that earn their
place, and only packages you can name with certainty. **Never invent a package name.** If you are not
sure a server exists for this stack, leave it out and list it under "Not configured" in the report.

## What Copilot already has

VS Code Copilot includes symbol-aware tools — `search/usages` for references — so a separate language
server is not required for the agents here. Add one only if the team already uses one.

## Candidates

| Server     | Add when                                                    | Configuration                                                                                           |
| ---------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ESLint     | `LANG` is JavaScript or TypeScript and ESLint is the linter | `"eslint": { "type": "stdio", "command": "npx", "args": ["@eslint/mcp@latest"] }`                       |
| Playwright | `E2E_ACTIVE` is `yes`                                       | `"playwright": { "type": "stdio", "command": "npx", "args": ["@playwright/mcp@latest", "--headless"] }` |

Headless browser automation keeps a verification loop from taking over the user's screen. Tell the
team they can drop `--headless` locally when they want to watch.

## Writing the file

- **`.vscode/mcp.json` does not exist:** create it with the chosen servers.
- **It exists:** add the new servers under `servers` and change nothing else. If a server with the same
  purpose is already configured under another key, use that one and add nothing.
- **Nothing qualifies:** do not create the file.

## Wiring servers into agents

After writing the file, add each server's tools to the agents that use them, as `'<server key>/*'`:

| Server     | Agents                                                                  |
| ---------- | ----------------------------------------------------------------------- |
| ESLint     | `implement-subagent`, `solo-dev`, `code-review-subagent`, `e2e-journey` |
| Playwright | `e2e-journey`                                                           |

## Content exclusion

Copilot has no ignore file in the repository. Keeping files out of Copilot's context is configured in
the GitHub repository or organization settings (content exclusion, on Copilot Business and Enterprise).
Mention it as an optional next step in the report. Do not create an ignore file.
