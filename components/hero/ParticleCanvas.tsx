'use client'

import { useEffect, useRef, useState } from 'react'
import { ParticleField, type ParticleTier } from '@/lib/three/particle-field'
import { prefersReducedMotion } from '@/lib/motion-preferences'

function detectTier(): ParticleTier {
  const smallViewport = window.innerWidth < 768
  const lowCores =
    typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  return smallViewport || lowCores || coarsePointer ? 'reduced' : 'standard'
}

export default function ParticleCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let field: ParticleField
    try {
      field = new ParticleField(canvas, container.clientWidth, container.clientHeight, {
        tier: detectTier(),
        reducedMotion: prefersReducedMotion(),
      })
    } catch {
      // Covers WebGL context-creation failure (Three throws, or our own
      // defensive getContext() check throws) - render nothing rather
      // than crash the Hero.
      setFailed(true)
      return
    }

    field.mount()

    const handleResize = () => field.resize(container.clientWidth, container.clientHeight)
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
      field.onMouseMove(nx, ny)
    }
    window.addEventListener('mousemove', handleMouseMove)

    const handleVisibility = () => {
      if (document.hidden) field.pause()
      else field.resume()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !document.hidden) field.resume()
        else field.pause()
      },
      { threshold: 0 }
    )
    intersectionObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibility)
      field.destroy()
    }
  }, [])

  if (failed) return null

  return (
    <div ref={containerRef} aria-hidden="true" className="pointer-events-none h-full w-full">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
