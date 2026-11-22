// Medidor de fortaleza de contraseña: débil, intermedio o fuerte.
// Estas mismas reglas deberán validarse también en el backend NestJS.

export type StrengthLevel = 'debil' | 'intermedio' | 'fuerte'

export interface PasswordCheck {
  id: string
  label: string
  ok: boolean
}

export interface PasswordStrength {
  level: StrengthLevel
  label: string
  /** 0 (vacía) a 3 (fuerte): cantidad de segmentos de la barra a llenar. */
  segments: number
  checks: PasswordCheck[]
}

const COMMON = ['password', 'contraseña', 'contrasena', '123456', '12345678', 'qwerty', 'abc123', 'admin', 'soliver', 'caporal']

export function evaluatePassword(password: string, username = ''): PasswordStrength {
  const hasLower = /[a-záéíóúüñ]/.test(password)
  const hasUpper = /[A-ZÁÉÍÓÚÜÑ]/.test(password)
  const hasDigit = /\d/.test(password)
  const hasSymbol = /[^A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ\s]/.test(password)
  const classes = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length
  const len = password.length

  const lower = password.toLowerCase()
  const user = username.trim().toLowerCase()
  const tooCommon = COMMON.some((c) => lower.includes(c)) || (user.length >= 3 && lower.includes(user))

  const checks: PasswordCheck[] = [
    { id: 'len', label: 'Al menos 8 caracteres', ok: len >= 8 },
    { id: 'upper', label: 'Una letra mayúscula', ok: hasUpper },
    { id: 'lower', label: 'Una letra minúscula', ok: hasLower },
    { id: 'digit', label: 'Un número', ok: hasDigit },
    { id: 'symbol', label: 'Un símbolo (ej. # $ % & !)', ok: hasSymbol },
  ]

  if (!password) return { level: 'debil', label: 'Escribe una contraseña', segments: 0, checks }

  let level: StrengthLevel = 'debil'
  if (!tooCommon && len >= 10 && classes === 4) level = 'fuerte'
  else if (!tooCommon && len >= 14 && classes >= 3) level = 'fuerte'
  else if (!tooCommon && len >= 8 && classes >= 3) level = 'intermedio'

  const map = {
    debil: { label: 'Débil', segments: 1 },
    intermedio: { label: 'Intermedia', segments: 2 },
    fuerte: { label: 'Fuerte', segments: 3 },
  } as const
  return { level, ...map[level], checks }
}

/** Política de registro: se rechaza la contraseña débil. */
export function validateNewPassword(password: string, username = ''): string {
  if (!password) return 'Ingresa una contraseña.'
  if (password.length > 64) return 'La contraseña no puede superar los 64 caracteres.'
  if (evaluatePassword(password, username).level === 'debil') {
    return 'La contraseña es débil. Usa 8+ caracteres con mayúsculas, minúsculas, números y símbolos.'
  }
  return ''
}
