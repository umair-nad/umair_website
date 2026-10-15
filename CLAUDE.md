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

- `app/` layout.tsx (fonts, all metadata), page.tsx (composes sections, renders the JSON-LD), globals.css, icon files, manifest.ts, opengraph-image.tsx (twitter-image.tsx re-exports it), sitemap.ts, robots.ts
- `components/` one file per section (Navbar, Hero, About, Skills, Experience, Contact, Footer), shared controls (PrimaryCta, ResumeButton, ProfileLink, WaveformDivider), PersonJsonLd, parts in `hero/`, `about/`, `footer/`, `nav/`, `theme/`, `brand/`, `providers/`
- `lib/` `content.ts` is the typed source of ALL site copy (no CMS); also site-url.ts (`SITE_URL`), hero-headline.ts (shared by the hero and the OG image), nav.ts (section list), scroll.ts, motion-preferences.ts, theme.ts, local-time.ts, tool-icons.ts, star-burst.ts, gsap.ts
- `public/` includes `umair-nadeem-cutout.webp` (About portrait), `umair-nadeem-qa-engineer-resume.pdf` (public resume, path `content.resume.href`), `umair-nadeem.jpg` (800px headshot, used only as the JSON-LD image, `content.seo.image`)
- `assets/` non-public, never serve from it: `brand/` logo sources (`un-monogram.svg` is the logo source of truth), `fonts/` static TTFs for the OG image with their OFL licenses
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
- Glow: hero washes and arc are approved for the hero only. Hero glows are rebuilt from our own measurements, no reference code or assets. Static section glows (no motion, blur filter, or grain) exist on the Skills wall and the contact panel (both approved). Every other cosmic or ambient effect stays excluded.
- Text selection is disabled site-wide by the user's decision (email, inputs, `data-selectable` stay selectable). Never block copy, cut, the context menu, or shortcuts.
- One contact label site-wide: "Let’s Connect" (`content.contact.cta`).

