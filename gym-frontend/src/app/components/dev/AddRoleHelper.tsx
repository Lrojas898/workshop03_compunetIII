/**
 * ADD ROLE HELPER - DESARROLLO
 *
 * Componente temporal para agregar roles a usuarios.
 * Solo para desarrollo.
 */

'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/Button'

export function AddRoleHelper() {
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const addClientRoleToCoach = async () => {
    if (!userId) {
      setError('Por favor ingresa el ID del usuario')
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const token = localStorage.getItem('authToken')

      // Primero obtener el usuario actual
      const getUserResponse = await fetch(`http://localhost:4000/auth/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!getUserResponse.ok) {
        throw new Error('Usuario no encontrado')
      }

      const userData = await getUserResponse.json()
      const currentRoles = userData.roles.map((r: any) => r.name)

      // Agregar el rol client si no lo tiene
      if (!currentRoles.includes('client')) {
        const newRoles = [...currentRoles, 'client']

        const updateResponse = await fetch(`http://localhost:4000/auth/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ roles: newRoles })
        })

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json()
          throw new Error(errorData.message || 'Error al actualizar')
        }

        setMessage(`Rol 'client' agregado exitosamente. Por favor, cierra sesión y vuelve a iniciar sesión.`)
      } else {
        setMessage('El usuario ya tiene el rol client')
      }
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Error al agregar rol')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-purple-50 border-2 border-purple-400 rounded-lg p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-purple-900">Helper: Agregar Rol Client</h3>
        <p className="text-sm text-purple-700 mt-1">
          Herramienta temporal para agregar el rol 'client' a un usuario coach
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded mb-4 text-sm">
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-900 mb-1">
            User ID (UUID del coach)
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="ej: 550e8400-e29b-41d4-a716-446655440000"
            className="w-full px-3 py-2 border border-purple-300 rounded text-sm"
          />
          <p className="text-xs text-purple-600 mt-1">
            Encuentra el UUID en la consola del navegador o usando GET /auth
          </p>
        </div>

        <Button
          onClick={addClientRoleToCoach}
          isLoading={loading}
          className="w-full"
        >
          Agregar Rol Client
        </Button>
      </div>

      <div className="mt-4 p-3 bg-purple-100 rounded text-xs text-purple-800">
        <strong>Nota:</strong> Después de agregar el rol, debes cerrar sesión y volver a iniciar sesión para que los cambios se reflejen.
      </div>
    </div>
  )
}
