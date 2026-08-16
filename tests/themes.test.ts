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
    expect(Object.keys(ANGELINA_ASSETS)).toHaveLength(4)
    for (const value of Object.values(ANGELINA_ASSETS)) {
      expect(value.startsWith('data:image/webp;base64,UklGR')).toBe(true)
    }
  })

  it('keeps hero, settling, and active conversations on one artwork coordinate system', () => {
    expect(ANGELINA_CSS).toContain(`body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase='hero'],
body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase='settling'],
body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase='active'] {
  background-image: var(--dsh-angelina-app-scrim), var(--dsh-angelina-hero-image);
}`)
    expect(ANGELINA_CSS).toContain(`body[data-dsh-angelina-parallax] [data-ds-conversation-column] [data-phase='hero'],
body[data-dsh-angelina-parallax] [data-ds-conversation-column] [data-phase='settling'],
body[data-dsh-angelina-parallax] [data-ds-conversation-column] [data-phase='active'] {
  background-image: var(--dsh-angelina-app-scrim);
}`)
    expect(ANGELINA_CSS).not.toContain('--dsh-angelina-thread-')
    expect(ANGELINA_CSS).toContain("[data-slot='root'] > :first-child")
    expect(ANGELINA_CSS).toContain("[data-slot='conversation'] > [data-phase='hero']")
  })

  it('softens active artwork and gives interface copy readable theme tokens', () => {
    const active = ANGELINA_CSS.match(/\[data-phase='active'\] \[data-conversation-scroll\] \{([^}]*)\}/s)?.[1] ?? ''
    expect(active).toContain('background-color: var(--dsh-angelina-conversation-glass)')
    expect(active).toContain('-webkit-backdrop-filter: var(--dsh-angelina-conversation-filter)')
    expect(active).toContain('backdrop-filter: var(--dsh-angelina-conversation-filter)')
    expect(active).toContain('--dsw-alias-label-primary: var(--dsh-angelina-chat-text)')
    expect(active).toContain('--dsw-alias-label-secondary: var(--dsh-angelina-chat-secondary)')
    expect(active).toContain('--dsw-alias-label-tertiary: var(--dsh-angelina-chat-muted)')
    expect(active).toContain('--dsw-alias-label-caption: var(--dsh-angelina-chat-caption)')
  })

  it('uses the layered smoked-glass recipes from the Codex Angelina skin', () => {
    expect(ANGELINA_CSS).toContain('--dsh-angelina-glass-input: rgba(53, 60, 65, 0.58)')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-glass-input: rgba(13, 21, 29, 0.72)')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-glass-composer-filter: blur(16px) saturate(104%)')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-glass-menu-filter: var(--dsh-angelina-glass-dialog-filter)')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-glass-dialog-filter: blur(18px) saturate(104%)')
    expect(ANGELINA_CSS).toContain("[role='menu']")
    expect(ANGELINA_CSS).toContain("[role='listbox']")
    expect(ANGELINA_CSS).toContain("[role='dialog']")
    const composer = ANGELINA_CSS.match(/body\[data-ds-theme\^='angelina-'\] \[data-composer-card\] \{([^}]*)\}/s)?.[1] ?? ''
    expect(composer).not.toContain('border-radius: 6px')
    expect(composer).not.toContain('inset 3px 0 0 var(--dsh-angelina-glass-accent)')
    expect(ANGELINA_CSS).not.toMatch(/body\[data-ds-theme\^='angelina-'\] \[data-composer-card\]::after/)
    expect(ANGELINA_CSS).toMatch(/\[role='menu'\] section\[role='group'\] > div\[id\] \{\s*background: transparent;\s*\}/s)
    expect(ANGELINA_CSS).toContain(`[data-composer-card] textarea {
  color: transparent;
  caret-color: var(--dsh-angelina-glass-caret);`)
    expect(ANGELINA_CSS).not.toContain('rgba(251, 250, 248, 0.72)')
  })

  it('keeps the conversation header and scroll on one glass plane', () => {
    const header = ANGELINA_CSS.match(/\[data-phase='active'\] \[data-slot='conversation\.session\.header'\] > header \{([^}]*)\}/s)?.[1] ?? ''
    expect(header).toContain('background-color: var(--dsh-angelina-conversation-glass)')
    expect(header).toContain('-webkit-backdrop-filter: var(--dsh-angelina-conversation-filter)')
    expect(header).toContain('backdrop-filter: var(--dsh-angelina-conversation-filter)')
    expect(header).toContain('--dsw-alias-label-primary: var(--dsh-angelina-chat-text)')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-conversation-glass: color-mix(in srgb, var(--dsw-alias-bg-base) 24%, transparent)')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-conversation-filter: blur(3px)')
    expect(ANGELINA_CSS).toContain("input[aria-label='筛选选项']")
    expect(ANGELINA_CSS).toContain("input[aria-label='Filter options']")
    expect(ANGELINA_CSS).toContain(") > [role='listbox'] {")
    expect(ANGELINA_CSS).toContain('background: var(--dsh-angelina-glass-menu)')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-glass-dialog: rgba(43, 51, 58, 0.66)')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-glass-dialog: rgba(10, 17, 24, 0.78)')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-glass-menu: var(--dsh-angelina-glass-dialog)')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-glass-menu-border: var(--dsh-angelina-glass-dialog-border)')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-glass-menu-highlight: var(--dsh-angelina-glass-dialog-highlight)')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-glass-menu-shadow: var(--dsh-angelina-glass-dialog-shadow)')
    expect(ANGELINA_CSS).not.toMatch(/--dsh-angelina-glass-menu:\s*rgba/)
    expect(ANGELINA_CSS).not.toMatch(/--dsh-angelina-glass-menu-filter:\s*blur/)
    expect(ANGELINA_CSS).toContain('--dsh-angelina-glass-menu-text: #f5f3f0')
    expect(ANGELINA_CSS).toMatch(/\[role='dialog'\],[^}]*--dsw-alias-bg-module-platform: var\(--dsh-angelina-glass-control\)/s)
    expect(ANGELINA_CSS).toMatch(/\[role='dialog'\],[^}]*--dsw-specific-sidebar-nav-item-active: var\(--dsh-angelina-glass-control-selected\)/s)
  })

  it('restores the host-owned workspace search capsule', () => {
    expect(ANGELINA_CSS).toContain("input[placeholder='搜索会话…']")
    expect(ANGELINA_CSS).toContain("input[placeholder='Search sessions...']")
    const search = ANGELINA_CSS.match(/input\[placeholder='搜索会话…'\],[\s\S]*?\) \{([^}]*)\}/s)?.[1] ?? ''
    expect(search).toContain('background: transparent')
    expect(search).toContain('border: 0')
    expect(search).toContain('box-shadow: none')
    expect(search).toContain('-webkit-backdrop-filter: none')
    expect(search).toContain('backdrop-filter: none')
  })

  it('contains both motion fallbacks and the two-layer light assets', () => {
    expect(ANGELINA_CSS).toContain('@media (prefers-reduced-motion: reduce)')
    expect(ANGELINA_CSS).toContain('@media (max-width: 900px)')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-light-parallax-background')
    expect(ANGELINA_CSS).toContain('--dsh-angelina-light-parallax-foreground')
  })

  it('keeps the parallax artwork visible beneath the application root', () => {
    const layers = ANGELINA_CSS.match(/\[data-dsh-angelina-parallax\] \{([^}]*)\}/s)?.[1] ?? ''
    const appRoot = ANGELINA_CSS.match(/body\[data-dsh-angelina-parallax\] > #root \{([^}]*)\}/s)?.[1] ?? ''
    expect(layers).toContain('z-index: 0')
    expect(appRoot).toContain('position: relative')
    expect(appRoot).toContain('z-index: 1')
  })

  it('gives question options and custom answers dedicated contrast and glass', () => {
    expect(ANGELINA_CSS).toContain('--dsh-angelina-question-text: #fffdfa')
    expect(ANGELINA_CSS).toContain("[data-question-key] > section {")
    expect(ANGELINA_CSS).toContain("[data-question-key] :is([role='radio'], [role='checkbox'])")
    expect(ANGELINA_CSS).toContain("[data-question-key] :has(> input[type='text'])")
    const input = ANGELINA_CSS.match(/\[data-question-key\] input\[type='text'\] \{([^}]*)\}/s)?.[1] ?? ''
    expect(input).toContain('background: transparent')
    expect(input).toContain('border: 0')
    expect(input).toContain('border-radius: 0')
    expect(input).toContain('color: var(--dsh-angelina-question-text)')
    expect(ANGELINA_CSS).toContain("[data-question-key] input[type='text']::placeholder")
    expect(ANGELINA_CSS).toContain('[data-question-key] textarea')
  })

  it('leaves composer placement and interface copy motion to the host', () => {
    expect(ANGELINA_CSS).not.toContain("[data-ds-composer-mode='hero']")
    expect(ANGELINA_CSS).not.toContain('--dsh-angelina-copy-parallax-')
  })
})
