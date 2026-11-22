import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ADMIN_GATE_ROUTE, isAdminGateOpen } from '@/config/adminAccess'

/**
 * Protege las pantallas de autenticación del personal (/login, /registro,
 * /recuperar-contrasena): si no se superó la contraseña de acceso administrativo,
 * redirige a la pantalla que la solicita. Escribir la URL a mano no la evita.
 */
export default function RequireAdminGate() {
  const location = useLocation()
  if (!isAdminGateOpen()) {
    return (
      <Navigate
        to={ADMIN_GATE_ROUTE}
        replace
        state={{
          from: location.pathname,
          // Se conserva a dónde quería ir el usuario después del login.
          redirect: (location.state as { redirect?: string } | null)?.redirect,
        }}
      />
    )
  }
  return <Outlet />
}
