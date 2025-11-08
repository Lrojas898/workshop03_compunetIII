/**
 * MEMBERSHIP PRICE DISPLAY
 *
 * Componente para mostrar el precio de una membresía con formato.
 *
 * Características:
 * - Formato de moneda
 * - Precio destacado
 * - Período (mensual, trimestral, anual)
 * - Variantes de tamaño
 */

'use client'

export function MembershipPriceDisplay() {
  return (
    <div className="text-center">
      {/* TODO: Implementar display de precio con formato */}
      <span className="text-3xl font-bold">$99</span>
      <span className="text-gray-600">/month</span>
    </div>
  )
}
