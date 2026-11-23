import type { Costume, OperationType, Reservation } from '@/types'

/** Porcentaje del anticipo para confirmar una reserva o pedido. */
export const ADVANCE_PERCENT = 0.5

/** ¿El traje se ofrece también para compra? (requiere un precio de venta válido). */
export function canBeSold(c: Pick<Costume, 'saleAvailable' | 'salePrice' | 'rentalPrice'>): boolean {
  return !!c.saleAvailable && typeof c.salePrice === 'number' && c.salePrice > c.rentalPrice
}

/** Operación de una reserva; las anteriores a la venta no tienen el campo y son alquileres. */
export function operationOf(r: Pick<Reservation, 'operation'>): OperationType {
  return r.operation ?? 'Alquiler'
}

export interface OrderTotals {
  unitPrice: number
  subtotal: number
  deposit: number
  total: number
  advance: number
}

/**
 * Totales de un pedido según la modalidad:
 *  - Alquiler: (precio de alquiler + depósito) × cantidad; anticipo = 50% del alquiler.
 *  - Venta:    precio de venta × cantidad, sin depósito; anticipo = 50% del total.
 */
export function calcOrder(
  c: Pick<Costume, 'rentalPrice' | 'deposit' | 'salePrice'>,
  mode: OperationType,
  quantity: number,
): OrderTotals {
  const unitPrice = mode === 'Venta' ? c.salePrice ?? 0 : c.rentalPrice
  const subtotal = unitPrice * quantity
  const deposit = mode === 'Venta' ? 0 : c.deposit * quantity
  return {
    unitPrice,
    subtotal,
    deposit,
    total: subtotal + deposit,
    advance: Math.round(subtotal * ADVANCE_PERCENT),
  }
}
