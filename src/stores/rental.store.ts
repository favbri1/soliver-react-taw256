import { create } from 'zustand'
import type { Rental } from '@/types'
import { rentalService } from '@/services/rental.service'

interface State {
  items: Rental[]
  loading: boolean
  fetchRentals: () => Promise<void>
}

export const useRentalStore = create<State>((set) => ({
  items: [],
  loading: false,
  fetchRentals: async () => {
    set({ loading: true })
    try {
      const items = await rentalService.getRentals()
      set({ items })
    } finally {
      set({ loading: false })
    }
  },
}))
