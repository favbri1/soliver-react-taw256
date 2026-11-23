import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import type { Costume, OperationType } from '@/types'
import { costumeService } from '@/services/costume.service'
import { reservationService } from '@/services/reservation.service'
import { clientService } from '@/services/client.service'
import { formatCurrency, nightsBetween } from '@/utils/format'
import { calcOrder, canBeSold } from '@/utils/pricing'
import QuantitySizePicker from '@/components/costumes/QuantitySizePicker'
import { useQuantitySizes, groupSizes } from '@/hooks/useQuantitySizes'
import { validateFullName, validatePhone, validateOptionalEmail } from '@/utils/validators'
import DateRangePicker from '@/components/common/DateRangePicker'
import AvailabilityBadge from '@/components/reservations/AvailabilityBadge'

type AvailState = 'idle' | 'checking' | 'available' | 'unavailable'
type StepId = 'sizes' | 'dates' | 'availability' | 'client' | 'summary' | 'payment'

// El alquiler necesita fechas y disponibilidad; la compra no.
const RENT_STEPS: { id: StepId; label: string }[] = [
  { id: 'sizes', label: 'Cantidad y tallas' },
  { id: 'dates', label: 'Fechas' },
  { id: 'availability', label: 'Disponibilidad' },
  { id: 'client', label: 'Cliente' },
  { id: 'summary', label: 'Resumen' },
  { id: 'payment', label: 'Anticipo' },
]
const SALE_STEPS: { id: StepId; label: string }[] = [
  { id: 'sizes', label: 'Cantidad y tallas' },
  { id: 'client', label: 'Cliente' },
  { id: 'summary', label: 'Resumen' },
  { id: 'payment', label: 'Anticipo' },
]

