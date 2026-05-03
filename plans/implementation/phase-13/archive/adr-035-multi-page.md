# ADR-035: Multi-Page Architecture

**Status:** Accepted
**Date:** 2026-04-05

## Context

Marketing sites often need multiple pages (Home, About, Contact, Blog). The current MasterConfig supports only a single-page layout via a flat `sections[]` array. Users need the ability to organize content across distinct pages while maintaining backward compatibility with existing single-page configurations.

## Decision

Add an optional `pages` array to MasterConfig. Each page has its own sections array, an id, title, slug, and an `isHome` flag. Backward-compatible: configs without `pages` are treated as single-page and render identically to before.

### Data Model

```typescript
PageConfig {
  id: string
  title: string
  slug: string           // e.g. "about", "contact"
  isHome?: boolean       // defaults to false
  sections: SectionConfig[]
}
```

### Navigation

- Auto-generated nav from page titles
- Hash routing (`#/about`, `#/contact`) — no React Router needed
- Active page tracked in configStore as `activePage`

### Store Changes

- `activePage: string | null` — when null, falls back to `config.sections` (single-page)
- `addPage(title)` — creates a new page with default sections
- `removePage(pageId)` — removes page (cannot remove home page)
- `reorderPages(fromIndex, toIndex)`
- `setActivePage(pageId)` — switches editing context
- `getActivePageSections()` — returns sections for the active page

### UI Changes

- Page selector tabs above section list in left panel (only visible when pages exist)
- "Enable Multi-Page" button to convert single-page to multi-page
- Preview renders only active page sections with auto-generated page nav bar

## Consequences

- **Minimal breaking changes:** Existing configs without `pages` work identically
- **Existing theme JSONs unchanged:** They remain single-page by default
- **Spec generators enhanced:** Build Plan outputs per-page section lists when pages exist
- **Section operations (add/remove/reorder/duplicate)** automatically target the active page's sections when in multi-page mode
