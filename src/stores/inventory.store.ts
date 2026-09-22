import { create } from 'zustand'
import type { Costume, InventoryDistribution, Piece } from '@/types'
import { inventoryService, type CostumeInput } from '@/services/inventory.service'

// ⚠️ Sin backend todavía: todas las mutaciones de abajo (create/update/delete)
// viven solo en memoria (arreglo mock + estado de Zustand). Los cambios
// desaparecen al recargar la página. Cuando exista la API, basta con que
// inventoryService haga el fetch real: este store no cambia.

interface State {
  costumes: Costume[]
  distribution: InventoryDistribution[]
  loading: boolean
  saving: boolean
  fetchAll: () => Promise<void>
  getPieces: (costumeId: string) => Promise<Piece[]>
  createCostume: (input: CostumeInput) => Promise<Costume>
  updateCostume: (id: string, changes: Partial<CostumeInput>) => Promise<void>
  deleteCostume: (id: string) => Promise<void>
}

export const useInventoryStore = create<State>((set, get) => ({
  costumes: [],
  distribution: [],
  loading: false,
  saving: false,
  fetchAll: async () => {
    set({ loading: true })
    try {
      const [costumes, distribution] = await Promise.all([
        inventoryService.getCostumes(),
        inventoryService.getDistribution(),
      ])
      set({ costumes, distribution })
    } finally {
      set({ loading: false })
    }
  },
  getPieces: async (costumeId: string) => inventoryService.getPiecesByCostume(costumeId),

  createCostume: async (input) => {
    set({ saving: true })
    try {
      const created = await inventoryService.createCostume(input)
      set({ costumes: [...get().costumes, created] })
      return created
    } finally {
      set({ saving: false })
    }
  },

  updateCostume: async (id, changes) => {
    set({ saving: true })
    try {
      const updated = await inventoryService.updateCostume(id, changes)
      if (updated) {
        set({ costumes: get().costumes.map((c) => (c.id === id ? updated : c)) })
      }
    } finally {
      set({ saving: false })
    }
  },

  deleteCostume: async (id) => {
    set({ saving: true })
    try {
      const ok = await inventoryService.deleteCostume(id)
      if (ok) {
        set({ costumes: get().costumes.filter((c) => c.id !== id) })
      }
    } finally {
      set({ saving: false })
    }
  },
}))
