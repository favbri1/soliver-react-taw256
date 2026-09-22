import { Link } from 'react-router-dom'
import type { Costume } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { formatCurrency } from '@/utils/format'
import StatusBadge from '@/components/common/StatusBadge'

/**
 * Pregunta 1 — Nueva prop en un componente existente.
 * `discountPercent` es opcional (hoy nadie la usa) y permite mostrar
 * un precio rebajado sobre el precio de alquiler original.
 */
type CostumeCardProps = {
  costume: Costume
  discountPercent?: number
}

export default function CostumeCard({ costume, discountPercent }: CostumeCardProps) {
  const hasDiscount = !!discountPercent && discountPercent > 0
  const finalPrice = hasDiscount
    ? costume.rentalPrice - (costume.rentalPrice * discountPercent!) / 100
    : costume.rentalPrice

  return (
    <Link
      to={`/trajes/${costume.id}`}
      className="group block overflow-hidden rounded-xl2 border border-ink-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-100">
        <img
          src={costume.images[0]?.url}
          alt={costume.images[0]?.alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute left-3 top-3">
          <StatusBadge status={costume.status} />
        </span>
        {costume.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-900">
            Destacado
          </span>
        )}
        {hasDiscount && (
          <span className="absolute left-3 bottom-3 rounded-full bg-wine-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            -{discountPercent}%
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="eyebrow">{CATEGORY_LABELS[costume.category]}</p>
        <h3 className="mt-1 font-display text-xl font-semibold text-ink-900 transition-colors group-hover:text-wine-500">
          {costume.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-ink-400">Desde</p>
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <p className="text-xs text-ink-400 line-through">{formatCurrency(costume.rentalPrice)}</p>
                <p className="font-semibold text-wine-500">{formatCurrency(finalPrice)}</p>
              </div>
            ) : (
              <p className="font-semibold text-gold-600">{formatCurrency(finalPrice)}</p>
            )}
          </div>
          <div className="flex flex-wrap justify-end gap-1">
            {costume.availableSizes.map((s) => (
              <span key={s} className="rounded-md border border-ink-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-600">
                {s}
              </span>
            ))}
          </div>
        </div>
        <span className="btn-outline mt-4 w-full text-center">Ver traje</span>
      </div>
    </Link>
  )
}
