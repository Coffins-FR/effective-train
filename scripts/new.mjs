// Scaffold a new Slidev deck as its own workspace app: pnpm new <name>
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const name = process.argv[2]
if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
  console.error('Usage: pnpm new <name>  (lowercase letters, digits, dashes)')
  process.exit(1)
}

const dir = join(import.meta.dirname, '..', 'apps', name)
if (existsSync(dir)) {
  console.error(`apps/${name} already exists`)
  process.exit(1)
}
mkdirSync(dir, { recursive: true })

const pkg = {
  name,
  private: true,
  type: 'module',
  scripts: {
    dev: 'slidev --open',
    // BASE_PATH is the site root ("/" locally, "/<repo>/" on GitHub Pages).
    build: `slidev build --base \${BASE_PATH:-/}${name}/ --out dist`,
    export: 'slidev export',
  },
  dependencies: {
    '@slidev/cli': '^53.1.0',
    '@slidev/theme-default': '^0.25.0',
    vue: '^3.5.45',
  },
}
writeFileSync(join(dir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n')

writeFileSync(
  join(dir, 'slides.md'),
  `---
theme: default
title: ${name}
# Hash routing: deep links work on GitHub Pages without a per-deck 404.html
routerMode: hash
---

# ${name}

New presentation

---

# Slide 2

Edit \`apps/${name}/slides.md\`
`,
)

console.log(`Created apps/${name}\nNext: pnpm install && pnpm --filter ${name} dev`)
