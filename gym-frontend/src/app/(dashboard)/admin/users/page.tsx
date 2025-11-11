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
import { Eye, Trash2, Shield } from 'lucide-react'
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

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return

    try {
      await authenticationService.deleteUser(userId)
      setUsers(users.filter(u => u.id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error al eliminar usuario')
    }
  }

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p className="text-gray-600 mt-1">Administra usuarios del sistema y sus roles</p>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Edad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RolesBadge roles={user.roles} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewUser(user.id)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenRoleModal(user)}
                          className="text-purple-600 hover:text-purple-800 transition"
                          title="Gestionar roles"
                        >
                          <Shield size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={18} />
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
