import type { ReactNode } from 'react'

interface Props {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ eyebrow, title, description, actions }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">{title}</h1>
        {description && <p className="mt-1 max-w-xl text-sm text-ink-400">{description}</p>}
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  )
}
