#!/usr/bin/env node
/**
 * Publishes a template from its own project folder:
 *   build -> noindex + theme bridge -> deploy demo -> screenshots -> zip -> upload -> MDX record
 *
 * Run from inside the template project (the one with template.config.json):
 *   node /path/to/sitecraft/scripts/template-publish.mjs [flags]
 *
 * Flags: --skip-build --skip-deploy --skip-screens --skip-upload --force --lighthouse
 *
 * template.config.json:
 *   { "slug": "northwind-agency", "title": "Northwind Agency", "tagline": "...", "category": "agency",
 *     "stack": ["Next.js", "Tailwind CSS"], "version": "1.0.0", "buildCommand": "npm run build",
 *     "outDir": "out", "pages": [{ "label": "Home", "path": "/" }], "darkMode": true,
 *     "sitecraftDir": "../sitecraft" }
 *
 * Env: DEMO_ORIGIN_PATTERN (e.g. https://{slug}.demo.example.com)  DEPLOY_COMMAND (gets OUT_DIR, SLUG)
 *      CHROME_PATH  NEXT_PUBLIC_SITE_URL  S3_ENDPOINT S3_REGION S3_BUCKET S3_ACCESS_KEY_ID S3_SECRET_ACCESS_KEY
 */
import { createWriteStream, existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, extname } from 'node:path'
import { execSync } from 'node:child_process'
import { pipeline } from 'node:stream/promises'

const args = new Set(process.argv.slice(2))
const flag = (name) => args.has(`--${name}`)
const log = (message) => console.log(`\n> ${message}`)
const die = (message) => {
  console.error(`\nERROR: ${message}`)
  process.exit(1)
}

const cwd = process.cwd()
const configPath = join(cwd, 'template.config.json')
if (!existsSync(configPath)) die('template.config.json not found. Run this from the template project folder.')
const config = JSON.parse(readFileSync(configPath, 'utf-8'))

const slug = config.slug
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? '')) die('config.slug must be lowercase letters, numbers and dashes')
for (const key of ['title', 'version']) if (!config[key]) die(`config.${key} is required`)

const outDir = resolve(cwd, config.outDir ?? 'out')
const siteDir = resolve(cwd, config.sitecraftDir ?? '../sitecraft')
if (!existsSync(join(siteDir, 'src/data/templates')) && !flag('skip-upload') && !existsSync(siteDir)) {
  die(`Sitecraft folder not found at ${siteDir}. Set sitecraftDir in template.config.json.`)
}
const origin = (process.env.DEMO_ORIGIN_PATTERN ?? '').replace('{slug}', slug).replace(/\/+$/, '')
const run = (command, env = {}) => execSync(command, { cwd, stdio: 'inherit', env: { ...process.env, ...env } })

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

// ---------- 1. build ----------
if (!flag('skip-build')) {
  log('Building')
  run(config.buildCommand ?? 'npm run build')
}
if (!existsSync(outDir)) die(`Build output not found at ${outDir}. The template must export a static site (output: 'export').`)

// ---------- 2. noindex + theme bridge ----------
log('Preparing demo HTML (noindex + theme bridge)')
const bridge = `<script data-sitecraft-bridge>addEventListener('message',function(e){var d=e.data;if(!d||d.source!=='sitecraft'||d.type!=='theme')return;if(e.origin!==${JSON.stringify(process.env.NEXT_PUBLIC_SITE_URL ?? '')})return;var dark=d.value==='dark';document.documentElement.classList.toggle('dark',dark);document.documentElement.style.colorScheme=dark?'dark':'light'})</script>`
const robots = '<meta name="robots" content="noindex,nofollow" data-sitecraft-noindex>'
let patched = 0
for (const file of walk(outDir).filter((f) => extname(f) === '.html')) {
  let html = readFileSync(file, 'utf-8')
  if (html.includes('data-sitecraft-bridge')) continue
  if (!html.includes('</head>')) continue
  html = html.replace('</head>', `${robots}${bridge}</head>`)
  writeFileSync(file, html)
  patched++
}
writeFileSync(join(outDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n')
console.log(`  ${patched} pages patched`)
if (!process.env.NEXT_PUBLIC_SITE_URL) console.warn('  WARNING: NEXT_PUBLIC_SITE_URL is not set, so the dark-mode bridge will ignore every message.')

// ---------- 3. deploy ----------
if (!flag('skip-deploy')) {
  if (!process.env.DEPLOY_COMMAND) die('DEPLOY_COMMAND is not set (use --skip-deploy to skip). It runs with OUT_DIR and SLUG in its environment.')
  log('Deploying demo')
  run(process.env.DEPLOY_COMMAND, { OUT_DIR: outDir, SLUG: slug })
}

// ---------- 4. screenshots ----------
const publicDir = join(siteDir, 'public/templates', slug)
const screenshots = { cover: null, tall: null, gallery: [] }
if (!flag('skip-screens')) {
  if (!origin) die('DEMO_ORIGIN_PATTERN is not set, so there is nowhere to take screenshots from (use --skip-screens).')
  log('Taking screenshots')
  mkdirSync(publicDir, { recursive: true })
  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined })
  const pages = config.pages?.length ? config.pages : [{ label: 'Home', path: '/' }]
  const url = (path) => `${origin}/${path.replace(/^\/+/, '')}`

  async function shoot(path, width, height, file, fullPage = false) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.goto(url(path), { waitUntil: 'networkidle', timeout: 45_000 })
    await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' })
    await page.evaluate(() => document.fonts.ready)
    const target = join(publicDir, file)
    if (fullPage) {
      const full = await page.evaluate(() => document.documentElement.scrollHeight)
      await page.screenshot({ path: target, type: 'jpeg', quality: 80, clip: { x: 0, y: 0, width, height: Math.min(full, 6000) } })
    } else {
      await page.screenshot({ path: target, type: 'jpeg', quality: 82 })
    }
    await context.close()
    return `/templates/${slug}/${file}`
  }

  try {
    screenshots.cover = await shoot(pages[0].path, 1440, 900, 'cover.jpg')
    screenshots.tall = await shoot(pages[0].path, 1440, 900, 'tall.jpg', true)
    screenshots.gallery.push(await shoot(pages[0].path, 820, 1100, 'tablet.jpg'))
    screenshots.gallery.push(await shoot(pages[0].path, 390, 844, 'mobile.jpg'))
    for (const [index, page] of pages.slice(1, 4).entries()) {
      screenshots.gallery.push(await shoot(page.path, 1440, 900, `page-${index + 2}.jpg`))
    }
  } finally {
    await browser.close()
  }
  console.log(`  saved to ${publicDir}`)
}

