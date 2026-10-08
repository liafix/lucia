import { cp, mkdir, rm, copyFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const dist = path.join(root, 'dist')
const runtime = path.join(root, 'src', 'runtime')
const publicDir = path.join(root, 'public')

await rm(dist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })

await copyFile(path.join(runtime, 'index.html'), path.join(dist, 'index.html'))
await copyFile(path.join(runtime, 'app.js'), path.join(dist, 'app.js'))
await copyFile(path.join(runtime, 'styles.css'), path.join(dist, 'styles.css'))
await cp(publicDir, dist, { recursive: true })
await copyFile(path.join(root, 'vercel.json'), path.join(dist, 'vercel.json'))

const buildInfo = [
  'PROJECT LUCIA V1.1',
  'Fresh offline production prebuild',
  `Built: ${new Date().toISOString()}`,
  'Source: src/runtime/* + public/* + vercel.json',
  'Purpose: dependency-free direct Vercel deployment of dist/',
  '',
].join('\n')
await writeFile(path.join(dist, 'BUILD_INFO.txt'), buildInfo)

console.log('Fresh production prebuild created at dist/')
