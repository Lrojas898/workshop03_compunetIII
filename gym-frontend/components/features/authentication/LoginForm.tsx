/**
 * LOGIN FORM
 *
 * Formulario de inicio de sesión.
 *
 * Características:
 * - Campos de email y password
 * - Validación con Zod
 * - Integración con NextAuth
 * - Mensajes de error
 * - Remember me checkbox
 * - Link a registro
 */

'use client'

export function LoginForm() {
  return (
    <div className="space-y-4">
      {/* TODO: Implementar formulario de login */}
      <h2 className="text-2xl font-bold">Login</h2>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
        />
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded">
          Sign In
        </button>
      </form>
    </div>
  )
}
