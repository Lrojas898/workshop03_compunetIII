/**
 * SUBSCRIPTION DETAILS CARD
 *
 * Tarjeta que muestra el resumen completo de una suscripción.
 *
 * Características:
 * - Información del usuario
 * - Membresías incluidas
 * - Fechas de inicio y vencimiento
 * - Días restantes
 * - Estado actual
 * - Acciones (renovar, cancelar)
 */

'use client'

export function SubscriptionDetailsCard() {
  return (
    <div className="border rounded-lg p-6">
      {/* TODO: Implementar tarjeta de detalles de suscripción */}
      <h3 className="text-xl font-bold mb-4">Subscription Details</h3>
      <div className="space-y-2">
        <p><strong>User:</strong> John Doe</p>
        <p><strong>Status:</strong> Active</p>
        <p><strong>Start Date:</strong> 2024-01-01</p>
        <p><strong>End Date:</strong> 2024-12-31</p>
        <p><strong>Days Remaining:</strong> 120</p>
      </div>
    </div>
  )
}
