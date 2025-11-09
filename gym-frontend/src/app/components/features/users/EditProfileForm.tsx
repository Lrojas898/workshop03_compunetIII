/**
 * EDIT PROFILE FORM
 *
 * Formulario para que los usuarios editen su propia información
 */

'use client'

import { useState, FormEvent, useEffect } from 'react'
import { Button } from '@/app/components/ui/Button'
import type { User, UpdateUserDto } from '@/app/interfaces/auth.interface'

interface EditProfileFormProps {
  user: User
  onSubmit: (data: UpdateUserDto) => Promise<void>
  onCancel: () => void
}

export function EditProfileForm({ user, onSubmit, onCancel }: EditProfileFormProps) {
  const [formData, setFormData] = useState<UpdateUserDto>({
    fullName: user.fullName || '',
    email: user.email || '',
    age: user.age || 0,
    password: '' // Solo se actualiza si se proporciona
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Actualizar el formulario si cambia el usuario
  useEffect(() => {
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      age: user.age || 0,
      password: ''
    })
  }, [user])

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

      await onSubmit(dataToSend)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error actualizando perfil')
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
          value={formData.age || ''}
          onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
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

      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={loading} className="flex-1">
          Guardar Cambios
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

