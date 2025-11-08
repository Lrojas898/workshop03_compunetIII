/**
 * SIDEBAR NAVIGATION
 *
 * Menú de navegación lateral del dashboard.
 *
 * Características:
 * - Enlaces de navegación basados en rol
 * - Iconos descriptivos
 * - Indicador de ruta activa
 * - Colapsable en mobile
 * - Secciones agrupadas
 */

'use client'

export function SidebarNavigation() {
  return (
    <aside className="w-64 bg-gray-50 border-r min-h-screen p-4">
      {/* TODO: Implementar sidebar con navegación por rol */}
      <nav className="space-y-2">
        <a
          href="/dashboard"
          className="block px-4 py-2 rounded hover:bg-gray-200"
        >
          Dashboard
        </a>
        <a
          href="/dashboard/users"
          className="block px-4 py-2 rounded hover:bg-gray-200"
        >
          Users
        </a>
        <a
          href="/dashboard/memberships"
          className="block px-4 py-2 rounded hover:bg-gray-200"
        >
          Memberships
        </a>
      </nav>
    </aside>
  )
}
