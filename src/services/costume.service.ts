import type { Costume, CostumeCategory } from '@/types'
import { costumes as mockCostumes } from '@/mocks/costumes'
import { delay } from '@/utils/async'

// ------------------------------------------------------------
// Hoy: MOCK DATA en memoria.
// Mañana: reemplazar el cuerpo de cada función por un fetch a
//   GET /api/costumes
//   GET /api/costumes/:id
// manteniendo exactamente la misma firma, para no tocar las vistas.
// ------------------------------------------------------------

export interface CostumeFilters {
  category?: CostumeCategory | 'Todas'
  size?: string | 'Todas'
  search?: string
  onlyAvailable?: boolean
  maxPrice?: number
}

export const costumeService = {
  async getCostumes(filters: CostumeFilters = {}): Promise<Costume[]> {
    let result = [...mockCostumes]

    if (filters.category && filters.category !== 'Todas') {
      result = result.filter((c) => c.category === filters.category)
    }
    if (filters.size && filters.size !== 'Todas') {
      result = result.filter((c) => c.availableSizes.includes(filters.size!))
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    }
    if (filters.onlyAvailable) {
      result = result.filter((c) => c.status === 'Disponible')
    }
    if (filters.maxPrice) {
      result = result.filter((c) => c.rentalPrice <= filters.maxPrice!)
    }

    return delay(result, 220)
  },

  async getCostumeById(id: string): Promise<Costume | undefined> {
    return delay(mockCostumes.find((c) => c.id === id), 180)
  },

  async getFeatured(): Promise<Costume[]> {
    return delay(mockCostumes.filter((c) => c.featured), 180)
  },
}
