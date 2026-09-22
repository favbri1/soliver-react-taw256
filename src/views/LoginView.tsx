import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Lock, User } from 'lucide-react'
import { useUiStore } from '@/stores/ui.store'
import logo from '@/assets/logo.png'

export default function LoginView() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useUiStore((s) => s.login)
  const pushToast = useUiStore((s) => s.pushToast)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  // Pregunta 2 — Nuevo campo controlado: "Recordarme".
  // Estado nuevo (useState) + value/checked + onChange, ya conectado
  // a un formulario controlado que ya existía.
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('soliver_remembered_user')
    if (saved) {
      setUsername(saved)
      setRemember(true)
    }
  }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      login(username || 'Administrador SOLIVER')
      // El dato del nuevo campo se usa de verdad: si "Recordarme" está
      // marcado, guardamos el usuario para la próxima visita; si no, lo limpiamos.
      if (remember) {
        localStorage.setItem('soliver_remembered_user', username || 'Administrador SOLIVER')
      } else {
        localStorage.removeItem('soliver_remembered_user')
      }
      pushToast('Bienvenida/o de vuelta.', 'success')
      setLoading(false)
      const redirect = (location.state as { redirect?: string })?.redirect
      navigate(redirect || '/dashboard')
    }, 500)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink-900 lg:block">
        <img
          src="https://picsum.photos/seed/soliver-login/1200/1600"
          alt="Trajes de Caporal SOLIVER"
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <p className="eyebrow text-gold-500">Panel administrativo</p>
          <p className="mt-2 font-display text-3xl font-semibold leading-tight">
            Gestiona inventario, reservas y alquileres desde un solo lugar.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-ink-50 px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full">
              <img src={logo} alt="Logo SOLIVER" className="h-full w-full object-cover" />
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold text-ink-900">SOLIVER</h1>
            <p className="tracking-widest2 text-xs uppercase text-gold-600">Alquiler de Trajes de Caporal</p>
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-400">Usuario</span>
              <div className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2.5 focus-within:border-ink-900">
                <User className="h-4 w-4 text-ink-400" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="admin@soliver.bo"
                  className="w-full text-sm outline-none"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-400">Contraseña</span>
              <div className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2.5 focus-within:border-ink-900">
                <Lock className="h-4 w-4 text-ink-400" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="w-full text-sm outline-none"
                />
              </div>
            </label>

            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-ink-300 accent-wine-500"
              />
              Recordarme en este dispositivo
            </label>

            <button type="submit" className="btn-dark w-full" disabled={loading}>
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-400">Acceso administrativo simulado para fines de demostración.</p>
          <Link to="/" className="mt-4 block text-center text-sm font-medium text-wine-500 hover:underline">
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}
