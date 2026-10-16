'use client'

import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { registerGsap, ScrollSmoother } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion-preferences'
import { navOffset } from '@/lib/scroll'

registerGsap()

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: 1.2,
        effects: true,
      })

      // Arriving from another page at a section ("/#skills"): the browser's
      // own fragment jump can't move the smoother's fixed content, so jump
      // there once the smoother runs. (Under reduced motion there is no
      // smoother and the browser's jump works.)
      const target = window.location.hash.length > 1 ? document.getElementById(window.location.hash.slice(1)) : null
      const frame = target ? requestAnimationFrame(() => smoother.scrollTo(target, false, `top top+=${navOffset()}`)) : 0

      return () => {
        cancelAnimationFrame(frame)
        smoother.kill()
      }
    },
    { scope: wrapperRef }
  )

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
