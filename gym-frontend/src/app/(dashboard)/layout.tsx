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
import { AddRoleHelper } from '@/app/components/dev/AddRoleHelper'
import { ValidRoles } from '@/app/interfaces/valid-roles.enum'

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
        console.log('=== DEBUG: Usuario cargado ===')
        console.log('Datos completos:', userData)
        console.log('Roles del usuario:', userData.roles)
        console.log('Nombres de roles:', userData.roles?.map((r: any) => r.name))
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

  // Obtener todos los roles del usuario
  const userRoles: ValidRoles[] = currentUser?.roles?.map(role => role.name) || [];
  const hasRole = (role: ValidRoles) => userRoles.includes(role)

  // Debug: Mostrar roles en consola
  console.log('=== DEBUG: Roles detectados ===')
  console.log('Todos los roles:', userRoles)
  console.log('Tiene admin?', hasRole('admin'))
  console.log('Tiene coach?', hasRole('coach'))
  console.log('Tiene receptionist?', hasRole('receptionist'))
  console.log('Tiene client?', hasRole('client'))

  // Determinar el rol principal para el label (prioridad: admin > coach > receptionist > client)
  const primaryRole =
    hasRole('admin') ? 'admin' :
    hasRole('coach') ? 'coach' :
    hasRole('receptionist') ? 'receptionist' :
    'client'

  // Definir navegación por rol
  const adminNavItems = [
    { href: '/admin', label: 'Dashboard Admin', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Usuarios', icon: Users },
    { href: '/admin/memberships', label: 'Membresías', icon: CreditCard },
    { href: '/admin/subscriptions', label: 'Suscripciones', icon: FileText },
    { href: '/admin/attendances', label: 'Asistencias', icon: ClipboardList },
    { href: '/admin/classes', label: 'Gestión de Clases', icon: Calendar },
    { href: '/admin/analytics', label: 'Analítica', icon: TrendingUp },
  ]

  const coachNavItems = [
    { href: '/coach', label: 'Dashboard Coach', icon: LayoutDashboard },
    { href: '/coach/classes', label: 'Gestión de Clases', icon: Calendar },
    { href: '/coach/members', label: 'Mis Miembros', icon: Users },
  ]

  const receptionistNavItems = [
    { href: '/receptionist', label: 'Dashboard Recepción', icon: LayoutDashboard },
    { href: '/receptionist/check-in', label: 'Check-In / Check-Out', icon: UserCheck },
    { href: '/receptionist/active-users', label: 'Usuarios Activos', icon: Users },
  ]

  const clientNavItems = [
    { href: '/client', label: 'Mi Dashboard', icon: LayoutDashboard },
    { href: '/client/memberships', label: 'Membresías Disponibles', icon: ShoppingBag },
    { href: '/client/my-subscription', label: 'Mi Suscripción', icon: CreditCard },
    { href: '/client/my-attendance', label: 'Mis Asistencias', icon: Calendar },
  ]

  // Combinar navegación de todos los roles del usuario
  const navItems = [
    ...(hasRole('admin') ? adminNavItems : []),
    ...(hasRole('coach') ? coachNavItems : []),
    ...(hasRole('receptionist') ? receptionistNavItems : []),
    ...(hasRole('client') ? clientNavItems : []),
  ]

  const sidebarTitle = 'Gym Manager'

  // Mostrar todos los roles en el label principal
  const userRoleLabel = userRoles.length > 0
    ? userRoles.map(role => {
        switch (role) {
          case 'admin': return 'Administrador';
          case 'coach': return 'Coach';
          case 'receptionist': return 'Recepcionista';
          case 'client': return 'Cliente';
          default: return role;
        }
      }).join(', ')
    : 'Sin rol';

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
              <div className="flex items-center gap-1 mt-1">
                {userRoles.map((role, index) => (
                  <span key={role}>
                    <span className="text-xs text-gray-500 capitalize">{role}</span>
                    {index < userRoles.length - 1 && <span className="text-xs text-gray-400 mx-1">•</span>}
                  </span>
                ))}
              </div>
            </div>
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
        {/* Debug Panel - TEMPORAL */}
        {/* Panel de roles y helper eliminado para producción */}
        {/*
        {process.env.NODE_ENV === 'development' && currentUser && (
          <div className="fixed bottom-4 right-4 space-y-4 z-50 max-w-sm">
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 shadow-lg">
              ...panel de roles y helper...
            </div>
          </div>
        )}
        */}

        {/* Sidebar Navigation */}
        <aside className="w-64 bg-gray-900 text-white min-h-screen">
          <nav className="p-6 space-y-2">
            <div className="mb-8">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {sidebarTitle}
              </h2>
            </div>

            {/* Admin Section */}
            {hasRole('admin') && (
              <>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
                  Administración
                </div>
                {adminNavItems.map((item) => {
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
                {(hasRole('coach') || hasRole('receptionist') || hasRole('client')) && (
                  <div className="border-t border-gray-700 my-4" />
                )}
              </>
            )}

            {/* Coach Section */}
            {hasRole('coach') && (
              <>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
                  Coach
                </div>
                {coachNavItems.map((item) => {
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
                {(hasRole('receptionist') || hasRole('client')) && (
                  <div className="border-t border-gray-700 my-4" />
                )}
              </>
            )}

            {/* Receptionist Section */}
            {hasRole('receptionist') && (
              <>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
                  Recepción
                </div>
                {receptionistNavItems.map((item) => {
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
                {hasRole('client') && (
                  <div className="border-t border-gray-700 my-4" />
                )}
              </>
            )}

            {/* Client Section */}
            {hasRole('client') && (
              <>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
                  Mi Cuenta
                </div>
                {clientNavItems.map((item) => {
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
              </>
            )}
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