### Security (details in DESIGN.md section 10)
- CSP (user decision 2026-10-15, option B): a static policy in `next.config.js` so the page stays prerendered. `script-src 'self' 'unsafe-inline'` (Next's inline flight scripts and the theme script need it without nonces); `'unsafe-eval'` is never allowed in production (development only). Everything else same-origin, no wildcards. **If a form, login, or anything sensitive is ever added, switch to the nonce CSP in `proxy.ts` (option A, DESIGN.md 10.1) first.** No new third-party script, style, font, image, or connect origins without updating the CSP and asking.
- `dangerouslySetInnerHTML` only for the static theme script and the JSON-LD block (`JSON.stringify` with `<` escaped to `<`, built only from `lib/content.ts`).
- Every `target="_blank"` link has `rel="noopener noreferrer"`. Production source maps off. No wildcard `Access-Control-Allow-Origin`.
- No secrets in the repo; `.env*` gitignored; only safe `NEXT_PUBLIC_*` in client code.
- No forms, API routes, server actions, uploads, webhooks, or server-side fetches. If any is added, CSRF protection, server-side validation, and rate limiting become required and DESIGN.md 10.7 must be redone first.
- Ask before any major dependency upgrade.

### SEO
- Unique title and description per page, Open Graph tags, semantic HTML, exactly one h1, alt text on every image.
- Every absolute URL (metadataBase, canonical, sitemap, robots, JSON-LD, OG) comes from `SITE_URL` in `lib/site-url.ts` (reads `NEXT_PUBLIC_SITE_URL`, fallback `http://localhost:3000`). Never hard-code or invent a domain.

### Deployment
- Vercel free tier first, no domain yet. Node 22.x, pinned by `engines` `"22.x"` (2026-10-15): Vercel lets `engines` override the dashboard and maps a range like `>=20.9.0` to its newest major (24.x), so the pin is what keeps deploys on 22. Local Node 25 builds fine with an `EBADENGINE` warning. After the first deploy set `NEXT_PUBLIC_SITE_URL` (Production) to the deployment URL and redeploy (inlined at build time); update it again if a custom domain is added.

### Workflow
- Work directly in the session; no workflows or multi-agent runs unless the user explicitly asks (saves usage).
- Small steps; stop for review after each section. Test at 390 and 1440 (and 768, 1024 for QA) in both themes with playwright-cli on the production build.
- At the end of every working session update **Status**, **Open decisions**, and **Next steps** below (and add detail to `docs/PROGRESS-LOG.md`) as its own commit: fresh sessions cannot see the chat.

### Motion contract (the gotchas that cost time)
- Every `gsap.matchMedia` conditions object includes `always: ALWAYS_QUERY` (`lib/motion-preferences.ts`) or its callback never runs on a normal desktop; every section ships a static reduced-motion state.
- Reveals: `[data-reveal]` + `gsap.set` first, then `fromTo` with explicit end values (a plain `from()` captures the hidden CSS state). Section scroll reveals go through `scrollReveal` in `lib/reveal.ts` (`ScrollTrigger.batch`): unrevealed elements are `opacity: 0` + `pointer-events: none`, never `visibility: hidden` or `autoAlpha`, so they stay in the tab order; keyboard focus (`:focus-visible`) in a section reveals it at once. Same rule for anything focusable in an intro timeline (the hero CTAs).
- Hover lifts use the CSS `translate`/`scale` properties so they compose with GSAP's `transform`. Never use a scaled element as its own ScrollTrigger trigger.
- ScrollSmoother distorts element screenshots and disables `position: sticky`; the navbar sits outside its provider.

## Status (2026-10-15, end of session)

- Last commit before this docs commit: `4cf308f`.
- **Every section is rebuilt on the redesign; nothing pre-redesign remains.** Single-page site, nav order Home, About, Skills, Experience, Contact, with a floating mobile nav on phones.
  - Hero: serif headline with the gradient accent word, typing subline, horizon arc and washes, "Let’s Connect", resume download, copy-email with star burst.
  - About bento: role, specializations, cut-out portrait with scrolling words, rotating time zone globe, contact, tools marquee.
  - Skills & Tools wall: 44 confirmed tools, Simple Icons logos or text tiles where no licensed logo exists.
  - Experience timeline: three roles and education, scroll-drawn spine, testing types and practices.
  - Contact panel and Footer with the logo credits and the settling waveform.
- Reviewed and approved by the user: every section (Contact and Footer on 2026-10-15, with the contact glow kept and the footer role line "Software Quality Assurance Engineer | Islamabad, Pakistan" in `content.footerRole`).
- **SEO pass built and approved (2026-10-15):** `lib/site-url.ts`, title "Umair Nadeem | QA Engineer", canonical, Open Graph (`profile`) and Twitter tags, generated OG and Twitter image (1200x630, light theme), `sitemap.xml`, `robots.txt`, JSON-LD `Person` from content.ts, headshot re-encoded to 800px (32 KB). Audit clean: one h1, no skipped heading levels, alt on every image, descriptive link names, `lang="en"`, no duplicate head tags. Lighthouse SEO 100 on mobile and desktop (details in the log).
- README rewritten for the current site.
- **Security hardening done (2026-10-15), including the CSP:**
  - Static headers in `next.config.js` on every route: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, a `Permissions-Policy` disabling 13 unused features (clipboard-write left allowed for copy-email); `poweredByHeader: false`; explicit `productionBrowserSourceMaps: false`. Verified with `curl -I` on `next start`.
  - HSTS deliberately not set: Vercel sends it on every deployment (`max-age=63072000; includeSubDomains; preload` on `*.vercel.app`) and a project header would replace it. Check with `curl -I` after the first deploy.
  - Verified: no source maps served, no secrets or `.env` in history or the client bundle, all 6 external links `noopener noreferrer`, both `dangerouslySetInnerHTML` uses static and escaped, the not-applicable table (SQLi, CSRF, uploads, SSRF, webhooks) re-checked.
  - Patch updates: Next 16.4.1, React 19.3.1, lucide-react 1.57.0, eslint-config-next 16.4.1, postcss 8.5.30. `npm audit`: still only the 5 high findings in the dev-only `braces` lint chain. Majors not applied: TypeScript 7, ESLint 10, `@types/node` 26.
  - Static CSP (option B, user decision) in `next.config.js` (`bb49f6e`): same-origin everything, `script-src 'self' 'unsafe-inline'`, `img-src 'self' data:` (cobe map), no `blob:`, no third-party origins. Zero violations and zero console messages across every feature (DESIGN.md 10.1). The page stays prerendered.
- **Final QA done (2026-10-15):**
  - Hero LCP fix (`afeefa0`): the h1 paints at first paint 0.3em low and its lines rise (no fade). Observed LCP now equals FCP. Lighthouse mobile, simulated: 87 / LCP 3.73 s before, 88 / 3.65 s after (Lighthouse's simulation still counts the async JS downloads); applied DevTools throttling: 48 / LCP 5.95 s before, 67 / 2.41 s after.
  - Layout at 390, 768, 1024, 1440 in both themes: no horizontal overflow, nothing escaping the viewport, no console errors, no CSP violations, contrast clean. One bug fixed: the nav pill wrapped "Let’s Connect" from 768 to 1023px (`692e356`).
  - Keyboard: visible ring on every stop, no traps, skip link works, order hero, About, Skills, Contact, footer (Experience has no focusables).
  - Portrait now loads a 384px file on 1x desktops (`76218ce`; 16 KB instead of 50 KB).
  - Lighthouse (median of 3): mobile 88 / 100 / 100 / 100, desktop 100 / 100 / 100 / 100 (Performance, Accessibility, Best Practices, SEO); CLS 0.01 or less.
  - Final QA approved by the user (2026-10-15).
- **Pre-deploy round (2026-10-15):**
  - `809cc0e` unrevealed sections are keyboard reachable: `lib/reveal.ts` (opacity 0 + pointer-events none until revealed; keyboard focus reveals the section at once); the hero CTAs follow the same rule and keyboard focus finishes the hero intro. Tabbing right after the load event reaches every section at 390 and 1440; mouse timing unchanged (sampled per frame).
  - JS size: both experiments measured and reverted, nothing committed. A modern `browserslist` changes nothing (Next 16 already targets Chrome/Edge 111, Firefox 111, Safari 16.4, and its framework polyfills ship regardless). Lazy-loading the four sections with `next/dynamic` made mobile worse (89 to 86, LCP 3.72 to 3.87 s, JS 215 to 229 KiB).
  - Cleanup: nothing private or local is tracked; every tracked file is used. Only `.gitignore` changed (`134c634`: Playwright folders, `.vercel/`). Tracked size 3.24 MB, unchanged; the 1.48 MB `assets/brand/un-monogram-original.png` is kept (open decision 2).
  - `4cf308f` Node pinned to `22.x` in `engines`. Build, serve, and the full feature and CSP check pass on Node 22.23.3, also with `NEXT_PUBLIC_SITE_URL` set (every absolute URL follows it, trailing slash trimmed, no localhost left).
- No Vercel deploy yet.

## Open decisions (ask the user first next session)

1. **Mobile Lighthouse LCP (simulated) stays about 3.7s (score 88 to 89):** the real paint is fixed (observed LCP equals FCP). The rest is JS that the page genuinely needs (React and Next runtime, GSAP for the hero); both cheap fixes were tried and measured (no gain or worse). Accept it unless the user wants a bigger change (for example dropping ScrollSmoother).
2. **`assets/brand/un-monogram-original.png` (1.48 MB, 46% of tracked bytes):** Umair's original raster logo, kept for reference per DESIGN.md section 6; used by nothing. Removing it from the tree is the user's call (it stays in history either way).
3. **Updated resume:** keep the current PDF (old email, phone number) until Umair sends a new one (user decision 2026-10-15); then replace `public/umair-nadeem-qa-engineer-resume.pdf`.
4. **Still waiting on Umair:** projects or case studies worth showcasing; certifications; which automation tools he uses at Smart In Media. (Settled 2026-10-15: the user confirmed Umair has done AI and LLM testing, so the "AI & LLM Testing" skill is confirmed.)
5. **Major upgrades available (not applied):** TypeScript 7, ESLint 10 (blocked by `eslint-config-next` plugin peer ranges), `@types/node` 26 (stay on 22 to match Node 22).
6. Smaller: what the "1 Issue" dev overlay showed if it comes back (a browser-extension hydration attribute was fixed on `<body>`).

## Next steps, in order

1. The user reviews this round and creates the Vercel project. Stop there; ask before building.
2. First free Vercel deploy (Node 22.x comes from `engines`; set the dashboard to 22.x too so it matches), then set `NEXT_PUBLIC_SITE_URL` and redeploy; re-check canonical, `og:url`, sitemap, robots, and JSON-LD URLs on the live site, and the live headers with `curl -I` (HSTS from Vercel, the four static headers, the CSP).
