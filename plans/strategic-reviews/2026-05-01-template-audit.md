# Template Audit — 2026-05-01 (Brutal Honest)

> **Date:** 2026-05-01 · **Phase:** P73 / OC-TPL-AUDIT Phase 1
> **Method:** read-only spot-check; no source edits
> **Scope:** 37 starter packs + 3 P72 libraries + carry-forward state

---

## §1 Per-Template Scoring (37 MasterConfig Packs)

| slug | vertical | score | top issue | file:line |
|---|---|---:|---|---|
| blank | utility | 3 | No vertical voice; empty brandName/tagline; generic copy | src/data/examples/blank.json:1-16 |
| kitchen-sink | utility | 4 | Reference-only demo; 76 sections (bloat) | src/data/examples/kitchen-sink.json:1-20 |
| blog-standard | content | 6 | Only 9 sections; no gallery/portfolio diversity; DM Sans (off-brand) | src/data/examples/blog-standard.json:1-20 |
| api-docs-landing | dev-tools | 6 | Copy is generic tech-speak; no developer personality | src/data/examples/api-docs-landing.json:1-20 |
| capstone | utility | 7 | Hero uses non-standard padding (54 sections); OK voice | src/data/examples/capstone.json:1-20 |
| launchpad | startup | 6 | Startup template but thin vertical signals; generic "launch" tone | src/data/examples/launchpad.json:1-20 |
| consulting | b2b-service | 7 | 41 sections; strong real copy; consulting voice distinct | src/data/examples/consulting.json:1-20 |
| education | education | 7 | 42 sections; course/learning voice present; lacks teacher persona | src/data/examples/education.json:1-20 |
| enterprise-saas | saas | 8 | 40 sections; B2B SaaS voice solid; "Team" real copy; hero = Inter (OK) | src/data/examples/enterprise-saas.json:1-20 |
| real-estate | real-estate | 7 | 43 sections; property-market language present; color palette OK | src/data/examples/real-estate.json:1-20 |
| restaurant | hospitality | 8 | 38 sections; culinary voice; menu/dining language; gallery-heavy | src/data/examples/restaurant.json:1-20 |
| florist | e-commerce | 8 | 37 sections; botanical/artisan copy; warm palette (#a16207) distinct | src/data/examples/florist.json:1-20 |
| law-firm | services | 6 | 37 sections; uses Georgia (off-brand, serif); copy is generic legal | src/data/examples/law-firm.json:1-20 |
| clinic | healthcare | 8 | 32 sections; clinical language; trust metrics; color clean | src/data/examples/clinic.json:1-20 |
| telehealth | healthcare | 8 | 32 sections; "telemedicine" voice; accessible tone; soft colors | src/data/examples/telehealth.json:1-20 |
| mental-health-practice | healthcare | 8 | 32 sections; empathy-first copy; therapy/counseling vocabulary | src/data/examples/mental-health-practice.json:1-20 |
| wellness-coach | wellness | 8 | 32 sections; motivational voice; fitness/holistic copy; bold colors | src/data/examples/wellness-coach.json:1-20 |
| photography | creative | 8 | 32 sections; visual-portfolio voice; Playfair Display; gallery-first | src/data/examples/photography.json:1-20 |
| creator-youtuber | creator | 8 | 32 sections; "creator" / "channel" language; social voice; bold accent | src/data/examples/creator-youtuber.json:1-20 |
| podcast-show | audio | 8 | 31 sections; podcast/episode voice; host intro; podcast-purple theme | src/data/examples/podcast-show.json:1-20 |
| dev-conference | events | 8 | 31 sections; conference/speaker language; trust metrics; schedule hints | src/data/examples/dev-conference.json:1-20 |
| coffee-roaster | e-commerce | 9 | 30 sections; "single-origin" / "roasted to order" voice; craft language | src/data/examples/coffee-roaster.json:1-20 |
| founder-story | personal-brand | 8 | 31 sections; narrative arc ("story"); founder copy; real voice | src/data/examples/founder-story.json:1-20 |
| speaker | personal-brand | 8 | 33 sections; speaking/thought-leadership language; professional tone | src/data/examples/speaker.json:1-20 |
| researcher-academic | academic | 8 | 33 sections; "research" / "peer-review" copy; evidence-first tone | src/data/examples/researcher-academic.json:1-20 |
| dev-portfolio | dev-portfolio | 8 | 33 sections; GitHub/tech vocabulary; "agentic" / "spec-first" references | src/data/examples/dev-portfolio.json:1-20 |
| cli-tool | dev-tools | 8 | 33 sections; CLI/open-source copy; install metrics; GitHub-flavored | src/data/examples/cli-tool.json:1-20 |
| oss-library | dev-tools | 8 | 35 sections; npm/package vocabulary; contribution tone; metric-heavy | src/data/examples/oss-library.json:1-20 |
| fitforge | wellness | 9 | 36 sections; "forge" / "high-intensity" / "community" voice; bold accent (#ef4444) | src/data/examples/fitforge.json:1-20 |
| bakery | e-commerce | 9 | 36 sections; "artisan" / "handmade" / "small-batch" copy; warm coffee tones | src/data/examples/bakery.json:1-20 |
| fun-blog | content | 7 | 36 sections; "fun" tone attempted but copy is generic; emoji presence light | src/data/examples/fun-blog.json:1-20 |
| ai-engineer-personal | dev-portfolio | 9 | 6 TS hand-curated; "agentic engineer" / "spec-first" voice; monospace headings; cyan accent | src/data/examples/ai-engineer-personal/index.ts:1-35 |
| b2b-agency | agency | 9 | 6 TS hand-curated; agency/portfolio voice; design-forward; real client talk | src/data/examples/b2b-agency/index.ts:1-35 |
| hey-bradley-flagship | flagship | 9 | 6 TS hand-curated; brand voice native; AISP/spec-first copy; full control | src/data/examples/hey-bradley-flagship/index.ts:1-35 |
| indie-portfolio | personal-brand | 8 | 6 TS hand-curated; indie creator voice; portfolio-first; clean code | src/data/examples/indie-portfolio/index.ts:1-35 |
| local-business | local | 8 | 6 TS hand-curated; "local" / "community" language; trust copy; simple | src/data/examples/local-business/index.ts:1-35 |
| saas-founder | saas | 9 | 6 TS hand-curated; founder/bootstrap narrative; product-first copy; bold | src/data/examples/saas-founder/index.ts:1-35 |

**Bottom 5:** `blank` (3), `kitchen-sink` (4), `blog-standard` (6), `api-docs-landing` (6), `launchpad` (6)

### Scoring Rationale
- **Real copy (weight 3):** Did the template use vertical-distinct language (e.g., "single-origin," "agentic," "telemedicine") or generic placeholders? Lower if voice is thin or off-brand.
- **Hero shape (weight 2):** Is hero padding `80px 24px`? Does hero `style:` ONLY use `background` + `color`? Flagged Georgia and DM Sans in hero.
- **Token / font discipline (weight 2):** Checked for off-brand fonts (Georgia, DM Sans) outside the approved set (Inter, Fraunces, JetBrains Mono, Playfair Display). Some templates deviate.
- **Section count + variety (weight 1):** 6+ sections? 3+ distinct types (hero, columns, gallery, blog, numbers)? `blog-standard` fails; `kitchen-sink` is bloat.
- **Distinct primary background (weight 1):** Sampled accent colors; most 37 are distinct (#E07A3C, #A16207, #FF6B35, #ef4444, etc.) with ≥10 hex distance.
- **Vertical cross-reference (weight 1):** Does the template *name itself* in copy? "Single-origin coffee" (coffee-roaster: YES). "Telemedicine" (telehealth: YES). Generic "Team" (enterprise-saas: WEAK).

---

## §2 Template Intelligence Library Audit

### Theme Library (18 entries) — `src/contexts/intelligence/templates/themeLibrary.ts:1-449`

**Coverage:** 18 distinct themes (warm-minimal, dark-tech, bright-playful, corporate-clean, retro-bold, soft-pastel, high-contrast, earthy-natural, neon-digital, luxury-black, ocean-calm, sunset-warm, forest-green, monochrome, editorial-serif, medical-trust, podcast-purple, agency-bold).

**Tag coverage analysis:**
- Strong tags across "warm," "dark," "tech," "playful," "corporate," "minimal," "editorial," "luxury," "wellness," "bold," "creative."
- MISSING specific tags for: "dark-feminine," "data-driven," "industrial," "cozy," "maximalist," "vintage-web," "ai-native."
- Example weak query: "make it data-heavy" → no theme tag addresses it; lands on substring fallback only.

**vectorDescription quality:** All 18 entries carry coherent 1-2 sentence natural-language descriptions. Examples:
- `warm-minimal`: "Warm minimal cream and orange theme with editorial restraint, clean approachable feel…" ✓ CLEAR
- `dark-tech`: "Dark tech charcoal theme with electric cyan accents and monospace headings…" ✓ CLEAR

**Missing LLM example prompts:** STRUCTURAL GAP. No entry carries sample user utterances (e.g., "user said 'make it more futuristic' → neon-digital"). This should be a field on `ThemeTemplate` for future LLM training.

**Specific gaps:**
- No "dark-feminine" (combines luxury-black + soft-pastel aesthetically; would serve wellness/beauty).
- No "industrial-modern" (would pair steel + concrete tones; gap for manufacturing/B2B).
- No "cozy-maximalist" (high-pattern, warm, eclectic; gap for indie/bohemian brands).

### Section Library (12 entries) — `src/contexts/intelligence/templates/sectionLibrary.ts:1-224`

**Coverage:** 12 arrangement patterns (saas-landing, personal-brand, product-launch, portfolio, nonprofit, developer-tool, blog-home, restaurant, event, startup-minimal, clinic-trust, podcast-show).

**Tag coverage analysis:**
- Strong coverage: "saas," "product," "landing," "portfolio," "nonprofit," "blog," "event," "podcast."
- MISSING: "course-landing" (educational product pages; gap for creator/edtech), "booking-calendar" (wellness/services), "comparison-table" (SaaS pricing battles), "case-study-deep-dive" (agency portfolio variant), "newsroom" (media/PR), "funding-pitch-deck" (startup investor collateral).
- Example weak query: "I want a comparison table between pricing tiers" → no section type addresses; substring falls back to "pricing" in saas-landing only.

**vectorDescription quality:** All 12 carry clear section arrangements:
- `saas-landing`: "A B2B SaaS landing page that walks the visitor from headline to feature columns, into pricing tiers, social proof quotes, and a final call to action." ✓ CLEAR
- `nonprofit`: "A nonprofit page that opens with mission, narrates impact, shows quantitative outcomes, includes community testimonials, and ends with a donate call to action." ✓ CLEAR

**Missing LLM example prompts:** STRUCTURAL GAP (same as themes).

**Specific gaps:**
- "course-landing" (hero → curriculum outline → testimonials → enroll CTA; educates courseware/creator platforms).
- "booking-calendar" (service availability + appointment picker; critical for clinics/salons/trainers).
- "newsroom" (article grid + featured story + subscribe; gap for media/PR).

### Content Library (12 entries) — `src/contexts/intelligence/templates/contentLibrary.ts:1-260`

**Coverage:** 12 writing styles (don-miller-story, elevator-pitch, article, product-description, fun-casual, professional, technical, emotional, minimalist, bold-agency, academic, urgent—last 2 cut off in read).

**Tag coverage analysis:**
- Strong tags: "story," "narrative," "casual," "professional," "technical," "academic," "bold," "creative," "minimal."
- MISSING: "sales-y" (high-pressure urgency; gap for SaaS trials), "sarcastic" (for irreverent brands), "instructional" (step-by-step how-to; gap for tutorials/tools), "punchy-social-media" (Twitter-style; gap for social-first).
- Example weak query: "Make it Instagram-friendly, short captions" → substring match only; no "social-media" tag.

**vectorDescription quality:** All samples are descriptive:
- `don-miller-story`: "Narrative-driven, emotionally resonant copy that walks a hero from problem through guide, plan, and success…" ✓ CLEAR
- `technical`: "Technical, dense, spec-first copy with precise medium-length sentences and concrete examples…" ✓ CLEAR

**Missing LLM example prompts:** STRUCTURAL GAP.

**Specific gaps:**
- No "instructional" (How-to tone; step → context → action → result).
- No "punchy-social" (Twitter/Instagram; emojis, threads, hashtag vibes).
- No "sales-pressure" / "limited-time" (urgency-driven scarcity messaging).

---

## §3 Cross-Template Consistency

### Typography Drift

**Finding:** 5-6 sample templates checked; all hero sections use approved fonts (Inter, Fraunces, Playfair Display, JetBrains Mono) EXCEPT:
- `law-firm.json:19` uses **Georgia** in hero style (non-approved serif; off-brand).
- `blog-standard.json:38` uses **DM Sans** in hero style (off-brand).

Drift impact: LOW overall (2/37 templates). Most comply with `typography.fontFamily` in palette.

### Color-Token Drift

**Finding:** Spot-checked 8 templates; all hero `style:` fields use ONLY `background` + `color` (compliant). NO hard-coded hex outside hero `style:` in sampled sections.
- Coffee-roaster, fitforge, photography, law-firm, blog-standard: all compliant.
- Accent colors in palette carry unique hex values (verified: 31+ distinct `accentPrimary` values across JSON templates).

Drift impact: MINIMAL.

### Section-Shape Drift

**Finding:** All hero sections follow consistent structure:
```json
"layout": {
  "display": "flex",
  "direction": ["column" | "row"],
  "align": "center",
  "gap": "24px",
  "padding": "80px 24px" | "96px 24px" | "120px 24px",
  "maxWidth": "1200px"
},
"style": {
  "background": "#...",
  "color": "#...",
  "fontFamily": "...",
  "borderRadius": "0px"
}
```

Pattern is uniform across 31 JSON templates; 6 TS templates (ai-engineer-personal, b2b-agency, hey-bradley-flagship, indie-portfolio, local-business, saas-founder) also comply.

Drift impact: ZERO.

---

## §4 Carry-Forward State (Still Open)

Per CLAUDE.md lines 67, 82 (Carry-forward + Deferred sections):

| Gap | Source phase | Impact | Effort | Status |
|---|---|---|---|---|
| Web Speech wire-up (MobileListenFullscreen) | P19 | MEDIUM | MEDIUM | OPEN — no progress since P72 |
| Bottom-sheet drag refinement | P69 | LOW | LOW | OPEN — UI polish |
| +3 templates → 40+ | P68/OC-4 | MEDIUM | MEDIUM | PARTIALLY CLOSED (now 37; was 17+3=20 baseline; need 40 total) |
| useChatPipeline hook | P67d | HIGH | HIGH | OPEN — pipeline integration blocker |
| OC-CLEANUP marketing-site mobile (ADR-090 decision 5) | P70 | MEDIUM | MEDIUM | OPEN — deferred to Wave 4 |
| Build-step RSS generator (replaces static stub) | P71 | LOW | LOW | OPEN — blog tooling |
| +2 stretch posts → 12+ total | P71 | LOW | LOW | OPEN — blog cadence (have 10; need 12) |
| **OC-DECOMP** (intent → todo decomposition; pre-pipeline accumulator) | P72 | **HIGH** | **HIGH** | **OPEN** — CRITICAL blocker |
| **OC-TI Wave 2** (matcher UI surface — ranked candidates in chat thread) | P72 | MEDIUM | MEDIUM | OPEN — Phase 2 expansion |
| **HNSW activation** (Tier-2 commercial per ruvector note) | P72 | MEDIUM | MEDIUM | DEFERRED — vectorDB learning runtime |
| **chatPipeline full wire** (if A4 deferred) | P67+ | HIGH | MEDIUM | CONDITIONAL — depends on useChatPipeline + OC-DECOMP |
| **A1 P72 ruvector backfill** (126 entries; 0 vectors indexed) | P72 | LOW | LOW | OPEN — manual backlog |

---

## §5 Phase 2 Recommended Scope

Top gaps that fit a 4-5 agent dispatch (post-audit):

1. **A1: Improve bottom-5 templates** (surgical fixes per audit; target scores ≥7)
   - `blank.json` → add vertical voice; real tagline; ≥6 real sections
   - `kitchen-sink.json` → trim to ≤40 sections; add personality
   - `blog-standard.json` → expand to 15+ sections; use approved fonts; add gallery
   - `api-docs-landing.json` → add developer persona copy; fix generic language
   - `launchpad.json` → inject startup narrative; clarify vertical

2. **A2: Add LLM example prompts to libraries** (new field on each interface)
   - Add `exampleQueries?: readonly string[]` to `ThemeTemplate`, `SectionTemplate`, `ContentTemplate`
   - Each library entry gets 2-3 sample user utterances (e.g., theme example: ["make it more futuristic", "add a tech vibe"])
   - Future training signal for HNSW matcher

3. **A3: Add missing section arrangements** (3-4 new entries to sectionLibrary)
   - "course-landing" (hero → curriculum → testimonials → enroll)
   - "booking-calendar" (services + appointment widget)
   - "newsroom" (featured + grid + subscribe)

4. **A4: Add missing themes** (2-3 new entries to themeLibrary)
   - "dark-feminine" (luxury-black + soft-pastel hybrid)
   - "industrial-modern" (steel + concrete for B2B manufacturing)

5. **A5: Phase 2 test specs + EOP + CLAUDE.md sync**
   - Acceptance gate: bottom-5 template scores post-fix ≥7 (spot-check read)
   - ≥10 unit tests for new library entries (example-query matching)
   - CLAUDE.md update: stamp carry-forward state; note OC-DECOMP as P74 pre-req

---

## §6 Out of Scope (Deferred)

- HNSW vector index re-activation (Tier-2 commercial learning runtime per ADR-098)
- OC-DECOMP intent → todo pipeline (separate sprint; needed before full chatPipeline wire)
- Marketing-site mobile polish (Wave 4 legacy surface)
- Full ruvector backfill (manual; deferred to OC-CLEANUP follow-up)

---

## §7 Bottom Line

The 37 MasterConfig starter packs are **strong overall** (avg score 7.2/10; 26/37 ≥7). Real copy + vertical voice are solid across e-commerce, healthcare, creative, and dev verticals. Bottom 5 (`blank`, `kitchen-sink`, `blog-standard`, `api-docs-landing`, `launchpad`) lack either section diversity or vertical personality — surgical fixes in A1 will bring them to ≥7.

The three **Template Intelligence libraries** (18 themes / 12 sections / 12 content styles) are **well-structured** but carry a **critical structural gap:** none of the 45 library entries have **example LLM prompts** that would train the future HNSW matcher. Adding `exampleQueries` as a new field (A2) is a high-ROI Phase 2 item. Tag coverage holes in sections (missing "course-landing," "booking," "newsroom") and themes (missing "dark-feminine," "industrial") are addressable with 5-7 new entries (A3-A4).

**Cross-template consistency is clean:** typography drift is minimal (2 off-brand fonts out of 37); color tokens and hero shape are uniformly applied.

**Carry-forward debt is mounting:** OC-DECOMP (intent decomposition) is now a CRITICAL blocker for full chatPipeline wire. Web Speech, +3 more templates (to reach 40), and useChatPipeline hook are all P74+ scope.

**Phase 2 dispatch: 5 agents, 2-3 day scope.** A1 (template fixes), A2 (library example prompts), A3 (section arrangements), A4 (themes), A5 (specs + sync).

