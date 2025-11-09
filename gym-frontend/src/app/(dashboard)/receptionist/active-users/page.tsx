/**
 * ACTIVE USERS PAGE
 *
 * Página que muestra usuarios actualmente en el gimnasio.
 *
 * Características:
 * - Lista en tiempo real de usuarios en el gimnasio
 * - Tiempo de permanencia
 * - Opción de check-out manual
 * - Solo accesible para rol RECEPTIONIST
 */

'use client'

import { useState, useEffect } from 'react'
import { Users, Clock, UserX, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import attendancesService from '@/app/services/attendances/attendances.service'
import type { Attendance } from '@/app/interfaces/attendance.interface'

export default function ActiveUsersPage() {
  const [activeUsers, setActiveUsers] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadActiveUsers()
  }, [])

  const loadActiveUsers = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await attendancesService.getActive()
      setActiveUsers(data)
    } catch (err: any) {
      console.error('Error loading active users:', err)
      setError(err.response?.data?.message || 'Error al cargar usuarios activos')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async (userId: string, userName: string) => {
    setError('')
    setSuccess('')
    setActionLoading(userId)

    try {
      await attendancesService.checkOut({ userId })
      setSuccess(`Check-out exitoso para ${userName}`)

      // Recargar lista
      await loadActiveUsers()
    } catch (err: any) {
      console.error('Error during check-out:', err)
      setError(err.response?.data?.message || 'Error al registrar salida')
    } finally {
      setActionLoading(null)
    }
  }

  const calculateDuration = (entranceTime: string) => {
    const entrance = new Date(entranceTime)
    const now = new Date()
    const diffMs = now.getTime() - entrance.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) {
      return `${diffMins} min`
    }

    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return `${hours}h ${mins}m`
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios Activos en el Gimnasio</h1>
          <p className="text-gray-600 mt-1">
            {loading ? 'Cargando...' : `${activeUsers.length} usuario${activeUsers.length !== 1 ? 's' : ''} actualmente en el gimnasio`}
          </p>
        </div>
        <Button onClick={loadActiveUsers} disabled={loading}>
          <RefreshCw size={18} />
          Actualizar
        </Button>
      </div>

      {/* Mensajes */}
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

      {/* Lista de usuarios */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Cargando usuarios activos...</p>
        </div>
      ) : activeUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 text-lg font-medium">No hay usuarios en el gimnasio</p>
          <p className="text-gray-400 text-sm mt-1">Los usuarios que hagan check-in aparecerán aquí</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora de Entrada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiempo Transcurrido
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeUsers.map((attendance) => (
                <tr key={attendance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {attendance.user.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {attendance.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      attendance.type === 'gym'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {attendance.type === 'gym' ? 'Gimnasio' : 'Clase'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Clock size={14} className="mr-1 text-gray-400" />
                      {formatTime(attendance.entranceDatetime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {calculateDuration(attendance.entranceDatetime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      onClick={() => handleCheckOut(attendance.user.id, attendance.user.fullName)}
                      isLoading={actionLoading === attendance.user.id}
                      variant="danger"
                      disabled={actionLoading !== null}
                    >
                      <UserX size={16} />
                      Check-Out
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
