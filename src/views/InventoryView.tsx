import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useInventoryStore } from '@/stores/inventory.store'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import type { Piece } from '@/types'

export default function InventoryView() {
  const costumes = useInventoryStore((s) => s.costumes)
  const distribution = useInventoryStore((s) => s.distribution)
  const fetchAll = useInventoryStore((s) => s.fetchAll)
  const getPieces = useInventoryStore((s) => s.getPieces)

  const [expanded, setExpanded] = useState<string | null>(null)
  const [pieceCache, setPieceCache] = useState<Record<string, Piece[]>>({})

  useEffect(() => {
    fetchAll()
  }, [])

  async function toggle(costumeId: string) {
    if (expanded === costumeId) {
      setExpanded(null)
      return
    }
    if (!pieceCache[costumeId]) {
      const pieces = await getPieces(costumeId)
      setPieceCache((prev) => ({ ...prev, [costumeId]: pieces }))
    }
    setExpanded(costumeId)
  }

  return (
    <div>
      <PageHeader eyebrow="Catálogo" title="Inventario" description="Estado de trajes, conjuntos y piezas individuales." />

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="card divide-y divide-ink-100">
          {costumes.map((c) => (
            <div key={c.id}>
              <button className="flex w-full items-center justify-between px-4 py-3.5 text-left" onClick={() => toggle(c.id)}>
                <div className="flex items-center gap-3">
                  <img src={c.images[0]?.url} className="h-10 w-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-medium text-ink-900">{c.name}</p>
                    <p className="text-xs text-ink-400">{c.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={c.status} />
                  <ChevronDown className={`h-4 w-4 text-ink-400 transition-transform ${expanded === c.id ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {/*
                Pregunta 3 — Este bloque antes era `{expanded === c.id && (...)}`.
                Aquí lo reescribimos como ternario `condición ? JSX : null`.
                Diferencia principal:
                - Con `&&`, si la condición fuera un número/string "falsy" raro
                  (0, "", NaN) React podría renderizar ese valor por accidente.
                  Con booleanos como este no pasa, pero es el riesgo típico del `&&`.
                - El ternario es más explícito: deja clarísimo cuál es la rama
                  "verdadera" y cuál la "falsa" (aquí `null`), aunque sea un poco
                  más largo de escribir para este caso puntual.
              */}
              {expanded === c.id ? (
                <div className="border-t border-ink-100 bg-ink-50/50 px-4 py-3">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">Piezas del conjunto {c.code}</p>
                  <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {(pieceCache[c.id] ?? []).map((p) => (
                      <li key={p.id} className="flex items-center justify-between rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm">
                        <span className="text-ink-700">{p.name}</span>
                        <StatusBadge status={p.status} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="card p-5">
          <p className="mb-3 font-display text-lg font-semibold text-ink-900">Distribución general</p>
          <div className="space-y-2">
            {distribution.map((d) => (
              <div key={d.status} className="flex items-center justify-between text-sm">
                <StatusBadge status={d.status} />
                <span className="font-semibold text-ink-900">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
