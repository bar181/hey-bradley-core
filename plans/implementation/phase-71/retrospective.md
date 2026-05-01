# P71 / OC-13 — Retrospective (Blog Expansion)

> **Phase:** P71 · **Sprint:** OC-13 (P1, promoted from P2) · **Date:** 2026-05-01
> **Format:** Keep / Drop / Reframe / Carry-forward (standard P-series retro shape)

---

## Keep

- **ADR-first content discipline.** ADR-097 codifies Voice / Length /
  Cadence / Distribution as 4 enforceable standards before the next
  polish-sprint owner inherits the blog. Without this, the editorial
  framing would re-derive every wave. The pattern mirrors ADR-096
  (template-library expansion contract) — same shape, applied to written
  content instead of JSON templates.
- **Clipboard-only share button.** `navigator.clipboard.writeText` is a
  one-liner and ships zero dependency surface. Every share-library on
  npm is a future security surface; the clipboard primitive carries
  none of that.
- **Body-derived read time, with registry fallback.** `readTimeMinutes(body)`
  uses the actual `.md` body when present and falls back to the registry
  estimate when a post is still being authored. The runtime never lies
  about read time once the content lands.
- **Tag-filter pill row.** Tags come from frontmatter directly via
  `listBlogTags()`. No separate tag taxonomy file. No tag CMS. The
  source-of-truth is the post itself.
- **PURE-UNIT FS+regex test pattern** (P71.1 → P71.7, ~44 cases).
  Continues the P67c / P68 / P69 lineage — seal-fast, deterministic,
  no browser bootstrap. Catches frontmatter drift, length drift, banned-
  dep imports, and ADR shape regressions mechanically.
- **3-agent parallel dispatch (A4/A5 content + A6 infra).** Disjoint
  ownership: A4/A5 own .md files, A6 owns infra + ADR + tests + EOP.
  Zero coordination meetings. Zero file collisions.

## Drop

- **The original "12+ posts" stretch goal as a hard target.** Cadence
  rule (ADR-097 §3) is one post per polish-sprint wave; forcing two
  more posts to hit a literal 12 would lower the editorial bar. The
  honest reframe at preflight (4 → 10 posts) was the right call.
- **The "build-step RSS generator inline in P71" temptation.** Auto-
  generating RSS from the registry is straightforward (~30 LOC) but it
  creates a new build dependency surface and requires a Vite plugin or
  a Node script. Deferring to OC-CLEANUP keeps P71 surface tight; the
  static stub is honest about its placeholder status.
- **Per-post share-count badges / view counters.** Tier-2 commercial
  feature; would require analytics infra that capstone window doesn't
  need.
- **Auto-derived subtitles from frontmatter.** Considered briefly —
  registry-stored subtitles let the index card carry editorial framing
  that's distinct from the post's own H1. Keep the registry as the
  source-of-truth for the index-card surface.

## Reframe

- **The blog is a capstone artifact, not a marketing channel.** Reviewer
  audience (Harvard ALM committee + capstone-aware industry readers) is
  the primary target through May 2026 defense. Tier-2 commercial blog
  tactics (Substack cross-post, newsletter, paid promotion) are not
  P71's job and not the right shape for this window.
- **Don Miller framing is editorial, not algorithmic.** ADR-097 §1 sets
  the voice convention (problem first, product as the resolution); no
  test enforces it because qualitative framing is not test-gateable.
  The retrospective discipline (this doc) is where voice drift gets
  caught.
- **One post per polish wave > one post per week.** Time-based cadence
  encourages filler posts when the wave has no genuine story. Wave-based
  cadence ensures every post earns its slot.
- **Tags are derived, not curated.** ADR-097 doesn't define the tag
  taxonomy — `listBlogTags()` derives it from frontmatter directly.
  This avoids a tag-vocabulary maintenance surface and lets the author
  pick the tag at write-time without waiting for a tag-registry edit.

## Carry-forward

These are **explicitly NOT** P71 work and require their own dispatch:

1. **Build-step RSS generator** to auto-include the 6 P71 posts. The
   stub at `public/blog/feed.xml` ships only the 4 baselines.
   **Owner:** OC-CLEANUP follow-up (per ADR-097 §Out of scope).
2. **+2 posts to reach a literal 12** if owner decides the stretch
   matters for defense week. **Owner:** Polish Wave 4 candidate;
   honored only if the wave has two distinct stories.
3. **Single-post page polish** — `/blog/:slug` page formatting,
   typography, share-on-detail-page button — currently inherits the
   minimal renderer from P58. **Owner:** Polish Wave 4 candidate.
4. **Substack / Medium cross-post automation.** Tier-2 commercial track.
5. **Newsletter / email-capture signup.** Tier-2 commercial track.
6. **Comments / discussion surface.** Out of scope; GitHub issue
   tracker remains the discussion path.
7. **Per-post analytics / view counters.** Deferred.

---

## Closing

P71 / OC-13 lands the blog corpus at 10 posts with ADR-097 as the
editorial spine. ~44 PURE-UNIT tests gate the contract; combined P70+P71
cumulative is ≥740 GREEN target (~774 realistic). The blog is now
defense-ready as a capstone artifact: editorial standards codified, RSS
distribution wired (stub), share-on-card live, tag-filter functional.

Owner choice for next: OC-12 live-LLM / Polish Wave 4 / OC-9 Export
polish / OC-CLEANUP follow-up. P70 + P71 land in parallel and seal
together.
