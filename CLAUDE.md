# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

Personal portfolio of Umair Nadeem, a Software Quality Assurance (SQA) engineer. Currently a single-page site (all sections on one route with hash-anchor navigation), being rebuilt on the `redesign` branch.

- Framework: Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript 5.9 (upgraded 2026-10-10)
- Styling: Tailwind CSS 4 (CSS-first config: theme tokens live in `@theme` in `app/globals.css`; there is no `tailwind.config.js`), PostCSS via `@tailwindcss/postcss`
- Animation: GSAP 3 with @gsap/react (ScrollTrigger, ScrollSmoother, SplitText; registered in `lib/gsap.ts`)
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
- `components/` - one file per section (Navbar, Hero, About, Experience, Skills, Contact, Footer) plus chrome (WaveformDivider, providers/SmoothScrollProvider, brand/Logo, nav/StatusCapsule, theme/ThemeScript, theme/ThemeToggle) and section parts (hero/CopyEmail, hero/HeroTrace). Preloader, Cursor, AmbientBackground, and the Three.js hero canvas were removed on 2026-10-10 (DESIGN.md section 6).
- `lib/` - support code (gsap.ts, magnetic.ts, motion-preferences.ts, scroll.ts, theme.ts) plus content.ts, the typed content source for all site copy
- `public/` - static assets (headshot, android-chrome icons for the manifest)
- `data/` - Umair's LinkedIn export (Profile.pdf). Gitignored. Content source only.
- `refrence/` - spelled without the second "e" on disk; when the user writes "reference/", this folder is what they mean. Screenshots of a developer portfolio (dhirajbhawsar.in) used for design inspiration only. Gitignored.
- `UmairNadeem_SQA.pdf` at the repo root is the public resume, tracked in git and approved for publishing (Progress, Decisions). It moves to `public/umair-nadeem-qa-engineer-resume.pdf` next. Do not confuse it with the private LinkedIn PDF in `data/`.

`lib/content.ts` is the typed content source for all site copy, and every rebuilt section (the Hero so far) reads from it. The old sections still hardcode their copy until they are rebuilt. There is no CMS. The headshot for the About section is `public/umair-nadeem.jpg` (2048x2048); use next/image with descriptive alt text.

## Project rules

### Identity
- This is Umair Nadeem's portfolio. Umair is a QA engineer, so the site must present QA and test automation work, not a software developer profile.

### Git
- Work only on the branch `redesign`. Never touch `main`.
- Never commit anything inside `data/`, `refrence/`, or `review/`. All three are gitignored; `data/` contains personal information.

### Content
- Content sources are `data/` (LinkedIn PDF), the public resume `UmairNadeem_SQA.pdf`, the existing site content, and facts the user provides directly in chat about Umair's work. When sources conflict, follow LinkedIn (user decision 2026-10-04). Never invent projects, metrics, dates, tools, or achievements. If something is missing from all sources, stop and ask the user.
- Smart In Media content: present only what the user stated in chat or what is publicly visible on smartinmedia.com. Write product names as "PathoZoom Digital Lab" and "PathoZoom Scan & LiveView", skip the ® symbol in body text, and never describe internal details or clients.
- Do not publish Umair's phone number anywhere in the site text (user decision 2026-10-04). Email is the only direct contact method. The one approved exception (2026-10-10): the downloadable resume PDF may contain it as is.
- The reference site in `refrence/` belongs to a developer (Dhiraj Bhawsar). Match the reference site's theme (colors, light/dark modes, typography); never reuse its logo, text, images, video, or developer-only sections.
- Do NOT include a blog page or blog section.
- Do NOT include GitHub insights, contribution graphs, GitHub stats, or repo activity widgets.
- The reference site also contains these developer-specific or novelty sections: code-centric case studies with dev-stack chips, a developer Skills and Tools icon wall, a "From Concept to Code" CTA, a developer-framed experience timeline, a Uses page, a Guest Book, a Bucket List, a Links page, and a Spotify integration. Before adding anything similar, list what is being considered and ask the user first.

### Design
- Follow DESIGN.md (approved 2026-10-10) and the taste-skill (design-taste-frontend). Avoid generic AI layouts such as a centered hero with three feature cards and gradient blobs.
- Do not use em dashes in any text content on the site.

