/**
 * TOP NAVIGATION BAR
 *
 * Barra de navegación superior del dashboard.
 *
 * Características:
 * - Logo del gimnasio
 * - Breadcrumbs
 * - Búsqueda global
 * - Notificaciones
 * - Menú de usuario
 * - Responsive (hamburger menu en móvil)
 */

'use client'

export function TopNavigationBar() {
  return (
    <nav className="bg-white border-b px-6 py-4">
      {/* TODO: Implementar navbar completo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Temple Gym</h1>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="search"
            placeholder="Search..."
            className="px-4 py-2 border rounded"
          />
          <div className="w-8 h-8 bg-gray-300 rounded-full" />
        </div>
      </div>
    </nav>
  )
}
