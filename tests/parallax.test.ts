// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AngelinaParallaxController } from '../src/client/angelina-parallax.ts'

const frames: FrameRequestCallback[] = []

function flushFrame(): void {
  frames.splice(0).forEach(callback => { callback(0) })
}

function pointer(clientX: number, clientY: number, pointerType = 'mouse'): void {
  const event = new Event('pointermove') as PointerEvent
  Object.defineProperties(event, {
    clientX: { value: clientX },
    clientY: { value: clientY },
    pointerType: { value: pointerType },
  })
  window.dispatchEvent(event)
}

describe('AngelinaParallaxController', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main data-ds-app-frame></main>'
    frames.length = 0
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback)
      return frames.length
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => true,
    } as MediaQueryList))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
    document.body.removeAttribute('data-dsh-angelina-parallax')
    document.body.style.cssText = ''
  })

  it('matches the Codex light movement amplitudes', () => {
    const controller = new AngelinaParallaxController()
    controller.sync('angelina-light')
    pointer(window.innerWidth, window.innerHeight)
    flushFrame()
    expect(document.querySelector('[data-dsh-angelina-layer="background"]')?.getAttribute('style'))
      .toContain('translate3d(-5px, -3px, 0)')
    expect(document.querySelector('[data-dsh-angelina-layer="foreground"]')?.getAttribute('style'))
      .toContain('translate3d(10px, 6px, 0)')
    expect(document.body.style.getPropertyValue('--dsh-angelina-copy-parallax-x')).toBe('')
    expect(document.body.style.getPropertyValue('--dsh-angelina-copy-parallax-y')).toBe('')
    controller.dispose()
  })

  it('keeps dark movement restrained and ignores touch input', () => {
    const controller = new AngelinaParallaxController()
    controller.sync('angelina-dark')
    pointer(window.innerWidth, window.innerHeight, 'touch')
    expect(frames).toHaveLength(0)
    pointer(window.innerWidth, window.innerHeight)
    flushFrame()
    expect(document.querySelector('[data-dsh-angelina-layer="background"]')?.getAttribute('style'))
      .toContain('translate3d(0.5px, 0.25px, 0)')
    expect(document.body.style.getPropertyValue('--dsh-angelina-copy-parallax-x')).toBe('')
    controller.dispose()
  })

  it('becomes passive when the fork already owns the layers', () => {
    document.body.setAttribute('data-dsh-angelina-parallax', 'light')
    document.body.innerHTML = `
      <div id="dsh-angelina-parallax" data-dsh-angelina-parallax-owner="angelina">
        <div data-dsh-angelina-layer="background"></div>
        <div data-dsh-angelina-layer="foreground"></div>
      </div>`
    const root = document.getElementById('dsh-angelina-parallax')
    const controller = new AngelinaParallaxController()
    controller.sync('angelina-light')
    pointer(window.innerWidth, window.innerHeight)
    expect(frames).toHaveLength(0)
    controller.dispose()
    expect(document.getElementById('dsh-angelina-parallax')).toBe(root)
    expect(document.body.getAttribute('data-dsh-angelina-parallax')).toBe('light')
  })

  it('restores its body attribute without changing unrelated body styles', () => {
    document.body.setAttribute('data-dsh-angelina-parallax', 'legacy')
    document.body.style.setProperty('--dsh-angelina-copy-parallax-x', '9px')
    const controller = new AngelinaParallaxController()
    controller.sync('angelina-light')
    pointer(window.innerWidth, window.innerHeight)
    flushFrame()
    expect(document.body.style.getPropertyValue('--dsh-angelina-copy-parallax-x')).toBe('9px')
    controller.sync('system')
    expect(document.body.getAttribute('data-dsh-angelina-parallax')).toBe('legacy')
    expect(document.body.style.getPropertyValue('--dsh-angelina-copy-parallax-x')).toBe('9px')
    expect(document.getElementById('dsh-angelina-parallax')).toBeNull()
  })
})
