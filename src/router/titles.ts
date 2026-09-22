import { useLocation, matchPath } from 'react-router-dom'

const TITLES: Record<string, string> = {
  '/': 'Catálogo',
  '/sobre-nosotros': 'Sobre nosotros',
  '/trajes/:id': 'Detalle del traje',
  '/reservar/:id': 'Reservar traje',
  '/reserva/:id': 'Reserva confirmada',
  '/mi-reserva': 'Mi reserva',
  '/login': 'Acceso administrativo',
  '/dashboard': 'Dashboard',
  '/admin/trajes': 'Trajes',
  '/inventario': 'Inventario',
  '/reservas': 'Reservas',
  '/calendario': 'Calendario',
  '/alquileres': 'Alquileres',
  '/devoluciones': 'Devoluciones',
  '/clientes': 'Clientes',
  '/pagos': 'Pagos',
  '/reportes': 'Reportes',
  '/configuracion': 'Configuración',
}

export function usePageTitle(): string {
  const location = useLocation()
  for (const pattern of Object.keys(TITLES)) {
    if (matchPath({ path: pattern, end: true }, location.pathname)) {
      return TITLES[pattern]
    }
  }
  return 'SOLIVER'
}
