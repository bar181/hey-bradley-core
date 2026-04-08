import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-white/10 mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-white/50 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Button
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#A51C30] text-white font-medium hover:bg-[#8a1728] transition-colors"
          render={<Link to="/" />}
        >
          Back to Home
        </Button>
      </div>
    </div>
  )
}
