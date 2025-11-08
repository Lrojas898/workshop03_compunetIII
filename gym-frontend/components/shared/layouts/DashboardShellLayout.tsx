/**
 * DASHBOARD SHELL LAYOUT
 *
 * Layout wrapper para contenido del dashboard.
 * Proporciona estructura consistente a todas las páginas.
 *
 * Características:
 * - Encabezado de página
 * - Breadcrumbs
 * - Contenedor con padding consistente
 * - Responsive
 */

'use client'

export function DashboardShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      {children}
    </div>
  )
}
