import type { MonthlyPoint } from '@/types'

interface Props {
  data: MonthlyPoint[]
  color?: string
}

const width = 560
const height = 180
const padding = 24

export default function LineTrend({ data, color }: Props) {
  const values = data.map((d) => d.value)
  const max = Math.max(...values)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1)
  const points = data.map((d, i) => {
    const x = padding + i * stepX
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2)
    return { x, y, ...d }
  })

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${path} L${points[points.length - 1]?.x ?? 0},${height - padding} L${points[0]?.x ?? 0},${height - padding} Z`
  const fillColor = color || '#D4A64A'

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={fillColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#trendFill)" />
      <path d={path} fill="none" stroke={fillColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill={fillColor} />
          <text x={p.x} y={height - 4} textAnchor="middle" className="fill-ink-400" fontSize="10">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
