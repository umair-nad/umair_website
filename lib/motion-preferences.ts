export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
export const COARSE_POINTER_QUERY = '(pointer: coarse)'

/**
 * A media query that always matches. GSAP's matchMedia only runs a
 * conditions-object callback while AT LEAST ONE condition matches, so
 * `{ reduceMotion, coarsePointer }` alone never runs on a plain desktop
 * (neither matches). Include `always: ALWAYS_QUERY` in every conditions
 * object whose conditions can all be false at once.
 */
export const ALWAYS_QUERY = 'all'

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

/**
 * Standard responsive / reduced-motion branching used by every later phase:
 *
 *   import { useGSAP } from '@gsap/react'
 *   import { gsap } from '@/lib/gsap'
 *   import { REDUCED_MOTION_QUERY } from '@/lib/motion-preferences'
 *
 *   useGSAP(() => {
 *     const mm = gsap.matchMedia()
 *
 *     // isDesktop/isMobile are complementary, so one always matches. If your
 *     // conditions can all be false, add `always: ALWAYS_QUERY` (see above).
 *     mm.add(
 *       {
 *         isDesktop: '(min-width: 1024px)',
 *         isMobile: '(max-width: 1023px)',
 *         reduceMotion: REDUCED_MOTION_QUERY,
 *       },
 *       (context) => {
 *         const { isDesktop, reduceMotion } = context.conditions as {
 *           isDesktop: boolean
 *           reduceMotion: boolean
 *         }
 *         if (reduceMotion) {
 *           // fully static variant, no ScrollTrigger/pin/scrub
 *           return
 *         }
 *         if (isDesktop) {
 *           // full choreography
 *         } else {
 *           // simplified mobile/tablet variant
 *         }
 *       }
 *     )
 *
 *     return () => mm.revert()
 *   }, { scope: containerRef })
 */
