/**
 * REGISTER CLASS ATTENDANCE COMPONENT
 *
 * Componente para que coaches registren asistencia a clases.
 *
 * Características:
 * - Selector de usuario
 * - Campo de nombre de clase
 * - Campo de notas opcional
 * - Validación de pases disponibles
 */

'use client'

import { useState, useEffect } from 'react'
import { UserCheck, AlertCircle } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import authenticationService from '@/app/services/auth/authentication.service'
import attendancesService from '@/app/services/attendances/attendances.service'
import classesService from '@/app/services/classes/classes.service'
import { useAuthStore } from '@/app/_store/auth/auth.store'
import type { User } from '@/app/interfaces/auth.interface'
import type { Class } from '@/app/interfaces/classes.interface'

interface RegisterClassAttendanceProps {
  onSuccess?: () => void
}

export function RegisterClassAttendance({ onSuccess }: RegisterClassAttendanceProps) {
  const { user: currentUser } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedClassId, setSelectedClassId] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async () => {
    try {
      const [usersData, classesData] = await Promise.all([
        authenticationService.getAllUsers(),
        classesService.getActive(),
      ])

      const clients = usersData.filter((user: User) => {
        const isClient = user.roles?.some((role: any) => role.name === 'client')
        const isNotCurrentUser = !currentUser || user.id !== currentUser.id
        return isClient && isNotCurrentUser
      })

      setUsers(clients)
      setClasses(classesData)
    } catch (err: any) {
      console.error('Error loading data:', err)
      setError('Error al cargar datos')
    } finally {
      setDataLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación de seguridad: evitar auto-registro
    if (currentUser && currentUser.id === selectedUserId) {
      setError('❌ No puedes registrar asistencia para ti mismo')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await attendancesService.registerClass({
        userId: selectedUserId,
        classId: selectedClassId,
        notes: notes.trim() || undefined
      })

      setSuccess('Asistencia registrada exitosamente')
      setSelectedUserId('')
      setSelectedClassId('')
      setNotes('')

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      console.error('Error registering class:', err)
      setError(err.response?.data?.message || 'Error al registrar asistencia')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Registrar Asistencia a Clase</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
            Clase *
          </label>
          {dataLoading ? (
            <div className="text-gray-500 py-2">Cargando clases...</div>
          ) : (
            <select
              id="classId"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar clase...</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                  {classItem.description && ` - ${classItem.description}`}
                </option>
              ))}
            </select>
          )}
          {classes.length === 0 && !dataLoading && (
            <p className="text-xs text-amber-600 mt-1">
              No hay clases activas. Crea una clase primero en Gestión de Clases.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
            Usuario *
          </label>
          {dataLoading ? (
            <div className="text-gray-500 py-2">Cargando usuarios...</div>
          ) : (
            <select
              id="userId"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar usuario...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName} ({user.email})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observaciones sobre el desempeño del usuario..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <Button
          type="submit"
          isLoading={loading}
          disabled={dataLoading || classes.length === 0}
          className="w-full"
        >
          <UserCheck size={18} />
          Registrar Asistencia
        </Button>
      </form>
    </div>
  )
}
