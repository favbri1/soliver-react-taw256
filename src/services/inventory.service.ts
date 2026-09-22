import type {
  Costume,
  CostumeCategory,
  CostumeImage,
  CostumeStatus,
  InventoryDistribution,
  Piece,
} from '@/types'
import { costumes as mockCostumes } from '@/mocks/costumes'
import { pieces as mockPieces, getPiecesByCostume } from '@/mocks/pieces'
import { delay } from '@/utils/async'

// Reemplazar por:
//   GET    /api/inventory/costumes
//   GET    /api/inventory/pieces/:costumeId
//   PATCH  /api/inventory/pieces/:pieceId
//   POST   /api/inventory/costumes        -> createCostume
//   PATCH  /api/inventory/costumes/:id    -> updateCostume
//   DELETE /api/inventory/costumes/:id    -> deleteCostume

// ⚠️ IMPORTANTE (mientras no exista backend):
// createCostume / updateCostume / deleteCostume mutan el arreglo `mockCostumes`
// que vive EN MEMORIA. Los cambios se ven en todo el frontend (catálogo público,
// panel admin, detalle) mientras la pestaña siga abierta, pero SE PIERDEN al
// recargar la página (F5), porque no hay persistencia real todavía.

/** Datos que el formulario de admin envía para crear un traje. */
export interface CostumeInput {
  name: string
  category: CostumeCategory
  description?: string
  rentalPrice: number
  deposit: number
  availableSizes: string[]
  images: CostumeImage[]
  status?: CostumeStatus
}

/** Siguiente código correlativo tipo TR-0xx, basado en los que ya existen. */
function nextCostumeCode(): string {
  const numbers = mockCostumes
    .map((c) => Number(c.code.replace(/\D/g, '')))
    .filter((n) => !Number.isNaN(n))
  const max = numbers.length ? Math.max(...numbers) : 0
  return `TR-${String(max + 1).padStart(3, '0')}`
}

export const inventoryService = {
  async getCostumes(): Promise<Costume[]> {
    return delay([...mockCostumes], 220)
  },

  async getPiecesByCostume(costumeId: string): Promise<Piece[]> {
    return delay(getPiecesByCostume(costumeId), 150)
  },

  async isSetComplete(costumeId: string): Promise<boolean> {
    const pieces = getPiecesByCostume(costumeId)
    const criticalOccupied = pieces.some((p) => p.critical && p.status !== 'Disponible')
    return delay(!criticalOccupied, 100)
  },

  async getDistribution(): Promise<InventoryDistribution[]> {
    const statuses: CostumeStatus[] = [
      'Disponible',
      'Reservado',
      'Alquilado',
      'Limpieza',
      'Reparacion',
      'Danado',
      'Extraviado',
    ]
    const dist = statuses
      .map((status) => ({ status, count: mockCostumes.filter((c) => c.status === status).length }))
      .filter((d) => d.count > 0)
    return delay(dist, 180)
  },

  async getAllPieces(): Promise<Piece[]> {
    return delay([...mockPieces], 180)
  },

  // ---------------- CRUD en memoria (sin backend) ----------------

  async createCostume(input: CostumeInput): Promise<Costume> {
    const code = nextCostumeCode()
    const costume: Costume = {
      id: code,
      code,
      name: input.name,
      category: input.category,
      description: input.description ?? '',
      rentalPrice: input.rentalPrice,
      deposit: input.deposit,
      availableSizes: input.availableSizes,
      pieceIds: [], // sin backend no generamos piezas para trajes nuevos
      images: input.images,
      status: input.status ?? 'Disponible',
    }
    mockCostumes.push(costume)
    return delay(costume, 300)
  },

  async updateCostume(id: string, changes: Partial<CostumeInput>): Promise<Costume | undefined> {
    const index = mockCostumes.findIndex((c) => c.id === id)
    if (index === -1) return delay(undefined, 200)
    const updated: Costume = { ...mockCostumes[index], ...changes }
    mockCostumes[index] = updated
    return delay(updated, 300)
  },

  async deleteCostume(id: string): Promise<boolean> {
    const index = mockCostumes.findIndex((c) => c.id === id)
    if (index === -1) return delay(false, 200)
    mockCostumes.splice(index, 1)
    return delay(true, 300)
  },
}
