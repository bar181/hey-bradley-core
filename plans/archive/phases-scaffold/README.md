# Hey Bradley — Phase Implementation Index

## Quick Status

| Phase | Name | Agents | Status |
|-------|------|--------|--------|
| **0** | [Scaffold & Tooling](./00-scaffold.md) | 2 seq | NOT STARTED |
| **1.0** | [Shell & Navigation](./01-shell.md) | 7 parallel | NOT STARTED |
| **1.1** | [Hero + JSON Core Loop](./02-hero-json-loop.md) | 8 parallel | NOT STARTED |
| **1.2** | [All Tabs + Listen Mode](./03-tabs-listen.md) | 10 parallel | NOT STARTED |
| **1.3** | [Polish + Persistence](./04-polish-persistence.md) | 7 parallel | NOT STARTED |
| **2-7** | [Future Levels Overview](./05-levels-2-7-overview.md) | varies | PLANNED |

## Architecture Documents

| Document | Purpose |
|----------|---------|
| [ADR Index](./adr/README.md) | Architecture Decision Records |
| [DDD Domains](./ddd/README.md) | Domain-Driven Design bounded contexts |
| [Testing Strategy](./testing/README.md) | TDD London School approach |
| [Visual Design](./design/README.md) | Component design references |

## Execution Order

```
Phase 0 (scaffold) → Phase 1.0 (shell) → Phase 1.1 (hero+JSON)
→ Phase 1.2 (tabs+listen) → Phase 1.3 (polish) → Level 2+
```

## Human Review Gates

- After Phase 1.0: "Does it look like a real product?"
- After Phase 1.2: **CAPSTONE DEMO CHECKPOINT** — must be visually stunning
- After Phase 1.3: Level 1 complete — ready for Level 2?
- Before Level 5: **Explicit approval for LLM API costs**
