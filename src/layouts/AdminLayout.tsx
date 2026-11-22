import { Outlet, useLocation } from 'react-router-dom'
import { useUiStore } from '@/stores/ui.store'
import { canAccess } from '@/utils/permissions'
import ForbiddenView from '@/views/ForbiddenView'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminDrawer from '@/components/layout/AdminDrawer'
import AdminHeader from '@/components/layout/AdminHeader'
import DemoScenarioBar from '@/components/layout/DemoScenarioBar'

export default function AdminLayout() {
  const role = useUiStore((s) => s.role)
  const { pathname } = useLocation()
  // Permisos por rol: si el rol no puede ver la ruta, se muestra "Acceso denegado".
  const allowed = canAccess(role, pathname)

  return (
    <div className="flex min-h-screen bg-ink-50/60">
      <AdminSidebar />
      <AdminDrawer />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader />
        <DemoScenarioBar />
        <main className="fade-in flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {allowed ? <Outlet /> : <ForbiddenView />}
        </main>
      </div>
    </div>
  )
}
