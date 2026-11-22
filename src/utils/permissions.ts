import type { UserRole } from '@/types'

// Permisos por rol. Las rutas que no aparecen aquí son accesibles para cualquier
// usuario autenticado. Con backend, esta misma regla debe aplicarse en NestJS
// (guards + decorador @Roles), porque ocultar el menú NO es seguridad real.
const RESTRICTED_ROUTES: Record<string, UserRole[]> = {
  '/admin/trajes': ['Administrador'],
  '/reportes': ['Administrador'],
  '/configuracion': ['Administrador'],
  '/admin/accesos': ['Administrador'],
}

export function canAccess(role: UserRole, path: string): boolean {
  const allowed = RESTRICTED_ROUTES[path]
  return !allowed || allowed.includes(role)
}
