import type { Payment } from '@/types'

export const payments: Payment[] = [
  {
    id: 'PAG-001',
    code: 'PAG-001',
    reservationId: 'RES-001',
    clientId: 'CLI-001',
    concept: 'Anticipo de reserva',
    amount: 175,
    method: 'QR',
    status: 'Pagado',
    date: '2026-09-05T09:20:00',
  },
  {
    id: 'PAG-002',
    code: 'PAG-002',
    reservationId: 'RES-002',
    clientId: 'CLI-002',
    concept: 'Anticipo de reserva',
    amount: 95,
    method: 'Efectivo',
    status: 'Pagado',
    date: '2026-08-30T14:25:00',
  },
  {
    id: 'PAG-003',
    code: 'PAG-003',
    reservationId: 'RES-002',
    clientId: 'CLI-002',
    concept: 'Saldo restante',
    amount: 395,
    method: 'Transferencia',
    status: 'Pendiente',
    date: '2026-09-14T00:00:00',
  },
  {
    id: 'PAG-004',
    code: 'PAG-004',
    reservationId: 'RES-003',
    clientId: 'CLI-003',
    concept: 'Pago completo',
    amount: 520,
    method: 'Transferencia',
    status: 'Pagado',
    date: '2026-09-01T11:10:00',
  },
  {
    id: 'PAG-005',
    code: 'PAG-005',
    reservationId: 'RES-006',
    clientId: 'CLI-004',
    concept: 'Devolución de depósito',
    amount: 350,
    method: 'Transferencia',
    status: 'Reembolsado',
    date: '2026-09-12T22:30:00',
  },
  {
    id: 'PAG-006',
    code: 'PAG-006',
    reservationId: 'RES-005',
    clientId: 'CLI-006',
    concept: 'Anticipo de reserva',
    amount: 165,
    method: 'QR',
    status: 'Parcial',
    date: '2026-09-10T10:10:00',
  },
]

export function getPaymentsByReservation(reservationId: string): Payment[] {
  return payments.filter((p) => p.reservationId === reservationId)
}
