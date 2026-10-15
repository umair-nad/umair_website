import { content } from '@/lib/content'
import { SITE_URL } from '@/lib/site-url'

// JSON-LD Person (DESIGN.md section 9). Every field comes from
// lib/content.ts (absolute URLs from SITE_URL); never a telephone.
// A data block (application/ld+json, never executed). JSON.stringify
// escapes quotes and backslashes, and every "<" becomes <, so no
// string can close the <script> element early (CLAUDE.md, Security).

const [locality, country] = content.location.split(',').map((part) => part.trim())
const currentRole = content.experience.find((role) => role.end === 'Present')
const testingTypes = content.skills.find((group) => group.id === 'testing-types')

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: content.name,
  jobTitle: content.title,
  description: content.seo.description,
  url: SITE_URL,
  image: `${SITE_URL}${content.seo.image}`,
  email: `mailto:${content.contact.email}`,
  address: { '@type': 'PostalAddress', addressLocality: locality, addressCountry: country },
  ...(currentRole && { worksFor: { '@type': 'Organization', name: currentRole.company } }),
  alumniOf: content.education.map((entry) => ({ '@type': 'CollegeOrUniversity', name: entry.school })),
  knowsLanguage: content.spokenLanguages,
  ...(testingTypes && { knowsAbout: testingTypes.items }),
  sameAs: content.links.map((link) => link.href),
}

const JSON_LD = JSON.stringify(person).replace(/</g, '\\u003c')

export default function PersonJsonLd() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
}
