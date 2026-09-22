import { useEffect } from 'react'
import { useReturnStore } from '@/stores/return.store'
import { rentals } from '@/mocks/rentals'
import { pieces } from '@/mocks/pieces'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import { formatCurrency, formatDateTime } from '@/utils/format'

function rentalCode(id: string) {
  return rentals.find((r) => r.id === id)?.code ?? id
}
function pieceName(id: string) {
  return pieces.find((p) => p.id === id)?.name ?? id
}

export default function ReturnsView() {
  const items = useReturnStore((s) => s.items)
  const fetchReturns = useReturnStore((s) => s.fetchReturns)

  useEffect(() => {
    fetchReturns()
  }, [])

  return (
    <div>
      <PageHeader eyebrow="Operaciones" title="Devoluciones" description="Registro de devoluciones, daños, piezas faltantes y multas." />

      <div className="grid gap-4">
        {items.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-ink-400">
                  {r.code} · Alquiler {rentalCode(r.rentalId)}
                </p>
                <p className="font-display text-lg font-semibold text-ink-900">Devuelto el {formatDateTime(r.returnedAt)}</p>
              </div>
              <StatusBadge status={r.condition} />
            </div>

            {(r.lateHours > 0 || r.missingPieceIds.length > 0) && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {r.lateHours > 0 && (
                  <div className="rounded-lg bg-ink-50 p-3 text-sm">
                    <p className="text-ink-400">Retraso</p>
                    <p className="font-medium text-ink-900">
                      {r.lateHours} horas → {formatCurrency(r.lateFee)}
                    </p>
                  </div>
                )}
                {r.missingPieceIds.length > 0 && (
                  <div className="rounded-lg bg-ink-50 p-3 text-sm">
                    <p className="text-ink-400">Piezas faltantes</p>
                    <p className="font-medium text-ink-900">
                      {r.missingPieceIds.map(pieceName).join(', ')} → {formatCurrency(r.missingFee)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {r.totalFee > 0 && (
              <div className="mt-4 flex items-center justify-between rounded-lg bg-wine-50 px-4 py-3">
                <span className="text-sm font-medium text-wine-600">Total descontado de garantía</span>
                <span className="font-display text-lg font-semibold text-wine-600">{formatCurrency(r.totalFee)}</span>
              </div>
            )}

            {r.observations && <p className="mt-3 text-sm text-ink-500">{r.observations}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
