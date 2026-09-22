import { useEffect, useMemo, useState } from 'react'
import { costumes } from '@/mocks/costumes'
import { reservationService } from '@/services/reservation.service'
import type { Reservation } from '@/types'
import PageHeader from '@/components/common/PageHeader'
import { formatDate } from '@/utils/format'

export default function CalendarView() {
  const [selectedCostumeId, setSelectedCostumeId] = useState(costumes[0]?.id ?? '')
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    if (!selectedCostumeId) return
    reservationService.getReservationsByCostume(selectedCostumeId).then(setReservations)
  }, [selectedCostumeId])

  const days = useMemo(() => {
    const arr: Date[] = []
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    for (let i = 0; i < 30; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      arr.push(d)
    }
    return arr
  }, [])

  function isOccupied(day: Date): Reservation | undefined {
    return reservations.find((r) => {
      const s = new Date(r.startDate)
      const e = new Date(r.endDate)
      return day >= new Date(s.getFullYear(), s.getMonth(), s.getDate()) && day <= new Date(e.getFullYear(), e.getMonth(), e.getDate())
    })
  }

  const activeCostume = costumes.find((c) => c.id === selectedCostumeId)

  return (
    <div>
      <PageHeader eyebrow="Operaciones" title="Calendario de disponibilidad" description="Próximos 30 días para el traje seleccionado." />

      <div className="card p-5">
        <label className="mb-4 block max-w-sm">
          <span className="mb-1 block text-xs font-medium text-ink-400">Traje</span>
          <select
            value={selectedCostumeId}
            onChange={(e) => setSelectedCostumeId(e.target.value)}
            className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm"
          >
            {costumes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.code}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(2rem, 1fr))' }}>
          {days.map((d) => (
            <div
              key={d.toISOString()}
              className={`flex aspect-square flex-col items-center justify-center rounded-md text-[10px] font-medium ${
                isOccupied(d) ? 'bg-wine-500 text-white' : 'bg-emerald-50 text-emerald-700'
              }`}
              title={isOccupied(d) ? 'Reservado' : 'Disponible'}
            >
              {d.getDate()}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-ink-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-emerald-50 ring-1 ring-emerald-200"></span> Disponible
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-wine-500"></span> Reservado / Ocupado
          </span>
        </div>
      </div>

      <div className="card mt-6 divide-y divide-ink-100">
        <p className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-ink-400">Periodos para {activeCostume?.name}</p>
        {reservations.map((r) => (
          <div key={r.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-ink-900">
              {formatDate(r.startDate)} → {formatDate(r.endDate)}
            </span>
            <span className="text-xs font-medium uppercase text-wine-500">{r.status}</span>
          </div>
        ))}
        {reservations.length === 0 && <div className="px-4 py-6 text-center text-sm text-ink-400">Sin reservas próximas para este traje.</div>}
      </div>
    </div>
  )
}
