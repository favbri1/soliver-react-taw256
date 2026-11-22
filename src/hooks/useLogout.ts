import { useNavigate } from 'react-router-dom'
import { useUiStore } from '@/stores/ui.store'
import { authService } from '@/services/auth.service'
import { closeAdminGate } from '@/config/adminAccess'

/**
 * Cierra la sesión, registra la "Salida" en el log de accesos, vuelve a exigir la
 * contraseña de acceso administrativo y regresa al catálogo público.
 */
export function useLogout() {
  const navigate = useNavigate()
  const username = useUiStore((s) => s.username)
  const logout = useUiStore((s) => s.logout)
  const pushToast = useUiStore((s) => s.pushToast)

  return async function doLogout() {
    await authService.logout(username)
    logout()
    closeAdminGate()
    pushToast('Sesión cerrada correctamente.', 'info')
    navigate('/', { replace: true })
  }
}
