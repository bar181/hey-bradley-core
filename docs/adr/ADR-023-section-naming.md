# ADR-023: Section Naming — Hybrid Approach

- **Status:** Accepted
- **Date:** 2026-04-02

## Context

Current section names use developer jargon (CTA, FAQ, Value Props) that is meaningless to non-technical users. The builder targets a broad audience — from first-time website creators to professional marketers — so section names must be immediately understandable to both a grandma and a seasoned professional. At the same time, names must remain precise enough for developers working with the JSON spec and rendering pipeline.

## Decision

Adopt a hybrid naming strategy: keep widely understood names that already work (Hero, Footer, Pricing) and rename jargon-heavy ones to plain-language equivalents that describe what the section *does* or *shows*.

### Rename Map

| Old Name (`type` string) | New Name (`type` string) | Rationale |
|--------------------------|--------------------------|-----------|
| `features` | `columns` | Content arranged in 2-4 columns |
| `cta` | `action` | Asks visitors to do something |
| `testimonials` | `quotes` | What people say about you |
| `faq` | `questions` | Q&A section |
| `value_props` | `numbers` | Big stats and counters |
| `navbar` | `menu` | Top navigation bar |

### Unchanged Names

| Name | Reason kept |
|------|-------------|
| `hero` | Universally understood, top-of-page banner |
| `footer` | Universally understood, bottom of page |
| `pricing` | Self-explanatory |

### New Section Type

| Name | Description |
|------|-------------|
| `gallery` | Image and video showcase grid |

### Final Section Type List (10 total, was 9)

`hero`, `menu`, `columns`, `action`, `quotes`, `questions`, `numbers`, `pricing`, `gallery`, `footer`

## Consequences

- All JSON `type` strings change for renamed sections; existing theme JSONs must be migrated.
- All section renderers and editor components must update their type references.
- Theme templates and default specs must be regenerated with new type strings.
- Builder UI labels update to match, making the section picker self-explanatory.
- Adding `gallery` means one new renderer, editor panel, and set of variants must be built.
