/**
 * USERS MANAGEMENT PAGE
 *
 * Página de gestión de usuarios del sistema.
 * Permite operaciones CRUD sobre usuarios.
 *
 * Características:
 * - Listado de usuarios
 * - Crear nuevos usuarios
 * - Ver detalles de usuarios
 * - Eliminar usuarios
 * - Solo accesible para rol ADMIN
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Eye, Trash2, Edit } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import { Table } from '@/app/components/ui/Table'
import { Modal } from '@/app/components/ui/Modal'
import { CreateUserForm } from '@/app/components/features/users/CreateUserForm'
import { EditUserForm } from '@/app/components/features/users/EditUserForm'
import authenticationService from '@/app/services/auth/authentication.service'
import type { User, RegisterDto, UpdateUserDto } from '@/app/interfaces/auth.interface'

export default function UsersManagementPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await authenticationService.getAllUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (data: RegisterDto) => {
    try {
      await authenticationService.register(data)
      setIsCreateModalOpen(false)
      loadUsers()
    } catch (error: any) {
      throw error
    }
  }

  const handleEditUser = async (userId: string, data: UpdateUserDto) => {
    try {
      await authenticationService.updateUser(userId, data)
      setIsEditModalOpen(false)
      setSelectedUser(null)
      loadUsers()
    } catch (error: any) {
      throw error
    }
  }

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await authenticationService.deleteUser(userId)
      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user')
    }
  }

  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/${userId}`)
  }

  const columns = [
    {
      key: 'fullName',
      header: 'Full Name'
    },
    {
      key: 'email',
      header: 'Email'
    },
    {
      key: 'age',
      header: 'Age'
    },
    {
      key: 'roles',
      header: 'Role',
      render: (user: User) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {user.roles[0]?.name || 'N/A'}
        </span>
      )
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (user: User) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewUser(user.id)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="View details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleOpenEditModal(user)}
            className="text-green-600 hover:text-green-800 p-1"
            title="Edit user"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete user"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and their permissions</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} />
          Create User
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          data={users}
          columns={columns}
          loading={loading}
          emptyMessage="No users found"
        />
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
        size="md"
      >
        <CreateUserForm
          onSubmit={handleCreateUser}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        title="Edit User"
        size="md"
      >
        {selectedUser && (
          <EditUserForm
            user={selectedUser}
            onSubmit={handleEditUser}
            onCancel={() => {
              setIsEditModalOpen(false)
              setSelectedUser(null)
            }}
          />
        )}
      </Modal>
    </div>
  )
}
