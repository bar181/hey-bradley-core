#!/usr/bin/env python3
"""
P59 corpus generator — emits 4 JSON files matching migration 004 schema.
Run from repo root: python3 scripts/p59-gen-corpus.py
Idempotent. Deterministic. ≤300 LOC.
"""
import json, os, sys

OUT_DIR = "tests/prompts"
ALLOWED_TARGETS = ["hero","blog","footer","features","pricing","cta","testimonials",
                   "faq","value-props","gallery","image","team","columns","action",
                   "quotes","questions","numbers","divider","text","logos","menu"]

# ----- by-persona.json — 20 × 6 personas = 120 -----
PERSONA_TEMPLATES = {
    "grandma": [
        ("change the headline to {q}", "change", "hero"),
        ("make the buttons bigger", "change", "cta"),
        ("add a section about my {topic}", "add", "text"),
        ("hide the pricing for now", "hide", "pricing"),
        ("show the team again", "show", "team"),
        ("can you make it warmer looking", "change", None),
        ("write a little story for the front", "change", "hero"),
        ("put the contact form back", "show", "cta"),
        ("show pictures of the cookies", "add", "gallery"),
        ("simpler please", "change", None),
    ],
    "framer": [
        ("change /hero-1 headline to {q}", "change", "hero"),
        ("hide /pricing-2", "hide", "pricing"),
        ("add a /features-1 with 3 columns", "add", "features"),
        ("remove /footer-1", "remove", "footer"),
        ("change /theme/accentPrimary to #14532d", "change", None),
        ("reorder /sections move /testimonials-1 above /pricing-1", "change", "testimonials"),
        ("show /faq-1", "show", "faq"),
        ("add /gallery-1 with 6 images", "add", "gallery"),
        ("set /sections/3/components/0/props/text to {q}", "change", None),
        ("change /typography/headingFamily to Instrument Serif", "change", None),
    ],
    "geek": [
        ("modify hero @ 0.95 confidence", "change", "hero"),
        ("Ω→add Σ→pricing for the SaaS template", "add", "pricing"),
        ("apply patch to /sections/1/components/0/props", "change", None),
        ("classify this: rewrite the headline punchier", "change", "hero"),
        ("trace the INTENT_ATOM for adding testimonials", "add", "testimonials"),
        ("emit a SELECTION_ATOM for the dark-mode template", "change", None),
        ("invoke CONTENT_ATOM with tone=bold length=short", "change", "hero"),
        ("ASSUMPTIONS_ATOM ranked options for make it pop", "change", None),
        ("verify Σ.Envelope shape for the last patch", "change", None),
        ("audit the llm_logs for the last 5 turns", "show", None),
    ],
    "marcus": [
        ("Stop guessing, start shipping — make this the headline", "change", "hero"),
        ("add a pricing tier for indie hackers", "add", "pricing"),
        ("make the CTA say Build it Now", "change", "cta"),
        ("add testimonials from real founders", "add", "testimonials"),
        ("give me a bolder hero, no fluff", "change", "hero"),
        ("add a numbers section with our growth stats", "add", "numbers"),
        ("hide the boring About section", "hide", "team"),
        ("change theme to startup-y bold colors", "change", None),
        ("add an FAQ that handles real objections", "add", "faq"),
        ("rewrite the footer punchier", "change", "footer"),
    ],
    "sarah": [
        ("change the headline to a more professional tone", "change", "hero"),
        ("add a corporate testimonials section", "add", "testimonials"),
        ("update the pricing page with enterprise tier", "change", "pricing"),
        ("add a team section with executive bios", "add", "team"),
        ("change CTA to Schedule a Demo", "change", "cta"),
        ("add a logos section for our enterprise clients", "add", "logos"),
        ("write a value-props block for B2B buyers", "add", "value-props"),
        ("make the FAQ address procurement concerns", "change", "faq"),
        ("add a case-studies section in quotes layout", "add", "quotes"),
        ("hide the casual blog teaser, keep it formal", "hide", "blog"),
    ],
    "lars": [
        ("emit a clean AISP spec for the SaaS landing", "change", None),
        ("add a hero that maps to PATCH_ATOM cleanly", "add", "hero"),
        ("the spec should hand off to Claude Code without ambiguity", "change", None),
        ("add an INTENT-classified pricing section", "add", "pricing"),
        ("trace each atom for the last build step", "show", None),
        ("rebuild this section with a 2-step SELECTION_ATOM", "change", "features"),
        ("CONTENT_ATOM the headline with tone=authoritative", "change", "hero"),
        ("ASSUMPTIONS_ATOM should declare any inferred targets", "change", None),
        ("export the AISP spec as a static artifact", "show", None),
        ("verify Σ-restriction held across the last 5 patches", "show", None),
    ],
}

