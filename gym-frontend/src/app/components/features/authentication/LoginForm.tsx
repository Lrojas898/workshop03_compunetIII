'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Dumbbell } from 'lucide-react'
import authenticationService from '@/app/services/auth/authentication.service'
import { useAuthStore } from '@/app/_store/auth/auth.store'

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // --- Tu lógica de validación y submit (sin cambios) ---
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      setLoading(false)
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor ingresa un email válido')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const response = await authenticationService.login({
        email,
        password,
      })
      login(response)
      const userRole = response.roles[0]?.name
      switch (userRole) {
        case 'admin': router.push('/admin'); break
        case 'receptionist': router.push('/receptionist'); break
        case 'coach': router.push('/coach'); break
        case 'client': router.push('/client'); break
        default: router.push('/403')
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al iniciar sesión. Intenta de nuevo.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
   <div className="relative min-h-screen bg-black text-white flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Fondo con imagen de Héroe y superposición oscura */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-gym.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Tarjeta del Formulario */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-gray-900/80 backdrop-blur-sm p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl shadow-2xl">
        {/* Logo y Título */}
        <div className="text-center mb-8 md:mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Dumbbell className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-400" />
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Temple <span className="text-blue-400">Gym</span>
            </span>
          </Link>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">Inicia sesión para continuar</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          <div>
            <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="!text-white w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-amber-500 transition"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-400 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="!text-white w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg bg-blue-400 hover:bg-blue-300 text-black font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="text-center mt-6 md:mt-8">
          <p className="text-gray-400 text-sm sm:text-base">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}