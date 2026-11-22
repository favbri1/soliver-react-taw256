import type { AccessEvent, AccessLogEntry, AppUser, UserRole } from '@/types'
import { hashPassword, verifyPassword, sha256, randomSalt } from '@/utils/sha256'
import { validateNewPassword } from '@/utils/password'
import { detectBrowser } from '@/utils/browser'
import { delay } from '@/utils/async'

// ============================================================================
// SERVICIO DE AUTENTICACIÓN — SIMULADO EN EL NAVEGADOR (sin backend todavía)
//
// Cubre, a nivel de interfaz, los requisitos de seguridad de la presentación:
//   · registro con validación de fortaleza de contraseña y almacenamiento cifrado
//   · login con roles y bloqueo tras 3 intentos fallidos
//   · recuperación de contraseña con código temporal
//   · log de accesos (usuario, IP, evento, navegador, fecha y hora)
//
// Los datos se guardan en localStorage (solo hashes, nunca contraseñas en texto
// plano) para que la demostración sobreviva a recargar la página.
//
// ⚠️ Un frontend NUNCA es una barrera de seguridad. Todo esto debe reimplementarse
// en NestJS cuando exista el backend:
//   POST /auth/login           -> JWT + control de intentos + log de acceso
//   POST /auth/logout          -> log de salida
//   POST /users                -> bcrypt/argon2 + validación de fortaleza
//   POST /auth/forgot-password -> token de un solo uso enviado por correo
//   POST /auth/reset-password
//   GET  /audit/access-log
// ============================================================================

export const MAX_ATTEMPTS = 3
/** Tiempo de bloqueo. 60 s para poder demostrarlo en clase; en producción, p. ej. 15 minutos. */
export const LOCKOUT_SECONDS = 60
export const RESET_CODE_MINUTES = 10
/** El navegador no puede conocer su IP real; la registrará el backend. */
export const SIMULATED_IP = '127.0.0.1'

const USERS_KEY = 'soliver_users'
const LOG_KEY = 'soliver_access_log'
const ATTEMPTS_KEY = 'soliver_login_attempts'
const LOG_LIMIT = 300

// ---------------------------------------------------------------- almacenamiento
const memory: Record<string, string> = {}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : memory[key]
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  const raw = JSON.stringify(value)
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, raw)
    else memory[key] = raw
  } catch {
    memory[key] = raw
  }
}

// ---------------------------------------------------------------- usuarios
export type PublicUser = Omit<AppUser, 'passwordHash'>

function seedUsers(): AppUser[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'USR-001',
      fullName: 'Administrador SOLIVER',
      username: 'admin',
      email: 'admin@soliver.bo',
      role: 'Administrador',
      passwordHash: hashPassword('Morenada#2026'),
      createdAt: now,
    },
    {
      id: 'USR-002',
      fullName: 'Empleado SOLIVER',
      username: 'empleado',
      email: 'empleado@soliver.bo',
      role: 'Empleado',
      passwordHash: hashPassword('Tinku@2026!'),
      createdAt: now,
    },
  ]
}

function getUsers(): AppUser[] {
  const stored = read<AppUser[] | null>(USERS_KEY, null)
  if (stored && stored.length > 0) return stored
  const seeded = seedUsers()
  write(USERS_KEY, seeded)
  return seeded
}

const toPublic = (u: AppUser): PublicUser => {
  const { passwordHash: _omit, ...rest } = u
  return rest
}

const norm = (v: string) => v.trim().toLowerCase()

function findByIdentifier(identifier: string): AppUser | undefined {
  const id = norm(identifier)
  return getUsers().find((u) => norm(u.username) === id || norm(u.email) === id)
}

/** Credenciales de las cuentas iniciales (ya NO se muestran en el login; se conservan para la presentación). */
export const DEMO_CREDENTIALS = [
  { role: 'Administrador' as UserRole, username: 'admin', password: 'Morenada#2026' },
  { role: 'Empleado' as UserRole, username: 'empleado', password: 'Tinku@2026!' },
]

// ---------------------------------------------------------------- log de accesos
function logAccess(username: string, event: AccessEvent): void {
  const log = read<AccessLogEntry[]>(LOG_KEY, [])
  log.unshift({
    id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    username,
    ip: SIMULATED_IP,
    event,
    browser: detectBrowser(),
    dateTime: new Date().toISOString(),
  })
  write(LOG_KEY, log.slice(0, LOG_LIMIT))
}

