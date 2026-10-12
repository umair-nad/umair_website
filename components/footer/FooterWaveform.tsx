'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, registerGsap } from '@/lib/gsap'
import { ALWAYS_QUERY, REDUCED_MOTION_QUERY } from '@/lib/motion-preferences'
import WaveformDivider from '@/components/WaveformDivider'

registerGsap()

// The sign-off beat (DESIGN.md 11.6): the waveform settles toward a flat
// line as the page reaches its end, the signal at rest. Scrubbed from the
// moment it enters the viewport to the bottom of the page; the outer div
// is the trigger, so the scaling never changes what is measured. Under
// reduced motion it shows its final, settled state.
const SETTLED = 0.15

export default function FooterWaveform() {
  const rootRef = useRef<HTMLDivElement>(null)
  const waveRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ always: ALWAYS_QUERY, reduceMotion: REDUCED_MOTION_QUERY }, (ctx) => {
        const { reduceMotion } = ctx.conditions as { reduceMotion: boolean }
        if (reduceMotion) {
          gsap.set(waveRef.current, { scaleY: SETTLED })
          return
        }
        gsap.fromTo(
          waveRef.current,
          { scaleY: 1 },
          {
            scaleY: SETTLED,
            ease: 'none',
            scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'max', scrub: true },
          }
        )
      })

      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} aria-hidden="true">
      <div ref={waveRef}>
        <WaveformDivider />
      </div>
    </div>
  )
}
