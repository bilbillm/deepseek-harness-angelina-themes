// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apply } from '../src/client/index.ts'
import { ANGELINA_THEMES } from '../src/themes.ts'
import type { ClientContext, ThemeSnapshot } from '../src/client/types.ts'

function makeContext(options: { fork?: boolean; active?: string } = {}) {
  const effectDisposers: Array<() => void> = []
  const eventListeners = new Set<(snapshot: ThemeSnapshot) => void>()
  const register = vi.fn()
  const slotRegistrations: Array<{ options: Record<string, unknown>; component: unknown }> = []
  const light = { id: 'light', colorScheme: 'light' as const, tokens: {} }
  const dark = { id: 'dark', colorScheme: 'dark' as const, tokens: {} }
  let themes = options.fork ? [light, dark, ...ANGELINA_THEMES] : [light, dark]
  let preference = options.active ?? 'system'
  let active = themes.find(theme => theme.id === options.active) ?? light
  let revision = 0

  const snapshot = (): ThemeSnapshot => ({ preference, active, themes, revision })
  const emit = (): void => {
    revision += 1
    const current = snapshot()
    eventListeners.forEach(listener => { listener(current) })
  }

  const theme = {
    getTheme: snapshot,
    register: (definition: (typeof ANGELINA_THEMES)[number]) => {
      register(definition)
      themes = [...themes, definition]
      emit()
      return () => {
        themes = themes.filter(theme => theme.id !== definition.id)
        if (active.id === definition.id) {
          active = light
          preference = 'system'
        }
        emit()
      }
    },
    setTheme: (id: string) => {
      const next = themes.find(theme => theme.id === id)
      if (next === undefined) throw new Error(`unknown theme ${id}`)
      preference = id
      active = next
      emit()
    },
  }

  const ctx: ClientContext = {
    theme,
    effect: (thunk) => {
      const dispose = thunk()
      if (typeof dispose === 'function') effectDisposers.push(dispose as () => void)
    },
    on: (_event, listener) => {
      const typed = listener as (snapshot: ThemeSnapshot) => void
      eventListeners.add(typed)
      return () => { eventListeners.delete(typed) }
    },
    slots: {
      inject: (_name, factory) => { factory() },
      register: (slotOptions, component) => {
        slotRegistrations.push({ options: slotOptions as Record<string, unknown>, component })
        return () => {}
      },
    },
    locale: {
      register: () => () => {},
    },
  }

  return {
    ctx,
    register,
    slots: slotRegistrations,
    snapshot,
    dispose: () => {
      for (const disposer of effectDisposers.reverse()) disposer()
    },
  }
}

describe('client plugin', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    document.head.querySelectorAll('[data-dsh-angelina-themes]').forEach(node => { node.remove() })
    document.body.innerHTML = ''
    document.body.removeAttribute('data-ds-theme')
    document.body.removeAttribute('data-dsh-angelina-parallax')
    document.body.style.cssText = ''
  })

  it('registers missing upstream themes, exposes the settings row, and cleans up', () => {
    const harness = makeContext()
    apply(harness.ctx)
    expect(harness.register).toHaveBeenCalledTimes(2)
    expect(harness.snapshot().themes.map(theme => theme.id)).toContain('angelina-light')
    expect(document.body.getAttribute('data-ds-theme')).toBe('light')
    expect(document.head.querySelector('[data-dsh-angelina-themes]')).not.toBeNull()
    expect(harness.slots).toHaveLength(1)
    expect(harness.slots[0]?.options).toMatchObject({ id: 'angelina-themes', order: 11 })
    harness.dispose()
    expect(document.head.querySelector('[data-dsh-angelina-themes]')).toBeNull()
  })

  it('stays passive when the fork already owns both themes and parallax layers', () => {
    document.body.setAttribute('data-dsh-angelina-parallax', 'light')
    document.body.innerHTML = `
      <div id="dsh-angelina-parallax" data-dsh-angelina-parallax-owner="angelina">
        <div data-dsh-angelina-layer="background"></div>
        <div data-dsh-angelina-layer="foreground"></div>
      </div>`
    const root = document.getElementById('dsh-angelina-parallax')
    const harness = makeContext({ fork: true, active: 'angelina-light' })
    apply(harness.ctx)
    expect(harness.register).not.toHaveBeenCalled()
    expect(harness.slots).toHaveLength(0)
    expect(document.head.querySelector('[data-dsh-angelina-themes]')).toBeNull()
    harness.dispose()
    expect(document.getElementById('dsh-angelina-parallax')).toBe(root)
    expect(document.body.getAttribute('data-dsh-angelina-parallax')).toBe('light')
  })

  it('presents the active theme id for published Harness and restores the host attribute', () => {
    document.body.setAttribute('data-ds-theme', 'host-light')
    const harness = makeContext()
    apply(harness.ctx)
    expect(document.body.getAttribute('data-ds-theme')).toBe('light')
    harness.ctx.theme.setTheme('angelina-light')
    expect(document.body.getAttribute('data-ds-theme')).toBe('angelina-light')
    harness.dispose()
    expect(document.body.getAttribute('data-ds-theme')).toBe('host-light')
  })

  it('restores an upstream theme from browser-local storage', () => {
    localStorage.setItem('dsh-angelina-themes.selection', 'angelina-dark')
    const harness = makeContext()
    apply(harness.ctx)
    expect(harness.snapshot().active.id).toBe('angelina-dark')
    expect(document.body.getAttribute('data-ds-theme')).toBe('angelina-dark')
    expect(document.body.getAttribute('data-dsh-angelina-parallax')).toBe('dark')
    harness.dispose()
  })
})
