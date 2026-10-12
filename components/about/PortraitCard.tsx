import Image from 'next/image'
import { content } from '@/lib/content'
import { BentoCard, CardLockup } from '@/components/about/BentoCard'

// Sentences 2 and 3 of the bio, verbatim (sentence 1 is the hero h1).
const firstStop = content.bio.indexOf('.') + 1
const BIO_REST = content.bio.slice(firstStop).trim()

// Portrait / bio (DESIGN.md 11.2): tall card. The headshot is framed as a
// print inside the card so the giant "QA" set behind it shows around its
// edges in both themes (the photo itself has an opaque studio background).
export default function PortraitCard({ className = '' }: { className?: string }) {
  return (
    <BentoCard className={className}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[0.18em] -left-[0.06em] font-display text-[13rem] leading-none text-line md:text-[15rem]"
      >
        QA
      </span>

      <div className="relative mt-16 md:mt-20">
        <Image
          src="/umair-nadeem.jpg"
          alt="Black and white portrait of Umair Nadeem in a dark hoodie, arms crossed, against a plain studio backdrop"
          width={2048}
          height={2048}
          sizes="(min-width: 1024px) 360px, (min-width: 768px) 45vw, 90vw"
          className="aspect-square w-full rounded-inset object-cover ring-1 ring-line"
        />
      </div>

      <CardLockup caption={BIO_REST} title={<span translate="no">{content.name}</span>} />
    </BentoCard>
  )
}
