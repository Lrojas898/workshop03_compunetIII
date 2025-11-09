/**
 * MY CLASSES HISTORY COMPONENT
 *
 * Muestra el historial de clases registradas por el coach.
 *
 * Características:
 * - Lista de clases registradas
 * - Información detallada de cada clase
 * - Ordenadas por fecha descendente
 */

'use client'

import { useState, useEffect } from 'react'
import { History, User, AlertCircle, Calendar } from 'lucide-react'
import attendancesService from '@/app/services/attendances/attendances.service'
import type { ClassAttendance } from '@/app/interfaces/attendance.interface'

export function MyClassesHistory() {
  const [classes, setClasses] = useState<ClassAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    loadMyClasses()
  }, [])

  const loadMyClasses = async () => {
    try {
      const data = await attendancesService.getMyClasses()
      setClasses(data)
      setError('')
    } catch (err: any) {
      console.error('Error loading my classes:', err)
      setError('Error al cargar historial de clases')
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const displayedClasses = showAll ? classes : classes.slice(0, 5)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <History size={20} />
          Mis Clases Registradas
        </h2>
        <div className="text-gray-500">Cargando historial...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <History size={20} />
          Mis Clases Registradas
        </h2>
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
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <History size={20} />
          Mis Clases Registradas
        </h2>
        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
          Total: {classes.length}
        </span>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-8">
          <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No has registrado clases aún</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayedClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{classItem.class.name}</h3>
                    {classItem.class.description && (
                      <p className="text-xs text-gray-500 mb-1">{classItem.class.description}</p>
                    )}
                    <div className="text-sm text-gray-500">
                      {formatDateTime(classItem.entranceDatetime)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <User size={14} />
                  <span>{classItem.user.fullName}</span>
                  <span className="text-gray-400">({classItem.user.email})</span>
                </div>

                {classItem.notes && (
                  <div className="bg-blue-50 rounded p-2 text-sm text-gray-700">
                    <span className="font-medium">Notas:</span> {classItem.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {classes.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 w-full text-blue-600 hover:text-blue-700 text-sm font-medium py-2 hover:bg-blue-50 rounded transition-colors"
            >
              {showAll ? 'Ver menos' : `Ver todas (${classes.length})`}
            </button>
          )}
        </>
      )}
    </div>
  )
}