/** Selección que puede llegar desde el detalle del traje. */
interface FlowState {
  mode?: OperationType
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
  // Alquiler (por defecto) o Venta, según lo elegido en el detalle del traje.
  const [mode, setMode] = useState<OperationType>(preset.mode === 'Venta' ? 'Venta' : 'Alquiler')
  const isSale = mode === 'Venta'
  const steps = isSale ? SALE_STEPS : RENT_STEPS
  const current = steps[step - 1].id

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
  // Validación de los datos del cliente: el error aparece al salir del campo
  // (onBlur) o al intentar continuar con datos inválidos.
  const [touched, setTouched] = useState({ name: false, phone: false, email: false })
  const nameError = validateFullName(clientName)
  const phoneError = validatePhone(clientPhone)
  const emailError = validateOptionalEmail(clientEmail)
  const clientDataValid = !nameError && !phoneError && !emailError

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    costumeService.getCostumeById(id).then((c) => {
      setCostume(c ?? null)
      if (!c) return
      // Solo los trajes con precio de venta pueden comprarse.
      if (!canBeSold(c)) setMode('Alquiler')
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

  // ---- Totales dinámicos según la modalidad ----
  //  Alquiler: (alquiler + depósito) × cantidad. Venta: precio de venta × cantidad, sin depósito.
  const order = costume ? calcOrder(costume, mode, quantity) : { unitPrice: 0, subtotal: 0, deposit: 0, total: 0, advance: 0 }
  const { unitPrice, subtotal, deposit: depositSubtotal, total, advance } = order

  function goTo(id: StepId) {
    setStep(steps.findIndex((s) => s.id === id) + 1)
  }

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
    if (current === 'sizes') return selectedSizes.length === quantity && selectedSizes.every(Boolean)
    if (current === 'dates') return !!start && !!end
    if (current === 'availability') return availState === 'available'
    if (current === 'client') return clientDataValid
    return true
  }

  function next() {
    // En el paso de datos del cliente, si hay errores los mostramos todos.
    if (current === 'client' && !clientDataValid) {
      setTouched({ name: true, phone: true, email: true })
      return
    }
    if (!canAdvance()) return
    if (current === 'dates') checkAvailability()
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
      operation: mode,
      costumeId: costume.id,
      clientId,
      // `size` se mantiene para compatibilidad; `sizes` lleva el detalle por unidad.
      size: selectedSizes[0],
      quantity,
      sizes: selectedSizes,
      // Una venta no tiene período: se registra con la fecha del pedido.
      startDate: isSale ? `${today}T10:00:00` : `${start}T10:00:00`,
      endDate: isSale ? `${today}T10:00:00` : `${end}T18:00:00`,
      rentalAmount: isSale ? 0 : subtotal,
      saleAmount: isSale ? subtotal : undefined,
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
      <p className="eyebrow">{isSale ? 'Comprar' : 'Reservar'}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink-900">{costume.name}</h1>

      {/* Stepper */}
      <ol className="mt-6 flex flex-wrap items-center gap-2 text-xs">
        {steps.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                i + 1 < step ? 'bg-emerald-500 text-white' : i + 1 === step ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-400'
              }`}
            >
              {i + 1 < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={i + 1 === step ? 'font-semibold text-ink-900' : 'text-ink-400'}>{s.label}</span>
          </li>
        ))}
      </ol>

      <div className="card mt-8 p-6">
        {/* Paso: cantidad y tallas */}
        {current === 'sizes' && (
          <div>
            <p className="mb-3 text-sm font-medium text-ink-900">
              {isSale ? '¿Cuántos trajes deseas comprar?' : '¿Cuántos trajes necesitas?'} Elige la talla de cada uno
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
                {quantity} × {formatCurrency(unitPrice)}
              </span>
              <span className="font-semibold text-ink-900">{formatCurrency(subtotal)}</span>
            </div>
          </div>
        )}

        {/* Paso: fechas (solo alquiler) */}
        {current === 'dates' && (
          <div>
            <p className="mb-3 text-sm font-medium text-ink-900">Selecciona las fechas de alquiler</p>
            <DateRangePicker start={start} end={end} min={today} onChangeStart={setStart} onChangeEnd={setEnd} />
          </div>
        )}

        {/* Paso: disponibilidad (solo alquiler) */}
        {current === 'availability' && (
          <div>
            <p className="mb-3 text-sm font-medium text-ink-900">Revisando disponibilidad</p>
            <AvailabilityBadge state={availState} />
            {availState === 'unavailable' && (
              <button className="btn-outline mt-4" onClick={() => goTo('dates')}>
                Elegir otras fechas
              </button>
            )}
          </div>
        )}

        {/* Paso: cliente (con validaciones) */}
        {current === 'client' && (
          <div className="space-y-4">
            <p className="mb-1 text-sm font-medium text-ink-900">Tus datos</p>

            <div>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                type="text"
                maxLength={80}
                autoComplete="name"
                aria-invalid={touched.name && !!nameError}
                placeholder="Nombre completo"
                className={`focus-ring w-full rounded-lg border px-3 py-2.5 text-sm ${
                  touched.name && nameError ? 'border-wine-500' : 'border-ink-200'
                }`}
              />
              {touched.name && nameError ? <p className="mt-1 text-xs text-wine-600">{nameError}</p> : null}
            </div>

            <div>
              <input
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                type="tel"
                inputMode="tel"
                maxLength={16}
                autoComplete="tel"
                aria-invalid={touched.phone && !!phoneError}
                placeholder="Teléfono (ej. 7001 2345)"
                className={`focus-ring w-full rounded-lg border px-3 py-2.5 text-sm ${
                  touched.phone && phoneError ? 'border-wine-500' : 'border-ink-200'
                }`}
              />
              {touched.phone && phoneError ? <p className="mt-1 text-xs text-wine-600">{phoneError}</p> : null}
            </div>

            <div>
              <input
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                type="email"
                maxLength={100}
                autoComplete="email"
                aria-invalid={touched.email && !!emailError}
                placeholder="Correo (opcional)"
                className={`focus-ring w-full rounded-lg border px-3 py-2.5 text-sm ${
                  touched.email && emailError ? 'border-wine-500' : 'border-ink-200'
                }`}
              />
              {touched.email && emailError ? <p className="mt-1 text-xs text-wine-600">{emailError}</p> : null}
            </div>
          </div>
        )}

        {/* Paso: resumen */}
        {current === 'summary' && (
          <div className="space-y-3 text-sm">
            <p className="mb-1 font-display text-lg font-semibold text-ink-900">Resumen</p>
            <div className="flex justify-between">
              <span className="text-ink-400">Operación</span>
              <span className="font-medium text-ink-900">{isSale ? 'Compra' : 'Alquiler'}</span>
            </div>
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
                      {g.count} × {formatCurrency(unitPrice)} = {formatCurrency(g.count * unitPrice)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {!isSale && (
              <div className="flex justify-between">
                <span className="text-ink-400">Fechas</span>
                <span className="font-medium text-ink-900">
                  {start} → {end} ({nights} día{nights === 1 ? '' : 's'})
                </span>
              </div>
            )}
            <hr className="border-ink-100" />
            <div className="flex justify-between">
              <span className="text-ink-400">
                {isSale ? 'Compra' : 'Alquiler'} ({quantity} × {formatCurrency(unitPrice)})
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {!isSale && (
              <div className="flex justify-between">
                <span className="text-ink-400">
                  Depósito ({quantity} × {formatCurrency(costume.deposit)})
                </span>
                <span>{formatCurrency(depositSubtotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink-400">{isSale ? 'Anticipo (50% del total)' : 'Anticipo (50% del alquiler)'}</span>
              <span>{formatCurrency(advance)}</span>
            </div>
            <hr className="border-ink-100" />
            <div className="flex justify-between text-base font-semibold text-ink-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        )}

        {/* Paso: anticipo */}
        {current === 'payment' && (
          <div className="space-y-4">
            <p className="font-display text-lg font-semibold text-ink-900">{isSale ? 'Anticipo de compra' : 'Anticipo de reserva'}</p>
            <p className="text-sm text-ink-500">
              Para confirmar tu {isSale ? 'compra' : 'reserva'} de {quantity} traje{quantity === 1 ? '' : 's'} se solicita un anticipo de{' '}
              {formatCurrency(advance)}. Selecciona un método de pago.
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
            <button className="btn-dark" disabled={current !== 'client' && !canAdvance()} onClick={next}>
              Continuar
            </button>
          ) : (
            <button className="btn-primary" disabled={submitting} onClick={confirm}>
              {submitting ? 'Confirmando…' : isSale ? 'Confirmar compra' : 'Confirmar reserva'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
