/**
 * ATTENDANCE MONTHLY CALENDAR
 *
 * Calendario mensual que muestra los días de asistencia de un usuario.
 *
 * Características:
 * - Vista de calendario del mes
 * - Días con asistencia marcados visualmente
 * - Tooltip con detalles al hacer hover
 * - Navegación entre meses
 * - Indicadores de rachas (streaks)
 */

'use client'

export function AttendanceMonthlyCalendar() {
  return (
    <div className="border rounded-lg p-6">
      {/* TODO: Implementar calendario de asistencias */}
      <h3 className="text-lg font-semibold mb-4">Attendance Calendar</h3>
      <div className="grid grid-cols-7 gap-2">
        {/* Calendar grid */}
        {Array.from({ length: 31 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square flex items-center justify-center border rounded"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}
