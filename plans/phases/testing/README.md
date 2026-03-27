# Testing Strategy — Hey Bradley

## Methodology: TDD London School (Mock-First)

### Principles
1. **Outside-in**: Start from the behavior the user sees, work inward
2. **Mock at boundaries**: Mock Zustand stores in component tests, mock IProjectRepository in persistence tests
3. **Never mock within the same bounded context**
4. **Schema-first**: Zod schemas are tested before anything uses them

### Test Order Per Feature
```
1. Zod Schema tests (valid/invalid inputs)
2. Store mutation tests (state changes)
3. Component render tests (from mocked store)
4. Integration tests (full loop)
```

## Test Stack

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit + integration test runner |
| **@testing-library/react** | Component rendering + assertions |
| **@testing-library/user-event** | User interaction simulation |
| **Playwright** | E2E tests (future — Level 2+) |

## Test File Organization

```
tests/
├── lib/
│   ├── deepMerge.test.ts
│   ├── schemas/
│   │   ├── masterConfig.test.ts
│   │   ├── heroSection.test.ts
│   │   ├── featuresSection.test.ts
│   │   └── ctaSection.test.ts
│   └── validation.test.ts
│
├── store/
│   ├── configStore.test.ts
│   ├── uiStore.test.ts
│   └── undoMiddleware.test.ts
│
├── components/
│   ├── shell/
│   │   ├── ModeToggle.test.ts
│   │   ├── PanelLayout.test.ts
│   │   └── StatusBar.test.ts
│   ├── center-canvas/
│   │   ├── DataTab.test.ts
│   │   └── WorkflowTab.test.ts
│   ├── left-panel/
│   │   └── VibeCards.test.ts
│   └── listen-mode/
│       └── RedOrb.test.ts
│
├── templates/
│   ├── hero/
│   │   ├── HeroCentered.test.ts
│   │   ├── HeroSplit.test.ts
│   │   └── HeroOverlay.test.ts
│   ├── features/
│   │   └── FeaturesGrid3.test.ts
│   └── cta/
│       └── CTASimple.test.ts
│
├── contexts/
│   ├── specification/
│   │   ├── specGenerator.test.ts
│   │   └── aispFormatter.test.ts
│   └── persistence/
│       └── localStorageAdapter.test.ts
│
└── integration/
    ├── core-loop.test.ts          # Control → store → preview → JSON
    ├── mode-switching.test.ts      # DRAFT↔EXPERT preserves data
    ├── persistence.test.ts         # Save → reload → data intact
    └── vibe-cascade.test.ts        # Vibe click → 15+ nodes change
```

## Critical Test Cases

### deepMerge (Unit)
```typescript
test('objects merge recursively', () => {
  expect(deepMerge({a:{b:1}}, {a:{c:2}})).toEqual({a:{b:1,c:2}});
});
test('arrays replace entirely', () => {
  expect(deepMerge({items:[1,2]}, {items:[3]})).toEqual({items:[3]});
});
test('null deletes key', () => {
  expect(deepMerge({a:1,b:2}, {a:null})).toEqual({b:2});
});
test('undefined skips', () => {
  expect(deepMerge({a:1}, {a:undefined})).toEqual({a:1});
});
```

### configStore (Unit)
```typescript
test('applyVibe changes 15+ nodes', () => {
  store.applyVibe('warm');
  const changed = countChangedNodes(defaultConfig, store.config);
  expect(changed).toBeGreaterThanOrEqual(15);
});
test('undo restores previous state', () => {
  const before = store.config;
  store.applyPatch({...}, 'ui');
  store.undo();
  expect(store.config).toEqual(before);
});
test('history capped at 100', () => {
  for (let i = 0; i < 150; i++) store.applyPatch({version: `${i}`}, 'ui');
  expect(store.history.length).toBeLessThanOrEqual(100);
});
```

### Zod Schemas (Unit)
```typescript
test('valid hero config parses', () => {
  const result = heroSectionSchema.safeParse(validHero);
  expect(result.success).toBe(true);
});
test('hero without id rejects', () => {
  const result = heroSectionSchema.safeParse({...validHero, id: undefined});
  expect(result.success).toBe(false);
});
test('array items require id', () => {
  const result = featureItemSchema.safeParse({title: 'Fast'}); // no id
  expect(result.success).toBe(false);
});
```

### Mode Switching (Integration)
```typescript
test('DRAFT↔EXPERT preserves all JSON state', () => {
  // Set some config in DRAFT mode
  store.applyVibe('warm');
  const configBefore = structuredClone(configStore.config);
  // Switch to EXPERT
  uiStore.setComplexityMode('EXPERT');
  // Config unchanged
  expect(configStore.config).toEqual(configBefore);
});
```

## Coverage Targets

| Phase | Minimum Coverage |
|-------|-----------------|
| Phase 0 | N/A (scaffold) |
| Phase 1.0 | 60% (stores + toggles) |
| Phase 1.1 | 80% (schemas, deepMerge, configStore) |
| Phase 1.2 | 75% (spec gen, formatters, templates) |
| Phase 1.3 | 80% (persistence, undo, all hero variants) |
