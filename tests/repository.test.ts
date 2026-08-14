import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
const readme = readFileSync('README.md', 'utf8')

describe('installable repository contract', () => {
  it('declares both dsh client and bundle metadata', () => {
    expect(packageJson.name).toBe('dsh-angelina-themes')
    expect(packageJson.dsh.client.platform).toBe('web')
    expect(packageJson.dsh.bundle.patch).toBe('./cordis.patch.yml')
    expect(packageJson.files).toContain('lib')
  })

  it('documents GitHub install and exact removal commands', () => {
    expect(readme).toContain('dsh plugin --profile web add github:bilbillm/deepseek-harness-angelina-themes')
    expect(readme).toContain('dsh plugin --profile web remove dsh-angelina-themes')
  })
})
