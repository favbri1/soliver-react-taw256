import type { Rental } from '@/types'

export const rentals: Rental[] = [
  {
    id: 'ALQ-001',
    code: 'ALQ-001',
    reservationId: 'RES-002',
    clientId: 'CLI-002',
    costumeId: 'TR-006',
    size: 'M',
    pickupAt: '2026-09-12T09:00:00',
    returnDueAt: '2026-09-14T19:00:00',
    status: 'EnAlquiler',
  },
  {
    id: 'ALQ-002',
    code: 'ALQ-002',
    reservationId: 'RES-003',
    clientId: 'CLI-003',
    costumeId: 'TR-005',
    size: 'M',
    pickupAt: '2026-09-12T08:10:00',
    returnDueAt: '2026-09-13T20:00:00',
    status: 'Entregado',
  },
  {
    id: 'ALQ-003',
    code: 'ALQ-003',
    reservationId: 'RES-006',
    clientId: 'CLI-004',
    costumeId: 'TR-002',
    size: 'L',
    pickupAt: '2026-09-12T07:05:00',
    returnDueAt: '2026-09-12T22:00:00',
    status: 'Devuelto',
  },
  {
    id: 'ALQ-004',
    code: 'ALQ-004',
    reservationId: 'RES-001',
    clientId: 'CLI-001',
    costumeId: 'TR-003',
    size: 'L',
    pickupAt: '2026-09-18T10:00:00',
    returnDueAt: '2026-09-20T18:00:00',
    status: 'Preparando',
  },
  {
    id: 'ALQ-005',
    code: 'ALQ-005',
    reservationId: 'RES-004',
    clientId: 'CLI-006',
    costumeId: 'TR-001',
    size: 'M',
    pickupAt: '2026-09-08T10:00:00',
    returnDueAt: '2026-09-10T18:00:00',
    status: 'Vencido',
  },
]

export function getRentalById(id: string): Rental | undefined {
  return rentals.find((r) => r.id === id)
}
