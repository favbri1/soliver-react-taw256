import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { User, ShieldAlert } from 'lucide-react'
import { useUiStore } from '@/stores/ui.store'
import { authService, MAX_ATTEMPTS } from '@/services/auth.service'
import { validateUsername, validateLoginPassword } from '@/utils/validators'
import { generateCaptcha, checkCaptcha } from '@/utils/captcha'
import { canAccess } from '@/utils/permissions'
import AuthShell from '@/components/auth/AuthShell'
import PasswordInput from '@/components/auth/PasswordInput'
import CaptchaField from '@/components/auth/CaptchaField'

const REMEMBER_KEY = 'soliver_remembered_user'

function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function LoginView() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useUiStore((s) => s.login)
  const pushToast = useUiStore((s) => s.pushToast)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  // CAPTCHA (simulado en el navegador).
  const [captcha, setCaptcha] = useState(() => generateCaptcha())
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaError, setCaptchaError] = useState('')

  // Validaciones: el error de cada campo se muestra solo después de tocarlo
  // (onBlur) o de intentar enviar el formulario.
  const [touched, setTouched] = useState({ username: false, password: false })
  const usernameError = validateUsername(username)
  const passwordError = validateLoginPassword(password)
  const showUsernameError = touched.username && !!usernameError
  const showPasswordError = touched.password && !!passwordError

  // Bloqueo por intentos fallidos: se consulta en cada render (el estado vive en
  // localStorage, así recargar la página no permite saltarse el bloqueo).
  const [, setTick] = useState(0)
  const lock = username.trim() ? authService.getLockState(username) : null
  const locked = !!lock?.locked

  useEffect(() => {
    if (!locked) return
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [locked])

  // Cuando el bloqueo termina, se avisa y se habilita de nuevo el formulario.
  const [wasLocked, setWasLocked] = useState(false)
  useEffect(() => {
    if (locked) setWasLocked(true)
    else if (wasLocked) {
      setWasLocked(false)
      pushToast('El bloqueo terminó. Ya puedes intentar ingresar de nuevo.', 'info')
    }
  }, [locked])

  // Usuario recién registrado o recordado.
  useEffect(() => {
    const prefill = (location.state as { prefillUsername?: string } | null)?.prefillUsername
    if (prefill) {
      setUsername(prefill)
      return
    }
    const saved = localStorage.getItem(REMEMBER_KEY)
    if (saved) {
      setUsername(saved)
      setRemember(true)
    }
  }, [])

  function refreshCaptcha() {
    setCaptcha(generateCaptcha())
    setCaptchaInput('')
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')

    if (usernameError || passwordError) {
      setTouched({ username: true, password: true })
      return
    }
    if (locked) return

    if (!checkCaptcha(captcha, captchaInput)) {
      setCaptchaError(captchaInput.trim() ? 'El código no coincide. Prueba con el nuevo.' : 'Escribe el código de la imagen.')
      if (captchaInput.trim()) refreshCaptcha()
      return
    }
    setCaptchaError('')

    setLoading(true)
    const result = await authService.login(username, password)
    setLoading(false)

    if (result.ok) {
      if (remember) localStorage.setItem(REMEMBER_KEY, result.user.username)
      else localStorage.removeItem(REMEMBER_KEY)
      login({ username: result.user.username, fullName: result.user.fullName, role: result.user.role })
      pushToast(`Bienvenida/o, ${result.user.fullName}.`, 'success')
      const redirect = (location.state as { redirect?: string } | null)?.redirect
      // Solo se vuelve a la ruta pedida si el rol tiene permiso para verla.
      navigate(redirect && canAccess(result.user.role, redirect) ? redirect : '/dashboard', { replace: true })
      return
    }

    refreshCaptcha()
    setPassword('')
    if (result.reason === 'invalid') {
      setFormError(
        `Usuario o contraseña incorrectos. Te ${result.attemptsLeft === 1 ? 'queda 1 intento' : `quedan ${result.attemptsLeft} intentos`} antes del bloqueo.`,
      )
    }
    setTick((t) => t + 1) // si quedó bloqueado, muestra el aviso de inmediato
  }

  return (
    <AuthShell>
      <form className="space-y-4" onSubmit={submit} noValidate>
        {locked && lock ? (
          <div role="alert" className="flex gap-3 rounded-lg border border-wine-500/30 bg-wine-500/10 p-3 text-sm text-wine-600">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Acceso bloqueado temporalmente</p>
              <p className="mt-0.5 text-xs">
                Superaste los {MAX_ATTEMPTS} intentos fallidos. Podrás intentar de nuevo en{' '}
                <span className="font-mono text-sm font-bold">{formatCountdown(lock.remainingSeconds)}</span>.
              </p>
            </div>
          </div>
        ) : null}

        {!locked && formError ? (
          <p role="alert" className="rounded-lg bg-wine-500/10 px-3 py-2 text-sm text-wine-600">
            {formError}
          </p>
        ) : null}

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-400">Usuario o correo</span>
          <div
            className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 focus-within:border-ink-900 ${
              showUsernameError ? 'border-wine-500' : 'border-ink-200'
            }`}
          >
            <User className="h-4 w-4 shrink-0 text-ink-400" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, username: true }))}
              type="text"
              maxLength={50}
              autoComplete="username"
              aria-invalid={showUsernameError}
              placeholder="admin@soliver.bo"
              className="w-full min-w-0 text-sm outline-none"
            />
          </div>
          {showUsernameError ? <p className="mt-1 text-xs text-wine-600">{usernameError}</p> : null}
        </label>

        <div>
          <span className="mb-1 block text-xs font-medium text-ink-400">Contraseña</span>
          <PasswordInput
            value={password}
            onChange={setPassword}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            invalid={showPasswordError}
          />
          {showPasswordError ? <p className="mt-1 text-xs text-wine-600">{passwordError}</p> : null}
        </div>

        <CaptchaField
          challenge={captcha}
          value={captchaInput}
          onChange={(v) => {
            setCaptchaInput(v)
            if (captchaError) setCaptchaError('')
          }}
          onRefresh={refreshCaptcha}
          error={captchaError}
        />

        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-ink-200 accent-wine-500"
            />
            Recordarme
          </label>
          <Link to="/recuperar-contrasena" className="text-sm font-medium text-wine-500 hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button type="submit" className="btn-dark w-full" disabled={loading || locked}>
          {loading ? 'Verificando…' : locked ? 'Bloqueado' : 'Ingresar'}
        </button>

        <p className="text-center text-sm text-ink-400">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-medium text-wine-500 hover:underline">
            Regístrate
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
