import type { Client } from '@/types'
import { clients as mockClients } from '@/mocks/clients'
import { delay } from '@/utils/async'

// Reemplazar por: GET /api/clients, GET /api/clients/:id

export const clientService = {
  async getClients(): Promise<Client[]> {
    return delay([...mockClients], 200)
  },
  async getClientById(id: string): Promise<Client | undefined> {
    return delay(mockClients.find((c) => c.id === id), 150)
  },
}
