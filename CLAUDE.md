# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

Personal portfolio of Umair Nadeem, a Software Quality Assurance (SQA) engineer. Currently a single-page site (all sections on one route with hash-anchor navigation), being rebuilt on the `redesign` branch.

- Framework: Next.js 14 (App Router), React 18, TypeScript 5
- Styling: Tailwind CSS 3 plus `app/globals.css`
- Animation: GSAP 3 with @gsap/react (ScrollTrigger, ScrollSmoother, SplitText; registered in `lib/gsap.ts`)
- 3D: Three.js, lazy-loaded and isolated to the Hero particle canvas
- Icons: lucide-react. Fonts: Bricolage Grotesque and JetBrains Mono (Google), Satoshi (local in `app/fonts/`)
- Package manager: npm

### Commands

- `npm run dev` - dev server at http://localhost:3000
- `npm run build` - production build
- `npm start` - serve the production build
- `npm run lint` - ESLint via next lint

There is no test framework configured; UI verification is done with the playwright-cli skill (see Workflow below).

### Repo layout

- `app/` - layout.tsx (fonts and all site metadata), page.tsx (composes the sections), globals.css
- `components/` - one file per section (Navbar, Hero, About, Experience, Skills, Contact, Footer) plus chrome (Preloader, Cursor, AmbientBackground, WaveformDivider, hero/ParticleCanvas, providers/SmoothScrollProvider)
- `lib/` - support code only: gsap.ts, magnetic.ts, motion-preferences.ts, three/particle-field.ts
- `public/` - static assets (headshot)
- `data/` - Umair's LinkedIn export (Profile.pdf). Gitignored. Content source only.
- `refrence/` - spelled without the second "e" on disk; when the user writes "reference/", this folder is what they mean. Screenshots of a developer portfolio (dhirajbhawsar.in) used for design inspiration only. Gitignored.
- `UmairNadeem_SQA.pdf` at the repo root is the public resume and is already tracked in git history. Do not confuse it with the private LinkedIn PDF in `data/`.

All user-visible copy is hardcoded in component JSX or local const arrays. There is no CMS or content file.

## Project rules

### Identity
- This is Umair Nadeem's portfolio. Umair is a QA engineer, so the site must present QA and test automation work, not a software developer profile.

### Git
- Work only on the branch `redesign`. Never touch `main`.
- Never commit anything inside `data/` or `refrence/`. Both are gitignored; `data/` contains personal information.

### Content
- Content sources are `data/` (LinkedIn PDF) and the existing site content. Never invent projects, metrics, dates, tools, or achievements. If something is missing or the sources conflict, stop and ask the user.
- The reference site in `refrence/` belongs to a developer (Dhiraj Bhawsar). Use it only for design inspiration: layout, typography, spacing, animation. Never copy its content or its section structure.
- Do NOT include a blog page or blog section.
- Do NOT include GitHub insights, contribution graphs, GitHub stats, or repo activity widgets.
- The reference site also contains these developer-specific or novelty sections: code-centric case studies with dev-stack chips, a developer Skills and Tools icon wall, a "From Concept to Code" CTA, a developer-framed experience timeline, a Uses page, a Guest Book, a Bucket List, a Links page, and a Spotify integration. Before adding anything similar, list what is being considered and ask the user first.

### Design
- Follow DESIGN.md (once it exists) and the taste-skill (design-taste-frontend). Avoid generic AI layouts such as a centered hero with three feature cards and gradient blobs.
- Do not use em dashes in any text content on the site.

### SEO (required on every page)
- Unique title and meta description per page, Open Graph tags, semantic HTML, exactly one h1 per page, and alt text on every image.
- Today all metadata lives in the static export in `app/layout.tsx`.

### Workflow
- Work in small steps, one section at a time, and stop for the user's review after each section.
- After major UI changes, test with the playwright-cli skill at mobile and desktop widths.

## Redesign TODO

Items confirmed with the user on 2026-10-04, to handle during the redesign:

- Headshot file is `public/muhammad.jpg`: rename it during the redesign and update the `src` in `components/Hero.tsx`.
- Footer year is hardcoded as "© 2024" in `components/Footer.tsx`: fix it while rebuilding the footer.
- The resume `UmairNadeem_SQA.pdf` stays public and tracked at the repo root. If a "Download resume" button is added, move the PDF into `public/` so Next.js can serve it, and tell the user before moving it.
