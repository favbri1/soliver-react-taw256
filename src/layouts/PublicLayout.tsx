import { Outlet } from 'react-router-dom'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      <PublicHeader />
      <main className="fade-in flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
