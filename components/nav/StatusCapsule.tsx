'use client'

import { useSyncExternalStore } from 'react'

// Status capsule (DESIGN.md section 6): the green live dot and Umair's
// local time in Islamabad (content.location). Only sourced facts: the city
// and its standard time zone; no weather, greeting, or visitor count.

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Karachi',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const readTime = () => formatter.format(new Date())

// Re-read every 15s: cheap, and the minute flips within 15s of the real one.
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000)
  return () => window.clearInterval(id)
}

export default function StatusCapsule({ className = '' }: { className?: string }) {
  // The server can't know the visitor's render time, so it prints a
  // placeholder and the client fills the real time in after hydration.
  const time = useSyncExternalStore(subscribe, readTime, () => '--:--')

  return (
    <div
      className={`inline-flex h-9.5 items-center gap-2 rounded-inset border border-black/15 bg-black/[0.08] px-3 font-mono text-[11px] text-fg backdrop-blur-md dark:border-white/10 dark:bg-white/5 ${className}`}
    >
      <span className="size-1.5 rounded-full bg-live motion-safe:animate-pulse" aria-hidden="true" />
      <span className="sr-only">Local time in Islamabad, Pakistan: </span>
      <span aria-hidden="true">ISB</span>
      <time className="tabular-nums">{time}</time>
      <span aria-hidden="true" className="text-muted">PKT</span>
    </div>
  )
}
