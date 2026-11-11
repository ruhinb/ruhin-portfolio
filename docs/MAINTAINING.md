# Maintaining the site

Notes for keeping rubaiyat.dev up to date. The [README](../README.md) describes the site itself.

## Keys and settings

Copy `.env.example` to `.env.local` for local work. On Vercel the same names live under
Project → Settings → Environment Variables. Secrets (Spotify, football-data) are never
committed, and nothing secret is prefixed with `NEXT_PUBLIC_`.

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
- **A new resume:** replace `public/resume/Rubaiyat-Ruhin-Resume.pdf`, keeping the name, and replace `Rubaiyat-Ruhin-Resume.webp` (the on-page preview, an image of the page about 1650px wide) to match.

## Working on it

- `main` is always the live site. Work happens on a branch (`feat/…`, `fix/…`) and merges through a pull request after the preview is checked.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `feat: add resume viewer`, `fix: mobile nav overflow`.
- Secrets live in `.env.local` and Vercel's environment variables, never in the code.

## Security

Strict browser security headers are set in `next.config.ts`. Dependabot opens weekly update pull requests. The site has no login, database or forms.

## Visitor stats

Umami Cloud (cloud.umami.is). The script and its requests go through `/u/` on this site
(see the rewrites in `next.config.ts`), and only visits to rubaiyat.dev are counted. To
stop counting your own visits, run `localStorage.setItem("umami.disabled", 1)` once in the
browser console on each of your devices.
