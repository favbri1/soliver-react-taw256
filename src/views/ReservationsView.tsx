import { useEffect, useMemo } from 'react'
import { useReservationStore } from '@/stores/reservation.store'
import { costumes } from '@/mocks/costumes'
import { clients } from '@/mocks/clients'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import DataTable, { type ColumnDef } from '@/components/common/DataTable'
import type { Reservation } from '@/types'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { operationOf } from '@/utils/pricing'

function costumeName(id: string) {
  return costumes.find((c) => c.id === id)?.name ?? id
}
function clientName(id: string) {
  return clients.find((c) => c.id === id)?.name ?? id
}

const columns: ColumnDef<Reservation>[] = [
  { key: 'code', label: 'Código', cell: (r) => <span className="font-mono text-xs text-ink-400">{r.code}</span> },
  {
    key: 'operation',
    label: 'Tipo',
    cell: (r) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
          operationOf(r) === 'Venta' ? 'bg-gold-500/15 text-ink-900' : 'bg-ink-100 text-ink-600'
        }`}
      >
        {operationOf(r)}
      </span>
    ),
  },
  { key: 'clientId', label: 'Cliente', cell: (r) => clientName(r.clientId) },
  {
    key: 'costumeId',
    label: 'Traje',
    cell: (r) =>
      (r.quantity ?? 1) > 1 ? `${costumeName(r.costumeId)} × ${r.quantity}` : `${costumeName(r.costumeId)} · ${r.size}`,
  },
  // Una compra no tiene período de alquiler.
  { key: 'startDate', label: 'Salida', cell: (r) => (operationOf(r) === 'Venta' ? '—' : formatDateTime(r.startDate)) },
  { key: 'endDate', label: 'Devolución', cell: (r) => (operationOf(r) === 'Venta' ? '—' : formatDateTime(r.endDate)) },
  { key: 'totalAmount', label: 'Monto', align: 'right', cell: (r) => formatCurrency(r.totalAmount) },
  { key: 'status', label: 'Estado', cell: (r) => <StatusBadge status={r.status} /> },
]

export default function ReservationsView() {
  const items = useReservationStore((s) => s.items)
  const fetchReservations = useReservationStore((s) => s.fetchReservations)

  useEffect(() => {
    fetchReservations()
  }, [])

  const sorted = useMemo(() => [...items].sort((a, b) => (a.startDate < b.startDate ? -1 : 1)), [items])

  return (
    <div>
      <PageHeader eyebrow="Operaciones" title="Reservas" description="Reservas de alquiler y pedidos de compra: activos, pendientes y finalizados." />
      <DataTable columns={columns} rows={sorted} rowKey={(r) => r.id} />
    </div>
  )
}
