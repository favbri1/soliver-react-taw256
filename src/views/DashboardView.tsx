import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { useUiStore } from '@/stores/ui.store'
import { dashboardService, type DashboardStats } from '@/services/dashboard.service'
import PageHeader from '@/components/common/PageHeader'
import MetricCard from '@/components/dashboard/MetricCard'
import ChartCard from '@/components/dashboard/ChartCard'
import BarList from '@/components/dashboard/BarList'
import LineTrend from '@/components/dashboard/LineTrend'
import Skeleton from '@/components/common/Skeleton'

const distColor: Record<string, string> = {
  Disponible: 'bg-emerald-500',
  Reservado: 'bg-amber-500',
  Alquilado: 'bg-rose-500',
  Limpieza: 'bg-ink-400',
  Reparacion: 'bg-orange-500',
  Danado: 'bg-rose-700',
  Extraviado: 'bg-ink-600',
}

export default function DashboardView() {
  const demoScenario = useUiStore((s) => s.demoScenario)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    dashboardService.getDashboardStats(demoScenario).then((s) => {
      setStats(s)
      setLoading(false)
    })
  }, [demoScenario])

  const distributionTotal = stats?.distribution.reduce((s, d) => s + d.count, 0) ?? 0

  return (
    <div>
      <PageHeader eyebrow="Panel de gestión" title="Dashboard" description="Vista general de reservas, alquileres, inventario e ingresos." />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height="6rem" rounded="1rem" />
          ))}
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
            {stats.metrics.map((m) => (
              <MetricCard
                key={m.label}
                label={m.label}
                value={m.value}
                prefix={m.prefix}
                suffix={m.suffix}
                accent={m.label.toLowerCase().includes('ingres') ? 'gold' : m.label.toLowerCase().includes('devoluc') ? 'wine' : 'ink'}
              />
            ))}
          </div>

          {/* Alertas de negocio */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {stats.alerts.map((a) => (
              <div
                key={a.id}
                className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
                  a.type === 'warning'
                    ? 'border-amber-200 bg-amber-50'
                    : a.type === 'success'
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-ink-100 bg-white'
                }`}
              >
                {a.type === 'warning' && <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />}
                {a.type === 'success' && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />}
                {a.type === 'info' && <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />}
                <div>
                  <p className="font-medium text-ink-900">{a.title}</p>
                  <p className="text-ink-500">{a.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartCard title="Ingresos del período" subtitle="Evolución mensual, en bolivianos">
                <LineTrend data={stats.revenueByMonth} color="#D4A64A" />
              </ChartCard>
            </div>
            <ChartCard title="Estado del inventario" subtitle="Distribución actual de trajes">
              <div className="space-y-3">
                {stats.distribution.map((d) => (
                  <div key={d.status} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-ink-600">
                      <span className={`h-2 w-2 rounded-full ${distColor[d.status]}`} />
                      {d.status}
                    </span>
                    <span className="font-semibold text-ink-900">{d.count}</span>
                  </div>
                ))}
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                  <div className="flex h-full">
                    {stats.distribution.map((d) => (
                      <div
                        key={d.status}
                        className={`h-full ${distColor[d.status]}`}
                        style={{ width: `${(d.count / distributionTotal) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <ChartCard title="Reservas por mes" subtitle="Últimos 6 meses">
              <BarList data={stats.reservationsByMonth} color="#0B0B0B" />
            </ChartCard>
            <ChartCard title="Trajes más alquilados" subtitle="Acumulado histórico">
              <BarList data={stats.topCostumes} color="#A30D1D" format={(v) => `${v}`} />
            </ChartCard>
          </div>
        </>
      ) : null}
    </div>
  )
}
