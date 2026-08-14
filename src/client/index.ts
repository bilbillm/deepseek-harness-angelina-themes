import type { BakedActions } from '@deepseek-ai/dsh-client-runtime/client'
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
  ctx.effect(() => registerMissingThemes(ctx), 'dsh-angelina-themes: register themes')

  const bridge = createSelectionBridge(ctx)
  const store = createPickerStore()
  let bound: BakedActions<PickerState, ReturnType<typeof createPickerStore>['spec']['actions']> | undefined

  const syncStore = (): void => {
    bound?.sync(pickerState(ctx.theme.getTheme()))
  }

  ctx.effect(() => {
    const offChange = ctx.on('theme/change', payload => {
      const snapshot = payload as ThemeSnapshot
      bridge.sync(snapshot)
      syncStore()
    })
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
