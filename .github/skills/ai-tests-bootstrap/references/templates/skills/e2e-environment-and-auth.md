---
name: e2e-environment-and-auth
description: >
  Set up the environment, credentials, and stored session that E2E tests need. Use when configuring a
  new environment, debugging a login failure in tests, or when tests fail at the authentication wall.
---

# E2E Environment and Authentication

## Principles

1. **Authenticate once, reuse everywhere.** A global setup step logs in and saves the session to a
   gitignored file. Every test starts already authenticated. Logging in per test is the single biggest
   avoidable cost in an E2E suite.
2. **Credentials come from the environment.** Never hardcode, never commit. The setup fails with a clear
   message naming the missing variable.
3. **Reuse while fresh.** Regenerate the stored session only when it is missing or older than its
   lifetime. Re-authenticating on every run is slow and often rate-limited.
4. **One config per environment.** Keep environment files per target and select with a single variable.
5. **Fail loudly.** A test that silently runs unauthenticated produces a confusing element-not-found
   error. Assert a post-login marker in setup and abort if it is absent.

## Required setup

```
{{E2E_TEST_DIR}}/
<<FILL: the project's real setup files if they exist; otherwise the recommended layout below with the
project's source extension>>
├── global-setup.<ext>      # authenticate, save session
├── env/.env.<target>       # per-environment config, gitignored where secret
└── utils/session-restore.* # re-inject non-cookie session state before page scripts run
```

Add the session directory to `.gitignore`.

## Before any browser automation

Run the project's auth-setup command before driving a browser through an MCP tool or a script. A plain
navigation uses an unauthenticated context and will only ever show the login page.

## Troubleshooting

| Symptom                    | Cause                                  | Fix                                     |
| -------------------------- | -------------------------------------- | --------------------------------------- |
| Login page in every test   | Session file missing or expired        | Re-run auth setup                       |
| Works locally, fails in CI | Secrets not configured in CI           | Add them to the CI secret store         |
| Passes once, then fails    | Session state is single-use            | Check for token rotation on reuse       |
| Time-based code rejected   | Clock skew between runner and provider | Sync the clock; retry once on rejection |
