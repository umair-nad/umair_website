import { BriefcaseBusiness, House, ListChecks, Mail, UserRound, type LucideIcon } from 'lucide-react'

// The page's sections in page order, shared by the navbar and the footer:
// Home (the hero, #home; it scrolls to the top like the logo), About,
// Skills, Experience, Contact. The icons are used by the floating mobile
// nav only. `through`: a later section the item stays highlighted for
// (About covers the "More about me" intro after the bento).
export const NAV_ITEMS: { name: string; href: string; icon: LucideIcon; through?: string }[] = [
  { name: 'Home', href: '#home', icon: House },
  { name: 'About', href: '#about', icon: UserRound, through: '#more-about' },
  { name: 'Skills', href: '#skills', icon: ListChecks },
  { name: 'Experience', href: '#experience', icon: BriefcaseBusiness },
  { name: 'Contact', href: '#contact', icon: Mail },
]
