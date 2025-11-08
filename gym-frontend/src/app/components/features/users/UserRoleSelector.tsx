/**
 * USER ROLE SELECTOR
 *
 * Selector específico para roles de usuario.
 * Con descripciones de cada rol.
 *
 * Características:
 * - Opciones de todos los roles
 * - Descripción de permisos por rol
 * - Solo admins pueden asignar rol ADMIN
 */

'use client'

export function UserRoleSelector() {
  return (
    <select className="w-full px-4 py-2 border rounded">
      {/* TODO: Implementar selector de roles con descripciones */}
      <option value="ADMIN">Admin</option>
      <option value="RECEPTIONIST">Receptionist</option>
      <option value="COACH">Coach</option>
      <option value="CLIENT">Client</option>
    </select>
  )
}
