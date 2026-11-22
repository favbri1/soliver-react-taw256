import { Link } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'
import { useUiStore } from '@/stores/ui.store'

/** Se muestra cuando el rol del usuario no tiene permiso para la ruta. */
export default function ForbiddenView() {
  const role = useUiStore((s) => s.role)
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-ink-200 bg-white/60 px-6 py-20 text-center">
      <ShieldOff className="h-10 w-10 text-wine-500" strokeWidth={1.5} />
      <p className="font-display text-2xl font-semibold text-ink-900">Acceso denegado</p>
      <p className="max-w-sm text-sm text-ink-400">
        Tu rol (<span className="font-semibold">{role}</span>) no tiene permiso para ver esta sección. Si lo necesitas,
        pídele a un administrador que amplíe tus permisos.
      </p>
      <Link to="/dashboard" className="btn-dark mt-2">
        Ir al dashboard
      </Link>
    </div>
  )
}
