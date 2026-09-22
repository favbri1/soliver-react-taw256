import logo from '@/assets/logo.png'

export default function PublicFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-ink-900 pt-12 text-white/70">
      <div className="container-page grid gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full">
              <img src={logo} alt="Logo SOLIVER" className="h-full w-full object-cover" />
            </div>
            <p className="font-display text-lg font-semibold text-white">SOLIVER</p>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/50">
            Alquiler de trajes de Caporal para comparsas, fraternidades y bailarines independientes. Tradición, calidad y elegancia
            en cada entrada.
          </p>
        </div>
        <div>
          <p className="eyebrow text-gold-500/80">Catálogo</p>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li>Varón / Tropa</li>
            <li>Macho Caporal</li>
            <li>China Supay</li>
            <li>Cholita</li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold-500/80">Alquiler</p>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li>Cómo funciona</li>
            <li>Depósito en garantía</li>
            <li>Consultar disponibilidad</li>
            <li>Mi reserva</li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-gold-500/80">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li>La Paz, Bolivia</li>
            <li>hola@soliver.bo</li>
            <li>+591 700 00000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {year} SOLIVER — Proyecto académico de ingeniería de software.
      </div>
    </footer>
  )
}
