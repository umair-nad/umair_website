import { Check, ListChecks } from 'lucide-react'
import { content } from '@/lib/content'
import { BentoCard, CardLockup, IconChip } from '@/components/about/BentoCard'

// QA specializations (DESIGN.md 11.2): a check-glyph list, accent checks.
export default function SpecializationsCard({ className = '' }: { className?: string }) {
  return (
    <BentoCard className={className}>
      <IconChip icon={ListChecks} />

      <ul className="mt-6 space-y-3" aria-labelledby="specializations-title">
        {content.specializations.map((item) => (
          <li key={item} className="flex items-center gap-3 font-sans text-[17px] leading-6 text-fg">
            <Check size={16} strokeWidth={2} aria-hidden="true" className="shrink-0 text-accent" />
            {item}
          </li>
        ))}
      </ul>

      <CardLockup id="specializations-title" title="Specializations" />
    </BentoCard>
  )
}
