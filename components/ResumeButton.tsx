import { Download } from 'lucide-react'
import { content } from '@/lib/content'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

// Download resume (DESIGN.md section 6): the secondary pill, shared by the
// hero, "More about me", and the footer. Same height, shape, and Alata
// label as the primary CTA, but outlined instead of filled, so the primary
// still leads. The PDF is content.resume.href in public/.
// `compact`: the Get in Touch sheet's small chip (DESIGN.md 11.9), sized as
// the reference's "Download CV" chip: 28px tall, 8px radius, mono 12px bold,
// in the inverse colors.
export default function ResumeButton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <a
        href={content.resume.href}
        download
        className={`inline-flex h-7 touch-manipulation items-center gap-2 rounded-control bg-inverse px-3 font-mono text-xs font-bold text-inverse-fg transition-opacity hover:opacity-90 ${focusRing}`}
      >
        <Download size={14} strokeWidth={2} aria-hidden="true" />
        Download resume
      </a>
    )
  }

  return (
    <a
      href={content.resume.href}
      download
      className={`group inline-flex h-12 touch-manipulation items-center gap-2.5 rounded-full border border-line-strong px-6 text-base text-fg transition-[color,background-color,border-color] hover:border-fg/40 hover:bg-fg/5 active:scale-[0.98] ${focusRing}`}
    >
      <Download
        size={18}
        strokeWidth={1.75}
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-y-0.5"
      />
      Download resume
    </a>
  )
}
