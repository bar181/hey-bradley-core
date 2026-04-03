import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
        <Card className="border-red-500/20 bg-red-500/5 my-4 ring-0">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-red-400 font-medium">This section encountered an error</p>
            <p className="text-xs text-red-400/60 mt-1">{this.state.error?.message}</p>
            <Button
              variant="link"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-3 text-xs text-red-400 underline hover:text-red-300"
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      )
    }
    return this.props.children
  }
}
