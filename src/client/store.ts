import {
  defineStore,
  type BakedActions,
  type EngineStoreHandle,
} from '@deepseek-ai/dsh-client-runtime/client'
import type { PickerState } from './types.ts'

export type PickerStoreActions = {
  sync: (draft: PickerState, state: PickerState) => void
}

export function createPickerStore(): EngineStoreHandle<PickerState, PickerStoreActions> {
  return defineStore({
    init: (): PickerState => ({
      preference: 'system',
      activeId: 'light',
      themes: [],
      revision: -1,
    }),
    actions: {
      sync: (draft, state) => {
        if (state.revision <= draft.revision) return
        draft.preference = state.preference
        draft.activeId = state.activeId
        draft.themes = state.themes
        draft.revision = state.revision
      },
    },
  })
}

export type PickerActions = BakedActions<PickerState, PickerStoreActions>
