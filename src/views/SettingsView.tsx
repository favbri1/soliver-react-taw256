import { useState } from 'react'
import { Bell, Building2, CreditCard, PackageCheck, Shield, User, Wrench } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'

const sections = [
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'negocio', label: 'Negocio', icon: Building2 },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { id: 'alquileres', label: 'Alquileres', icon: PackageCheck },
  { id: 'reservas', label: 'Reservas', icon: Shield },
  { id: 'pagos', label: 'Pagos', icon: CreditCard },
  { id: 'sistema', label: 'Sistema', icon: Wrench },
]

export default function SettingsView() {
  const [active, setActive] = useState('perfil')

  return (
    <div>
      <PageHeader eyebrow="Sistema" title="Configuración" description="Ajustes generales de la plataforma (maqueta de demostración)." />

      <div className="grid gap-4 lg:grid-cols-[14rem_1fr]">
        <nav className="card p-2">
          {sections.map((s) => (
            <button
              key={s.id}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                active === s.id ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-50'
              }`}
              onClick={() => setActive(s.id)}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="card p-6">
          <p className="font-display text-xl font-semibold capitalize text-ink-900">{sections.find((s) => s.id === active)?.label}</p>
          <p className="mt-1 text-sm text-ink-400">Esta sección es parte de la maqueta y no persiste cambios todavía.</p>

          <div className="mt-6 space-y-4">
            <label className="block max-w-md">
              <span className="mb-1 block text-xs font-medium text-ink-400">Nombre</span>
              <input type="text" defaultValue="SOLIVER" className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm" disabled />
            </label>
            <label className="block max-w-md">
              <span className="mb-1 block text-xs font-medium text-ink-400">Correo de contacto</span>
              <input
                type="email"
                defaultValue="hola@soliver.bo"
                className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm"
                disabled
              />
            </label>
            <button className="btn-dark" disabled>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
