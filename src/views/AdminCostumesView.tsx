import { useEffect, useMemo, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useInventoryStore } from '@/stores/inventory.store'
import { useUiStore } from '@/stores/ui.store'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import DataTable, { type ColumnDef } from '@/components/common/DataTable'
import CostumeFormModal from '@/components/admin/CostumeFormModal'
import EmptyState from '@/components/common/EmptyState'
import { CATEGORY_LABELS, type Costume } from '@/types'
import type { CostumeInput } from '@/services/inventory.service'
import { formatCurrency } from '@/utils/format'

// ============================================================
// ⚠️ CRUD SOLO EN MEMORIA (todavía no hay backend).
// Crear, editar y eliminar trajes modifica el arreglo mock en memoria
// a través de useInventoryStore. Los cambios se reflejan en toda la app
// mientras la pestaña siga abierta, pero SE PIERDEN al recargar (F5).
// Cuando exista la API, inventoryService hará el fetch real y esta vista
// no necesita cambios.
// ============================================================

export default function AdminCostumesView() {
  const costumes = useInventoryStore((s) => s.costumes)
  const loading = useInventoryStore((s) => s.loading)
  const saving = useInventoryStore((s) => s.saving)
  const fetchAll = useInventoryStore((s) => s.fetchAll)
  const createCostume = useInventoryStore((s) => s.createCostume)
  const updateCostume = useInventoryStore((s) => s.updateCostume)
  const deleteCostume = useInventoryStore((s) => s.deleteCostume)
  const pushToast = useUiStore((s) => s.pushToast)

  const [modalOpen, setModalOpen] = useState(false)
  /** null = modo crear; un traje = modo editar */
  const [editing, setEditing] = useState<Costume | null>(null)

  useEffect(() => {
    fetchAll()
  }, [])

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(costume: Costume) {
    setEditing(costume)
    setModalOpen(true)
  }

  async function handleSubmit(values: CostumeInput) {
    if (editing) {
      await updateCostume(editing.id, values)
      pushToast(`Traje "${values.name}" actualizado.`, 'success')
    } else {
      await createCostume(values)
      pushToast(`Traje "${values.name}" creado.`, 'success')
    }
    setModalOpen(false)
    setEditing(null)
  }

  async function handleDelete(costume: Costume) {
    // Confirmación previa antes de borrar.
    const ok = window.confirm(
      `¿Eliminar el traje "${costume.name}" (${costume.code})?\n\nEsta acción no se puede deshacer.`,
    )
    if (!ok) return
    await deleteCostume(costume.id)
    pushToast(`Traje "${costume.name}" eliminado.`, 'info')
  }

  // Las columnas dependen de los handlers, por eso se memorizan aquí dentro.
  const columns = useMemo<ColumnDef<Costume>[]>(
    () => [
      {
        key: 'code',
        label: 'Código',
        cell: (row) => <span className="font-mono text-xs text-ink-400">{row.code}</span>,
      },
      {
        key: 'name',
        label: 'Traje',
        cell: (row) => (
          <div className="flex items-center gap-3">
            <img src={row.images[0]?.url} alt={row.images[0]?.alt} className="h-10 w-10 rounded-lg object-cover" />
            <span className="font-medium text-ink-900">{row.name}</span>
          </div>
        ),
      },
      { key: 'category', label: 'Categoría', cell: (row) => CATEGORY_LABELS[row.category] },
      { key: 'rentalPrice', label: 'Precio', align: 'right', cell: (row) => formatCurrency(row.rentalPrice) },
      { key: 'availableSizes', label: 'Tallas', cell: (row) => row.availableSizes.join(' · ') },
      { key: 'status', label: 'Estado', cell: (row) => <StatusBadge status={row.status} /> },
      {
        key: 'actions',
        label: 'Acciones',
        align: 'right',
        cell: (row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => openEdit(row)}
              className="focus-ring inline-flex items-center gap-1 rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:border-ink-900/40"
            >
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </button>
            <button
              type="button"
              onClick={() => handleDelete(row)}
              className="focus-ring inline-flex items-center gap-1 rounded-lg border border-wine-500/30 px-2.5 py-1.5 text-xs font-medium text-wine-600 transition-colors hover:bg-wine-500/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar
            </button>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <div>
      <PageHeader
        eyebrow="Catálogo"
        title="Trajes"
        description="Administra el catálogo completo de trajes y conjuntos."
        actions={
          <button className="btn-dark" onClick={openCreate}>
            Nuevo traje
          </button>
        }
      />

      <p className="mb-4 rounded-lg bg-gold-500/10 px-3 py-2 text-xs text-ink-600">
        Modo demo: los trajes creados, editados o eliminados se guardan solo en memoria y se
        reinician al recargar la página.
      </p>

      {!loading && costumes.length === 0 ? (
        <EmptyState
          title="Sin trajes registrados"
          message="Empieza creando el primer traje del catálogo."
        />
      ) : (
        <DataTable columns={columns} rows={costumes} rowKey={(r) => r.id} />
      )}

      <CostumeFormModal
        open={modalOpen}
        costume={editing}
        saving={saving}
        onClose={() => {
          setModalOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
