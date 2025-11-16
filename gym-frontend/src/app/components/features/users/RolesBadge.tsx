/**
 * ROLES BADGE
 *
 * Componente que muestra los roles de un usuario con badges de colores.
 * Cada rol tiene un color distintivo para fácil identificación.
 */

'use client'

import { Role } from '@/app/interfaces/auth.interface'
import { ValidRoles } from '@/lib/configuration/api-endpoints'

interface RolesBadgeProps {
  roles: Role[]
}

export function RolesBadge({ roles }: RolesBadgeProps) {
  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case ValidRoles.ADMIN:
        return 'bg-red-100 text-red-800 border border-red-300'
      case ValidRoles.COACH:
        return 'bg-blue-100 text-blue-800 border border-blue-300'
      case ValidRoles.RECEPTIONIST:
        return 'bg-purple-100 text-purple-800 border border-purple-300'
      case ValidRoles.CLIENT:
        return 'bg-green-100 text-green-800 border border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300'
    }
  }

  const getRoleLabel = (roleName: string) => {
    const labels: Record<string, string> = {
      [ValidRoles.ADMIN]: 'Administrador',
      [ValidRoles.COACH]: 'Entrenador',
      [ValidRoles.RECEPTIONIST]: 'Recepcionista',
      [ValidRoles.CLIENT]: 'Cliente',
    }
    return labels[roleName] || roleName
  }

  if (roles.length === 0) {
    return (
      <span className="text-gray-500 text-sm">Sin roles asignados</span>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {roles.map((role) => (
        <span
          key={role.id}
          className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(role.name)}`}
        >
          {getRoleLabel(role.name)}
        </span>
      ))}
    </div>
  )
}
