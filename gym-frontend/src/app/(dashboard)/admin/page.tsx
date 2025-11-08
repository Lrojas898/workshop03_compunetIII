/**
 * ADMIN DASHBOARD HOME PAGE
 *
 * Página principal del dashboard de administrador.
 * Muestra estadísticas generales y resumen del gimnasio.
 *
 * Características:
 * - Tarjetas con estadísticas clave (usuarios activos, ingresos, etc.)
 * - Accesos rápidos a funciones principales
 * - Solo accesible para rol ADMIN
 */

'use client'

import { DashboardStatsOverview } from '@/app/components/features/dashboard-navigation/DashboardStatsOverview'
import Link from 'next/link'

export default function AdminDashboardPage() {
  // Valores de ejemplo - En una aplicación real, obtendrías estos del backend
  const stats = {
    totalUsers: 142,
    activeMembers: 98,
    activeMemberships: 76,
    totalRevenue: '$12,450.50',
  }

  const quickAccessLinks = [
    {
      title: 'Gestionar Usuarios',
      description: 'Ver, crear y editar usuarios del gimnasio',
      href: '/admin/users',
      icon: '👥',
      color: 'bg-blue-100',
    },
    {
      title: 'Membresías',
      description: 'Administrar tipos de membresías y precios',
      href: '/admin/memberships',
      icon: '🎫',
      color: 'bg-purple-100',
    },
    {
      title: 'Suscripciones',
      description: 'Revisar y controlar suscripciones activas',
      href: '/admin/subscriptions',
      icon: '📋',
      color: 'bg-green-100',
    },
    {
      title: 'Analítica',
      description: 'Ver reportes y estadísticas detalladas',
      href: '/admin/analytics',
      icon: '📊',
      color: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Panel Administrativo</h1>
        <p className="text-gray-600 mt-2">Bienvenido, Administrador. Aquí está el resumen de tu gimnasio.</p>
      </div>

      {/* Statistics Overview */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Estadísticas Generales</h2>
        <DashboardStatsOverview
          totalUsers={stats.totalUsers}
          activeMembers={stats.activeMembers}
          activeMemberships={stats.activeMemberships}
          totalRevenue={stats.totalRevenue}
        />
      </section>

      {/* Quick Access Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccessLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`text-3xl ${link.color} w-12 h-12 flex items-center justify-center rounded-lg`}>
                  {link.icon}
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{link.title}</h3>
              <p className="text-sm text-gray-600">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Actividad Reciente</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            {[
              { action: 'Nuevo usuario registrado', user: 'Juan Pérez', time: 'hace 2 horas' },
              { action: 'Suscripción creada', user: 'María García', time: 'hace 4 horas' },
              { action: 'Membresía actualizada', user: 'Carlos López', time: 'hace 1 día' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between pb-4 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.user}</p>
                </div>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Box */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">Información Útil</h3>
        <p className="text-blue-800 text-sm">
          Este es tu panel administrativo. Desde aquí puedes gestionar todos los aspectos de tu gimnasio incluyendo usuarios,
          membresías, suscripciones y acceso a reportes detallados de analítica.
        </p>
      </section>
    </div>
  )
}
