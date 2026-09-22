import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import type { Costume } from '@/types'
import { costumeService } from '@/services/costume.service'
import { reservationService } from '@/services/reservation.service'
import { clientService } from '@/services/client.service'
import { formatCurrency, nightsBetween } from '@/utils/format'
import QuantitySizePicker from '@/components/costumes/QuantitySizePicker'
import { useQuantitySizes, groupSizes } from '@/hooks/useQuantitySizes'
import DateRangePicker from '@/components/common/DateRangePicker'
import AvailabilityBadge from '@/components/reservations/AvailabilityBadge'

type AvailState = 'idle' | 'checking' | 'available' | 'unavailable'
const steps = ['Cantidad y tallas', 'Fechas', 'Disponibilidad', 'Cliente', 'Resumen', 'Anticipo']
const advancePercent = 0.5

/** Selección que puede llegar desde el detalle del traje. */
interface FlowState {
  quantity?: number
  sizes?: string[]
  start?: string
  end?: string
}

export default function ReservationFlowView() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const preset = (location.state as FlowState | null) ?? {}

  const [costume, setCostume] = useState<Costume | null>(null)
  const [step, setStep] = useState(1)

  // Cantidad + una talla por unidad (ej. 7 trajes con tallas distintas).
  const { quantity, sizes: selectedSizes, setQuantity, setSizeAt, reset } = useQuantitySizes(
    costume?.availableSizes[0] ?? null,
  )

  const [start, setStart] = useState(preset.start ?? '')
  const [end, setEnd] = useState(preset.end ?? '')
  const [availState, setAvailState] = useState<AvailState>('idle')
  const today = new Date().toISOString().slice(0, 10)

  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    costumeService.getCostumeById(id).then((c) => {
      setCostume(c ?? null)
      if (!c) return
      // Si venimos del detalle con una selección hecha, la respetamos.
      if (preset.sizes?.length) {
        reset(c.availableSizes[0] ?? null)
        setQuantity(preset.quantity ?? preset.sizes.length)
        preset.sizes.forEach((s, i) => setSizeAt(i, s))
      } else {
        reset(c.availableSizes[0] ?? null)
      }
    })
  }, [id])

  const nights = start && end ? nightsBetween(start, end) : 0

  // ---- Totales dinámicos: precio unitario × cantidad (+ depósito por unidad) ----
  const rentalSubtotal = (costume?.rentalPrice ?? 0) * quantity
  const depositSubtotal = (costume?.deposit ?? 0) * quantity
  const total = rentalSubtotal + depositSubtotal
  const advance = Math.round(rentalSubtotal * advancePercent)

  async function checkAvailability() {
    if (!costume) return
    setAvailState('checking')
    const res = await reservationService.checkAvailability({
      costumeId: costume.id,
      startDate: `${start}T00:00:00`,
      endDate: `${end}T23:59:59`,
    })
    setAvailState(res.available ? 'available' : 'unavailable')
  }

  function canAdvance(): boolean {
    // Todas las unidades deben tener talla elegida.
    if (step === 1) return selectedSizes.length === quantity && selectedSizes.every(Boolean)
    if (step === 2) return !!start && !!end
    if (step === 3) return availState === 'available'
    if (step === 4) return !!clientName && !!clientPhone
    return true
  }

  function next() {
    if (!canAdvance()) return
    if (step === 2) checkAvailability()
    setStep((s) => Math.min(s + 1, steps.length))
  }
  function back() {
    setStep((s) => Math.max(s - 1, 1))
  }

  async function confirm() {
    if (!costume) return
    setSubmitting(true)
    // Cliente simulado: se reutiliza uno existente para mantener consistencia de datos mock.
    const clients = await clientService.getClients()
    const clientId = clients[0]?.id ?? 'CLI-001'
    const reservation = await reservationService.createReservation({
      costumeId: costume.id,
      clientId,
      // `size` se mantiene para compatibilidad; `sizes` lleva el detalle por unidad.
      size: selectedSizes[0],
      quantity,
      sizes: selectedSizes,
      startDate: `${start}T10:00:00`,
      endDate: `${end}T18:00:00`,
      rentalAmount: rentalSubtotal,
      depositAmount: depositSubtotal,
      advanceAmount: advance,
      totalAmount: total,
    })
    setSubmitting(false)
    navigate(`/reserva/${reservation.code}`)
  }

  if (!costume) return null

  const sizeBreakdown = groupSizes(selectedSizes)

  return (
    <div className="container-page max-w-3xl py-10">
      <p className="eyebrow">Reservar</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink-900">{costume.name}</h1>

      {/* Stepper */}
      <ol className="mt-6 flex flex-wrap items-center gap-2 text-xs">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                i + 1 < step ? 'bg-emerald-500 text-white' : i + 1 === step ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-400'
              }`}
            >
              {i + 1 < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={i + 1 === step ? 'font-semibold text-ink-900' : 'text-ink-400'}>{s}</span>
          </li>
        ))}
      </ol>

      <div className="card mt-8 p-6">
        {/* Step 1: cantidad y tallas */}
        {step === 1 && (
          <div>
            <p className="mb-3 text-sm font-medium text-ink-900">
              ¿Cuántos trajes necesitas? Elige la talla de cada uno
            </p>
            <QuantitySizePicker
              sizes={costume.availableSizes}
              quantity={quantity}
              selectedSizes={selectedSizes}
              onChangeQuantity={setQuantity}
              onChangeSizeAt={setSizeAt}
            />
            <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4 text-sm">
              <span className="text-ink-400">
                {quantity} × {formatCurrency(costume.rentalPrice)}
              </span>
              <span className="font-semibold text-ink-900">{formatCurrency(rentalSubtotal)}</span>
            </div>
          </div>
        )}

        {/* Step 2: fechas */}
        {step === 2 && (
          <div>
            <p className="mb-3 text-sm font-medium text-ink-900">Selecciona las fechas de alquiler</p>
            <DateRangePicker start={start} end={end} min={today} onChangeStart={setStart} onChangeEnd={setEnd} />
          </div>
        )}

        {/* Step 3: disponibilidad */}
        {step === 3 && (
          <div>
            <p className="mb-3 text-sm font-medium text-ink-900">Revisando disponibilidad</p>
            <AvailabilityBadge state={availState} />
            {availState === 'unavailable' && (
              <button className="btn-outline mt-4" onClick={() => setStep(2)}>
                Elegir otras fechas
              </button>
            )}
          </div>
        )}

        {/* Step 4: cliente */}
        {step === 4 && (
          <div className="space-y-3">
            <p className="mb-1 text-sm font-medium text-ink-900">Tus datos</p>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              type="text"
              placeholder="Nombre completo"
              className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm"
            />
            <input
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              type="tel"
              placeholder="Teléfono"
              className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm"
            />
            <input
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              type="email"
              placeholder="Correo (opcional)"
              className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm"
            />
          </div>
        )}

        {/* Step 5: resumen */}
        {step === 5 && (
          <div className="space-y-3 text-sm">
            <p className="mb-1 font-display text-lg font-semibold text-ink-900">Resumen</p>
            <div className="flex justify-between">
              <span className="text-ink-400">Traje</span>
              <span className="font-medium text-ink-900">{costume.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-400">Cantidad</span>
              <span className="font-medium text-ink-900">{quantity}</span>
            </div>

            {/* Detalle por talla */}
            <div className="rounded-lg border border-ink-100 bg-ink-50/50 p-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">Detalle por talla</p>
              <ul className="space-y-1">
                {sizeBreakdown.map((g) => (
                  <li key={g.size} className="flex justify-between">
                    <span className="text-ink-600">Talla {g.size}</span>
                    <span className="text-ink-900">
                      {g.count} × {formatCurrency(costume.rentalPrice)} = {formatCurrency(g.count * costume.rentalPrice)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between">
              <span className="text-ink-400">Fechas</span>
              <span className="font-medium text-ink-900">
                {start} → {end} ({nights} día{nights === 1 ? '' : 's'})
              </span>
            </div>
            <hr className="border-ink-100" />
            <div className="flex justify-between">
              <span className="text-ink-400">
                Alquiler ({quantity} × {formatCurrency(costume.rentalPrice)})
              </span>
              <span>{formatCurrency(rentalSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-400">
                Depósito ({quantity} × {formatCurrency(costume.deposit)})
              </span>
              <span>{formatCurrency(depositSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-400">Anticipo (50% del alquiler)</span>
              <span>{formatCurrency(advance)}</span>
            </div>
            <hr className="border-ink-100" />
            <div className="flex justify-between text-base font-semibold text-ink-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        )}

        {/* Step 6: anticipo */}
        {step === 6 && (
          <div className="space-y-4">
            <p className="font-display text-lg font-semibold text-ink-900">Anticipo simulado</p>
            <p className="text-sm text-ink-500">
              Para confirmar tu reserva de {quantity} traje{quantity === 1 ? '' : 's'} se solicita un anticipo de{' '}
              {formatCurrency(advance)}. Selecciona un método (simulado).
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button className="btn-outline">Efectivo</button>
              <button className="btn-outline">Transferencia</button>
              <button className="btn-outline">QR</button>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {step > 1 ? (
            <button className="btn-outline" onClick={back}>
              Atrás
            </button>
          ) : (
            <span />
          )}
          {step < steps.length ? (
            <button className="btn-dark" disabled={!canAdvance()} onClick={next}>
              Continuar
            </button>
          ) : (
            <button className="btn-primary" disabled={submitting} onClick={confirm}>
              {submitting ? 'Confirmando…' : 'Confirmar reserva'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
