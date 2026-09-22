import { NavLink, useLocation } from 'react-router-dom'
import { useUiStore } from '@/stores/ui.store'
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
]

export default function AdminDrawer() {
  const mobileDrawerOpen = useUiStore((s) => s.mobileDrawerOpen)
  const closeDrawer = useUiStore((s) => s.closeDrawer)
  const location = useLocation()

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
          {items.map((item) => {
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
      </div>
    </div>
  )
}