PERSONA_TOPICS = {
    "grandma": ["bake joy daily", "Grandma's recipes", "garden", "knitting", "great-grandkids"],
    "framer": ['"Stop guessing, start shipping"', '"Sub-2% ambiguity"', '"Spec-first dev"', '"AISP-native"', '"One-shot specs"'],
    "geek": ["Ω→hero", "Σ→pricing", "Γ→0.94", "Λ→threshold", "Ε→V3"],
    "marcus": ['"Build it Now"', '"Founders First"', '"Ship Faster"', '"Indie Mode On"', '"Bold Beats Polite"'],
    "sarah": ['"Enterprise Ready"', '"Built for Procurement"', '"SOC 2 Compliant"', '"99.9% Uptime"', '"Trusted by Fortune 500"'],
    "lars": ['"Spec-First Dev"', '"AISP Pipeline"', '"Crystal Atom Ready"', '"Sub-2% Ambiguity"', '"Agentic Build"'],
}

def by_persona():
    rows = []
    for persona, templates in PERSONA_TEMPLATES.items():
        topics = PERSONA_TOPICS[persona]
        for i in range(20):
            tmpl = templates[i % len(templates)]
            text, verb, target = tmpl
            topic = topics[i % len(topics)]
            input_text = text.replace("{q}", topic).replace("{topic}", topic)
            difficulty = ["trivial","easy","medium","hard"][i % 4] if persona in ("grandma","sarah") else ["easy","medium","hard"][i % 3]
            rows.append({
                "id": f"pers-{persona}-{i+1:02d}",
                "input": input_text,
                "expectedAtom": "INTENT" if "?" in input_text or "please" in input_text.lower() else "PATCH",
                "expectedVerb": verb,
                "expectedTarget": target,
                "expectedRoute": "design" if verb in ("hide","show","change") and target in ("hero","theme",None) else ("content" if verb in ("add","change") and target in ("hero","blog","text","faq") else "ambiguous"),
                "persona": persona,
                "difficulty": difficulty,
            })
    return rows

