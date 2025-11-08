/**
 * USER ROLE BADGE
 *
 * Badge visual para mostrar el rol de un usuario con colores distintivos.
 *
 * Características:
 * - Color por rol (ADMIN: rojo, RECEPTIONIST: azul, COACH: verde, CLIENT: gris)
 * - Icono opcional
 * - Tamaños (small, medium, large)
 */

'use client'

export function UserRoleBadge() {
  return (
    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
      {/* TODO: Implementar badge de rol con colores por tipo */}
      ADMIN
    </span>
  )
}
