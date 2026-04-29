/**
 * Sprint N P57 (Wave 2 / N2) — Shared-spec read-only viewer at `/spec/:hash`.
 *
 * Open-core honesty: kv is per-browser. Hashes only resolve inside the
 * browser that published them. When a hash misses we render a clear
 * "Spec not found in this browser" view with instructions instead of
 * pretending the spec is gone.
 */

import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { ShareSpecBundle } from '@/contexts/specification/shareSpecBundle';
import { loadSharedSpec } from '@/contexts/specification/hostedSpecLink';

interface ParsedBundle {
  generatedAt?: string;
  version?: string;
  northStar?: string | null;
  sadd?: string | null;
  aisp?: unknown;
  masterConfig?: { site?: { title?: string; description?: string } } | null;
}

function parseBundleJson(bundle: ShareSpecBundle): ParsedBundle | null {
  try {
    return JSON.parse(bundle.json) as ParsedBundle;
  } catch {
    return null;
  }
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-hb-border/40 text-xs text-hb-text-secondary">
      Built with{' '}
      <Link to="/" className="text-hb-accent hover:underline">Hey Bradley</Link>
      {' · '}
      <a href="https://github.com/bar181/hey-bradley-core" className="hover:underline" target="_blank" rel="noreferrer">
        /heybradley
      </a>
      {' · open core'}
    </footer>
  );
}

function NotFound({ hash }: { hash: string }) {
  return (
    <main
      data-testid="shared-spec-page"
      data-state="not-found"
      className="min-h-screen bg-hb-bg text-hb-text px-6 py-16"
    >
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-hb-text-secondary hover:text-hb-accent mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Hey Bradley
        </Link>
        <h1 className="text-3xl font-bold mb-3">Spec not found in this browser</h1>
        <p className="text-hb-text-secondary mb-6">
          We couldn&apos;t find a spec at <code className="px-1.5 py-0.5 rounded bg-hb-surface border border-hb-border/40 text-xs">/spec/{hash}</code>.
        </p>
        <div className="rounded-lg border border-hb-border/40 bg-hb-surface p-4 text-sm space-y-3">
          <p className="font-semibold">Why this happens</p>
          <p className="text-hb-text-secondary">
            Open-core Hey Bradley stores shared specs in your browser&apos;s local database, not on a server.
            A <code className="text-xs">/spec/:hash</code> URL only resolves in the browser session that created it.
          </p>
          <p className="font-semibold pt-2">What you can do</p>
          <ul className="list-disc pl-5 text-hb-text-secondary space-y-1">
            <li>Open this URL in the browser that originally created the spec.</li>
            <li>Ask the original creator to re-share via the static HTML export option.</li>
            <li>Or paste the data-URL form they copied to their clipboard.</li>
          </ul>
        </div>
        <Footer />
      </div>
    </main>
  );
}

export function SharedSpec() {
  const { hash = '' } = useParams<{ hash: string }>();
  const result = useMemo(() => loadSharedSpec(hash), [hash]);

  if (!result.found) return <NotFound hash={hash} />;

  const parsed = parseBundleJson(result.bundle);
  const title = parsed?.masterConfig?.site?.title || 'Untitled spec';
  const description = parsed?.masterConfig?.site?.description || '';
  const northStar = parsed?.northStar ?? '';
  const sadd = parsed?.sadd ?? '';
  const aispJson = parsed?.aisp ? JSON.stringify(parsed.aisp, null, 2) : '';

  return (
    <main
      data-testid="shared-spec-page"
      data-state="found"
      className="min-h-screen bg-hb-bg text-hb-text px-6 py-12"
    >
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-hb-text-secondary hover:text-hb-accent mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Hey Bradley
        </Link>
        <header className="mb-8 pb-6 border-b border-hb-border/40">
          <p className="text-[11px] uppercase tracking-[0.2em] text-hb-accent mb-2">Shared spec · read only</p>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {description && <p className="text-hb-text-secondary">{description}</p>}
          <p className="text-xs text-hb-text-secondary mt-3">
            Generated {formatDate(parsed?.generatedAt)} · version {parsed?.version || 'unknown'} · hash <code>{hash}</code>
          </p>
        </header>

        {northStar && (
          <section className="mb-8" data-testid="shared-spec-north-star">
            <h2 className="text-xl font-semibold mb-3">North Star</h2>
            <pre className="whitespace-pre-wrap text-sm bg-hb-surface border border-hb-border/40 rounded p-4 overflow-x-auto">{northStar}</pre>
          </section>
        )}

        {sadd && (
          <section className="mb-8" data-testid="shared-spec-sadd">
            <h2 className="text-xl font-semibold mb-3">Architecture (SADD)</h2>
            <pre className="whitespace-pre-wrap text-sm bg-hb-surface border border-hb-border/40 rounded p-4 overflow-x-auto">{sadd}</pre>
          </section>
        )}

        {aispJson && (
          <section className="mb-8" data-testid="shared-spec-aisp">
            <h2 className="text-xl font-semibold mb-3">AISP</h2>
            <pre className="whitespace-pre-wrap text-xs bg-hb-surface border border-hb-border/40 rounded p-4 overflow-x-auto">{aispJson}</pre>
          </section>
        )}

        <Footer />
      </div>
    </main>
  );
}
