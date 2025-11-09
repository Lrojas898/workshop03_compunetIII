/**
 * EDIT USER FORM (ADMIN)
 *
 * Formulario para que el admin edite cualquier usuario
 */

'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/app/components/ui/Button'
import type { User, UpdateUserDto } from '@/app/interfaces/auth.interface'

interface EditUserFormProps {
  user: User
  onSubmit: (userId: string, data: UpdateUserDto) => Promise<void>
  onCancel: () => void
}

export function EditUserForm({ user, onSubmit, onCancel }: EditUserFormProps) {
  const [formData, setFormData] = useState<UpdateUserDto>({
    fullName: user.fullName,
    email: user.email,
    age: user.age,
    isActive: user.isActive,
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Si no se proporcionó password, no lo enviamos
      const dataToSend = { ...formData }
      if (!dataToSend.password) {
        delete dataToSend.password
      }

      await onSubmit(user.id, dataToSend)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error actualizando usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre Completo
        </label>
        <input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
          Edad
        </label>
        <input
          id="age"
          type="number"
          min="1"
          max="120"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Nueva Contraseña (opcional)
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
          placeholder="Dejar en blanco para mantener la actual"
          minLength={6}
        />
        {formData.password && formData.password.length < 6 && (
          <p className="text-xs text-red-600 mt-1">La contraseña debe tener al menos 6 caracteres</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="rounded"
          disabled={loading}
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">
          Usuario Activo
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={loading} className="flex-1">
          Actualizar Usuario
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

