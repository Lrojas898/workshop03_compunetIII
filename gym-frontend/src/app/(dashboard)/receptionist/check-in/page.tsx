/**
 * CHECK-IN PAGE
 *
 * Página para registrar entrada y salida de usuarios.
 *
 * Características:
 * - Búsqueda rápida de usuario por email
 * - Registro de check-in
 * - Registro de check-out
 * - Validación de membresía activa
 * - Muestra asistencias disponibles
 * - Solo accesible para rol RECEPTIONIST
 */

'use client'

import { useState } from 'react'
import { Search, UserCheck, UserX, Calendar, CreditCard, AlertCircle } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import authenticationService from '@/app/services/auth/authentication.service'
import attendancesService from '@/app/services/attendances/attendances.service'
import type { User } from '@/app/interfaces/auth.interface'
import type { AttendanceStatus, AttendanceType } from '@/app/interfaces/attendance.interface'

export default function CheckInPage() {
  const [searchEmail, setSearchEmail] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userStatus, setUserStatus] = useState<AttendanceStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [attendanceType, setAttendanceType] = useState<AttendanceType>('gym')

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      setError('Por favor ingresa un email')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)
    setSelectedUser(null)
    setUserStatus(null)

    try {
      // Buscar usuario por email
      const users = await authenticationService.getAllUsers()
      const user = users.find(u => u.email.toLowerCase() === searchEmail.toLowerCase())

      if (!user) {
        setError('Usuario no encontrado')
        return
      }

      setSelectedUser(user)

      // Obtener estado de asistencia del usuario
      try {
        const status = await attendancesService.getStatus(user.id)
        setUserStatus(status)
      } catch (statusError) {
        console.error('Error getting status:', statusError)
        // Si hay error al obtener status, asumimos que no está dentro
        setUserStatus({
          isInside: false,
          availableAttendances: { gym: 0, classes: 0 }
        })
      }
    } catch (err: any) {
      console.error('Error searching user:', err)
      setError(err.response?.data?.message || 'Error al buscar usuario')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    if (!selectedUser) return

    setError('')
    setSuccess('')
    setActionLoading(true)

    try {
      const now = new Date()
      const dateKey = now.toISOString().split('T')[0]

      await attendancesService.checkIn({
        userId: selectedUser.id,
        entranceDatetime: now.toISOString(),
        type: attendanceType as AttendanceType,
        dateKey
      })

      setSuccess(`Check-in exitoso para ${selectedUser.fullName}`)

      // Actualizar estado
      const status = await attendancesService.getStatus(selectedUser.id)
      setUserStatus(status)
    } catch (err: any) {
      console.error('Error during check-in:', err)
      setError(err.response?.data?.message || 'Error al registrar entrada')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!selectedUser) return

    setError('')
    setSuccess('')
    setActionLoading(true)

    try {
      await attendancesService.checkOut({
        userId: selectedUser.id
      })

      setSuccess(`Check-out exitoso para ${selectedUser.fullName}`)

      // Actualizar estado
      const status = await attendancesService.getStatus(selectedUser.id)
      setUserStatus(status)
    } catch (err: any) {
      console.error('Error during check-out:', err)
      setError(err.response?.data?.message || 'Error al registrar salida')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Check-In / Check-Out</h1>
        <p className="text-gray-600 mt-1">Registra la entrada y salida de usuarios al gimnasio</p>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Buscar Usuario</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ingresa el email del usuario..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <Button onClick={handleSearch} isLoading={loading}>
            <Search size={18} />
            Buscar
          </Button>
        </div>
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

      {/* Información del usuario */}
      {selectedUser && userStatus && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Usuario</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Nombre</p>
              <p className="mt-1 text-lg text-gray-900">{selectedUser.fullName}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1 text-lg text-gray-900">{selectedUser.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Estado en Gimnasio</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                userStatus.isInside ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {userStatus.isInside ? 'Dentro del gimnasio' : 'Fuera del gimnasio'}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Estado del Usuario</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                selectedUser.isActive ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
              }`}>
                {selectedUser.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          {/* Asistencias disponibles */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <CreditCard size={18} />
              Asistencias Disponibles
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-800">Gimnasio</p>
                <p className="text-2xl font-bold text-blue-900">{userStatus.availableAttendances.gym}</p>
              </div>
              <div>
                <p className="text-sm text-blue-800">Clases</p>
                <p className="text-2xl font-bold text-blue-900">{userStatus.availableAttendances.classes}</p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          {!userStatus.isInside ? (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Tipo de Asistencia</h3>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="gym"
                    checked={attendanceType === 'gym'}
                    onChange={(e) => setAttendanceType(e.target.value as AttendanceType)}
                    className="w-4 h-4"
                  />
                  <span>Gimnasio</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="class"
                    checked={attendanceType === 'class'}
                    onChange={(e) => setAttendanceType(e.target.value as AttendanceType)}
                    className="w-4 h-4"
                  />
                  <span>Clase</span>
                </label>
              </div>

              <Button
                onClick={handleCheckIn}
                isLoading={actionLoading}
                disabled={!selectedUser.isActive}
                className="w-full"
              >
                <UserCheck size={18} />
                Registrar Entrada
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleCheckOut}
              isLoading={actionLoading}
              variant="danger"
              className="w-full"
            >
              <UserX size={18} />
              Registrar Salida
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