// ---------------------------------------------------------------- intentos / bloqueo
interface AttemptState {
  attempts: number
  lockedUntil: number | null
}

export interface LockState {
  locked: boolean
  remainingSeconds: number
  attemptsLeft: number
}

/**
 * Clave del contador de intentos. Si la cuenta existe, se usa su usuario real, de modo
 * que escribir "admin" o "admin@soliver.bo" cuente contra la MISMA cuenta (si no, se
 * podría duplicar los intentos alternando entre usuario y correo).
 */
function lockKey(identifier: string): string {
  const user = findByIdentifier(identifier)
  return norm(user ? user.username : identifier)
}

function getAttemptsMap(): Record<string, AttemptState> {
  return read<Record<string, AttemptState>>(ATTEMPTS_KEY, {})
}

/** Estado de bloqueo de un usuario (también para usuarios que no existen, para no revelar cuáles existen). */
export function getLockState(username: string): LockState {
  const key = lockKey(username)
  const map = getAttemptsMap()
  const st = map[key]
  if (!st) return { locked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS }
  if (st.lockedUntil) {
    const remainingMs = st.lockedUntil - Date.now()
    if (remainingMs > 0) return { locked: true, remainingSeconds: Math.ceil(remainingMs / 1000), attemptsLeft: 0 }
    // El bloqueo venció: se reinicia el contador.
    delete map[key]
    write(ATTEMPTS_KEY, map)
    return { locked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS }
  }
  return { locked: false, remainingSeconds: 0, attemptsLeft: Math.max(0, MAX_ATTEMPTS - st.attempts) }
}

function clearAttempts(username: string): void {
  const map = getAttemptsMap()
  delete map[lockKey(username)]
  write(ATTEMPTS_KEY, map)
}

// ---------------------------------------------------------------- login / logout
export type LoginResult =
  | { ok: true; user: PublicUser }
  | { ok: false; reason: 'locked'; remainingSeconds: number }
  | { ok: false; reason: 'invalid'; attemptsLeft: number }

export async function login(username: string, password: string): Promise<LoginResult> {
  await delay(null, 400)
  const key = lockKey(username)

  const lock = getLockState(username)
  if (lock.locked) return { ok: false, reason: 'locked', remainingSeconds: lock.remainingSeconds }

  const user = findByIdentifier(username)
  if (user && verifyPassword(password, user.passwordHash)) {
    clearAttempts(key)
    logAccess(user.username, 'Ingreso')
    return { ok: true, user: toPublic(user) }
  }

  // Credenciales incorrectas (mismo mensaje exista o no el usuario).
  const map = getAttemptsMap()
  const st = map[key] ?? { attempts: 0, lockedUntil: null }
  st.attempts += 1
  logAccess(user?.username ?? username.trim(), 'Intento fallido')

  if (st.attempts >= MAX_ATTEMPTS) {
    st.lockedUntil = Date.now() + LOCKOUT_SECONDS * 1000
    map[key] = st
    write(ATTEMPTS_KEY, map)
    logAccess(user?.username ?? username.trim(), 'Bloqueo')
    return { ok: false, reason: 'locked', remainingSeconds: LOCKOUT_SECONDS }
  }
  map[key] = st
  write(ATTEMPTS_KEY, map)
  return { ok: false, reason: 'invalid', attemptsLeft: MAX_ATTEMPTS - st.attempts }
}

export async function logout(username: string): Promise<void> {
  logAccess(username, 'Salida')
}

// ---------------------------------------------------------------- registro
export interface RegisterInput {
  fullName: string
  username: string
  email: string
  password: string
}

export type RegisterResult =
  | { ok: true; user: PublicUser }
  | { ok: false; field?: 'username' | 'email' | 'password'; message: string }

