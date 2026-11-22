import { Check, X } from 'lucide-react'
import { evaluatePassword } from '@/utils/password'

/** Barra de fortaleza (débil / intermedia / fuerte) y lista de requisitos. */
export default function PasswordStrengthMeter({ password, username = '' }: { password: string; username?: string }) {
  const strength = evaluatePassword(password, username)
  const color =
    strength.level === 'fuerte' ? 'bg-emerald-500' : strength.level === 'intermedio' ? 'bg-gold-500' : 'bg-wine-500'
  const textColor =
    strength.level === 'fuerte' ? 'text-emerald-600' : strength.level === 'intermedio' ? 'text-gold-600' : 'text-wine-600'

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3].map((seg) => (
            <div
              key={seg}
              className={`h-1.5 flex-1 rounded-full transition-colors ${seg <= strength.segments ? color : 'bg-ink-100'}`}
            />
          ))}
        </div>
        <span className={`w-24 text-right text-xs font-semibold ${password ? textColor : 'text-ink-400'}`}>
          {password ? `Contraseña ${strength.label.toLowerCase()}` : 'Sin contraseña'}
        </span>
      </div>
      <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
        {strength.checks.map((c) => (
          <li key={c.id} className={`flex items-center gap-1.5 text-xs ${c.ok ? 'text-emerald-600' : 'text-ink-400'}`}>
            {c.ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
