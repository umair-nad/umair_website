'use client'

import { useEffect, useRef, useState } from 'react'
import { starBurst } from '@/lib/star-burst'

export type CopyStatus = 'idle' | 'copied' | 'failed'

const RESET_MS = 2000

/**
 * Copies the email address and celebrates with the star burst (shared by
 * CopyEmail and the Get in Touch sheet). `status` drives each caller's
 * visible feedback and live region; it resets after 2s.
 */
export function useCopyEmail(email: string) {
  const [status, setStatus] = useState<CopyStatus>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async (from: HTMLElement) => {
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(email)
      setStatus('copied')
      // Celebration only; the visible label and the live region stay the
      // real feedback. A failed library load must never break the copy.
      starBurst(from).catch(() => {})
    } catch {
      // Clipboard API blocked (insecure context, permissions): the address
      // stays visible and selectable, so the visitor can copy it by hand.
      setStatus('failed')
    }
    timer.current = window.setTimeout(() => setStatus('idle'), RESET_MS)
  }

  return { status, copy }
}
