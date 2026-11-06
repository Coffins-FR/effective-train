// Collect apps/<name>/dist into dist/<name>/ and write a dist/index.html listing every deck.
// Run after `turbo run build` (see the root "build:site" script).
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const appsDir = join(root, 'apps')
const out = join(root, 'dist')

const decks = readdirSync(appsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(appsDir, d.name, 'slides.md')))
  .map((d) => d.name)
  .sort()

const missing = decks.filter((n) => !existsSync(join(appsDir, n, 'dist', 'index.html')))
if (missing.length) {
  console.error(`Missing build output for: ${missing.join(', ')}. Run "turbo run build" first.`)
  process.exit(1)
}

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
for (const name of decks) cpSync(join(appsDir, name, 'dist'), join(out, name), { recursive: true })

const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const items = decks.map((n) => `<li><a href="./${encodeURIComponent(n)}/">${escape(n)}</a></li>`).join('\n      ')

writeFileSync(
  join(out, 'index.html'),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Presentations</title>
    <style>
      body { font-family: system-ui, sans-serif; max-width: 40rem; margin: 3rem auto; padding: 0 1rem; line-height: 1.6; }
    </style>
  </head>
  <body>
    <h1>Presentations</h1>
    <ul>
      ${items}
    </ul>
  </body>
</html>
`,
)

// Disable Jekyll so GitHub Pages serves every file as-is.
writeFileSync(join(out, '.nojekyll'), '')

console.log(`Assembled ${decks.length} deck(s) into dist/`)
