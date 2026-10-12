'use client'

import { MapPin } from 'lucide-react'
import { content } from '@/lib/content'
import { useLocalTime } from '@/lib/local-time'
import { BentoCard, CardLockup, IconChip } from '@/components/about/BentoCard'
import TimeZoneGlobe from '@/components/about/TimeZoneGlobe'

// Time zone (DESIGN.md 11.2): sourced facts only, the place and its zone,
// plus a live typographic clock. No copy about remote work.
//
// Globe placement. lg (the card is two tiles wide): as on the reference, a
// square 170% of the card's height, top-aligned, 12% past the right edge,
// so it clears the clock. Below lg (one tile, clock in the middle): low on
// the right and faded on its left, so the clock and lockup keep AA. At
// every width a card-colored gradient rises from the bottom (measured on
// the reference) so the crop never reads as a hard cut. `isolate` keeps the
// globe (z -10) and the fade (z -5) above the card's own fill, under text.
export default function TimeZoneCard({ className = '' }: { className?: string }) {
  const time = useLocalTime()

  return (
    <BentoCard className={`isolate ${className}`}>
      <TimeZoneGlobe className="absolute right-[-48%] bottom-[-60%] -z-10 aspect-square h-[150%] mask-[linear-gradient(to_right,transparent_16%,black_58%)] lg:top-0 lg:right-[-12%] lg:bottom-auto lg:h-[170%] lg:mask-none" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-5 bg-linear-to-t from-surface via-surface/20 to-transparent"
      />

      <IconChip icon={MapPin} />

      <p className="my-auto pt-6">
        <span className="sr-only">Local time in {content.location}: </span>
        <time className="font-display text-7xl leading-none text-fg lining-nums tabular-nums md:text-8xl">{time}</time>
      </p>

      <CardLockup caption={content.timeZone.label} title={content.location} />
    </BentoCard>
  )
}
