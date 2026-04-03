# Hey Bradley: Definitive Section Name List

> Date: 2026-04-02
> Purpose: Final naming convention for all sections in Hey Bradley

---

## Core Sections (15 + Footer)

| #  | Internal Name | User-Facing Label | Description (grandma-friendly)                                      |
|----|---------------|-------------------|----------------------------------------------------------------------|
| 1  | `menu`        | Top Menu          | The bar at the top of your page with your logo and links to other pages. |
| 2  | `hero`        | Main Banner       | The big eye-catching area at the top with your headline and a button. |
| 3  | `text`        | Text Block        | A section for writing paragraphs, like an "About Us" or a story.     |
| 4  | `image`       | Image             | A big picture that stretches across the page, with optional words on top. |
| 5  | `video`       | Video             | A section that plays a video from YouTube or Vimeo.                  |
| 6  | `columns`     | Columns           | Put things side by side in two or three columns, like feature cards. |
| 7  | `logos`       | Logo Cloud        | A row of logos showing companies you work with or have been featured in. |
| 8  | `numbers`     | Numbers           | Big bold numbers that show off your achievements, like "500+ clients." |
| 9  | `quotes`      | Quotes            | What your happy customers say about you, with their name and photo.  |
| 10 | `pricing`     | Pricing           | Show your plans and prices so people can pick the right one.         |
| 11 | `team`        | Team              | Photos and names of the people on your team, with their job title.   |
| 12 | `questions`   | Questions         | Common questions people ask, with answers that expand when you click.|
| 13 | `contact`     | Contact           | A form where visitors can send you a message, plus your email and phone. |
| 14 | `action`      | Action Block      | A bold section with a message and a big button, like "Sign Up Now."  |
| 15 | `gallery`     | Gallery           | A grid of photos or images people can browse through.                |
| 16 | `footer`      | Footer            | The bottom of your page with small links, copyright, and social media icons. |

---

## Optional Utility Sections

| #  | Internal Name | User-Facing Label | Description (grandma-friendly)                                      |
|----|---------------|-------------------|----------------------------------------------------------------------|
| 17 | `spacer`      | Spacer            | Empty space between sections so your page does not feel too crowded. |
| 18 | `banner`      | Banner            | A thin colored bar across the top with an announcement or sale notice.|

---

## Naming Rules

1. **Internal names** (`menu`, `hero`, `text`, etc.) are always lowercase, one word, no hyphens, no underscores.
2. **User-facing labels** are Title Case, max 2 words, plain English.
3. Every label must make sense to someone who has never built a website before.
4. No jargon: "CTA" becomes "Action Block." "FAQ" becomes "Questions." "Testimonials" becomes "Quotes."
5. Section names should describe what the section **shows**, not what it **does**.

---

## Section Categories

Sections are grouped by purpose for the "Add Section" menu:

### Content
- Text Block -- paragraphs and articles
- Main Banner -- hero headline area
- Columns -- side-by-side cards

### Media
- Image -- single featured image
- Video -- embedded video player
- Gallery -- image grid

### Trust
- Logo Cloud -- partner/client logos
- Numbers -- stats and achievements
- Quotes -- customer testimonials

### People
- Team -- team member profiles

### Commerce
- Pricing -- plans and pricing tables

### Conversion
- Action Block -- call-to-action with button
- Contact -- contact form and info

### Support
- Questions -- FAQ accordion

### Navigation
- Top Menu -- site navigation bar
- Footer -- site footer

### Utility (optional)
- Spacer -- visual breathing room
- Banner -- announcement bar

---

## Migration Notes

These 6 new sections need to be added to the `sectionTypeSchema` in `/src/lib/schemas/section.ts`:

```typescript
export const sectionTypeSchema = z.enum([
  'hero', 'menu', 'columns', 'pricing', 'action', 'footer',
  'quotes', 'questions', 'numbers', 'gallery',
  // New sections
  'text', 'image', 'video', 'logos', 'team', 'contact',
  // Optional utility sections
  'spacer', 'banner',
])
```

The `sectionNameMap`, `sectionDescriptionMap`, and `sectionIconMap` in `/src/components/left-panel/SectionsSection.tsx` need corresponding entries for each new type.

Suggested Lucide icons for new sections:

| Section   | Lucide Icon       |
|-----------|-------------------|
| `text`    | `Type`            |
| `image`   | `Image`           |
| `video`   | `Play`            |
| `logos`   | `Award`           |
| `team`    | `Users`           |
| `contact` | `Mail`            |
| `spacer`  | `Minus`           |
| `banner`  | `Bell`            |
