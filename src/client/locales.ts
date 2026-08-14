export const SETTINGS_NS = 'settings.angelina-themes'

export const zh = {
  'picker.title': '安洁莉娜主题',
  'theme.angelina-light': '安洁莉娜亮色',
  'theme.angelina-dark': '安洁莉娜暗色',
} as const

export const en = {
  'picker.title': 'Angelina themes',
  'theme.angelina-light': 'Angelina Light',
  'theme.angelina-dark': 'Angelina Dark',
} satisfies Record<keyof typeof zh, string>

export type ThemeKey = keyof typeof zh
