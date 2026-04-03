# ADR-028: Section Headings and Subheadings

- **Status:** Accepted
- **Date:** 2026-04-02

## Context

Grid-based and card-based sections (menu, columns, pricing, quotes, questions, numbers, gallery, logos, team) currently render their content directly without a heading. Users have no way to title a section like "Our Team" or "Pricing Plans" above the card grid. Some sections store a heading in `section.content.heading` but it is not consistently read or rendered.

Every professional site builder (Squarespace, Framer, Webflow) renders a heading and optional subheading above card grids. Without this, sections look like disconnected blocks rather than intentional content regions.

## Decision

All grid and card sections must render a heading and optional subheading above their content area.

### Data Source

Headings are read from the section's content record:

```typescript
const heading = section.content.heading as string | undefined
const subheading = section.content.subheading as string | undefined
```

### Default Headings

When no heading is provided in the config, each section type falls back to a sensible default:

| Section Type | Default Heading | Default Subheading |
|---|---|---|
| `menu` | "Menu" | -- |
| `columns` | "Features" | -- |
| `pricing` | "Pricing" | "Choose the plan that works for you" |
| `quotes` | "What People Say" | -- |
| `questions` | "Frequently Asked Questions" | -- |
| `numbers` | "By the Numbers" | -- |
| `gallery` | "Gallery" | -- |
| `logos` | "Trusted By" | -- |
| `team` | "Our Team" | -- |
| `hero` | _(no default; uses component headline)_ | -- |
| `action` | _(no default; uses component headline)_ | -- |
| `footer` | _(no heading rendered)_ | -- |
| `image` | _(no default; uses component heading)_ | -- |
| `text` | _(no default; uses component heading)_ | -- |
| `divider` | _(no heading rendered)_ | -- |

### Rendering Rules

1. The heading renders as an `<h2>` element, centered above the section content.
2. The subheading renders as a `<p>` element directly below the heading, using `textSecondary` color.
3. Both heading and subheading are editable via the SIMPLE editor panel.
4. If `section.content.heading` is explicitly set to an empty string `""`, no heading is rendered (user opted out).
5. If `section.content.heading` is `undefined` or absent, the default heading for that section type is used.
6. Heading typography uses `theme.typography.headingFamily` and `theme.typography.headingWeight`.
7. Vertical spacing: `mb-4` between heading and subheading, `mb-10` between heading block and content grid.

### Shared Component

A shared `SectionHeading` component handles this logic:

```tsx
interface SectionHeadingProps {
  type: SectionType
  heading?: string
  subheading?: string
  palette: Palette
  typography: ThemeTypography
}

function SectionHeading({ type, heading, subheading, palette, typography }: SectionHeadingProps) {
  const resolvedHeading = heading === '' ? null : (heading ?? DEFAULT_HEADINGS[type] ?? null)
  const resolvedSubheading = subheading === '' ? null : (subheading ?? DEFAULT_SUBHEADINGS[type] ?? null)

  if (!resolvedHeading) return null

  return (
    <div className="text-center mb-10">
      <h2
        className="text-3xl md:text-4xl font-bold mb-4"
        style={{ color: palette.textPrimary, fontFamily: typography.headingFamily }}
      >
        {resolvedHeading}
      </h2>
      {resolvedSubheading && (
        <p
          className="text-lg max-w-2xl mx-auto"
          style={{ color: palette.textSecondary }}
        >
          {resolvedSubheading}
        </p>
      )}
    </div>
  )
}
```

### Editor Integration

The SIMPLE editor panel for grid/card sections must expose:

- A "Section Heading" text input (pre-filled with default or current value)
- A "Section Subheading" text input (optional)
- Changes write to `section.content.heading` and `section.content.subheading` via `setSectionConfig`

## Consequences

- All grid/card section renderers (menu, columns, pricing, quotes, questions, numbers, gallery, logos, team) must integrate the `SectionHeading` component at the top of their render output.
- Theme JSON files should be updated to include `heading` and `subheading` in the `content` record for each section where a custom heading is desired.
- The SIMPLE editor must add heading/subheading inputs for the affected section types.
- Sections that already have component-level headlines (hero, action, image, text) are not affected; they continue to use their component props.
- Divider and footer sections never render a heading.
- The default headings ensure sections look complete out of the box, even before the user customizes anything.
- Existing configs without `content.heading` will seamlessly receive defaults -- no migration needed.
