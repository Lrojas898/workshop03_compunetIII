/**
 * CLIENT DASHBOARD HOME PAGE
 *
 * Página principal del dashboard de cliente.
 * Muestra información personal y estado de membresía.
 *
 * Características:
 * - Estado de suscripción actual
 * - Días restantes de membresía
 * - Resumen de asistencias del mes
 * - Accesos rápidos
 * - Solo accesible para rol CLIENT
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreditCard, Calendar, ShoppingBag, BarChart3, AlertCircle } from 'lucide-react'
import subscriptionsService from '@/app/services/subscriptions/subscriptions.service'
import attendancesService from '@/app/services/attendances/attendances.service'
import type { Subscription } from '@/app/interfaces/subscriptions.interface'
import type { AttendanceStatus } from '@/app/interfaces/attendance.interface'
import { useAuthStore } from '@/app/_store/auth/auth.store'

export default function ClientDashboardPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuthStore()

  useEffect(() => {
    if (!user) {
      return
    }
    loadDashboardData(user.id)
  }, [user]) 

  const loadDashboardData = async (userId: string) => {
    setLoading(true)
    setError('')

    try {
   
      // Cargar suscripción del usuario
      try {
        const sub = await subscriptionsService.getByUserId(userId)
        setSubscription(sub)

        // Si tiene suscripción, cargar estado de asistencias
        try {
          const status = await attendancesService.getStatus(userId)
          setAttendanceStatus(status)
        } catch (err) {
          console.error('Error loading attendance status:', err)
        }
      } catch (err: any) {
        // Si no tiene suscripción, no es un error crítico
        if (err.response?.status === 404) {
          setSubscription(null)
        } else {
          console.error('Error loading subscription:', err)
        }
      }
    } catch (err: any) {
      console.error('Error loading dashboard data:', err)
      setError('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  // Obtener beneficios actuales (solo del item activo)
  const currentBenefits = subscription ? subscriptionsService.getCurrentBenefits(subscription) : null
  const daysRemaining = subscription ? subscriptionsService.calculateDaysRemaining(subscription) : 0
  const activeItem = subscription ? subscriptionsService.getActiveItem(subscription) : null

  const quickAccessLinks = [
    {
      title: 'Membresías Disponibles',
      description: 'Explora y adquiere nuevas membresías',
      href: '/client/memberships',
      icon: ShoppingBag,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Mi Suscripción',
      description: 'Ver detalles de tu suscripción activa',
      href: '/client/my-subscription',
      icon: CreditCard,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Historial de Asistencias',
      description: 'Revisa tu historial y estadísticas',
      href: '/client/my-attendance',
      icon: Calendar,
      color: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ]

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Mi Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido, {user?.fullName || 'a tu panel personal'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Resumen de Suscripción */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Cargando información...</p>
        </div>
      ) : activeItem ? (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Estado de Suscripción</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {subscription?.isActive ? 'Activa' : 'Inactiva'}
                  </p>
                </div>
                <CreditCard className="text-green-600" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Membresía Actual</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    ${currentBenefits?.cost || 0}
                  </p>
                </div>
                <CreditCard className="text-blue-600" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Días Restantes</p>
                  <p className={`text-2xl font-bold mt-2 ${daysRemaining > 30
                      ? 'text-green-600'
                      : daysRemaining > 7
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                    {daysRemaining}
                  </p>
                </div>
                <Calendar className="text-purple-600" size={32} />
              </div>
            </div>
          </div>

          {/* Asistencias disponibles */}
          {attendanceStatus && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Asistencias Disponibles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-800">Gimnasio</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {attendanceStatus.availableAttendances.gym}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    de {currentBenefits?.gym || 0} totales
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-800">Clases</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {attendanceStatus.availableAttendances.classes}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    de {currentBenefits?.classes || 0} totales
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
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

      {/* Acceso Rápido */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickAccessLinks.map((link) => {
            const IconComponent = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`${link.color} w-12 h-12 flex items-center justify-center rounded-lg`}>
                    <IconComponent className={link.iconColor} size={24} />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{link.title}</h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
