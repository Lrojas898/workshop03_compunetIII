/**
 * CHECK-IN / CHECK-OUT FORM
 *
 * Formulario para registrar entrada y salida de usuarios al gimnasio.
 *
 * Características:
 * - Búsqueda de usuario (por ID o nombre)
 * - Validación de membresía activa
 * - Registro de check-in con timestamp
 * - Registro de check-out automático o manual
 * - Feedback visual de éxito/error
 */

'use client'

export function CheckInOutForm() {
  return (
    <div className="border rounded-lg p-6">
      {/* TODO: Implementar formulario de check-in/check-out */}
      <h3 className="text-xl font-bold mb-4">Check-In / Check-Out</h3>
      <input
        type="text"
        placeholder="Search user by ID or name..."
        className="w-full px-4 py-2 border rounded mb-4"
      />
      <div className="flex space-x-2">
        <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded">
          Check In
        </button>
        <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded">
          Check Out
        </button>
      </div>
    </div>
  )
}
