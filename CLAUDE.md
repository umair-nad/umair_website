# CLAUDE.md

Guidance for Claude Code in this repository. Design source of truth: `DESIGN.md`. History, commit lists, measurements, and past decisions with reasoning: `docs/PROGRESS-LOG.md` (read it only when you need those details).

## Project

Personal portfolio of Umair Nadeem, a QA engineer (Software Quality Assurance). Single-page site, all sections on one route with hash-anchor navigation, plus `/book-a-call` (Cal.com booking calendar) and a minimal noindex `/credits` page for the logo credits, on `main`. Live on Vercel (free tier): https://umair-nadeem.vercel.app.

- Stack: Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript 5.9, Tailwind CSS 4 (CSS-first: tokens in `@theme` in `app/globals.css`, no `tailwind.config.js`), npm
- Motion: GSAP 3 + @gsap/react (ScrollTrigger, ScrollSmoother, SplitText via `lib/gsap.ts`); cobe 2 for the About globe only; canvas-confetti for the copy-email star burst only (dynamic imports)
- Icons: lucide-react 1.x (no brand icons); simple-icons for the Skills wall. Fonts via next/font: EB Garamond (display), Alata (UI), Source Code Pro (mono)
- Theme: light default, dark via a `dark` class on `<html>`; tokens in `app/globals.css`, logic in `lib/theme.ts`, pre-paint `components/theme/ThemeScript.tsx`

Commands: `npm run dev` (localhost:3000), `npm run build`, `npm start`, `npm run lint` (ESLint 9 flat config; `next build` does not lint, so run it). No test framework: verify UI with the playwright-cli skill.

### Layout of the repo

- `app/` layout.tsx (fonts, all metadata), page.tsx (composes sections, renders the JSON-LD), globals.css, icon files, manifest.ts, opengraph-image.tsx (twitter-image.tsx re-exports it), sitemap.ts, robots.ts, `book-a-call/` and `credits/` (each with its own metadata and OG and Twitter image re-exports)
- `components/` one file per section (Navbar, Hero, About, MoreAbout, Skills, Experience, Contact, Footer), shared controls (PrimaryCta, ResumeButton, ProfileLink, WaveformDivider), PersonJsonLd, SkipLink, parts in `book/` (MoonAtmosphere, CalEmbed), `contact/` (ContactSheet, the Get in Touch dialog), `hero/`, `about/`, `footer/`, `nav/`, `theme/`, `brand/`, `providers/`
- `lib/` `content.ts` is the typed source of ALL site copy (no CMS); also site-url.ts (`SITE_URL`), hero-headline.ts (shared by the hero and the OG image), nav.ts (section list), scroll.ts, motion-preferences.ts, theme.ts, local-time.ts, tool-icons.ts, star-burst.ts, gsap.ts, contact-sheet.ts (opens the Get in Touch sheet from any trigger), use-copy-email.ts (shared copy + star burst)
- `public/` includes `umair-nadeem-cutout.webp` (About portrait), `umair-nadeem-qa-engineer-resume.pdf` (public resume, path `content.resume.href`), `umair-nadeem.jpg` (800px headshot: the JSON-LD image, `content.seo.image`, and the "More about me" photo)
- `assets/` non-public, never serve from it: `brand/` logo sources (`un-monogram.svg` is the logo source of truth), `fonts/` static TTFs for the OG image with their OFL licenses, `textures/moon-surface.svg` (our own noise texture source; `node scripts/moon-texture.mjs` renders it to `public/textures/moon-surface.webp` for the /book-a-call header)
- `data/` Umair's LinkedIn export (private; do not confuse with the resume PDF) and, since 2026-10-15, the original logo raster `un-monogram-original.png` (kept locally only, not in the repo). `refrence/` (sic, one "e" missing; "reference/" means this folder) holds screenshots of dhirajbhawsar.in for inspiration. `review/` holds local review screenshots. All three are gitignored.

## Standing rules

