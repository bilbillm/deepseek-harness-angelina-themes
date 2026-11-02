import type { BakedActions } from '@deepseek-ai/dsh-client-store'
import { ANGELINA_IDS, ANGELINA_THEMES } from '../themes.ts'
import {
  DEFAULT_SELECTION,
  isThemeSelection,
  THEME_STORAGE_KEY,
} from '../preference.ts'
import { AngelinaParallaxController } from './angelina-parallax.ts'
import { en, SETTINGS_NS, zh } from './locales.ts'
import { createPickerStore } from './store.ts'
import { installAngelinaStyles } from './style.ts'
import { ThemePickerRow } from './ThemePickerRow.tsx'
import type { ClientContext, PickerState, ThemeSnapshot } from './types.ts'

export type { ClientContext } from './types.ts'
export { ANGELINA_THEMES } from '../themes.ts'
export { AngelinaParallaxController } from './angelina-parallax.ts'

/** Services required from the host's immediately-available web composition. */
export const inject = [
  'theme',
  'slots',
  'locale',
] as const

const isAngelina = (id: string): boolean => ANGELINA_IDS.has(id)
const THEME_ATTRIBUTE = 'data-ds-theme'

function hostOwnsAngelinaThemes(ctx: ClientContext): boolean {
  const known = new Set(ctx.theme.getTheme().themes.map(theme => theme.id))
  return ANGELINA_THEMES.every(theme => known.has(theme.id))
}

function pickerState(snapshot: ThemeSnapshot): PickerState {
  return {
    preference: snapshot.preference,
    activeId: snapshot.active.id,
    themes: snapshot.themes.map(theme => ({ id: theme.id, colorScheme: theme.colorScheme })),
    revision: snapshot.revision,
  }
}

/**
 * Register only the missing theme ids. This is the important fork boundary:
 * the feature branch already ships these ids, while upstream Harness does not.
 */
function registerMissingThemes(ctx: ClientContext): () => void {
  const known = new Set(ctx.theme.getTheme().themes.map(theme => theme.id))
  const disposers: Array<() => void> = []
  for (const theme of ANGELINA_THEMES) {
    if (known.has(theme.id)) continue
    try {
      disposers.push(ctx.theme.register(theme))
    } catch (error) {
      // A sibling theme package may have registered between the snapshot and
      // this call. Re-read and tolerate only the expected duplicate race.
      if (!ctx.theme.getTheme().themes.some(candidate => candidate.id === theme.id)) throw error
    }
  }
  return () => {
    for (const dispose of disposers.reverse()) dispose()
  }
}

/**
 * Published Harness rc.6 presents color-scheme and tokens, but not the active
 * theme id. The standalone stylesheet needs that id for its scoped selectors.
 */
function installThemeAttributePresenter(ctx: ClientContext): () => void {
  const previous = document.body.getAttribute(THEME_ATTRIBUTE)
  let presented = previous

  const sync = (snapshot: ThemeSnapshot): void => {
    presented = snapshot.active.id
    document.body.setAttribute(THEME_ATTRIBUTE, presented)
  }

  sync(ctx.theme.getTheme())
  const offChange = ctx.on('theme/change', payload => {
    sync(payload as ThemeSnapshot)
  })

  return () => {
    offChange()
    if (document.body.getAttribute(THEME_ATTRIBUTE) !== presented) return
    if (previous === null) document.body.removeAttribute(THEME_ATTRIBUTE)
    else document.body.setAttribute(THEME_ATTRIBUTE, previous)
  }
}

/** Restore and persist the plugin-owned selection without fighting built-ins. */
function createSelectionBridge(ctx: ClientContext): {
  restore: () => void
  sync: (snapshot: ThemeSnapshot) => void
} {
  const restore = (): void => {
    let persisted: string | null = null
    try {
      persisted = localStorage.getItem(THEME_STORAGE_KEY)
    } catch {
      return
    }
    if (!isThemeSelection(persisted) || persisted === DEFAULT_SELECTION) return
    if (!ctx.theme.getTheme().themes.some(theme => theme.id === persisted)) return
    if (ctx.theme.getTheme().preference !== persisted) ctx.theme.setTheme(persisted)
  }

  const sync = (snapshot: ThemeSnapshot): void => {
    const value = isAngelina(snapshot.active.id) ? snapshot.active.id : DEFAULT_SELECTION
    try {
      if (localStorage.getItem(THEME_STORAGE_KEY) !== value) {
        localStorage.setItem(THEME_STORAGE_KEY, value)
      }
    } catch {
      // Private browsing or a locked-down embedding can deny storage. Theme
      // switching still works for the current page; only reload persistence degrades.
    }
  }

  return {
    restore,
    sync,
  }
}

