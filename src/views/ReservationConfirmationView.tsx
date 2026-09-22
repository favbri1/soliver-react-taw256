import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Reservation, Costume, Client } from '@/types'
import { reservationService } from '@/services/reservation.service'
import { costumeService } from '@/services/costume.service'
import { clientService } from '@/services/client.service'
import { formatCurrency, formatDate } from '@/utils/format'
import StatusBadge from '@/components/common/StatusBadge'
import QRCodeCard from '@/components/reservations/QRCodeCard'
import { groupSizes } from '@/hooks/useQuantitySizes'

export default function ReservationConfirmationView() {
  const { id = '' } = useParams()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [costume, setCostume] = useState<Costume | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reservationService.getReservationById(id).then(async (r) => {
      setReservation(r ?? null)
      if (r) {
        const [c, cl] = await Promise.all([costumeService.getCostumeById(r.costumeId), clientService.getClientById(r.clientId)])
        setCostume(c ?? null)
        setClient(cl ?? null)
      }
      setLoading(false)
    })
  }, [id])

  return (
    <div className="container-page flex max-w-md flex-col items-center py-16 text-center">
      {loading ? (
        <p className="text-ink-400">Cargando comprobante…</p>
      ) : reservation ? (
        <>
          <p className="eyebrow">Reserva confirmada</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink-900">{reservation.code}</h1>
          <div className="mt-2">
            <StatusBadge status={reservation.status} />
          </div>

          <div className="card mt-6 w-full p-6 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-ink-400">Cliente</span>
              <span className="font-medium text-ink-900">{client?.name}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-ink-400">Traje</span>
              <span className="font-medium text-ink-900">
                {costume?.name}
                {(reservation.quantity ?? 1) > 1 ? ` × ${reservation.quantity}` : ` ${reservation.size}`}
              </span>
            </div>

            {/* Detalle por talla cuando la reserva tiene varias unidades */}
            {(reservation.quantity ?? 1) > 1 && reservation.sizes?.length ? (
              <div className="mt-2 rounded-lg border border-ink-100 bg-ink-50/50 p-3 text-sm">
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink-400">Tallas</p>
                <ul className="space-y-1">
                  {groupSizes(reservation.sizes).map((g) => (
                    <li key={g.size} className="flex justify-between">
                      <span className="text-ink-600">Talla {g.size}</span>
                      <span className="text-ink-900">{g.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-ink-400">Fecha</span>
              <span className="font-medium text-ink-900">
                {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-ink-400">Total</span>
              <span className="font-medium text-gold-600">{formatCurrency(reservation.totalAmount)}</span>
            </div>
          </div>

          <div className="mt-6">
            <QRCodeCard code={reservation.code} />
          </div>
          <p className="mt-4 text-sm text-ink-500">Presenta este código al recoger tu traje.</p>

          <Link to="/" className="btn-outline mt-8">
            Volver al catálogo
          </Link>
        </>
      ) : (
        <>
          <p className="text-ink-400">No encontramos esa reserva.</p>
          <Link to="/" className="btn-outline mt-4">
            Volver al catálogo
          </Link>
        </>
      )}
    </div>
  )
}
