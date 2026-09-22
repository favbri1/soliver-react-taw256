import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { reservationService } from '@/services/reservation.service'

export default function MyReservationLookupView() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function search(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const reservation = await reservationService.getReservationById(code.trim())
    setLoading(false)
    if (reservation) {
      navigate(`/reserva/${reservation.code}`)
    } else {
      setError('No encontramos una reserva con ese código. Verifica e intenta nuevamente.')
    }
  }

  return (
    <div className="container-page max-w-md py-20 text-center">
      <p className="eyebrow">Mi reserva</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink-900">Consulta tu comprobante</h1>
      <p className="mt-2 text-sm text-ink-500">
        Ingresa el código de reserva que recibiste al confirmar, por ejemplo SOL-2026-00124.
      </p>

      <form className="mt-6 flex gap-2" onSubmit={search}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          type="text"
          placeholder="SOL-2026-00124"
          className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm"
        />
        <button type="submit" className="btn-dark" disabled={loading}>
          {loading ? '...' : 'Buscar'}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-wine-500">{error}</p>}
    </div>
  )
}
