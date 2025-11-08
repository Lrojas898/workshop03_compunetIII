/**
 * SIDEBAR NAVIGATION LINKS
 *
 * Componente de enlace individual para el sidebar.
 * Maneja el estado activo y la navegación.
 *
 * Características:
 * - Resaltado cuando está activo
 * - Icono + texto
 * - Badge de notificaciones (opcional)
 * - Animaciones de hover
 */

'use client'

export function SidebarNavigationLinks() {
  return (
    <a
      href="#"
      className="flex items-center space-x-3 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
    >
      {/* TODO: Implementar link con icono y estado activo */}
      {/* Icon */}
      <span>Link Text</span>
    </a>
  )
}
