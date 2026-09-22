import { create } from 'zustand'
import type { DemoScenario } from '@/types'

interface Toast {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

interface UiState {
  isAuthenticated: boolean
  adminName: string
  sidebarCollapsed: boolean
  mobileDrawerOpen: boolean
  demoScenario: DemoScenario
  toasts: Toast[]
  login: (username: string) => void
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
  sidebarCollapsed: false,
  mobileDrawerOpen: false,
  demoScenario: 'dia-normal',
  toasts: [],
  login: (username) => {
    // Autenticación simulada: cualquier credencial no vacía ingresa al panel.
    set({ isAuthenticated: true, adminName: username || 'Administrador SOLIVER' })
  },
  logout: () => set({ isAuthenticated: false }),
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
