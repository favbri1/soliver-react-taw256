import type { ReturnRecord } from '@/types'
import { returns as mockReturns } from '@/mocks/returns'
import { delay } from '@/utils/async'
import { hoursBetween } from '@/utils/format'

// Reemplazar por: GET /api/returns, POST /api/returns

const LATE_FEE_PER_HOUR = 5
const MISSING_PIECE_FEE = 80

export const returnService = {
  async getReturns(): Promise<ReturnRecord[]> {
    return delay([...mockReturns], 200)
  },

  async getReturnByRental(rentalId: string): Promise<ReturnRecord | undefined> {
    return delay(mockReturns.find((r) => r.rentalId === rentalId), 150)
  },

  /** Calcula multa simulada a partir de retraso y piezas faltantes. */
  calculateFee(dueAt: string, returnedAt: string, missingPieceCount: number) {
    const lateHours = Math.max(0, hoursBetween(returnedAt, dueAt))
    const lateFee = lateHours > 0 ? Math.ceil(lateHours / 6) * LATE_FEE_PER_HOUR : 0
    const missingFee = missingPieceCount * MISSING_PIECE_FEE
    return { lateHours, lateFee, missingFee, totalFee: lateFee + missingFee }
  },
}
