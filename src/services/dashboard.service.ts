import type { DashboardMetric, DemoScenario, MonthlyPoint, InventoryDistribution, AlertItem } from '@/types'
import { reservationsByMonth, revenueByMonth, topCostumes } from '@/mocks/dashboard'
import { getScenario } from '@/mocks/demoScenarios'
import { delay } from '@/utils/async'

// Reemplazar por: GET /api/dashboard?scenario=...

export interface DashboardStats {
  metrics: DashboardMetric[]
  distribution: InventoryDistribution[]
  alerts: AlertItem[]
  reservationsByMonth: MonthlyPoint[]
  revenueByMonth: MonthlyPoint[]
  topCostumes: MonthlyPoint[]
}

export const dashboardService = {
  async getDashboardStats(scenario: DemoScenario = 'dia-normal'): Promise<DashboardStats> {
    const s = getScenario(scenario)
    return delay(
      {
        metrics: s.metrics,
        distribution: s.distribution,
        alerts: s.alerts,
        reservationsByMonth,
        revenueByMonth,
        topCostumes,
      },
      280,
    )
  },
}
