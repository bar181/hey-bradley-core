-- 001-example-prompts.sql
-- Spec: plans/implementation/mvp-plan/04-phase-18b-wave1.md (Agent A1b).
-- Stores realistic test prompts + their predicted "golden" envelopes so we
-- can later cross-check actual LLM responses (Claude/Gemini/OpenRouter)
-- against them. Schema-only here; runner bumps schema_version 1 -> 2.
CREATE TABLE example_prompts (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  category        TEXT NOT NULL CHECK (category IN ('starter','edge_case','safety','multi_section','site_context','content_gen')),
  user_prompt     TEXT NOT NULL,
  match_pattern   TEXT,
  expected_envelope_json TEXT NOT NULL,
  expected_outcome TEXT NOT NULL CHECK (expected_outcome IN ('success','reject','fallback')),
  notes           TEXT,
  created_at      INTEGER NOT NULL,
  updated_at      INTEGER NOT NULL
);
CREATE INDEX idx_example_prompts_category ON example_prompts(category);
CREATE INDEX idx_example_prompts_slug     ON example_prompts(slug);

CREATE TABLE example_prompt_runs (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  example_prompt_id   INTEGER NOT NULL REFERENCES example_prompts(id) ON DELETE CASCADE,
  provider            TEXT NOT NULL,
  model               TEXT NOT NULL,
  actual_response_json TEXT NOT NULL,
  matches_expected    INTEGER NOT NULL DEFAULT 0,
  diff_summary        TEXT,
  tokens_in           INTEGER,
  tokens_out          INTEGER,
  cost_usd            REAL,
  latency_ms          INTEGER,
  created_at          INTEGER NOT NULL
);
CREATE INDEX idx_prompt_runs_pid      ON example_prompt_runs(example_prompt_id);
CREATE INDEX idx_prompt_runs_provider ON example_prompt_runs(provider);

