/**
 * USER DETAIL PAGE
 *
 * Página de detalles de un usuario específico.
 * Permite ver información detallada del usuario y gestionar sus roles.
 *
 * Características:
 * - Ver información del usuario
 * - Gestionar roles del usuario
 * - Ver estado activo/inactivo
 * - Volver a lista de usuarios
 * - Solo accesible para rol ADMIN
 */

'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react'
import authenticationService from '@/app/services/auth/authentication.service'
import type { User } from '@/app/interfaces/auth.interface'
import { RolesBadge } from '@/app/components/features/users/RolesBadge'
import { RoleManagementModal } from '@/app/components/features/users/RoleManagementModal'

interface UserDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [user, setUser] = useState<User | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)

  useEffect(() => {
    fetchUserAndAllUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.id])

  const fetchUserAndAllUsers = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch specific user
      const userData = await authenticationService.getUserById(resolvedParams.id)
      setUser(userData)

      // Fetch all users for last admin validation
      const usersData = await authenticationService.getAllUsers()
      setAllUsers(usersData)
    } catch (err: unknown) {
      console.error('Error loading user:', err)
      const error = err as { response?: { data?: { message?: string } } }
      console.error('Error response:', error.response)
      setError(error.response?.data?.message || 'Error al cargar los datos del usuario')
    } finally {
      setLoading(false)
    }
  }

  const handleRolesUpdated = (updatedUser: User) => {
    setUser(updatedUser)
    setIsRoleModalOpen(false)
  }

  const handleGoBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="p-6">
        <button
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft size={20} />
          Volver
        </button>
        <div className="text-center text-gray-500">
          Cargando usuario...
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <button
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft size={20} />
          Volver
        </button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Usuario no encontrado'}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="mb-4 sm:mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
      >
        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base">Volver</span>
      </button>

      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{user.fullName}</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Detalles del usuario</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* User Information Card */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Información Personal</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">ID del Usuario</label>
              <p className="text-gray-900 mt-1 font-mono text-sm break-all">{user.id}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
              <p className="text-gray-900 mt-1">{user.fullName}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900 mt-1">{user.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Edad</label>
              <p className="text-gray-900 mt-1">{user.age} años</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Estado</label>
              <p className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Roles Card */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Roles Asignados</h2>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition"
              title="Gestionar roles"
            >
              <Shield size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Gestionar</span>
              <span className="sm:hidden">Roles</span>
            </button>
          </div>

          <div className="space-y-4">
            {user.roles.length > 0 ? (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Roles Actuales</label>
                  <RolesBadge roles={user.roles} />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Total:</strong> {user.roles.length} {user.roles.length === 1 ? 'rol' : 'roles'}
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Este usuario no tiene roles asignados. Asigna al menos el rol de cliente.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mt-4 sm:mt-6">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Información de Cuenta</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Fecha de Creación</label>
            <p className="text-gray-900 mt-1">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'No disponible'}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Última Actualización</label>
            <p className="text-gray-900 mt-1">
              {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('es-ES') : 'No disponible'}
            </p>
          </div>
        </div>
      </div>

      {/* Role Management Modal */}
      {user && (
        <RoleManagementModal
          user={user}
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          onRolesUpdated={handleRolesUpdated}
          allUsers={allUsers}
        />
      )}
    </div>
  )
}
