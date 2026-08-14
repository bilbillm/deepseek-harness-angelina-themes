import type { ThemeDefinition } from '../themes.ts'

export interface ThemeSnapshot {
  preference: string
  active: HostThemeDefinition
  themes: readonly HostThemeDefinition[]
  revision: number
}

export interface HostThemeDefinition {
  id: string
  colorScheme: 'light' | 'dark'
  tokens: Readonly<Record<string, string>>
}

export interface ThemeService {
  getTheme(): ThemeSnapshot
  register(definition: ThemeDefinition): () => void
  setTheme(id: string): void
}

export interface ClientContext {
  effect(thunk: () => unknown, label?: string): void
  on(event: string, listener: (payload: unknown) => void): () => void
  theme: ThemeService
  slots: {
    inject(name: string, factory: () => unknown): void
    register(options: unknown, component: unknown): unknown
  }
  locale: {
    register(
      namespace: string,
      dict: Record<string, Record<string, string>>,
    ): (() => void) | void
  }
}

export interface PickerState {
  preference: string
  activeId: string
  themes: readonly { id: string; colorScheme: 'light' | 'dark' }[]
  revision: number
}
