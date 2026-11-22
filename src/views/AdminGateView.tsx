import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { isAdminGateOpen, safeAuthRoute, tryOpenAdminGate } from '@/config/adminAccess'
import AuthShell from '@/components/auth/AuthShell'
import PasswordInput from '@/components/auth/PasswordInput'

/** Pantalla que solicita la contraseña de acceso administrativo antes del login. */
export default function AdminGateView() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { from?: string; redirect?: string } | null

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Si ya se superó la barrera en esta sesión, se continúa directamente.
  if (isAdminGateOpen()) {
    return <Navigate to={safeAuthRoute(state?.from)} replace state={{ redirect: state?.redirect }} />
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!password) {
      setError('Ingresa la contraseña de acceso.')
      return
    }
    if (!tryOpenAdminGate(password)) {
      setError('Contraseña incorrecta. Inténtalo nuevamente.')
      setPassword('')
      return
    }
    navigate(safeAuthRoute(state?.from), { replace: true, state: { redirect: state?.redirect } })
  }

  return (
    <AuthShell title="Acceso administrativo" subtitle="Área restringida">
      <form className="space-y-4" onSubmit={submit} noValidate>
        <div className="flex gap-3 rounded-lg border border-ink-100 bg-white p-3 text-sm text-ink-600">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
          <p>Esta área es exclusiva para el personal de SOLIVER. Ingresa la contraseña de acceso para continuar.</p>
        </div>

        {error ? (
          <p role="alert" className="rounded-lg bg-wine-500/10 px-3 py-2 text-sm text-wine-600">
            {error}
          </p>
        ) : null}

        <div>
          <span className="mb-1 block text-xs font-medium text-ink-400">Contraseña de acceso</span>
          <PasswordInput
            value={password}
            onChange={(v) => {
              setPassword(v)
              if (error) setError('')
            }}
            autoComplete="off"
            placeholder="Contraseña de acceso"
            invalid={!!error}
          />
        </div>

        <button type="submit" className="btn-dark w-full">
          Continuar
        </button>
      </form>
    </AuthShell>
  )
}
