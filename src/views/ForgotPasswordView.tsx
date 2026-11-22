import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, MailCheck, ArrowLeft } from 'lucide-react'
import { useUiStore } from '@/stores/ui.store'
import { authService, RESET_CODE_MINUTES } from '@/services/auth.service'
import { validateIdentifier, validateResetCode, validateConfirmPassword } from '@/utils/validators'
import { validateNewPassword } from '@/utils/password'
import AuthShell from '@/components/auth/AuthShell'
import PasswordInput from '@/components/auth/PasswordInput'
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter'

type Step = 'request' | 'reset'

/**
 * Recuperación de contraseña (simulada). Flujo:
 *  1) El usuario indica su usuario o correo.
 *  2) El sistema envía un código de 6 dígitos de un solo uso que vence en 10 minutos.
 *  3) Con el código define una contraseña nueva (que debe cumplir la política de fortaleza).
 * Por seguridad, el mensaje es el mismo exista o no la cuenta.
 */
export default function ForgotPasswordView() {
  const navigate = useNavigate()
  const pushToast = useUiStore((s) => s.pushToast)

  const [step, setStep] = useState<Step>('request')
  const [identifier, setIdentifier] = useState('')
  const [identifierTouched, setIdentifierTouched] = useState(false)
  const [loading, setLoading] = useState(false)

  const [demoCode, setDemoCode] = useState<string | undefined>()
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [touched, setTouched] = useState({ code: false, password: false, confirm: false })
  const [serverError, setServerError] = useState<{ field?: 'code' | 'password'; message: string } | null>(null)

  const identifierError = validateIdentifier(identifier)
  const codeError = validateResetCode(code)
  const passwordError = validateNewPassword(password, identifier)
  const confirmError = validateConfirmPassword(password, confirm)

  async function requestCode(e: React.FormEvent) {
    e.preventDefault()
    setIdentifierTouched(true)
    if (identifierError) return
    setLoading(true)
    const res = await authService.requestPasswordReset(identifier)
    setLoading(false)
    setDemoCode(res.demoCode)
    setCode('')
    setPassword('')
    setConfirm('')
    setTouched({ code: false, password: false, confirm: false })
    setServerError(null)
    setStep('reset')
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault()
    if (codeError || passwordError || confirmError) {
      setTouched({ code: true, password: true, confirm: true })
      return
    }
    setLoading(true)
    const res = await authService.resetPassword(identifier, code, password)
    setLoading(false)
    if (!res.ok) {
      setServerError({ field: res.field, message: res.message })
      return
    }
    pushToast('Contraseña actualizada. Inicia sesión con la nueva contraseña.', 'success')
    navigate('/login', { replace: true })
  }

  const fieldClass = (invalid: boolean) =>
    `flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 focus-within:border-ink-900 ${
      invalid ? 'border-wine-500' : 'border-ink-200'
    }`

  return (
    <AuthShell title="Recuperar contraseña" subtitle="Restablece tu acceso">
      {step === 'request' ? (
        <form className="space-y-4" onSubmit={requestCode} noValidate>
          <p className="text-sm text-ink-400">
            Ingresa tu usuario o correo. Te enviaremos un código de verificación para crear una contraseña nueva.
          </p>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-400">Usuario o correo</span>
            <div className={fieldClass(identifierTouched && !!identifierError)}>
              <Mail className="h-4 w-4 shrink-0 text-ink-400" />
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onBlur={() => setIdentifierTouched(true)}
                type="text"
                maxLength={100}
                autoComplete="username"
                aria-invalid={identifierTouched && !!identifierError}
                placeholder="admin@soliver.bo"
                className="w-full min-w-0 text-sm outline-none"
              />
            </div>
            {identifierTouched && identifierError ? <p className="mt-1 text-xs text-wine-600">{identifierError}</p> : null}
          </label>
          <button type="submit" className="btn-dark w-full" disabled={loading}>
            {loading ? 'Enviando…' : 'Enviar código'}
          </button>
          <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-ink-400 hover:text-ink-900">
            <ArrowLeft className="h-4 w-4" /> Volver al inicio de sesión
          </Link>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={submitReset} noValidate>
          <div className="flex gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-ink-600">
            <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <p>
              Si la cuenta existe, enviamos un código de 6 dígitos a su correo. Vence en {RESET_CODE_MINUTES} minutos y
              solo sirve una vez.
            </p>
          </div>

          {/* Sin servidor de correo, el código se muestra aquí. Con backend llegará solo por email. */}
          {demoCode ? (
            <div className="rounded-lg border border-dashed border-gold-500 bg-gold-500/10 p-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                Tu código de verificación
              </p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-[0.3em] text-ink-900">{demoCode}</p>
            </div>
          ) : null}

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-400">Código de verificación</span>
            <div className={fieldClass((touched.code && !!codeError) || serverError?.field === 'code')}>
              <input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  setServerError(null)
                }}
                onBlur={() => setTouched((t) => ({ ...t, code: true }))}
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                placeholder="123456"
                className="w-full min-w-0 text-center font-mono text-lg tracking-[0.4em] outline-none"
              />
            </div>
            {touched.code && codeError ? <p className="mt-1 text-xs text-wine-600">{codeError}</p> : null}
            {serverError?.field === 'code' ? <p className="mt-1 text-xs text-wine-600">{serverError.message}</p> : null}
          </label>

          <div>
            <span className="mb-1 block text-xs font-medium text-ink-400">Nueva contraseña</span>
            <PasswordInput
              value={password}
              onChange={(v) => {
                setPassword(v)
                setServerError(null)
              }}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              autoComplete="new-password"
              invalid={(touched.password && !!passwordError) || serverError?.field === 'password'}
            />
            <PasswordStrengthMeter password={password} username={identifier} />
            {touched.password && passwordError ? <p className="mt-2 text-xs text-wine-600">{passwordError}</p> : null}
            {serverError?.field === 'password' ? <p className="mt-2 text-xs text-wine-600">{serverError.message}</p> : null}
          </div>

          <div>
            <span className="mb-1 block text-xs font-medium text-ink-400">Confirmar contraseña</span>
            <PasswordInput
              value={confirm}
              onChange={setConfirm}
              onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
              autoComplete="new-password"
              invalid={touched.confirm && !!confirmError}
            />
            {touched.confirm && confirmError ? <p className="mt-1 text-xs text-wine-600">{confirmError}</p> : null}
          </div>

          <button type="submit" className="btn-dark w-full" disabled={loading}>
            {loading ? 'Actualizando…' : 'Cambiar contraseña'}
          </button>
          <button
            type="button"
            onClick={() => setStep('request')}
            className="flex w-full items-center justify-center gap-1 text-sm text-ink-400 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" /> Pedir otro código
          </button>
        </form>
      )}
    </AuthShell>
  )
}
