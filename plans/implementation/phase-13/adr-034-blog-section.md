# ADR-034: Blog Section Type

## Status
Accepted

## Context
Hey Bradley needs a blog/articles section type for content-heavy sites. Currently, blog-style content must be approximated using text or columns sections, which lack article-specific fields like author, date, tags, and featured images. The fun-blog example demonstrates the gap — it uses gallery and text sections instead of a dedicated blog layout.

## Decision
Add `blog` as a new section type with 4 template variants:

- **card-grid** (default) — 3-column responsive grid of article cards with featured image, title, excerpt, author, date, and tag pills
- **list-excerpts** — Vertical list with small image left, text right, clean and readable
- **featured-grid** — First article is large/featured (full width), remaining in 2-column grid
- **minimal** — No images, text-only, typography-focused

### Data Model
Articles are stored as components with type `blog-article`:

```ts
Component {
  id: string
  type: 'blog-article'
  enabled: boolean
  order: number
  props: {
    title: string
    excerpt: string
    author: string
    date: string
    tags: string          // comma-separated
    featuredImage: string  // URL
  }
}
```

### Section Content
```ts
content: {
  heading: string
  subheading: string
  showDates: boolean   // default true
  showTags: boolean    // default true
}
```

## Consequences
- New section type added to `sectionTypeSchema`
- 4 new template components in `src/templates/blog/`
- New editor component `BlogSectionSimple`
- Section type registered in `RealityTab`, `SimpleTab`, `SectionsSection`
- Default blog components added to `configStore.addSection()`
- fun-blog example updated to use blog section
