import Link from 'next/link'
import { Dumbbell } from 'lucide-react'
/**
 * HOME PAGE (Landing Page)
 *
 * Página de inicio para Temple Gym. Presenta la marca y ofrece
 * una acción clara para iniciar sesión o registrarse.
 */
export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Fondo con imagen de Héroe y superposición oscura */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-gym.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Contenido principal que se superpone a la imagen */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="py-4 px-6 md:px-10">
          <nav className="flex items-center justify-between">
            {/* Logo a la izquierda */}
            <Link href="/" className="flex items-center gap-2">
              <Dumbbell className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold tracking-tight">
                Temple <span className="text-blue-400">Gym</span>
              </span>
            </Link>

            {/* Botón de Iniciar Sesión a la derecha */}
            <Link
              href="/login"
              className="bg-blue-400 text-black font-semibold py-2 px-5 rounded-md hover:bg-blue-300 transition-colors"
            >
              Iniciar Sesión
            </Link>
          </nav>
        </header>

        {/* Contenido del Héroe */}
        <main className="flex-grow flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 leading-tight">
              Entrenamiento Inteligente. Resultados Reales.
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
              En Temple Gym, fusionamos la ciencia del ejercicio con tecnología de punta para optimizar cada movimiento y potenciar tus resultados.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}