/**
 * DASHBOARD LAYOUT
 *
 * Layout compartido para todas las páginas del dashboard.
 * Incluye navegación lateral (Sidebar) y barra superior (Navbar).
 *
 * Características:
 * - Sidebar con navegación basada en rol
 * - Navbar con información del usuario
 * - Protección de rutas (requiere autenticación)
 * - Diseño responsive
 */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* TODO: Agregar Sidebar component */}
      {/* TODO: Agregar Navbar component */}
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}
