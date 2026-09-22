interface Props {
  label: string
  value: number | string
  prefix?: string
  suffix?: string
  accent?: 'gold' | 'wine' | 'ink'
}

export default function MetricCard({ label, value, prefix, suffix, accent = 'ink' }: Props) {
  const accentClass = accent === 'gold' ? 'text-gold-600' : accent === 'wine' ? 'text-wine-500' : 'text-ink-900'
  return (
    <div className="card flex flex-col gap-3 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className={`font-display text-4xl font-semibold leading-none ${accentClass}`}>
        {prefix}
        {value}
        {suffix}
      </p>
    </div>
  )
}
