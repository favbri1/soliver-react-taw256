// ============================================================================
// ACCESO ADMINISTRATIVO PREVIO — configuración centralizada
//
// Antes de llegar al login/registro del personal, la persona debe introducir esta
// contraseña de acceso. Para cambiarla, edita SOLO la constante de abajo.
//
// ⚠️ Esto NO es seguridad real: no hay backend, así que la contraseña viaja dentro
// del código del frontend y cualquiera con conocimientos técnicos puede verla.
// Es solo una barrera de acceso para el prototipo. La autenticación y autorización
// reales (JWT, roles, etc.) las implementará NestJS; entonces esta barrera se puede
// retirar o reemplazar por una validación en el servidor.
// ============================================================================

/** Contraseña de acceso administrativo (cámbiala aquí). */
export const ADMIN_ACCESS_PASSWORD = 'Soliver@2026'

/** Ruta de la pantalla que solicita la contraseña. */
export const ADMIN_GATE_ROUTE = '/acceso-administrativo'

/** Rutas de autenticación que solo se pueden abrir tras superar la barrera. */
export const ADMIN_AUTH_ROUTES = ['/login', '/registro', '/recuperar-contrasena']

const STORAGE_KEY = 'soliver_admin_gate'

// sessionStorage: la autorización dura mientras la pestaña esté abierta. Si el
// navegador lo bloquea (modo privado estricto), se usa una variable en memoria.
let memoryGranted = false

export function isAdminGateOpen(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'granted' || memoryGranted
  } catch {
    return memoryGranted
  }
}

/** Devuelve true (y abre la barrera) si la contraseña es correcta. */
export function tryOpenAdminGate(password: string): boolean {
  if (password !== ADMIN_ACCESS_PASSWORD) return false
  memoryGranted = true
  try {
    sessionStorage.setItem(STORAGE_KEY, 'granted')
  } catch {
    /* se mantiene solo en memoria */
  }
  return true
}

/** Vuelve a exigir la contraseña (se llama al cerrar sesión). */
export function closeAdminGate(): void {
  memoryGranted = false
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* nada que limpiar */
  }
}

/** Solo se permite volver a rutas de autenticación conocidas (evita redirecciones arbitrarias). */
export function safeAuthRoute(path: unknown): string {
  return typeof path === 'string' && ADMIN_AUTH_ROUTES.includes(path) ? path : '/login'
}
