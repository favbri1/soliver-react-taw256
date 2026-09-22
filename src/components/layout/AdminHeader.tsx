import { Bell, Menu, Search } from 'lucide-react'
import { useUiStore } from '@/stores/ui.store'
import { usePageTitle } from '@/router/titles'

export default function AdminHeader() {
  const adminName = useUiStore((s) => s.adminName)
  const openDrawer = useUiStore((s) => s.openDrawer)
  const pageTitle = usePageTitle()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-ink-100 bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button className="focus-ring rounded-lg p-2 hover:bg-ink-50 lg:hidden" onClick={openDrawer}>
          <Menu className="h-5 w-5 text-ink-900" />
        </button>
        <div>
          <p className="text-xs text-ink-400">SOLIVER</p>
          <p className="font-display text-lg font-semibold leading-none text-ink-900">{pageTitle}</p>
        </div>
      </div>

      <div className="hidden max-w-sm flex-1 items-center gap-2 rounded-full border border-ink-100 bg-ink-50/60 px-3 py-2 text-sm text-ink-400 md:flex">
        <Search className="h-4 w-4" />
        <span>Buscar reservas, clientes, trajes…</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="focus-ring relative rounded-full p-2 hover:bg-ink-50">
          <Bell className="h-5 w-5 text-ink-900" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-wine-500 text-[10px] font-semibold text-white">
            3
          </span>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 font-display text-sm font-semibold text-gold-500">
            {adminName.charAt(0)}
          </div>
          <span className="hidden text-sm font-medium text-ink-900 sm:block">{adminName}</span>
        </div>
      </div>
    </header>
  )
}
