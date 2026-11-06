# effective-train

Slidev presentations monorepo (pnpm workspaces + Turborepo). Each deck in `apps/<name>` is its own app, deployed to GitHub Pages at `https://<owner>.github.io/effective-train/<name>/`.

## Commands

```sh
pnpm install
pnpm new my-talk                  # scaffold apps/my-talk
pnpm --filter my-talk dev         # live-edit one deck
pnpm build                        # turbo run build: every deck -> apps/<name>/dist (cached)
pnpm build:site                   # build + assemble dist/ (all decks + index page)
pnpm preview                      # serve dist/ locally
```

`BASE_PATH` sets the site root used in deck URLs (default `/`). CI sets it to `/<repo>/`. Locally, to mimic Pages:

```sh
BASE_PATH=/effective-train/ pnpm build:site
```

## Deploy

Push to `main`; `.github/workflows/deploy.yml` builds and publishes `dist/`.
One-time setup: repo **Settings → Pages → Source: GitHub Actions**.
