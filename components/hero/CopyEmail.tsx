'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Check, Copy } from 'lucide-react'
import { starBurst } from '@/lib/star-burst'

type Status = 'idle' | 'copied' | 'failed'

const RESET_MS = 2000

// Copy-email row (DESIGN.md section 6): lucide Copy icon + the address in
// Source Code Pro. Email is the only direct contact method (CLAUDE.md).
// `compact`: a 32px-tall row instead of 48px, for the /book-a-call header,
// where the reference's row is a single text line (still above the 24px
// target minimum).
export default function CopyEmail({
  email,
  compact = false,
  className = '',
}: {
  email: string
  compact?: boolean
  className?: string
}) {
  const [status, setStatus] = useState<Status>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(email)
      setStatus('copied')
      // Celebration only; the "Copied" label and the live region stay the
      // real feedback. A failed library load must never break the copy.
      starBurst(button).catch(() => {})
    } catch {
      // Clipboard API blocked (insecure context, permissions): the address
      // stays visible and selectable, so the visitor can copy it by hand.
      setStatus('failed')
    }
    timer.current = window.setTimeout(() => setStatus('idle'), RESET_MS)
  }

  const Icon = status === 'copied' ? Check : Copy

  return (
    <div className={`inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy email address ${email}`}
        className={`group inline-flex ${compact ? 'min-h-8' : 'min-h-12'} touch-manipulation flex-wrap items-center justify-center gap-x-2.5 rounded-full px-3 py-1 font-mono text-sm text-fg transition-[color,background-color,border-color] hover:bg-fg/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98]`}
      >
        <Icon
          size={18}
          strokeWidth={1.75}
          aria-hidden="true"
          className={status === 'copied' ? 'text-accent' : 'text-fg'}
        />
        <span translate="no" data-selectable>{email}</span>
        <span
          aria-hidden="true"
          // Below sm the success label is not shown (the icon turns into a
          // check and the live region announces it), so the button reserves
          // no extra width and stays clear of the floating mobile nav. The
          // failure message always shows; the button wraps it underneath.
          className={`text-xs text-muted transition-opacity duration-200 ${status === 'idle' ? 'opacity-0' : 'opacity-100'} ${status === 'failed' ? '' : 'hidden sm:inline'}`}
        >
          {status === 'failed' ? 'Copy failed, select to copy' : 'Copied'}
        </span>
      </button>
      {/* Announces the result to screen readers; the visual label above is aria-hidden. */}
      <span role="status" aria-live="polite" className="sr-only">
        {status === 'copied' ? 'Email address copied to clipboard' : status === 'failed' ? 'Copy failed. The email address is shown on screen.' : ''}
      </span>
    </div>
  )
}
