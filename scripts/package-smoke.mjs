import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const required = [
  'lib/index.js',
  'lib/client.js',
  'cordis.patch.yml',
  'README.md',
  'README.en.md',
]
for (const relative of required) await access(resolve(root, relative))

const client = await readFile(resolve(root, 'lib/client.js'), 'utf8')
for (const marker of [
  'window.__ModuleLoader__.load',
  'dsh-angelina-themes',
  'angelina-light',
  'angelina-dark',
  'data-dsh-angelina-parallax',
  'backdrop-filter',
]) {
  if (!client.includes(marker)) throw new Error(`client bundle is missing marker: ${marker}`)
}
console.log('package smoke checks passed')
