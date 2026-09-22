import { useEffect, useState } from 'react'
import { Search, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { useCostumeStore } from '@/stores/costume.store'
import CostumeCard from '@/components/catalog/CostumeCard'
import EmptyState from '@/components/common/EmptyState'
import Skeleton from '@/components/common/Skeleton'
import { CATEGORY_LABELS, type CostumeCategory } from '@/types'
import tr001a from '@/assets/tr001-a.png'
import tr002a from '@/assets/tr002-a.jpg'
import tr003a from '@/assets/tr003-a.jpg'
import tr004a from '@/assets/tr004-a.jpg'
import tr005a from '@/assets/tr005-a.jpg'
import tr006a from '@/assets/tr006-a.jpg'

const categories: { key: CostumeCategory; image: string }[] = [
  { key: 'Varon-Tropa', image: tr001a },
  { key: 'Macho-Caporal', image: tr002a },
  { key: 'China-Supay', image: tr003a },
  { key: 'Cholita', image: tr004a },
  { key: 'Achachi', image: tr005a },
  { key: 'Infantil', image: tr006a },
]

const sizes = ['Todas', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function CatalogView() {
  const { items, loading, setFilters, fetchCostumes, fetchFeatured } = useCostumeStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CostumeCategory | 'Todas'>('Todas')
  const [size, setSize] = useState<string>('Todas')

  useEffect(() => {
    fetchCostumes()
    fetchFeatured()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setFilters({ search, category, size })
    fetchCostumes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, size])

  function selectCategory(cat: CostumeCategory) {
    setCategory((prev) => (prev === cat ? 'Todas' : cat))
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <img
          src="https://picsum.photos/seed/soliver-hero/1800/1000"
          alt="Trajes de Caporal SOLIVER"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/70 to-ink-900/20" />
        <div className="container-page relative py-24 sm:py-32">
          <p className="eyebrow text-gold-500">SOLIVER · Alquiler de trajes de Caporal</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.1] sm:text-6xl">
            Viste la tradición.
            <br />
            Baila con estilo.
          </h1>
          <p className="mt-5 max-w-lg text-white/70">Trajes de Caporal en alquiler para momentos que merecen ser recordados.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalogo" className="btn-gold">
              Explorar trajes
            </a>
            <a href="#como-funciona" className="btn-outline border-white/30 bg-transparent text-white hover:border-white/60">
              Consultar disponibilidad
            </a>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-page py-14">
        <p className="eyebrow">Categorías</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">Encuentra tu conjunto</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`focus-ring group relative aspect-[3/4] overflow-hidden rounded-xl2 ${category === c.key ? 'ring-2 ring-gold-500' : ''}`}
              onClick={() => selectCategory(c.key)}
            >
              <img
                src={c.image}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt={CATEGORY_LABELS[c.key]}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-2 left-2 right-2 text-left text-xs font-semibold text-white sm:text-sm">
                {CATEGORY_LABELS[c.key]}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalogo" className="container-page py-6">
        <div className="flex flex-col gap-4 rounded-xl2 border border-ink-100 bg-white p-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-ink-200 px-3 py-2.5">
            <Search className="h-4 w-4 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Buscar traje…"
              className="w-full text-sm outline-none"
            />
          </div>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="focus-ring rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-700"
          >
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s === 'Todas' ? 'Todas las tallas' : s}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Catálogo de trajes</h2>
          <span className="text-sm text-ink-400">
            {items.length} resultado{items.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} height="20rem" rounded="1.25rem" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="Sin trajes para esos filtros" message="Prueba con otra categoría, talla o término de búsqueda." />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((c, i) => (
              // Pregunta 1: le pasamos la nueva prop `discountPercent` a un par de
              // tarjetas (a modo de demo) para probar que la prop nueva funciona.
              <CostumeCard key={c.id} costume={c} discountPercent={i % 5 === 0 ? 15 : undefined} />
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="bg-white py-16">
        <div className="container-page">
          <p className="eyebrow">Cómo funciona</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">De la selección a la entrada</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="card p-6">
              <Sparkles className="h-6 w-6 text-gold-600" />
              <p className="mt-3 font-display text-lg font-semibold text-ink-900">1. Selecciona y reserva</p>
              <p className="mt-1 text-sm text-ink-500">Elige tu traje, talla y fechas. Confirmamos disponibilidad al instante.</p>
            </div>
            <div className="card p-6">
              <ShieldCheck className="h-6 w-6 text-gold-600" />
              <p className="mt-3 font-display text-lg font-semibold text-ink-900">2. Anticipo y garantía</p>
              <p className="mt-1 text-sm text-ink-500">Un pequeño anticipo asegura tu reserva; el depósito se libera al devolver.</p>
            </div>
            <div className="card p-6">
              <Truck className="h-6 w-6 text-gold-600" />
              <p className="mt-3 font-display text-lg font-semibold text-ink-900">3. Recoge y baila</p>
              <p className="mt-1 text-sm text-ink-500">Presenta tu comprobante QR y retira tu conjunto listo para la entrada.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
