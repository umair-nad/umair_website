'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, registerGsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion-preferences'

registerGsap()

const SESSION_KEY = 'preloader-shown'
// Hard cap, deliberately independent of the GSAP timeline below: if the
// animation throws, hangs, or never fires onComplete for any reason,
// this plain setTimeout still forces the overlay away.
const FAILSAFE_MS = 1800

const PATH_D = 'M0 20 Q20 0 40 20 T80 20 T120 20 T160 20'

export default function Preloader() {
  const [shouldRender, setShouldRender] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [label, setLabel] = useState('ACQUIRING SIGNAL')
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (prefersReducedMotion()) return
    if (window.sessionStorage.getItem(SESSION_KEY)) return
    setShouldRender(true)
  }, [])

  useEffect(() => {
    if (hidden && typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    }
  }, [hidden])

  // Failsafe effect: no dependency on the animation succeeding.
  useEffect(() => {
    if (!shouldRender) return
    const failsafe = window.setTimeout(() => setHidden(true), FAILSAFE_MS)
    return () => window.clearTimeout(failsafe)
  }, [shouldRender])

  useGSAP(
    () => {
      if (!shouldRender || !pathRef.current) return

      try {
        const length = pathRef.current.getTotalLength()
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length })

        const tl = gsap.timeline({ onComplete: () => setHidden(true) })
        tl.to(pathRef.current, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' })
          .call(() => setLabel('CALIBRATING'))
          .to({}, { duration: 0.25 })
          .call(() => setLabel('READY'))
          .to(containerRef.current, { autoAlpha: 0, duration: 0.3 }, '+=0.1')

        return () => {
          tl.kill()
        }
      } catch {
        // Synchronous setup failure - hide immediately rather than
        // waiting for the failsafe timeout.
        setHidden(true)
      }
    },
    { scope: containerRef, dependencies: [shouldRender] }
  )

  if (!shouldRender || hidden) return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      role="presentation"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-bg"
    >
      <svg width="160" height="40" viewBox="0 0 160 40" fill="none">
        <path ref={pathRef} d={PATH_D} stroke="rgb(var(--accent))" strokeWidth="2" />
      </svg>
      <p className="font-mono text-xs tracking-widest text-muted">{label}</p>
    </div>
  )
}
