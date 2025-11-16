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
    <div className="min-h-screen w-full">
      {children}
    </div>
  )
}
