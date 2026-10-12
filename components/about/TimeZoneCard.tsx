'use client'

import { MapPin } from 'lucide-react'
import { content } from '@/lib/content'
import { useLocalTime } from '@/lib/local-time'
import { BentoCard, CardLockup, IconChip } from '@/components/about/BentoCard'

// Time zone (DESIGN.md 11.2): sourced facts only, the place and its zone,
// plus a live typographic clock. No copy about remote work.
export default function TimeZoneCard({ className = '' }: { className?: string }) {
  const time = useLocalTime()

  return (
    <BentoCard className={className}>
      <IconChip icon={MapPin} />

      <p className="my-auto pt-6">
        <span className="sr-only">Local time in {content.location}: </span>
        <time className="font-display text-7xl leading-none text-fg lining-nums tabular-nums md:text-8xl">{time}</time>
      </p>

      <CardLockup caption={content.timeZone.label} title={content.location} />
    </BentoCard>
  )
}
