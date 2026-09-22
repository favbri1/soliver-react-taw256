import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { useUiStore } from '@/stores/ui.store'

export default function ToastHost() {
  const toasts = useUiStore((s) => s.toasts)

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((t) => (
        <div key={t.id} className="fade-in flex items-start gap-2 rounded-xl border border-ink-100 bg-white px-4 py-3 shadow-soft">
          {t.type === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
          {t.type === 'error' && <XCircle className="h-5 w-5 shrink-0 text-wine-500" />}
          {t.type === 'info' && <Info className="h-5 w-5 shrink-0 text-gold-600" />}
          <p className="text-sm text-ink-900">{t.message}</p>
        </div>
      ))}
    </div>
  )
}
