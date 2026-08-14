import { describe, expect, it } from 'vitest'
import { ANGELINA_ASSETS } from '../src/client/assets.generated.ts'
import { ANGELINA_CSS } from '../src/client/style.ts'
import { ANGELINA_THEMES } from '../src/themes.ts'

describe('theme payload', () => {
  it('ships two complete 114-token definitions', () => {
    expect(ANGELINA_THEMES.map(theme => [theme.id, theme.colorScheme])).toEqual([
      ['angelina-light', 'light'],
      ['angelina-dark', 'dark'],
    ])
    for (const theme of ANGELINA_THEMES) {
      expect(Object.keys(theme.tokens), theme.id).toHaveLength(114)
      expect(theme.tokens['--dsw-alias-bg-base']).toBeTruthy()
      expect(theme.tokens['--dsw-alias-label-primary']).toBeTruthy()
      expect(theme.tokens['--dsw-specific-input-major']).toBeTruthy()
    }
  })

  it('embeds every image locally as WebP', () => {
    expect(Object.keys(ANGELINA_ASSETS)).toHaveLength(6)
    for (const value of Object.values(ANGELINA_ASSETS)) {
      expect(value.startsWith('data:image/webp;base64,UklGR')).toBe(true)
    }
  })

  it('keeps active chat clear while applying glass to leaf surfaces', () => {
    const active = ANGELINA_CSS.match(/\[data-phase='active'\] \[data-conversation-scroll\] \{([^}]*)\}/s)?.[1] ?? ''
    expect(active).toContain('14%')
    expect(active).toContain('backdrop-filter: none')
    expect(ANGELINA_CSS).toContain("[role='menu']")
    expect(ANGELINA_CSS).toContain("[role='listbox']")
    expect(ANGELINA_CSS).toContain("[role='dialog']")
    expect(ANGELINA_CSS).toContain('--dsh-angelina-glass-filter: blur(12px)')
  })

  it('contains both motion fallbacks and the two-layer light assets', () => {
    expect(ANGELINA_CSS).toContain('@media (prefers-reduced-motion: reduce)')
    expect(ANGELINA_CSS).toContain('@media (max-width: 900px)')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-light-parallax-background')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-light-parallax-foreground')
  })

  it('leaves composer placement and interface copy motion to the host', () => {
    expect(ANGELINA_CSS).not.toContain("[data-ds-composer-mode='hero']")
    expect(ANGELINA_CSS).not.toContain('--dsh-angelina-copy-parallax-')
  })
})
