import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Section render error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-6 text-center border border-red-500/20 rounded-lg bg-red-500/5 my-4">
          <p className="text-sm text-red-400 font-medium">This section encountered an error</p>
          <p className="text-xs text-red-400/60 mt-1">{this.state.error?.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
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
