import { Link } from 'react-router-dom'

/**
 * Pregunta 5 — Vista nueva y simple para probar una ruta nueva.
 * No recibe datos de ningún servicio: es solo una página de ejemplo
 * (preguntas frecuentes) conectada a /preguntas-frecuentes.
 */
const faqs = [
  {
    q: '¿Con cuántos días de anticipación debo reservar?',
    a: 'Recomendamos reservar con al menos 7 días de anticipación, sobre todo en fechas de entradas y convites.',
  },
  {
    q: '¿Qué pasa si el traje no me queda?',
    a: 'Puedes coordinar un cambio de talla sin costo siempre que quede stock disponible antes del evento.',
  },
  {
    q: '¿Cómo se libera el depósito de garantía?',
    a: 'El depósito se libera al devolver el conjunto completo y en buen estado, dentro del plazo acordado.',
  },
]

export default function FaqView() {
  return (
    <div className="container-page py-16">
      <p className="eyebrow">Ayuda</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">Preguntas frecuentes</h1>
      <p className="mt-3 max-w-xl text-ink-500">
        Aquí respondemos las dudas más comunes sobre el proceso de alquiler de trajes de Caporal.
      </p>

      <div className="mt-8 space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="card p-5">
            <p className="font-display text-lg font-semibold text-ink-900">{f.q}</p>
            <p className="mt-1 text-sm text-ink-500">{f.a}</p>
          </div>
        ))}
      </div>

      <Link to="/" className="mt-8 inline-block text-sm font-medium text-wine-500 hover:underline">
        ← Volver al catálogo
      </Link>
    </div>
  )
}
