import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  autoComplete?: string
  invalid?: boolean
  maxLength?: number
}

/** Campo de contraseña con botón para mostrar/ocultar (útil en el celular). */
export default function PasswordInput({
  value,
  onChange,
  onBlur,
  placeholder = '••••••••',
  autoComplete = 'current-password',
  invalid = false,
  maxLength = 64,
}: Props) {
  const [visible, setVisible] = useState(false)
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 focus-within:border-ink-900 ${
        invalid ? 'border-wine-500' : 'border-ink-200'
      }`}
    >
      <Lock className="h-4 w-4 shrink-0 text-ink-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        type={visible ? 'text' : 'password'}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={invalid}
        placeholder={placeholder}
        className="w-full min-w-0 text-sm outline-none"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="focus-ring shrink-0 rounded p-1 text-ink-400 hover:text-ink-900"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}
