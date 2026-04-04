import { useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/cn'
import { Upload, AlertCircle, Check, X, Loader2 } from 'lucide-react'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

interface ImageUploadZoneProps {
  onConfirm: (dataUri: string) => void
}

export function ImageUploadZone({ onConfirm }: ImageUploadZoneProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    setUploadError(null)
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError('Only JPEG, PNG, and WebP images are accepted.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('Image must be under 2 MB.')
      return
    }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
      setUploading(false)
    }
    reader.onerror = () => {
      setUploadError('Failed to read file.')
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
      e.target.value = ''
    },
    [processFile],
  )

  const handleConfirm = useCallback(() => {
    if (preview) onConfirm(preview)
  }, [preview, onConfirm])

  const handleCancel = useCallback(() => {
    setPreview(null)
    setUploadError(null)
  }, [])

  return (
    <div className="mb-3">
      {preview ? (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-hb-border/50 bg-hb-surface">
          <img
            src={preview}
            alt="Upload preview"
            className="w-16 h-12 rounded object-cover border border-hb-border/30"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-hb-text-primary font-medium truncate">Image ready</p>
            <p className="text-[10px] text-hb-text-muted">Click confirm to use this image</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCancel}
              className="p-1.5 rounded-md text-hb-text-muted hover:bg-hb-surface-hover hover:text-hb-text-primary transition-colors"
              title="Cancel"
            >
              <X size={14} />
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-hb-accent/15 text-hb-accent hover:bg-hb-accent/25 transition-colors"
            >
              <Check size={12} />
              Confirm
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center gap-1.5 p-4 rounded-lg border-2 border-dashed cursor-pointer transition-all',
            dragOver
              ? 'border-hb-accent bg-hb-accent/10'
              : 'border-hb-border/50 hover:border-hb-accent/40 hover:bg-hb-surface-hover',
          )}
        >
          {uploading ? (
            <Loader2 size={20} className="text-hb-accent animate-spin" />
          ) : (
            <Upload
              size={20}
              className={cn('transition-colors', dragOver ? 'text-hb-accent' : 'text-hb-text-muted')}
            />
          )}
          <p className="text-xs text-hb-text-muted text-center">
            {uploading ? 'Reading image...' : 'Drop an image here or click to upload'}
          </p>
          <p className="text-[10px] text-hb-text-muted/60">JPEG, PNG, or WebP &middot; Max 2 MB</p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      {uploadError && (
        <div className="flex items-center gap-1.5 mt-2 px-2 py-1.5 rounded-md bg-red-500/10 border border-red-500/20">
          <AlertCircle size={12} className="text-red-400 shrink-0" />
          <p className="text-[11px] text-red-400">{uploadError}</p>
        </div>
      )}
    </div>
  )
}