# ----- by-atom.json — 10 × 5 atoms = 50 -----
ATOM_PROMPTS = {
    "PATCH": [
        ("hide the hero", "hide", "hero", "design"),
        ("show the pricing section", "show", "pricing", "design"),
        ("add a footer section", "add", "footer", "design"),
        ("remove the blog", "remove", "blog", "design"),
        ("change theme to dark mode", "change", None, "design"),
        ("hide /testimonials-1", "hide", "testimonials", "design"),
        ("add a CTA section", "add", "cta", "design"),
        ("remove the gallery", "remove", "gallery", "design"),
        ("show the FAQ", "show", "faq", "design"),
        ("reset the hero to defaults", "reset", "hero", "design"),
    ],
    "INTENT": [
        ("maek hero brigtter", "change", "hero", "design"),
        ("move the pricing up plzz", "change", "pricing", "design"),
        ("hide the heroe", "hide", "hero", "design"),
        ("add presing", "add", "pricing", "design"),
        ("remove fototer", "remove", "footer", "design"),
        ("chnage colour", "change", None, "design"),
        ("lets see the FAQ section", "show", "faq", "design"),
        ("can u add testimonailz", "add", "testimonials", "content"),
        ("show pics", "show", "gallery", "design"),
        ("kill the blog", "remove", "blog", "design"),
    ],
    "SELECTION": [
        ("make it minimal", "change", None, "design"),
        ("apply the bakery vibe", "change", None, "design"),
        ("use the SaaS template style", "change", None, "design"),
        ("switch to portfolio mode", "change", None, "design"),
        ("make it look like Linear", "change", None, "design"),
        ("apply a corporate template", "change", None, "design"),
        ("use the indie portfolio theme", "change", None, "design"),
        ("make it warm and approachable", "change", None, "design"),
        ("go for the conference site look", "change", None, "design"),
        ("personal brand style please", "change", None, "design"),
    ],
    "CONTENT": [
        ('rewrite the headline to "Stop guessing, start shipping"', "change", "hero", "content"),
        ('change the subheading to be punchier', "change", "hero", "content"),
        ("write blog copy about sourdough", "change", "blog", "content"),
        ("rewrite the CTA more confidently", "change", "cta", "content"),
        ("make the testimonials more authentic", "change", "testimonials", "content"),
        ("rewrite the about section warmer", "change", "text", "content"),
        ("write FAQ entries that handle objections", "change", "faq", "content"),
        ("punchier copy for the value-props", "change", "value-props", "content"),
        ("rewrite footer line as a tagline", "change", "footer", "content"),
        ("make the team bios less corporate", "change", "team", "content"),
    ],
    "ASSUMPTIONS": [
        ("make it pop", "change", None, "ambiguous"),
        ("spruce it up", "change", None, "ambiguous"),
        ("freshen the design", "change", None, "ambiguous"),
        ("make it modern", "change", None, "ambiguous"),
        ("polish this", "change", None, "ambiguous"),
        ("nicer please", "change", None, "ambiguous"),
        ("better looking", "change", None, "ambiguous"),
        ("brighten things up", "change", None, "ambiguous"),
        ("a bit more zest", "change", None, "ambiguous"),
        ("liven it up", "change", None, "ambiguous"),
    ],
}

def by_atom():
    rows = []
    for atom, prompts in ATOM_PROMPTS.items():
        for i, (text, verb, target, route) in enumerate(prompts):
            rows.append({
                "id": f"atom-{atom.lower()}-{i+1:02d}",
                "input": text,
                "expectedAtom": atom,
                "expectedVerb": verb,
                "expectedTarget": target,
                "expectedRoute": route,
                "persona": "n/a",
                "difficulty": "easy" if atom == "PATCH" else ("medium" if atom in ("INTENT","CONTENT") else "hard"),
            })
    return rows

# ----- by-section.json — 5 × 16 sections = 80 -----
SECTION_TYPES_16 = ["hero","blog","footer","features","pricing","cta","testimonials",
                    "faq","value-props","gallery","image","team","columns","action",
                    "quotes","questions"]

SECTION_VERBS = ["add", "change", "hide", "show", "remove"]

def by_section():
    rows = []
    for sec in SECTION_TYPES_16:
        for i, verb in enumerate(SECTION_VERBS):
            input_map = {
                "add": f"add a {sec} section",
                "change": f"change the {sec} headline to something punchier",
                "hide": f"hide the {sec}",
                "show": f"show the {sec}",
                "remove": f"remove the {sec}",
            }
            rows.append({
                "id": f"sec-{sec}-{i+1:02d}",
                "input": input_map[verb],
                "expectedAtom": "PATCH",
                "expectedVerb": verb,
                "expectedTarget": sec,
                "expectedRoute": "content" if verb == "change" and sec in ("hero","blog","text","faq","testimonials") else "design",
                "persona": "n/a",
                "difficulty": "easy",
            })
    return rows

