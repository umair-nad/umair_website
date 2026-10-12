import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

// Bento card (DESIGN.md section 6, measured on the reference): surface fill,
// 1px card border, 10px radius, light-mode shadow, 8px backdrop blur. Hover
// lifts 2px with the `translate` property, which composes with the
// `transform` GSAP writes for the entrance reveal instead of fighting it.
export function BentoCard({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-card border border-line-card bg-surface p-6 shadow-lg shadow-black/5 backdrop-blur-sm transition-[translate,border-color] duration-300 hover:-translate-y-0.5 hover:border-line-strong md:p-7 dark:shadow-none ${className}`}
    >
      {children}
    </div>
  )
}

// Caption lockup, anchored bottom-left (DESIGN.md section 4): mono caption
// in `text` on top, Alata title in `fg` below.
export function CardLockup({ title, caption, id }: { title: ReactNode; caption?: ReactNode; id?: string }) {
  return (
    <div className="mt-auto pt-6">
      {caption && <p className="max-w-[48ch] font-mono text-sm leading-relaxed text-text">{caption}</p>}
      <h3 id={id} className={`font-sans text-lg leading-7 tracking-wide text-fg ${caption ? 'mt-2' : ''}`}>
        {title}
      </h3>
    </div>
  )
}

// Small inset glyph tile in a card's top-left corner. Decorative.
export function IconChip({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-card border border-line bg-surface-2 text-fg"
    >
      <Icon size={18} strokeWidth={1.75} />
    </span>
  )
}

// Text-only chip (DESIGN.md section 6: no icons on tool or skill chips).
export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface-2 px-3 py-1 font-mono text-[13px] whitespace-nowrap text-fg">
      {children}
    </span>
  )
}
