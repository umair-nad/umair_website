# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

Personal portfolio of Umair Nadeem, a Software Quality Assurance (SQA) engineer. Currently a single-page site (all sections on one route with hash-anchor navigation), being rebuilt section by section directly on `main`.

- Framework: Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript 5.9 (upgraded 2026-10-10)
- Styling: Tailwind CSS 4 (CSS-first config: theme tokens live in `@theme` in `app/globals.css`; there is no `tailwind.config.js`), PostCSS via `@tailwindcss/postcss`
- WebGL: cobe 2.0.1 for the time zone globe only (`components/about/TimeZoneGlobe.tsx`, dynamically imported near the viewport)
- Animation: GSAP 3 with @gsap/react (ScrollTrigger, ScrollSmoother, SplitText; registered in `lib/gsap.ts`); canvas-confetti 1.9 for the copy-email star burst only (`lib/star-burst.ts`, dynamically imported on click, own main-thread instance so no blob worker)
- Icons: lucide-react 1.x (no brand icons). Fonts via next/font/google: EB Garamond (display, with real italic), Alata (UI), Source Code Pro (mono body and captions)
- Theme: light (default) and dark via a `dark` class on `<html>`. Tokens are in `app/globals.css` (`:root` and `.dark`), logic in `lib/theme.ts`, the pre-paint script in `components/theme/ThemeScript.tsx` (nonce-ready), and the toggle in `components/theme/ThemeToggle.tsx`
- Package manager: npm

### Commands

- `npm run dev` - dev server at http://localhost:3000
- `npm run build` - production build
- `npm start` - serve the production build
- `npm run lint` - ESLint 9 CLI with the flat `eslint.config.mjs` (`next lint` no longer exists in Next 16, and `next build` no longer lints, so run lint yourself)

There is no test framework configured; UI verification is done with the playwright-cli skill (see Workflow below).

### Repo layout

