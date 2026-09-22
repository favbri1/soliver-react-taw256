import { useEffect, useState } from 'react'
import { X, Upload, Trash2 } from 'lucide-react'
import { CATEGORY_LABELS, type Costume, type CostumeCategory, type CostumeImage } from '@/types'
import type { CostumeInput } from '@/services/inventory.service'
import { sizes as SIZE_CATALOG } from '@/mocks/sizes'

// ⚠️ Sin backend: las imágenes que se suban por archivo se convierten en una
// URL local temporal con URL.createObjectURL(). Esa URL solo es válida en esta
// pestaña y deja de funcionar al recargar. Cuando exista el backend habrá que
// subir el archivo real (multipart) y guardar la URL definitiva que devuelva.

interface Props {
  open: boolean
  /** Si viene un traje, el modal trabaja en modo "editar"; si no, en modo "crear". */
  costume?: Costume | null
  saving?: boolean
  onClose: () => void
  onSubmit: (values: CostumeInput) => void
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as CostumeCategory[]

const EMPTY: CostumeInput = {
  name: '',
  category: 'Varon-Tropa',
  description: '',
  rentalPrice: 0,
  deposit: 0,
  availableSizes: [],
  images: [],
}

export default function CostumeFormModal({ open, costume, saving, onClose, onSubmit }: Props) {
  const isEdit = !!costume
  const [values, setValues] = useState<CostumeInput>(EMPTY)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')

  // Cada vez que se abre el modal, recargamos el formulario:
  // con los datos del traje (editar) o vacío (crear).
  useEffect(() => {
    if (!open) return
    setError('')
    setImageUrl('')
    if (costume) {
      setValues({
        name: costume.name,
        category: costume.category,
        description: costume.description,
        rentalPrice: costume.rentalPrice,
        deposit: costume.deposit,
        availableSizes: [...costume.availableSizes],
        images: [...costume.images],
        status: costume.status,
      })
    } else {
      setValues(EMPTY)
    }
  }, [open, costume])

  if (!open) return null

  function patch(changes: Partial<CostumeInput>) {
    setValues((v) => ({ ...v, ...changes }))
  }

  function toggleSize(code: string) {
    setValues((v) => ({
      ...v,
      availableSizes: v.availableSizes.includes(code)
        ? v.availableSizes.filter((s) => s !== code)
        : [...v.availableSizes, code],
    }))
  }

  function addImageFromUrl() {
    const url = imageUrl.trim()
    if (!url) return
    patch({ images: [...values.images, { url, alt: values.name || 'Traje SOLIVER' }] })
    setImageUrl('')
  }

  function addImagesFromFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    const nuevas: CostumeImage[] = Array.from(fileList).map((file) => ({
      // URL local temporal: no persiste tras recargar la página.
      url: URL.createObjectURL(file),
      alt: file.name,
    }))
    patch({ images: [...values.images, ...nuevas] })
  }

  function removeImage(index: number) {
    patch({ images: values.images.filter((_, i) => i !== index) })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!values.name.trim()) return setError('El nombre del traje es obligatorio.')
    if (values.rentalPrice <= 0) return setError('El precio de alquiler debe ser mayor a 0.')
    if (values.deposit < 0) return setError('El depósito no puede ser negativo.')
    if (values.availableSizes.length === 0) return setError('Selecciona al menos una talla disponible.')
    if (values.images.length === 0) return setError('Agrega al menos una imagen del traje.')
    setError('')
    onSubmit({ ...values, name: values.name.trim() })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-900/50 p-4 backdrop-blur-sm">
      <div className="card my-8 w-full max-w-2xl p-0">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <div>
            <p className="eyebrow">{isEdit ? 'Editar' : 'Nuevo'}</p>
            <h2 className="font-display text-xl font-semibold text-ink-900">
              {isEdit ? costume!.name : 'Registrar traje'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="focus-ring rounded-lg p-2 text-ink-400 hover:bg-ink-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-ink-700">Nombre del traje</span>
              <input
                value={values.name}
                onChange={(e) => patch({ name: e.target.value })}
                type="text"
                placeholder="Caporal Varón Tropa Clásico"
                className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-ink-700">Categoría</span>
              <select
                value={values.category}
                onChange={(e) => patch({ category: e.target.value as CostumeCategory })}
                className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-ink-700">Precio de alquiler (Bs.)</span>
              <input
                value={values.rentalPrice || ''}
                onChange={(e) => patch({ rentalPrice: Number(e.target.value) })}
                type="number"
                min={0}
                placeholder="180"
                className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-ink-700">Depósito de garantía (Bs.)</span>
              <input
                value={values.deposit || ''}
                onChange={(e) => patch({ deposit: Number(e.target.value) })}
                type="number"
                min={0}
                placeholder="300"
                className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm"
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink-700">Descripción</span>
            <textarea
              value={values.description}
              onChange={(e) => patch({ description: e.target.value })}
              rows={3}
              placeholder="Detalles del conjunto, bordados, acabados…"
              className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm"
            />
          </label>

          <div className="text-sm">
            <span className="mb-2 block font-medium text-ink-700">Tallas disponibles</span>
            <div className="flex flex-wrap gap-2">
              {SIZE_CATALOG.map((s) => {
                const active = values.availableSizes.includes(s.code)
                return (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => toggleSize(s.code)}
                    className={`focus-ring h-10 min-w-[2.75rem] rounded-lg border px-3 text-sm font-semibold transition-colors ${
                      active ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-ink-600 hover:border-ink-900/40'
                    }`}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="text-sm">
            <span className="mb-2 block font-medium text-ink-700">Imágenes</span>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                type="url"
                placeholder="https://… (pegar URL de imagen)"
                className="focus-ring w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm"
              />
              <button type="button" onClick={addImageFromUrl} className="btn-outline shrink-0">
                Agregar URL
              </button>
              <label className="btn-outline shrink-0 cursor-pointer">
                <Upload className="mr-1.5 h-4 w-4" />
                Subir archivo
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => addImagesFromFiles(e.target.files)}
                />
              </label>
            </div>

            {values.images.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {values.images.map((img, i) => (
                  <div key={`${img.url}-${i}`} className="relative">
                    <img src={img.url} alt={img.alt} className="h-20 w-20 rounded-lg border border-ink-100 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -right-1.5 -top-1.5 rounded-full bg-wine-500 p-1 text-white shadow"
                      aria-label="Quitar imagen"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-ink-400">Aún no agregaste imágenes.</p>
            )}
          </div>

          {error ? <p className="rounded-lg bg-wine-500/10 px-3 py-2 text-sm text-wine-600">{error}</p> : null}

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-dark" disabled={saving}>
              {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear traje'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
