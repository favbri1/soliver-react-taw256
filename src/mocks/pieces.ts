import type { Piece } from '@/types'

// Las piezas están vinculadas a un traje (costumeId) mediante su código TR-xxx.
// "critical: true" significa que sin esa pieza el conjunto no puede alquilarse completo.

function kit(costumeId: string, items: { name: string; critical?: boolean }[]): Piece[] {
  return items.map((it, i) => ({
    id: `PIE-${costumeId}-${String(i + 1).padStart(2, '0')}`,
    name: it.name,
    costumeId,
    critical: it.critical ?? true,
    status: 'Disponible',
  }))
}

const varonKit = (id: string) =>
  kit(id, [
    { name: 'Sombrero' },
    { name: 'Camisa' },
    { name: 'Faja' },
    { name: 'Pantalón' },
    { name: 'Botas' },
    { name: 'Cascabeles', critical: false },
  ])

const chinaSupayKit = (id: string) =>
  kit(id, [
    { name: 'Sombrero' },
    { name: 'Blusa' },
    { name: 'Pollera' },
    { name: 'Enaguas' },
    { name: 'Botas' },
    { name: 'Pañuelo', critical: false },
  ])

const cholitaKit = (id: string) =>
  kit(id, [
    { name: 'Sombrero Borsalino' },
    { name: 'Manta' },
    { name: 'Pollera' },
    { name: 'Blusa' },
    { name: 'Botines' },
    { name: 'Aguayo', critical: false },
  ])

const achachiKit = (id: string) =>
  kit(id, [
    { name: 'Máscara' },
    { name: 'Poncho' },
    { name: 'Sombrero' },
    { name: 'Bastón', critical: false },
    { name: 'Pantalón' },
    { name: 'Botas' },
  ])

const infantilKit = (id: string) =>
  kit(id, [
    { name: 'Sombrero' },
    { name: 'Camisa / Blusa' },
    { name: 'Pantalón / Pollera' },
    { name: 'Botas' },
  ])

export const pieces: Piece[] = [
  ...varonKit('TR-001'),
  ...varonKit('TR-002'),
  ...varonKit('TR-003'),
  ...varonKit('TR-004'),
  ...chinaSupayKit('TR-005'),
  ...chinaSupayKit('TR-006'),
  ...cholitaKit('TR-007'),
  ...cholitaKit('TR-008'),
  ...achachiKit('TR-009'),
  ...infantilKit('TR-010'),
  ...infantilKit('TR-011'),
  ...varonKit('TR-012'),
]

export function getPiecesByCostume(costumeId: string): Piece[] {
  return pieces.filter((p) => p.costumeId === costumeId)
}
