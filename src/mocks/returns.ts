import type { ReturnRecord } from '@/types'

export const returns: ReturnRecord[] = [
  {
    id: 'DEV-001',
    code: 'DEV-001',
    rentalId: 'ALQ-003',
    returnedAt: '2026-09-12T21:40:00',
    condition: 'Completa',
    missingPieceIds: [],
    damageNotes: '',
    lateHours: 0,
    lateFee: 0,
    missingFee: 0,
    totalFee: 0,
    observations: 'Traje devuelto en perfecto estado, dentro del horario acordado.',
  },
  {
    id: 'DEV-002',
    code: 'DEV-002',
    rentalId: 'ALQ-005',
    returnedAt: '2026-09-11T06:00:00',
    condition: 'ConRetraso',
    missingPieceIds: ['PIE-TR-001-06'],
    damageNotes: '',
    lateHours: 12,
    lateFee: 20,
    missingFee: 80,
    totalFee: 100,
    observations: 'Devolución con 12 horas de retraso. Cascabeles no fueron devueltos.',
  },
]

export function getReturnByRental(rentalId: string): ReturnRecord | undefined {
  return returns.find((r) => r.rentalId === rentalId)
}
