/**
 * RECEPTIONIST DASHBOARD HOME PAGE
 *
 * Página principal del dashboard de recepcionista.
 * Muestra resumen de actividad del día.
 *
 * Características:
 * - Resumen de check-ins del día
 * - Usuarios actualmente en el gimnasio
 * - Accesos rápidos a funciones principales
 * - Solo accesible para rol RECEPTIONIST
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UserCheck, Users, Clock, TrendingUp } from 'lucide-react'
import attendancesService from '@/app/services/attendances/attendances.service'
import type { Attendance } from '@/app/interfaces/attendance.interface'

export default function ReceptionistDashboardPage() {
  const [activeUsers, setActiveUsers] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const quickAccessLinks = [
    {
      title: 'Check-In / Check-Out',
      description: 'Registrar entrada y salida de usuarios',
      href: '/receptionist/check-in',
      icon: UserCheck,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Usuarios Activos',
      description: 'Ver quién está en el gimnasio',
      href: '/receptionist/active-users',
      icon: Users,
      color: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ]

  const todayStats = [
    {
      label: 'Usuarios en el Gimnasio',
      value: activeUsers.length,
      icon: Users,
      color: 'text-blue-600'
    }
  ]

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Panel de Recepción</h1>
        <p className="text-gray-600 mt-2">Bienvenido. Gestiona el check-in y check-out de usuarios.</p>
      </div>

      {/* Stats */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Resumen de Hoy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayStats.map((stat) => {
            const IconComponent = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className={`text-3xl font-bold mt-2 ${stat.color}`}>
                      {loading ? '...' : stat.value}
                    </p>
                  </div>
                  <IconComponent className={stat.color} size={32} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Quick Access */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Active Users Summary */}
      {!loading && activeUsers.length > 0 && (
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">Usuarios Activos en el Gimnasio</h3>
          <p className="text-blue-800 text-sm mb-4">
            Actualmente hay {activeUsers.length} usuario{activeUsers.length !== 1 ? 's' : ''} en el gimnasio.
          </p>
          <Link
            href="/receptionist/active-users"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Ver detalles →
          </Link>
        </section>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  )
}
