'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import Image from 'next/image'
import type { SimpleIcon } from 'simple-icons'
import { useGSAP } from '@gsap/react'
import { gsap, registerGsap } from '@/lib/gsap'
import { scrollReveal } from '@/lib/reveal'
import { ALWAYS_QUERY, REDUCED_MOTION_QUERY } from '@/lib/motion-preferences'
import { content, type SkillGroupId } from '@/lib/content'
import { TOOL_LOGO_FILES, TOOL_LOGO_NAMES } from '@/lib/tool-logo-names'

registerGsap()

// Skills & Tools icon wall (DESIGN.md 11.4; approved by the user on
// 2026-10-12, replacing the planned chip sheet). Measured on the
// reference: 64px tiles (56px on phones), 16px radius, 14px gaps (12px on
// phones), neutral-900/70 fill with a neutral-700/50 hairline and
// neutral-300 icons in both themes, rows centered, hover lifts 4px and
// scales to 1.1 over 300ms. Over the section glow the translucent tile
// reads grey-purple on the light page and near-black on the dark one.

const TOOL_GROUPS: SkillGroupId[] = [
  'automation-frameworks',
  'test-management',
  'api-performance',
  'ci-cd',
  'cloud-testing',
  'monitoring',
  'languages',
  'collaboration',
]
// Logo tiles only (user decision 2026-10-16): a tool without a logo we may
// use is left off the wall and shown in the About tools marquee instead
// (content.featuredTools), so all 44 stay on the page.
const HAS_LOGO = new Set<string>([...TOOL_LOGO_NAMES, ...Object.keys(TOOL_LOGO_FILES)])

// Core QA tools lead the wall; the rest follow in group order.
const CORE = ['Jira', 'Postman', 'Cypress', 'Selenium', 'TestRail', 'Apache JMeter']
const ALL = TOOL_GROUPS.flatMap((id) => content.skills.find((g) => g.id === id)?.items ?? []).filter((t) => HAS_LOGO.has(t))
const TOOLS = [...CORE.filter((t) => ALL.includes(t)), ...ALL.filter((t) => !CORE.includes(t))]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

// Keeps a tooltip inside the viewport: near an edge it aligns to the
// tile's side instead of centering on it.
function alignTooltip(li: HTMLElement) {
  const tip = li.querySelector<HTMLElement>('[data-tip]')
  if (!tip) return
  const r = li.getBoundingClientRect()
  const half = tip.offsetWidth / 2
  const center = r.left + r.width / 2
  const align = center - half < 8 ? 'start' : center + half > window.innerWidth - 8 ? 'end' : 'center'
  li.setAttribute('data-align', align)
}

