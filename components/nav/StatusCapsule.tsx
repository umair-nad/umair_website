'use client'

import { content } from '@/lib/content'
import { useLocalTime } from '@/lib/local-time'

// Status capsule (DESIGN.md section 6): the green live dot and Umair's
// local time in Islamabad (content.location). Only sourced facts: the city
// and its standard time zone; no weather, greeting, or visitor count.

export default function StatusCapsule({ className = '' }: { className?: string }) {
  const time = useLocalTime()

  return (
    <div
      className={`inline-flex h-9.5 items-center gap-2 rounded-inset border border-black/15 bg-black/[0.08] px-3 font-mono text-[11px] text-fg backdrop-blur-md dark:border-white/10 dark:bg-white/5 ${className}`}
    >
      <span className="size-1.5 rounded-full bg-live motion-safe:animate-pulse" aria-hidden="true" />
      <span className="sr-only">Local time in {content.location}: </span>
      <span aria-hidden="true">ISB</span>
      <time className="tabular-nums">{time}</time>
      <span aria-hidden="true" className="text-muted">
        {content.timeZone.abbr}
      </span>
    </div>
  )
}
