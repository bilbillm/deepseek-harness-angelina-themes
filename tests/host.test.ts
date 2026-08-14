import { describe, expect, it } from 'vitest'
import { apply, inject } from '../src/index.ts'

describe('host entry', () => {
  it('is a browser-only loader face with no Host dependencies', () => {
    expect(inject).toEqual([])
    expect(apply()).toBeUndefined()
  })
})
