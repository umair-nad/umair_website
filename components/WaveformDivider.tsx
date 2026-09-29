'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/motion-preferences'

registerGsap()

const PATH_D = 'M0 20 Q25 0 50 20 T100 20 T150 20 T200 20 T250 20 T300 20'

const STROKE: Record<'accent' | 'accent2', string> = {
  accent: 'var(--accent)',
  accent2: 'var(--accent-2)',
}

interface WaveformDividerProps {
  colorVar?: 'accent' | 'accent2'
  scrub?: boolean
  className?: string
}

export default function WaveformDivider({
  colorVar = 'accent2',
  scrub = false,
  className = '',
}: WaveformDividerProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useGSAP(
    () => {
      if (!scrub || prefersReducedMotion() || !pathRef.current) return

      const length = pathRef.current.getTotalLength()
      gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length })

      const trigger = ScrollTrigger.create({
        trigger: svgRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(pathRef.current, { strokeDashoffset: length * (1 - self.progress) })
        },
      })

      return () => trigger.kill()
    },
    { scope: svgRef, dependencies: [scrub] }
  )

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 300 40"
      preserveAspectRatio="none"
      className={`h-10 w-full ${className}`}
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d={PATH_D}
        fill="none"
        stroke={`rgb(${STROKE[colorVar]})`}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
