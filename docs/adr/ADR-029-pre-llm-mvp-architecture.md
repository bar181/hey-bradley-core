# ADR-029: Pre-LLM MVP Architecture (Stage 2)

**Status:** Proposed
**Date:** 2026-04-04
**Deciders:** Bradley Ross
**Supersedes:** None

---

## Context

Hey Bradley is moving from Stage 1 (Presentation) to Stage 2 (Pre-LLM MVP). The goal is a fully functional specification builder that works without any LLM API calls, external authentication, or database infrastructure. Users must be able to upload images, manage brand assets, customize colors, configure SEO, and save/load projects entirely client-side.

Key constraints:
- No external service dependencies for MVP (no Supabase, no API keys)
- Must work offline after initial page load
- Must preserve the existing Zustand + Zod architecture
- Must not break the 54+ Playwright tests or the Vercel CI/CD pipeline
- Stage 3 (LLM MVP) will layer API calls on top of this foundation

---

## Decisions

### 1. Image Storage: Base64 for MVP

**Decision:** Store uploaded images as base64 data URIs in the project JSON.

**Rationale:**
- Zero infrastructure dependencies -- works entirely in the browser
- Images travel with the project when exported as JSON
- Simplifies the upload flow: File -> FileReader -> base64 -> configStore
- File size limit of 2 MB per image enforced client-side to keep JSON manageable

**Trade-offs:**
- Base64 encoding increases payload size by ~33%
- Large projects with many images will have large JSON exports
- localStorage has a ~5-10 MB limit per origin (browser-dependent)

**Post-MVP migration path:** Supabase Storage with signed URLs. The image field changes from a data URI to an HTTPS URL -- no component changes needed since `<img src>` handles both.

### 2. Project Persistence: localStorage with Named Projects + JSON Export/Import

**Decision:** Projects are saved to `localStorage` as named entries. Users can also export a project as a `.json` file and import from file.

**Implementation:**
- `projectStore` (new Zustand store) manages project list and active project
- Key format: `hb-project-{slug}` in localStorage
- Save action serializes the full configStore + siteStore state
- Load action hydrates configStore + siteStore from the saved JSON
- Export writes the JSON blob to a downloadable file
- Import reads a `.json` file, validates with Zod, and hydrates stores

**Rationale:**
- No backend required
- Users can back up projects as files
- Zod validation on import prevents corrupted state

**Post-MVP migration path:** Supabase Postgres with row-level security per user.

### 3. Custom Colors: Hex Input Field Updating Palette Slots

**Decision:** Add a hex color input field that directly updates palette slots in `configStore`.

**Implementation:**
- New `CustomColorInput` component in the right panel Theme section
- Accepts a valid 6-digit hex value (with `#` prefix)
- Writes directly to `configStore.theme.colors.primary` (or accent, background, etc.)
- Validates hex format before applying (regex: `/^#[0-9A-Fa-f]{6}$/`)
- Shows a color swatch preview next to the input

**Rationale:**
- Minimal implementation -- just a controlled input wired to an existing store field
- No new dependencies (no color picker library)
- Theme locking (already implemented) can prevent custom color changes when locked

### 4. Brand Management: Logo, Favicon, og:image URLs in Site Config

**Decision:** Store brand image URLs (logo, favicon, og:image) in a new `brand` section of `siteStore`.

**Implementation:**
- `siteStore.brand.logoUrl` -- displayed in Navbar component
- `siteStore.brand.faviconUrl` -- used in spec export (not applied to builder page itself)
- `siteStore.brand.ogImageUrl` -- used in SEO metadata and spec export
- Each field accepts either a URL string or a base64 data URI (from upload)
- New `BrandSection` in the right panel for managing these fields

**Rationale:**
- Separates brand identity from theme (colors/fonts are theme; logo/favicon are brand)
- Aligns with DDD: Brand Context is distinct from Theme Context

### 5. SEO Fields: Title, Description, og:image in Site Settings

**Decision:** Add SEO fields in a Site Settings panel within the right panel.

**Implementation:**
- New `SiteSettingsSection` component (or a new tab in the right panel)
- Fields: `siteTitle`, `siteDescription`, `ogImageUrl` (shared with brand)
- Stored in `siteStore.seo`
- Used by spec generators to produce accurate meta tags in output
- Character count indicators (title: 60 chars, description: 160 chars)

**Rationale:**
- SEO metadata is essential for the generated spec to produce deployable HTML
- Keeping it in a dedicated section avoids cluttering the content editing flow

### 6. Newsletter Webhook: Configurable URL in ActionNewsletter

**Decision:** The `ActionNewsletter` component sends a POST request with the email to a configurable webhook URL.

**Implementation:**
- `siteStore.integrations.newsletterWebhookUrl` stores the endpoint
- On form submit: `fetch(webhookUrl, { method: 'POST', body: JSON.stringify({ email }) })`
- Right-panel field to configure the webhook URL
- If no URL is configured, the form shows a success message without making a request (demo mode)
- Basic error handling: show toast on network failure

**Rationale:**
- Works with any webhook provider (Mailchimp, ConvertKit, custom endpoint)
- No vendor lock-in
- Demo mode (no URL) allows the form to work in presentations without errors

---

## Consequences

### Positive

- **Zero infrastructure cost** -- everything runs client-side
- **Offline-capable** -- works after initial load without network
- **Portable** -- projects export as self-contained JSON files
- **Fast iteration** -- no backend deployment needed for changes
- **Clear migration path** -- each decision documents the post-MVP upgrade

### Negative

- **localStorage limits** -- heavy image use may hit browser storage caps
- **No collaboration** -- single-user, single-device until Stage 3+
- **No versioning** -- project saves are overwrite-only (no history)
- **Base64 bloat** -- image-heavy projects produce large JSON files

### Risks

- Browser storage eviction on mobile Safari (mitigated by JSON export)
- Large base64 images may slow down JSON parsing (mitigated by 2 MB limit per image)

---

## References

- Master Backlog: S2-01 through S2-11
- Phase 9 Preflight: `plans/implementation/phase-8/phase-9-preflight.md`
- Existing stores: `src/stores/configStore.ts`, `src/stores/siteStore.ts`