/** Browser plugin face mounted by the dsh Loader. */
export function apply(ctx: ClientContext): void {
  // The feature fork owns the complete presentation. Staying passive avoids
  // duplicate settings rows and prevents a separately installed plugin build
  // from overriding the fork's newer glass or parallax implementation.
  if (hostOwnsAngelinaThemes(ctx)) return

  ctx.effect(() => registerMissingThemes(ctx), 'dsh-angelina-themes: register themes')
  ctx.effect(() => installThemeAttributePresenter(ctx), 'dsh-angelina-themes: active theme attribute')

  const bridge = createSelectionBridge(ctx)
  const store = createPickerStore()
  let bound: BakedActions<PickerState, ReturnType<typeof createPickerStore>['spec']['actions']> | undefined

  const syncStore = (): void => {
    bound?.sync(pickerState(ctx.theme.getTheme()))
  }

  ctx.effect(() => {
    /**
     * DeepSeek Harness 0.2.x adopts its persisted `ui-theme` preference a few
     * hundred milliseconds after mount, replacing the preference this plugin
     * restored from localStorage (third-party ids are not part of the built-in
     * settings schema, so the host always wins that race). Re-apply the stored
     * choice a bounded number of times inside a short boot window; after the
     * window every change is treated as the user's own.
     */
    const adoptWindowEnd = Date.now() + 3000
    let reapplied = 0
    const storedAngelinaChoice = (): string | null => {
      try {
        const value = localStorage.getItem(THEME_STORAGE_KEY)
        return isThemeSelection(value) && isAngelina(value) ? value : null
      } catch {
        return null
      }
    }

    const onThemeChange = (payload: unknown): void => {
      const snapshot = payload as ThemeSnapshot
      if (Date.now() < adoptWindowEnd && reapplied < 2 && !isAngelina(snapshot.active.id)) {
        const intent = storedAngelinaChoice()
        if (intent !== null && ctx.theme.getTheme().themes.some(theme => theme.id === intent)) {
          reapplied += 1
          // Skip bridge.sync here: it would overwrite the stored choice with
          // `system`, which is exactly how the selection used to be lost.
          ctx.theme.setTheme(intent)
          return
        }
      }
      bridge.sync(snapshot)
      syncStore()
    }

    const offChange = ctx.on('theme/change', onThemeChange)
    bridge.restore()
    syncStore()
    return () => {
      offChange()
    }
  }, 'dsh-angelina-themes: selection lifecycle')

  ctx.effect(() => {
    const dispose = ctx.locale.register(SETTINGS_NS, { en, zh })
    return typeof dispose === 'function' ? dispose : undefined
  }, 'dsh-angelina-themes: locale')

  ctx.effect(() => installAngelinaStyles(), 'dsh-angelina-themes: glass stylesheet')

  ctx.effect(() => {
    const parallax = new AngelinaParallaxController()
    parallax.sync(ctx.theme.getTheme().active.id)
    const off = ctx.on('theme/change', payload => {
      parallax.sync((payload as ThemeSnapshot).active.id)
    })
    return () => {
      off()
      parallax.dispose()
    }
  }, 'dsh-angelina-themes: parallax presentation')

  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'angelina-themes',
    order: 11,
    store,
    locale: SETTINGS_NS,
    inject: (actions: BakedActions<PickerState, ReturnType<typeof createPickerStore>['spec']['actions']>) => {
      bound = actions
      syncStore()
      return {
        setTheme: (id: string) => { ctx.theme.setTheme(id) },
      }
    },
  }, ThemePickerRow))
}
