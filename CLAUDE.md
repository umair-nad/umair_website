# CLAUDE.md

Guidance for Claude Code in this repository. Design source of truth: `DESIGN.md`. History, commit lists, measurements, and past decisions with reasoning: `docs/PROGRESS-LOG.md` (read it only when you need those details).

## Project

Personal portfolio of Umair Nadeem, a QA engineer (Software Quality Assurance). Single-page site, all sections on one route with hash-anchor navigation, on `main`. Hosting plan: Vercel free tier.

- Stack: Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript 5.9, Tailwind CSS 4 (CSS-first: tokens in `@theme` in `app/globals.css`, no `tailwind.config.js`), npm
- Motion: GSAP 3 + @gsap/react (ScrollTrigger, ScrollSmoother, SplitText via `lib/gsap.ts`); cobe 2 for the About globe only; canvas-confetti for the copy-email star burst only (dynamic imports)
- Icons: lucide-react 1.x (no brand icons); simple-icons for the Skills wall. Fonts via next/font: EB Garamond (display), Alata (UI), Source Code Pro (mono)
- Theme: light default, dark via a `dark` class on `<html>`; tokens in `app/globals.css`, logic in `lib/theme.ts`, pre-paint `components/theme/ThemeScript.tsx`

Commands: `npm run dev` (localhost:3000), `npm run build`, `npm start`, `npm run lint` (ESLint 9 flat config; `next build` does not lint, so run it). No test framework: verify UI with the playwright-cli skill.

### Layout of the repo

- `app/` layout.tsx (fonts, all metadata), page.tsx (composes sections), globals.css, icon files, manifest.ts
- `components/` one file per section (Navbar, Hero, About, Skills, Experience, Contact, Footer), shared controls (PrimaryCta, ResumeButton, ProfileLink, WaveformDivider), parts in `hero/`, `about/`, `footer/`, `nav/`, `theme/`, `brand/`, `providers/`
- `lib/` `content.ts` is the typed source of ALL site copy (no CMS); also nav.ts (section list), scroll.ts, motion-preferences.ts, theme.ts, local-time.ts, tool-icons.ts, star-burst.ts, gsap.ts
- `public/` includes `umair-nadeem-cutout.webp` (About portrait), `umair-nadeem-qa-engineer-resume.pdf` (public resume, path `content.resume.href`), `umair-nadeem.jpg` (original headshot, no longer displayed)
- `assets/brand/` non-public logo sources (`un-monogram.svg` is the logo source of truth); never serve from it
- `data/` Umair's LinkedIn export (private; do not confuse with the resume PDF). `refrence/` (sic, one "e" missing; "reference/" means this folder) holds screenshots of dhirajbhawsar.in for inspiration. `review/` holds local review screenshots. All three are gitignored.

## Standing rules

### Git
- Work directly on `main`; no feature branches. One logical change per commit; push `main` after every commit; never batch unrelated changes.
- Before each push run `npm run lint` and `npx tsc --noEmit`, plus `npm run build` when components or config change. Never force-push.
- Git identity is Umair Nadeem <uminadeem06@gmail.com>, already set: do not change git config. Commits carry no Claude co-author line (attribution is off in the uncommitted `.claude/settings.local.json`).
- Never commit anything inside `data/`, `refrence/`, or `review/`. Tag `pre-redesign-main` preserves the old site; leave tag `0.001` alone.
- Once Vercel deploys `main`, every push deploys, so every commit must build. Stop for the user's review after each section.

