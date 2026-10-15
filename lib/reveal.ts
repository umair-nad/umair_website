import { gsap, ScrollTrigger } from '@/lib/gsap'

// Scroll reveal shared by About, Skills, Experience, and Contact: each
// [data-reveal] element rises in once as it scrolls in (ScrollTrigger.batch,
// fromTo with explicit end values; see CLAUDE.md, Motion contract).
//
// Until it is revealed, an element is transparent and ignores pointers, so
// mouse and touch behave exactly as they did with visibility: hidden. It is
// not visibility: hidden, though, so it stays in the tab order (and the
// accessibility tree). When keyboard focus lands anywhere in the section,
// everything still pending there is shown at once, and the scroll batch
// later skips it. Call inside a gsap.matchMedia callback and return the
// result, so the focus listener is removed on revert.

interface RevealOptions {
  y: number
  start: string
  duration: number
  stagger: number
}

export function scrollReveal(root: HTMLElement, elements: HTMLElement[], { y, start, duration, stagger }: RevealOptions) {
  const pending = new Set(elements)
  const from = { opacity: 0, y }

  // Hand pointers back as soon as an element starts to reveal (autoAlpha
  // made it clickable at the same moment).
  const release = (els: Element[]) => {
    els.forEach((el) => pending.delete(el as HTMLElement))
    gsap.set(els, { clearProps: 'pointerEvents' })
  }

  // visibility: undo the pre-paint hiding (globals.css [data-reveal]).
  gsap.set(elements, { ...from, pointerEvents: 'none', visibility: 'visible' })
  ScrollTrigger.batch(elements, {
    start,
    once: true,
    onEnter: (batch) => {
      const fresh = batch.filter((el) => pending.has(el as HTMLElement))
      if (!fresh.length) return
      release(fresh)
      gsap.fromTo(fresh, from, { opacity: 1, y: 0, duration, ease: 'expo.out', stagger, overwrite: true })
    },
  })

  const onFocusIn = (event: FocusEvent) => {
    if (!pending.size || !(event.target instanceof Element) || !event.target.matches(':focus-visible')) return
    const rest = Array.from(pending)
    release(rest)
    gsap.set(rest, { opacity: 1, y: 0, overwrite: true })
  }
  root.addEventListener('focusin', onFocusIn)
  return () => root.removeEventListener('focusin', onFocusIn)
}
