import type { Payment } from '@/types'
import { payments as mockPayments } from '@/mocks/payments'
import { delay } from '@/utils/async'

// Reemplazar por: GET /api/payments, POST /api/payments

export const paymentService = {
  async getPayments(): Promise<Payment[]> {
    return delay([...mockPayments], 200)
  },
  async getPaymentsByReservation(reservationId: string): Promise<Payment[]> {
    return delay(mockPayments.filter((p) => p.reservationId === reservationId), 150)
  },
}
