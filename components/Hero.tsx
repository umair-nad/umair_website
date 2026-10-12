'use client'

import { useRef } from 'react'
import { Download } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText, registerGsap } from '@/lib/gsap'
import { ALWAYS_QUERY, REDUCED_MOTION_QUERY } from '@/lib/motion-preferences'
import { scrollToHash } from '@/lib/scroll'
import { content } from '@/lib/content'
import CopyEmail from '@/components/hero/CopyEmail'
import PrimaryCta from '@/components/PrimaryCta'
import { HeroArc, HeroWashes } from '@/components/hero/HeroAtmosphere'

registerGsap()

// Every string comes from lib/content.ts (DESIGN.md 11.1).
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

const [SUB_A, SUB_B] = content.heroSubline
const SUBLINE = `${SUB_A} | ${SUB_B}`
// One span per character for the subline's typing reveal.
const typeChars = (text: string) =>
  Array.from(text).map((ch, i) => (
    <span key={i} data-char>
      {ch}
    </span>
  ))

// Typing reveal, measured on the reference (2026-10-12): each character
// fades in over ~0.26s (power2.out; the reference's curve fits CSS `ease`
// over ~0.32s), 0.02s after the previous one, with no cursor, blur, or
// movement. As on the reference, it starts together with the headline
// (user decision 2026-10-12).
const TYPE = { start: 0, fade: 0.26, stagger: 0.02 }

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ always: ALWAYS_QUERY, reduceMotion: REDUCED_MOTION_QUERY }, (ctx) => {
        const { reduceMotion } = ctx.conditions as { reduceMotion: boolean }
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

        // The claim lands line by line first (hierarchy), then the rest.
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
              tl.add(lines, 0)
              return lines
            },
          })
        }

        // The subline types in alongside the headline: only characters that
        // are displayed at this width (the " | " is hidden below sm). The
        // fromTo renders opacity 0 immediately, before the first paint.
        const subChars = gsap.utils
          .toArray<HTMLElement>('[data-hero-sub] [data-char]', rootRef.current)
          .filter((c) => c.offsetParent !== null)
        tl.fromTo(subChars, { opacity: 0 }, { opacity: 1, duration: TYPE.fade, ease: 'power2.out', stagger: TYPE.stagger }, TYPE.start)
        tl.fromTo('[data-hero-cta]', fadeUp.from, fadeUp.to, 0.5)

        // The horizon arc rises into place under the CTAs once the claim has
        // landed: the stage is set, then the light comes up.
        tl.fromTo('[data-hero-arc]', { y: 56, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.8, ease: 'expo.out' }, 0.45)

        return () => split?.revert()
      })

      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <header
      ref={rootRef}
      id="home"
      className="relative isolate flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pt-(--nav-height) md:px-8"
    >
      <HeroWashes />
      <div className="flex w-full max-w-4xl flex-col items-center text-center">
        <h1
          ref={headlineRef}
          data-reveal
          className="max-w-3xl font-display text-4xl leading-[1.15] font-normal text-balance text-fg md:mt-8 md:text-5xl lg:text-[60px] lg:leading-snug"
        >
          {BEFORE}
          {HAS_ACCENT && <em className="text-gradient-accent pr-[0.06em] italic">{ACCENT_WORD}</em>}
          {AFTER}
        </h1>

        {/* Subline. Screen readers and crawlers get the whole sentence once,
            from the sr-only span. The visible copy is aria-hidden and split
            into one span per character for the typing reveal; every
            character takes its full space from the first paint (only its
            opacity animates), so nothing below it ever moves. Two lines
            below sm (broken at the separator, never mid-phrase), one line
            with " | " from sm up. */}
        <p data-reveal data-hero-sub className="mt-5 font-mono text-[15px] leading-relaxed text-balance text-text-hero md:mt-6 md:text-xl">
          <span className="sr-only">{SUBLINE}</span>
          <span aria-hidden="true">
            <span className="block sm:inline">{typeChars(SUB_A)}</span>
            <span className="hidden sm:inline">{typeChars(' | ')}</span>
            <span className="block sm:inline">{typeChars(SUB_B)}</span>
          </span>
        </p>

        <div
          data-reveal
          data-hero-cta
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-5 md:mt-12"
        >
          {/* Primary CTA (shared with the contact panel): scrolls to the
              contact section. */}
          <PrimaryCta
            href="#contact"
            onClick={(e) => {
              if (scrollToHash('#contact')) e.preventDefault()
            }}
          >
            {content.contact.cta}
          </PrimaryCta>

          {/* Download resume (DESIGN.md section 6): the secondary pill. Same
              height, shape, and Alata label as the primary CTA, but outlined
              instead of filled, so the primary still leads. */}
          <a
            href={content.resume.href}
            download
            className={`group inline-flex h-12 touch-manipulation items-center gap-2.5 rounded-full border border-line-strong px-6 text-base text-fg transition-[color,background-color,border-color] hover:border-fg/40 hover:bg-fg/5 active:scale-[0.98] ${focusRing}`}
          >
            <Download
              size={18}
              strokeWidth={1.75}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            />
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
