/**
 * MY SUBSCRIPTION PAGE
 *
 * Página donde el cliente puede ver su suscripción actual.
 *
 * Características:
 * - Membresía activa actual
 * - Cola de membresías pendientes
 * - Historial de membresías expiradas
 * - Asistencias disponibles
 * - Estado de activación
 * - Solo accesible para rol CLIENT
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Check, AlertCircle, ShoppingBag, Clock, CheckCircle2, XCircle } from 'lucide-react'
import subscriptionsService from '@/app/services/subscriptions/subscriptions.service'
import attendancesService from '@/app/services/attendances/attendances.service'
import type { Subscription } from '@/app/interfaces/subscriptions.interface'
import type { AttendanceStatus } from '@/app/interfaces/attendance.interface'

export default function MySubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSubscription()
  }, [])

  const loadSubscription = async () => {
    setLoading(true)
    setError('')

    try {
      const userDataStr = localStorage.getItem('userData')
      if (!userDataStr) {
        setError('No se pudo obtener información del usuario')
        return
      }

      const userData = JSON.parse(userDataStr)
      const userId = userData.id

      // Cargar suscripción
      try {
        const sub = await subscriptionsService.getByUserId(userId)
        setSubscription(sub)

        // Cargar estado de asistencias
        try {
          const status = await attendancesService.getStatus(userId)
          setAttendanceStatus(status)
        } catch (err) {
          console.error('Error loading attendance status:', err)
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setSubscription(null)
        } else {
          throw err
        }
      }
    } catch (err: any) {
      console.error('Error loading subscription:', err)
      setError(err.response?.data?.message || 'Error al cargar la suscripción')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Obtener datos de la suscripción
  const activeItem = subscription ? subscriptionsService.getActiveItem(subscription) : null
  const pendingItems = subscription ? subscriptionsService.getPendingItems(subscription) : []
  const expiredItems = subscription ? subscriptionsService.getExpiredItems(subscription) : []
  const currentBenefits = subscription ? subscriptionsService.getCurrentBenefits(subscription) : null
  const daysRemaining = subscription ? subscriptionsService.calculateDaysRemaining(subscription) : 0

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mi Suscripción</h1>
        <p className="text-gray-600 mt-1">Detalles de tu suscripción y membresías</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Cargando suscripción...</p>
        </div>
      ) : !subscription ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No tienes una suscripción</h3>
          <p className="text-gray-600 mb-6">
            Esto no debería pasar. Contacta al administrador.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Membresía Activa */}
          {activeItem ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Membresía Activa</h2>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 flex items-center gap-1">
                  <CheckCircle2 size={16} />
                  Activa
                </span>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{activeItem.name}</h3>
                <p className="text-3xl font-bold text-blue-600 mb-1">${activeItem.cost}</p>
                <p className="text-sm text-gray-600">Pagado el {formatDate(activeItem.purchase_date)}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Periodo</p>
                  <p className="text-lg text-gray-900">
                    {formatDate(activeItem.start_date)} - {formatDate(activeItem.end_date)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Días Restantes</p>
                  <p className={`text-2xl font-bold ${
                    daysRemaining > 30
                      ? 'text-green-600'
                      : daysRemaining > 7
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {daysRemaining} {daysRemaining === 1 ? 'día' : 'días'}
                  </p>
                </div>
              </div>

              {/* Beneficios */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Beneficios Incluidos</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-800">Visitas al Gimnasio</p>
                    <p className="text-2xl font-bold text-blue-900">{activeItem.max_gym_assistance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-800">Clases</p>
                    <p className="text-2xl font-bold text-blue-900">{activeItem.max_classes_assistance}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-bold text-yellow-900 mb-2">No tienes membresía activa</h3>
              <p className="text-yellow-800 text-sm mb-4">
                Adquiere una membresía para comenzar a disfrutar de nuestros servicios.
              </p>
              <Link
                href="/client/memberships"
                className="inline-block px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition"
              >
                Ver Membresías Disponibles
              </Link>
            </div>
          )}

          {/* Asistencias Disponibles */}
          {attendanceStatus && activeItem && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Asistencias Disponibles</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-2">Gimnasio</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {attendanceStatus.availableAttendances.gym}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    de {currentBenefits?.gym || 0} totales
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-800 mb-2">Clases</p>
                  <p className="text-4xl font-bold text-purple-600">
                    {attendanceStatus.availableAttendances.classes}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    de {currentBenefits?.classes || 0} totales
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cola de Pendientes */}
          {pendingItems.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Próximas Membresías</h2>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {pendingItems.length} en cola
                </span>
              </div>
              <div className="space-y-3">
                {pendingItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <Clock size={14} className="inline mr-1" />
                        Se activará el {formatDate(item.start_date)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Durará hasta el {formatDate(item.end_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">${item.cost}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historial */}
          {expiredItems.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Historial de Membresías</h2>
              <div className="space-y-3">
                {expiredItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="mt-1">
                      <XCircle size={20} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(item.start_date)} - {formatDate(item.end_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-500">${item.cost}</p>
                      <span className="inline-block px-2 py-1 mt-1 rounded text-xs bg-gray-200 text-gray-600">
                        Expirada
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón para agregar más */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-2">¿Quieres más beneficios?</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Explora nuestras membresías y agrega más a tu suscripción.
            </p>
            <Link
              href="/client/memberships"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Ver Membresías Disponibles
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
