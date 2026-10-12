'use client'

import { useRef } from 'react'
import { ArrowRight, Download } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText, registerGsap } from '@/lib/gsap'
import { ALWAYS_QUERY, REDUCED_MOTION_QUERY, COARSE_POINTER_QUERY } from '@/lib/motion-preferences'
import { applyMagneticHover } from '@/lib/magnetic'
import { scrollToHash } from '@/lib/scroll'
import { content } from '@/lib/content'
import CopyEmail from '@/components/hero/CopyEmail'
import { HeroArc, HeroWashes } from '@/components/hero/HeroAtmosphere'

registerGsap()

// Every string comes from lib/content.ts (DESIGN.md 11.1).
const currentRole = content.experience[0] // the role with end "Present"
// The headline is the bio's first sentence, shown with a typographic
// apostrophe (the content.ts string itself stays verbatim).
const HEADLINE = content.bio.slice(0, content.bio.indexOf('.') + 1).replace(/'/g, '’')
const ACCENT_WORD = 'break'

// Splits the headline around the one accent word (rendered as plain text if
// the bio ever stops containing it, rather than breaking the hero).
const [BEFORE, AFTER] = (() => {
  const i = HEADLINE.indexOf(ACCENT_WORD)
  return i === -1 ? [HEADLINE, ''] : [HEADLINE.slice(0, i), HEADLINE.slice(i + ACCENT_WORD.length)]
})()
const HAS_ACCENT = HEADLINE.includes(ACCENT_WORD)

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ always: ALWAYS_QUERY, reduceMotion: REDUCED_MOTION_QUERY, coarsePointer: COARSE_POINTER_QUERY }, (ctx) => {
        const { reduceMotion, coarsePointer } = ctx.conditions as { reduceMotion: boolean; coarsePointer: boolean }
        const reveal = gsap.utils.toArray<HTMLElement>('[data-reveal]', rootRef.current)

        if (reduceMotion) {
          // Static final state, no SplitText (lib/motion-preferences.ts contract).
          gsap.set(reveal, { autoAlpha: 1 })
          return
        }

        // Undo the pre-paint hiding right away (globals.css [data-reveal]);
        // the tweens below then own each element's visibility. Every tween
        // is a fromTo with explicit end values: a plain from() would capture
        // the CSS-hidden state as its end value.
        gsap.set(reveal, { autoAlpha: 1 })
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        const fadeUp = { from: { y: 12, autoAlpha: 0 }, to: { y: 0, autoAlpha: 1, duration: 0.8 } }

        // Badge first, then the claim lands line by line (hierarchy), then the rest.
        tl.fromTo('[data-hero-badge]', fadeUp.from, fadeUp.to, 0)

        let split: SplitText | undefined
        if (headlineRef.current) {
          split = SplitText.create(headlineRef.current, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            // Return the tween itself (not the timeline) so SplitText can keep
            // its progress if fonts load or a resize forces a re-split.
            onSplit: (self) => {
              const lines = gsap.fromTo(self.lines, { yPercent: 105 }, { yPercent: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out' })
              tl.add(lines, 0.1)
              return lines
            },
          })
        }

        tl.fromTo('[data-hero-sub]', fadeUp.from, fadeUp.to, 0.45)
        tl.fromTo('[data-hero-cta]', fadeUp.from, fadeUp.to, 0.6)

        // The horizon arc rises into place under the CTAs once the claim has
        // landed: the stage is set, then the light comes up.
        tl.fromTo('[data-hero-arc]', { y: 56, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.8, ease: 'expo.out' }, 0.55)

        // Magnetic pull on fine pointers only.
        const cleanups = coarsePointer
          ? []
          : gsap.utils.toArray<HTMLElement>('[data-magnetic]', rootRef.current).map((el) => applyMagneticHover(el))

        return () => {
          cleanups.forEach((fn) => fn())
          split?.revert()
        }
      })

      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <header
      ref={rootRef}
      className="relative isolate flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pt-(--nav-height) md:px-8"
    >
      <HeroWashes />
      <div className="flex w-full max-w-4xl flex-col items-center text-center">
        <p
          data-reveal
          data-hero-badge
          className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/10 px-3 py-1 text-[13px] text-fg backdrop-blur-[10px] md:text-sm"
        >
          <span className="size-1.5 rounded-full bg-live" aria-hidden="true" />
          {/* One span, so the flex gap only separates the dot from the label. */}
          <span>
            {currentRole.title} · <span translate="no">{currentRole.company}</span>
          </span>
        </p>

        <h1
          ref={headlineRef}
          data-reveal
          className="mt-7 max-w-3xl font-display text-4xl leading-[1.15] font-normal text-balance text-fg md:mt-8 md:text-5xl lg:text-[60px] lg:leading-snug"
        >
          {BEFORE}
          {HAS_ACCENT && <em className="text-gradient-accent pr-[0.06em] italic">{ACCENT_WORD}</em>}
          {AFTER}
        </h1>

        <p data-reveal data-hero-sub className="mt-5 font-mono text-[15px] text-text-hero md:mt-6 md:text-xl">
          <span translate="no">{content.name}</span> | {content.location}
        </p>

        <div
          data-reveal
          data-hero-cta
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-5 md:mt-12"
        >
          <a
            href="#contact"
            data-magnetic
            onClick={(e) => {
              if (scrollToHash('#contact')) e.preventDefault()
            }}
            className={`group inline-flex h-12 touch-manipulation items-center gap-4 rounded-full border border-black/10 bg-black/20 py-1 pr-1 pl-6 text-base text-fg backdrop-blur-xs transition-[color,background-color,border-color] hover:bg-black/25 active:scale-[0.98] dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15 ${focusRing}`}
          >
            Get in touch
            <span className="inline-flex size-9.5 items-center justify-center rounded-full bg-inverse text-inverse-fg transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
            </span>
          </a>

          {/* Download resume (DESIGN.md 11.1), measured on the reference's
              CV button: 8px radius, 6px 12px padding, mono 12px/700, inverse
              fill. min-h-9 keeps a comfortable tap target. */}
          <a
            href={content.resume.href}
            download
            className={`inline-flex min-h-9 touch-manipulation items-center gap-2 rounded-control bg-inverse px-3 py-1.5 font-mono text-xs font-bold text-inverse-fg transition-opacity hover:opacity-85 active:scale-[0.98] ${focusRing}`}
          >
            <Download size={14} strokeWidth={2} aria-hidden="true" />
            Download resume
          </a>

          <CopyEmail email={content.contact.email} />
        </div>
      </div>

      {/* The arc's stage is anchored to the bottom of this block, so the
          horizon sits just under the CTA row, as on the reference. */}
      <div data-reveal data-hero-arc className="relative -z-10 mt-4 h-60 w-full">
        <HeroArc />
      </div>
    </header>
  )
}
