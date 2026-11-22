import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import type { AccessEvent, AccessLogEntry } from '@/types'
import { authService } from '@/services/auth.service'
import PageHeader from '@/components/common/PageHeader'
import DataTable, { type ColumnDef } from '@/components/common/DataTable'
import EmptyState from '@/components/common/EmptyState'

const EVENT_STYLES: Record<AccessEvent, string> = {
  Ingreso: 'bg-emerald-500/10 text-emerald-700',
  Salida: 'bg-ink-100 text-ink-600',
  'Intento fallido': 'bg-gold-500/15 text-gold-700',
  Bloqueo: 'bg-wine-500/10 text-wine-600',
}

const EVENTS: ('Todos' | AccessEvent)[] = ['Todos', 'Ingreso', 'Salida', 'Intento fallido', 'Bloqueo']

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/** Log de accesos: usuario, IP, evento (ingreso/salida), navegador, fecha y hora. */
export default function AccessLogView() {
  const [entries, setEntries] = useState<AccessLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [eventFilter, setEventFilter] = useState<'Todos' | AccessEvent>('Todos')
  const [search, setSearch] = useState('')

  function load() {
    setLoading(true)
    authService.getAccessLog().then((rows) => {
      setEntries(rows)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return entries.filter(
      (e) => (eventFilter === 'Todos' || e.event === eventFilter) && (!q || e.username.toLowerCase().includes(q)),
    )
  }, [entries, eventFilter, search])

  const columns: ColumnDef<AccessLogEntry>[] = [
    { key: 'dateTime', label: 'Fecha y hora', cell: (row) => <span className="whitespace-nowrap">{formatDateTime(row.dateTime)}</span> },
    { key: 'username', label: 'Usuario', cell: (row) => <span className="font-medium text-ink-900">{row.username}</span> },
    {
      key: 'event',
      label: 'Evento',
      cell: (row) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${EVENT_STYLES[row.event]}`}>
          {row.event}
        </span>
      ),
    },
    { key: 'ip', label: 'IP', cell: (row) => <span className="font-mono text-xs">{row.ip}</span> },
    { key: 'browser', label: 'Navegador', cell: (row) => row.browser },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Sistema"
        title="Registro de accesos"
        description="Historial de ingresos, salidas e intentos fallidos al sistema."
        actions={
          <button className="btn-outline" onClick={load} disabled={loading}>
            <RefreshCw className="h-4 w-4" /> Actualizar
          </button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          placeholder="Buscar por usuario…"
          className="focus-ring w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {EVENTS.map((ev) => (
            <button
              key={ev}
              type="button"
              onClick={() => setEventFilter(ev)}
              className={`focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                eventFilter === ev ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-ink-600 hover:border-ink-900/40'
              }`}
            >
              {ev}
            </button>
          ))}
        </div>
      </div>

      {!loading && filtered.length === 0 ? (
        <EmptyState title="Sin registros" message="Aún no hay accesos que coincidan con el filtro." />
      ) : (
        <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} />
      )}
    </div>
  )
}