-- Seed: 18 realistic prompts spanning 6 categories. Paths follow the
-- whitelist in src/lib/schemas/patchPaths.ts. Use unixepoch()*1000 so
-- created_at/updated_at are millisecond timestamps consistent with Date.now().
INSERT INTO example_prompts (slug, category, user_prompt, match_pattern, expected_envelope_json, expected_outcome, notes, created_at, updated_at) VALUES
  ('starter-hero-text-bake','starter','Make the hero say "Bake Joy Daily"','^make\s+the\s+hero\s+say\s+',
    '{"patches":[{"op":"replace","path":"/sections/1/components/1/props/text","value":"Bake Joy Daily"}],"summary":"Updated hero headline."}','success','Starter 1: hero headline replace.',unixepoch()*1000,unixepoch()*1000),
  ('starter-accent-green','starter','Change the accent color to forest green','^change\s+the\s+(theme|accent)\s+color\s+to\s+',
    '{"patches":[{"op":"replace","path":"/theme/palette/accentPrimary","value":"#14532d"}],"summary":"Changed accent color to forest green."}','success','Starter 2: theme accent replace.',unixepoch()*1000,unixepoch()*1000),
  ('starter-serif-headings','starter','Use a serif font for headings','^use\s+a\s+serif\s+font\s+for\s+headings',
    '{"patches":[{"op":"replace","path":"/theme/typography/headingFamily","value":"Instrument Serif"}],"summary":"Switched headings to Instrument Serif."}','success','Starter 3: typography replace.',unixepoch()*1000,unixepoch()*1000),
  ('starter-hero-subheading','starter','Make the hero subheading say "Fresh from our oven."','^make\s+the\s+hero\s+subheading\s+say\s+',
    '{"patches":[{"op":"replace","path":"/sections/1/components/2/props/text","value":"Fresh from our oven."}],"summary":"Updated hero subheading."}','success','Starter 4: hero subheading replace.',unixepoch()*1000,unixepoch()*1000),
  ('starter-blog-sourdough','starter','Write a short blog article about sourdough bread','^write\s+a\s+short\s+blog\s+article\s+about\s+',
    '{"patches":[{"op":"replace","path":"/sections/1/components/0/props/title","value":"A short story about sourdough bread"},{"op":"replace","path":"/sections/1/components/0/props/excerpt","value":"Here is a brief reflection on sourdough bread - what it taught me, and why it sticks."},{"op":"replace","path":"/sections/1/components/0/props/author","value":"Bradley"}],"summary":"Wrote a 3-patch blog article about sourdough bread."}','success','Starter 5: 3-patch blog article.',unixepoch()*1000,unixepoch()*1000),
  ('edge-ambiguous-hero','edge_case','make the hero say something',NULL,
    '{"patches":[],"summary":"I am not sure what you would like the hero to say. Try: \"Make the hero say <text>.\""}','fallback','Ambiguous starter near-miss; expect fallback envelope.',unixepoch()*1000,unixepoch()*1000),
  ('edge-empty-input','edge_case','',NULL,
    '{"patches":[],"summary":"Empty prompt rejected."}','reject','Pipeline must reject empty user prompt before adapter call.',unixepoch()*1000,unixepoch()*1000),
  ('edge-remove-hero','edge_case','remove the hero',NULL,
    '{"patches":[{"op":"remove","path":"/sections/1"}],"summary":"Removed hero section."}','success','Hero is in EDITABLE_SECTION_TYPES; remove is allowed.',unixepoch()*1000,unixepoch()*1000),
  ('safety-hero-script-tag','safety','Make the hero say <script>alert(1)</script>',NULL,
    '{"patches":[{"op":"replace","path":"/sections/1/components/1/props/text","value":"<script>alert(1)</script>"}],"summary":"Updated hero headline."}','reject','Validator rejects HTML/script tags in user-controlled text values.',unixepoch()*1000,unixepoch()*1000),
  ('safety-hero-js-url','safety','Set the hero image to javascript:alert(1)',NULL,
    '{"patches":[{"op":"replace","path":"/sections/1/components/1/props/url","value":"javascript:alert(1)"}],"summary":"Updated hero image."}','reject','Validator rejects javascript: URLs in url-typed fields.',unixepoch()*1000,unixepoch()*1000),
  ('safety-proto-pollution','safety','Add a section with __proto__ in the value',NULL,
    '{"patches":[{"op":"add","path":"/sections/-","value":{"type":"hero","__proto__":{"polluted":true}}}],"summary":"Added section."}','reject','Validator rejects __proto__/constructor keys in patch values.',unixepoch()*1000,unixepoch()*1000),
  ('multi-add-footer','multi_section','Add a footer with copyright text',NULL,
    '{"patches":[{"op":"add","path":"/sections/-","value":{"type":"footer","components":[{"type":"text","props":{"text":"© 2026 All rights reserved."}}]}}],"summary":"Added footer section."}','success','add /sections/- with editable type=footer.',unixepoch()*1000,unixepoch()*1000),
  ('multi-remove-add-pricing','multi_section','Remove the article and add a pricing section',NULL,
    '{"patches":[{"op":"remove","path":"/sections/2"},{"op":"add","path":"/sections/-","value":{"type":"pricing","components":[]}}],"summary":"Swapped article for pricing section."}','reject','pricing not in EDITABLE_SECTION_TYPES; validator must reject add.',unixepoch()*1000,unixepoch()*1000),
  ('multi-hero-and-color','multi_section','Make the hero say X and change accent to blue',NULL,
    '{"patches":[{"op":"replace","path":"/sections/1/components/1/props/text","value":"X"},{"op":"replace","path":"/theme/palette/accentPrimary","value":"#1e3a8a"}],"summary":"Updated hero headline and accent color."}','success','Compound: hero text + theme accent.',unixepoch()*1000,unixepoch()*1000),
  ('site-context-bakery','site_context','This site is for a Brooklyn bakery',NULL,
    '{"patches":[{"op":"replace","path":"/siteContext/purpose","value":"Brooklyn bakery storefront and order pickup."},{"op":"replace","path":"/siteContext/audience","value":"Local Brooklyn residents and walk-in customers."}],"summary":"Updated site context for a Brooklyn bakery."}','success','Two siteContext replaces.',unixepoch()*1000,unixepoch()*1000),
  ('site-context-tone-pro','site_context','Make this more professional',NULL,
    '{"patches":[{"op":"replace","path":"/siteContext/tone","value":"professional"}],"summary":"Set tone to professional."}','success','Single siteContext/tone replace.',unixepoch()*1000,unixepoch()*1000),
  ('content-coffee-long','content_gen','Write a longer article about coffee brewing','^write\s+a\s+(longer|long)\s+(article|post)\s+about\s+',
    '{"patches":[{"op":"replace","path":"/sections/1/components/0/props/title","value":"A practical guide to coffee brewing"},{"op":"replace","path":"/sections/1/components/0/props/body","value":"Coffee brewing rewards patience. Start with fresh beans, grind just before extraction, and weigh both grounds and water. The first pour blooms the bed; the rest extract evenly when the temperature stays near 94C. Taste each batch - the second one is always better than the first."},{"op":"replace","path":"/sections/1/components/0/props/author","value":"Bradley"}],"summary":"Wrote a 3-patch long-form article about coffee brewing."}','success','Long-form 3-patch article.',unixepoch()*1000,unixepoch()*1000),
  ('content-yoga-tagline','content_gen','Suggest a tagline for a yoga studio',NULL,
    '{"patches":[{"op":"replace","path":"/sections/1/components/1/props/text","value":"Breathe. Move. Belong."},{"op":"replace","path":"/sections/1/components/2/props/text","value":"A neighborhood yoga studio for every body."}],"summary":"Suggested a hero tagline + subheading for a yoga studio."}','success','2-patch hero tagline.',unixepoch()*1000,unixepoch()*1000);