if (flag('lighthouse')) {
  log('Lighthouse')
  if (!origin) console.warn('  skipped: DEMO_ORIGIN_PATTERN is not set')
  else {
    try {
      run(`npx --yes lighthouse ${origin} --quiet --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./.template-build/lighthouse.json`)
      console.log('  report: .template-build/lighthouse.json. Scores are NOT written to the MDX, copy them over by hand if you want to show them.')
    } catch {
      console.warn('  lighthouse failed; continuing')
    }
  }
}

// ---------- 5. zip + upload ----------
if (!flag('skip-upload')) {
  log('Packaging source')
  mkdirSync(join(cwd, '.template-build'), { recursive: true })
  const zipPath = join(cwd, '.template-build', `${slug}-${config.version}.zip`)
  const { default: archiver } = await import('archiver')
  const archive = archiver('zip', { zlib: { level: 9 } })
  const done = pipeline(archive, createWriteStream(zipPath))
  archive.glob('**/*', { cwd, dot: true, ignore: ['node_modules/**', '.git/**', '.next/**', 'out/**', '.template-build/**', '.env', '.env.*', '**/.DS_Store'] })
  await archive.finalize()
  await done
  console.log(`  ${zipPath} (${(statSync(zipPath).size / 1e6).toFixed(1)} MB)`)

  for (const name of ['S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY']) if (!process.env[name]) die(`${name} is not set (use --skip-upload to skip)`)
  const { S3Client, PutObjectCommand, HeadObjectCommand } = await import('@aws-sdk/client-s3')
  const client = new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: Boolean(process.env.S3_ENDPOINT),
    credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY },
  })
  // Must match zipKey() in lib/storage.js
  const Key = `templates/${slug}/${slug}-${config.version}.zip`

  const exists = await client.send(new HeadObjectCommand({ Bucket: process.env.S3_BUCKET, Key })).then(() => true, () => false)
  if (exists && !flag('force')) die(`${Key} is already uploaded. Bump "version" in template.config.json, or pass --force to overwrite.`)

  log(`Uploading ${Key}`)
  await client.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key, Body: readFileSync(zipPath), ContentType: 'application/zip' }))
}

// ---------- 6. MDX record ----------
log('Writing the template record')
const { parse, stringify } = await import('yaml')
const mdxPath = join(siteDir, 'src/data/templates', `${slug}.mdx`)
mkdirSync(join(siteDir, 'src/data/templates'), { recursive: true })

let previous = {}
let body = '\n## About this template\n\nDescribe the template here.\n'
if (existsSync(mdxPath)) {
  const match = readFileSync(mdxPath, 'utf-8').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (match) {
    previous = parse(match[1]) ?? {}
    body = `\n${match[2].replace(/^\n+/, '')}`
  }
}

// Fields the script owns are overwritten. Fields you edit by hand (price, status, copy, provider IDs) are kept.
const frontmatter = {
  title: config.title,
  tagline: config.tagline ?? previous.tagline ?? '',
  category: config.category ?? previous.category ?? 'general',
  stack: config.stack ?? previous.stack ?? [],
  status: previous.status ?? 'draft',
  version: config.version,
  updated: new Date().toISOString().slice(0, 10),
  ...(previous.featured != null && { featured: previous.featured }),
  ...(previous.tag && { tag: previous.tag }),
  currency: previous.currency ?? 'USD',
  price: previous.price ?? { standard: 49 },
  demo: {
    origin: origin || previous.demo?.origin || 'https://CHANGE-ME.example.com',
    dark: config.darkMode ?? previous.demo?.dark ?? false,
    pages: config.pages ?? previous.demo?.pages ?? [{ label: 'Home', path: '/' }],
  },
  screenshots: {
    cover: screenshots.cover ?? previous.screenshots?.cover ?? null,
    tall: screenshots.tall ?? previous.screenshots?.tall ?? null,
    gallery: screenshots.gallery.length ? screenshots.gallery : previous.screenshots?.gallery ?? [],
  },
  included: previous.included ?? [],
  features: previous.features ?? [],
  provider: previous.provider ?? { lemonsqueezy: { standard: 'REPLACE_WITH_VARIANT_ID', extended: 'REPLACE_WITH_VARIANT_ID' } },
}

writeFileSync(mdxPath, `---\n${stringify(frontmatter, { lineWidth: 0 })}---\n${body}`)
console.log(`  ${mdxPath}`)
console.log(`\nDone. Status is "${frontmatter.status}". Add the payment variant IDs, review the page with \`npm run dev\`, then set status: published.`)