### Content
- Sources: `data/` (LinkedIn PDF), the public resume, existing site content, and facts the user states in chat. LinkedIn wins conflicts. Never invent projects, metrics, dates, tools, or achievements; if something is missing, stop and ask.
- Tools: exactly the 44 in `content.skills` tool groups (13 from sources, 31 confirmed by the user 2026-10-12; list in the log). Add no other tool without the user's confirmation.
- Smart In Media: only what the user stated or smartinmedia.com shows publicly. Product names "PathoZoom Digital Lab" and "PathoZoom Scan & LiveView", no ® in body text, never internal details or clients.
- No phone number in site text (email is the only direct contact method). The one exception: the downloadable resume PDF may contain it as is.
- The reference site belongs to another developer: match its theme (colors, light/dark, typography); never reuse its logo, text, images, video, or developer-only sections. No blog. No GitHub insights, stats, or contribution widgets. Before adding anything resembling its developer or novelty sections (code case studies with dev-stack chips, "From Concept to Code" CTA, Uses, Guest Book, Bucket List, Links, Spotify), list it and ask first.
- Skills & Tools wall: never draw or invent a logo; add one only if its license and the brand's guidelines allow it in our monochrome style. Robot Framework stays a text tile permanently. License-required credits (Git, Jenkins, Apache JMeter, any future one) stay in the footer's one low-key line.

### Design
- Follow `DESIGN.md` and the taste skill (design-taste-frontend). Avoid generic AI layouts (centered hero with three feature cards, gradient blobs).
- The site is a QA engineer's: present QA and test automation, not a developer profile.
- No em dashes anywhere in site text (or docs). Typographic apostrophes.
- Exactly two marquees are approved (About tools, portrait word rows); ask before any other. The About time zone card has the dot-matrix globe with Islamabad and Cologne markers and no remote-work claim.
- Glow: hero washes and arc are approved for the hero only. Hero glows are rebuilt from our own measurements, no reference code or assets. Static section glows (no motion, blur filter, or grain) exist on the Skills wall and the contact panel (the latter is an open decision). Every other cosmic or ambient effect stays excluded.
- Text selection is disabled site-wide by the user's decision (email, inputs, `data-selectable` stay selectable). Never block copy, cut, the context menu, or shortcuts.
- One contact label site-wide: "Let’s Connect" (`content.contact.cta`).

### Security (details in DESIGN.md section 10)
- CSP: production `script-src` never has `'unsafe-inline'` or `'unsafe-eval'`; every inline script (including the no-flash theme script, a static string) carries the per-request nonce from `proxy.ts`. No new third-party script, style, font, image, or connect origins without updating the CSP and asking.
- `dangerouslySetInnerHTML` only for the static theme script and the JSON-LD block (`JSON.stringify` with `<` escaped to `<`, built only from `lib/content.ts`).
- Every `target="_blank"` link has `rel="noopener noreferrer"`. Production source maps off. No wildcard `Access-Control-Allow-Origin`.
- No secrets in the repo; `.env*` gitignored; only safe `NEXT_PUBLIC_*` in client code.
- No forms, API routes, server actions, uploads, webhooks, or server-side fetches. If any is added, CSRF protection, server-side validation, and rate limiting become required and DESIGN.md 10.7 must be redone first.
- Ask before any major dependency upgrade.

### SEO
- Unique title and description per page, Open Graph tags, semantic HTML, exactly one h1, alt text on every image.
- Every absolute URL (metadataBase, canonical, sitemap, robots, JSON-LD, OG) comes from `SITE_URL` in `lib/site-url.ts` (reads `NEXT_PUBLIC_SITE_URL`, fallback `http://localhost:3000`; file not created yet). Never hard-code or invent a domain.

### Deployment
- Vercel free tier first, no domain yet. Node 20.9+ (`engines` set; use 22.x). After the first deploy set `NEXT_PUBLIC_SITE_URL` (Production) to the deployment URL and redeploy (inlined at build time); update it again if a custom domain is added.

### Workflow
- Work directly in the session; no workflows or multi-agent runs unless the user explicitly asks (saves usage).
- Small steps; stop for review after each section. Test at 390 and 1440 (and 768, 1024 for QA) in both themes with playwright-cli on the production build.
- At the end of every working session update **Status**, **Open decisions**, and **Next steps** below (and add detail to `docs/PROGRESS-LOG.md`) as its own commit: fresh sessions cannot see the chat.

