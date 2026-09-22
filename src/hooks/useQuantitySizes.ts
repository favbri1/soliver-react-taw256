import { useCallback, useState } from 'react'

/**
 * Maneja la cantidad de unidades y la talla elegida para CADA unidad.
 * El arreglo `sizes` siempre mantiene exactamente `quantity` elementos:
 * al subir la cantidad se rellenan las nuevas posiciones con `defaultSize`,
 * y al bajarla se recortan las sobrantes conservando las ya elegidas.
 */
export function useQuantitySizes(defaultSize: string | null) {
  const [quantity, setQuantityState] = useState(1)
  const [sizes, setSizes] = useState<string[]>([])

  /** Reinicia todo cuando ya se conoce el traje (y por tanto su talla por defecto). */
  const reset = useCallback((size: string | null) => {
    setQuantityState(1)
    setSizes(size ? [size] : [])
  }, [])

  const setQuantity = useCallback(
    (next: number) => {
      setQuantityState(next)
      setSizes((prev) => {
        if (next <= prev.length) return prev.slice(0, next)
        const fill = prev[prev.length - 1] ?? defaultSize ?? ''
        return [...prev, ...Array(next - prev.length).fill(fill)]
      })
    },
    [defaultSize],
  )

  const setSizeAt = useCallback((index: number, size: string) => {
    setSizes((prev) => prev.map((s, i) => (i === index ? size : s)))
  }, [])

  return { quantity, sizes, setQuantity, setSizeAt, reset }
}

/** Agrupa las tallas elegidas para mostrarlas en el resumen: [{ size: 'M', count: 3 }, …] */
export function groupSizes(sizes: string[]): { size: string; count: number }[] {
  const map = new Map<string, number>()
  for (const s of sizes) map.set(s, (map.get(s) ?? 0) + 1)
  return Array.from(map, ([size, count]) => ({ size, count }))
}
