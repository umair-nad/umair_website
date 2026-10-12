'use client'

import { useState } from 'react'
import { Pause, Play, Wrench } from 'lucide-react'
import { content, type SkillGroupId } from '@/lib/content'
import { BentoCard, CardLockup, Chip, IconChip } from '@/components/about/BentoCard'

const group = (id: SkillGroupId) => content.skills.find((g) => g.id === id)?.items ?? []

// Automation frameworks first, then the tools (DESIGN.md 11.2), split into
// two counter-scrolling rows.
const ITEMS = [...group('automation-frameworks'), ...group('tools')]
const HALF = Math.ceil(ITEMS.length / 2)
const ROWS = [ITEMS.slice(0, HALF), ITEMS.slice(HALF)]

// One track holds two identical halves for the seamless loop (globals.css
// `marquee`). Each half lists the row twice, so a half is always wider than
// the card and no gap shows before the loop restarts. Only the first pass
// of the first half reaches assistive tech; the rest is aria-hidden. Under
// reduced motion the track stops, the repeats are hidden, and the one real
// list wraps so every chip stays visible.
function MarqueeRow({ items, reverse }: { items: string[]; reverse: boolean }) {
  const list = 'flex shrink-0 gap-2 pr-2'
  const repeat = (key: string) =>
    items.map((item) => (
      <li key={`${key}-${item}`} aria-hidden="true" className="motion-reduce:hidden">
        <Chip>{item}</Chip>
      </li>
    ))
  return (
    <div
      className={`flex w-max animate-[marquee_60s_linear_infinite] group-hover/marquee:[animation-play-state:paused] group-data-paused/marquee:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none ${reverse ? '[animation-direction:reverse]' : ''}`}
    >
      <ul className={`${list} motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:pr-0`}>
        {items.map((item) => (
          <li key={item}>
            <Chip>{item}</Chip>
          </li>
        ))}
        {repeat('a')}
      </ul>
      <ul aria-hidden="true" className={`${list} motion-reduce:hidden`}>
        {repeat('b')}
        {repeat('c')}
      </ul>
    </div>
  )
}

// Tools marquee (DESIGN.md 11.2 and section 7): the page's only marquee.
// Moving content that runs longer than 5s needs a way to stop it (WCAG
// 2.2.2), so the rows pause on hover and with the pause button.
export default function ToolsMarqueeCard({ className = '' }: { className?: string }) {
  const [paused, setPaused] = useState(false)

  return (
    <BentoCard className={className}>
      <div className="flex items-start justify-between gap-4">
        <IconChip icon={Wrench} />
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label="Pause tools marquee"
          className="inline-flex size-9 touch-manipulation items-center justify-center rounded-control border border-line text-fg transition-[color,background-color,border-color] hover:bg-fg/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:hidden"
        >
          {paused ? (
            <Play size={16} strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Pause size={16} strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        data-paused={paused || undefined}
        className="group/marquee -mx-6 my-auto space-y-2.5 pt-6 overflow-hidden motion-safe:mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:mx-0 md:-mx-7 md:motion-reduce:mx-0"
      >
        {ROWS.map((items, i) => (
          <MarqueeRow key={i} items={items} reverse={i % 2 === 1} />
        ))}
      </div>

      <CardLockup title="Tools and frameworks" />
    </BentoCard>
  )
}
