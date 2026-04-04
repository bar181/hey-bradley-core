<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GreenLeaf Consulting</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg1: #ffffff;
    --bg2: #f8fafc;
    --txt1: #0f172a;
    --txt2: #475569;
    --acc1: #1e40af;
    --acc2: #2563eb;
    --acc-light: #eff6ff;
    --acc-mid: #bfdbfe;
    --border: #e2e8f0;
    --border-soft: #f1f5f9;
    --sans: 'DM Sans', system-ui, sans-serif;
    --serif: 'Instrument Serif', Georgia, serif;
    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --shadow-sm: 0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04);
    --shadow-md: 0 4px 16px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.04);
    --shadow-lg: 0 12px 40px rgba(15,23,42,0.10), 0 4px 12px rgba(15,23,42,0.06);
    --max-w: 1200px;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--sans);
    color: var(--txt1);
    background: var(--bg1);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .container {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 24px;
  }

  /* ── MENU ── */
  nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-soft);
  }

  .nav-inner {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 0 24px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: var(--txt1);
    text-decoration: none;
    letter-spacing: -0.3px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #16a34a, #15803d);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-icon svg { width: 18px; height: 18px; }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 32px;
    list-style: none;
  }

  .nav-links a {
    font-size: 14px;
    font-weight: 400;
    color: var(--txt2);
    text-decoration: none;
    transition: color 0.2s;
  }

  .nav-links a:hover { color: var(--txt1); }

  .nav-cta {
    background: var(--acc1);
    color: #fff !important;
    padding: 9px 20px;
    border-radius: var(--radius-md);
    font-weight: 500 !important;
    font-size: 14px !important;
    transition: background 0.2s, transform 0.15s !important;
    white-space: nowrap;
  }

  .nav-cta:hover {
    background: var(--acc2) !important;
    transform: translateY(-1px);
    color: #fff !important;
  }

  .hamburger { display: none; cursor: pointer; flex-direction: column; gap: 5px; }
  .hamburger span { display: block; width: 22px; height: 2px; background: var(--txt1); border-radius: 2px; }

  /* ── HERO ── */
  .hero {
    background: var(--bg1);
    padding: 100px 24px 96px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 500px;
    background: radial-gradient(ellipse at center, rgba(37,99,235,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--acc-light);
    color: var(--acc1);
    font-size: 13px;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 100px;
    margin-bottom: 28px;
    border: 1px solid var(--acc-mid);
  }

  .hero-eyebrow::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--acc2);
  }

  h1 {
    font-family: var(--serif);
    font-size: clamp(42px, 6vw, 72px);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: -1.5px;
    color: var(--txt1);
    max-width: 820px;
    margin: 0 auto 24px;
  }

  h1 em {
    font-style: italic;
    color: var(--acc1);
  }

  .hero-sub {
    font-size: 18px;
    color: var(--txt2);
    max-width: 540px;
    margin: 0 auto 40px;
    line-height: 1.7;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--acc1);
    color: #fff;
    padding: 14px 28px;
    border-radius: var(--radius-lg);
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(30,64,175,0.28);
  }

  .btn-primary:hover {
    background: var(--acc2);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(30,64,175,0.35);
  }

  .btn-primary svg { width: 16px; height: 16px; }

  .hero-trust {
    margin-top: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  .hero-trust-label {
    font-size: 12px;
    color: var(--txt2);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
  }

  .trust-logos {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .trust-logo {
    height: 28px;
    display: flex;
    align-items: center;
    color: #94a3b8;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  /* ── COLUMNS / FEATURES ── */
  .features {
    padding: 88px 24px;
    background: var(--bg2);
  }

  .section-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--acc2);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .section-heading {
    font-family: var(--serif);
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 400;
    letter-spacing: -0.8px;
    line-height: 1.15;
    color: var(--txt1);
    margin-bottom: 16px;
  }

  .section-sub {
    font-size: 17px;
    color: var(--txt2);
    max-width: 560px;
    line-height: 1.7;
    margin-bottom: 56px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .feature-card {
    background: var(--bg1);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 32px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .feature-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    background: var(--acc-light);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .feature-icon svg { width: 22px; height: 22px; color: var(--acc1); }

  .feature-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--txt1);
    margin-bottom: 10px;
    letter-spacing: -0.2px;
  }

  .feature-desc {
    font-size: 15px;
    color: var(--txt2);
    line-height: 1.7;
  }

  /* ── NUMBERS ── */
  .numbers {
    padding: 88px 24px;
    background: var(--acc1);
    text-align: center;
  }

  .numbers .section-label { color: var(--acc-mid); }
  .numbers .section-heading { color: #fff; margin-bottom: 0; }

  .numbers-sub {
    font-size: 17px;
    color: rgba(255,255,255,0.72);
    margin: 12px auto 56px;
    max-width: 500px;
  }

  .numbers-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
  }

  .number-item {
    padding: 36px 24px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--radius-lg);
    margin: 1px;
    transition: background 0.2s;
  }

  .number-item:hover { background: rgba(255,255,255,0.10); }

  .number-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md);
    background: rgba(255,255,255,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .number-icon svg { width: 20px; height: 20px; color: #fff; }

  .number-value {
    font-family: var(--serif);
    font-size: 48px;
    font-weight: 400;
    color: #fff;
    line-height: 1;
    margin-bottom: 6px;
    letter-spacing: -1px;
  }

  .number-label {
    font-size: 14px;
    color: rgba(255,255,255,0.65);
    font-weight: 400;
  }

  /* ── TESTIMONIALS ── */
  .testimonials {
    padding: 88px 24px;
    background: var(--bg1);
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 56px;
  }

  .quote-card {
    background: var(--bg2);
    border: 1px solid var(--border-soft);
    border-radius: var(--radius-xl);
    padding: 32px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .quote-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }

  .stars {
    display: flex;
    gap: 3px;
    margin-bottom: 18px;
  }

  .star {
    width: 16px;
    height: 16px;
    color: #f59e0b;
  }

  .quote-text {
    font-size: 15px;
    color: var(--txt1);
    line-height: 1.7;
    margin-bottom: 24px;
    font-style: italic;
  }

  .quote-author {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .quote-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .quote-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--txt1);
  }

  .quote-role {
    font-size: 13px;
    color: var(--txt2);
  }

  /* ── FAQ ── */
  .faq {
    padding: 88px 24px;
    background: var(--bg2);
  }

  .faq-inner {
    max-width: 720px;
    margin: 0 auto;
  }

  .faq-inner .section-heading { text-align: center; }
  .faq-inner .section-sub { text-align: center; margin-left: auto; margin-right: auto; }

  .accordion {
    margin-top: 48px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .accordion-item {
    background: var(--bg1);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: box-shadow 0.2s;
  }

  .accordion-item.open { box-shadow: var(--shadow-sm); }

  .accordion-trigger {
    width: 100%;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-family: var(--sans);
    font-size: 16px;
    font-weight: 500;
    color: var(--txt1);
  }

  .accordion-trigger:hover { background: var(--bg2); }

  .accordion-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--acc-light);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.25s, background 0.2s;
  }

  .accordion-icon svg { width: 14px; height: 14px; color: var(--acc1); }
  .accordion-item.open .accordion-icon { transform: rotate(45deg); background: var(--acc1); }
  .accordion-item.open .accordion-icon svg { color: #fff; }

  .accordion-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
  }

  .accordion-item.open .accordion-body { max-height: 300px; }

  .accordion-content {
    padding: 0 24px 20px;
    font-size: 15px;
    color: var(--txt2);
    line-height: 1.75;
    border-top: 1px solid var(--border-soft);
    padding-top: 16px;
  }

  /* ── CTA ── */
  .cta-section {
    padding: 88px 24px;
    background: var(--bg1);
  }

  .cta-inner {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 340px;
  }

  .cta-left {
    padding: 64px 56px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .cta-left h2 {
    font-family: var(--serif);
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 400;
    letter-spacing: -0.6px;
    line-height: 1.2;
    color: var(--txt1);
    margin-bottom: 16px;
  }

  .cta-left p {
    font-size: 16px;
    color: var(--txt2);
    line-height: 1.7;
    margin-bottom: 32px;
    max-width: 400px;
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--bg1);
    color: var(--txt1);
    padding: 13px 24px;
    border-radius: var(--radius-md);
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    border: 1px solid var(--border);
    transition: background 0.2s, transform 0.15s;
    margin-left: 12px;
  }

  .btn-secondary:hover {
    background: var(--bg2);
    transform: translateY(-1px);
  }

  .cta-buttons { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }

  .cta-right {
    background: linear-gradient(135deg, var(--acc1) 0%, #1d4ed8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    position: relative;
    overflow: hidden;
  }

  .cta-right::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }

  .cta-right::after {
    content: '';
    position: absolute;
    bottom: -60px;
    left: -30px;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }

  .cta-card {
    background: rgba(255,255,255,0.10);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: var(--radius-xl);
    padding: 36px;
    text-align: center;
    max-width: 280px;
    position: relative;
    z-index: 1;
  }

  .cta-card-title {
    font-size: 17px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 8px;
  }

  .cta-card-sub {
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    margin-bottom: 24px;
    line-height: 1.6;
  }

  .cta-card-btn {
    display: block;
    background: #fff;
    color: var(--acc1);
    padding: 12px 24px;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.2s, transform 0.15s;
  }

  .cta-card-btn:hover { opacity: 0.92; transform: translateY(-1px); }

  /* ── FOOTER ── */
  footer {
    background: var(--txt1);
    padding: 72px 24px 40px;
    color: rgba(255,255,255,0.85);
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 48px;
    max-width: var(--max-w);
    margin: 0 auto 56px;
  }

  .footer-brand .logo {
    color: #fff;
    margin-bottom: 16px;
  }

  .footer-brand p {
    font-size: 14px;
    color: rgba(255,255,255,0.55);
    line-height: 1.7;
    max-width: 240px;
  }

  .footer-col h4 {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
    text-transform: uppercase;
  }

  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }

  .footer-col a {
    font-size: 14px;
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-col a:hover { color: rgba(255,255,255,0.9); }

  .footer-bottom {
    max-width: var(--max-w);
    margin: 0 auto;
    padding-top: 28px;
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .footer-copy { font-size: 13px; color: rgba(255,255,255,0.35); }

  .footer-legal { display: flex; gap: 20px; }

  .footer-legal a {
    font-size: 13px;
    color: rgba(255,255,255,0.35);
    text-decoration: none;
  }

  .footer-legal a:hover { color: rgba(255,255,255,0.65); }

  /* ── MOBILE ── */
  @media (max-width: 768px) {
    .nav-links { display: none; flex-direction: column; gap: 12px; position: absolute; top: 68px; left: 0; right: 0; background: var(--bg1); border-bottom: 1px solid var(--border); padding: 20px 24px; }
    .nav-links.open { display: flex; }
    .hamburger { display: flex; }

    h1 { font-size: 40px; letter-spacing: -1px; }
    .hero { padding: 72px 24px 64px; }
    .features-grid { grid-template-columns: 1fr; }
    .numbers-grid { grid-template-columns: repeat(2, 1fr); }
    .testimonials-grid { grid-template-columns: 1fr; }
    .cta-inner { grid-template-columns: 1fr; }
    .cta-right { display: none; }
    .cta-left { padding: 40px 32px; }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
    .footer-brand { grid-column: 1 / -1; }
    .footer-bottom { flex-direction: column; align-items: flex-start; }
  }

  @media (max-width: 480px) {
    .numbers-grid { grid-template-columns: 1fr 1fr; }
    .footer-grid { grid-template-columns: 1fr; }
    .hero-trust { flex-direction: column; gap: 12px; }
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fade-up {
    animation: fadeUp 0.6s ease forwards;
    opacity: 0;
  }

  .fade-up:nth-child(1) { animation-delay: 0.1s; }
  .fade-up:nth-child(2) { animation-delay: 0.2s; }
  .fade-up:nth-child(3) { animation-delay: 0.3s; }
  .fade-up:nth-child(4) { animation-delay: 0.4s; }
</style>
</head>
<body>

<!-- ██ SECTION 1: MENU (simple) ██ -->
<nav>
  <div class="nav-inner">
    <a href="#" class="logo">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/>
          <path d="M12 8c0 4-4 6-4 6"/>
          <path d="M16 6c0 6-6 8-6 8"/>
        </svg>
      </div>
      GreenLeaf
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="#features">Services</a></li>
      <li><a href="#numbers">Results</a></li>
      <li><a href="#testimonials">Clients</a></li>
      <li><a href="#faq">FAQ</a></li>
      <li><a href="#cta" class="nav-cta">Schedule a Call</a></li>
    </ul>
    <div class="hamburger" id="hamburger" onclick="toggleMenu()">
      <span></span><span></span><span></span>
    </div>
  </div>
</nav>

<!-- ██ SECTION 2: HERO (minimal) ██ -->
<section class="hero">
  <div class="container">
    <div class="fade-up">
      <span class="hero-eyebrow">Trusted by Fortune 500</span>
    </div>
    <h1 class="fade-up">Strategy That <em>Grows</em><br>With You</h1>
    <p class="hero-sub fade-up">
      We partner with ambitious companies to build scalable growth strategies — combining market intelligence, operational clarity, and measurable outcomes.
    </p>
    <div class="fade-up">
      <a href="#cta" class="btn-primary">
        Schedule a Consultation
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 8h10M9 4l4 4-4 4"/>
        </svg>
      </a>
    </div>
    <div class="hero-trust fade-up">
      <span class="hero-trust-label">Trusted by</span>
      <div class="trust-logos">
        <span class="trust-logo">Meridian</span>
        <span class="trust-logo">Apex Co</span>
        <span class="trust-logo">Vantage</span>
        <span class="trust-logo">Stratum</span>
        <span class="trust-logo">Crestline</span>
      </div>
    </div>
  </div>
</section>

<!-- ██ SECTION 3: COLUMNS / FEATURES (cards, 3 cols) ██ -->
<section class="features" id="features">
  <div class="container">
    <p class="section-label">Our Services</p>
    <h2 class="section-heading">Built for ambitious<br>organisations</h2>
    <p class="section-sub">Three pillars of transformation — from positioning to execution — delivered by a team that has seen it all.</p>
    <div class="features-grid">
      <div class="feature-card fade-up">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 20h20M6 20V10l6-6 6 6v10"/>
            <rect x="9" y="15" width="6" height="5"/>
          </svg>
        </div>
        <h3 class="feature-title">Growth Strategy</h3>
        <p class="feature-desc">Data-driven market analysis and go-to-market roadmaps that unlock new revenue streams and expand your competitive position.</p>
      </div>
      <div class="feature-card fade-up">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
          </svg>
        </div>
        <h3 class="feature-title">Operational Excellence</h3>
        <p class="feature-desc">Process redesign and organisational alignment that eliminates inefficiency and creates the internal infrastructure for sustainable scale.</p>
      </div>
      <div class="feature-card fade-up">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <h3 class="feature-title">Performance Analytics</h3>
        <p class="feature-desc">Real-time dashboards and KPI frameworks that give leadership full visibility into what's driving growth — and what's not.</p>
      </div>
    </div>
  </div>
</section>

<!-- ██ SECTION 4: NUMBERS (icons, 4 cols) ██ -->
<section class="numbers" id="numbers">
  <div class="container">
    <p class="section-label">Track Record</p>
    <h2 class="section-heading" style="color:#fff; font-family: var(--serif);">Results that speak<br>for themselves</h2>
    <p class="numbers-sub">Across 200+ engagements in 18 countries, our impact is consistent and measurable.</p>
    <div class="numbers-grid">
      <div class="number-item">
        <div class="number-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="number-value">240+</div>
        <div class="number-label">Clients Served</div>
      </div>
      <div class="number-item">
        <div class="number-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="number-value">$2.4B</div>
        <div class="number-label">Revenue Influenced</div>
      </div>
      <div class="number-item">
        <div class="number-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            <polyline points="17 6 23 6 23 12"/>
          </svg>
        </div>
        <div class="number-value">3.8×</div>
        <div class="number-label">Avg. ROI Delivered</div>
      </div>
      <div class="number-item">
        <div class="number-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="number-value">18 yrs</div>
        <div class="number-label">Combined Expertise</div>
      </div>
    </div>
  </div>
</section>

<!-- ██ SECTION 5: TESTIMONIALS (stars, 3 cols) ██ -->
<section class="testimonials" id="testimonials">
  <div class="container">
    <p class="section-label">Client Stories</p>
    <h2 class="section-heading">What our clients say</h2>
    <div class="testimonials-grid">
      <div class="quote-card fade-up">
        <div class="stars">
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
        </div>
        <p class="quote-text">"GreenLeaf didn't just give us a strategy document — they embedded with our team and helped us execute. Within 8 months we had doubled our enterprise pipeline."</p>
        <div class="quote-author">
          <div class="quote-avatar" style="background:#dbeafe; color:#1e40af;">SM</div>
          <div>
            <p class="quote-name">Sarah Mitchell</p>
            <p class="quote-role">Chief Revenue Officer, Meridian Group</p>
          </div>
        </div>
      </div>
      <div class="quote-card fade-up">
        <div class="stars">
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
        </div>
        <p class="quote-text">"The operational audit alone saved us $1.2M annually. But more importantly, we now have the systems to scale without adding headcount proportionally."</p>
        <div class="quote-author">
          <div class="quote-avatar" style="background:#dcfce7; color:#15803d;">JK</div>
          <div>
            <p class="quote-name">James Kowalski</p>
            <p class="quote-role">CEO, Apex Industries</p>
          </div>
        </div>
      </div>
      <div class="quote-card fade-up">
        <div class="stars">
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
          <svg class="star" viewBox="0 0 16 16" fill="#f59e0b"><path d="M8 1l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 10.7l-3.8 2 .7-4.3-3.1-3 4.3-.6z"/></svg>
        </div>
        <p class="quote-text">"We'd worked with three strategy firms before. GreenLeaf was the first that actually stayed accountable to the outcomes — not just the deliverables."</p>
        <div class="quote-author">
          <div class="quote-avatar" style="background:#fef3c7; color:#92400e;">PT</div>
          <div>
            <p class="quote-name">Priya Tanaka</p>
            <p class="quote-role">COO, Vantage Health</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ██ SECTION 6: FAQ (accordion) ██ -->
<section class="faq" id="faq">
  <div class="faq-inner">
    <p class="section-label" style="text-align:center">Common Questions</p>
    <h2 class="section-heading">Frequently asked</h2>
    <p class="section-sub">Everything you need to know before we get started.</p>
    <div class="accordion" id="accordion">
      <div class="accordion-item">
        <button class="accordion-trigger" onclick="toggleAccordion(0)">
          What types of companies do you work with?
          <div class="accordion-icon"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="7" y1="2" x2="7" y2="12"/><line x1="2" y1="7" x2="12" y2="7"/></svg></div>
        </button>
        <div class="accordion-body">
          <p class="accordion-content">We work with growth-stage and enterprise organisations across B2B technology, professional services, healthcare, and consumer sectors. Our sweet spot is companies between $10M and $500M in revenue that are ready to make a step-change in performance.</p>
        </div>
      </div>
      <div class="accordion-item">
        <button class="accordion-trigger" onclick="toggleAccordion(1)">
          How long does a typical engagement last?
          <div class="accordion-icon"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="7" y1="2" x2="7" y2="12"/><line x1="2" y1="7" x2="12" y2="7"/></svg></div>
        </button>
        <div class="accordion-body">
          <p class="accordion-content">Most engagements run 90 days to 12 months. We begin with a focused 4-week discovery sprint to establish baselines and define success metrics, then move into implementation phases with clear milestones and accountability checkpoints every 30 days.</p>
        </div>
      </div>
      <div class="accordion-item">
        <button class="accordion-trigger" onclick="toggleAccordion(2)">
          Do you offer retainer-based advisory services?
          <div class="accordion-icon"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="7" y1="2" x2="7" y2="12"/><line x1="2" y1="7" x2="12" y2="7"/></svg></div>
        </button>
        <div class="accordion-body">
          <p class="accordion-content">Yes. After a successful project engagement, many clients move to a strategic advisory retainer — typically 8 to 16 hours per month — covering ongoing board preparation, M&A readiness, expansion planning, and executive coaching.</p>
        </div>
      </div>
      <div class="accordion-item">
        <button class="accordion-trigger" onclick="toggleAccordion(3)">
          What does the free strategy consultation cover?
          <div class="accordion-icon"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="7" y1="2" x2="7" y2="12"/><line x1="2" y1="7" x2="12" y2="7"/></svg></div>
        </button>
        <div class="accordion-body">
          <p class="accordion-content">The 30-minute call is a focused conversation about your biggest growth constraint. We'll ask sharp questions, share initial observations from similar engagements, and outline what a tailored engagement might look like — with no obligation to proceed.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ██ SECTION 7: CTA (split) ██ -->
<section class="cta-section" id="cta">
  <div class="container">
    <div class="cta-inner">
      <div class="cta-left">
        <p class="section-label">Get Started</p>
        <h2>Ready to Accelerate<br>Your Growth?</h2>
        <p>Schedule a free 30-minute strategy call with a senior consultant. No pitch — just focused conversation about your goals and constraints.</p>
        <div class="cta-buttons">
          <a href="#" class="btn-primary">
            Schedule a Consultation
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </a>
          <a href="#features" class="btn-secondary">View Services</a>
        </div>
      </div>
      <div class="cta-right">
        <div class="cta-card">
          <div style="width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <p class="cta-card-title">Free 30-min call</p>
          <p class="cta-card-sub">Book directly into a senior consultant's calendar — same week availability.</p>
          <a href="#" class="cta-card-btn">Book Now →</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ██ SECTION 8: FOOTER (multi-column, 4 cols) ██ -->
<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <a href="#" class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/>
            <path d="M12 8c0 4-4 6-4 6"/><path d="M16 6c0 6-6 8-6 8"/>
          </svg>
        </div>
        GreenLeaf Consulting
      </a>
      <p>Strategy that creates lasting competitive advantage for ambitious organisations worldwide.</p>
    </div>
    <div class="footer-col">
      <h4>Services</h4>
      <ul>
        <li><a href="#">Growth Strategy</a></li>
        <li><a href="#">Operational Excellence</a></li>
        <li><a href="#">Performance Analytics</a></li>
        <li><a href="#">M&amp;A Advisory</a></li>
        <li><a href="#">Executive Coaching</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <ul>
        <li><a href="#">About Us</a></li>
        <li><a href="#">Our Team</a></li>
        <li><a href="#">Case Studies</a></li>
        <li><a href="#">Insights</a></li>
        <li><a href="#">Careers</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Contact</h4>
      <ul>
        <li><a href="#">hello@greenleaf.co</a></li>
        <li><a href="#">+1 (416) 555-0190</a></li>
        <li><a href="#">Toronto, Canada</a></li>
        <li><a href="#">LinkedIn</a></li>
        <li><a href="#">Schedule a Call</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p class="footer-copy">© 2025 GreenLeaf Consulting Inc. All rights reserved.</p>
    <div class="footer-legal">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Cookie Policy</a>
    </div>
  </div>
</footer>

<script>
  function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
  }

  function toggleAccordion(index) {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach((item, i) => {
      if (i === index) {
        item.classList.toggle('open');
      } else {
        item.classList.remove('open');
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
</script>
</body>
</html>