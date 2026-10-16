'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { getTheme, subscribeTheme, type Theme } from '@/lib/theme'
import { content } from '@/lib/content'

// Cal.com inline booking calendar (DESIGN.md 11.8; user decision
// 2026-10-16: Cal.com's official embed script, loaded immediately). The
// script and its iframe come from app.cal.com, which only this route's CSP
// allows (next.config.js); links into /book-a-call are full page loads so
// that CSP applies. The booking form is Cal.com's own page inside the
// frame: this site never receives or handles its data (DESIGN.md 10.1).

const ORIGIN = 'https://app.cal.com'
const NAMESPACE = '30min'
const { bookingUrl, calLink } = content.bookACall

type CalApi = (...args: unknown[]) => void
type CalGlobal = CalApi & { loaded?: boolean; ns: Record<string, CalApi>; q: unknown[] }

declare global {
  interface Window {
    Cal?: CalGlobal
  }
}

// Cal.com's official loader snippet (its embed instructions), as
// TypeScript: calls are queued until embed.js loads and replays them.
function getCal(): CalGlobal {
  if (window.Cal) return window.Cal
  const queue = (api: { q: unknown[] }, args: unknown[]) => api.q.push(args)
  const cal = ((...args: unknown[]) => {
    const c = window.Cal as CalGlobal
    if (!c.loaded) {
      c.ns = {}
      c.q = c.q || []
      document.head.appendChild(document.createElement('script')).src = `${ORIGIN}/embed/embed.js`
      c.loaded = true
    }
    if (args[0] === 'init') {
      const api = Object.assign((...a: unknown[]) => queue(api, a), { q: [] as unknown[] })
      const namespace = args[1]
      if (typeof namespace === 'string') {
        c.ns[namespace] = c.ns[namespace] || api
        queue(c.ns[namespace] as unknown as { q: unknown[] }, args)
        queue(c, ['initNamespace', namespace])
      } else queue(c, args)
      return
    }
    queue(c, args)
  }) as CalGlobal
  window.Cal = cal
  return cal
}

// The calendar reaches its final height (570px on desktop, about 1300px on
// phones, measured) only once it has loaded; the box reserves it so the
// page below doesn't jump.
export default function CalEmbed() {
  // null until hydrated; then the live theme, so the calendar matches it.
  const theme = useSyncExternalStore<Theme | null>(subscribeTheme, getTheme, () => null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!theme || !host) return
    // A theme switch rebuilds the embed: Cal's ui instruction doesn't
    // repaint a calendar that has already loaded (tested 2026-10-16).
    const target = document.createElement('div')
    target.className = 'w-full'
    host.replaceChildren(target)

    const Cal = getCal()
    Cal('init', NAMESPACE, { origin: ORIGIN })
    const cal = Cal.ns[NAMESPACE]
    cal('inline', { elementOrSelector: target, calLink, config: { layout: 'month_view', theme } })
    cal('ui', { theme, hideEventTypeDetails: false, layout: 'month_view' })
    cal('on', {
      action: 'linkReady',
      callback: () => {
        // embed.js creates the frame without a title; name it for screen readers.
        host.querySelector('iframe')?.setAttribute('title', 'Book a call with Umair Nadeem')
        setStatus('ready')
      },
    })
    const timer = window.setTimeout(() => setStatus((s) => (s === 'ready' ? s : 'failed')), 15000)
    return () => window.clearTimeout(timer)
  }, [theme])

  return (
    <div className="relative">
      <div ref={hostRef} id="booking-calendar" className="min-h-[1300px] w-full md:min-h-[570px]" />
      {status !== 'ready' && (
        <p role="status" className="absolute inset-x-0 top-24 text-center font-mono text-sm text-muted">
          {status === 'failed' ? (
            <>
              The calendar didn’t load.{' '}
              <a href={bookingUrl} className="text-fg underline underline-offset-4">
                Open it on Cal.com
              </a>
            </>
          ) : (
            'Loading the calendar…'
          )}
        </p>
      )}
      <noscript>
        <p className="text-center font-mono text-sm text-muted">
          <a href={bookingUrl} className="text-fg underline underline-offset-4">
            Book a call on Cal.com
          </a>
        </p>
      </noscript>
    </div>
  )
}
