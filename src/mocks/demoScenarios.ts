import type { AlertItem, DashboardMetric, DemoScenario, InventoryDistribution } from '@/types'

export interface ScenarioDefinition {
  id: DemoScenario
  label: string
  description: string
  metrics: DashboardMetric[]
  distribution: InventoryDistribution[]
  alerts: AlertItem[]
}

export const demoScenarios: ScenarioDefinition[] = [
  {
    id: 'dia-normal',
    label: 'Día normal',
    description: 'Operación habitual: disponibilidad estable y pocas reservas activas.',
    metrics: [
      { label: 'Reservas de hoy', value: 4 },
      { label: 'Alquileres activos', value: 6 },
      { label: 'Trajes disponibles', value: 9 },
      { label: 'Trajes reservados', value: 1 },
      { label: 'Devoluciones pendientes', value: 1 },
      { label: 'Ingresos del período', value: 4180, prefix: 'Bs. ' },
    ],
    distribution: [
      { status: 'Disponible', count: 9 },
      { status: 'Reservado', count: 1 },
      { status: 'Alquilado', count: 1 },
      { status: 'Reparacion', count: 1 },
    ],
    alerts: [
      {
        id: 'a1',
        type: 'success',
        title: 'Reserva confirmada',
        message: 'Reserva SOL-2026-00124 confirmada correctamente.',
      },
      { id: 'a2', type: 'info', title: 'Inventario estable', message: 'No hay incidencias registradas hoy.' },
    ],
  },
  {
    id: 'alta-demanda',
    label: 'Alta demanda',
    description: 'Temporada de entrada: muchas reservas y fechas próximas llenándose.',
    metrics: [
      { label: 'Reservas de hoy', value: 12 },
      { label: 'Alquileres activos', value: 18 },
      { label: 'Trajes disponibles', value: 4 },
      { label: 'Trajes reservados', value: 6 },
      { label: 'Devoluciones pendientes', value: 2 },
      { label: 'Ingresos del período', value: 9760, prefix: 'Bs. ' },
    ],
    distribution: [
      { status: 'Disponible', count: 4 },
      { status: 'Reservado', count: 6 },
      { status: 'Alquilado', count: 2 },
    ],
    alerts: [
      {
        id: 'a1',
        type: 'warning',
        title: 'Disponibilidad limitada',
        message: 'Solo quedan 2 trajes de la categoría China Supay para el próximo sábado.',
      },
      {
        id: 'a2',
        type: 'info',
        title: 'Alta afluencia',
        message: 'Las reservas para la entrada del 20 de septiembre aumentaron 40% esta semana.',
      },
    ],
  },
  {
    id: 'dia-entrada',
    label: 'Día de entrada',
    description: 'Jornada de alta actividad: múltiples entregas y alquileres simultáneos.',
    metrics: [
      { label: 'Reservas de hoy', value: 3 },
      { label: 'Alquileres activos', value: 28 },
      { label: 'Trajes disponibles', value: 2 },
      { label: 'Trajes reservados', value: 3 },
      { label: 'Devoluciones pendientes', value: 7 },
      { label: 'Ingresos del período', value: 15400, prefix: 'Bs. ' },
    ],
    distribution: [
      { status: 'Disponible', count: 2 },
      { status: 'Reservado', count: 3 },
      { status: 'Alquilado', count: 7 },
    ],
    alerts: [
      {
        id: 'a1',
        type: 'info',
        title: 'Entrega en curso',
        message: 'ALQ-004 se encuentra en preparación para entrega a las 10:00.',
      },
      {
        id: 'a2',
        type: 'warning',
        title: 'Devolución atrasada',
        message: 'El alquiler ALQ-005 debía devolverse hace 4 horas.',
      },
    ],
  },
  {
    id: 'devoluciones',
    label: 'Devoluciones',
    description: 'Foco en devoluciones pendientes, algunas atrasadas y con multas aplicadas.',
    metrics: [
      { label: 'Reservas de hoy', value: 2 },
      { label: 'Alquileres activos', value: 5 },
      { label: 'Trajes disponibles', value: 7 },
      { label: 'Trajes reservados', value: 1 },
      { label: 'Devoluciones pendientes', value: 5 },
      { label: 'Ingresos del período', value: 3620, prefix: 'Bs. ' },
    ],
    distribution: [
      { status: 'Disponible', count: 7 },
      { status: 'Reservado', count: 1 },
      { status: 'Alquilado', count: 4 },
      { status: 'Limpieza', count: 1 },
    ],
    alerts: [
      {
        id: 'a1',
        type: 'warning',
        title: 'Devolución atrasada',
        message: 'El alquiler ALQ-005 debía devolverse hace 4 horas. Multa estimada: Bs. 100.',
      },
      {
        id: 'a2',
        type: 'info',
        title: 'Depósito aplicado',
        message: 'Se descontó Bs. 100 de la garantía de Ricardo Mamani por retraso y pieza faltante.',
      },
    ],
  },
  {
    id: 'incidencias',
    label: 'Inventario con incidencias',
    description: 'Piezas dañadas, faltantes y trajes fuera de circulación por reparación.',
    metrics: [
      { label: 'Reservas de hoy', value: 5 },
      { label: 'Alquileres activos', value: 8 },
      { label: 'Trajes disponibles', value: 6 },
      { label: 'Trajes reservados', value: 2 },
      { label: 'Devoluciones pendientes', value: 2 },
      { label: 'Ingresos del período', value: 5230, prefix: 'Bs. ' },
    ],
    distribution: [
      { status: 'Disponible', count: 6 },
      { status: 'Reservado', count: 2 },
      { status: 'Alquilado', count: 1 },
      { status: 'Reparacion', count: 2 },
      { status: 'Danado', count: 1 },
    ],
    alerts: [
      {
        id: 'a1',
        type: 'warning',
        title: 'Inventario',
        message: 'El conjunto China Supay Talla M tiene una pieza faltante.',
      },
      {
        id: 'a2',
        type: 'warning',
        title: 'Traje dañado',
        message: 'Achachi Ceremonial fue reportado con daños en el poncho y está en reparación.',
      },
    ],
  },
]

export function getScenario(id: DemoScenario): ScenarioDefinition {
  return demoScenarios.find((s) => s.id === id) ?? demoScenarios[0]
}
