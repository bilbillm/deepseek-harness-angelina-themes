/** Browser-local key used because third-party Host namespaces are not exposed. */
export const THEME_STORAGE_KEY = 'dsh-angelina-themes.selection'
/** Sentinel meaning the host's built-in preference should remain in control. */
export const DEFAULT_SELECTION = 'system'

export function isThemeSelection(value: unknown): value is string {
  return typeof value === 'string'
}
