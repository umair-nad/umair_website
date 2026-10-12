import { ArrowUpRight } from 'lucide-react'
import type { SiteLink } from '@/lib/content'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

// An external profile link (LinkedIn, Upwork from content.links): opens in
// a new tab with rel="noopener noreferrer" (CLAUDE.md), says so to screen
// readers, and keeps the brand name untranslated. `className` sets the
// type and color for each place it appears.
export default function ProfileLink({ link, className = '' }: { link: SiteLink; className?: string }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex min-h-6 items-center gap-1 underline-offset-4 ${focusRing} ${className}`}
    >
      <span translate="no">{link.label}</span>
      <ArrowUpRight
        size={14}
        strokeWidth={1.75}
        aria-hidden="true"
        className="opacity-60 transition-[translate] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
