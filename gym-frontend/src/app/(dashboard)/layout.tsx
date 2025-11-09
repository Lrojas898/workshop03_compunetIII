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
import { LayoutDashboard, Users, CreditCard, FileText, TrendingUp, UserCheck, ShoppingBag, Calendar, ClipboardList, UserCircle, LogOut, ChevronDown } from 'lucide-react'
import { Modal } from '@/app/components/ui/Modal'
import { EditProfileForm } from '@/app/components/features/users/EditProfileForm'
import authenticationService from '@/app/services/auth/authentication.service'
import type { User, UpdateUserDto } from '@/app/interfaces/auth.interface'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)

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

  // Cerrar el menú cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileMenuOpen) {
        const target = event.target as HTMLElement
        if (!target.closest('.profile-menu-container')) {
          setIsProfileMenuOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileMenuOpen])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('rememberMe')
    router.push('/login')
  }

  const handleEditProfile = async (data: UpdateUserDto) => {
    if (!currentUser) return

    try {
      const updatedUser = await authenticationService.updateUser(currentUser.id, data)
      
      // Actualizar el usuario en localStorage
      const updatedUserData = {
        ...currentUser,
        ...data
      }
      localStorage.setItem('userData', JSON.stringify(updatedUserData))
      setCurrentUser(updatedUserData)
      setIsEditProfileModalOpen(false)
      
      // Recargar la página para reflejar los cambios
      window.location.reload()
    } catch (error: any) {
      throw error
    }
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
          <div className="relative profile-menu-container">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <div className="text-right">
                <p className="font-medium">{currentUser?.fullName || userRoleLabel}</p>
                <p className="text-xs text-gray-500">{userRoleLabel}</p>
              </div>
              <ChevronDown size={16} className={`transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    setIsEditProfileModalOpen(true)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  <UserCircle size={18} />
                  <span>Editar Perfil</span>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
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

      {/* Modal de Edición de Perfil */}
      {currentUser && (
        <Modal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          title="Editar Mi Perfil"
          size="md"
        >
          <EditProfileForm
            user={currentUser}
            onSubmit={handleEditProfile}
            onCancel={() => setIsEditProfileModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  )
}
