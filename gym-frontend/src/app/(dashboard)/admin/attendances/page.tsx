/**
 * ATTENDANCES MANAGEMENT PAGE (ADMIN)
 *
 * Página para que el admin visualice todas las asistencias del gimnasio.
 *
 * Características:
 * - Ver todas las asistencias registradas
 * - Filtros por tipo, fecha y usuario
 * - Estadísticas generales
 * - Solo visualización (no permite check-in/check-out)
 * - Solo accesible para rol ADMIN
 */

'use client'

import { useState, useEffect } from 'react'
import { Calendar, Filter, Users, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import attendancesService from '@/app/services/attendances/attendances.service'
import type { Attendance, AttendanceType } from '@/app/interfaces/attendance.interface'

export default function AdminAttendancesPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterType, setFilterType] = useState<AttendanceType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadAttendances()
  }, [])

  const loadAttendances = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await attendancesService.getAll()
      // Ordenar por fecha más reciente primero
      const sorted = data.sort((a, b) => 
        new Date(b.entranceDatetime).getTime() - new Date(a.entranceDatetime).getTime()
      )
      setAttendances(sorted)
    } catch (err: any) {
      console.error('Error loading attendances:', err)
      setError(err.response?.data?.message || 'Error al cargar asistencias')
    } finally {
      setLoading(false)
    }
  }

  // Filtrar asistencias
  const filteredAttendances = attendances.filter(attendance => {
    const matchesType = filterType === 'all' || attendance.type === filterType
    const matchesSearch = searchTerm === '' || 
      attendance.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendance.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesType && matchesSearch
  })

  // Calcular estadísticas
  const stats = {
    total: attendances.length,
    gym: attendances.filter(a => a.type === 'gym').length,
    classes: attendances.filter(a => a.type === 'class').length,
    // Solo contar asistencias de gimnasio sin exitDatetime (las clases nunca tienen check-out)
    activeNow: attendances.filter(a => a.type === 'gym' && !a.exitDatetime).length,
    today: attendances.filter(a => {
      const today = new Date().toISOString().split('T')[0]
      const attendanceDate = new Date(a.entranceDatetime).toISOString().split('T')[0]
      return attendanceDate === today
    }).length
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateDuration = (entrance: string, exit?: string) => {
    if (!exit) return 'En progreso'

    const entranceTime = new Date(entrance).getTime()
    const exitTime = new Date(exit).getTime()
    const duration = Math.floor((exitTime - entranceTime) / 1000 / 60) // en minutos

    if (duration < 60) return `${duration} min`

    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    return `${hours}h ${minutes}m`
  }

  const getAttendanceStatus = (attendance: Attendance) => {
    // Para clases, siempre mostrar "Registrado"
    if (attendance.type === 'class') {
      return { label: 'Registrado', className: 'bg-purple-100 text-purple-800' }
    }

    // Para gimnasio, mostrar estado basado en exitDatetime
    if (!attendance.exitDatetime) {
      return { label: 'Dentro', className: 'bg-green-100 text-green-800' }
    }

    return { label: 'Salió', className: 'bg-gray-100 text-gray-800' }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Asistencias del Gimnasio</h1>
        <p className="text-gray-600 mt-1">Visualiza todas las asistencias registradas en el sistema</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <Calendar className="text-gray-400" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Hoy</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.today}</p>
            </div>
            <TrendingUp className="text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Dentro del Gym</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeNow}</p>
            </div>
            <Users className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Gimnasio</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.gym}</p>
            </div>
            <Clock className="text-purple-400" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Clases</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.classes}</p>
            </div>
            <Calendar className="text-orange-400" size={32} />
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda por usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por usuario
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre o email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de asistencia
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as AttendanceType | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="gym">Gimnasio</option>
              <option value="class">Clases</option>
            </select>
          </div>
        </div>

        {(filterType !== 'all' || searchTerm) && (
          <div className="mt-4">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => {
                setFilterType('all')
                setSearchTerm('')
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Tabla de asistencias */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Registro de Asistencias ({filteredAttendances.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">Cargando asistencias...</p>
            </div>
          ) : filteredAttendances.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No se encontraron asistencias</p>
            </div>
          ) : (
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
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendances.map((attendance) => (
                  <tr key={attendance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {attendance.user?.fullName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {attendance.user?.email || 'N/A'}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(attendance.entranceDatetime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(attendance.entranceDatetime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attendance.type === 'class'
                        ? '-'
                        : attendance.exitDatetime ? formatTime(attendance.exitDatetime) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attendance.type === 'class'
                        ? '-'
                        : calculateDuration(attendance.entranceDatetime, attendance.exitDatetime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const status = getAttendanceStatus(attendance)
                        return (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.className}`}>
                            {status.label}
                          </span>
                        )
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

