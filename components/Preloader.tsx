'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, registerGsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion-preferences'

registerGsap()

// Must match the key used by the beforeInteractive script in
// app/layout.tsx, which already decided pixel-level visibility before
// this component ever mounts. This effect only decides whether to run
// the JS entrance animation, and eventually stops rendering the
// overlay - it is not responsible for preventing the initial flash.
const SESSION_KEY = 'preloader-shown'
const FAILSAFE_MS = 1800 // JS-driven failsafe, independent of the GSAP timeline

const PATH_D = 'M0 20 Q20 0 40 20 T80 20 T120 20 T160 20'

export default function Preloader() {
  const [animate, setAnimate] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [label, setLabel] = useState('ACQUIRING SIGNAL')
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const skip = prefersReducedMotion() || Boolean(window.sessionStorage.getItem(SESSION_KEY))
      if (skip) {
        setHidden(true)
      } else {
        setAnimate(true)
      }
    } catch {
      // sessionStorage/matchMedia unavailable or throwing (privacy
      // mode, etc.) - fail toward removing the overlay, never toward
      // leaving it stuck with neither state ever set.
      setHidden(true)
    }
  }, [])

  useEffect(() => {
    if (!hidden || typeof window === 'undefined') return
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // Non-critical: worst case the "signal acquiring" sequence
      // replays next visit.
    }
  }, [hidden])

  // JS-driven failsafe: independent of the GSAP timeline succeeding.
  useEffect(() => {
    if (!animate) return
    const failsafe = window.setTimeout(() => setHidden(true), FAILSAFE_MS)
    return () => window.clearTimeout(failsafe)
  }, [animate])

  useGSAP(
    () => {
      if (!animate || !pathRef.current) return

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
        setHidden(true)
      }
    },
    { scope: containerRef, dependencies: [animate] }
  )

  if (hidden) return null

  return (
    <>
      <div
        ref={containerRef}
        id="preloader-overlay"
        aria-hidden="true"
        role="presentation"
        className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-4 bg-bg"
      >
        <svg width="160" height="40" viewBox="0 0 160 40" fill="none">
          <path ref={pathRef} d={PATH_D} stroke="rgb(var(--accent))" strokeWidth="2" />
        </svg>
        <p className="font-mono text-xs tracking-widest text-muted">{label}</p>
      </div>
      <noscript>
        <style>{'#preloader-overlay { display: none !important; }'}</style>
      </noscript>
    </>
  )
}
