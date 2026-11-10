# BIOLAND-Cy website: handover for Claude Code

Prepared 10 November 2026 (project month 5) for Dr Mahmoud Mardini, Project Coordinator.
This file travels with the code (`docs/HANDOVER.md`). `CLAUDE.md` at the repository root holds the short rules that
Claude Code loads automatically; this file is the full background. Keep section 8 up to date as items are closed.

---

## 1. Where things stand

| Item | State |
|---|---|
| Live website | **v2** (this site) live at https://biolandcy.eu since 10 Nov 2026, built by Cloudflare Pages project `bioland-cy-website` from branch `v2`. The old v1 (plain HTML + Decap CMS, branch `main`, source `D2.2_Website_Social_Media/site/`) is kept for rollback. |
| Redesign | **v2 "From orbit to ground"** (Astro 7 + Sveltia CMS), complete and tested, **not yet live**. Source: `D2.2_Website_Social_Media/site_v2/` (this folder). A built copy is in `Website_v2_redesign/site_v2_preview_build/`. |
| Other designs | Ten more directions (B to I, C2, E2) were built as prototypes with only a home page and a News page. v2 is "Option A" in that set. **No option has been chosen yet** (see 8.1). |
| Deliverable | D2.2 "Project Website and Social Media Channels" (WP2, public, due M3). Plan: `BIOLAND-Cy_D2.2_Website_Social_Media.md` in the D2.2 folder. |
| Separate tool | The project dashboard (https://dashboard.biolandcy.eu) lives in a different private repo, `ecoemardini/bioland-cy-dashboard`. It is out of scope here. |

Folder on the coordinator's PC: `D:\ECoE\07_Cowork\Projects\03_BIOLANDCy\BIOLAND-Cy\02_WP2_Dissemination\D2.2_Website_Social_Media\`

---

## 2. Project facts the website depends on

| Fact | Value | Source |
|---|---|---|
| Name | BIOLAND-Cy: Bioarchaeology and Integrated Observation for LANdscape Dynamics in Cyprus | Proposal |
| Code | EXCELLENCE/0925/0163 | Proposal, RIF contract invitation |
| Scheme | RIF "RESTART 2016-2020" Programmes, Pillar II, **Excellence Hubs** programme, call EXCELLENCE/0925 | Proposal cover; contract invitation 29/04/2026 |
| Funding source | Co-financed by the **Republic of Cyprus** and the **ERDF** through the Cohesion Policy Programme **"THALIA 2021-2027"** (ΘΑλΕΙΑ), Priority 1, Specific Objective 1(i) | EXCELLENCE/0925 call document, p. 1 |
| Implementer | ERATOSTHENES Centre of Excellence (ECoE), Limassol: single beneficiary | Proposal |
| Duration | 1 July 2026 (M1) to 30 June 2028 (M24) | Contract |
| Budget | €120,000. **Do not show it on the site** (removed on 30 June 2026). | Proposal |
| Method | Desk-based. Satellite Earth Observation plus **already-published** bioarchaeological evidence. No excavation, fieldwork or sampling. | Proposal |
| Deliverables | 19 (D1.1 to D5.3). Dissemination levels: D1.1, D1.2, D1.3, D1.4 and D2.3 are **confidential**; all others public. | Proposal deliverables table |
| Public workshop | Months 18 to 24 (Milestone M2.5 and D2.5 at M24, June 2028) | Proposal |
| Website KPI | 200+ unique visitors (measured with analytics). Social media: 200+ followers. | Proposal KPI table |
| Licences | Data CC BY 4.0 with DOIs on Zenodo; code MIT; open-access papers | Proposal |
| Contact | mahmoud.mardini@eratosthenes.org.cy | Site settings |

---

## 3. Accounts and infrastructure

**Secrets are not in this file and must never be written into the repository.**

| Service | What it does | Where it is set up |
|---|---|---|
| GitHub `ecoemardini/bioland-cy-website` (public) | Holds the site. Every commit to the production branch redeploys. | Coordinator's GitHub account |
| Cloudflare Pages, project `bioland-cy-website` | Builds and hosts v1 from `main`. Fallback address `bioland-cy-website.pages.dev`. | Coordinator's Cloudflare account |
| Domain `biolandcy.eu` | Registered 2 July 2026 at **Namecheap on a personal account**, 2 years, auto-renew. Nameservers point to Cloudflare; apex and www point to the Pages project. | Namecheap and Cloudflare |
| GitHub OAuth App | Lets editors sign in to `/admin`. `functions/api/login.js` and `callback.js` use the env vars `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`. | GitHub, Settings, Developer settings, OAuth Apps; values in Cloudflare Pages, Settings, Variables |
| MailerLite | Newsletter: account 2487439, form 192226950526273108 (in `src/components/Newsletter.astro`). Sends from news@biolandcy.eu (DKIM and SPF set; **no DMARC yet**). | MailerLite account |
| FormSubmit | Contact form posts to `https://formsubmit.co/<contact e-mail>`. The first message after a new deployment needs a one-time "Activate" click in the e-mail. | No account |
| Cloudflare Web Analytics | Cookieless visitor counts for the 200+ KPI. Turned on for v1 in July 2026. | Cloudflare dashboard |

Warning: a plaintext file `passwords.txt` sits in the D2.2 folder. Never copy it into the repository or any prompt.
Move its contents to a password manager and delete the file.

---

## 4. Setting up Claude Code on the coordinator's PC (Windows)

1. Install **Git for Windows** and **Node.js 24 LTS**. `.node-version` says 24; `package.json` requires Node >= 22.23.4.
2. Install Claude Code (see docs.claude.com, "Claude Code"), then sign in.
3. Work in a clone **outside OneDrive**. OneDrive syncing `node_modules` is slow and causes conflicts.

```powershell
mkdir D:\dev; cd D:\dev
git clone https://github.com/ecoemardini/bioland-cy-website.git
cd bioland-cy-website
git switch -c v2                      # new branch; the live main branch is not touched
git rm -r -q .                        # empty the branch (v1 stays safe on main)
# copy the CONTENTS of ...\D2.2_Website_Social_Media\site_v2\ into D:\dev\bioland-cy-website\
robocopy "D:\ECoE\07_Cowork\Projects\03_BIOLANDCy\BIOLAND-Cy\02_WP2_Dissemination\D2.2_Website_Social_Media\site_v2" . /E /XD node_modules dist .astro
npm install
npm run build                         # must finish without errors (about 2 minutes the first time)
git add -A; git commit -m "Website v2 (Astro + Sveltia CMS)"
git push -u origin v2
claude                                # start Claude Code in this folder
```

4. Local preview: `npm run dev` gives http://localhost:4321. The editor is at http://localhost:4321/admin/index.html.
   Sign-in works only on the real domain. On a preview, use "Sign in using access token" with a GitHub
   fine-grained token for this one repository.
5. Optional, to test the sign-in functions locally: `npx wrangler pages dev dist` with a `.dev.vars` file holding
   `GITHUB_CLIENT_ID=` and `GITHUB_CLIENT_SECRET=`. `.dev.vars` is in `.gitignore`; keep it that way.
6. `npm run check` (astro check) asks to install `@astrojs/check` and `typescript` the first time. Accept, and commit
   them as devDependencies.

From now on, edit the code in `D:\dev\bioland-cy-website`. The `site_v2` folder in OneDrive becomes a snapshot.
Do not keep editing both copies.

---

## 5. How v2 is built

| Path | What it is |
|---|---|
| `src/pages/` | Home, research & objectives (project summary, aims, six objectives, method, work packages), outputs, news & events (list plus `[slug]`), about & team (team, host, funding, image credits), contact, privacy, accessibility, 404. Build format `file`, so pages are `/about.html` served as `/about`. |
| `src/content/` | Everything editors change, one file per item: `news/<date-slug>/index.md` (images next to it) holds news **and events/workshops** (field `type`; merged into one "News & events" section and page on 10 Nov 2026; `/events` redirects to `/news`), `deliverables/D*.json`, `team/*.json` |
| `src/content.config.ts` | Zod schemas for the collections. **Must match `public/admin/config.yml`** field for field. |
| `src/data/site.json` | Site texts: hero, description, contact, social links, **funding statements (EN and EL)**. Editable in /admin, Site settings. |
| `src/data/images.ts` | Image registry: alt text, caption and credit for every picture. AI pictures are flagged `ai: true` and get the "AI-generated image" caption automatically (no icon since 10 Nov 2026). Copernicus credit string `COPERNICUS`. |
| `src/lib/content.ts` | Sorting and dates. Project month helper (M1 = July 2026). The `WPS` list of work packages. |
| `src/components/` | Header (EU and Republic of Cyprus emblems on desktop), FunderBar (emblems strip on phones, above the header), Footer (all four logos and the funding statements), LayerStack, Compare, Film, Timeline, Newsletter and others |
| `src/styles/global.css` | Base layout and components from the October build (brand book v2.5 tokens). |
| `src/styles/orbit.css` | The chosen "Night Orbit" design (10 Nov 2026), loaded after `global.css`, scoped to `body.pa`: dark ground, Bricolage Grotesque display type (npm `@fontsource-variable/bricolage-grotesque`), JetBrains Mono read-outs, sky blue `#95caea` accent. Home sections: pointer lens, 3D layer stack, real/AI flyover slider, gallery with filters. |
| `public/media/` | `flight-troodos-720.*` = real-data flight. `flyover-ai-final-720.mp4` = AI-generated reconstruction of the same flight (Higgsfield, Seedance 2.5, 10 Nov 2026), shown beside it in the slider. Higgsfield originals and earlier drafts are in the D2.2 folder. |
| `src/scripts/site.ts` | Small client scripts: menu, motion toggle, newsletter submit (no-cors post to MailerLite), compare slider |
| `public/admin/` | Sveltia CMS: `index.html` and `config.yml` (backend GitHub, repo `ecoemardini/bioland-cy-website`, **branch `main`**, `base_url https://www.biolandcy.eu`, `auth_endpoint api/login`) |
| `public/_headers` | Security headers and a strict **Content-Security-Policy**. Any new third-party script, form target or font must be added here, or it is blocked. |
| `public/_redirects` | Old v1 addresses to new pages |
| `public/brand/` | Logos and funder logos (SVG). Use only these files. |
| `public/media/` | Real-data 3D flight video (MP4 and WebM) |
| `functions/api/` | Cloudflare Pages Functions for the GitHub sign-in |

Checked on 27 October 2026: axe-core WCAG 2.2 AA, 0 violations on all pages (light, dark, phone).
Lighthouse mobile: performance 93 to 99, accessibility 100, SEO 100. No horizontal scrolling at 390 px.

---

## 6. Rules (non-negotiable)

These come from the coordinator's decisions and the EU/RIF visibility rules. Claude Code must check every change against them.

**Content**
- English only. The Greek funding sentence in the footer is the one exception.
- **No archaeological site names or locations** anywhere: text, alt text, captions, map labels, file names or metadata. No photos of individual archaeological sites.
- Never use the eoviz `SITES` list, `L_sites.png` or the D1W stack figure.
- **No images of human remains.** Use pictograms only, such as `assets/icons/human_tooth.svg`.
- Desk-based project: never suggest new excavation, sampling or fieldwork. Do not invent numbers. Every figure must come from the proposal or a checked source. Do not show the budget.
- Image credits stay complete. Radar coherence is **autumn 2020** (Kellndorfer et al. 2022, CC BY 4.0). Copernicus credit as in `images.ts`.
- Photos of people only with consent. The office photo `ecoe_offices/20260910_162143.jpg` shows the Wi-Fi password: never use it uncropped.

**Maps and images of Cyprus**
- Always show the **whole island**. Never crop or hide the Karpas peninsula.
- No imagery of areas north of the buffer zone used as a subject, and no Kyrenia-range-like backdrops.

**Funder visibility (EU Common Provisions Regulation Annex IX; RIF Work Programme 5.4)**
- The EU "Co-funded by the European Union" emblem and the Republic of Cyprus emblem are **visible without scrolling** on every page, on desktop and on phone.
- The EU emblem is at least as large as the BIOLAND-Cy lock-up and as the largest other logo.
- Logos sit on a light ground.
- The funding statement is never shortened (`site.json` `funding_en` and `funding_el`).
- AI-generated images carry an "AI-generated image" caption (and AI video "AI-generated video"). Set `ai: true` in `images.ts`; never remove the flag. The EU AI icon was dropped at the coordinator's request on 10 Nov 2026.

**Privacy and security**
- No cookies, no trackers, no third-party fonts, no embedded social media that loads before a click.
- Any new third-party service must be disclosed in `/privacy` **and** allowed in `public/_headers`.
- Secrets live only in Cloudflare environment variables or `.dev.vars`. Never commit tokens, client secrets or `passwords.txt`.

**Accessibility and quality**
- WCAG 2.2 AA. Keep 0 axe violations. Keep reduced-motion support (the footer toggle and `prefers-reduced-motion`).
- Every image needs real alt text. Decorative images get empty alt.
- `npm run build` must pass before every commit. Check on a 390 px phone view and on desktop.

**Workflow**
- Do not push to `main` (live v1) or merge into it without the coordinator's explicit OK.
- Work on branches. Open a pull request into `v2` (or into `main` after the switch) and describe what changed.
- Keep `content.config.ts` and `public/admin/config.yml` in step whenever a field changes.

---

## 7. Going live with v2 (no downtime, instant rollback)

**What was actually done (10 Nov 2026):** instead of a second Pages project, the existing project `bioland-cy-website` was switched: build command `npm run build`, output `dist`, production branch `v2`. The GitHub sign-in variables and the custom domains stayed in place. **Rollback:** Workers & Pages, bioland-cy-website, Deployments, open the last `main` production deployment (commit `edefc08`), Rollback. The steps below are the original plan, kept for reference.

1. Push to branch `v2` (section 4).
2. Cloudflare, Workers & Pages, Create, Pages, Connect to Git: same repository, production branch `v2`.
   Build command `npm run build`, output `dist`, Node from `.node-version`. Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.
3. Check the `….pages.dev` preview on a phone and a computer.
4. Settle the open items in 8.1 that block launch.
5. Move the custom domains: remove `biolandcy.eu` and `www.biolandcy.eu` from the old project and add them to the new one.
   Add a redirect rule so the non-canonical host 301-redirects to the canonical one.
6. Rollback: move the domains back to the old project.
7. After the switch, set `branch:` in `public/admin/config.yml` to the production branch, so editors save to the live branch.

---

## 8. Known issues and open decisions (keep this list current)

### 8.1 Before v2 goes live

| # | Issue | What to do | Where |
|---|---|---|---|
| 1 | ~~Design not chosen~~ **Done 10 Nov 2026:** the coordinator chose the new "Night Orbit" design (dark ground, condensed headline, pointer lens, 3D layer stack). It is applied to every page through `src/styles/orbit.css`. Prototypes B, C and D remain under `src/pages/design/` and must be deleted before launch. | Delete `src/pages/design/` and `src/layouts/Proto.astro` before go-live. | Options source: `Website_options_2026-10-28/BIOLAND-Cy_website_options_source.zip` (rebuild with `tools/build_options.sh`) |
| 2 | ~~Canonical host mismatch~~ **Done 10 Nov 2026:** the coordinator chose `https://biolandcy.eu` (apex). Set in Astro `site`, editor `base_url`/`site_url`, contact `_next`, robots.txt and the structured data. The GitHub OAuth App callback was already on the apex. Still to do: a Cloudflare redirect rule www to apex. Original text: **Canonical host mismatch.** v1 runs on the apex `biolandcy.eu`. v2 assumes `www` (`astro.config.mjs` `site`, `config.yml` `base_url`, contact form `_next`). v1's editor uses `base_url: https://biolandcy.eu`, so the GitHub OAuth App callback is almost certainly on the apex. GitHub accepts only one callback host, so `/admin` sign-in fails if they differ. | Pick one host and use it everywhere: Astro `site`, `config.yml` `base_url` and `site_url`, contact `_next`, OAuth App homepage and callback, Cloudflare redirect rule. | `astro.config.mjs`, `public/admin/config.yml`, `src/pages/contact.astro` |
| 3 | **Open (coordinator confirms the contract wording, week of 16 Nov 2026).** **Funding statement.** Current text names only THALIA. The confirmed facts: RESTART 2016-2020 scheme (Excellence Hubs), co-financed by the ERDF and the Republic of Cyprus through THALIA 2021-2027. | Check the exact required sentence in the signed contract's publicity clause (IRIS) or the current RESTART Work Programme. Then update `funding_en` and `funding_el` once, in `site.json`. | `src/data/site.json` |
| 4 | **In progress 10 Nov 2026:** replacement wording drafted for the coordinator (keeps Web Analytics, discloses the beacon). Not yet saved. Original text: **Analytics versus privacy text.** Cloudflare Web Analytics is on (needed for the 200+ visitors KPI) and the CSP allows its beacon. But `/privacy` says "we do not use analytics scripts". | Recommended: keep Web Analytics (cookieless, no personal data stored) and correct the privacy text. Otherwise turn it off and measure the KPI another way. | `src/pages/privacy.astro`, `public/_headers` |
| 5 | **Partly done 10 Nov 2026:** MailerLite refuses double opt-in ("account is not approved"), so the site texts now describe single opt-in. DMARC record added in Cloudflare (`_dmarc`, `v=DMARC1; p=none; adkim=r; aspf=r`). To do: get the MailerLite account approved, then turn on double opt-in and restore the confirmation wording. Original text: **Newsletter opt-in mismatch.** `/privacy` and the form promise double opt-in. MailerLite was set to single opt-in in July 2026 (check whether it has changed since). | Turn on double opt-in in MailerLite (recommended), or change the text. Add a DMARC record for biolandcy.eu. | MailerLite; `privacy.astro`; `Newsletter.astro`; `site.ts` |
| 6 | **Contact form uses FormSubmit.** There is no data-processing agreement and data may leave the EU. It is disclosed in `/privacy`. | Recommended: a Pages Function that sends e-mail, with Cloudflare Turnstile. Alternatively a plain mailto link. Update the CSP `form-action` and `/privacy` to match. | `src/pages/contact.astro`, `functions/`, `public/_headers` |
| 7 | ~~Wrong or placeholder events~~ **Done 10 Nov 2026:** all event entries were removed on the coordinator's instruction; he adds events through `/admin`. Original text: **Wrong or placeholder events.** "Project Kick-off Meeting, 1 July 2026, Eratosthenes CoE, Limassol" is wrong. "Site Selection Workshop, 15 September 2026" needs checking. "Public Workshop, 15 March 2028" is a placeholder (the proposal says M18 to M24). | Kick-off: 24 November 2026, 10:00, True Heart Cafe, Nicosia, hybrid, marked "by invitation". Confirm or delete the September workshop. Mark the 2028 date as "date to be confirmed", or set it as a draft. | `src/content/events/` |
| 8 | ~~Confidential deliverables default to public~~ **Done 10 Nov 2026:** `"public": false` added to D1.1 to D1.4 and D2.3. Original text: **Confidential deliverables default to public.** D1.1 to D1.4 and D2.3 have no `public` field, so the schema default `true` applies. | Add `"public": false` to those five files, so a PDF uploaded by mistake is never offered for download. | `src/content/deliverables/` |
| 9 | **Deliverable statuses are out of date.** D2.1 and D2.2 (due M3) still say "in-progress". | Coordinator updates the statuses. | `src/content/deliverables/` |
| 10 | Data Protection Officer review of `/privacy` and `/accessibility` | Coordinator, after items 4 to 6 are settled | Pages above |

### 8.2 After launch

- **Team page:** it shows 3 people (Mardini, Livadiotis, Dimitriou). The coordinator decides whether to add Dr Dante Abate (Cluster Leader), Dr Konstantinos Roussos, Dr Maria Cristina Salvi and George Leventis, with their consent.
- **Social links:** all empty in `site.json`. Fill them in once the accounts exist (KPI: 200+ followers).
- **News:** add a kick-off news post after 24 November 2026, with a consented group photo and the funder logos visible.
- **Outputs:** add Zenodo DOIs as datasets are released. D3.1 (Environmental Baseline Dataset) is due M6, December 2026.
- **GeoHub:** link the BIOLAND GeoHub (D5.2, M24) when it exists.
- **Domain:** move `biolandcy.eu` from the personal Namecheap account to an ECoE-controlled account. D2.2 promises at least 5 years of hosting after the project.
- **Upgrades:** keep Astro and Sveltia CMS updated (`npm outdated`). Re-run the accessibility and Lighthouse checks after each upgrade.

---

## 9. First prompts to try in Claude Code

1. "Read CLAUDE.md and docs/HANDOVER.md, then run `npm install` and `npm run build`. Summarise any errors and the open items in section 8.1. Don't change anything yet."
2. "Fix item 8 in section 8.1: set the five confidential deliverables to not public. Run the build and show me the diff."
3. "Update the kick-off event to 24 November 2026, 10:00, True Heart Cafe, Nicosia, hybrid, by invitation. Show me how it will look on the Events page."
4. "Rewrite the analytics paragraph in /privacy to disclose Cloudflare Web Analytics (cookieless). Show me the text before you save it."
5. "Check every page against the rules in CLAUDE.md (emblems visible without scrolling at 390 px and 1440 px, no site names, AI images flagged) and report what fails."

---

## 10. Reference files (on the coordinator's PC)

- `D2.2_Website_Social_Media/site_v2/README.md`: build settings and switch-over steps
- `D2.2_Website_Social_Media/BIOLAND-Cy_Website_Publish_Guide.md`: history of the v1 setup (GitHub, Cloudflare, OAuth, domain)
- `D2.2_Website_Social_Media/BIOLAND-Cy_D2.2_Website_Social_Media.md`: the D2.2 plan (sitemap, KPIs, launch criteria, maintenance)
- `D2.2_Website_Social_Media/Website_options_2026-10-28/README_website_options.md`: the eleven design options
- `D2.1_Communication_Kit/`: logos, brand book, fonts (`6_Fonts`), templates
- `03_BIOLANDCy/CHANGELOG.md`: full project history. Website entries: 2 July 2026 (deployed), 6 July 2026 (newsletter, analytics), 27 October 2026 (v2).
- `03_BIOLANDCy/EXCELLENCE_0925_0163_MM_Final.docx`: the proposal (deliverables, KPIs, WP texts)
- EXCELLENCE/0925 call document: https://iris.research.org.cy/file/public/8141125b-8d94-f011-81ab-005056ab00f0
