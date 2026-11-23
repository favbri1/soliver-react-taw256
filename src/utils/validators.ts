// Validadores de campos de entrada. Cada función devuelve un mensaje de error,
// o una cadena vacía ('') si el valor es válido.
//
// Nota: son validaciones del lado del cliente (mejoran la experiencia de uso).
// Cuando exista el backend NestJS, las mismas reglas deben repetirse allí
// (class-validator), porque el frontend nunca es una barrera de seguridad.

/** Letras (con tildes y ñ), espacios, apóstrofe y guion. Ej.: "María José O'Brien-Pérez". */
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '\-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const USERNAME_REGEX = /^[A-Za-z0-9._@-]+$/

export function validateUsername(value: string): string {
  const v = value.trim()
  if (!v) return 'Ingresa tu usuario.'
  if (v.length < 3) return 'El usuario debe tener al menos 3 caracteres.'
  if (v.length > 50) return 'El usuario no puede superar los 50 caracteres.'
  if (!USERNAME_REGEX.test(v)) return 'Usa solo letras, números y los símbolos . _ - @ (sin espacios).'
  return ''
}

export function validateLoginPassword(value: string): string {
  if (!value) return 'Ingresa tu contraseña.'
  if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
  if (value.length > 64) return 'La contraseña no puede superar los 64 caracteres.'
  return ''
}

export function validateFullName(value: string): string {
  const v = value.trim().replace(/\s+/g, ' ')
  if (!v) return 'Ingresa tu nombre completo.'
  if (v.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
  if (v.length > 80) return 'El nombre no puede superar los 80 caracteres.'
  if (!NAME_REGEX.test(v)) return 'El nombre solo puede tener letras y espacios.'
  if (!v.includes(' ')) return 'Ingresa nombre y apellido.'
  return ''
}

/**
 * Teléfono boliviano. Acepta prefijo opcional (+591 / 591) y espacios o guiones.
 *  - Celular: 8 dígitos que empiezan con 6 o 7 (ej.: 7001 2345).
 *  - Fijo: 7 dígitos que empiezan con 2, 3 o 4 (ej.: 220 1234).
 */
export function validatePhone(value: string): string {
  const raw = value.trim()
  if (!raw) return 'Ingresa tu teléfono.'
  if (!/^[+\d][\d\s-]*$/.test(raw)) return 'El teléfono solo puede contener números, espacios o guiones.'
  let digits = raw.replace(/[\s-]/g, '')
  digits = digits.replace(/^\+?591/, '')
  if (/^[67]\d{7}$/.test(digits)) return ''
  if (/^[234]\d{6}$/.test(digits)) return ''
  return 'Ingresa un teléfono válido: celular de 8 dígitos (empieza con 6 o 7) o fijo de 7 dígitos.'
}

/** El correo es opcional: vacío es válido; si se escribe, debe tener formato correcto. */
export function validateOptionalEmail(value: string): string {
  const v = value.trim()
  if (!v) return ''
  if (v.length > 100) return 'El correo no puede superar los 100 caracteres.'
  if (!EMAIL_REGEX.test(v)) return 'Ingresa un correo válido (ej.: nombre@correo.com).'
  return ''
}

/** Correo obligatorio (se usa para recuperar la contraseña). */
export function validateRequiredEmail(value: string): string {
  if (!value.trim()) return 'Ingresa tu correo electrónico.'
  return validateOptionalEmail(value)
}

export function validateConfirmPassword(password: string, confirm: string): string {
  if (!confirm) return 'Repite la contraseña.'
  if (password !== confirm) return 'Las contraseñas no coinciden.'
  return ''
}

/** Código de recuperación: exactamente 6 dígitos. */
export function validateResetCode(value: string): string {
  if (!value.trim()) return 'Ingresa el código que recibiste.'
  if (!/^\d{6}$/.test(value.trim())) return 'El código tiene 6 dígitos.'
  return ''
}

/** Usuario o correo (pantalla de recuperación). */
export function validateIdentifier(value: string): string {
  const v = value.trim()
  if (!v) return 'Ingresa tu usuario o correo.'
  if (v.length < 3) return 'Debe tener al menos 3 caracteres.'
  if (v.length > 100) return 'Es demasiado largo.'
  return ''
}

/** Precio de venta: obligatorio cuando el traje se vende y SIEMPRE mayor al de alquiler. */
export function validateSalePrice(salePrice: number, rentalPrice: number): string {
  if (!salePrice || salePrice <= 0) return 'Ingresa el precio de venta.'
  if (salePrice <= rentalPrice) return 'El precio de venta debe ser mayor al precio de alquiler.'
  return ''
}
