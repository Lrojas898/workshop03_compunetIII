/**
 * AUTHENTICATION LAYOUT
 *
 * Layout compartido para páginas de autenticación (login y registro).
 * Proporciona un diseño visual consistente para las páginas de auth.
 *
 * Características:
 * - Diseño centrado con fondo personalizado
 * - Logo del gimnasio
 * - Redirección si el usuario ya está autenticado
 */

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
