import { create } from 'zustand'
import type { DemoScenario, UserRole } from '@/types'

interface Toast {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

interface UiState {
  isAuthenticated: boolean
  adminName: string
  username: string
  role: UserRole
  sidebarCollapsed: boolean
  mobileDrawerOpen: boolean
  demoScenario: DemoScenario
  toasts: Toast[]
  login: (user: { username: string; fullName: string; role: UserRole }) => void
  logout: () => void
  toggleSidebar: () => void
  openDrawer: () => void
  closeDrawer: () => void
  setScenario: (scenario: DemoScenario) => void
  pushToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

let toastSeq = 1

export const useUiStore = create<UiState>((set, get) => ({
  isAuthenticated: false,
  adminName: 'Administrador SOLIVER',
  username: '',
  role: 'Empleado',
  sidebarCollapsed: false,
  mobileDrawerOpen: false,
  demoScenario: 'dia-normal',
  toasts: [],
  login: (user) => {
    // La verificación de credenciales la hace auth.service (simulado). Aquí solo
    // se guarda la sesión: nombre, usuario y rol (para los permisos de menú/rutas).
    set({ isAuthenticated: true, adminName: user.fullName, username: user.username, role: user.role })
  },
  logout: () => set({ isAuthenticated: false, username: '', role: 'Empleado', mobileDrawerOpen: false }),
  toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
  openDrawer: () => set({ mobileDrawerOpen: true }),
  closeDrawer: () => set({ mobileDrawerOpen: false }),
  setScenario: (scenario) => set({ demoScenario: scenario }),
  pushToast: (message, type = 'success') => {
    const id = toastSeq++
    set({ toasts: [...get().toasts, { id, type, message }] })
    setTimeout(() => {
      set({ toasts: get().toasts.filter((t) => t.id !== id) })
    }, 3500)
  },
}))
