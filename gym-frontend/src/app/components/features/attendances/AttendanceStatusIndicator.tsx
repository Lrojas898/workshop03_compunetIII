/**
 * ATTENDANCE STATUS INDICATOR
 *
 * Indicador visual del estado de asistencia de un usuario.
 *
 * Características:
 * - Estados: CHECKED_IN, CHECKED_OUT
 * - Colores distintivos
 * - Timestamp de la acción
 * - Duración de la sesión
 */

'use client'

export function AttendanceStatusIndicator() {
  return (
    <div className="flex items-center space-x-2">
      {/* TODO: Implementar indicador de estado de asistencia */}
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      <span className="text-sm">In Gym</span>
    </div>
  )
}
