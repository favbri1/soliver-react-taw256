import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import type { Costume, Piece } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { costumeService } from '@/services/costume.service'
import { inventoryService } from '@/services/inventory.service'
import { reservationService } from '@/services/reservation.service'
import { formatCurrency } from '@/utils/format'
import StatusBadge from '@/components/common/StatusBadge'
import DateRangePicker from '@/components/common/DateRangePicker'
import AvailabilityBadge from '@/components/reservations/AvailabilityBadge'
import Skeleton from '@/components/common/Skeleton'
import QuantitySizePicker from '@/components/costumes/QuantitySizePicker'
import { useQuantitySizes, groupSizes } from '@/hooks/useQuantitySizes'

type AvailState = 'idle' | 'checking' | 'available' | 'unavailable'

export default function CostumeDetailView() {
  const { id = '' } = useParams()
  const [costume, setCostume] = useState<Costume | null>(null)
  const [pieces, setPieces] = useState<Piece[]>([])
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)

  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [availState, setAvailState] = useState<AvailState>('idle')
  const today = new Date().toISOString().slice(0, 10)

  // Cantidad de unidades + una talla por unidad (ej. 7 trajes, cada uno con su talla).
  const { quantity, sizes: selectedSizes, setQuantity, setSizeAt, reset } = useQuantitySizes(
    costume?.availableSizes[0] ?? null,
  )

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([costumeService.getCostumeById(id), inventoryService.getPiecesByCostume(id)]).then(([c, p]) => {
      if (!active) return
      setCostume(c ?? null)
      setPieces(p)
      // Al cargar el traje, arrancamos con 1 unidad y su primera talla disponible.
      reset(c?.availableSizes[0] ?? null)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [id])

  // Pregunta 4 — Nuevo useEffect que reacciona a un cambio de estado puntual.
  // Cada vez que el usuario cambia la fecha de inicio o de fin, el resultado
  // de disponibilidad que se haya mostrado antes queda obsoleto (correspondía
  // a otras fechas), así que lo volvemos a 'idle' automáticamente.
  // El arreglo de dependencias es [start, end] porque son justamente los dos
  // valores que, al cambiar, invalidan el chequeo anterior; no depende de
  // `costume` ni de `id` porque esos cambios ya se manejan en el otro efecto.
  useEffect(() => {
    setAvailState('idle')
  }, [start, end])

  async function checkAvailability() {
    if (!costume || !start || !end) return
    setAvailState('checking')
    const res = await reservationService.checkAvailability({
      costumeId: costume.id,
      startDate: `${start}T00:00:00`,
      endDate: `${end}T23:59:59`,
    })
    setAvailState(res.available ? 'available' : 'unavailable')
  }

  const setComplete = !pieces.some((p) => p.critical && p.status !== 'Disponible')

  // Totales dinámicos según la cantidad elegida.
  const rentalSubtotal = (costume?.rentalPrice ?? 0) * quantity
  const depositSubtotal = (costume?.deposit ?? 0) * quantity
  const estimatedTotal = rentalSubtotal + depositSubtotal

  return (
    <div className="container-page py-10">
      {loading ? (
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton height="32rem" rounded="1.25rem" />
          <div className="space-y-3">
            <Skeleton height="2rem" rounded="0.5rem" />
            <Skeleton height="8rem" rounded="0.75rem" />
          </div>
        </div>
      ) : costume ? (
        <>
          <nav className="mb-6 text-xs text-ink-400">
            <Link to="/" className="hover:text-ink-900">
              Catálogo
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-ink-600">{costume.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Gallery */}
            <div>
              <div className="aspect-[4/5] overflow-hidden rounded-xl2 bg-ink-100">
                <img
                  src={costume.images[activeImage]?.url}
                  alt={costume.images[activeImage]?.alt}
                  className="h-full w-full object-cover"
                />
              </div>
              {costume.images.length > 1 && (
                <div className="mt-3 flex gap-2">
                  {costume.images.map((img, i) => (
                    <button
                      key={i}
                      className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${activeImage === i ? 'border-gold-500' : 'border-transparent'}`}
                      onClick={() => setActiveImage(i)}
                    >
                      <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="eyebrow">{CATEGORY_LABELS[costume.category]}</p>
              <div className="mt-1 flex items-center gap-3">
                <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">{costume.name}</h1>
                <StatusBadge status={costume.status} />
              </div>
              <p className="mt-4 text-ink-500">{costume.description}</p>

              <div className="mt-6 flex items-end gap-8">
                <div>
                  <p className="text-xs text-ink-400">Alquiler / evento</p>
                  <p className="font-display text-3xl font-semibold text-gold-600">{formatCurrency(costume.rentalPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-400">Depósito</p>
                  <p className="font-display text-xl font-semibold text-ink-900">{formatCurrency(costume.deposit)}</p>
                </div>
              </div>

              {/* Cantidad + talla independiente por unidad */}
              <div className="card mt-6 p-4">
                <QuantitySizePicker
                  sizes={costume.availableSizes}
                  quantity={quantity}
                  selectedSizes={selectedSizes}
                  onChangeQuantity={setQuantity}
                  onChangeSizeAt={setSizeAt}
                />

                {/* Total calculado dinámicamente: (alquiler + depósito) × cantidad */}
                <div className="mt-5 space-y-1.5 border-t border-ink-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-400">
                      Alquiler ({quantity} × {formatCurrency(costume.rentalPrice)})
                    </span>
                    <span className="text-ink-700">{formatCurrency(rentalSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-400">
                      Depósito ({quantity} × {formatCurrency(costume.deposit)})
                    </span>
                    <span className="text-ink-700">{formatCurrency(depositSubtotal)}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 text-base font-semibold text-ink-900">
                    <span>Total</span>
                    <span>{formatCurrency(estimatedTotal)}</span>
                  </div>
                  {quantity > 1 && (
                    <p className="pt-1 text-xs text-ink-400">
                      Detalle por talla: {groupSizes(selectedSizes).map((g) => `${g.count} × ${g.size}`).join(' · ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="card mt-6 p-4">
                <p className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-ink-400">
                  Incluye
                  <span className={`flex items-center gap-1 normal-case ${setComplete ? 'text-emerald-600' : 'text-wine-500'}`}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {setComplete ? 'Conjunto completo disponible' : 'Conjunto no disponible'}
                  </span>
                </p>
                <ul className="grid grid-cols-2 gap-2 text-sm text-ink-700">
                  {pieces.map((p) => (
                    <li key={p.id} className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${p.status === 'Disponible' ? 'text-emerald-500' : 'text-ink-200'}`} />
                      {p.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card mt-6 p-4">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-400">Consultar disponibilidad</p>
                <DateRangePicker start={start} end={end} min={today} onChangeStart={setStart} onChangeEnd={setEnd} />
                <button className="btn-outline mt-3 w-full" onClick={checkAvailability}>
                  Consultar disponibilidad
                </button>
                <div className="mt-3">
                  <AvailabilityBadge state={availState} />
                </div>
              </div>

              {/* Llevamos la selección (cantidad, tallas y fechas) al flujo de reserva
                  usando el state del Link, para que el cliente no tenga que repetirla. */}
              <Link
                to={`/reservar/${costume.id}`}
                state={{ quantity, sizes: selectedSizes, start, end }}
                className="btn-primary mt-6 w-full"
              >
                Reservar {quantity > 1 ? `${quantity} trajes` : 'traje'}
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
