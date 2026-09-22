// ============================================================
// SOLIVER — Tipos de dominio
// Estas interfaces definen el contrato de datos que hoy sirve
// MockService y que mañana servirá una REST API real.
// ============================================================

export type CostumeCategory =
  | 'Varon-Tropa'
  | 'Macho-Caporal'
  | 'China-Supay'
  | 'Cholita'
  | 'Achachi'
  | 'Infantil'

export const CATEGORY_LABELS: Record<CostumeCategory, string> = {
  'Varon-Tropa': 'Varón / Tropa',
  'Macho-Caporal': 'Macho Caporal',
  'China-Supay': 'China Supay',
  Cholita: 'Cholita',
  Achachi: 'Achachi',
  Infantil: 'Infantil',
}

export type CostumeStatus =
  | 'Disponible'
  | 'Reservado'
  | 'Alquilado'
  | 'Limpieza'
  | 'Reparacion'
  | 'Danado'
  | 'Extraviado'

export type PieceStatus =
  | 'Disponible'
  | 'Reservado'
  | 'Alquilado'
  | 'Limpieza'
  | 'Reparacion'
  | 'Danado'
  | 'Extraviado'

export interface Piece {
  id: string
  name: string
  costumeId: string
  critical: boolean
  status: PieceStatus
}

export interface CostumeImage {
  url: string
  alt: string
}

export interface Costume {
  id: string
  code: string
  name: string
  category: CostumeCategory
  description: string
  rentalPrice: number
  deposit: number
  availableSizes: string[]
  pieceIds: string[]
  images: CostumeImage[]
  status: CostumeStatus
  featured?: boolean
  rating?: number
  totalRentals?: number
}

export interface Size {
  code: string
  label: string
}

export type ReservationStatus =
  | 'Pendiente'
  | 'Confirmada'
  | 'Preparando'
  | 'Entregada'
  | 'EnAlquiler'
  | 'Devuelta'
  | 'Cancelada'

export interface Reservation {
  id: string
  code: string
  costumeId: string
  clientId: string
  /** Talla principal. Se mantiene por compatibilidad con reservas de 1 unidad. */
  size: string
  /** Cantidad de unidades del mismo traje (por defecto 1). */
  quantity?: number
  /** Talla elegida para CADA unidad. Su largo debe coincidir con `quantity`. */
  sizes?: string[]
  startDate: string // ISO
  endDate: string // ISO
  status: ReservationStatus
  rentalAmount: number
  depositAmount: number
  advanceAmount: number
  totalAmount: number
  depositStatus: 'Pendiente' | 'Registrado' | 'Devuelto' | 'Aplicado'
  createdAt: string
}

export interface Client {
  id: string
  name: string
  phone: string
  email: string
  documentId: string
  totalRentals: number
  activeReservations: number
  status: 'Activo' | 'Nuevo' | 'Moroso'
  since: string
}

export type RentalStatus = 'Preparando' | 'Entregado' | 'EnAlquiler' | 'Devuelto' | 'Vencido'

export interface Rental {
  id: string
  code: string
  reservationId: string
  clientId: string
  costumeId: string
  size: string
  pickupAt: string
  returnDueAt: string
  status: RentalStatus
}

export type ReturnCondition = 'Completa' | 'ConRetraso' | 'ConDanos' | 'Incompleta'

export interface ReturnRecord {
  id: string
  code: string
  rentalId: string
  returnedAt: string
  condition: ReturnCondition
  missingPieceIds: string[]
  damageNotes: string
  lateHours: number
  lateFee: number
  missingFee: number
  totalFee: number
  observations: string
}

export type PaymentMethod = 'Efectivo' | 'Transferencia' | 'QR'
export type PaymentStatus = 'Pendiente' | 'Pagado' | 'Parcial' | 'Reembolsado'

export interface Payment {
  id: string
  code: string
  reservationId: string
  clientId: string
  concept: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  date: string
}

export interface DashboardMetric {
  label: string
  value: number
  delta?: number
  suffix?: string
  prefix?: string
}

export interface MonthlyPoint {
  label: string
  value: number
}

export interface InventoryDistribution {
  status: CostumeStatus
  count: number
}

export type DemoScenario =
  | 'dia-normal'
  | 'alta-demanda'
  | 'dia-entrada'
  | 'devoluciones'
  | 'incidencias'

export interface AlertItem {
  id: string
  type: 'warning' | 'success' | 'info'
  title: string
  message: string
}
