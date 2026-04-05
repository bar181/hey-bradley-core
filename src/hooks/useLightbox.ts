import { useState } from 'react'

export function useLightbox() {
  const [lightbox, setLightbox] = useState<{ src: string; alt?: string } | null>(null)
  const open = (src: string, alt?: string) => setLightbox({ src, alt })
  const close = () => setLightbox(null)
  return { lightbox, open, close, isOpen: !!lightbox }
}
