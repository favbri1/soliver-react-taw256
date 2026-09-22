import { create } from 'zustand'
import type { Payment } from '@/types'
import { paymentService } from '@/services/payment.service'

interface State {
  items: Payment[]
  loading: boolean
  fetchPayments: () => Promise<void>
}

export const usePaymentStore = create<State>((set) => ({
  items: [],
  loading: false,
  fetchPayments: async () => {
    set({ loading: true })
    try {
      const items = await paymentService.getPayments()
      set({ items })
    } finally {
      set({ loading: false })
    }
  },
}))
