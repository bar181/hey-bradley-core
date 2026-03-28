<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{FEATURE_NAME}} — Hey Bradley Wiki</title>
<style>
  /* ── Reset & Base ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0b0f1a;
    --surface: #131825;
    --surface-2: #1a2035;
    --border: #2a3050;
    --text: #e2e8f0;
    --text-muted: #95a0b8;
    --accent: #6c8cff;
    --accent-glow: rgba(108, 140, 255, 0.25);
    --green: #4ade80;
    --amber: #fbbf24;
    --red: #f87171;
    --cyan: #22d3ee;
    --purple: #a78bfa;
    --radius: 12px;
  }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.7;
    min-height: 100vh;
    overflow-x: hidden;
  }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }

  /* ── Layout ── */
  .container { max-width: 900px; margin: 0 auto; padding: 0 24px 80px; }

  /* ── Hero ── */
  .hero {
    position: relative;
    padding: 72px 0 48px;
    text-align: center;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: -60%;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, var(--accent-glow) 0%, rgba(167, 139, 250, 0.12) 40%, transparent 70%);
    animation: hero-pulse 6s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes hero-pulse {
    0%, 100% { opacity: 0.35; transform: translateX(-50%) scale(1); }
    50%      { opacity: 0.55; transform: translateX(-50%) scale(1.06); }
  }
  .hero h1 {
    font-size: 2.75rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #fff 30%, var(--accent) 70%, var(--purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: hero-fade-in 1s ease-out;
    position: relative;
  }
  @keyframes hero-fade-in {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero .subtitle {
    margin-top: 12px;
    font-size: 1.1rem;
    color: var(--text-muted);
    position: relative;
    animation: hero-fade-in 1.2s ease-out;
  }

  /* ── Badges ── */
  .badges {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 24px;
    position: relative;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border: 1px solid var(--border);
    background: var(--surface);
  }
  .badge:hover { box-shadow: 0 0 12px rgba(108, 140, 255, 0.15); transition: box-shadow 0.3s; }
  .badge.module  { border-color: var(--accent); color: var(--accent); }
  .badge.algo    { border-color: var(--cyan);   color: var(--cyan); }
  .badge.perf    { border-color: var(--green);  color: var(--green); }
  .badge.ai      { border-color: var(--purple); color: var(--purple); }
  .badge.design  { border-color: #e8772e;       color: #e8772e; }
  .badge.phase   { border-color: var(--cyan);   color: var(--cyan); background: rgba(34, 211, 238, 0.08); }

  /* ── Highlight Strip ── */
  .highlights {
    margin-top: 20px;
    font-size: 0.95rem;
    color: var(--text-muted);
    text-align: center;
    position: relative;
  }
  .highlights strong { color: var(--text); }

  /* ── Key Takeaway (Hero) ── */
  .key-takeaway {
    background: linear-gradient(135deg, rgba(108, 140, 255, 0.08), rgba(167, 139, 250, 0.08));
    border: 1px solid rgba(108, 140, 255, 0.3);
    border-radius: var(--radius);
    padding: 20px 24px;
    margin-top: 24px;
    text-align: left;
    position: relative;
  }
  .key-takeaway h3 {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent);
    margin-bottom: 8px;
  }
  .key-takeaway p { font-size: 0.95rem; color: var(--text); line-height: 1.6; }

  /* ── Section Cards ── */
  .section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 32px;
    margin-top: 32px;
    animation: card-in 0.6s ease-out both;
    transition: border-color 0.3s;
  }
  .section:hover { border-color: rgba(108, 140, 255, 0.3); }
  .section:nth-child(2) { animation-delay: 0.1s; }
  .section:nth-child(3) { animation-delay: 0.15s; }
  .section:nth-child(4) { animation-delay: 0.2s; }
  .section:nth-child(5) { animation-delay: 0.25s; }
  .section:nth-child(6) { animation-delay: 0.3s; }
  .section:nth-child(7) { animation-delay: 0.35s; }
  .section:nth-child(8) { animation-delay: 0.4s; }
  .section:nth-child(9) { animation-delay: 0.45s; }
  .section:nth-child(10) { animation-delay: 0.5s; }
  @keyframes card-in {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .section h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .section h2 .icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    flex-shrink: 0;
  }
  .section p, .section li {
    color: var(--text-muted);
    font-size: 0.95rem;
  }
  .section p + p { margin-top: 12px; }

  /* ── Callout Boxes ── */
  .callout {
    margin-top: 16px;
    padding: 16px 20px;
    border-radius: var(--radius);
    border-left: 4px solid var(--accent);
    background: var(--surface-2);
    font-size: 0.9rem;
    color: var(--text-muted);
  }
  .callout strong { color: var(--text); }
  .callout.warn    { border-left-color: var(--amber); }
  .callout.success { border-left-color: var(--green); }

  /* ── Comparison Table ── */
  .compare-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 16px;
  }
  .compare-col {
    background: var(--surface-2);
    border-radius: var(--radius);
    padding: 20px;
    border: 1px solid var(--border);
  }
  .compare-col h3 {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 12px;
  }
  .compare-col.traditional h3 { color: var(--text-muted); }
  .compare-col.novel h3 { color: var(--green); }
  .compare-col ul { list-style: none; padding: 0; }
  .compare-col li {
    padding: 6px 0;
    font-size: 0.9rem;
    border-bottom: 1px solid var(--border);
  }
  .compare-col li:last-child { border-bottom: none; }
  .metric-highlight {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.85rem;
  }
  .metric-highlight.slow { background: rgba(248, 113, 113, 0.15); color: var(--red); }
  .metric-highlight.fast { background: rgba(74, 222, 128, 0.15); color: var(--green); }

  /* ── Core Details ── */
  .detail-step {
    display: flex;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
  }
  .detail-step:last-child { border-bottom: none; }
  .step-num {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--accent-glow);
    color: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.85rem;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .step-content h4 { font-size: 0.95rem; margin-bottom: 4px; }
  .step-content p { font-size: 0.88rem; }

  /* ── Related Features ── */
  .related-list { list-style: none; padding: 0; }
  .related-list li {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
    font-size: 0.9rem;
  }
  .related-list li:last-child { border-bottom: none; }
  .related-name {
    font-weight: 600;
    color: var(--accent);
    white-space: nowrap;
  }

  /* ── Chart Area ── */
  .chart-container {
    margin-top: 16px;
    background: var(--surface-2);
    border-radius: var(--radius);
    padding: 24px;
    border: 1px solid var(--border);
  }
  .bar-chart { display: flex; flex-direction: column; gap: 12px; }
  .bar-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .bar-label {
    width: 150px;
    font-size: 0.82rem;
    text-align: right;
    color: var(--text-muted);
    flex-shrink: 0;
  }
  .bar-track {
    flex: 1;
    height: 28px;
    background: var(--bg);
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }
  .bar-fill {
    height: 100%;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    font-size: 0.78rem;
    font-weight: 700;
    color: #fff;
    animation: bar-grow 1.5s ease-out both;
    overflow: visible;
    white-space: nowrap;
    min-width: fit-content;
  }
  @keyframes bar-grow { from { width: 0; } }
  .bar-fill.accent  { background: linear-gradient(90deg, var(--accent), #8ba4ff); }
  .bar-fill.green   { background: linear-gradient(90deg, #16a34a, var(--green)); }
  .bar-fill.amber   { background: linear-gradient(90deg, #d97706, var(--amber)); }
  .bar-fill.red     { background: linear-gradient(90deg, #dc2626, var(--red)); }
  .bar-fill.cyan    { background: linear-gradient(90deg, #0891b2, var(--cyan)); }
  .bar-fill.purple  { background: linear-gradient(90deg, #7c3aed, var(--purple)); }

  /* ── SVG Diagram Area ── */
  .diagram-wrap { margin-top: 16px; text-align: center; }
  .diagram-wrap svg { max-width: 100%; height: auto; }

  /* ── Data Tables ── */
  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
    font-size: 0.85rem;
  }
  .data-table th {
    text-align: left;
    padding: 10px 12px;
    border-bottom: 2px solid var(--border);
    color: var(--text);
    font-weight: 600;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .data-table td {
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    color: var(--text-muted);
  }
  .data-table tr:hover td { color: var(--text); }

  /* ── Domain Tags (for cross-domain tables) ── */
  .domain-tag {
    display: inline-block;
    padding: 1px 8px;
    border-radius: 4px;
    font-size: 0.72rem;
    font-weight: 600;
    margin-right: 4px;
  }
  .domain-tag.module { background: rgba(108, 140, 255, 0.15); color: var(--accent); }
  .domain-tag.algo   { background: rgba(34, 211, 238, 0.15);  color: var(--cyan); }
  .domain-tag.perf   { background: rgba(74, 222, 128, 0.15);  color: var(--green); }
  .domain-tag.warn   { background: rgba(251, 191, 36, 0.15);  color: var(--amber); }
  .domain-tag.err    { background: rgba(248, 113, 113, 0.15); color: var(--red); }
  .domain-tag.ai     { background: rgba(167, 139, 250, 0.15); color: var(--purple); }

  /* ── Don Miller Narrative Article ── */
  .article-wrap {
    margin-top: 12px;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1rem;
    line-height: 1.85;
    color: var(--text);
  }
  .article-wrap p { margin-bottom: 1rem; }
  .article-wrap p:first-child::first-letter {
    font-size: 3.2rem;
    float: left;
    line-height: 0.82;
    padding-right: 8px;
    padding-top: 4px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--accent), var(--purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .article-wrap blockquote {
    border-left: 3px solid var(--accent);
    padding: 10px 18px;
    margin: 1rem 0;
    font-style: italic;
    font-size: 0.92rem;
    color: var(--text-muted);
  }
  .article-byline {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
    font-size: 0.78rem;
    color: var(--text-muted);
    font-family: 'Inter', -apple-system, sans-serif;
  }

  /* ── Footer ── */
  .footer {
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    text-align: center;
    font-size: 0.8rem;
    color: var(--text-muted);
  }
  .article-nav {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 16px;
  }
  .article-nav a {
    padding: 8px 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.82rem;
    color: var(--text-muted);
    transition: all 0.2s;
  }
  .article-nav a:hover {
    border-color: var(--accent);
    color: var(--accent);
    text-decoration: none;
  }
  .quality-stamp {
    margin-top: 12px;
    font-size: 0.75rem;
    color: var(--accent);
    font-style: italic;
    opacity: 0.8;
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .hero h1 { font-size: 2rem; }
    .compare-grid { grid-template-columns: 1fr; }
    .container { padding: 0 16px 60px; }
    .bar-label { width: 100px; font-size: 0.75rem; }
    .data-table { font-size: 0.75rem; }
    .data-table th, .data-table td { padding: 6px 8px; }
  }
</style>
</head>
<body>
<div class="container">

  <!-- ════════════════════════════════════════════════════════
       SECTION 1: HERO
       ════════════════════════════════════════════════════════ -->
  <header class="hero">
    <h1>{{FEATURE_NAME}}</h1>
    <p class="subtitle">{{SUBTITLE — one line describing core purpose}}</p>

    <!-- Badges: use classes module, algo, ai, perf, design, phase -->
    <div class="badges">
      <span class="badge module">{{Badge 1}}</span>
      <span class="badge algo">{{Badge 2}}</span>
      <span class="badge design">{{Badge 3}}</span>
      <span class="badge perf">{{Badge 4}}</span>
    </div>

    <!-- Essential Highlights -->
    <div class="highlights">
      <strong>{{Key metric or fact}}</strong> &middot; {{Second highlight}}
    </div>

    <!-- Key Takeaway — the single most important thing the reader should know -->
    <div class="key-takeaway">
      <h3>Why this matters</h3>
      <p>{{2–4 sentences explaining the core value proposition. Why should
      the reader care? What problem does this solve? What makes it unique?
      Be specific — include a concrete metric or outcome.}}</p>
    </div>
  </header>

  <!-- ════════════════════════════════════════════════════════
       SECTION 2: WHAT IT IS (Plain Language)
       ════════════════════════════════════════════════════════ -->
  <div class="section">
    <h2><span class="icon" style="background:var(--accent-glow);">💡</span> What It Is</h2>
    <p>
      {{1–3 sentences in plain, everyday language explaining what this feature
      is and what it does. No jargon. A non-technical person should understand.}}
    </p>
  </div>

  <!-- ════════════════════════════════════════════════════════
       SECTION 3: ANALOGY
       ════════════════════════════════════════════════════════ -->
  <div class="section">
    <h2><span class="icon" style="background:rgba(251,191,36,0.15);">🔗</span> Think of It Like…</h2>
    <p>
      {{Same length as "What It Is" — a real-world analogy. Example: "Imagine
      a librarian who automatically groups similar books on the same shelf by
      sensing which ones are frequently checked out together…"}}
    </p>
  </div>

  <!-- ════════════════════════════════════════════════════════
       SECTION 4: TRADITIONAL vs NOVEL
       ════════════════════════════════════════════════════════ -->
  <div class="section">
    <h2><span class="icon" style="background:rgba(74,222,128,0.15);">⚡</span> Traditional vs Our Approach</h2>
    <div class="compare-grid">
      <div class="compare-col traditional">
        <h3>Traditional</h3>
        <ul>
          <li>{{Traditional approach point 1}} <span class="metric-highlight slow">{{metric}}</span></li>
          <li>{{Traditional approach point 2}}</li>
          <li>{{Traditional approach point 3}}</li>
        </ul>
      </div>
      <div class="compare-col novel">
        <h3>Our Approach</h3>
        <ul>
          <li>{{Novel approach point 1}} <span class="metric-highlight fast">{{metric}}</span></li>
          <li>{{Novel approach point 2}}</li>
          <li>{{Novel approach point 3}}</li>
        </ul>
      </div>
    </div>
    <!-- Callout: acknowledge trade-offs honestly -->
    <div class="callout">
      <strong>Trade-off acknowledged.</strong> {{Explain the honest trade-off.
      What does the traditional approach do better? Under what conditions
      would you choose the other path? Intellectual honesty builds trust.}}
    </div>
  </div>

  <!-- ════════════════════════════════════════════════════════
       SECTION 5: CORE DETAILS (How-To Guide Style)
       ════════════════════════════════════════════════════════ -->
  <div class="section">
    <h2><span class="icon" style="background:rgba(108,140,255,0.15);">📖</span> How It Works</h2>
    <div class="detail-step">
      <div class="step-num">1</div>
      <div class="step-content">
        <h4>{{Step 1 Title}}</h4>
        <p>{{2–4 sentences explaining this step clearly. Use concrete examples.}}</p>
      </div>
    </div>
    <div class="detail-step">
      <div class="step-num">2</div>
      <div class="step-content">
        <h4>{{Step 2 Title}}</h4>
        <p>{{Explanation of step 2.}}</p>
      </div>
    </div>
    <div class="detail-step">
      <div class="step-num">3</div>
      <div class="step-content">
        <h4>{{Step 3 Title}}</h4>
        <p>{{Explanation of step 3.}}</p>
      </div>
    </div>
    <!-- Add more steps as needed -->
  </div>

  <!-- ════════════════════════════════════════════════════════
       SECTION 6: SVG DIAGRAM
       Required: At least one SVG process-flow diagram per guide.
       ════════════════════════════════════════════════════════ -->
  <div class="section">
    <h2><span class="icon" style="background:rgba(167,139,250,0.15);">🗺️</span> Pipeline Diagram</h2>
    <div class="diagram-wrap">
      <!-- Replace with an inline SVG showing the process flow.
           Use viewBox for responsiveness. Keep dark theme colors:
           fills=#131825, strokes=#6c8cff/#22d3ee/#a78bfa,
           text=#95a0b8 (muted) and #e2e8f0 (emphasis).
           Animate flow arrows with stroke-dasharray + animate. -->
      <svg viewBox="0 0 820 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;margin-top:12px;">
        <rect width="820" height="200" rx="12" fill="#1a2035"/>
        <!-- Step boxes -->
        <rect x="20" y="40" width="200" height="120" rx="10" fill="#131825" stroke="#6c8cff" stroke-width="1.5"/>
        <text x="120" y="70" text-anchor="middle" fill="#6c8cff" font-size="13" font-weight="700">{{STEP 1}}</text>
        <text x="120" y="100" text-anchor="middle" fill="#95a0b8" font-size="11">{{description}}</text>
        <!-- Animated arrow -->
        <line x1="228" y1="100" x2="288" y2="100" stroke="#4ade80" stroke-width="2" stroke-dasharray="6,3">
          <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.5s" repeatCount="indefinite"/>
        </line>
        <polygon points="285,94 297,100 285,106" fill="#4ade80"/>
        <rect x="300" y="40" width="200" height="120" rx="10" fill="#131825" stroke="#22d3ee" stroke-width="1.5"/>
        <text x="400" y="70" text-anchor="middle" fill="#22d3ee" font-size="13" font-weight="700">{{STEP 2}}</text>
        <text x="400" y="100" text-anchor="middle" fill="#95a0b8" font-size="11">{{description}}</text>
        <!-- Animated arrow -->
        <line x1="508" y1="100" x2="568" y2="100" stroke="#4ade80" stroke-width="2" stroke-dasharray="6,3">
          <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.5s" repeatCount="indefinite"/>
        </line>
        <polygon points="565,94 577,100 565,106" fill="#4ade80"/>
        <rect x="580" y="40" width="220" height="120" rx="10" fill="#131825" stroke="#a78bfa" stroke-width="1.5"/>
        <text x="690" y="70" text-anchor="middle" fill="#a78bfa" font-size="13" font-weight="700">{{STEP 3}}</text>
        <text x="690" y="100" text-anchor="middle" fill="#95a0b8" font-size="11">{{description}}</text>
      </svg>
    </div>
  </div>

  <!-- ════════════════════════════════════════════════════════
       SECTION 7: VISUALIZATIONS (Bar Chart)
       ════════════════════════════════════════════════════════ -->
  <div class="section">
    <h2><span class="icon" style="background:rgba(34,211,238,0.15);">📊</span> At a Glance</h2>
    <p>{{Brief context for the chart — what is being compared and why.}}</p>
    <div class="chart-container">
      <div class="bar-chart">
        <div class="bar-row">
          <div class="bar-label">{{Label 1}}</div>
          <div class="bar-track">
            <div class="bar-fill green" style="width: {{percent}}%;">{{value}}</div>
          </div>
        </div>
        <div class="bar-row">
          <div class="bar-label">{{Label 2}}</div>
          <div class="bar-track">
            <div class="bar-fill accent" style="width: {{percent}}%;">{{value}}</div>
          </div>
        </div>
        <div class="bar-row">
          <div class="bar-label">{{Label 3}}</div>
          <div class="bar-track">
            <div class="bar-fill amber" style="width: {{percent}}%;">{{value}}</div>
          </div>
        </div>
        <div class="bar-row">
          <div class="bar-label">Traditional</div>
          <div class="bar-track">
            <div class="bar-fill red" style="width: {{percent}}%;">{{value}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Optional: success callout for a standout metric -->
    <div class="callout success">
      <strong>{{Headline metric.}}</strong> {{1–2 sentences explaining the
      most impressive number from the chart and what makes it possible.}}
    </div>
  </div>

  <!-- ════════════════════════════════════════════════════════
       SECTION 8: DON MILLER NARRATIVE ARTICLE
       Required: ~300–400 words. Storytelling format with hook,
       drop cap, blockquote, and byline. Serif font.
       ════════════════════════════════════════════════════════ -->
  <div class="section">
    <h2><span class="icon" style="background:rgba(249,112,102,0.15);">✍️</span> {{Article Title — Evocative, Not Technical}}</h2>
    <div class="article-wrap">
      <p>{{Opening paragraph with a hook. The first letter will render
      as a large gradient drop cap automatically via CSS. Start with a
      vivid image, a surprising fact, or a human moment. ~80–100 words.}}</p>
      <p>{{Middle paragraph: the core insight. Explain the "why" behind
      the feature using narrative rather than bullet points. Connect to
      something the reader already understands. ~100–120 words.}}</p>
      <p>{{Third paragraph: implications and forward look. What does this
      make possible that was not possible before? ~80–100 words.}}</p>
      <blockquote>{{A memorable closing quote — one sentence that captures
      the essence. Attributed or philosophical.}}</blockquote>
    </div>
    <div class="article-byline">
      {{Author Name}} &middot; {{Tagline or essay title}}
    </div>
  </div>

  <!-- ════════════════════════════════════════════════════════
       SECTION 9: RELATED FEATURES
       Cross-link to other .guide.html pages. Use <a> tags for
       in-body mentions throughout the guide, not just here.
       ════════════════════════════════════════════════════════ -->
  <div class="section">
    <h2><span class="icon" style="background:rgba(108,140,255,0.15);">🔗</span> Related Features</h2>
    <ul class="related-list">
      <li><span class="related-name"><a href="{{slug}}.guide.html" target="_self">{{Module Name}}</a></span> {{10–20 word description of relationship}}</li>
      <li><span class="related-name"><a href="{{slug}}.guide.html" target="_self">{{Module Name}}</a></span> {{10–20 word description}}</li>
      <li><span class="related-name"><a href="{{slug}}.guide.html" target="_self">{{Module Name}}</a></span> {{10–20 word description}}</li>
    </ul>
  </div>

  <!-- ════════════════════════════════════════════════════════
       SECTION 10: ADDITIONAL DETAILS
       ════════════════════════════════════════════════════════ -->
  <div class="section">
    <h2><span class="icon" style="background:rgba(248,113,113,0.15);">📎</span> Additional Details</h2>
    <p>
      {{Any other relevant information — edge cases, limitations,
      configuration options, links to source code, etc.}}
    </p>
    <!-- Optional: warn callout for known limitations -->
    <div class="callout warn">
      <strong>Known limitation.</strong> {{Describe any important caveats
      the reader should be aware of. Honesty prevents surprises.}}
    </div>
  </div>

  <!-- ════════════════════════════════════════════════════════
       FOOTER — Always include: Hey Bradley Wiki link, nav, quality stamp
       ════════════════════════════════════════════════════════ -->
  <div class="footer">
    Part of the <a href="hey-bradley-wiki.guide.html" target="_self">Hey Bradley Wiki</a> &middot; hey-bradley-core &middot; Generated {{DATE}}
    <div class="article-nav">
      <a href="{{prev-slug}}.guide.html" target="_self">&larr; {{Previous Guide}}</a>
      <a href="{{next-slug}}.guide.html" target="_self">{{Next Guide}} &rarr;</a>
    </div>
    <div class="quality-stamp">Content describes {{brief source description, e.g. "the Shatter-Hash engine in bar-embed (shatter.rs)".}}</div>
  </div>

</div>
</body>
</html>

<!--
╔══════════════════════════════════════════════════════════════════╗
║              HEY BRADLEY — AGENT BUILD INSTRUCTIONS              ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  When an AI agent creates a .guide.html file, follow these       ║
║  steps:                                                          ║
║                                                                  ║
║  SOURCE OF TRUTH:                                                ║
║  All source-of-truth files live in /plans/intial-plans/.         ║
║  Read these before writing any wiki article:                     ║
║    - /plans/intial-plans/00.aisp-reference.md (AISP spec)        ║
║    - /plans/intial-plans/01.north-star.md (North Star)           ║
║    - /plans/intial-plans/02.architecture.md (Architecture)       ║
║    - /plans/intial-plans/03.implementation-plan.md (Impl Plan)   ║
║    - /plans/intial-plans/04.design-bible.md (Design Bible)       ║
║    - /plans/intial-plans/05.swarm-protocol.md (Swarm Protocol)   ║
║    - /plans/intial-plans/06.file-structure.md (File Structure)   ║
║                                                                  ║
║  1. READ the relevant source-of-truth files listed above —       ║
║     they define all technical details for Hey Bradley.            ║
║     Reference the AISP spec at 00.aisp-reference.md for the      ║
║     notation and symbol definitions used across plans.           ║
║                                                                  ║
║  2. COPY this template and replace ALL {{placeholders}}.         ║
║                                                                  ║
║  3. HERO: Set the feature name as h1. Write a concise subtitle.  ║
║     Choose 2–5 badges from: module, algo, ai, perf, design,     ║
║     phase. Write 1–2 essential highlights with key metrics.      ║
║     Write a key-takeaway box (2–4 sentences, concrete value).    ║
║                                                                  ║
║  4. WHAT IT IS: Write 1–3 plain-language sentences. No jargon.   ║
║     A non-technical person (e.g., a capstone reviewer at         ║
║     Harvard) should understand this section completely.           ║
║                                                                  ║
║  5. ANALOGY: Create a relatable real-world analogy. Same length  ║
║     as "What It Is". Make it vivid and memorable.                ║
║                                                                  ║
║  6. TRADITIONAL vs NOVEL: Left column = how traditional systems  ║
║     solve it. Right column = what Hey Bradley does differently.  ║
║     Include concrete metrics where available.                    ║
║     ADD a callout box acknowledging the honest trade-off.        ║
║                                                                  ║
║  7. HOW IT WORKS: Break the process into 3–6 clear steps. Each   ║
║     step gets a title and 2–4 explanatory sentences. Use         ║
║     concrete examples. Keep language accessible.                 ║
║                                                                  ║
║  8. SVG DIAGRAM: Create at least one inline SVG process-flow     ║
║     diagram. Use dark theme colors (bg=#1a2035, strokes from     ║
║     CSS vars). Animate flow arrows with stroke-dasharray.        ║
║     Use viewBox for responsive sizing. No external images.       ║
║                                                                  ║
║  9. VISUALIZATIONS: Create a bar chart comparing performance     ║
║     or feature metrics. Colors: green=our approach,              ║
║     red=traditional, accent=related, amber=intermediate,         ║
║     purple=AI/ML. Add a success callout for standout metric.     ║
║                                                                  ║
║  10. DON MILLER ARTICLE: Write a ~300–400 word narrative in      ║
║      storytelling format. Use the .article-wrap class for serif   ║
║      font and automatic drop cap. Include:                       ║
║      - A hook opening (vivid image or surprising fact)           ║
║      - A core insight paragraph (the "why")                      ║
║      - An implications paragraph (what this enables)             ║
║      - A closing blockquote (memorable one-liner)                ║
║      - A byline (author · tagline)                               ║
║                                                                  ║
║  11. RELATED FEATURES: Each entry: linked module name + 10–20    ║
║      word summary. Use <a href="slug.guide.html"> for cross-     ║
║      links. ALSO cross-link inline throughout the guide body     ║
║      when mentioning other features (not just in this section).  ║
║                                                                  ║
║  12. ADDITIONAL DETAILS: Edge cases, config options, links to    ║
║      source files, known limitations. Use .callout.warn for      ║
║      caveats and .callout.success for highlights.                ║
║                                                                  ║
║  13. FOOTER: Always include:                                     ║
║      - Parent link to hey-bradley-wiki.guide.html                ║
║      - Article nav with prev/next guide links                    ║
║      - Quality stamp describing the source files covered         ║
║                                                                  ║
║  14. VALIDATE: Open the HTML in a browser. Ensure:               ║
║      - Hero animation renders smoothly                           ║
║      - All sections are filled (no {{placeholders}} remain)      ║
║      - Chart bars have realistic widths                          ║
║      - SVG diagram renders and arrows animate                    ║
║      - Drop cap renders on the Don Miller article                ║
║      - Cross-links point to real .guide.html files               ║
║      - Mobile responsive (check at 375px width)                  ║
║      - Page fits in 1–2 printed pages                            ║
║                                                                  ║
║  DUAL AUDIENCE:                                                  ║
║  Wiki articles must be accessible to BOTH:                       ║
║    - Technical developers building and maintaining the system    ║
║    - Non-technical stakeholders (e.g., Bradley's capstone        ║
║      reviewers at Harvard) who need to understand the project    ║
║  Lead each section with plain language, then layer in technical  ║
║  detail. Use analogies and callout boxes to bridge the gap.      ║
║                                                                  ║
║  STYLE RULES:                                                    ║
║  - Keep the dark theme — do not change the color scheme          ║
║  - All CSS is inline (single-file, no external dependencies)     ║
║  - No JavaScript required (pure CSS animations only)             ║
║  - Font stack falls back to system fonts (no Google Fonts)       ║
║  - Badges: use semantic class names (module, algo, ai, perf,     ║
║    design, phase)                                                ║
║  - Bar chart widths are percentages of the max value             ║
║  - Use &middot; for separator dots, &mdash; for em dashes        ║
║  - Use HTML entities for special chars (&larr; &rarr; &micro;)   ║
║                                                                  ║
║  CONTENT GUIDELINES:                                             ║
║  - Overview/landing pages: 1,500–2,000 words                    ║
║  - Individual topic pages: 1,000–1,200 words                    ║
║  - Don Miller article: 300–400 words                             ║
║  - Be intellectually honest — acknowledge trade-offs             ║
║  - Cross-link to other wiki articles using .guide.html suffix    ║
║  - Use .callout boxes for trade-offs, warnings, and highlights   ║
║  - Use .data-table for structured data (not just prose)          ║
║  - Use .domain-tag for categorized inline labels                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
-->
