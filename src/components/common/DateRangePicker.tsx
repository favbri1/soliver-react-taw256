interface Props {
  start: string
  end: string
  min?: string
  onChangeStart: (value: string) => void
  onChangeEnd: (value: string) => void
}

export default function DateRangePicker({ start, end, min, onChangeStart, onChangeEnd }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-400">Fecha de salida</span>
        <input
          type="date"
          min={min}
          value={start}
          className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900"
          onChange={(e) => onChangeStart(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-400">Fecha de devolución</span>
        <input
          type="date"
          min={start || min}
          value={end}
          className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900"
          onChange={(e) => onChangeEnd(e.target.value)}
        />
      </label>
    </div>
  )
}
