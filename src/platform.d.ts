declare module '@deepseek-ai/cordis' {
  export interface Context {}
}

// Local adaptation for DeepSeek Harness 0.2.1-rc.5: the client store module is
// shipped as @deepseek-ai/dsh-client-store in the web platform seed table; the
// former @deepseek-ai/dsh-client-runtime package no longer exists.
declare module '@deepseek-ai/dsh-client-store' {
  export interface StoreSpec<T, A> {
    init: () => T
    persist?: string
    actions: A
  }

  export type BakedActions<T, A> = {
    [K in keyof A]: A[K] extends (draft: T, ...params: infer P) => void
      ? (...params: P) => void
      : never
  }

  export interface StoreInstance<T, A> {
    readonly actions: BakedActions<T, A>
    getSnapshot(): T
    subscribe(fn: () => void): () => void
    clearPersisted(): void
  }

  export interface StoreHandle<T, A> {
    readonly spec: StoreSpec<T, A>
    create(scopeKey?: string): StoreInstance<T, A>
  }

  export type EngineStoreHandle<T, A> = StoreHandle<T, A>

  export function defineStore<T, A>(
    decl: StoreSpec<T, A> & { actions: A },
  ): EngineStoreHandle<T, A>
}
