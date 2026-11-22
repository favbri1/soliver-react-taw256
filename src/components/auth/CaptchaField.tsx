import { RefreshCw } from 'lucide-react'
import type { CaptchaChallenge } from '@/utils/captcha'

interface Props {
  challenge: CaptchaChallenge
  value: string
  onChange: (value: string) => void
  onRefresh: () => void
  error?: string
}

/** CAPTCHA de texto distorsionado (simulado en el navegador). */
export default function CaptchaField({ challenge, value, onChange, onRefresh, error }: Props) {
  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-ink-400">Verificación (CAPTCHA)</span>
      <div className="flex items-center gap-2">
        <svg
          role="img"
          aria-label="Imagen CAPTCHA con caracteres distorsionados"
          viewBox={`0 0 ${challenge.width} ${challenge.height}`}
          width={challenge.width}
          height={challenge.height}
          className="select-none rounded-lg border border-ink-200 bg-gold-500/10"
        >
          {challenge.lines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth="1.2" opacity="0.55" />
          ))}
          {challenge.dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r="1" fill="#0B0B0B" opacity="0.35" />
          ))}
          {challenge.glyphs.map((g, i) => (
            <text
              key={i}
              x={g.x}
              y={g.y}
              fontSize={g.size}
              fontWeight="700"
              fontFamily="ui-monospace, Menlo, Consolas, monospace"
              fill={g.color}
              transform={`rotate(${g.rotate} ${g.x} ${g.y})`}
            >
              {g.ch}
            </text>
          ))}
        </svg>
        <button
          type="button"
          onClick={onRefresh}
          className="focus-ring rounded-lg border border-ink-200 p-2.5 text-ink-600 hover:border-ink-900/40"
          aria-label="Generar otro código"
          title="Generar otro código"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        maxLength={8}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        aria-invalid={!!error}
        placeholder="Escribe los caracteres de la imagen"
        className={`focus-ring mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal ${
          error ? 'border-wine-500' : 'border-ink-200'
        }`}
      />
      {error ? <p className="mt-1 text-xs text-wine-600">{error}</p> : null}
    </div>
  )
}
