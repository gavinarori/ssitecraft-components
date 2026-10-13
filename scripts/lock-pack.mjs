#!/usr/bin/env node
/**
 * Locks a collection: moves its HTML out of the public folder (where anyone can download it)
 * into src/data/code/<collection>, where only the gated API route can read it.
 *
 *   node scripts/lock-pack.mjs application-ui-login
 *
 * Afterwards, in src/data/components/<collection>.mdx add:
 *   access: pro
 *   price: 29
 *   lemonsqueezy: 123456      # variant ID of the product in Lemon Squeezy
 *   free: [1]                 # optional: samples left open
 * and (optionally) run  node scripts/make-previews.mjs <collection>  for locked-state screenshots.
 */
import { existsSync, mkdirSync, renameSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const id = process.argv[2]
if (!id || !/^[a-z0-9-]+$/i.test(id)) {
  console.error('Usage: node scripts/lock-pack.mjs <category-slug>   e.g. application-ui-login')
  process.exit(1)
}

const from = join(process.cwd(), 'public/components', id)
const to = join(process.cwd(), 'src/data/code', id)

if (!existsSync(from)) {
  console.error(`Nothing at ${from}. Already locked, or the folder name differs (it is case-sensitive).`)
  process.exit(1)
}
mkdirSync(join(process.cwd(), 'src/data/code'), { recursive: true })
if (existsSync(to)) {
  console.error(`${to} already exists. Remove it first if you want to redo this.`)
  process.exit(1)
}
renameSync(from, to)
console.log(`Moved ${readdirSync(to).length} files:\n  ${from}\n  -> ${to}`)
console.log('\nNext: set access: pro, price and lemonsqueezy in the collection MDX, then redeploy.')
console.log('Reminder: git history still contains the old public files. Anyone who cloned earlier keeps them.')
