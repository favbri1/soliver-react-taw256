import type { Costume } from '@/types'

/** Un traje está activo mientras no tenga fecha de eliminación lógica. */
export function isCostumeActive(c: Costume): boolean {
  return !c.deletedAt
}
