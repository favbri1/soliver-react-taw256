import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import logo from '@/assets/logo.png'

interface Props {
  title?: string
  subtitle?: string
  children: ReactNode
}

/** Marco común de las pantallas de acceso (login, registro, recuperar contraseña). */
export default function AuthShell({ title = 'SOLIVER', subtitle = 'Alquiler de Trajes de Caporal', children }: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink-900 lg:block">
        <img
          src="https://picsum.photos/seed/soliver-login/1200/1600"
          alt="Trajes de Caporal SOLIVER"
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/60 via-ink-900/70 to-ink-900/60" />
        {/* Bloque de texto centrado en el panel (horizontal y verticalmente) */}
        <div className="absolute inset-0 flex items-center justify-center px-12 xl:px-20">
          <div className="max-w-md text-center text-white">
            <p className="eyebrow text-gold-500">Panel administrativo</p>
            <span className="mx-auto mt-4 block h-px w-12 bg-gold-500" aria-hidden="true" />
            <p className="mt-5 font-display text-3xl font-semibold leading-tight xl:text-4xl">
              Gestiona inventario, reservas y alquileres desde un solo lugar.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-ink-50 px-6 py-10 sm:py-16">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full">
              <img src={logo} alt="Logo SOLIVER" className="h-full w-full object-cover" />
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold text-ink-900">{title}</h1>
            <p className="tracking-widest2 text-xs uppercase text-gold-600">{subtitle}</p>
          </div>

          {children}

          <p className="mt-8 text-center text-xs text-ink-400">
            <Link to="/" className="hover:text-ink-900 hover:underline">
              ← Volver al catálogo
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
