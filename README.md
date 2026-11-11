# Rubaiyat Ruhin · Portfolio

The personal site of Rubaiyat (Ru) Ruhin, a data analyst in Adelaide: case studies in SQL, Python and Power BI, plus a little life outside work.

**Live:** [rubaiyat.dev](https://rubaiyat.dev)

## Stack

| Layer         | Choice                                                                      |
| ------------- | --------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router) + TypeScript                                        |
| Styling       | Tailwind CSS 4, with the design's colours as CSS variables                  |
| Light / dark  | next-themes (follows the device first, then remembers the visitor's choice) |
| Motion        | GSAP + ScrollTrigger, Lenis smooth scrolling (from stage 2)                 |
| Content       | TypeScript data files in `content/` (projects, experience, about, site)     |
| Fonts         | Instrument Serif, Geist, Geist Mono, all self-hosted                        |
| Hosting       | Vercel, deployed from `main`; every pull request gets a preview link        |
| Visitor stats | Umami Cloud, routed through the site's own domain (no cookies)              |
| Tests         | Playwright on desktop Chrome and iPhone Safari, in GitHub Actions           |

## Run it locally

Needs Node.js 22.

```bash
npm install
cp .env.example .env.local   # fill in keys when the live-data stage arrives
npm run dev                  # http://localhost:3000
```

## Checks

```bash
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run format:check  # Prettier (npm run format to fix)
npm run build         # production build
npm run test:e2e      # Playwright, against the production build
```

GitHub Actions runs all of these on every pull request, and `main` only accepts a merge when they pass.

## Project layout

```
app/          pages, layout, fonts, global styles, API routes
components/   UI pieces, grouped by section (home, case, overlays, nav, ui)
content/      everything you edit as content: site details, projects, jobs, photos
lib/          shared helpers (live data, motion, analytics)
public/       images and the resume PDF, served as-is
tests/        Playwright end-to-end tests
```

## Adding content

- **A case study:** copy one of the objects in `content/projects.ts`, give it a new `slug`, and add its images to `public/images/projects/<slug>/`. The home page card, the page at `/projects/<slug>` and the "next project" chain all follow.
- **A smaller project:** add an entry to `moreProjects` in the same file.
- **A job:** add an entry to `content/experience.ts`.
- **A photo:** add it to `public/images/life/`, run `npm run clean-photos public/images/life` to strip location data, then add a line to `content/photos.ts`.
- **A new resume:** replace `public/resume/Rubaiyat-Ruhin-Resume.pdf`, keeping the name.

## Working on it

- `main` is always the live site. Work happens on a branch (`feat/…`, `fix/…`) and merges through a pull request after the preview is checked.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `feat: add resume viewer`, `fix: mobile nav overflow`.
- Secrets live in `.env.local` and Vercel's environment variables, never in the code.

## Security

Strict browser security headers are set in `next.config.ts`. Dependabot opens weekly update pull requests. The site has no login, database or forms.

© Rubaiyat Ruhin. The code is shared for reference; the writing, photos and resume are not licensed for reuse.
