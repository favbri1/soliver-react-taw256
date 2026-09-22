import { Presentation } from 'lucide-react'
import { useUiStore } from '@/stores/ui.store'
import { demoScenarios } from '@/mocks/demoScenarios'

export default function DemoScenarioBar() {
  const demoScenario = useUiStore((s) => s.demoScenario)
  const setScenario = useUiStore((s) => s.setScenario)

  return (
    <div className="flex items-center gap-3 overflow-x-auto border-b border-ink-100 bg-white px-4 py-2.5 sm:px-6 lg:px-8">
      <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
        <Presentation className="h-3.5 w-3.5" />
        Modo demostración
      </div>
      <div className="flex gap-2">
        {demoScenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`focus-ring shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              demoScenario === s.id ? 'border-wine-500 bg-wine-500 text-white' : 'border-ink-200 text-ink-600 hover:border-ink-900/30'
            }`}
            onClick={() => setScenario(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
