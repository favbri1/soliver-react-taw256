import { NavLink, useLocation } from 'react-router-dom'
import { useUiStore } from '@/stores/ui.store'
import logo from '@/assets/logo.png'
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
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

const groups = [
  {
    title: 'Inicio',
    items: [{ label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Catálogo',
    items: [
      { label: 'Trajes', to: '/admin/trajes', icon: Shirt },
      { label: 'Inventario', to: '/inventario', icon: Boxes },
    ],
  },
  {
    title: 'Operaciones',
    items: [
      { label: 'Reservas', to: '/reservas', icon: CalendarCheck },
      { label: 'Calendario', to: '/calendario', icon: CalendarDays },
      { label: 'Alquileres', to: '/alquileres', icon: Package },
      { label: 'Devoluciones', to: '/devoluciones', icon: Undo2 },
    ],
  },
  {
    title: 'Negocio',
    items: [
      { label: 'Clientes', to: '/clientes', icon: Users },
      { label: 'Pagos', to: '/pagos', icon: Wallet },
      { label: 'Reportes', to: '/reportes', icon: BarChart3 },
    ],
  },
  {
    title: 'Sistema',
    items: [{ label: 'Configuración', to: '/configuracion', icon: Settings }],
  },
]

export default function AdminSidebar() {
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const location = useLocation()

  return (
    <aside
      className={`hidden shrink-0 flex-col border-r border-ink-800 bg-ink-900 text-white transition-all duration-300 lg:flex ${
        sidebarCollapsed ? 'w-[76px]' : 'w-64'
      }`}
    >
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
          <img src={logo} alt="Logo SOLIVER" className="h-full w-full object-cover" />
        </div>
        {!sidebarCollapsed && <span className="font-display text-lg font-semibold tracking-wide">SOLIVER</span>}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.title}>
            {!sidebarCollapsed && (
              <p className="tracking-widest2 mb-2 px-2 text-[10px] font-semibold uppercase text-white/35">{group.title}</p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = location.pathname === item.to
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`focus-ring group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active ? 'bg-white/10 text-gold-500' : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                    {sidebarCollapsed && (
                      <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-ink-900 px-2 py-1 text-xs opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity group-hover:opacity-100">
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <button
        type="button"
        className="focus-ring flex items-center gap-2 border-t border-white/10 px-4 py-4 text-xs text-white/60 hover:text-white"
        onClick={toggleSidebar}
      >
        {!sidebarCollapsed ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
        {!sidebarCollapsed && <span>Contraer</span>}
      </button>
    </aside>
  )
}
