/**
 * STATISTICS DISPLAY CARD
 *
 * Tarjeta para mostrar estadísticas con icono y valor.
 *
 * Características:
 * - Título descriptivo
 * - Valor numérico prominente
 * - Icono visual
 * - Indicador de cambio/tendencia (opcional)
 * - Diseño moderno con colores personalizables
 */

'use client'

export function StatisticsDisplayCard() {
  return (
    <div className="border rounded-lg p-6">
      {/* TODO: Implementar tarjeta de estadísticas */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className="text-blue-500">
          {/* Icon */}
        </div>
      </div>
    </div>
  )
}
