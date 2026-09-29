'use client'

import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { registerGsap, ScrollSmoother } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion-preferences'

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

      return () => smoother.kill()
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
