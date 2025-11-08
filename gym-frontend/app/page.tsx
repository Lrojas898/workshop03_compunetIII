/**
 * HOME PAGE (Root)
 *
 * Página principal de la aplicación.
 * Redirige a login si no está autenticado, o al dashboard según el rol.
 */

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Gym Management System</h1>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
