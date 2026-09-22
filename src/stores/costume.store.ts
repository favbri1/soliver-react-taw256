import { create } from 'zustand'
import type { Costume } from '@/types'
import { costumeService, type CostumeFilters } from '@/services/costume.service'

interface State {
  items: Costume[]
  featured: Costume[]
  loading: boolean
  filters: CostumeFilters
  fetchCostumes: () => Promise<void>
  fetchFeatured: () => Promise<void>
  setFilters: (filters: Partial<CostumeFilters>) => void
  byId: (id: string) => Costume | undefined
}

export const useCostumeStore = create<State>((set, get) => ({
  items: [],
  featured: [],
  loading: false,
  filters: { category: 'Todas', size: 'Todas', search: '' },
  fetchCostumes: async () => {
    set({ loading: true })
    try {
      const items = await costumeService.getCostumes(get().filters)
      set({ items })
    } finally {
      set({ loading: false })
    }
  },
  fetchFeatured: async () => {
    const featured = await costumeService.getFeatured()
    set({ featured })
  },
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  byId: (id) => get().items.find((c) => c.id === id),
}))
