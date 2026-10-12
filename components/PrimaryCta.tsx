import type { MouseEvent, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

// The primary pill (DESIGN.md section 6), shared by the hero and the
// contact panel. Hover matches the reference (measured 2026-10-12): the
// button itself never moves. A fg-colored fill grows in behind the label
// (scale 0 > 1 from the arrow side), the label inverts, the chip's circle
// turns transparent so the arrow sits inline on the fill, and the arrow
// swaps with a twin sliding in. 300ms, cubic-bezier(0.4, 0, 0.2, 1).
// Hover-only (Tailwind's hover variant needs a hovering pointer); keyboard
// focus keeps the ring.
export default function PrimaryCta({
  href,
  onClick,
  children,
}: {
  href: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  children: ReactNode
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group relative isolate inline-flex h-12 touch-manipulation items-center gap-4 overflow-hidden rounded-full border border-black/10 bg-black/20 py-1 pr-1 pl-6 text-base text-fg backdrop-blur-xs dark:border-white/10 dark:bg-white/10 ${focusRing}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 translate-x-[45%] scale-0 rounded-full bg-fg opacity-0 transition-[translate,scale,opacity] duration-300 ease-in-out group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100"
      />
      <span className="transition-colors duration-300 ease-in-out group-hover:text-bg">{children}</span>
      <span className="relative inline-flex size-9.5 items-center justify-center overflow-hidden rounded-full bg-inverse text-inverse-fg transition-colors duration-300 ease-in-out group-hover:bg-transparent">
        <ArrowRight
          size={18}
          strokeWidth={1.75}
          aria-hidden="true"
          className="transition-[translate,opacity] duration-300 ease-in-out group-hover:translate-x-5 group-hover:opacity-0"
        />
        <ArrowRight
          size={18}
          strokeWidth={1.75}
          aria-hidden="true"
          className="absolute -translate-x-5 opacity-0 transition-[translate,opacity] duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100"
        />
      </span>
    </a>
  )
}
