'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, registerGsap } from '@/lib/gsap'
import { scrollReveal } from '@/lib/reveal'
import { ALWAYS_QUERY, REDUCED_MOTION_QUERY } from '@/lib/motion-preferences'
import { content } from '@/lib/content'
import { openContactSheet } from '@/lib/contact-sheet'
import PrimaryCta from '@/components/PrimaryCta'
import CopyEmail from '@/components/hero/CopyEmail'
import ProfileLink from '@/components/ProfileLink'

registerGsap()

// Contact CTA (DESIGN.md 11.5), after the reference's closing panel,
// measured 2026-10-12: a wide rounded panel (14px radius, 5% hairline,
// at least 60vh tall, 65vh on phones) whose fill carries two soft cyan
// pools and an edge vignette, with everything centered on it. Ours is
// static (no blurred blobs drifting, no grain). Copy from lib/content.ts;
// email is the only direct contact method (no phone, CLAUDE.md).

const [HEAD_BEFORE, HEAD_ACCENT, HEAD_AFTER] = content.contact.headline
// "umair@qa: all checks passed. ..." -> the prompt and the message.
const PROMPT_END = content.contact.line.indexOf(':')
const PROMPT = content.contact.line.slice(0, PROMPT_END)
const MESSAGE = content.contact.line.slice(PROMPT_END + 1)
// The last word keeps the cursor block on its line when the line wraps.
const LAST_SPACE = MESSAGE.lastIndexOf(' ')
const MESSAGE_HEAD = MESSAGE.slice(0, LAST_SPACE + 1)
const MESSAGE_TAIL = MESSAGE.slice(LAST_SPACE + 1)

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ always: ALWAYS_QUERY, reduceMotion: REDUCED_MOTION_QUERY }, (ctx) => {
        const { reduceMotion } = ctx.conditions as { reduceMotion: boolean }
        const reveal = gsap.utils.toArray<HTMLElement>('[data-reveal]', rootRef.current)

        // Undo the pre-paint hiding (globals.css [data-reveal]).
        gsap.set(reveal, { autoAlpha: 1 })
        if (reduceMotion) return // static final state

        // Headline, terminal line, buttons, and links rise in order, once
        // (lib/reveal.ts; keyboard focus reveals at once).
        if (rootRef.current) return scrollReveal(rootRef.current, reveal, { y: 16, start: 'top 88%', duration: 0.8, stagger: 0.1 })
      })

      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <section
      ref={rootRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="mx-auto max-w-360 px-2 pt-28 sm:px-6 md:px-8 md:pt-40"
    >
      <div className="relative isolate flex min-h-[max(28rem,65vh)] items-center justify-center overflow-hidden rounded-inset border border-fg/5 bg-cta-panel px-4 py-20 text-center sm:px-8 md:min-h-[max(28rem,60vh)]">
        {/* Atmosphere, decorative: two cyan pools (upper left, lower right;
            wider on phones, where the panel is tall and narrow), then the
            vignette that fades the panel's edges. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_42%_at_28%_30%,var(--cta-glow),transparent),radial-gradient(70%_42%_at_72%_72%,var(--cta-glow),transparent)] md:bg-[radial-gradient(36%_48%_at_30%_30%,var(--cta-glow),transparent),radial-gradient(36%_48%_at_70%_70%,var(--cta-glow),transparent)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--cta-vignette)_110%)]"
        />

        <div className="flex max-w-3xl flex-col items-center">
          <h2
            id="contact-heading"
            data-reveal
            className="font-display text-[2.75rem] leading-[1.1] text-balance text-fg md:text-6xl lg:text-[72px]"
          >
            {HEAD_BEFORE} <em className="text-gradient-accent pr-[0.06em] italic">{HEAD_ACCENT}</em>
            {HEAD_AFTER}
          </h2>

          {/* Static terminal line (user decision 2026-10-12: no typing; the
              hero subline is the page's only typing effect). The prompt is
              in the accent, the cursor block is decorative and never
              blinks. */}
          <p
            data-reveal
            className="mt-6 max-w-full rounded-inset border border-line bg-surface/60 px-4 py-2.5 text-left font-mono text-sm leading-6 text-text md:mt-8 md:text-base dark:bg-white/5"
          >
            <span translate="no" className="text-accent">
              {PROMPT}
            </span>
            <span className="text-muted">:</span>
            {MESSAGE_HEAD}
            <span className="whitespace-nowrap">
              {MESSAGE_TAIL}
              <span aria-hidden="true" className="ml-1.5 inline-block h-4 w-2 translate-y-0.5 bg-fg/50" />
            </span>
          </p>

          <div data-reveal className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-5 md:mt-12">
            {/* Opens the Get in Touch sheet, like the hero's button (user
                decision 2026-10-16); a mailto: link without JavaScript. */}
            <PrimaryCta href={`mailto:${content.contact.email}`} onClick={(e) => openContactSheet(e)} opensDialog>
              {content.contact.cta}
            </PrimaryCta>
            <CopyEmail email={content.contact.email} />
          </div>

          <ul data-reveal aria-label="Profiles" className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2">
            {content.links.map((link) => (
              <li key={link.label}>
                <ProfileLink link={link} className="font-mono text-sm font-semibold text-fg hover:underline" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
