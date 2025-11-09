/**
 * DASHBOARD LAYOUT
 *
 * Layout compartido para todas las páginas del dashboard.
 * Incluye navegación lateral (Sidebar) y barra superior (Navbar).
 *
 * Características:
 * - Sidebar con navegación basada en rol
 * - Navbar con información del usuario
 * - Protección de rutas (requiere autenticación)
 * - Diseño responsive
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Users, CreditCard, FileText, TrendingUp, UserCheck, ShoppingBag, Calendar, ClipboardList } from 'lucide-react'
import type { User } from '@/app/interfaces/auth.interface'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const userDataStr = localStorage.getItem('userData')
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr)
        setCurrentUser(userData)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('rememberMe')
    router.push('/login')
  }

  // Determinar el rol principal del usuario
  const userRole = currentUser?.roles?.[0]?.name || 'user'

  // Navegación para admin
  const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Usuarios', icon: Users },
    { href: '/admin/memberships', label: 'Membresías', icon: CreditCard },
    { href: '/admin/subscriptions', label: 'Suscripciones', icon: FileText },
    { href: '/admin/attendances', label: 'Asistencias', icon: ClipboardList },
    { href: '/admin/analytics', label: 'Analítica', icon: TrendingUp },
  ]

  // Navegación para recepcionista
  const receptionistNavItems = [
    { href: '/receptionist', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/receptionist/check-in', label: 'Check-In / Check-Out', icon: UserCheck },
    { href: '/receptionist/active-users', label: 'Usuarios Activos', icon: Users },
  ]

  // Navegación para cliente
  const clientNavItems = [
    { href: '/client', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/client/memberships', label: 'Membresías Disponibles', icon: ShoppingBag },
    { href: '/client/my-subscription', label: 'Mi Suscripción', icon: CreditCard },
    { href: '/client/my-attendance', label: 'Mis Asistencias', icon: Calendar },
  ]

  // Seleccionar navegación según el rol
  const navItems =
    userRole === 'admin' ? adminNavItems :
    userRole === 'receptionist' ? receptionistNavItems :
    clientNavItems

  const sidebarTitle =
    userRole === 'admin' ? 'Panel Administrativo' :
    userRole === 'receptionist' ? 'Panel de Recepción' :
    'Mi Panel Personal'

  const userRoleLabel =
    userRole === 'admin' ? 'Administrador' :
    userRole === 'receptionist' ? 'Recepcionista' :
    'Cliente'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Gym Manager
          </Link>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <p className="font-medium">{currentUser?.fullName || userRoleLabel}</p>
              <p className="text-xs text-gray-500">{userRoleLabel}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-gray-900 text-white min-h-screen">
          <nav className="p-6 space-y-2">
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {sidebarTitle}
              </h2>
            </div>

            {navItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  <IconComponent size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
