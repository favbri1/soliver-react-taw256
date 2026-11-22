import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useUiStore } from '@/stores/ui.store'
import ToastHost from '@/components/common/ToastHost'

import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout from '@/layouts/AdminLayout'

import CatalogView from '@/views/CatalogView'
import AboutView from '@/views/AboutView'
import FaqView from '@/views/FaqView'
import CostumeDetailView from '@/views/CostumeDetailView'
import ReservationFlowView from '@/views/ReservationFlowView'
import ReservationConfirmationView from '@/views/ReservationConfirmationView'
import MyReservationLookupView from '@/views/MyReservationLookupView'
import LoginView from '@/views/LoginView'
import RegisterView from '@/views/RegisterView'
import ForgotPasswordView from '@/views/ForgotPasswordView'
import AdminGateView from '@/views/AdminGateView'
import RequireAdminGate from '@/components/auth/RequireAdminGate'
import { ADMIN_GATE_ROUTE } from '@/config/adminAccess'

import DashboardView from '@/views/DashboardView'
import AdminCostumesView from '@/views/AdminCostumesView'
import InventoryView from '@/views/InventoryView'
import ReservationsView from '@/views/ReservationsView'
import CalendarView from '@/views/CalendarView'
import RentalsView from '@/views/RentalsView'
import ReturnsView from '@/views/ReturnsView'
import ClientsView from '@/views/ClientsView'
import PaymentsView from '@/views/PaymentsView'
import ReportsView from '@/views/ReportsView'
import SettingsView from '@/views/SettingsView'
import AccessLogView from '@/views/AccessLogView'

function ScrollToHash() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [location.pathname, location.hash])
  return null
}

/** Equivalente al router.beforeEach con meta.requiresAuth de Vue Router. */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useUiStore((s) => s.isAuthenticated)
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ redirect: location.pathname }} />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<CatalogView />} />
          <Route path="/sobre-nosotros" element={<AboutView />} />
          {/* Pregunta 5 — Ruta nueva conectada con Link desde el header público */}
          <Route path="/preguntas-frecuentes" element={<FaqView />} />
          <Route path="/trajes/:id" element={<CostumeDetailView />} />
          <Route path="/reservar/:id" element={<ReservationFlowView />} />
          <Route path="/reserva/:id" element={<ReservationConfirmationView />} />
          <Route path="/mi-reserva" element={<MyReservationLookupView />} />
        </Route>

        {/* Contraseña de acceso administrativo (barrera previa al login) */}
        <Route path={ADMIN_GATE_ROUTE} element={<AdminGateView />} />

        {/* Autenticación del personal: solo accesible tras superar la barrera */}
        <Route element={<RequireAdminGate />}>
          <Route path="/login" element={<LoginView />} />
          <Route path="/registro" element={<RegisterView />} />
          <Route path="/recuperar-contrasena" element={<ForgotPasswordView />} />
        </Route>

        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/admin/trajes" element={<AdminCostumesView />} />
          <Route path="/inventario" element={<InventoryView />} />
          <Route path="/reservas" element={<ReservationsView />} />
          <Route path="/calendario" element={<CalendarView />} />
          <Route path="/alquileres" element={<RentalsView />} />
          <Route path="/devoluciones" element={<ReturnsView />} />
          <Route path="/clientes" element={<ClientsView />} />
          <Route path="/pagos" element={<PaymentsView />} />
          <Route path="/reportes" element={<ReportsView />} />
          <Route path="/configuracion" element={<SettingsView />} />
          <Route path="/admin/accesos" element={<AccessLogView />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastHost />
    </>
  )
}
