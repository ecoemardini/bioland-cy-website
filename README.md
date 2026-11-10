# BIOLAND-Cy website v2 ("From orbit to ground")

Static website built with **Astro 7**, hosted on **Cloudflare Pages**, edited in the browser with **Sveltia CMS** at `/admin`.
Every page is plain HTML: it works without JavaScript, and fonts are self-hosted (no cookies, no third-party trackers).

Prepared by Claude for Dr Mahmoud Mardini, 27 October 2026.

## What is where

| Folder / file | What it is |
|---|---|
| `src/pages/` | The pages: home, research, outputs, news (+ one page per post), events, about, contact, privacy, accessibility, 404 |
| `src/content/` | **Everything editors change**: news (one folder per post, images next to it), events, workshops, deliverables, team |
| `src/data/site.json` | Site texts and links (headline, newsletter text, social links, funding statements): also editable in `/admin` → Site settings |
| `src/data/images.ts` | Every picture with its alt text, caption and credit. AI pictures are flagged and get the EU AI icon automatically |
| `src/assets/img/` | Real-data images (`eo/`), the six island layers (`layers/`) and approved AI illustrations (`ai/`) |
| `src/components/` | Building blocks (layer stack, compare slider, film, timeline, funder bar …) |
| `src/styles/` | Design system (brand book v2.5 colours, Montserrat / Open Sans / JetBrains Mono) |
| `public/admin/` | The editor (Sveltia CMS) and its `config.yml` |
| `public/media/` | The real-data 3D flight (MP4 + WebM) |
| `public/_headers`, `_redirects` | Security headers, caching, redirects from old addresses |
| `functions/api/` | GitHub sign-in for the editor (Cloudflare Pages Functions). Needs `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` |

## Day-to-day editing

1. Go to `https://www.biolandcy.eu/admin/` and sign in with GitHub.
2. Choose **News**, **Events**, **Workshops**, **Deliverables**, **Team** or **Site settings**.
3. Edit and press **Save**. The site rebuilds and is live in about two minutes.

Rules the editor cannot check for you: no site names or locations yet; no photos of archaeological sites; no images of human remains;
AI pictures only after review; keep the funding statement unshortened.

## Build settings (Cloudflare Pages)

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | from `.node-version` (24) |
| Environment variables | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (same values as the current project) |

A full build takes about 2 minutes (images are optimised at build time and cached afterwards).

## Safe switch-over (no downtime, instant rollback)

1. Push this folder to a new branch `v2` of `ecoemardini/bioland-cy-website` (the live `main` branch is not touched).
2. In Cloudflare → Workers & Pages → **Create** → Pages → Connect to Git → same repository, production branch `v2`,
   build settings as above, add the two environment variables. You get a preview address `….pages.dev`.
3. Check the preview on a phone and a computer. On the preview, sign in to `/admin` with **Sign in using access token**
   (the GitHub sign-in button only works on the real domain).
4. When happy: in the *old* Pages project remove the custom domains; in the *new* project add `www.biolandcy.eu` and `biolandcy.eu`.
   Add a redirect rule `biolandcy.eu/*` → `https://www.biolandcy.eu/$1` (301).
5. Rollback at any time: move the custom domains back to the old project.
6. After the switch, set the editor's branch in `public/admin/config.yml` (`branch:`) to the production branch (`v2`, or merge `v2` into `main`).

## Before launch: decisions for the coordinator

- Turn off **Web Analytics** (automatic JS beacon) in the Cloudflare dashboard, or keep it and update the privacy policy.
- Contact form uses FormSubmit (no data-processing agreement). Recommended: replace it with a Pages Function + Cloudflare Turnstile.
- The launch news post says "RESTART 2016–2020"; the kit and footer use THALIA 2021–2027. Confirm which is correct.
- Have the Centre's Data Protection Officer read `/privacy` and `/accessibility`.

## Commands

```bash
npm install        # once
npm run dev        # local preview at http://localhost:4321 (editor: /admin/index.html)
npm run build      # production build into dist/
```
