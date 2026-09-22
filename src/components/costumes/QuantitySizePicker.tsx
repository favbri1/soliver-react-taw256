import { Minus, Plus } from 'lucide-react'

// Selector de cantidad + una talla INDEPENDIENTE por cada unidad.
// Ej.: si el cliente alquila 7 trajes, aparecen 7 selectores de talla,
// porque cada bailarín puede necesitar una talla distinta.

interface Props {
  /** Tallas que ofrece el traje. */
  sizes: string[]
  quantity: number
  /** Talla elegida para cada unidad. Su largo siempre coincide con `quantity`. */
  selectedSizes: string[]
  onChangeQuantity: (quantity: number) => void
  onChangeSizeAt: (index: number, size: string) => void
  min?: number
  max?: number
}

export default function QuantitySizePicker({
  sizes,
  quantity,
  selectedSizes,
  onChangeQuantity,
  onChangeSizeAt,
  min = 1,
  max = 20,
}: Props) {
  function clamp(n: number) {
    if (Number.isNaN(n)) return min
    return Math.min(max, Math.max(min, n))
  }

  return (
    <div className="space-y-5">
      {/* Cantidad */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">Cantidad de trajes</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChangeQuantity(clamp(quantity - 1))}
            disabled={quantity <= min}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200 text-ink-700 transition-colors hover:border-ink-900/40 disabled:opacity-40"
            aria-label="Quitar una unidad"
          >
            <Minus className="h-4 w-4" />
          </button>

          <input
            type="number"
            min={min}
            max={max}
            value={quantity}
            onChange={(e) => onChangeQuantity(clamp(Number(e.target.value)))}
            className="focus-ring h-10 w-20 rounded-lg border border-ink-200 text-center text-sm font-semibold text-ink-900"
          />

          <button
            type="button"
            onClick={() => onChangeQuantity(clamp(quantity + 1))}
            disabled={quantity >= max}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200 text-ink-700 transition-colors hover:border-ink-900/40 disabled:opacity-40"
            aria-label="Agregar una unidad"
          >
            <Plus className="h-4 w-4" />
          </button>

          <span className="text-sm text-ink-400">
            {quantity === 1 ? '1 traje' : `${quantity} trajes`}
          </span>
        </div>
      </div>

      {/* Tallas: una por unidad */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
          {quantity > 1 ? 'Talla por cada traje' : 'Talla'}
        </p>

        <div className="space-y-2">
          {selectedSizes.map((value, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 rounded-lg border border-ink-100 bg-white px-3 py-2"
            >
              <span className="text-sm text-ink-600">
                {quantity > 1 ? `Traje ${index + 1}` : 'Talla seleccionada'}
              </span>
              <div className="flex flex-wrap justify-end gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onChangeSizeAt(index, s)}
                    className={`focus-ring h-9 min-w-[2.5rem] rounded-lg border px-2.5 text-xs font-semibold transition-colors ${
                      value === s
                        ? 'border-ink-900 bg-ink-900 text-white'
                        : 'border-ink-200 text-ink-600 hover:border-ink-900/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
