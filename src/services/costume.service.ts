import type { Costume, CostumeCategory } from '@/types'
import { costumes as mockCostumes } from '@/mocks/costumes'
import { isCostumeActive } from '@/utils/costume'
import { canBeSold } from '@/utils/pricing'
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
  /** Solo trajes que también se pueden comprar. */
  saleOnly?: boolean
}

export const costumeService = {
  async getCostumes(filters: CostumeFilters = {}): Promise<Costume[]> {
    // Eliminación lógica: los trajes eliminados no aparecen en el catálogo.
    let result = mockCostumes.filter(isCostumeActive)

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
    if (filters.saleOnly) {
      result = result.filter(canBeSold)
    }
    if (filters.maxPrice) {
      result = result.filter((c) => c.rentalPrice <= filters.maxPrice!)
    }

    return delay(result, 220)
  },

  /**
   * Por defecto NO devuelve trajes eliminados (el detalle público y la reserva
   * no deben abrirse para un traje dado de baja). El historial de reservas usa
   * `includeDeleted: true` para seguir mostrando el nombre del traje.
   */
  async getCostumeById(id: string, options: { includeDeleted?: boolean } = {}): Promise<Costume | undefined> {
    const found = mockCostumes.find((c) => c.id === id)
    const visible = found && (options.includeDeleted || isCostumeActive(found)) ? found : undefined
    return delay(visible, 180)
  },

  async getFeatured(): Promise<Costume[]> {
    return delay(mockCostumes.filter((c) => c.featured && isCostumeActive(c)), 180)
  },
}
