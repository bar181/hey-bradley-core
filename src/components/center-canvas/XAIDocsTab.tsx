import { useState } from 'react'
import { cn } from '../../lib/cn'

type DocsMode = 'HUMAN' | 'AISP'

export function XAIDocsTab() {
  const [mode, setMode] = useState<DocsMode>('HUMAN')

  return (
    <div className="space-y-4">
      {/* Segmented pill toggle */}
      <div className="inline-flex rounded-lg bg-hb-surface p-0.5">
        <button
          onClick={() => setMode('HUMAN')}
          className={cn(
            'rounded-md px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer',
            mode === 'HUMAN'
              ? 'bg-hb-accent text-white'
              : 'text-hb-text-muted hover:text-hb-text-secondary'
          )}
        >
          HUMAN
        </button>
        <button
          onClick={() => setMode('AISP')}
          className={cn(
            'rounded-md px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer',
            mode === 'AISP'
              ? 'bg-hb-accent text-white'
              : 'text-hb-text-muted hover:text-hb-text-secondary'
          )}
        >
          AISP
        </button>
      </div>

      {/* Content */}
      <div className="rounded-lg bg-hb-surface p-5">
        {mode === 'HUMAN' ? (
          <div className="space-y-4 font-mono text-sm leading-relaxed text-hb-text-secondary">
            <div>
              <h3 className="mb-1 font-medium text-hb-text-primary">Page Overview</h3>
              <p>
                This page defines the primary landing experience. It includes a hero
                section, feature grid, and call-to-action. All layout tokens follow
                the AISP spatial model with 8px base unit.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-hb-text-primary">Hero Section</h3>
              <p>
                Full-width stack layout with centered content. Headline uses gradient
                text from white through blue-200 to purple-300. Two CTAs: primary
                (filled accent) and secondary (ghost with border).
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-hb-text-primary">Layout Tokens</h3>
              <p>
                Base unit: 8px. Gap: 2u (16px). Padding: 4u (32px). Max width:
                1200px. Responsive breakpoints at md (6-col) and lg (12-col).
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-hb-text-primary">Render Policy</h3>
              <p>
                Priority: 1 (above fold). Cache: edge. TTL: 3600s. Preload: fonts,
                hero image. Lazy: trust logos, below-fold sections.
              </p>
            </div>
          </div>
        ) : (
          <pre className="font-mono text-sm leading-relaxed">
            <span className="text-hb-accent">@aisp</span>{' '}
            <span className="text-hb-success">1.2</span>{'\n'}
            <span className="text-hb-accent">@page</span>{' '}
            <span className="text-hb-success">index</span>{'\n'}
            <span className="text-hb-accent">@version</span>{' '}
            <span className="text-hb-success">1.0.0-RC1</span>{'\n\n'}
            <span className="text-hb-accent">@section</span>{' '}
            <span className="text-hb-success">hero</span>{'\n'}
            <span className="text-hb-text-muted">  type      </span>
            <span className="text-hb-success">layout.stack</span>{'\n'}
            <span className="text-hb-text-muted">  gap       </span>
            <span className="text-hb-success">2u</span>{'\n'}
            <span className="text-hb-text-muted">  padding   </span>
            <span className="text-hb-success">4u</span>{'\n'}
            <span className="text-hb-text-muted">  maxWidth  </span>
            <span className="text-hb-warning">1200</span>{'\n'}
            <span className="text-hb-text-muted">  priority  </span>
            <span className="text-hb-warning">1</span>{'\n\n'}
            <span className="text-hb-accent">@content</span>{' '}
            <span className="text-hb-success">hero</span>{'\n'}
            <span className="text-hb-text-muted">  headline  </span>
            <span className="text-hb-success">"Ship Code at the Speed of Thought"</span>{'\n'}
            <span className="text-hb-text-muted">  subtitle  </span>
            <span className="text-hb-success">"Build AI-native experiences"</span>{'\n'}
            <span className="text-hb-text-muted">  cta.0     </span>
            <span className="text-hb-success">"Get Started"</span>{'\n'}
            <span className="text-hb-text-muted">  cta.1     </span>
            <span className="text-hb-success">"View my work"</span>{'\n\n'}
            <span className="text-hb-accent">@render</span>{'\n'}
            <span className="text-hb-text-muted">  cache     </span>
            <span className="text-hb-success">edge</span>{'\n'}
            <span className="text-hb-text-muted">  ttl       </span>
            <span className="text-hb-warning">3600</span>{'\n'}
            <span className="text-hb-text-muted">  breakpoint</span>{' '}
            <span className="text-hb-success">md:6col lg:12col</span>
          </pre>
        )}
      </div>
    </div>
  )
}
