import { ShieldCheck, Droplet, CalendarCheck, Users, MapPin, Clock, MessageCircle, Instagram } from 'lucide-react'

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Calidad y Autenticidad',
    text: 'Trajes confeccionados con bordados tradicionales, telas de alta durabilidad y detalles impecables para que destaques en el bloque.',
  },
  {
    icon: Droplet,
    title: 'Higiene y Cuidado Garantizado',
    text: 'Cada prenda pasa por un estricto proceso de lavandería, desinfección y revisión antes de cada entrega.',
  },
  {
    icon: CalendarCheck,
    title: 'Reserva Garantizada',
    text: 'Nuestro sistema asegura que el traje que elegiste estará listo, planchado y completo en la fecha acordada, sin sorpresas de último momento.',
  },
  {
    icon: Users,
    title: 'Atención Personalizada',
    text: 'Te ayudamos a encontrar el talle perfecto y los accesorios exactos según la fraternidad o evento en el que participes.',
  },
]

// TODO: reemplazar con los datos reales del taller/local
const contact = {
  address: 'Calle Comercio #123, La Paz, Bolivia',
  mapsUrl: 'https://maps.google.com/?q=Calle+Comercio+123+La+Paz+Bolivia',
  hours: 'Lunes a Sábado de 09:00 a 19:00',
  whatsapp: 'https://wa.me/59170000000',
  instagram: 'https://instagram.com/soliver.bo',
  tiktok: 'https://tiktok.com/@soliver.bo',
}

export default function AboutView() {
  return (
    <div>
      {/* ENCABEZADO / NUESTRA HISTORIA */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="container-page relative py-20 sm:py-28">
          <p className="eyebrow text-gold-500">Nuestra historia</p>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.15] sm:text-5xl">
            "Apasionados por el folklore, dedicados a vestir tu devoción."
          </h1>
          <p className="mt-6 max-w-2xl text-white/70">
            Nacimos como un taller familiar dedicado a preservar la elegancia y fuerza de la danza del Caporal. Sabemos lo
            importante que es cada ensayo, convite y entrada para ti; por eso, nos aseguramos de que luzcas el mejor traje con
            el calce y la calidad que mereces.
          </p>
        </div>
      </section>

      {/* PILARES / POR QUÉ ELEGIRNOS */}
      <section className="container-page py-16">
        <p className="eyebrow">Por qué elegirnos</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">Nuestros pilares</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="card p-6">
              <p.icon className="h-6 w-6 text-gold-600" />
              <p className="mt-3 font-display text-lg font-semibold text-ink-900">{p.title}</p>
              <p className="mt-1 text-sm text-ink-500">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISIÓN */}
      <section className="bg-white py-16">
        <div className="container-page">
          <div className="card mx-auto max-w-3xl p-8 text-center sm:p-12">
            <p className="eyebrow">Misión</p>
            <p className="mt-3 font-display text-2xl font-semibold leading-snug text-ink-900 sm:text-3xl">
              Facilitar a fraternos y bailarines el acceso a trajes de Caporal de alta calidad mediante un servicio de alquiler
              ágil, confiable y moderno.
            </p>
          </div>
        </div>
      </section>

      {/* UBICACIÓN, HORARIOS Y REDES */}
      <section className="container-page py-16">
        <p className="eyebrow">Visítanos</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">Ubicación y contacto</h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="card p-6">
            <MapPin className="h-6 w-6 text-gold-600" />
            <p className="mt-3 font-display text-lg font-semibold text-ink-900">Ubicación del taller</p>
            <p className="mt-1 text-sm text-ink-500">{contact.address}</p>
            <a href={contact.mapsUrl} target="_blank" rel="noopener" className="btn-outline mt-4 w-full text-center">
              Ver en mapa
            </a>
          </div>

          <div className="card p-6">
            <Clock className="h-6 w-6 text-gold-600" />
            <p className="mt-3 font-display text-lg font-semibold text-ink-900">Horarios de atención</p>
            <p className="mt-1 text-sm text-ink-500">{contact.hours}</p>
            <p className="mt-1 text-xs text-ink-400">Horario extendido en época de entradas y convites.</p>
          </div>

          <div className="card p-6">
            <p className="font-display text-lg font-semibold text-ink-900">Síguenos</p>
            <p className="mt-1 text-sm text-ink-500">Mira fotos y videos de los bloques en acción.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={contact.whatsapp} target="_blank" rel="noopener" className="btn-primary">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a href={contact.instagram} target="_blank" rel="noopener" className="btn-outline">
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
              <a href={contact.tiktok} target="_blank" rel="noopener" className="btn-outline">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M16.5 3c.4 1.9 1.7 3.4 3.5 3.9v2.9c-1.3 0-2.5-.4-3.5-1.1v6.6c0 3.1-2.5 5.7-5.7 5.7S5.1 17.4 5.1 14.3c0-3.1 2.5-5.6 5.6-5.7v3c-1.4.1-2.6 1.3-2.6 2.7 0 1.5 1.2 2.7 2.7 2.7 1.5 0 2.7-1.2 2.7-2.7V3h3z" />
                </svg>
                TikTok
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
