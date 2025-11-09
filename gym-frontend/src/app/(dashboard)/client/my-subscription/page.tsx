/**
 * MY SUBSCRIPTION PAGE
 *
 * Página donde el cliente puede ver su suscripción actual.
 *
 * Características:
 * - Detalles de suscripción activa
 * - Fecha de vencimiento
 * - Membresías incluidas
 * - Asistencias disponibles
 * - Estado de activación
 * - Solo accesible para rol CLIENT
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, CreditCard, Check, AlertCircle, ShoppingBag } from 'lucide-react'
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

  const calculateExpirationDate = () => {
    if (!subscription) return null

    const purchaseDate = new Date(subscription.purchase_date)
    const expirationDate = new Date(purchaseDate)
    expirationDate.setMonth(expirationDate.getMonth() + subscription.duration_months)

    return expirationDate
  }

  const calculateDaysRemaining = () => {
    const expirationDate = calculateExpirationDate()
    if (!expirationDate) return 0

    const today = new Date()
    const diffTime = expirationDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays > 0 ? diffDays : 0
  }

  const expirationDate = calculateExpirationDate()
  const daysRemaining = calculateDaysRemaining()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mi Suscripción</h1>
        <p className="text-gray-600 mt-1">Detalles de tu suscripción activa</p>
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">No tienes una suscripción activa</h3>
          <p className="text-gray-600 mb-6">
            Adquiere una membresía para comenzar a disfrutar de nuestros servicios.
          </p>
          <Link
            href="/client/memberships"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Ver Membresías Disponibles
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Información Principal */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{subscription.name}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                subscription.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {subscription.isActive ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Costo Total</p>
                <p className="text-2xl font-bold text-blue-600">${subscription.cost}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Duración</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscription.duration_months} {subscription.duration_months === 1 ? 'mes' : 'meses'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Fecha de Compra</p>
                <p className="text-lg text-gray-900">{formatDate(subscription.purchase_date)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Fecha de Vencimiento</p>
                <p className="text-lg text-gray-900">
                  {expirationDate ? formatDate(expirationDate.toISOString()) : '-'}
                </p>
              </div>
            </div>

            {/* Días restantes */}
            <div className={`mt-4 p-4 rounded-lg ${
              daysRemaining > 30
                ? 'bg-green-50 border border-green-200'
                : daysRemaining > 7
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                <Calendar size={20} className={
                  daysRemaining > 30
                    ? 'text-green-600'
                    : daysRemaining > 7
                    ? 'text-yellow-600'
                    : 'text-red-600'
                } />
                <p className={`font-medium ${
                  daysRemaining > 30
                    ? 'text-green-800'
                    : daysRemaining > 7
                    ? 'text-yellow-800'
                    : 'text-red-800'
                }`}>
                  {daysRemaining > 0
                    ? `${daysRemaining} ${daysRemaining === 1 ? 'día' : 'días'} restantes`
                    : 'Suscripción vencida'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Asistencias Disponibles */}
          {attendanceStatus && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Asistencias Disponibles</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-2">Gimnasio</p>
                  <p className="text-4xl font-bold text-blue-600">
                    {attendanceStatus.availableAttendances.gym}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    de {subscription.max_gym_assistance} disponibles
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-800 mb-2">Clases</p>
                  <p className="text-4xl font-bold text-purple-600">
                    {attendanceStatus.availableAttendances.classes}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    de {subscription.max_classes_assistance} disponibles
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Membresías Incluidas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Membresías Incluidas</h2>
            {subscription.memberships && subscription.memberships.length > 0 ? (
              <div className="space-y-3">
                {subscription.memberships.map((membership) => (
                  <div
                    key={membership.id}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="mt-1">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{membership.name}</h3>
                      <div className="mt-2 text-sm text-gray-600 space-y-1">
                        <p>• {membership.max_gym_visits_per_month} visitas al gimnasio por mes</p>
                        <p>• {membership.max_classes_per_month} clases por mes</p>
                        <p>• Duración: {membership.duration_months} {membership.duration_months === 1 ? 'mes' : 'meses'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">${membership.cost}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay membresías incluidas</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
