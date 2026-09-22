import type { Rental } from '@/types'
import { rentals as mockRentals } from '@/mocks/rentals'
import { delay } from '@/utils/async'

// Reemplazar por: GET /api/rentals, PATCH /api/rentals/:id

export const rentalService = {
  async getRentals(): Promise<Rental[]> {
    return delay([...mockRentals], 220)
  },
  async getRentalById(id: string): Promise<Rental | undefined> {
    return delay(mockRentals.find((r) => r.id === id), 150)
  },
}
