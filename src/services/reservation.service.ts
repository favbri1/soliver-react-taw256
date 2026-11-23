import type { Reservation } from '@/types'
import { reservations as mockReservations, getReservationsByCostume } from '@/mocks/reservations'
import { delay } from '@/utils/async'
import { operationOf } from '@/utils/pricing'

// Reemplazar por:
//   GET /api/reservations
//   GET /api/reservations/availability
//   POST /api/reservations

let reservationSeq = mockReservations.length + 1

export interface AvailabilityQuery {
  costumeId: string
  startDate: string
  endDate: string
}

export interface AvailabilityResult {
  available: boolean
  conflicts: Reservation[]
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd)
}

export const reservationService = {
  async getReservations(): Promise<Reservation[]> {
    return delay([...mockReservations], 220)
  },

  async getReservationsByCostume(costumeId: string): Promise<Reservation[]> {
    // El calendario es de alquileres: las ventas no ocupan fechas.
    return delay(getReservationsByCostume(costumeId).filter((r) => operationOf(r) === 'Alquiler'), 180)
  },

  async checkAvailability(query: AvailabilityQuery): Promise<AvailabilityResult> {
    // Solo los alquileres ocupan fechas; una venta no bloquea la disponibilidad.
    const active = getReservationsByCostume(query.costumeId).filter(
      (r) =>
        operationOf(r) === 'Alquiler' &&
        ['Pendiente', 'Confirmada', 'Preparando', 'Entregada', 'EnAlquiler'].includes(r.status),
    )
    const conflicts = active.filter((r) => overlaps(query.startDate, query.endDate, r.startDate, r.endDate))
    return delay({ available: conflicts.length === 0, conflicts }, 350)
  },

  async createReservation(input: Omit<Reservation, 'id' | 'code' | 'createdAt' | 'status' | 'depositStatus'>): Promise<Reservation> {
    const id = `RES-${String(reservationSeq).padStart(3, '0')}`
    // Las ventas usan un prefijo propio para distinguirlas del alquiler.
    const prefix = input.operation === 'Venta' ? 'VTA' : 'SOL'
    const code = `${prefix}-2026-${String(100 + reservationSeq).padStart(5, '0')}`
    reservationSeq += 1
    const reservation: Reservation = {
      ...input,
      id,
      code,
      status: 'Pendiente',
      // En ventas no hay depósito; este campo no se muestra en ninguna pantalla.
      depositStatus: 'Pendiente',
      createdAt: new Date().toISOString(),
    }
    mockReservations.push(reservation)
    return delay(reservation, 400)
  },

  async getReservationById(id: string): Promise<Reservation | undefined> {
    return delay(mockReservations.find((r) => r.id === id || r.code === id), 150)
  },
}