### Git
- Work directly on `main`; no feature branches. One logical change per commit; push `main` after every commit; never batch unrelated changes.
- Before each push run `npm run lint` and `npx tsc --noEmit`, plus `npm run build` when components or config change. Never force-push.
- Git identity is Umair Nadeem <uminadeem06@gmail.com>, already set: do not change git config. Commits carry no Claude co-author line (attribution is off in the uncommitted `.claude/settings.local.json`).
- Never commit anything inside `data/`, `refrence/`, or `review/`. Tag `pre-redesign-main` preserves the old site; leave tag `0.001` alone.
- **Every push to `main` deploys to production automatically**, so push only reviewed work and every commit must build. Stop for the user's review after each section.

### Content
- Sources: `data/` (LinkedIn PDF), the public resume, existing site content, and facts the user states in chat. LinkedIn wins conflicts. Never invent projects, metrics, dates, tools, or achievements; if something is missing, stop and ask.
- Tools: exactly the 44 in `content.skills` tool groups (13 from sources, 31 confirmed by the user 2026-10-12; list in the log). Add no other tool without the user's confirmation.
- Smart In Media: only what the user stated or smartinmedia.com shows publicly. Product names "PathoZoom Digital Lab" and "PathoZoom Scan & LiveView", no ® in body text, never internal details or clients.
- No phone number in site text (email is the only direct contact method). The one exception: the downloadable resume PDF may contain it as is.
- The reference site belongs to another developer: match its theme (colors, light/dark, typography); never reuse its logo, text, images, video, or developer-only sections. No blog. No GitHub insights, stats, or contribution widgets. Before adding anything resembling its developer or novelty sections (code case studies with dev-stack chips, "From Concept to Code" CTA, Uses, Guest Book, Bucket List, Links, Spotify), list it and ask first. Exception by the user's explicit choice (2026-10-16): the Book a Call wording follows the reference: "CONTACT" and "Let’s Get In Touch" on /book-a-call, and "Get in Touch", "Pick a way to connect", "Book a Call", "30-min video chat", "Email Me", and "Also find me on" in the sheet.
- Skills & Tools wall: logo tiles only (user decision 2026-10-16); a tool without a usable logo is a text chip in the About tools marquee (`content.featuredTools`), so all 44 tools stay on the page. Never draw or invent a logo, and no generic or parent-company stand-ins; add one only if its license and the brand's guidelines allow it in our monochrome style. Robot Framework uses the Foundation's own white mark, unaltered (Visual Identity License 2.0, re-checked 2026-10-16; its guidelines allow only black or white). License-required credits (Git, Jenkins, Apache JMeter, Robot Framework's notice, any future one) live on the `/credits` page (copy in `content.credits`, wording as each owner asks), linked by the small "Credits" link in the footer's bottom line (user decision 2026-10-16); never on the home page itself.

### Design
- Follow `DESIGN.md` and the taste skill (design-taste-frontend). Avoid generic AI layouts (centered hero with three feature cards, gradient blobs).
- The site is a QA engineer's: present QA and test automation, not a developer profile.
- No em dashes anywhere in site text (or docs). Typographic apostrophes.
- Exactly two marquees are approved (About tools, portrait word rows); ask before any other. The About time zone card has the dot-matrix globe with Islamabad and Cologne markers and no remote-work claim.
- Glow: hero washes and arc are approved for the hero only. Hero glows are rebuilt from our own measurements, no reference code or assets. Static section glows (no motion, blur filter, or grain) exist on the Skills wall and the contact panel (both approved). The /book-a-call header moon (user-approved 2026-10-16) is our own CSS plus our own generated texture, static, never the reference's photo. Every other cosmic or ambient effect stays excluded. Accent words are static gradients, except the /book-a-call headline's "In Touch", which drifts slowly like the reference (`text-gradient-aurora`, user decision 2026-10-16; static under reduced motion).
- Text selection is disabled site-wide by the user's decision (email, inputs, `data-selectable` stay selectable). Never block copy, cut, the context menu, or shortcuts.
- Two contact labels (user decision 2026-10-16): "Book a Call" on the navbar pill and the mobile nav (`content.contactSheet.trigger`), "Let’s Connect" on the hero and contact-panel buttons (`content.contact.cta`). All four open the Get in Touch sheet and fall back to `mailto:` without JavaScript.

### Security (details in DESIGN.md section 10)
- CSP (user decision 2026-10-15, option B): a static policy in `next.config.js` so the page stays prerendered. `script-src 'self' 'unsafe-inline'` (Next's inline flight scripts and the theme script need it without nonces); `'unsafe-eval'` is never allowed in production (development only). Everything else same-origin, no wildcards. **If a form, login, or anything sensitive is ever added, switch to the nonce CSP in `proxy.ts` (option A, DESIGN.md 10.1) first.** No new third-party script, style, font, image, or connect origins without updating the CSP and asking. **The one exception (user decision 2026-10-16): `/book-a-call` alone adds `https://app.cal.com` to `script-src` and `frame-src`** for Cal.com's official embed (its own `headers()` entry in `next.config.js`). A CSP belongs to the document it loaded with, so every link into /book-a-call must be a full page load (plain `<a>`, never `next/link`). The Cal booking form is Cal.com's page in a cross-origin frame, not a form of ours, so the static CSP stays (DESIGN.md 10.1).
- `dangerouslySetInnerHTML` only for the static theme script and the JSON-LD block (`JSON.stringify` with `<` escaped to `<`, built only from `lib/content.ts`).
- Every `target="_blank"` link has `rel="noopener noreferrer"`. Production source maps off. Never add a wildcard `Access-Control-Allow-Origin` ourselves (Vercel's CDN currently adds one; open decision).
- No secrets in the repo; `.env*` gitignored; only safe `NEXT_PUBLIC_*` in client code.
- No forms, API routes, server actions, uploads, webhooks, or server-side fetches. If any is added, CSRF protection, server-side validation, and rate limiting become required and DESIGN.md 10.7 must be redone first.
- Ask before any major dependency upgrade.

### SEO
- Unique title and description per page, Open Graph tags, semantic HTML, exactly one h1, alt text on every image.
- Every absolute URL (metadataBase, canonical, sitemap, robots, JSON-LD, OG) comes from `SITE_URL` in `lib/site-url.ts` (reads `NEXT_PUBLIC_SITE_URL`, fallback `http://localhost:3000`). Never hard-code or invent a domain.

### Deployment
- Vercel free tier, project linked to the GitHub repo; production branch `main`; no custom domain. Official address https://umair-nadeem.vercel.app.
- Node 22.x, pinned by `engines` `"22.x"`: Vercel lets `engines` override the dashboard and maps a range like `>=20.9.0` to its newest major (24.x). Local Node 25 builds fine with an `EBADENGINE` warning.
- `NEXT_PUBLIC_SITE_URL` (Production) must be the full origin with `https://` (a value without the scheme fails the build with `Invalid URL`). It is inlined at build time: change it, then redeploy. Update it if a custom domain is added.

### Workflow
- Work directly in the session; no workflows or multi-agent runs unless the user explicitly asks (saves usage).
- Small steps; stop for review after each section. Test at 390 and 1440 (and 768, 1024 for QA) in both themes with playwright-cli on the production build.
- At the end of every working session update **Status**, **Open decisions**, and **Next steps** below (and add detail to `docs/PROGRESS-LOG.md`) as its own commit: fresh sessions cannot see the chat.

### Motion contract (the gotchas that cost time)
- Every `gsap.matchMedia` conditions object includes `always: ALWAYS_QUERY` (`lib/motion-preferences.ts`) or its callback never runs on a normal desktop; every section ships a static reduced-motion state.
- Reveals: `[data-reveal]` + `gsap.set` first, then `fromTo` with explicit end values (a plain `from()` captures the hidden CSS state). Section scroll reveals go through `scrollReveal` in `lib/reveal.ts` (`ScrollTrigger.batch`): unrevealed elements are `opacity: 0` + `pointer-events: none`, never `visibility: hidden` or `autoAlpha`, so they stay in the tab order; keyboard focus (`:focus-visible`) in a section reveals it at once. Same rule for anything focusable in an intro timeline (the hero CTAs).
- Hover lifts use the CSS `translate`/`scale` properties so they compose with GSAP's `transform`. Never use a scaled element as its own ScrollTrigger trigger.
- ScrollSmoother distorts element screenshots and disables `position: sticky`; the navbar sits outside its provider.

## Status (2026-10-16)

- **Live since 2026-10-16, approved by the user (Robot Framework logo included):** `fc946bc` clock status dot removed, `3c868bd` logo-only Skills wall (Robot Framework's licensed white mark; the other 12 logo-less tools in the About tools marquee; reduced-motion marquee is a compact static list), `c0e220d` logo credits on `/credits` (noindex; "Credits" link in the footer), pushed as `a291fb2..7e7a7e9`. Verified live: `/credits` canonical, `og:url`, OG and Twitter images on `https://umair-nadeem.vercel.app`, noindex, not in the sitemap, CSP and security headers; the Robot Framework file served byte-identical; at 390 and 1440 in both themes, with and without reduced motion: no capsule dot, 32 logo tiles in equal rows (also 768, 1024), marquee 23 tools at 22 px/s, footer Credits link, `/credits` themed, home to `/credits` and back; zero console and CSP errors. Lighthouse mobile live, median of 3: 92 / 100 / 100 / 100 (LCP 3.0 s, TBT 190 ms), unchanged. Screenshots: `review/live/`.
- **"More about me" is live** (DESIGN.md 11.2.1), between the About bento and Skills. The user approved the paragraph 1 wording and the dark-mode photo fade (2026-10-16), and it was pushed as `1e13e53`..`3782e35`. Live check: section served, zero console or CSP errors, About highlighted, photo loads (390 and 1440, both themes). Paragraphs 2 and 3 (interests, QA philosophy) wait on Umair. It shows the existing headshot because `data/about-photo.jpg` was not provided.
- Live SEO recheck (2026-10-16): canonical, OG, Twitter, JSON-LD, sitemap, and robots all use `https://umair-nadeem.vercel.app`, no `localhost`.
- **The site is live on Vercel.** Official address: https://umair-nadeem.vercel.app. The old auto address `umair-website-pink.vercel.app` still serves the same deployment (the redirect is not working yet). Every push to `main` deploys to production automatically, so push only reviewed work.
- Built and approved by the user: every section (Home, About, Skills, Experience, Contact, Footer, floating mobile nav), the SEO pass, security hardening with the static CSP, final QA, keyboard-reachable reveals, the Node 22.x pin. Commits, measurements, and reasoning: `docs/PROGRESS-LOG.md`.
- Live results: Lighthouse mobile 92 / 100 / 100 / 100, desktop 100 / 100 / 100 / 100 (Performance, Accessibility, Best Practices, SEO). Headers, HSTS (from Vercel), and the CSP verified live; zero console and CSP errors at 390, 768, 1024, and 1440 in both themes.
- `NEXT_PUBLIC_SITE_URL` fixed (2026-10-15): the variable had never been added in Vercel. It is now `https://umair-nadeem.vercel.app` (Production), redeployed, and the user confirmed the live page source shows no `localhost`. No blocking issues.

## Open decisions (ask the user first)

1. **`lib/site-url.ts`:** whether to add a missing `https://` automatically and fail with a clear message on an invalid value.
2. **Vercel's `Access-Control-Allow-Origin: *`** on every response (from Vercel's CDN, not our config): accept it, or try overriding it with the site's own origin.
3. **Failed Vercel preview deployment:** check its source and build log in Vercel (it did not come from a branch: GitHub has only `main`).
4. **Redirect** `umair-website-pink.vercel.app` to `umair-nadeem.vercel.app`.
5. **Old deployments from before the Contact rebuild** still contain the phone number at their unique URLs: delete them or enable deployment protection.
6. **Updated resume** from Umair (the current PDF has the old email and the phone number).
7. **Waiting on Umair:** projects or case studies; certifications; details of his AI/LLM testing work for a possible Smart In Media highlight.

Later, no rush: major upgrades TypeScript 7 and ESLint 10 (blocked by `eslint-config-next` peers); `@types/node` stays on 22.

## Next steps, in order

1. "More about me" follow-ups: when Umair sends them, add paragraphs 2 and 3 to `content.moreAbout.paragraphs`; if an About photo arrives, put it in `public/` (SEO-friendly name, sized for the 330x400 frame) and point `content.moreAbout.photo` at it.
2. The user’s other new portfolio changes: discuss before building.
3. The open decisions above.
4. Google Search Console, then linking the site from LinkedIn, GitHub, and Upwork.
