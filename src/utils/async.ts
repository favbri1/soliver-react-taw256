/**
 * Simula la latencia de una llamada de red real.
 * Cuando se reemplace MockService por una llamada REST,
 * este helper deja de ser necesario.
 */
export function delay<T>(value: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}