### Security (every build step; details in DESIGN.md section 10)
- CSP: production `script-src` never contains `'unsafe-inline'` or `'unsafe-eval'`. Every inline script, including the no-flash theme script, carries the per-request nonce from the CSP proxy (`proxy.ts`, Next 16's name for middleware). Keep the theme script a static string with no interpolated data (`THEME_INIT_SCRIPT` in `lib/theme.ts`; `ThemeScript` already takes a `nonce` prop). Don't add inline scripts or third-party script, style, font, image, or connect origins without updating the CSP and asking the user.
- `dangerouslySetInnerHTML` only for the static theme script and the JSON-LD block. JSON-LD is `JSON.stringify(...)` with `<` escaped to `\u003c`, built only from `lib/content.ts`. Never pass unescaped or user-supplied data.
- Every `target="_blank"` link has `rel="noopener noreferrer"`.
- Never disable text selection, copying, or the context menu.
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

As of 2026-10-10 (end of session):

- Phases 0 to 3 complete. Phase 2: `lib/content.ts` (`8798bf9`). Phase 3: DESIGN.md approved (`d67538b`).
- Phase 4 step 1, theme foundation and navbar: complete and approved. `d37bd0d` (upgrade), `ed41941` (removed old chrome), `f9d3467` (theme system), `3d4876b` (navbar), `519ce51` (docs).
- Phase 4 step 2, Hero: complete. `4b03407` (favicon tile), `dda3c6e` (Hero), `80eac6e` (badge spacing fix). Screenshots are in `review/hero-*` (gitignored).
- Still old: About, Experience, Skills, Contact, and Footer render their pre-redesign copy and layout on the new tokens until rebuilt.

### Decisions

- Stack: Next.js 16.4.0, React 19.3.0, Tailwind 4 (CSS-first), lucide-react 1.x, ESLint 9 with flat `eslint.config.mjs`, TypeScript 5.9. lucide 1.x has no brand icons, so LinkedIn and Upwork are text links. Vercel needs Node 20.9 or newer.
- Theme: light is the default; dark mode via the toggle (OS preference on the first visit, remembered choice afterwards). Palette and fonts match the reference: EB Garamond, Alata, Source Code Pro. Values are in DESIGN.md sections 3 and 4.
- Logo and favicons: the SVG monogram (`assets/brand/un-monogram.svg`, `currentColor`) is the logo (`components/brand/Logo.tsx`). `app/icon.svg` is a dark rounded tile with a white monogram, so it is visible on any tab color.
- Resume: Umair approved publishing the current `UmairNadeem_SQA.pdf` as is, including the phone number and older details in it (user, 2026-10-10). Website text still follows LinkedIn (`lib/content.ts`), and the no-phone-number rule still applies to all site text. Replace the PDF when Umair sends an updated version.
- Domain: none yet. Deploy free on Vercel first, then set `NEXT_PUBLIC_SITE_URL` after the first deploy (see Deployment).
- Content: when sources conflict, LinkedIn wins; the professional title is "QA Engineer"; no blog; no GitHub insights or stats.

### Known issue for the remaining sections

GSAP `matchMedia` only runs a conditions-object callback while at least one condition matches, so `{ reduceMotion, coarsePointer }` alone never runs on a normal desktop.
- Every rebuilt section must include `always: ALWAYS_QUERY` from `lib/motion-preferences.ts`, exactly as `components/Hero.tsx` does. The old About, Contact, Footer, and Skills still have the bug.
- For entrance reveals, reuse the Hero's `[data-reveal]` pattern (DESIGN.md section 7 notes): `gsap.set` first, then `fromTo` with explicit end values.

### Next steps, in order

1. Move the resume into `public/` with an SEO-friendly name: `git mv UmairNadeem_SQA.pdf public/umair-nadeem-qa-engineer-resume.pdf`.
   - Add the "Download resume" button in the marked slot in `components/Hero.tsx`. The style notes are in the slot comment; use the `download` attribute.
   - Update the README and DESIGN.md 11.1 to the new path.
2. Phase 4 step 3: About bento (DESIGN.md 11.2).
3. Then the remaining build steps in DESIGN.md section 13: Experience, Skills, Contact CTA and Footer, the SEO pass, and security hardening. In the Footer step, also add the footer "Download resume" button and fix the hardcoded "© 2024" year.

### Open items waiting on Umair

- Which automation tools he uses at Smart In Media.
- Whether he tested AI modules (the "AI & LLM Testing" skill rests on his LinkedIn headline alone).
- Projects or case studies worth showcasing.
- Certifications.
- An updated resume.
