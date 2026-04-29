/**
 * Sprint J P52 (A8) — Share Spec button.
 *
 * One-click viral share: composes the user's full spec bundle (North Star +
 * SADD + AISP + master config) → encodes to a base64 data URL → copies to
 * clipboard → shows a 3-second toast confirmation. NO server, NO hosted URL
 * (locked decision D5).
 *
 * Mounted above the chat input on desktop; mobile mounting deferred to A10
 * (P53 hamburger menu).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Share2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useConfigStore } from '@/store/configStore';
import { composeShareSpecBundle } from '@/contexts/specification/shareSpecBundle';

interface ToastState {
  text: string;
  kind: 'success' | 'error';
}

async function copyViaClipboardAPI(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  return false;
}

function copyViaTextarea(text: string): boolean {
  try {
    if (typeof document === 'undefined') return false;
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand?.('copy') ?? false;
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} bytes`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function ShareSpecButton() {
  const config = useConfigStore((s) => s.config);
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const showToast = useCallback((next: ToastState) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(next);
    timerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const onShare = useCallback(async () => {
    const { dataUrl, estimatedBytes } = composeShareSpecBundle(config);
    if (!dataUrl) {
      // eslint-disable-next-line no-console
      console.log('[ShareSpec] data URL unavailable; bundle could not encode.');
      showToast({ text: 'Could not copy — see console for the data URL', kind: 'error' });
      return;
    }
    const viaApi = await copyViaClipboardAPI(dataUrl);
    const ok = viaApi || copyViaTextarea(dataUrl);
    if (ok) {
      showToast({
        text: `Spec copied to clipboard (${formatBytes(estimatedBytes)})`,
        kind: 'success',
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('[ShareSpec] clipboard unavailable. Data URL:', dataUrl);
      showToast({ text: 'Could not copy — see console for the data URL', kind: 'error' });
    }
  }, [config, showToast]);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={onShare}
        data-testid="share-spec-button"
        aria-label="Share full spec to clipboard"
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded',
          'text-[11px] uppercase tracking-wider',
          'bg-hb-surface text-hb-text-secondary border border-hb-border/40',
          'hover:bg-hb-accent/10 hover:text-hb-accent hover:border-hb-accent/30',
          'transition-colors',
        )}
      >
        <Share2 className="size-3" aria-hidden="true" />
        <span>Share spec</span>
      </button>
      {toast && (
        <span
          role="status"
          data-testid="share-spec-toast"
          data-toast-kind={toast.kind}
          className={cn(
            'ml-2 inline-block px-2 py-0.5 rounded text-[10px] tracking-wider border',
            toast.kind === 'success'
              ? 'bg-hb-accent/10 text-hb-accent border-hb-accent/30'
              : 'bg-red-500/10 text-red-500 border-red-500/30',
          )}
        >
          {toast.text}
        </span>
      )}
    </div>
  );
}
