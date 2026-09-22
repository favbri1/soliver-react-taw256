import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '@/assets/logo.png'

const links = [
  { label: 'Catálogo', to: '/' },
  { label: 'Cómo funciona', to: '/#como-funciona' },
  { label: 'Sobre nosotros', to: '/sobre-nosotros' },
  { label: 'Mi reserva', to: '/mi-reserva' },
  // Pregunta 5: enlace nuevo hacia la ruta /preguntas-frecuentes usando <Link>
  { label: 'Preguntas frecuentes', to: '/preguntas-frecuentes' },
]

export default function PublicHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-ink-900/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full">
            <img src={logo} alt="Logo SOLIVER" className="h-full w-full object-cover" />
          </div>
          <div className="leading-none">
            <p className="font-display text-lg font-semibold text-white">SOLIVER</p>
            <p className="tracking-widest2 text-[10px] uppercase text-gold-500/80">Trajes de Caporal</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-white/70 transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="btn-outline border-white/20 bg-transparent text-white hover:border-white/50">
            Acceso administrativo
          </Link>
          <Link to="/#catalogo" className="btn-gold">
            Explorar trajes
          </Link>
        </div>

        <button className="focus-ring rounded-lg p-2 text-white md:hidden" onClick={() => setOpen(!open)}>
          {!open ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="fade-in border-t border-white/10 bg-ink-900 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="py-1.5 text-sm font-medium text-white/80" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link to="/login" className="btn-outline mt-2 border-white/20 bg-transparent text-white" onClick={() => setOpen(false)}>
              Acceso administrativo
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
