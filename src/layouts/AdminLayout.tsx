import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminDrawer from '@/components/layout/AdminDrawer'
import AdminHeader from '@/components/layout/AdminHeader'
import DemoScenarioBar from '@/components/layout/DemoScenarioBar'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-ink-50/60">
      <AdminSidebar />
      <AdminDrawer />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader />
        <DemoScenarioBar />
        <main className="fade-in flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
