# Specialized agents

Six agents share the work. Each has a **scope**, **inputs/outputs**, and
**guardrails**. Executable definitions (Claude Code) are provided in
`.claude/agents/*.md`.

> Cross-cutting rule: **documentation first**. No agent modifies a calendar rule
> without `docs/CALENDAR_RULES.md` being updated in the same batch.

| Agent | Scope | Main outputs |
|---|---|---|
| `calendar-research-agent` | Research/verify Ethiopian & Orthodox rules | Sourced notes, updates to CALENDAR_RULES/ORTHODOX_RITES |
| `date-conversion-agent` | Ethiopian ↔ Gregorian conversion algorithm | `calendar/*-date.ts`, `conversion.ts`, conversion tests |
| `orthodox-rites-agent` | Modeling feasts/fasts/rites | `data/*`, `movable-feasts.ts`, `fasting-periods.ts` |
| `ics-generation-agent` | Google-compatible ICS generation | `ics-generator.ts`, ICS tests |
| `qa-test-agent` | Tests, edge cases, validations | `src/tests/*`, reports |
| `docs-agent` | Documentation maintenance | `docs/*`, `README.md` |

## Details

### `calendar-research-agent`
- **Goal**: establish/verify the rules (months, leap years, paschal computus,
  feast dates, fasts) from **reliable sources**.
- **Guardrails**: cite sources; distinguish established fact vs assumption; flag
  regional divergences; **do not code**, only document.

### `date-conversion-agent`
- **Goal**: implement/maintain **pure** conversions via JDN.
- **Invariants**: epoch = 1,724,221; exact round-trip; no special case for the
  ±1 day shift (emergent). Every change accompanied by tests.

### `orthodox-rites-agent`
- **Goal**: translate the rules (docs) into **declarative definitions**; never a
  hard-coded Gregorian date that depends on the Ethiopian calendar.
- **Outputs**: typed entries in `data/`, movable offsets in `orthodox-rules.ts`.

### `ics-generation-agent`
- **Goal**: produce valid, Google-compatible **RFC 5545** ICS (all-day,
  exclusive DTEND, stable UIDs, CRLF, 75-octet UTF-8 folding).

### `qa-test-agent`
- **Goal**: cover the **edge cases** (leap years, overlaps, multi-octet), anchor
  on external facts, keep the suite green.

### `docs-agent`
- **Goal**: ensure the docs **precede and follow** each change; consistency
  README ↔ docs ↔ code.

## Typical collaboration chain

```
research ──► docs ──► (conversion | rites | ics) ──► qa-test ──► docs (update) ──► commit (git)
```
