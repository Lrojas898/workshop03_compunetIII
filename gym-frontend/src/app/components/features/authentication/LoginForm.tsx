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
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Fondo con imagen de Héroe y superposición oscura */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-gym.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Tarjeta del Formulario */}
      <div className="relative z-10 w-full max-w-md bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Dumbbell className="h-8 w-8 text-amber-400" />
            <span className="text-2xl font-bold tracking-tight">
              Temple <span className="text-amber-400">Gym</span>
            </span>
          </Link>
          <p className="text-gray-400">Inicia sesión para continuar</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="!text-white w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="text-white w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="text-amber-400 hover:text-amber-300 font-medium">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}