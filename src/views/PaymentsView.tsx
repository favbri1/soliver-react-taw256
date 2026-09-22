import { useEffect } from 'react'
import { usePaymentStore } from '@/stores/payment.store'
import { clients } from '@/mocks/clients'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import DataTable, { type ColumnDef } from '@/components/common/DataTable'
import type { Payment } from '@/types'
import { formatCurrency, formatDateTime } from '@/utils/format'

function clientName(id: string) {
  return clients.find((c) => c.id === id)?.name ?? id
}

const columns: ColumnDef<Payment>[] = [
  { key: 'code', label: 'Pago', cell: (row) => <span className="font-mono text-xs text-ink-400">{row.code}</span> },
  { key: 'clientId', label: 'Cliente', cell: (row) => clientName(row.clientId) },
  { key: 'concept', label: 'Concepto' },
  { key: 'amount', label: 'Monto', align: 'right', cell: (row) => formatCurrency(row.amount) },
  { key: 'method', label: 'Método' },
  { key: 'date', label: 'Fecha', cell: (row) => formatDateTime(row.date) },
  { key: 'status', label: 'Estado', cell: (row) => <StatusBadge status={row.status} /> },
]

export default function PaymentsView() {
  const items = usePaymentStore((s) => s.items)
  const fetchPayments = usePaymentStore((s) => s.fetchPayments)

  useEffect(() => {
    fetchPayments()
  }, [])

  return (
    <div>
      <PageHeader eyebrow="Negocio" title="Pagos" description="Anticipos, saldos y reembolsos registrados para cada reserva." />
      <DataTable columns={columns} rows={items} rowKey={(r) => r.id} />
    </div>
  )
}
