import { create } from 'zustand'
import type { ReturnRecord } from '@/types'
import { returnService } from '@/services/return.service'

interface State {
  items: ReturnRecord[]
  loading: boolean
  fetchReturns: () => Promise<void>
}

export const useReturnStore = create<State>((set) => ({
  items: [],
  loading: false,
  fetchReturns: async () => {
    set({ loading: true })
    try {
      const items = await returnService.getReturns()
      set({ items })
    } finally {
      set({ loading: false })
    }
  },
}))