- `app/` - layout.tsx (fonts and all site metadata), page.tsx (composes the sections), globals.css, plus the icon file conventions (favicon.ico, icon.svg, icon1.png, apple-icon.png) and manifest.ts
- `assets/brand/` - non-public brand sources: `un-monogram.svg` (Umair's "UN" logo, `currentColor`, the source of truth for the Logo component and any regenerated favicons), `un-monogram-original.png` (the original raster, reference only). Never serve files from here directly.
- `review/` - local review screenshots for the user. Gitignored; never commit.
- `components/` - one file per section (Navbar, Hero, About, Experience, Skills, Contact, Footer) plus chrome (WaveformDivider, providers/SmoothScrollProvider, brand/Logo, nav/StatusCapsule, theme/ThemeScript, theme/ThemeToggle) and section parts (hero/CopyEmail, hero/HeroAtmosphere, and the About bento cards in about/: BentoCard shell plus Role, Specializations, Portrait, TimeZone, Contact, and ToolsMarquee cards). Preloader, Cursor, AmbientBackground, and the Three.js hero canvas were removed on 2026-10-10 (DESIGN.md section 6).
- `lib/` - support code (gsap.ts, local-time.ts, magnetic.ts, motion-preferences.ts, scroll.ts, theme.ts) plus content.ts, the typed content source for all site copy
- `public/` - static assets (headshot, android-chrome icons for the manifest)
- `data/` - Umair's LinkedIn export (Profile.pdf). Gitignored. Content source only.
- `refrence/` - spelled without the second "e" on disk; when the user writes "reference/", this folder is what they mean. Screenshots of a developer portfolio (dhirajbhawsar.in) used for design inspiration only. Gitignored.
- `public/umair-nadeem-qa-engineer-resume.pdf` is the public resume, approved for publishing (Progress, Decisions); its path is `content.resume.href`. Do not confuse it with the private LinkedIn PDF in `data/`.

`lib/content.ts` is the typed content source for all site copy, and every rebuilt section (Hero and About so far) reads from it. The old sections still hardcode their copy until they are rebuilt. There is no CMS. The headshot for the About section is `public/umair-nadeem.jpg` (2048x2048); use next/image with descriptive alt text.

## Project rules

### Identity
- This is Umair Nadeem's portfolio. Umair is a QA engineer, so the site must present QA and test automation work, not a software developer profile.

### Git
- Work directly on `main`; there are no feature branches (user decision 2026-10-12).
- Work in small commits, one logical change each, and push `main` after every commit (user decision 2026-10-12). Never batch unrelated changes into one commit.
- Before each push, run `npm run lint` and `npx tsc --noEmit`, plus `npm run build` when components or config change, so `main` is never broken.
- Never force-push.
- Git identity for this repo is Umair Nadeem <uminadeem06@gmail.com>, already configured. Do not change git config.
- Commits carry no Claude co-author line: attribution is turned off in the local, uncommitted `.claude/settings.local.json` (`"attribution": { "commit": "", "pr": "", "sessionUrl": false }`).
- Once Vercel is connected to `main`, every push deploys, which is why every commit must build. Still stop for the user's review after each section.
- The tag `pre-redesign-main` (pushed to origin) marks the old site as it was before the redesign, so it can always be recovered.
- Never commit anything inside `data/`, `refrence/`, or `review/`. All three are gitignored; `data/` contains personal information.

### Content
- Content sources are `data/` (LinkedIn PDF), the public resume `public/umair-nadeem-qa-engineer-resume.pdf`, the existing site content, and facts the user provides directly in chat about Umair's work. When sources conflict, follow LinkedIn (user decision 2026-10-04). Never invent projects, metrics, dates, tools, or achievements. If something is missing from all sources, stop and ask the user.
- Smart In Media content: present only what the user stated in chat or what is publicly visible on smartinmedia.com. Write product names as "PathoZoom Digital Lab" and "PathoZoom Scan & LiveView", skip the ® symbol in body text, and never describe internal details or clients.
- Do not publish Umair's phone number anywhere in the site text (user decision 2026-10-04). Email is the only direct contact method. The one approved exception (2026-10-10): the downloadable resume PDF may contain it as is.
- The reference site in `refrence/` belongs to a developer (Dhiraj Bhawsar). Match the reference site's theme (colors, light/dark modes, typography); never reuse its logo, text, images, video, or developer-only sections.
- Do NOT include a blog page or blog section.
- Do NOT include GitHub insights, contribution graphs, GitHub stats, or repo activity widgets.
- The reference site also contains these developer-specific or novelty sections: code-centric case studies with dev-stack chips, a developer Skills and Tools icon wall, a "From Concept to Code" CTA, a developer-framed experience timeline, a Uses page, a Guest Book, a Bucket List, a Links page, and a Spotify integration. Before adding anything similar, list what is being considered and ask the user first.

### Design
- Follow DESIGN.md (approved 2026-10-10) and the taste-skill (design-taste-frontend). Avoid generic AI layouts such as a centered hero with three feature cards and gradient blobs.
- Do not use em dashes in any text content on the site.
- Time zone globe (user decision 2026-10-12): a rotating dot-matrix globe (cobe 2) in the About time zone card, which is two tiles wide at lg, with markers for Islamabad and Cologne (Smart In Media) and no text claim about remote work (DESIGN.md 11.2).
- Marquees (user decision 2026-10-12): exactly two are approved, the About tools marquee and the portrait card's scrolling word rows (`content.portraitWords`, behind the cut-out `public/umair-nadeem-cutout.webp`). Ask before adding any other marquee.
- Hero atmosphere (user decision 2026-10-12): the reference's corner light washes and glowing horizon arc are approved for the hero only, rebuilt from our own measurements (DESIGN.md section 2; no reference code or assets). All other cosmic or ambient effects stay excluded: animated glow pulses or drifts, spotlight motion, glow blobs in other sections, grain, page-wide washes.

### Security (every build step; details in DESIGN.md section 10)
- CSP: production `script-src` never contains `'unsafe-inline'` or `'unsafe-eval'`. Every inline script, including the no-flash theme script, carries the per-request nonce from the CSP proxy (`proxy.ts`, Next 16's name for middleware). Keep the theme script a static string with no interpolated data (`THEME_INIT_SCRIPT` in `lib/theme.ts`; `ThemeScript` already takes a `nonce` prop). Don't add inline scripts or third-party script, style, font, image, or connect origins without updating the CSP and asking the user.
- `dangerouslySetInnerHTML` only for the static theme script and the JSON-LD block. JSON-LD is `JSON.stringify(...)` with `<` escaped to `\u003c`, built only from `lib/content.ts`. Never pass unescaped or user-supplied data.
- Every `target="_blank"` link has `rel="noopener noreferrer"`.
- Text selection is disabled site-wide by the user's decision (2026-10-12): `user-select: none` on `body` in `globals.css`, with inputs, textareas, editable content, and `data-selectable` elements (the email address) kept selectable (DESIGN.md 10.8). Never block copy or cut events, the context menu, or keyboard shortcuts.
- Keep production browser source maps off. Never add a wildcard `Access-Control-Allow-Origin`.
- No secrets in the repo. `.env*` stays gitignored; only `NEXT_PUBLIC_*` values that are safe to be public go into client code.
- The site has no forms, API routes, server actions, uploads, webhooks, or server-side fetches. If any of these is ever added (for example a contact form), CSRF protection, server-side input validation, and rate limiting become required, and the DESIGN.md 10.7 not-applicable table must be redone first.
- Ask the user before any major version upgrade of a dependency.

### SEO (required on every page)
- Unique title and meta description per page, Open Graph tags, semantic HTML, exactly one h1 per page, and alt text on every image.
- Today all metadata lives in the static export in `app/layout.tsx`.
- Every absolute URL (metadataBase, canonical, sitemap, robots, JSON-LD, OG) comes from `SITE_URL` in `lib/site-url.ts`, which reads `NEXT_PUBLIC_SITE_URL` with a `http://localhost:3000` fallback for development. Never hard-code or invent a domain.

### Deployment
- Hosting: Vercel (free tier) first; there is no domain yet, and a custom domain may be bought later.
- Node.js: Next.js 16 needs Node 20.9 or newer. Set the Vercel project's Node.js version to 20.x or later (22.x recommended); `package.json` declares `"engines": { "node": ">=20.9.0" }`.
- After the first Vercel deploy, set `NEXT_PUBLIC_SITE_URL` in the Vercel project settings (Production) to the deployment's URL, then redeploy: `NEXT_PUBLIC_*` values are inlined at build time. If a custom domain is added later, update the variable to that domain and redeploy again.

### Workflow
- Work directly in the session. Do not launch workflows or multi-agent runs unless the user explicitly asks (this saves usage limits).
- Work in small steps, one section at a time, and stop for the user's review after each section.
- After major UI changes, test with the playwright-cli skill at mobile and desktop widths.

## Progress

As of 2026-10-12:

- Workflow change: `redesign` was fast-forward merged into `main` and deleted (local and remote). All work now happens directly on `main` (see Git rules). Backup tag `pre-redesign-main` (`261e550`) preserves the old site. Lint, `tsc --noEmit`, and `npm run build` passed on `main` after the merge.
- Phases 0 to 3 complete. Phase 2: `lib/content.ts` (`8798bf9`). Phase 3: DESIGN.md approved (`d67538b`).
- Phase 4 step 1, theme foundation and navbar: complete and approved. `d37bd0d` (upgrade), `ed41941` (removed old chrome), `f9d3467` (theme system), `3d4876b` (navbar), `519ce51` (docs).
- Phase 4 step 2, Hero: complete. `4b03407` (favicon tile), `dda3c6e` (Hero), `80eac6e` (badge spacing fix). Screenshots are in `review/hero-*` (gitignored).
- Resume (2026-10-12): moved to `public/umair-nadeem-qa-engineer-resume.pdf` (`a4a0d88`), path in `content.resume.href`; "Download resume" button in the Hero CTA row (`7736ea5`); docs updated (`c1c2beb`). Verified: 200 `application/pdf`, click downloads the file.
- Phase 4 step 3, About bento (2026-10-12): built, awaiting the user's review. Commits `705c841` (grid + role card), `6b6f3ea` (portrait), `422c1c8` (specializations), `0fee8a2` (tools marquee), `d54612c` (shared clock, `lib/local-time.ts`), `6e0eb1f` (time zone), `070796f` (contact), `9941ecc` (reveals), `08315c7` (old About removed; the bento is `components/About.tsx`), `f9ebaac` (web-design-guidelines fixes), `47b248a` (focus order). Screenshots in `review/about-*` (gitignored).
  - Deviations from DESIGN.md 11.2, both recorded there: the tools card is 2x1 (not 1x1) so six cards fill the 3x3 grid exactly; the mobile order ends with tools (time zone and contact come before it) so keyboard focus follows the visual order.
  - New content.ts fields: `specializations` (the four DESIGN.md 11.2 labels), `timeZone` (Asia/Karachi, PKT (UTC+5)), `resume`.
  - The headshot is still the 2.1 MB original. next/image serves resized copies, so it only weighs on the repo; re-encoding it remains the user's call.
- Hero feedback round (2026-10-12), awaiting the user's review. Screenshots in `review/hero-arc-*`, `review/hero-cta-*`, `review/stars-*`; reference captures in `review/ref-*`.
  - `af4d80e` hero atmosphere: corner washes + horizon arc in `components/hero/HeroAtmosphere.tsx`, built from playwright-cli measurements of the live reference (DESIGN.md section 2 has the numbers). Replaced `HeroTrace` (deleted). No `filter: blur`; all hero text measured AA over the glow at 390 and 1440 in both themes (tightest: the accent word in light, 3.19:1).
  - `fdfdaa0` copy-email star burst: canvas-confetti 1.9.4 via `lib/star-burst.ts`, loaded on click only (verified on the production build: the library is a separate 10 KB chunk), own main-thread instance (the default export uses a blob-URL worker), skipped under reduced motion.
  - `a704eec` "Download resume" is now a secondary outlined pill (Alata 16px, 48px, `line-strong` border) beside the primary CTA.
  - `ecea4f4` text selection off site-wide (user decision); email address, inputs, and editable content stay selectable; copy, context menu, and shortcuts are not blocked.
  - The "1 Issue" dev indicator: found on its second appearance in `.next/dev/logs/next-development.log` (Next 16 logs browser errors there). It was a hydration mismatch from an attribute, `__processed_<uuid>__="true"`, that something in the user's browser (an extension or security tool) stamps on `<body>` before React hydrates. Reproduced with Playwright by stamping the same attribute; fixed in `18ef805` with `suppressHydrationWarning` on `<body>` (attributes of `<body>` only; mismatches inside the page are still reported).
- CTA round (2026-10-12), awaiting the user's review. Screenshots `review/cta-{light,dark}-{1440,390}-{rest,hover,focus}.png`, reference captures `review/ref-cta-*`.
  - `8e15b80` hero CTA hover matches the reference (measured with playwright-cli): the button never moves; an `fg` fill grows in, the label inverts, the arrow chip's circle turns transparent, the arrow swaps; 300ms `cubic-bezier(0.4, 0, 0.2, 1)`. Magnetic pull and the press scale removed from it (the nav links keep theirs). Hover contrast 21:1 light, 19.8:1 dark; the accent focus ring stays.
  - `988d44c` the contact label is now "Let’s Connect" (typographic apostrophe) in `content.contact.cta`, read by the hero CTA, the nav pill, and the mobile menu. DESIGN.md's single contact-label rule updated.
  - `next dev` now generates an untracked `AGENTS.md` (Next 16 agent rules). Not committed; the user decides whether to commit it, gitignore it, or turn it off with `agentRules: false` in `next.config.js`.
  - `npm audit` reports 5 high findings, all in the `eslint-config-next` dev chain (braces, micromatch, fast-glob); they predate canvas-confetti and don't ship to the browser.
- About round 2 (2026-10-12): built, awaiting the user's review.
  - `9a83b8a` rotating globe in the time zone card (cobe 2.0.1; details in DESIGN.md 11.2). Verified on the production build: cobe loads only near the viewport (separate 5.9 KB gzip chunk), 0 WebGL draws while scrolled away, static frame under reduced motion (it redraws for about 1s so cobe's async map texture appears), CSS dot-sphere fallback without WebGL, card text AA over the globe in both themes at 390 and 1440 (worst pixel 7.13:1). Screenshots `review/globe-*`, reference `review/ref-globe-*`.
  - `63c8ff9` the time zone card is two tiles wide at lg and the tools card single; the globe uses the reference placement at lg (170% of the card height, top-aligned, 12% past the right edge) and a card-colored bottom fade at every width.
  - `90e74cd` portrait card rebuilt after the reference: the user-approved cut-out (rembg 2.0.67 `birefnet-portrait`, run through uvx outside the project; trimmed to `public/umair-nadeem-cutout.webp`, 808x1400, 154 KB; the original jpg is kept but unused), unframed and bottom-anchored with the reference drop shadow and a bottom fade, two `content.portraitWords` rows scrolling behind it at the measured 36 and 44 px/s (verified), caption = bio sentence 3. Details in DESIGN.md 11.2. Screenshots `review/portrait-*`, `review/about-final-*`, reference `review/ref-portrait-*`.
  - Open: bio sentence 2 ("5+ years in QA hunting bugs, ...") no longer appears anywhere on the page; suggested home: the standfirst under the Experience headline (DESIGN.md 11.3). Waiting on the user.
  - Lighthouse mobile, user flow (navigation, then a timespan that scrolls through About so the globe and portrait load), median of 3, production builds: before (`fb46555`) navigation 82 (LCP 3.5 s, TBT 375 ms, CLS 0, 402 KiB), scroll 100 (TBT 0 ms, CLS 0); after (`90e74cd`) navigation 85 (LCP 3.5 s, TBT 257 ms, CLS 0, 437 KiB: +33 KiB is the cut-out, which Chrome fetches early on slow connections), scroll 99 (TBT 103 ms from cobe starting up, CLS 0). Plain navigation-only runs were 83 before and 83 with the globe.
- Still old: Experience, Skills, Contact, and Footer render their pre-redesign copy and layout on the new tokens until rebuilt.

### Decisions

- Stack: Next.js 16.4.0, React 19.3.0, Tailwind 4 (CSS-first), lucide-react 1.x, ESLint 9 with flat `eslint.config.mjs`, TypeScript 5.9. lucide 1.x has no brand icons, so LinkedIn and Upwork are text links. Vercel needs Node 20.9 or newer.
- Theme: light is the default; dark mode via the toggle (OS preference on the first visit, remembered choice afterwards). Palette and fonts match the reference: EB Garamond, Alata, Source Code Pro. Values are in DESIGN.md sections 3 and 4.
- Logo and favicons: the SVG monogram (`assets/brand/un-monogram.svg`, `currentColor`) is the logo (`components/brand/Logo.tsx`). `app/icon.svg` is a dark rounded tile with a white monogram, so it is visible on any tab color.
- Resume: Umair approved publishing the current resume (now `public/umair-nadeem-qa-engineer-resume.pdf`) as is, including the phone number and older details in it (user, 2026-10-10). Website text still follows LinkedIn (`lib/content.ts`), and the no-phone-number rule still applies to all site text. Replace the PDF when Umair sends an updated version.
- Domain: none yet. Deploy free on Vercel first, then set `NEXT_PUBLIC_SITE_URL` after the first deploy (see Deployment).
- Content: when sources conflict, LinkedIn wins; the professional title is "QA Engineer"; no blog; no GitHub insights or stats.

### Known issue for the remaining sections

GSAP `matchMedia` only runs a conditions-object callback while at least one condition matches, so `{ reduceMotion, coarsePointer }` alone never runs on a normal desktop.
- Every rebuilt section must include `always: ALWAYS_QUERY` from `lib/motion-preferences.ts`, exactly as `components/Hero.tsx` and `components/About.tsx` do. The old Contact, Footer, and Skills still have the bug.
- For entrance reveals, reuse the `[data-reveal]` pattern (DESIGN.md section 7 notes): `gsap.set` first, then `fromTo` with explicit end values. For grids of cards, `components/About.tsx` shows the `ScrollTrigger.batch` version.
- Hover lifts use Tailwind's `translate` utilities (the CSS `translate` property), which compose with the `transform` GSAP writes, so reveals and hovers never fight.
- Screenshots: ScrollSmoother distorts Playwright element screenshots. Scroll natively to the section's summed `offsetTop`, wait about 2.5s, and take a viewport screenshot (tall viewports for whole sections).

### Next steps, in order

1. The user reviews About round 2 (globe card, portrait card) and decides where bio sentence 2 goes.
2. The user reviews the About bento and the hero feedback round (screenshots in `review/about-*`, `review/hero-arc-*`, `review/stars-*`), and says what the "1 Issue" overlay showed if it comes back.
3. Phase 4 step 4: Experience timeline (DESIGN.md 11.3).
4. Then the remaining build steps in DESIGN.md section 13: Skills, Contact CTA and Footer, the SEO pass, and security hardening. In the Footer step, also add the footer "Download resume" button (`content.resume.href`) and fix the hardcoded "© 2024" year.
5. The README is stale throughout (Next 14, Three.js, old fonts and colors, a contact form, an old email). Rewrite it in its own commit when the user wants; only the resume path was updated so far.

### Open items waiting on Umair

- Which automation tools he uses at Smart In Media.
- Whether he tested AI modules (the "AI & LLM Testing" skill rests on his LinkedIn headline alone).
- Projects or case studies worth showcasing.
- Certifications.
- An updated resume.
