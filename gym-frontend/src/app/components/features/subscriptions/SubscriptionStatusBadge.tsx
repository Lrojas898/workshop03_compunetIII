/**
 * SUBSCRIPTION STATUS BADGE
 *
 * Badge para mostrar el estado de una suscripción.
 *
 * Características:
 * - Colores por estado (ACTIVE: verde, EXPIRED: rojo, CANCELLED: gris)
 * - Icono opcional
 * - Animación para estados activos
 */

'use client'

export function SubscriptionStatusBadge() {
  return (
    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
      {/* TODO: Implementar badge de estado con colores */}
      ACTIVE
    </span>
  )
}
