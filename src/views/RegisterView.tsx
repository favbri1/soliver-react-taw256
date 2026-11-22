import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, BadgeCheck } from 'lucide-react'
import { useUiStore } from '@/stores/ui.store'
import { authService } from '@/services/auth.service'
import { evaluatePassword, validateNewPassword } from '@/utils/password'
import {
  validateFullName,
  validateUsername,
  validateRequiredEmail,
  validateConfirmPassword,
} from '@/utils/validators'
import AuthShell from '@/components/auth/AuthShell'
import PasswordInput from '@/components/auth/PasswordInput'
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter'

type Field = 'fullName' | 'username' | 'email' | 'password' | 'confirm'

export default function RegisterView() {
  const navigate = useNavigate()
  const pushToast = useUiStore((s) => s.pushToast)

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    fullName: false,
    username: false,
    email: false,
    password: false,
    confirm: false,
  })
  const [serverErrors, setServerErrors] = useState<Partial<Record<Field, string>>>({})
  const [loading, setLoading] = useState(false)

  const errors: Record<Field, string> = {
    fullName: validateFullName(fullName),
    username: validateUsername(username),
    email: validateRequiredEmail(email),
    // La contraseña débil no se acepta (política de registro).
    password: validateNewPassword(password, username),
    confirm: validateConfirmPassword(password, confirm),
  }
  const touch = (f: Field) => setTouched((t) => ({ ...t, [f]: true }))
  const errorOf = (f: Field) => serverErrors[f] || (touched[f] ? errors[f] : '')
  const clearServer = (f: Field) => setServerErrors((s) => ({ ...s, [f]: undefined }))
  const hasErrors = Object.values(errors).some(Boolean)

  const inputClass = (f: Field) =>
    `flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 focus-within:border-ink-900 ${
      errorOf(f) ? 'border-wine-500' : 'border-ink-200'
    }`

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (hasErrors) {
      setTouched({ fullName: true, username: true, email: true, password: true, confirm: true })
      return
    }
    setLoading(true)
    const result = await authService.register({ fullName, username, email, password })
    setLoading(false)
    if (!result.ok) {
      setServerErrors({ [result.field ?? 'username']: result.message })
      return
    }
    pushToast('Cuenta creada. Ya puedes iniciar sesión.', 'success')
    navigate('/login', { replace: true, state: { prefillUsername: result.user.username } })
  }

  const level = evaluatePassword(password, username).level

  return (
    <AuthShell title="Crear cuenta" subtitle="Registro de usuario">
      <form className="space-y-4" onSubmit={submit} noValidate>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-400">Nombre completo</span>
          <div className={inputClass('fullName')}>
            <BadgeCheck className="h-4 w-4 shrink-0 text-ink-400" />
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => touch('fullName')}
              type="text"
              maxLength={80}
              autoComplete="name"
              aria-invalid={!!errorOf('fullName')}
              placeholder="María Pérez Gómez"
              className="w-full min-w-0 text-sm outline-none"
            />
          </div>
          {errorOf('fullName') ? <p className="mt-1 text-xs text-wine-600">{errorOf('fullName')}</p> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-400">Usuario</span>
          <div className={inputClass('username')}>
            <User className="h-4 w-4 shrink-0 text-ink-400" />
            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                clearServer('username')
              }}
              onBlur={() => touch('username')}
              type="text"
              maxLength={50}
              autoComplete="username"
              aria-invalid={!!errorOf('username')}
              placeholder="mperez"
              className="w-full min-w-0 text-sm outline-none"
            />
          </div>
          {errorOf('username') ? <p className="mt-1 text-xs text-wine-600">{errorOf('username')}</p> : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-400">Correo electrónico</span>
          <div className={inputClass('email')}>
            <Mail className="h-4 w-4 shrink-0 text-ink-400" />
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearServer('email')
              }}
              onBlur={() => touch('email')}
              type="email"
              maxLength={100}
              autoComplete="email"
              aria-invalid={!!errorOf('email')}
              placeholder="correo@ejemplo.com"
              className="w-full min-w-0 text-sm outline-none"
            />
          </div>
          {errorOf('email') ? <p className="mt-1 text-xs text-wine-600">{errorOf('email')}</p> : null}
        </label>

        <div>
          <span className="mb-1 block text-xs font-medium text-ink-400">Contraseña</span>
          <PasswordInput
            value={password}
            onChange={(v) => {
              setPassword(v)
              clearServer('password')
            }}
            onBlur={() => touch('password')}
            autoComplete="new-password"
            invalid={!!errorOf('password')}
          />
          <PasswordStrengthMeter password={password} username={username} />
          {errorOf('password') && touched.password ? (
            <p className="mt-2 text-xs text-wine-600">{errorOf('password')}</p>
          ) : null}
          {password && level !== 'debil' ? (
            <p className="mt-2 text-xs text-ink-400">
              Se guardará <span className="font-semibold">cifrada</span> (hash con sal); nunca en texto plano.
            </p>
          ) : null}
        </div>

        <div>
          <span className="mb-1 block text-xs font-medium text-ink-400">Confirmar contraseña</span>
          <PasswordInput
            value={confirm}
            onChange={setConfirm}
            onBlur={() => touch('confirm')}
            autoComplete="new-password"
            invalid={!!errorOf('confirm')}
          />
          {errorOf('confirm') ? <p className="mt-1 text-xs text-wine-600">{errorOf('confirm')}</p> : null}
        </div>

        <p className="rounded-lg bg-ink-100/60 px-3 py-2 text-xs text-ink-400">
          Las cuentas nuevas se crean con rol <span className="font-semibold">Empleado</span>. Un administrador puede
          ampliar los permisos.
        </p>

        <button type="submit" className="btn-dark w-full" disabled={loading}>
          {loading ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        <p className="text-center text-sm text-ink-400">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-wine-500 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
