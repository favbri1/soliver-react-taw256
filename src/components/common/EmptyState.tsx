import type { ReactNode } from 'react'
import { PackageSearch } from 'lucide-react'

interface Props {
  title?: string
  message?: string
  children?: ReactNode
}

export default function EmptyState({
  title = 'Sin resultados',
  message = 'No hay información para mostrar por ahora.',
  children,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-ink-200 bg-white/60 py-16 text-center">
      <PackageSearch className="h-8 w-8 text-ink-200" strokeWidth={1.5} />
      <p className="font-display text-lg text-ink-900">{title}</p>
      <p className="max-w-sm text-sm text-ink-400">{message}</p>
      {children}
    </div>
  )
}
