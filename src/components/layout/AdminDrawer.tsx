import { NavLink, useLocation } from 'react-router-dom'
import { useUiStore } from '@/stores/ui.store'
import { canAccess } from '@/utils/permissions'
import { useLogout } from '@/hooks/useLogout'
import {
  LayoutDashboard,
  Shirt,
  Boxes,
  CalendarCheck,
  CalendarDays,
  Package,
  Undo2,
  Users,
  Wallet,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  X,
} from 'lucide-react'

const items = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Trajes', to: '/admin/trajes', icon: Shirt },
  { label: 'Inventario', to: '/inventario', icon: Boxes },
  { label: 'Reservas', to: '/reservas', icon: CalendarCheck },
  { label: 'Calendario', to: '/calendario', icon: CalendarDays },
  { label: 'Alquileres', to: '/alquileres', icon: Package },
  { label: 'Devoluciones', to: '/devoluciones', icon: Undo2 },
  { label: 'Clientes', to: '/clientes', icon: Users },
  { label: 'Pagos', to: '/pagos', icon: Wallet },
  { label: 'Reportes', to: '/reportes', icon: BarChart3 },
  { label: 'Configuración', to: '/configuracion', icon: Settings },
  { label: 'Accesos', to: '/admin/accesos', icon: ShieldCheck },
]

export default function AdminDrawer() {
  const mobileDrawerOpen = useUiStore((s) => s.mobileDrawerOpen)
  const closeDrawer = useUiStore((s) => s.closeDrawer)
  const role = useUiStore((s) => s.role)
  const adminName = useUiStore((s) => s.adminName)
  const doLogout = useLogout()
  const location = useLocation()
  const visibleItems = items.filter((i) => canAccess(role, i.to))

  if (!mobileDrawerOpen) return null

  return (
    <div className="fade-in fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={closeDrawer} />
      <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-ink-900 text-white shadow-xl">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <span className="font-display text-lg font-semibold tracking-wide">SOLIVER</span>
          <button className="focus-ring rounded-full p-1.5 hover:bg-white/10" onClick={closeDrawer}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.to
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${active ? 'bg-white/10 text-gold-500' : 'text-white/70'}`}
                onClick={closeDrawer}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <p className="truncate px-3 text-xs text-white/50">
            {adminName} · {role}
          </p>
          <button
            type="button"
            onClick={() => {
              closeDrawer()
              doLogout()
            }}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
