/**
 * REGISTER FORM
 *
 * Formulario de registro de nuevos usuarios.
 *
 * Características:
 * - Campos: nombre, email, password, confirmación de password
 * - Validación con Zod
 * - Verificación de email único
 * - Creación de cuenta
 * - Link a login
 */

'use client'

export function RegisterForm() {
  return (
    <div className="space-y-4">
      {/* TODO: Implementar formulario de registro */}
      <h2 className="text-2xl font-bold">Register</h2>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 border rounded"
        />
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
          Create Account
        </button>
      </form>
    </div>
  )
}
