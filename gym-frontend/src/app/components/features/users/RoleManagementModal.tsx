/**
 * ROLE MANAGEMENT MODAL
 *
 * Modal para gestionar roles de un usuario.
 * Los roles seleccionados en los checkboxes serán los nuevos roles del usuario.
 *
 * Características:
 * - Validación para evitar remover el último admin
 * - Checkboxes para seleccionar roles
 * - Un solo botón de submit para actualizar roles
 * - Manejo de errores y estados de carga
 */

'use client'

import { useState } from 'react'
import { X, AlertCircle, CheckCircle } from 'lucide-react'
import { User, Role } from '@/app/interfaces/auth.interface'
import { ValidRoles } from '@/lib/configuration/api-endpoints'
import authenticationService from '@/app/services/auth/authentication.service'

interface RoleManagementModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onRolesUpdated: (updatedUser: User) => void
  allUsers?: User[]
}

export function RoleManagementModal({
  user,
  isOpen,
  onClose,
  onRolesUpdated,
  allUsers = [],
}: RoleManagementModalProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    user.roles.map((r) => r.name)
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const allAvailableRoles = Object.values(ValidRoles)

  const isLastAdmin =
    allUsers.length > 0 &&
    user.roles.some((r) => r.name === ValidRoles.ADMIN) &&
    allUsers.filter((u) => u.roles.some((r) => r.name === ValidRoles.ADMIN))
      .length === 1

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    // Validar que haya al menos un rol seleccionado
    if (selectedRoles.length === 0) {
      setError('Debe seleccionar al menos un rol')
      return
    }

    // Validar si intenta remover el último admin
    const removingAdmin = user.roles.some((r) => r.name === ValidRoles.ADMIN) &&
      !selectedRoles.includes(ValidRoles.ADMIN)

    if (removingAdmin && isLastAdmin) {
      setError('No puedes remover el rol admin del único administrador del sistema')
      return
    }

    setLoading(true)
    try {
      const updatedUser = await authenticationService.assignRoles(
        user.id,
        selectedRoles as ValidRoles[]
      )
      setSuccess('Roles actualizados exitosamente')
      setTimeout(() => {
        onRolesUpdated(updatedUser)
        onClose()
      }, 1500)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al actualizar roles'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Gestionar Roles</h2>
            <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none">{user.fullName}</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* Current Roles */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Roles Actuales:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {user.roles.length > 0 ? (
                user.roles.map((role) => (
                  <span
                    key={role.id}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300"
                  >
                    {role.name}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">Sin roles asignados</span>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Role Selection */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Seleccionar Roles:</h3>
            <div className="space-y-2">
              {allAvailableRoles.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={() => handleRoleToggle(role)}
                    disabled={loading}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Warning */}
          {isLastAdmin && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                ⚠️ Este es el único administrador del sistema. No puedes remover el rol admin.
              </p>
            </div>
          )}
        </div>

        {/* Footer - Action Buttons */}
        <div className="p-4 sm:p-6 border-t border-gray-200 space-y-2 sm:space-y-3">
          {/* Submit Roles Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Actualizando...' : 'Actualizar Roles'}
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
