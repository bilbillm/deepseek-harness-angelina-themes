import type { PickerState } from './types.ts'

export interface ThemePickerRowProps {
  useStore: <T>(selector: (state: PickerState) => T) => T
  t: (key: string) => string
  setTheme: (id: string) => void
}

const THEME_IDS = ['angelina-light', 'angelina-dark'] as const

/** A compact settings row that owns only the two Angelina choices. */
export function ThemePickerRow({ useStore, t, setTheme }: ThemePickerRowProps) {
  const preference = useStore(state => state.preference)
  const themes = useStore(state => state.themes)
  const available = THEME_IDS.filter(id => themes.some(theme => theme.id === id))
  if (available.length === 0) return null

  return (
    <div className="dsh-angelina-picker">
      <div className="dsh-angelina-picker-title">{t('picker.title')}</div>
      <div className="dsh-angelina-picker-grid">
        {available.map(id => (
          <button
            key={id}
            type="button"
            className={`dsh-angelina-picker-choice${preference === id ? ' is-selected' : ''}`}
            aria-pressed={preference === id}
            onClick={() => { setTheme(id) }}
          >
            <span className="dsh-angelina-picker-preview" data-preview={id} aria-hidden="true">
              <span className="dsh-angelina-picker-rail" />
              <span className="dsh-angelina-picker-panel" />
            </span>
            <span className="dsh-angelina-picker-label">{t(`theme.${id}`)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
