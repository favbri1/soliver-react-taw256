import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  actions?: ReactNode
  children?: ReactNode
}

export default function ChartCard({ title, subtitle, actions, children }: Props) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">{title}</p>
          {subtitle && <p className="text-xs text-ink-400">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  )
}
