'use client'

import RoleCard from '@/components/about/RoleCard'
import SpecializationsCard from '@/components/about/SpecializationsCard'
import PortraitCard from '@/components/about/PortraitCard'

// About bento (DESIGN.md 11.2). Six cards, six real content items, filling
// a 3-column grid exactly (no empty cells):
//
//   lg (3 cols, 22rem rows)       md (2 cols)         base (1 col)
//   [ role 2x1      ][ portr ]    [ role 2x1     ]    role
//   [ specs ][ contact][ 1x2  ]   [ specs ][ port ]   specializations
//   [ time  ][ tools 2x1     ]    [ tools ][ 1x2  ]   portrait
//                                 [ time  ][ cont ]   tools
//                                                     time zone
//                                                     contact
//
// DOM order is the mobile content-priority order (DESIGN.md section 8);
// the lg placement is explicit per card below.
const PLACEMENT = {
  role: 'md:col-span-2 lg:col-start-1 lg:row-start-1',
  specializations: 'lg:col-start-1 lg:row-start-2',
  portrait: 'md:row-span-2 lg:col-start-3 lg:row-start-1',
} as const

export default function AboutBento() {
  return (
    <section id="about" aria-labelledby="about-heading" className="px-4 py-28 md:px-8 md:py-40">
      <h2 id="about-heading" className="sr-only">
        About
      </h2>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[minmax(20rem,auto)] md:grid-cols-2 lg:auto-rows-88 lg:grid-cols-3">
        <RoleCard className={PLACEMENT.role} />
        <SpecializationsCard className={PLACEMENT.specializations} />
        <PortraitCard className={PLACEMENT.portrait} />
      </div>
    </section>
  )
}
