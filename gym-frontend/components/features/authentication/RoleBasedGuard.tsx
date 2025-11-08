/**
 * ROLE BASED GUARD
 *
 * Componente de protección de rutas basado en rol.
 * Previene acceso no autorizado a ciertas páginas.
 *
 * Características:
 * - Verifica rol del usuario
 * - Redirección si no autorizado
 * - Mensaje de acceso denegado
 * - HOC o component wrapper
 *
 * Uso:
 * <RoleBasedGuard allowedRoles={['ADMIN', 'RECEPTIONIST']}>
 *   <ProtectedContent />
 * </RoleBasedGuard>
 */

'use client'

export function RoleBasedGuard({ children }: { children: React.ReactNode }) {
  // TODO: Implementar verificación de rol
  return <>{children}</>
}
