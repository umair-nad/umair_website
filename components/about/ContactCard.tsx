import { ArrowUpRight, Mail } from 'lucide-react'
import { content } from '@/lib/content'
import CopyEmail from '@/components/hero/CopyEmail'
import { BentoCard, CardLockup, IconChip } from '@/components/about/BentoCard'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

// Contact teaser (DESIGN.md 11.2): the copy-email bar in an inset mono
// panel, plus the LinkedIn and Upwork links. Email is the only direct
// contact method; no phone (CLAUDE.md).
export default function ContactCard({ className = '' }: { className?: string }) {
  return (
    <BentoCard className={className}>
      <IconChip icon={Mail} />

      <div className="my-auto pt-6">
        <div className="flex justify-center rounded-inset border border-line bg-surface-2 p-1">
          <CopyEmail email={content.contact.email} />
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 px-1">
          {content.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex min-h-6 items-center gap-1 rounded-sm font-mono text-sm font-semibold text-fg underline-offset-4 hover:underline ${focusRing}`}
              >
                {link.label}
                <ArrowUpRight
                  size={14}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="text-muted transition-[translate] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <CardLockup title="Contact" />
    </BentoCard>
  )
}
