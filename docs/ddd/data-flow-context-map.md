# DDD Context Map: Data Flow Architecture

## Bounded Contexts

### 1. Input Context (Producers)
Responsibility: Accept user input and produce config patches.

Components:
- Right Panel SIMPLE controls → produce patches via `setSectionConfig()`
- Right Panel EXPERT controls → produce patches via `setSectionConfig()`
- DATA Tab editor → produces full config via `loadConfig()`
- Left Panel section toggles → produce patches via `toggleSectionEnabled()`
- (Future) Chat → LLM produces JSON patches via `applyPatch()`
- (Future) Voice → STT → LLM → patches

Anti-corruption layer: All inputs go through Zod validation before reaching configStore.

### 2. State Context (Single Source of Truth)
Responsibility: Maintain the canonical JSON state.

Components:
- `configStore` (Zustand) — THE single source of truth
- Zod schemas — THE contract for valid state
- `deepMerge` utility — THE merge strategy (ADR-007)
- Undo/redo history — state time travel

Rules:
- No component may modify state outside configStore
- No component may have rendering-relevant state that isn't in configStore
- configStore is the ONLY writable state for page configuration

### 3. Output Context (Consumers)
Responsibility: Render from configStore. Never modify it.

Components:
- Reality Tab → reads config.sections, renders section templates
- DATA Tab (read mode) → reads config, displays formatted JSON
- XAI Docs Tab (future) → reads config, generates spec documents
- AISP viewer → reads config, generates @aisp syntax
- Workflow Tab → reads config metadata, shows pipeline status

Rules:
- Output components are pure readers — they subscribe to configStore via selectors
- No output component may call configStore actions (except DATA Tab in edit mode, which is also an Input)

### 4. Template Context
Responsibility: Map section types to visual renderers.

Components:
- `HeroCentered` — renders hero sections with CSS from JSON
- (Future) `FeaturesGrid`, `PricingTable`, `CTABlock`, etc.
- Section registry maps type → component

Rules:
- Templates receive a `Section` prop and render purely from it
- Templates apply `style.*` values as inline CSS (not Tailwind classes)
- Templates never access configStore directly — they receive data via props

## Context Map Diagram
```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   INPUT      │     │    STATE     │     │   OUTPUT     │
│  Context     │────→│   Context    │────→│  Context     │
│              │     │              │     │              │
│ Right Panel  │     │ configStore  │     │ Reality Tab  │
│ DATA Editor  │     │ Zod schemas  │     │ DATA Tab     │
│ Chat (future)│     │ deepMerge    │     │ XAI Docs     │
│ Voice (future│     │ Undo/Redo    │     │ AISP viewer  │
│ Import       │     │              │     │ Workflow     │
│ Vibes        │     │              │     │ Export       │
└─────────────┘     └──────────────┘     └──────────────┘
        │                  ↑                      │
        │           Zod Validation                │
        └──────── (anti-corruption) ──────────────┘
                   Invalid = rejected
```
