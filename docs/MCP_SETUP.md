# MCP setup (Model Context Protocol)

MCP servers extend the development assistant. This page documents the ones
**recommended** for this project, their role, and a sample configuration.

> MCP servers are declared at the client level (Claude Code, IDE, etc.), not in
> the application code. Depending on the environment, installation is done via
> `claude mcp add ...` or the connectors UI. In a non-interactive session, OAuth
> authorization must be done beforehand.

## Recommended servers

### 1. `filesystem` — reading/writing files

Role: browse and edit the repository (docs, `src/`, event data).
Project use: maintain the docs, add event definitions, refactor.

### 2. `git` — clean commits per step

Role: `status`, `diff`, `add`, `commit`, `log`.
Project use: one commit per phase (see ROADMAP), descriptive messages, review of
diffs before validation. The repository is already initialized and pushed to
GitHub.

### 3. `memory` / `project-context` — decision memory

Role: keep the **calendar rules** and **architecture decisions** across sessions
(JDN epoch = 1,724,221, exclusive DTEND, ±1 day shift, etc.).
Project use: avoid re-deriving constants and re-introducing already-fixed bugs.

### 4. `browser` / `search` (if available) — source verification

Role: verify liturgical dates, bāhre hasab, paschal rules against reliable
sources.
Project use: validation by `calendar-research-agent` before adding/modifying a
feast. **Always confirm** liturgical dates against ecclesiastical sources.

### 5. `test-runner` — running the tests

Role: run Vitest after each step and report failures.
Project use: `npm test` after any change to conversion or data. In the absence
of a dedicated server, use the command directly.

## Sample configuration (`.mcp.json` / client)

```jsonc
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "."]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

> The package names above are indicative; adapt them to those actually available
> in your ecosystem. `browser`/`search` and `test-runner` depend on the
> environment.

## Best practices

- **Sequence**: research (browser) → documentation (filesystem) → code
  (filesystem) → tests (test-runner) → commit (git).
- **Persist** calendar decisions in `memory` as soon as they are made.
- **Never** commit a calendar-rule change without a matching update to
  `docs/CALENDAR_RULES.md` (see AGENTS.md `docs-agent`).
