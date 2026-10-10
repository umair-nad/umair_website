'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, registerGsap } from '@/lib/gsap'

registerGsap()

export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    setEnabled(true)
  }, [])

  useGSAP(
    () => {
      if (!enabled || !dotRef.current) return

      const quickX = gsap.quickTo(dotRef.current, 'x', { duration: 0.4, ease: 'power3' })
      const quickY = gsap.quickTo(dotRef.current, 'y', { duration: 0.4, ease: 'power3' })

      const handleMove = (e: MouseEvent) => {
        quickX(e.clientX)
        quickY(e.clientY)
      }
      // Delegated listeners so elements added by later phases (Skills
      // cards, Contact links, etc.) work without re-wiring this component.
      const handleOver = (e: MouseEvent) => {
        if ((e.target as Element)?.closest?.('[data-magnetic]')) setActive(true)
      }
      const handleOut = (e: MouseEvent) => {
        if ((e.target as Element)?.closest?.('[data-magnetic]')) setActive(false)
      }

      window.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseover', handleOver)
      document.addEventListener('mouseout', handleOut)

      return () => {
        window.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseover', handleOver)
        document.removeEventListener('mouseout', handleOut)
      }
    },
    { scope: dotRef, dependencies: [enabled] }
  )

  if (!enabled) return null

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-90 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-opacity duration-150"
      style={{ opacity: active ? 1 : 0 }}
    />
  )
}
