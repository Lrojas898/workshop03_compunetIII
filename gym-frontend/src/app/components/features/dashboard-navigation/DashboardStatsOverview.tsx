/**
 * DASHBOARD STATS OVERVIEW
 *
 * Grid de tarjetas de estadísticas para la página principal del dashboard.
 *
 * Características:
 * - Grid responsive de StatisticsDisplayCard
 * - Estadísticas específicas por rol
 * - Actualización en tiempo real
 * - Loading skeletons
 *
 * Estadísticas por rol:
 * - ADMIN: Total usuarios, ingresos, membresías activas, asistencias hoy
 * - RECEPTIONIST: Check-ins hoy, usuarios activos, próximos vencimientos
 * - COACH: Mis miembros, sesiones hoy
 * - CLIENT: Días restantes, asistencias este mes
 */

'use client'

import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

function StatCard({ title, value, icon, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
  }

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  }

  return (
    <div className={`border rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && <div className={`text-2xl ${iconColorClasses[color]}`}>{icon}</div>}
      </div>
    </div>
  )
}

interface AdminStatsProps {
  totalUsers?: number
  activeMembers?: number
  activeMemberships?: number
  totalRevenue?: number | string
  isLoading?: boolean
}

export function DashboardStatsOverview({
  totalUsers = 0,
  activeMembers = 0,
  activeMemberships = 0,
  totalRevenue = '$0',
  isLoading = false,
}: AdminStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6 bg-gray-50 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-300 rounded w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total de Usuarios"
        value={totalUsers}
        icon="👥"
        color="blue"
      />
      <StatCard
        title="Miembros Activos"
        value={activeMembers}
        icon="✅"
        color="green"
      />
      <StatCard
        title="Membresías Activas"
        value={activeMemberships}
        icon="🎯"
        color="purple"
      />
      <StatCard
        title="Ingresos Totales"
        value={totalRevenue}
        icon="💰"
        color="orange"
      />
    </div>
  )
}
