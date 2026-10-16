'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { Pause, Play, Wrench } from 'lucide-react'
import { content } from '@/lib/content'
import { BentoCard, CardLockup, Chip, IconChip } from '@/components/about/BentoCard'


// content.featuredTools (the original 13 plus the tools the logo-only
// Skills & Tools wall leaves out; the two together show all 44), split
// into two counter-scrolling rows.
const ITEMS = content.featuredTools
const HALF = Math.ceil(ITEMS.length / 2)
const ROWS = [ITEMS.slice(0, HALF), ITEMS.slice(HALF)]

// Drift speed in px/s, measured on the 13-chip rows (60s per loop, about
// 22 px/s, 2026-10-16); kept when the rows grew, so more chips don't
// scroll faster.
const SPEED = 22

// One track holds two identical halves for the seamless loop (globals.css
// `marquee`). Each half lists the row twice, so a half is always wider than
// the card and no gap shows before the loop restarts. Only the first pass
// of the first half reaches assistive tech; the rest is aria-hidden. The
// duration is set from the measured width of one half, so the speed stays
// SPEED px/s. Under reduced motion the rows are hidden (StaticTools).
function MarqueeRow({ items, reverse }: { items: string[]; reverse: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const fit = () => {
      const half = track.scrollWidth / 2
      if (half) track.style.animationDuration = `${(half / SPEED).toFixed(2)}s`
    }
    fit()
    const resize = new ResizeObserver(fit)
    resize.observe(track)
    void document.fonts?.ready.then(fit) // the chip font swaps in after first paint
    return () => resize.disconnect()
  }, [])

  const list = 'flex shrink-0 gap-2 pr-2'
  const repeat = (key: string) =>
    items.map((item) => (
      <li key={`${key}-${item}`} aria-hidden="true">
        <Chip>{item}</Chip>
      </li>
    ))
  return (
    <div
      ref={trackRef}
      className={`flex w-max animate-[marquee_60s_linear_infinite] group-hover/marquee:[animation-play-state:paused] group-data-paused/marquee:[animation-play-state:paused] motion-reduce:animate-none ${reverse ? '[animation-direction:reverse]' : ''}`}
    >
      <ul translate="no" className={list}>
        {items.map((item) => (
          <li key={item}>
            <Chip>{item}</Chip>
          </li>
        ))}
        {repeat('a')}
      </ul>
      <ul aria-hidden="true" translate="no" className={list}>
        {repeat('b')}
        {repeat('c')}
      </ul>
    </div>
  )
}

// Reduced motion: every tool as one static list, compact so all of them
// fit the 1x1 tile at lg (wrapped chips need about twice its height since
// the logo-only wall moved more tools here). Names never split; the dots
// are visual separators only.
function StaticTools() {
  return (
    <ul translate="no" className="my-auto hidden pt-6 font-mono text-xs leading-normal text-text motion-reduce:block">
      {ITEMS.map((item, i) => (
        // The space between items (outside the nowrap li) is where lines break.
        <Fragment key={item}>
          <li className="inline whitespace-nowrap">
            {item}
            {i < ITEMS.length - 1 && (
              <span aria-hidden="true" className="text-muted">
                {' ·'}
              </span>
            )}
          </li>{' '}
        </Fragment>
      ))}
    </ul>
  )
}

// Tools marquee (DESIGN.md 11.2 and section 7), one of the page's two.
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
        className="group/marquee -mx-6 my-auto space-y-2.5 overflow-hidden pt-6 mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] md:-mx-7 motion-reduce:hidden"
      >
        {ROWS.map((items, i) => (
          <MarqueeRow key={i} items={items} reverse={i % 2 === 1} />
        ))}
      </div>
      <StaticTools />

      <CardLockup title="Tools and Frameworks" />
    </BentoCard>
  )
}
