/**
 * CHECK-IN PAGE
 *
 * Página para registrar entrada y salida de usuarios.
 *
 * Características:
 * - Lista de clientes con búsqueda en tiempo real
 * - Filtrado por nombre o email
 * - Registro de check-in
 * - Registro de check-out
 * - Validación de membresía activa
 * - Muestra asistencias disponibles
 * - Solo accesible para rol RECEPTIONIST
 */

'use client'

import { useState, useEffect } from 'react'
import { Search, UserCheck, UserX, Calendar, CreditCard, AlertCircle, ArrowLeft, Users, Mail } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import authenticationService from '@/app/services/auth/authentication.service'
import attendancesService from '@/app/services/attendances/attendances.service'
import type { User } from '@/app/interfaces/auth.interface'
import { AttendanceStatus, AttendanceType } from '@/app/interfaces/attendance.interface'

export default function CheckInPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [allClients, setAllClients] = useState<User[]>([])
  const [filteredClients, setFilteredClients] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userStatus, setUserStatus] = useState<AttendanceStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  // Recepción siempre registra tipo gimnasio, las clases las registra el coach
  const attendanceType = AttendanceType.GYM

  // Cargar todos los clientes al inicio
  useEffect(() => {
    loadClients()
  }, [])

  // Filtrar clientes en tiempo real
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredClients(allClients)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = allClients.filter(client =>
        client.fullName.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query)
      )
      setFilteredClients(filtered)
    }
  }, [searchQuery, allClients])

  const loadClients = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Obtener todos los usuarios
      const users = await authenticationService.getAllUsers()
      
      // Filtrar solo clientes
      const currentUserStr = localStorage.getItem('userData')
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null
      
      const clients = users.filter(user => {
        const userRole = user.roles[0]?.name
        // Solo clientes activos y que no sea el recepcionista actual
        return userRole === 'client' && user.id !== currentUser?.id && user.isActive === true
      })
      
      setAllClients(clients)
      setFilteredClients(clients)
    } catch (err: any) {
      console.error('Error loading clients:', err)
      setError('Error al cargar la lista de clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = async (user: User) => {
    setError('')
    setSuccess('')
    setLoading(true)
    setSelectedUser(user)

    try {
      // Obtener estado de asistencia del usuario
      const status = await attendancesService.getStatus(user.id)
      setUserStatus(status)
    } catch (statusError) {
      console.error('Error getting status:', statusError)
      // Si hay error al obtener status, asumimos que no está dentro
      setUserStatus({
        isInside: false,
        availableAttendances: { gym: 0, classes: 0 }
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBackToList = () => {
    setSelectedUser(null)
    setUserStatus(null)
    setError('')
    setSuccess('')
    setSearchQuery('')
  }

  const handleCheckIn = async () => {
    if (!selectedUser) return

    // Validación de seguridad adicional antes de check-in
    const currentUserStr = localStorage.getItem('userData')
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr)
      if (currentUser.id === selectedUser.id) {
        setError('❌ No puedes registrar asistencia para ti mismo')
        return
      }
    }

    const userRole = selectedUser.roles[0]?.name
    if (userRole !== 'client') {
      setError(`❌ Solo los clientes pueden registrar asistencias`)
      return
    }

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

      setSuccess(`✅ Check-in exitoso para ${selectedUser.fullName}`)

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

      {/* Mensajes globales */}
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

      {/* Vista condicional: Lista de clientes o detalle del usuario */}
      {!selectedUser ? (
        // VISTA DE LISTA DE CLIENTES
        <div className="bg-white rounded-lg shadow">
          {/* Barra de búsqueda */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-blue-600" size={24} />
              <h2 className="text-lg font-semibold text-gray-900">Clientes Registrados</h2>
              <span className="ml-auto bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {filteredClients.length} {filteredClients.length === 1 ? 'cliente' : 'clientes'}
              </span>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Lista de clientes */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
                <p className="mt-4 text-gray-600">Cargando clientes...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 text-lg">
                  {searchQuery ? 'No se encontraron clientes con ese criterio' : 'No hay clientes registrados'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleSelectUser(client)}
                    className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {client.fullName}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                          <Mail size={14} />
                          <span className="truncate">{client.email}</span>
                        </div>
                      </div>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        client.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {client.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    
                    {client.age && (
                      <p className="text-sm text-gray-500">
                        {client.age} años
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // VISTA DE DETALLE DEL USUARIO SELECCIONADO
        <div>
          {/* Botón volver */}
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-medium transition"
          >
            <ArrowLeft size={20} />
            Volver a la lista
          </button>

          {userStatus && (
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
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Nota:</strong> La recepción registra entradas al gimnasio. Las clases las registra el coach.
                    </p>
                  </div>

                  <Button
                    onClick={handleCheckIn}
                    isLoading={actionLoading}
                    disabled={!selectedUser.isActive}
                    className="w-full"
                  >
                    <UserCheck size={18} />
                    Registrar Entrada al Gimnasio
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
      )}
    </div>
  )
}
