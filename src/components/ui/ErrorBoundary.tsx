import { Component, type ReactNode, type ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  fallback?: ReactNode
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Section render error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="my-4 rounded-lg border border-red-500/20 bg-red-500/5 p-6 text-center">
          <p className="text-sm text-red-400 font-medium">Something went wrong</p>
          <p className="text-xs text-red-400/60 mt-1">{this.state.error?.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-3 text-xs text-red-400 underline hover:text-red-300"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export function SectionErrorFallback({ type }: { type: string }) {
  const label =
    type === 'menu' ? 'Navigation Bar' :
    type === 'action' ? 'Action Block' :
    type === 'logos' ? 'Logo Cloud' :
    type.charAt(0).toUpperCase() + type.slice(1)

  return (
    <div className="my-4 rounded-lg border border-hb-border bg-hb-surface p-6 text-center">
      <p className="text-sm text-hb-text-muted font-medium">
        {label} section encountered an error
      </p>
      <p className="text-xs text-hb-text-muted/60 mt-2">
        Try switching the variant or removing and re-adding the section.
      </p>
    </div>
  )
}
