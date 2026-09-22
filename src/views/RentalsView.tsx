import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useRentalStore } from '@/stores/rental.store'
import { costumes } from '@/mocks/costumes'
import { clients } from '@/mocks/clients'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import DataTable, { type ColumnDef } from '@/components/common/DataTable'
import type { Rental } from '@/types'
import { formatDateTime } from '@/utils/format'

function costumeName(id: string) {
  return costumes.find((c) => c.id === id)?.name ?? id
}
function clientName(id: string) {
  return clients.find((c) => c.id === id)?.name ?? id
}

const columns: ColumnDef<Rental>[] = [
  { key: 'code', label: 'Alquiler', cell: (r) => <span className="font-mono text-xs text-ink-400">{r.code}</span> },
  { key: 'clientId', label: 'Cliente', cell: (r) => clientName(r.clientId) },
  { key: 'costumeId', label: 'Traje', cell: (r) => `${costumeName(r.costumeId)} · ${r.size}` },
  { key: 'pickupAt', label: 'Salida', cell: (r) => formatDateTime(r.pickupAt) },
  { key: 'returnDueAt', label: 'Devolución', cell: (r) => formatDateTime(r.returnDueAt) },
  { key: 'status', label: 'Estado', cell: (r) => <StatusBadge status={r.status} /> },
  {
    key: 'actions',
    label: '',
    cell: () => (
      <Link to="/devoluciones" className="text-xs font-semibold text-wine-500 hover:underline">
        Registrar devolución
      </Link>
    ),
  },
]

export default function RentalsView() {
  const items = useRentalStore((s) => s.items)
  const fetchRentals = useRentalStore((s) => s.fetchRentals)

  useEffect(() => {
    fetchRentals()
  }, [])

  return (
    <div>
      <PageHeader eyebrow="Operaciones" title="Alquileres" description="Alquileres actualmente en preparación, entregados o en curso." />
      <DataTable columns={columns} rows={items} rowKey={(r) => r.id} />
    </div>
  )
}
