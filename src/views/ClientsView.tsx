import { useEffect } from 'react'
import { useClientStore } from '@/stores/client.store'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import DataTable, { type ColumnDef } from '@/components/common/DataTable'
import type { Client } from '@/types'
import { formatDate } from '@/utils/format'

const columns: ColumnDef<Client>[] = [
  {
    key: 'name',
    label: 'Cliente',
    cell: (row) => (
      <div>
        <p className="font-medium text-ink-900">{row.name}</p>
        <p className="text-xs text-ink-400">{row.email}</p>
      </div>
    ),
  },
  { key: 'phone', label: 'Teléfono' },
  { key: 'totalRentals', label: 'Alquileres', align: 'right' },
  { key: 'activeReservations', label: 'Reservas activas', align: 'right' },
  { key: 'since', label: 'Cliente desde', cell: (row) => formatDate(row.since) },
  { key: 'status', label: 'Estado', cell: (row) => <StatusBadge status={row.status} /> },
]

export default function ClientsView() {
  const items = useClientStore((s) => s.items)
  const fetchClients = useClientStore((s) => s.fetchClients)

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <div>
      <PageHeader eyebrow="Negocio" title="Clientes" description="Historial y estado de cada cliente o comparsa." />
      <DataTable columns={columns} rows={items} rowKey={(r) => r.id} />
    </div>
  )
}
