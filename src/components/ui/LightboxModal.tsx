import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface LightboxModalProps {
  src: string
  alt?: string
  isOpen: boolean
  onClose: () => void
}

export function LightboxModal({ src, alt, isOpen, onClose }: LightboxModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return createPortal(
    <div
      role="dialog"
      aria-label={alt || 'Enlarged image'}
      className="fixed inset-0 z-[9999] flex items-center justify-center animate-lightbox-fade-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt || 'Enlarged image'}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body,
  )
}
