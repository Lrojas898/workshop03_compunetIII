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

export function DashboardStatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* TODO: Implementar grid de estadísticas por rol */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6">
          <p className="text-sm text-gray-600">Stat {i + 1}</p>
          <p className="text-3xl font-bold">123</p>
        </div>
      ))}
    </div>
  )
}
