/**
 * TODAY CLASSES COMPONENT
 *
 * Muestra todas las clases registradas hoy.
 *
 * Características:
 * - Lista de clases del día
 * - Información de usuario y coach
 * - Notas del coach
 * - Auto-actualización cada 30 segundos
 */

'use client'

import { useState, useEffect } from 'react'
import { Calendar, User, AlertCircle } from 'lucide-react'
import attendancesService from '@/app/services/attendances/attendances.service'
import type { ClassAttendance } from '@/app/interfaces/attendance.interface'

export function TodayClasses() {
  const [classes, setClasses] = useState<ClassAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTodayClasses()
    const interval = setInterval(loadTodayClasses, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadTodayClasses = async () => {
    try {
      const data = await attendancesService.getTodayClasses()
      setClasses(data)
      setError('')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error loading classes:', err)
      setError('Error al cargar clases del día')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (datetime: string) => {
    const date = new Date(datetime)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Clases de Hoy</h2>
        <div className="text-gray-500">Cargando clases...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Clases de Hoy</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Clases de Hoy</h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {classes.length} {classes.length === 1 ? 'clase' : 'clases'}
        </span>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-8">
          <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No hay clases registradas hoy</p>
        </div>
      ) : (
        <div className="space-y-3">
  {classes.map((classItem) => (
    <div
      key={classItem.id}
      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-500">
              {formatTime(classItem.entranceDatetime)}
            </span>
            <span className="text-gray-300">|</span>
           
            <h3 className="font-semibold text-gray-900">
              {classItem.class?.name || 'Clase no disponible'}
            </h3>
          </div>
         
          {classItem.class?.description && (
            <p className="text-xs text-gray-500 mb-1">
              {classItem.class.description}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={14} />
           
            <span>{classItem.user?.fullName || 'Usuario no disponible'}</span>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Coach:</span> {classItem.coach?.fullName || 'Coach no asignado'}
      </div>

      {classItem.notes && (
        <div className="bg-gray-50 rounded p-2 text-sm text-gray-700">
          <span className="font-medium">Notas:</span> {classItem.notes}
        </div>
      )}
    </div>
  ))}
</div>
      )}
    </div>
  )
}