export async function register(input: RegisterInput): Promise<RegisterResult> {
  await delay(null, 400)
  const username = input.username.trim()
  const email = input.email.trim()

  // La política de contraseña se valida SIEMPRE aquí también, no solo en el formulario.
  const pwdError = validateNewPassword(input.password, username)
  if (pwdError) return { ok: false, field: 'password', message: pwdError }

  const users = getUsers()
  if (users.some((u) => norm(u.username) === norm(username))) {
    return { ok: false, field: 'username', message: 'Ese nombre de usuario ya está en uso.' }
  }
  if (users.some((u) => norm(u.email) === norm(email))) {
    return { ok: false, field: 'email', message: 'Ese correo ya está registrado.' }
  }

  const user: AppUser = {
    id: `USR-${String(users.length + 1).padStart(3, '0')}`,
    fullName: input.fullName.trim().replace(/\s+/g, ' '),
    username,
    email,
    // Principio de mínimo privilegio: toda cuenta nueva es "Empleado".
    role: 'Empleado',
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  }
  write(USERS_KEY, [...users, user])
  return { ok: true, user: toPublic(user) }
}

// ---------------------------------------------------------------- recuperar contraseña
interface ResetRequest {
  userId: string
  codeHash: string
  salt: string
  expiresAt: number
  tries: number
}
// Solo en memoria: al recargar la página, la solicitud se pierde (el código vence).
const resetRequests = new Map<string, ResetRequest>()
const MAX_CODE_TRIES = 5

export interface ForgotResult {
  /**
   * Código de 6 dígitos. SOLO se devuelve porque aún no hay servidor de correo:
   * en producción el código llega por email y nunca se envía al navegador.
   * Es `undefined` si la cuenta no existe (la respuesta de la interfaz es igual).
   */
  demoCode?: string
  expiresInMinutes: number
}

export async function requestPasswordReset(identifier: string): Promise<ForgotResult> {
  await delay(null, 500)
  const user = findByIdentifier(identifier)
  if (!user) return { expiresInMinutes: RESET_CODE_MINUTES }

  const arr = new Uint32Array(1)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(arr)
  else arr[0] = Math.floor(Math.random() * 4294967295)
  const code = String(arr[0] % 1000000).padStart(6, '0')
  const salt = randomSalt(8)

  resetRequests.set(norm(identifier), {
    userId: user.id,
    codeHash: sha256(salt + code),
    salt,
    expiresAt: Date.now() + RESET_CODE_MINUTES * 60 * 1000,
    tries: 0,
  })
  // También se registra bajo el usuario y el correo, para aceptar cualquiera de los dos.
  resetRequests.set(norm(user.username), resetRequests.get(norm(identifier))!)
  resetRequests.set(norm(user.email), resetRequests.get(norm(identifier))!)
  return { demoCode: code, expiresInMinutes: RESET_CODE_MINUTES }
}

export type ResetResult = { ok: true } | { ok: false; field?: 'code' | 'password'; message: string }

export async function resetPassword(identifier: string, code: string, newPassword: string): Promise<ResetResult> {
  await delay(null, 500)
  const genericError: ResetResult = { ok: false, field: 'code', message: 'Código inválido o vencido. Solicita uno nuevo.' }

  const req = resetRequests.get(norm(identifier))
  const user = findByIdentifier(identifier)
  if (!req || !user || req.userId !== user.id) return genericError
  if (Date.now() > req.expiresAt || req.tries >= MAX_CODE_TRIES) {
    resetRequests.delete(norm(identifier))
    return genericError
  }
  if (sha256(req.salt + code.trim()) !== req.codeHash) {
    req.tries += 1
    return genericError
  }

  const pwdError = validateNewPassword(newPassword, user.username)
  if (pwdError) return { ok: false, field: 'password', message: pwdError }
  if (verifyPassword(newPassword, user.passwordHash)) {
    return { ok: false, field: 'password', message: 'La nueva contraseña debe ser distinta a la actual.' }
  }

  const users = getUsers().map((u) => (u.id === user.id ? { ...u, passwordHash: hashPassword(newPassword) } : u))
  write(USERS_KEY, users)
  // El código es de un solo uso y se desbloquea la cuenta.
  for (const k of [user.username, user.email, identifier]) resetRequests.delete(norm(k))
  clearAttempts(user.username)
  clearAttempts(user.email)
  return { ok: true }
}

// ---------------------------------------------------------------- consulta del log
export async function getAccessLog(): Promise<AccessLogEntry[]> {
  return delay(read<AccessLogEntry[]>(LOG_KEY, []), 150)
}

export const authService = {
  login,
  logout,
  register,
  requestPasswordReset,
  resetPassword,
  getAccessLog,
  getLockState,
}
