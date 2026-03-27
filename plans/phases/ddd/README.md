# Domain-Driven Design — Hey Bradley

## Bounded Contexts

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEY BRADLEY                              │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   BUILDER    │  │ INTELLIGENCE │  │SPECIFICATION │          │
│  │   CONTEXT    │  │   CONTEXT    │  │   CONTEXT    │          │
│  │              │  │              │  │              │          │
│  │ Draft panels │  │ Intent class │  │ Spec gen     │          │
│  │ Expert panels│  │ Patch gen    │  │ AISP format  │          │
│  │ Reality tab  │  │ Voice proc   │  │ Templates    │          │
│  │ Right panels │  │ Copy advisor │  │ Export pkg   │          │
│  │              │  │              │  │              │          │
│  │ reads:       │  │ reads:       │  │ reads:       │          │
│  │  configStore │  │  configStore │  │  configStore │          │
│  │  uiStore     │  │ writes:      │  │ (read-only)  │          │
│  │              │  │  configStore │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────────────────────────┐        │
│  │ PERSISTENCE  │  │        SHARED KERNEL              │        │
│  │   CONTEXT    │  │                                    │        │
│  │              │  │  configStore (Zustand)              │        │
│  │ IProjectRepo │  │  uiStore (Zustand)                 │        │
│  │ LocalStorage │  │  chatStore (Zustand)                │        │
│  │ Supabase     │  │  Zod schemas                       │        │
│  │              │  │  deepMerge                          │        │
│  │ reads/writes:│  │  Type definitions                   │        │
│  │  configStore │  │                                    │        │
│  └──────────────┘  └──────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## Import Firewall (Enforced)

```
ALLOWED:
  builder/       → store/*, lib/*, types/*, templates/*, presets/*
  intelligence/  → store/configStore, lib/*, types/*
  specification/ → store/configStore, lib/*, types/*, templates/*/schema.ts
  persistence/   → store/*, lib/*, types/*
  templates/*/   → lib/cn.ts ONLY (pure renderers)

FORBIDDEN (instant reject):
  builder/       ❌ NEVER imports from intelligence/
  intelligence/  ❌ NEVER imports from builder/components/
  specification/ ❌ NEVER imports from intelligence/
  templates/*/   ❌ NEVER imports from any contexts/*
```

## Cross-Context Communication

All communication between bounded contexts happens via **Zustand store subscriptions**. No direct function imports across context boundaries.

```typescript
// ✅ CORRECT — Builder subscribes to configStore changes
configStore.subscribe((state) => {
  // React components re-render via useStore hooks
});

// ❌ FORBIDDEN — Builder importing intelligence function
import { classifyIntent } from '@/contexts/intelligence/services/intentClassifier';
```

## Domain Events

| Event | Publisher | Subscribers | Payload |
|-------|----------|-------------|---------|
| `config.changed` | configStore | RealityTab, DataTab, XAIDocsTab, AutoSave | `{ patch, source }` |
| `config.theme_changed` | configStore | All section renderers | `{ theme }` |
| `config.section_added` | configStore | SectionList, RealityTab | `{ section }` |
| `config.section_removed` | configStore | SectionList, RealityTab | `{ sectionId }` |
| `config.section_reordered` | configStore | SectionList, RealityTab | `{ newOrder }` |
| `ui.mode_changed` | uiStore | LeftPanel, RightPanel, ListenOverlay | `{ interaction, complexity }` |
| `ui.tab_changed` | uiStore | TabBar, center canvas | `{ activeTab }` |
| `ui.section_selected` | uiStore | RightPanel, SectionWrapper | `{ sectionId }` |
| `llm.patch_received` | chatStore | configStore (via merge) | `{ patch, confidence }` |
| `llm.processing` | chatStore | WorkflowTab | `{ step, status }` |
| `voice.transcript` | voiceProcessor | ChatInput | `{ text, isFinal }` |

## File Structure by Context

```
src/
├── contexts/
│   ├── intelligence/          # Phase 5+
│   │   ├── services/
│   │   │   ├── intentClassifier.ts
│   │   │   ├── patchGenerator.ts
│   │   │   ├── copyAdvisor.ts
│   │   │   └── voiceProcessor.ts
│   │   └── prompts/
│   │       ├── classifyIntent.ts
│   │       ├── generatePatch.ts
│   │       └── suggestCopy.ts
│   │
│   ├── specification/         # Phase 1.2+
│   │   ├── services/
│   │   │   ├── specGenerator.ts
│   │   │   ├── sectionSpecGen.ts
│   │   │   └── aispFormatter.ts
│   │   └── templates/
│   │       ├── northStar.ts
│   │       ├── architecture.ts
│   │       └── implPlan.ts
│   │
│   └── persistence/           # Phase 1.3+
│       ├── interfaces/
│       │   └── IProjectRepository.ts
│       └── adapters/
│           ├── localStorageAdapter.ts
│           └── supabaseAdapter.ts  # Phase 4
│
├── templates/                 # Pure renderers — NO context imports
│   ├── registry.ts
│   ├── hero/
│   ├── features/
│   ├── pricing/
│   ├── cta/
│   ├── footer/
│   ├── testimonials/
│   ├── faq/
│   └── value-props/
│
├── store/                     # Shared kernel
│   ├── configStore.ts
│   ├── uiStore.ts
│   ├── chatStore.ts
│   └── undoMiddleware.ts
│
└── lib/                       # Shared utilities
    ├── cn.ts
    ├── deepMerge.ts
    ├── validation.ts
    └── schemas/
```
