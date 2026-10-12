'use client'

import { MapPin } from 'lucide-react'
import { content } from '@/lib/content'
import { useLocalTime } from '@/lib/local-time'
import { BentoCard, CardLockup, IconChip } from '@/components/about/BentoCard'
import TimeZoneGlobe from '@/components/about/TimeZoneGlobe'

// Time zone (DESIGN.md 11.2): sourced facts only, the place and its zone,
// plus a live typographic clock. No copy about remote work.
//
// The globe sits low on the right, oversized and cropped by the card, as on
// the reference; its left side fades out so the clock and the lockup keep
// AA contrast. `isolate` keeps the globe (z -10) above the card's own fill.
export default function TimeZoneCard({ className = '' }: { className?: string }) {
  const time = useLocalTime()

  return (
    <BentoCard className={`isolate ${className}`}>
      <TimeZoneGlobe className="absolute -right-[48%] -bottom-[60%] -z-10 aspect-square h-[150%] mask-[linear-gradient(to_right,transparent_16%,black_58%)]" />

      <IconChip icon={MapPin} />

      <p className="my-auto pt-6">
        <span className="sr-only">Local time in {content.location}: </span>
        <time className="font-display text-7xl leading-none text-fg lining-nums tabular-nums md:text-8xl">{time}</time>
      </p>

      <CardLockup caption={content.timeZone.label} title={content.location} />
    </BentoCard>
  )
}
