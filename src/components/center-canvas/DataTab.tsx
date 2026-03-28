export function DataTab() {
  return (
    <div className="bg-hb-bg p-4">
      <pre className="font-mono text-sm">
        <span className="text-hb-text-secondary">{'{'}</span>
        {'\n'}
        {'  '}
        <span className="text-hb-accent">"spec"</span>
        <span className="text-hb-text-secondary">: </span>
        <span className="text-hb-success">"aisp-1.2"</span>
        <span className="text-hb-text-secondary">,</span>
        {'\n'}
        {'  '}
        <span className="text-hb-accent">"page"</span>
        <span className="text-hb-text-secondary">: </span>
        <span className="text-hb-success">"index"</span>
        <span className="text-hb-text-secondary">,</span>
        {'\n'}
        {'  '}
        <span className="text-hb-accent">"version"</span>
        <span className="text-hb-text-secondary">: </span>
        <span className="text-hb-success">"1.0.0-RC1"</span>
        {'\n'}
        <span className="text-hb-text-secondary">{'}'}</span>
      </pre>
    </div>
  )
}
