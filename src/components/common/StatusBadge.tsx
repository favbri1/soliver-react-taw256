type Tone = 'green' | 'yellow' | 'red' | 'gray' | 'orange' | 'wine' | 'gold'

const map: Record<string, { label: string; tone: Tone }> = {
  Disponible: { label: 'Disponible', tone: 'green' },
  Reservado: { label: 'Reservado', tone: 'yellow' },
  Alquilado: { label: 'Alquilado', tone: 'red' },
  Limpieza: { label: 'En limpieza', tone: 'gray' },
  Reparacion: { label: 'En reparación', tone: 'orange' },
  Danado: { label: 'Dañado', tone: 'red' },
  Extraviado: { label: 'Extraviado', tone: 'gray' },
  Pendiente: { label: 'Pendiente', tone: 'yellow' },
  Confirmada: { label: 'Confirmada', tone: 'green' },
  Preparando: { label: 'Preparando', tone: 'orange' },
  Entregada: { label: 'Entregada', tone: 'wine' },
  EnAlquiler: { label: 'En alquiler', tone: 'red' },
  Devuelta: { label: 'Devuelta', tone: 'green' },
  Cancelada: { label: 'Cancelada', tone: 'gray' },
  Entregado: { label: 'Entregado', tone: 'wine' },
  Vencido: { label: 'Vencido', tone: 'red' },
  Completa: { label: 'Completa', tone: 'green' },
  ConRetraso: { label: 'Con retraso', tone: 'orange' },
  ConDanos: { label: 'Con daños', tone: 'red' },
  Incompleta: { label: 'Incompleta', tone: 'yellow' },
  Activo: { label: 'Activo', tone: 'green' },
  Nuevo: { label: 'Nuevo', tone: 'gold' },
  Moroso: { label: 'Moroso', tone: 'red' },
  Pagado: { label: 'Pagado', tone: 'green' },
  Parcial: { label: 'Parcial', tone: 'yellow' },
  Reembolsado: { label: 'Reembolsado', tone: 'gray' },
  Registrado: { label: 'Registrado', tone: 'green' },
  Devuelto: { label: 'Devuelto', tone: 'gray' },
  Aplicado: { label: 'Aplicado', tone: 'wine' },
}

const toneClasses: Record<Tone, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  yellow: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  red: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  gray: 'bg-ink-100 text-ink-600 ring-ink-900/10',
  orange: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  wine: 'bg-wine-50 text-wine-600 ring-wine-500/20',
  gold: 'bg-gold-50 text-gold-700 ring-gold-500/30',
}

const dotClasses: Record<Tone, string> = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-rose-500',
  gray: 'bg-ink-400',
  orange: 'bg-orange-500',
  wine: 'bg-wine-500',
  gold: 'bg-gold-500',
}

export default function StatusBadge({ status }: { status: string }) {
  const entry = map[status] ?? { label: status, tone: 'gray' as Tone }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${toneClasses[entry.tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotClasses[entry.tone]}`} />
      {entry.label}
    </span>
  )
}
