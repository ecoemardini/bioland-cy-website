# BIOLAND-Cy website (v2) — instructions for Claude Code

Public website of BIOLAND-Cy (EXCELLENCE/0925/0163), a 24-month research project (July 2026 to June 2028) of the
ERATOSTHENES Centre of Excellence, Cyprus. Owner: Dr Mahmoud Mardini (coordinator).
Full background, accounts, open issues and the go-live plan: **read `docs/HANDOVER.md` at the start of every session.**

## Stack
- Astro 7 static site, Node 24 (`.node-version`). Hosted on Cloudflare Pages. Editor: Sveltia CMS at `/admin` (GitHub backend).
- Content: `src/content/` (news, events, workshops, deliverables, team), schemas in `src/content.config.ts`,
  editor fields in `public/admin/config.yml`. **Keep these two in step.**
- Design ("Night Orbit", chosen 10 Nov 2026): `src/styles/orbit.css`, loaded after `global.css` and scoped to `body.pa`. Display font Bricolage Grotesque (npm, self-hosted); signal colour sky blue `#95caea` from the logo, never orange.
- Site texts and funding statements: `src/data/site.json`. Images, alt text, credits and AI flags: `src/data/images.ts`.
- Security headers and CSP: `public/_headers`. Sign-in functions: `functions/api/` (env `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`).

## Commands
```bash
npm install
npm run dev      # http://localhost:4321  (editor: /admin/index.html)
npm run build    # must pass before every commit
npm run check    # astro check (installs @astrojs/check + typescript on first run)
```

## Rules (check every change against these)
1. English only (the Greek funding sentence is the exception).
2. No archaeological site names or locations anywhere (text, alt, captions, file names, metadata). No photos of individual sites.
3. No images of human remains: pictograms only.
4. Show the whole island of Cyprus; never crop or hide the Karpas; no imagery north of the buffer zone as a subject; no Kyrenia-range-like backdrops.
5. EU "Co-funded by the European Union" and Republic of Cyprus emblems visible without scrolling on every page, on desktop and on a 390 px phone; the EU emblem is at least as large as the BIOLAND-Cy lock-up and any other logo; logos on a light ground.
6. Never shorten or reword the funding statement except on the coordinator's instruction (`site.json`).
7. AI-generated images: `ai: true` in `images.ts` gives the "AI-generated image" caption; never remove the flag. The EU AI icon is no longer shown on pictures (coordinator, 10 Nov 2026). AI video is captioned "AI-generated video" (home page flyover). Reconstructions with people also say "the people are fictional".
8. Desk-based project: no excavation, sampling or fieldwork; no invented numbers; do not show the budget.
9. No cookies, trackers, third-party fonts or auto-loading embeds. Any new third party: disclose it in `/privacy` and allow it in `public/_headers`.
10. WCAG 2.2 AA (0 axe violations), real alt text, reduced-motion support, no horizontal scroll at 390 px.
11. Never commit secrets (`.dev.vars`, tokens, client secrets, any `passwords.txt`).

## Workflow
- Do not push to or merge into `main` (the live site) or the production branch without the coordinator's explicit OK. Work on a branch and open a pull request.
- Before you finish a task: `npm run build`, check the changed pages at 390 px and 1440 px, and list what changed.
- Content edits normally happen in `/admin`. Change code only for structure, design or fixes.
- When an item in `docs/HANDOVER.md` section 8 is done, update that section in the same commit.
- Ask before deleting files. Prefer small, reviewable commits with plain-English messages.
- Write for a non-developer: explain what changed and what the coordinator must do (dashboard settings, accounts) in plain words.
