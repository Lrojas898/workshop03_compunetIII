/**
 * USERS MANAGEMENT PAGE
 *
 * Página de gestión de usuarios del sistema.
 * Permite operaciones CRUD sobre usuarios y gestionar sus roles.
 *
 * Características:
 * - Listado de usuarios con búsqueda
 * - Ver detalles de usuarios
 * - Gestionar roles (agregar, remover, reemplazar)
 * - Eliminar usuarios
 * - Solo accesible para rol ADMIN
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Trash2, Shield, CheckCircle, Ban } from 'lucide-react'
import authenticationService from '@/app/services/auth/authentication.service'
import type { User } from '@/app/interfaces/auth.interface'
import { RolesBadge } from '@/app/components/features/users/RolesBadge'
import { RoleManagementModal } from '@/app/components/features/users/RoleManagementModal'

export default function UsersManagementPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await authenticationService.getAllUsers()
      setUsers(data)
    } catch (err) {
      console.error('Error loading users:', err)
      setError('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/${userId}`)
  }

  const handleOpenRoleModal = (user: User) => {
    setSelectedUser(user)
    setIsRoleModalOpen(true)
  }

  const handleRolesUpdated = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))
    setSelectedUser(null)
    setIsRoleModalOpen(false)
  }

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'desactivar' : 'activar'
    const user = users.find(u => u.id === userId)

    if (!confirm(`¿Estás seguro de que deseas ${action} a ${user?.fullName}?`)) return

    try {
      const updatedUser = await authenticationService.toggleUserActive(userId, !currentStatus)
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))
    } catch (error: any) {
      console.error(`Error ${action}ing user:`, error)
      const errorMsg = error.response?.data?.message || `Error al ${action} usuario`
      alert(errorMsg)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId)

    // Primera confirmación
    if (!confirm(`⚠️ ADVERTENCIA: Estás a punto de ELIMINAR PERMANENTEMENTE a ${user?.fullName}.\n\nEsta acción NO se puede deshacer y eliminará:\n- Todos los datos del usuario\n- Su historial de asistencias\n- Sus suscripciones\n\n¿Estás COMPLETAMENTE seguro?`)) return

    // Segunda confirmación
    const confirmText = prompt(`Para confirmar, escribe el nombre completo del usuario: "${user?.fullName}"`)
    if (confirmText !== user?.fullName) {
      alert('Nombre incorrecto. Eliminación cancelada.')
      return
    }

    try {
      await authenticationService.deleteUser(userId)
      setUsers(users.filter(u => u.id !== userId))
      alert('Usuario eliminado permanentemente')
    } catch (error: any) {
      console.error('Error deleting user:', error)
      const errorMsg = error.response?.data?.message || 'Error al eliminar usuario'
      alert(errorMsg)
    }
  }

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Administra usuarios del sistema y sus roles</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Cargando usuarios...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No se encontraron usuarios
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Edad
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Roles
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Estado
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                      <div>
                        <div>{user.fullName}</div>
                        <div className="sm:hidden text-xs text-gray-500 mt-1">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                      {user.email}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                      {user.age}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                      <RolesBadge roles={user.roles} />
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm font-medium">
                      <div className="flex gap-2 sm:gap-3">
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Ver detalles"
                        >
                          <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        <button
                          onClick={() => handleOpenRoleModal(user)}
                          className="text-purple-600 hover:text-purple-800 transition"
                          title="Gestionar roles"
                        >
                          <Shield size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        {user.isActive ? (
                          <button
                            onClick={() => handleToggleActive(user.id, user.isActive)}
                            className="text-yellow-600 hover:text-yellow-800 transition"
                            title="Desactivar usuario"
                          >
                            <Ban size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleActive(user.id, user.isActive)}
                            className="text-green-600 hover:text-green-800 transition"
                            title="Activar usuario"
                          >
                            <CheckCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Eliminar usuario permanentemente"
                        >
                          <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Management Modal */}
      {selectedUser && (
        <RoleManagementModal
          user={selectedUser}
          isOpen={isRoleModalOpen}
          onClose={() => {
            setIsRoleModalOpen(false)
            setSelectedUser(null)
          }}
          onRolesUpdated={handleRolesUpdated}
          allUsers={users}
        />
      )}
    </div>
  )
}
