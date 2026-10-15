# Umair Nadeem | QA Engineer

Personal portfolio of Umair Nadeem, a Software Quality Assurance Engineer. It's a single page (Home, About, Skills, Experience, Contact) with hash-anchor navigation, light and dark themes, and GSAP motion that falls back to a static layout under reduced motion.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack), React 19, TypeScript 5.9
- Tailwind CSS 4, CSS-first: design tokens live in `@theme` in `app/globals.css` (no `tailwind.config.js`)
- GSAP 3 with `@gsap/react` (ScrollTrigger, ScrollSmoother, SplitText)
- cobe (the About time zone globe), canvas-confetti (the copy-email star burst)
- lucide-react icons, Simple Icons logos on the Skills & Tools wall
- Fonts via `next/font`: EB Garamond, Alata, Source Code Pro

## Getting started

Requires Node.js 20.9 or newer (22.x recommended) and npm.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (`next build` does not lint) |
| `npx tsc --noEmit` | Type check |

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The site's absolute origin, e.g. `https://example.vercel.app`. Every absolute URL (canonical, Open Graph, sitemap, robots, JSON-LD) is built from it in `lib/site-url.ts`. Falls back to `http://localhost:3000` for development; a production build without it logs a warning. It is inlined at build time, so changing it needs a redeploy. |

## Project layout

```
app/          layout (fonts, metadata), page, globals.css, icons, manifest,
              opengraph-image, twitter-image, sitemap, robots
components/   one file per section (Navbar, Hero, About, Skills, Experience,
              Contact, Footer), shared controls, and their parts in subfolders
lib/          content.ts (all site copy), site-url.ts, theme, scroll, motion,
              and GSAP helpers
public/       portrait cut-out, headshot (JSON-LD), resume PDF, Android icons
assets/       non-public sources: the monogram (brand/) and the Open Graph
              image fonts (fonts/, with their OFL licenses)
```

All copy comes from `lib/content.ts`; edit it there, not in the components. Design decisions are recorded in `DESIGN.md`.

## Notes

- The site is static: no forms, API routes, server actions, or cookies. Email is the only direct contact method, and there is no contact form.
- SEO: per-page title and description, canonical URL, Open Graph and Twitter cards with a generated 1200x630 image, `sitemap.xml`, `robots.txt`, and a JSON-LD `Person`.
- Deployment target: Vercel. After the first deploy, set `NEXT_PUBLIC_SITE_URL` for Production and redeploy.

## Credits

Tool logos via [Simple Icons](https://simpleicons.org/); all marks belong to their owners. Git logo by Jason Long, CC BY 3.0. Jenkins logo, CC BY-SA 3.0. Apache JMeter logo, Apache License 2.0. EB Garamond and Source Code Pro are licensed under the SIL Open Font License 1.1.
