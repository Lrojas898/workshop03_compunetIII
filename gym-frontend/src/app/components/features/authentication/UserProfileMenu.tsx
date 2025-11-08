/**
 * USER PROFILE MENU
 *
 * Menú desplegable con información y acciones del usuario.
 * Ubicado en el navbar.
 *
 * Características:
 * - Foto de perfil / avatar
 * - Nombre y rol del usuario
 * - Link a perfil
 * - Link a configuración
 * - Botón de logout
 */

'use client'

export function UserProfileMenu() {
  return (
    <div>
      {/* TODO: Implementar menú de usuario */}
      <button className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <span>User Name</span>
      </button>
    </div>
  )
}
