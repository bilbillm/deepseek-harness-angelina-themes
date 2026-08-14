type AnyAction<T> = (draft: T, ...params: never[]) => void

export type BakedActions<T, A> = {
  [K in keyof A]: A[K] extends (draft: T, ...params: infer P) => void
    ? (...params: P) => void
    : never
}

export interface EngineStoreHandle<T, A> {
  spec: { init: () => T; actions: A }
  create(): {
    actions: BakedActions<T, A>
    getSnapshot: () => T
    subscribe: (listener: () => void) => () => void
    clearPersisted: () => void
  }
}

export function defineStore<T, A extends Record<string, AnyAction<T>>>(decl: {
  init: () => T
  actions: A
}): EngineStoreHandle<T, A> {
  return {
    spec: decl,
    create: () => {
      const listeners = new Set<() => void>()
      let state = decl.init()
      const actions = Object.fromEntries(Object.entries(decl.actions).map(([key, action]) => [
        key,
        (...params: unknown[]) => {
          action(state, ...(params as never[]))
          state = { ...state }
          listeners.forEach(listener => { listener() })
        },
      ])) as BakedActions<T, A>
      return {
        actions,
        getSnapshot: () => state,
        subscribe: (listener: () => void) => {
          listeners.add(listener)
          return () => { listeners.delete(listener) }
        },
        clearPersisted: () => {},
      }
    },
  }
}