### Motion contract (the gotchas that cost time)
- Every `gsap.matchMedia` conditions object includes `always: ALWAYS_QUERY` (`lib/motion-preferences.ts`) or its callback never runs on a normal desktop; every section ships a static reduced-motion state.
- Reveals: `[data-reveal]` + `gsap.set` first, then `fromTo` with explicit end values (a plain `from()` captures the hidden CSS state). Grids use `ScrollTrigger.batch` (see About).
- Hover lifts use the CSS `translate`/`scale` properties so they compose with GSAP's `transform`. Never use a scaled element as its own ScrollTrigger trigger.
- ScrollSmoother distorts element screenshots and disables `position: sticky`; the navbar sits outside its provider.

## Status (2026-10-12, end of session)

- Last commit before this docs commit: `08164ba`.
- **Every section is rebuilt on the redesign; nothing pre-redesign remains.** Single-page site, nav order Home, About, Skills, Experience, Contact, with a floating mobile nav on phones.
  - Hero: serif headline with the gradient accent word, typing subline, horizon arc and washes, "Let’s Connect", resume download, copy-email with star burst.
  - About bento: role, specializations, cut-out portrait with scrolling words, rotating time zone globe, contact, tools marquee.
  - Skills & Tools wall: 44 confirmed tools, Simple Icons logos or text tiles where no licensed logo exists.
  - Experience timeline: three roles and education, scroll-drawn spine, testing types and practices.
  - Contact panel and Footer with the logo credits and the settling waveform.
- Reviewed and approved by the user: Experience, Skills, About cut-out. Contact and Footer are built and awaiting the user's review.
- Not built yet: SEO pass (`lib/site-url.ts`, canonical, OG image, sitemap, robots, JSON-LD) and security hardening (`proxy.ts` CSP, headers, audit). No Vercel deploy yet.
- Housekeeping: the README is stale (Next 14, Three.js, a contact form, an old email); rewrite in its own commit when the user wants. `npm audit` shows 5 high findings in the `eslint-config-next` dev chain only.

## Open decisions (ask the user first next session)

1. **Contact panel cyan glow:** keep or remove (one `aria-hidden` layer in `components/Contact.tsx`; DESIGN.md 11.5).
2. **Footer role sentence:** keep the long `content.seo.description` sentence (three lines on desktop) or use "QA Engineer | Islamabad, Pakistan" (`content.title` and `content.location`).
3. **Updated resume:** the current PDF has the old email and the phone number; replace `public/umair-nadeem-qa-engineer-resume.pdf` when Umair sends a new one.
4. **Still waiting on Umair:** projects or case studies worth showcasing; certifications; whether he tested AI modules (the "AI & LLM Testing" chip rests on his LinkedIn headline alone); which automation tools he uses at Smart In Media.
5. Smaller: re-encode the 2.1 MB `umair-nadeem.jpg` (about quality 80; it is no longer displayed, only needed for JSON-LD or OG), and what the "1 Issue" dev overlay showed if it comes back (a browser-extension hydration attribute was fixed on `<body>`).

## Next steps, in order

1. The user reviews Contact and the Footer and settles open decisions 1 to 3. Stop there; ask before building.
2. SEO pass (DESIGN.md section 9 and build step 7): metadata, canonical via `NEXT_PUBLIC_SITE_URL`, OG image, sitemap, robots, JSON-LD `Person`, one h1.
3. Security hardening (DESIGN.md section 10 and build step 8): CSP with nonce in `proxy.ts`, static headers, dependency audit, source maps off, `rel` audit.
4. Final full-page QA at 390, 768, 1024, 1440 in both themes; Lighthouse on mobile and desktop.
5. First free Vercel deploy, then set `NEXT_PUBLIC_SITE_URL` and redeploy.
