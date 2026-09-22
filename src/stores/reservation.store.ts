import { create } from 'zustand'
import type { Reservation } from '@/types'
import { reservationService } from '@/services/reservation.service'

interface State {
  items: Reservation[]
  loading: boolean
  fetchReservations: () => Promise<void>
}

export const useReservationStore = create<State>((set) => ({
  items: [],
  loading: false,
  fetchReservations: async () => {
    set({ loading: true })
    try {
      const items = await reservationService.getReservations()
      set({ items })
    } finally {
      set({ loading: false })
    }
  },
}))
