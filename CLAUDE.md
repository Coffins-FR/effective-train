# CLAUDE.md

Slidev presentations monorepo: pnpm workspaces + Turborepo, deployed to GitHub Pages.

## Structure

- `apps/<name>/` — one Slidev deck per workspace package (`package.json` + `slides.md`). Package name = directory name = URL segment.
- `scripts/new.mjs` — scaffolds a deck (`pnpm new <name>`). Update it when changing deck conventions (deps, scripts, headmatter).
- `scripts/assemble.mjs` — copies `apps/*/dist` into root `dist/<name>/`, writes `dist/index.html` + `.nojekyll`.
- `turbo.json` — `build` (outputs `dist/**`, hashes `BASE_PATH`), `dev` (persistent, uncached).
- `.github/workflows/deploy.yml` — on push to `main`: `pnpm build:site` with `BASE_PATH=/<repo>/`, then deploy Pages.

## Commands

```sh
pnpm install
pnpm new <name>                          # new deck in apps/<name>
pnpm --filter <name> dev                 # live-edit one deck
pnpm build                               # turbo run build (all decks, cached)
BASE_PATH=/effective-train/ pnpm build:site   # build + assemble, Pages-like URLs
pnpm preview                             # serve dist/
```

## Conventions

- Root `package.json` scripts only delegate to `turbo run`; task logic lives in each deck's `package.json`. Use `turbo run`, never the `turbo <task>` shorthand, in scripts and CI.
- Deck `build` script must be `slidev build --base ${BASE_PATH:-/}<name>/ --out dist` — base path must match the deck's subpath or assets 404 on Pages. Requires a POSIX shell.
- Decks use `routerMode: hash` in headmatter: GitHub Pages has only one root `404.html`, so history-mode deep links would break.
- Any new env var read during build must be added to the `build` task `env` in `turbo.json`, else turbo serves stale cache.
- Commit `pnpm-lock.yaml`; CI installs with `--frozen-lockfile`.
- Deck names: lowercase letters, digits, dashes.
