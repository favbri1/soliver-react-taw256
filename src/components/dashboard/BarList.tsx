import type { MonthlyPoint } from '@/types'

interface Props {
  data: MonthlyPoint[]
  color?: string
  format?: (v: number) => string
}

export default function BarList({ data, color, format }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="grid grid-cols-[7rem_1fr_auto] items-center gap-3 sm:grid-cols-[9rem_1fr_auto]">
          <span className="truncate text-xs text-ink-600">{d.label}</span>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(d.value / max) * 100}%`, background: color || '#A30D1D' }}
            />
          </div>
          <span className="text-xs font-semibold text-ink-900">{format ? format(d.value) : d.value}</span>
        </div>
      ))}
    </div>
  )
}
