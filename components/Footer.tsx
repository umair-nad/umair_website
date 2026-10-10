'use client'

import { useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { gsap, registerGsap } from '@/lib/gsap'
import { REDUCED_MOTION_QUERY, COARSE_POINTER_QUERY } from '@/lib/motion-preferences'
import { applyMagneticHover } from '@/lib/magnetic'
import WaveformDivider from '@/components/WaveformDivider'

registerGsap()

const focusRing =
  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-xs'

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const waveformWrapperRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        { reduceMotion: REDUCED_MOTION_QUERY, coarsePointer: COARSE_POINTER_QUERY },
        (context) => {
          const { reduceMotion, coarsePointer } = context.conditions as {
            reduceMotion: boolean
            coarsePointer: boolean
          }

          if (reduceMotion) {
            gsap.set(contentRef.current, { autoAlpha: 1, y: 0 })
            return
          }

          gsap.from(contentRef.current, {
            autoAlpha: 0,
            y: 20,
            duration: 0.7,
            scrollTrigger: { trigger: contentRef.current, start: 'top 90%' },
          })

          // Closing touch: the waveform flattens toward baseline as the
          // footer comes fully into view, a visual "signal settling" note
          // to end on. WaveformDivider itself is used unmodified - the
          // scaling happens on a wrapper, not inside the component.
          gsap.to(waveformWrapperRef.current, {
            scaleY: 0.15,
            transformOrigin: 'bottom',
            ease: 'none',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top bottom',
              end: 'top 30%',
              scrub: true,
            },
          })

          const magneticEls = gsap.utils.toArray<HTMLElement>('[data-magnetic]', contentRef.current)
          const cleanups = coarsePointer ? [] : magneticEls.map((el) => applyMagneticHover(el))
          return () => cleanups.forEach((fn) => fn())
        }
      )

      return () => mm.revert()
    },
    { scope: footerRef }
  )

  return (
    <footer ref={footerRef} className="pt-4 pb-8 border-t border-muted/20">
      <div ref={waveformWrapperRef} className="mb-4">
        <WaveformDivider />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-muted text-sm mb-4 md:mb-0">
            © 2024 Umair Nadeem. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/umair-nadeem-qa/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              data-magnetic
              className={`text-muted hover:text-accent transition-colors duration-200 ${focusRing}`}
            >
              <ExternalLink size={20} aria-hidden="true" />
            </a>
            <a
              href="https://www.upwork.com/freelancers/~01862b323ce960e4b6"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Upwork"
              data-magnetic
              className={`text-muted hover:text-accent transition-colors duration-200 ${focusRing}`}
            >
              <ExternalLink size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
