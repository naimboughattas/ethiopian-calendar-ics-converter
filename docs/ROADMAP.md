# Roadmap

## Execution phases

| Phase | Content | Status |
|---|---|---|
| 1 | **Documentation** (README + 13 docs) | ✅ Done |
| 2 | Typed **data model** (`types/`) | ✅ Done |
| 3 | **Conversion** Ethiopian ↔ Gregorian + tests | ✅ Done |
| 4 | **Fixed events** (Ethiopian dates) | ✅ Done |
| 5 | **Movable feasts** Orthodox (Fasika) | ✅ Done |
| 6 | Multi-day **fasts** | ✅ Done |
| 7 | Google-compatible **ICS generation** | ✅ Done |
| 8 | **Next.js API** (public `.ics` routes) | ✅ Done |
| 9 | **Tests** (conversion, events, leap years, ICS, weekly fasts, commemorations) | ✅ Done (70 tests) |
| 10 | **Final documentation** (complete README) | ✅ Done |

## Next steps (post-v1)

### Calendar content
- ✅ **Weekly fasts** Wednesday/Friday (paschal window + feasts +
  anti-duplicate) — via `?weekly=true`. Still to refine: minor customary
  exemptions (post-Genna week, etc.).
- ✅ **Monthly saint commemorations** (Michael, Gabriel, Mariam, Kidane
  Mihret…) — via `?monthly=true` and the `ethiopian-commemorations.ics` feed.
  Still to enrich/validate the list by parish.
- **Regional feasts** with customary dates (Irreecha) — requires a dedicated
  rule and sources.
- Fill in the missing **Amharic names**.

### Quality
- **ICS snapshots** per feed/year.
- **HTTP integration tests** of the routes (params, 400/404 errors).
- **Property-based testing** (fast-check) on the conversion.
- Validation with a third-party **iCalendar parser**.

### Product
- ✅ **Rich home page** with a language selector, option toggles, and one-click
  subscribe buttons (Google Calendar / webcal / copy).
- Complete **Amharic** (i18n content).
- **Customization** (choice of categories, language per subscription).
- Optional **reminders** (VALARM) for some feasts.
- ✅ **Deployment** documented (Vercel) + stable public URL.

### Calendar reliability
- Extend/validate the **window beyond 2099** (variable Julian offset).
- Automated comparison with the official annual **bāhre hasab**.

## Delivery convention

One commit per phase (see MCP_SETUP `git`), documentation updated **in the same
commit** as the corresponding code.
