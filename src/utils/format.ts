import { format, differenceInCalendarDays, differenceInHours } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatCurrency(value: number): string {
  return `Bs. ${value.toLocaleString('es-BO', { minimumFractionDigits: 0 })}`
}

export function formatDate(iso: string, pattern = 'dd MMM yyyy'): string {
  try {
    return format(new Date(iso), pattern, { locale: es })
  } catch {
    return iso
  }
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "dd MMM yyyy '·' HH:mm", { locale: es })
}

export function formatTime(iso: string): string {
  return format(new Date(iso), 'HH:mm')
}

export function nightsBetween(startIso: string, endIso: string): number {
  return Math.max(1, differenceInCalendarDays(new Date(endIso), new Date(startIso)))
}

export function hoursBetween(a: string, b: string): number {
  return differenceInHours(new Date(a), new Date(b))
}
