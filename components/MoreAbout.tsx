'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { gsap, registerGsap } from '@/lib/gsap'
import { scrollReveal } from '@/lib/reveal'
import { ALWAYS_QUERY, REDUCED_MOTION_QUERY } from '@/lib/motion-preferences'
import { content } from '@/lib/content'
import ProfileLink from '@/components/ProfileLink'
import ResumeButton from '@/components/ResumeButton'

registerGsap()

// "More about me" (DESIGN.md 11.2.1), after the reference's About page
// intro, measured 2026-10-16: two equal columns 64px apart from lg (text
// left, photo right, vertically centered); below lg one centered column
// with the photo last. Mono 14px eyebrow with 0.1em tracking, a display
// headline at 36/42/56px whose accent line runs a touch larger (38/44/60px),
// 14px mono paragraphs at 1.7 line height, then the links row. The photo
// frame is 320px square on phones, 350px from sm, 330x400 from md, 14px
// radius, no shadow. In dark mode the photo fades into the page the way the
// reference's dark photo melts into its black background.

const { eyebrow, headline, paragraphs, photo } = content.moreAbout
const [HEAD_PLAIN, HEAD_ACCENT] = headline

export default function MoreAbout() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ always: ALWAYS_QUERY, reduceMotion: REDUCED_MOTION_QUERY }, (ctx) => {
        const { reduceMotion } = ctx.conditions as { reduceMotion: boolean }
        const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', rootRef.current)

        // Undo the pre-paint hiding (globals.css [data-reveal]).
        gsap.set(items, { autoAlpha: 1 })
        if (reduceMotion) return // static final state

        // Eyebrow, headline, paragraphs, links, then the photo rise in
        // reading order as they scroll in, once (lib/reveal.ts).
        if (rootRef.current) return scrollReveal(rootRef.current, items, { y: 16, start: 'top 85%', duration: 0.8, stagger: 0.08 })
      })

      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} id="more-about" aria-labelledby="more-about-heading" className="px-4 pb-28 md:px-8 md:pb-40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="flex flex-col text-center lg:text-left">
          <p data-reveal className="mb-3 font-mono text-sm tracking-widest text-text">
            {eyebrow}
          </p>
          <h2
            id="more-about-heading"
            data-reveal
            className="font-display text-4xl leading-tight text-fg sm:text-[42px] lg:text-[56px]"
          >
            {HEAD_PLAIN}{' '}
            {/* The accent phrase always starts its own line; balanced, so a
                wrap never leaves one word alone. Each wrapped line carries
                the whole gradient (box-decoration-clone). */}
            <span className="block text-balance">
              <em className="text-gradient-accent box-decoration-clone pr-[0.06em] text-[38px] italic sm:text-[44px] lg:text-[60px]">
                {HEAD_ACCENT}
              </em>
            </span>
          </h2>

          {/* About 60 characters a line while the column is centered; the
              lg column holds about 65 on its own. */}
          <div className="mx-auto mt-5 max-w-[60ch] space-y-3 lg:mx-0 lg:max-w-none">
            {paragraphs.map((text) => (
              <p key={text} data-reveal className="font-mono text-sm leading-[1.7] text-text">
                {text}
              </p>
            ))}
          </div>

          <div data-reveal className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 lg:justify-start">
            {content.links.map((link) => (
              <ProfileLink key={link.href} link={link} className="font-mono text-sm font-semibold text-fg hover:underline" />
            ))}
            <ResumeButton />
          </div>
        </div>

        <div data-reveal className="flex justify-center">
          <div className="relative h-80 w-full max-w-80 overflow-hidden rounded-inset sm:h-[350px] sm:max-w-[350px] md:h-100 md:max-w-[330px]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 768px) 330px, (min-width: 640px) 350px, 320px"
              className="object-cover dark:photo-fade"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
