import { content } from '@/lib/content'

// The hero headline (DESIGN.md 11.1), shared by the hero and the Open Graph
// image: the bio's first sentence with a typographic apostrophe (the
// content.ts string itself stays verbatim), split around its one gradient
// accent word. If the bio ever stops containing the word, the headline
// renders as plain text rather than breaking.
export const HEADLINE = content.bio.slice(0, content.bio.indexOf('.') + 1).replace(/'/g, '’')
export const ACCENT_WORD = 'break'
export const HAS_ACCENT = HEADLINE.includes(ACCENT_WORD)

const at = HEADLINE.indexOf(ACCENT_WORD)
export const [BEFORE, AFTER] = HAS_ACCENT ? [HEADLINE.slice(0, at), HEADLINE.slice(at + ACCENT_WORD.length)] : [HEADLINE, '']