export default function Skills() {
  const rootRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  // Roving tabindex: the wall is one tab stop; arrow keys move between
  // tiles (left/right in reading order, up/down to the nearest tile in the
  // row above or below), Home and End jump to the ends.
  const [active, setActive] = useState(0)

  // Logo paths (~20 KB gzip) load once the section is within 1000px of the
  // viewport, so the first page load doesn't carry them. Until then logo
  // tiles are empty squares of the same size: nothing moves when they land.
  const [icons, setIcons] = useState<Record<string, SimpleIcon> | null>(null)
  useEffect(() => {
    const section = rootRef.current
    if (!section) return
    let cancelled = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        void import('@/lib/tool-icons').then((m) => {
          if (!cancelled) setIcons(m.TOOL_ICONS)
        })
      },
      { rootMargin: '1000px 0px' }
    )
    io.observe(section)
    return () => {
      cancelled = true
      io.disconnect()
    }
  }, [])

  const focusTile = (i: number) => {
    const tiles = listRef.current?.querySelectorAll<HTMLElement>('[data-tile]')
    if (!tiles?.length) return
    const next = Math.max(0, Math.min(tiles.length - 1, i))
    setActive(next)
    tiles[next].focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const tiles = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[data-tile]') ?? [])
    const current = tiles.indexOf(document.activeElement as HTMLElement)
    if (current === -1) return
    const vertical = (dir: 1 | -1) => {
      const from = tiles[current].getBoundingClientRect()
      const cx = from.left + from.width / 2
      const rowTops = Array.from(new Set(tiles.map((t) => Math.round(t.getBoundingClientRect().top)))).sort((a, b) => a - b)
      const row = rowTops.indexOf(Math.round(from.top)) + dir
      if (row < 0 || row >= rowTops.length) return current
      let best = current
      let bestDist = Infinity
      tiles.forEach((t, i) => {
        const r = t.getBoundingClientRect()
        if (Math.round(r.top) !== rowTops[row]) return
        const d = Math.abs(r.left + r.width / 2 - cx)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      return best
    }
    const target =
      e.key === 'ArrowRight' ? current + 1
      : e.key === 'ArrowLeft' ? current - 1
      : e.key === 'ArrowDown' ? vertical(1)
      : e.key === 'ArrowUp' ? vertical(-1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? tiles.length - 1
      : null
    if (target === null) return
    e.preventDefault()
    focusTile(target)
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ always: ALWAYS_QUERY, reduceMotion: REDUCED_MOTION_QUERY }, (ctx) => {
        const { reduceMotion } = ctx.conditions as { reduceMotion: boolean }
        const reveal = gsap.utils.toArray<HTMLElement>('[data-reveal]', rootRef.current)

        // Undo the pre-paint hiding (globals.css [data-reveal]).
        gsap.set(reveal, { autoAlpha: 1 })
        if (reduceMotion) return // static final state

        // Heading and subline rise in, then the tiles follow in reading
        // order, once (hierarchy: the wall assembles under its title;
        // lib/reveal.ts, keyboard focus reveals at once).
        if (rootRef.current) return scrollReveal(rootRef.current, reveal, { y: 16, start: 'top 88%', duration: 0.7, stagger: 0.025 })
      })

      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <section
      ref={rootRef}
      id="skills"
      aria-labelledby="skills-heading"
      className="relative isolate overflow-x-clip px-4 py-28 text-center md:px-8 md:py-40"
    >
      {/* Static glow behind the heading and wall: the reference spins a
          blurred violet-to-pink conic gradient (800x350, 25%, blur 120px);
          ours is the same colors as two soft radial pools, no blur, no
          motion. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-1/2 -z-10 h-[38rem] w-[min(68rem,140vw)] -translate-x-1/2 bg-[radial-gradient(closest-side_at_42%_45%,var(--skills-glow-a),transparent),radial-gradient(closest-side_at_60%_52%,var(--skills-glow-b),transparent)] md:top-24"
      />

      <h2 id="skills-heading" data-reveal className="font-display text-4xl leading-tight text-balance text-fg lg:text-[56px]">
        Skills &amp; <em className="text-gradient-accent pr-[0.06em] italic">Tools</em>
      </h2>
      <p data-reveal className="mx-auto mt-6 max-w-2xl font-mono text-base leading-relaxed text-text md:text-lg">
        {content.skillsSubline}
      </p>

      <ul
        ref={listRef}
        aria-label="Tools"
        onKeyDown={onKeyDown}
        // Every tile is the same square, so each max width is an exact
        // number of tiles per row, and the 32 tiles always wrap into equal
        // full rows: below md, 4 per row (8 x 4; 56px tiles with 12px gaps,
        // 260px, below sm; 64px tiles with 14px gaps, 298px, from sm); from
        // md, 8 per row (4 x 8, 610px); from 1300px wide, where 16 fit,
        // 16 per row (2 x 16, 1234px).
        className="mx-auto mt-14 flex max-w-65 flex-wrap justify-center gap-3 sm:max-w-74.5 sm:gap-3.5 md:mt-16 md:max-w-152.5 min-[81.25rem]:max-w-308.5"
      >
        {TOOLS.map((name, i) => {
          const file = TOOL_LOGO_FILES[name]
          const icon = icons?.[name]
          return (
            <li
              key={name}
              data-reveal
              data-align="center"
              className="group/tile relative"
              onPointerEnter={(e) => alignTooltip(e.currentTarget)}
              onFocus={(e) => alignTooltip(e.currentTarget)}
            >
              <span
                data-tile
                role="img"
                aria-label={name}
                tabIndex={i === active ? 0 : -1}
                onFocus={() => setActive(i)}
                className={`peer flex size-14 items-center justify-center rounded-2xl border border-tile-border bg-tile text-tile-icon shadow-sm transition-[translate,scale,box-shadow] duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:scale-110 sm:size-16 ${focusRing}`}
              >
                {file ? (
                  // The owner's file as is (no recolor, no optimizer). Its
                  // canvas holds the clear space, so it is drawn at 5/3 of
                  // the logo size and the mark itself matches the others.
                  <Image
                    src={file}
                    alt=""
                    aria-hidden="true"
                    width={54}
                    height={54}
                    unoptimized
                    draggable={false}
                    className="size-[calc(1.75rem*5/3)] max-w-none sm:size-[calc(2rem*5/3)]"
                  />
                ) : (
                  icon && (
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 fill-current sm:size-8">
                      <path d={icon.path} />
                    </svg>
                  )
                )}
              </span>
              {/* Visible name on hover, keyboard focus, and tap (a tap
                  focuses the tile). The accessible name is the aria-label. */}
              <span
                data-tip
                aria-hidden="true"
                className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2.5 -translate-x-1/2 rounded-control bg-inverse px-2 py-1 font-sans text-xs whitespace-nowrap text-inverse-fg opacity-0 shadow-lg transition-opacity duration-200 group-data-[align=end]/tile:right-0 group-data-[align=end]/tile:left-auto group-data-[align=end]/tile:translate-x-0 group-data-[align=start]/tile:left-0 group-data-[align=start]/tile:translate-x-0 peer-hover:opacity-100 peer-focus:opacity-100"
              >
                {name}
              </span>
            </li>
          )
        })}
      </ul>

    </section>
  )
}
