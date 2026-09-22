interface Props {
  sizes: string[]
  value: string | null
  onChange: (value: string) => void
}

export default function SizeSelector({ sizes, value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((s) => (
        <button
          key={s}
          type="button"
          className={`focus-ring h-11 min-w-[2.75rem] rounded-lg border px-3 text-sm font-semibold transition-colors ${
            value === s ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-ink-600 hover:border-ink-900/40'
          }`}
          onClick={() => onChange(s)}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
