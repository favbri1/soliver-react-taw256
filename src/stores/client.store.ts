import { create } from 'zustand'
import type { Client } from '@/types'
import { clientService } from '@/services/client.service'

interface State {
  items: Client[]
  loading: boolean
  fetchClients: () => Promise<void>
}

export const useClientStore = create<State>((set) => ({
  items: [],
  loading: false,
  fetchClients: async () => {
    set({ loading: true })
    try {
      const items = await clientService.getClients()
      set({ items })
    } finally {
      set({ loading: false })
    }
  },
}))
