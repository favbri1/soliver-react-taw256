import { CheckCircle2, XCircle, LoaderCircle } from 'lucide-react'

type State = 'idle' | 'checking' | 'available' | 'unavailable'

export default function AvailabilityBadge({ state }: { state: State }) {
  if (state === 'idle') return null

  const toneClass =
    state === 'checking'
      ? 'bg-ink-50 text-ink-400'
      : state === 'available'
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-rose-50 text-rose-700'

  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${toneClass}`}>
      {state === 'checking' && <LoaderCircle className="h-4 w-4 animate-spin" />}
      {state === 'available' && <CheckCircle2 className="h-4 w-4" />}
      {state === 'unavailable' && <XCircle className="h-4 w-4" />}
      {state === 'checking' && <span>Consultando disponibilidad…</span>}
      {state === 'available' && <span>Disponible para reservar.</span>}
      {state === 'unavailable' && <span>No disponible para esas fechas.</span>}
    </div>
  )
}
