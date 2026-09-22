import type { Client } from '@/types'

export const clients: Client[] = [
  {
    id: 'CLI-001',
    name: 'María López',
    phone: '+591 700 12345',
    email: 'maria.lopez@example.com',
    documentId: '5551234 LP',
    totalRentals: 6,
    activeReservations: 1,
    status: 'Activo',
    since: '2024-03-12',
  },
  {
    id: 'CLI-002',
    name: 'Jorge Quispe',
    phone: '+591 700 22981',
    email: 'jorge.quispe@example.com',
    documentId: '4432109 LP',
    totalRentals: 3,
    activeReservations: 1,
    status: 'Activo',
    since: '2025-01-08',
  },
  {
    id: 'CLI-003',
    name: 'Comparsa Los Caporales del Sur',
    phone: '+591 700 55123',
    email: 'contacto@caporalesdelsur.org',
    documentId: 'NIT 887766011',
    totalRentals: 24,
    activeReservations: 3,
    status: 'Activo',
    since: '2022-06-01',
  },
  {
    id: 'CLI-004',
    name: 'Andrea Fernández',
    phone: '+591 700 88213',
    email: 'andrea.fernandez@example.com',
    documentId: '6678321 LP',
    totalRentals: 1,
    activeReservations: 0,
    status: 'Nuevo',
    since: '2026-08-30',
  },
  {
    id: 'CLI-005',
    name: 'Ricardo Mamani',
    phone: '+591 700 90456',
    email: 'ricardo.mamani@example.com',
    documentId: '3321098 LP',
    totalRentals: 5,
    activeReservations: 0,
    status: 'Moroso',
    since: '2023-11-20',
  },
  {
    id: 'CLI-006',
    name: 'Fraternidad Illimani Dorado',
    phone: '+591 700 33771',
    email: 'admin@illimanidorado.org',
    documentId: 'NIT 990112233',
    totalRentals: 40,
    activeReservations: 5,
    status: 'Activo',
    since: '2021-05-15',
  },
]

export function getClientById(id: string): Client | undefined {
  return clients.find((c) => c.id === id)
}
