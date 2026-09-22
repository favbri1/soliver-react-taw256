import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { dashboardService, type DashboardStats } from '@/services/dashboard.service'
import { useUiStore } from '@/stores/ui.store'
import PageHeader from '@/components/common/PageHeader'
import ChartCard from '@/components/dashboard/ChartCard'
import BarList from '@/components/dashboard/BarList'
import LineTrend from '@/components/dashboard/LineTrend'

export default function ReportsView() {
  const demoScenario = useUiStore((s) => s.demoScenario)
  const pushToast = useUiStore((s) => s.pushToast)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    dashboardService.getDashboardStats(demoScenario).then(setStats)
  }, [demoScenario])

  function exportReport() {
    pushToast('Exportación simulada: en la versión final esto generará un PDF/Excel real.', 'info')
  }

  if (!stats) return null

  return (
    <div>
      <PageHeader
        eyebrow="Negocio"
        title="Reportes"
        description="Visión analítica de reservas, ingresos e inventario."
        actions={
          <button className="btn-outline" onClick={exportReport}>
            <Download className="h-4 w-4" /> Exportar reporte
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Ingresos" subtitle="Evolución mensual, en bolivianos">
          <LineTrend data={stats.revenueByMonth} color="#D4A64A" />
        </ChartCard>
        <ChartCard title="Reservas por mes" subtitle="Últimos 6 meses">
          <BarList data={stats.reservationsByMonth} color="#0B0B0B" />
        </ChartCard>
        <ChartCard title="Trajes más alquilados" subtitle="Acumulado histórico">
          <BarList data={stats.topCostumes} color="#A30D1D" />
        </ChartCard>
        <ChartCard title="Estado del inventario" subtitle="Distribución actual">
          <div className="space-y-2">
            {stats.distribution.map((d) => (
              <div key={d.status} className="flex items-center justify-between text-sm">
                <span className="text-ink-600">{d.status}</span>
                <span className="font-semibold text-ink-900">{d.count}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
