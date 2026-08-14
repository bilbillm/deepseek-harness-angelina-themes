import { ANGELINA_ASSETS } from './assets.generated.ts'

const url = (value: string): string => `url("${value}")`

/** CSS is injected at runtime so a GitHub install never needs a public asset host. */
export const ANGELINA_CSS = `
:root {
  --dsh-angelina-light-hero: ${url(ANGELINA_ASSETS.lightHero)};
  --dsh-angelina-dark-hero: ${url(ANGELINA_ASSETS.darkHero)};
  --dsh-angelina-light-thread: ${url(ANGELINA_ASSETS.lightThread)};
  --dsh-angelina-dark-thread: ${url(ANGELINA_ASSETS.darkThread)};
  --dsh-angelina-light-parallax-background: ${url(ANGELINA_ASSETS.lightParallaxBackground)};
  --dsh-angelina-light-parallax-foreground: ${url(ANGELINA_ASSETS.lightParallaxForeground)};
}

body[data-ds-theme='angelina-light'],
body[data-ds-theme='angelina-dark'] {
  --dsh-angelina-hero-image: none;
  --dsh-angelina-thread-image: none;
  --dsh-angelina-hero-position: 68% 42%;
  --dsh-angelina-thread-position: 68% 42%;
  --dsh-angelina-app-scrim: transparent;
  --dsh-angelina-thread-scrim: transparent;
  --dsh-angelina-glass-input: rgba(251, 250, 248, 0.72);
  --dsh-angelina-glass-menu: rgba(251, 250, 248, 0.8);
  --dsh-angelina-glass-dialog: rgba(251, 250, 248, 0.78);
  --dsh-angelina-glass-border: rgba(255, 255, 255, 0.58);
  --dsh-angelina-glass-highlight: rgba(255, 255, 255, 0.62);
  --dsh-angelina-glass-shadow: 0 12px 32px rgba(62, 43, 42, 0.14);
  --dsh-angelina-glass-filter: blur(12px) saturate(118%);
  --dsh-angelina-copy-parallax-x: 0px;
  --dsh-angelina-copy-parallax-y: 0px;
  background-color: var(--dsw-alias-bg-base);
  background-image: var(--dsh-angelina-hero-image);
  background-position: var(--dsh-angelina-hero-position);
  background-size: cover;
  background-attachment: fixed;
}

body[data-ds-theme='angelina-light'] {
  --dsh-angelina-hero-image: var(--dsh-angelina-light-hero);
  --dsh-angelina-thread-image: var(--dsh-angelina-light-thread);
  --dsh-angelina-app-scrim: linear-gradient(90deg, rgb(235 232 227 / 92%) 0 20%, rgb(235 232 227 / 18%) 54%, rgb(235 232 227 / 4%) 100%);
  --dsh-angelina-thread-scrim: linear-gradient(90deg, rgb(235 232 227 / 92%) 0 35%, rgb(235 232 227 / 64%) 68%, rgb(235 232 227 / 46%) 100%);
  --dsh-angelina-parallax-background-image: var(--dsh-angelina-light-parallax-background);
  --dsh-angelina-parallax-foreground-image: var(--dsh-angelina-light-parallax-foreground);
}

body[data-ds-theme='angelina-dark'] {
  --dsh-angelina-hero-image: var(--dsh-angelina-dark-hero);
  --dsh-angelina-thread-image: var(--dsh-angelina-dark-thread);
  --dsh-angelina-hero-position: 74% 42%;
  --dsh-angelina-thread-position: 74% 42%;
  --dsh-angelina-app-scrim: linear-gradient(90deg, rgb(8 13 19 / 94%) 0 20%, rgb(8 13 19 / 30%) 54%, rgb(8 13 19 / 8%) 100%);
  --dsh-angelina-thread-scrim: linear-gradient(90deg, rgb(8 13 19 / 94%) 0 35%, rgb(8 13 19 / 72%) 68%, rgb(8 13 19 / 54%) 100%);
  --dsh-angelina-glass-input: rgba(17, 24, 32, 0.68);
  --dsh-angelina-glass-menu: rgba(24, 34, 43, 0.76);
  --dsh-angelina-glass-dialog: rgba(26, 36, 45, 0.78);
  --dsh-angelina-glass-border: rgba(242, 240, 237, 0.16);
  --dsh-angelina-glass-highlight: rgba(242, 240, 237, 0.12);
  --dsh-angelina-glass-shadow: 0 14px 36px rgba(0, 0, 0, 0.34);
  --dsh-angelina-glass-filter: blur(12px) saturate(125%);
  --dsh-angelina-parallax-background-image: var(--dsh-angelina-dark-hero);
  --dsh-angelina-parallax-foreground-image: none;
}

body[data-ds-theme^='angelina-'] [data-ds-app-frame] {
  background: var(--dsh-angelina-app-scrim), var(--dsh-angelina-hero-image) var(--dsh-angelina-hero-position) / cover fixed;
}

body[data-ds-theme^='angelina-'] [data-ds-conversation-column] {
  background: transparent;
}

body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase] {
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: var(--dsh-angelina-hero-position);
  background-size: cover;
}

body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase='hero'],
body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase='settling'] {
  background-image: var(--dsh-angelina-app-scrim), var(--dsh-angelina-hero-image);
}

body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase='active'] {
  background-image: var(--dsh-angelina-thread-scrim), var(--dsh-angelina-thread-image);
  background-position: center, var(--dsh-angelina-thread-position);
}

body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase='hero'] [data-ds-composer-mode='hero'] {
  align-self: flex-start;
  width: min(62%, calc(var(--dsh-composer-card-max-width) + 2 * var(--dsh-composer-side-clearance)));
  margin-left: clamp(16px, 5vw, 72px);
}

body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase='hero'] svg[class*='heroGlow'] {
  opacity: 0;
}

/* Active conversation stays readable: a translucent tint, without a full
 * column blur that would soften every message and the composer at once. */
body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase='active'] [data-conversation-scroll] {
  background: rgba(8, 13, 19, 0.14);
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 14%, transparent);
  backdrop-filter: none;
}

body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase='active'] [data-composer-seat] {
  background: linear-gradient(180deg, color-mix(in srgb, var(--dsw-alias-bg-base) 0%, transparent) 0, color-mix(in srgb, var(--dsw-alias-bg-base) 88%, transparent) 36px);
}

/* Glass belongs on leaf surfaces. Ancestor filters break fixed dialogs. */
body[data-ds-theme^='angelina-'] :where(
  [data-composer-card],
  [role='menu'],
  [role='listbox'],
  [role='dialog'],
  [data-radix-popper-content-wrapper] > *,
  [data-testid='todo-panel'],
  [data-question-key] > section
) {
  background-color: var(--dsh-angelina-glass-menu);
  border: 1px solid var(--dsh-angelina-glass-border);
  box-shadow: var(--dsh-angelina-glass-shadow), inset 0 1px 0 var(--dsh-angelina-glass-highlight);
  -webkit-backdrop-filter: var(--dsh-angelina-glass-filter);
  backdrop-filter: var(--dsh-angelina-glass-filter);
}

body[data-ds-theme^='angelina-'] [role='dialog'] {
  background-color: var(--dsh-angelina-glass-dialog);
}

body[data-ds-theme^='angelina-'] [data-composer-card] {
  background-color: var(--dsh-angelina-glass-input);
}

body[data-ds-theme^='angelina-'] :where(
  input:not([type='checkbox']):not([type='radio']):not([type='range']):not([type='file']),
  textarea,
  select,
  [contenteditable='true']
) {
  background-color: var(--dsh-angelina-glass-input);
  border: 1px solid var(--dsh-angelina-glass-border);
  box-shadow: inset 0 1px 0 var(--dsh-angelina-glass-highlight);
  -webkit-backdrop-filter: var(--dsh-angelina-glass-filter);
  backdrop-filter: var(--dsh-angelina-glass-filter);
}

body[data-ds-theme^='angelina-'] [data-composer-card] :is(textarea, [contenteditable='true']) {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}

body[data-ds-theme^='angelina-'] [data-dsh-angelina-parallax] {
  position: fixed;
  z-index: -1;
  inset: 0;
  overflow: hidden;
  contain: strict;
  pointer-events: none;
}

body[data-ds-theme^='angelina-'] [data-dsh-angelina-parallax] > [data-dsh-angelina-layer] {
  position: absolute;
  inset: -16px;
  background-position: var(--dsh-angelina-hero-position);
  background-size: cover;
  background-repeat: no-repeat;
  backface-visibility: hidden;
  will-change: transform;
}

body[data-ds-theme^='angelina-'] [data-dsh-angelina-parallax] > [data-dsh-angelina-layer='background'] {
  background-image: var(--dsh-angelina-parallax-background-image);
}

body[data-ds-theme^='angelina-'] [data-dsh-angelina-parallax] > [data-dsh-angelina-layer='foreground'] {
  background-image: var(--dsh-angelina-parallax-foreground-image);
}

body[data-dsh-angelina-parallax] {
  isolation: isolate;
  background-image: none;
}

body[data-dsh-angelina-parallax] [data-ds-app-frame] {
  background: var(--dsh-angelina-app-scrim);
}

body[data-dsh-angelina-parallax] [data-ds-conversation-column] [data-phase='hero'],
body[data-dsh-angelina-parallax] [data-ds-conversation-column] [data-phase='settling'] {
  background-image: var(--dsh-angelina-app-scrim);
}

body[data-dsh-angelina-parallax] [data-phase='hero'] [data-ds-composer-mode='hero'] {
  translate: var(--dsh-angelina-copy-parallax-x, 0px) var(--dsh-angelina-copy-parallax-y, 0px);
  will-change: translate;
}

/* Standalone settings row. */
.dsh-angelina-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.dsh-angelina-picker-title {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 22px;
}

.dsh-angelina-picker-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.dsh-angelina-picker-choice {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  cursor: pointer;
}

.dsh-angelina-picker-choice:hover:not(.is-selected) {
  background: var(--dsw-alias-interactive-bg-hover);
}

.dsh-angelina-picker-choice.is-selected {
  border-color: var(--dsw-alias-brand-primary);
  background: var(--dsw-alias-bg-module-platform);
  box-shadow: 0 0 0 1px var(--dsw-alias-brand-primary);
}

.dsh-angelina-picker-preview {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 5px;
  background-position: center;
  background-size: cover;
}

.dsh-angelina-picker-preview[data-preview='angelina-light'] {
  background-image: var(--dsh-angelina-light-hero);
}

.dsh-angelina-picker-preview[data-preview='angelina-dark'] {
  background-image: var(--dsh-angelina-dark-hero);
}

.dsh-angelina-picker-rail,
.dsh-angelina-picker-panel {
  position: absolute;
  display: block;
  backdrop-filter: blur(3px);
}

.dsh-angelina-picker-rail {
  inset: 0 auto 0 0;
  width: 25%;
  background: rgb(8 13 19 / 48%);
  border-right: 1px solid rgb(255 255 255 / 18%);
}

.dsh-angelina-picker-panel {
  right: 8%;
  bottom: 12%;
  width: 46%;
  height: 24%;
  border-radius: 4px;
  background: rgb(251 250 248 / 78%);
}

.dsh-angelina-picker-preview[data-preview='angelina-dark'] .dsh-angelina-picker-panel {
  background: rgb(17 24 32 / 82%);
}

.dsh-angelina-picker-label {
  min-height: 22px;
  text-align: center;
  font-size: 13px;
  line-height: 22px;
}

@media (max-width: 900px) {
  body[data-ds-theme^='angelina-'] {
    --dsh-angelina-hero-position: 68% 42%;
    --dsh-angelina-thread-position: 68% 42%;
  }

  body[data-ds-theme^='angelina-'] [data-ds-conversation-column] [data-phase='hero'] [data-ds-composer-mode='hero'] {
    align-self: center;
    width: min(calc(var(--dsh-composer-card-max-width) + 2 * var(--dsh-composer-side-clearance)), 100%);
    margin-left: 0;
  }

  body[data-dsh-angelina-parallax] [data-dsh-angelina-layer] {
    transform: none !important;
  }

  body[data-dsh-angelina-parallax] [data-phase='hero'] [data-ds-composer-mode='hero'] {
    translate: none;
  }

  .dsh-angelina-picker-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-transparency: reduce) {
  body[data-ds-theme^='angelina-'] :is(
    [data-composer-card],
    [role='menu'],
    [role='listbox'],
    [role='dialog'],
    [data-radix-popper-content-wrapper] > *,
    [data-testid='todo-panel'],
    [data-question-key] > section,
    input,
    textarea,
    select,
    [contenteditable='true']
  ) {
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  body[data-dsh-angelina-parallax] [data-dsh-angelina-layer] {
    transform: none !important;
  }

  body[data-dsh-angelina-parallax] [data-phase='hero'] [data-ds-composer-mode='hero'] {
    translate: none;
  }
}
`

export function installAngelinaStyles(): () => void {
  if (typeof document === 'undefined') return () => {}
  const existing = document.head.querySelector<HTMLStyleElement>('style[data-dsh-angelina-themes]')
  if (existing !== null) return () => {}
  const style = document.createElement('style')
  style.dataset.dshAngelinaThemes = ''
  style.setAttribute('data-plugin', 'dsh-angelina-themes')
  style.textContent = ANGELINA_CSS
  document.head.append(style)
  return () => { style.remove() }
}