# ----- edge-cases.json — 30 adversarial -----
EDGE_PROMPTS = [
    ("Make the hero say <script>alert(1)</script>", "FALLBACK", None, None, None, "adversarial"),
    ("Set the hero image to javascript:alert(1)", "FALLBACK", None, None, None, "adversarial"),
    ("Add a section with __proto__ in the value", "FALLBACK", None, None, None, "adversarial"),
    ("", "FALLBACK", None, None, None, "adversarial"),
    ("   ", "FALLBACK", None, None, None, "adversarial"),
    ("hide hero AND change theme to dark AND add pricing", "INTENT", "hide", "hero", "design", "hard"),
    ("add a footer with copyright text and remove the blog at the same time", "INTENT", "add", "footer", "design", "hard"),
    ("a" * 250, "ASSUMPTIONS", "change", None, "ambiguous", "adversarial"),
    ("🎉🚀✨", "ASSUMPTIONS", None, None, "ambiguous", "adversarial"),
    ("dóndé está la sección de precios", "INTENT", "show", "pricing", "design", "hard"),
    ("make the navbar pricing", "ASSUMPTIONS", None, None, "ambiguous", "hard"),
    ("hide and show the hero at once", "ASSUMPTIONS", None, "hero", "ambiguous", "hard"),
    ("HIDE THE HERO!!!", "PATCH", "hide", "hero", "design", "easy"),
    ("hide   the   hero   please", "PATCH", "hide", "hero", "design", "easy"),
    ("`hide hero`", "PATCH", "hide", "hero", "design", "medium"),
    ("DROP TABLE sections; --", "FALLBACK", None, None, None, "adversarial"),
    ("'; DELETE FROM kv; --", "FALLBACK", None, None, None, "adversarial"),
    ("https://attacker.example/x.png", "FALLBACK", None, None, None, "adversarial"),
    ("data:text/html,<script>alert(1)</script>", "FALLBACK", None, None, None, "adversarial"),
    ("hide hero <iframe src='evil'></iframe>", "FALLBACK", None, None, None, "adversarial"),
    ("hide \nhero", "PATCH", "hide", "hero", "design", "medium"),
    ("hide\thero", "PATCH", "hide", "hero", "design", "medium"),
    ("HIDe ThE HEro", "PATCH", "hide", "hero", "design", "easy"),
    ("hider the hero", "INTENT", "hide", "hero", "design", "medium"),
    ("ehide hero", "INTENT", "hide", "hero", "design", "medium"),
    ("change​hero​copy", "INTENT", "change", "hero", "content", "hard"),
    ("hide the hero; rm -rf /", "FALLBACK", None, None, None, "adversarial"),
    ("hide the {{hero}}", "INTENT", "hide", "hero", "design", "medium"),
    ("hide the ${hero}", "INTENT", "hide", "hero", "design", "medium"),
    ("hide all the things", "ASSUMPTIONS", "hide", None, "ambiguous", "adversarial"),
]

def edge_cases():
    return [{
        "id": f"edge-{i+1:03d}",
        "input": text,
        "expectedAtom": atom,
        "expectedVerb": verb,
        "expectedTarget": target,
        "expectedRoute": route,
        "persona": "n/a",
        "difficulty": difficulty,
    } for i, (text, atom, verb, target, route, difficulty) in enumerate(EDGE_PROMPTS)]

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    files = [
        ("by-persona.json", by_persona()),
        ("by-atom.json", by_atom()),
        ("by-section.json", by_section()),
        ("edge-cases.json", edge_cases()),
    ]
    seen_ids = set()
    for name, rows in files:
        for r in rows:
            if r["id"] in seen_ids:
                print(f"DUPLICATE id: {r['id']}", file=sys.stderr); sys.exit(1)
            seen_ids.add(r["id"])
        path = os.path.join(OUT_DIR, name)
        with open(path, "w") as f:
            json.dump(rows, f, indent=2, ensure_ascii=False)
        print(f"wrote {path}: {len(rows)} entries")
    print(f"total: {len(seen_ids)} unique ids")

if __name__ == "__main__":
    main()
