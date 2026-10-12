'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { ALWAYS_QUERY, REDUCED_MOTION_QUERY } from '@/lib/motion-preferences'
import RoleCard from '@/components/about/RoleCard'
import SpecializationsCard from '@/components/about/SpecializationsCard'
import PortraitCard from '@/components/about/PortraitCard'
import ToolsMarqueeCard from '@/components/about/ToolsMarqueeCard'
import TimeZoneCard from '@/components/about/TimeZoneCard'
import ContactCard from '@/components/about/ContactCard'

registerGsap()

// About bento (DESIGN.md 11.2). Six cards, six real content items, filling
// a 3-column grid exactly (no empty cells):
//
//   lg (3 cols, 22rem rows)       md (2 cols)         base (1 col)
//   [ role 2x1      ][ portr ]    [ role 2x1     ]    role
//   [ specs ][ contact][ 1x2  ]   [ specs ][ port ]   specializations
//   [ time 2x1      ][ tools ]    [ time  ][ 1x2  ]   portrait
//                                 [ cont  ][ tools]   time zone
//                                                     contact
//                                                     tools
//
// The time zone card is two tiles wide at lg so its globe has the room the
// reference gives it (user decision 2026-10-12); the tools card is single.
// DOM order is the mobile order (DESIGN.md section 8). Contact comes before
// tools so keyboard focus (contact links, then the marquee pause button)
// follows the visual order at every width (WCAG 2.4.3). The lg placement
// is explicit per card below.
const PLACEMENT = {
  role: 'md:col-span-2 lg:col-start-1 lg:row-start-1',
  specializations: 'lg:col-start-1 lg:row-start-2',
  portrait: 'md:row-span-2 lg:col-start-3 lg:row-start-1',
  timeZone: 'lg:col-span-2 lg:col-start-1 lg:row-start-3',
  contact: 'lg:col-start-2 lg:row-start-2',
  tools: 'lg:col-start-3 lg:row-start-3',
} as const

export default function About() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ always: ALWAYS_QUERY, reduceMotion: REDUCED_MOTION_QUERY }, (ctx) => {
        const { reduceMotion } = ctx.conditions as { reduceMotion: boolean }
        const cards = gsap.utils.toArray<HTMLElement>('[data-reveal]', rootRef.current)

        // Undo the pre-paint hiding right away (globals.css [data-reveal]).
        gsap.set(cards, { autoAlpha: 1 })
        if (reduceMotion) return // static final state (lib/motion-preferences.ts contract)

        // Cards rise in reading order as they scroll in, once: the sequence
        // follows the grid. fromTo with explicit end values (Hero pattern);
        // a plain from() would capture the CSS-hidden state as its end.
        const from = { autoAlpha: 0, y: 24 }
        gsap.set(cards, from)
        ScrollTrigger.batch(cards, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.fromTo(batch, from, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, overwrite: true }),
        })
      })

      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} id="about" aria-labelledby="about-heading" className="px-4 py-28 md:px-8 md:py-40">
      <h2 id="about-heading" className="sr-only">
        About
      </h2>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[minmax(20rem,auto)] md:grid-cols-2 lg:auto-rows-88 lg:grid-cols-3">
        <RoleCard className={PLACEMENT.role} />
        <SpecializationsCard className={PLACEMENT.specializations} />
        <PortraitCard className={PLACEMENT.portrait} />
        <TimeZoneCard className={PLACEMENT.timeZone} />
        <ContactCard className={PLACEMENT.contact} />
        <ToolsMarqueeCard className={PLACEMENT.tools} />
      </div>
    </section>
  )
}
