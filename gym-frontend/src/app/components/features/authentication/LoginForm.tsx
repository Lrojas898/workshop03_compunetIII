/**
 * LOGIN FORM
 *
 * Formulario de inicio de sesión.
 *
 * Características:
 * - Campos de email y password
 * - Validación básica
 * - Manejo de errores
 * - Remember me checkbox
 * - Link a registro
 */

'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import authenticationService from '@/app/services/auth/authentication.service'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validaciones básicas
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

      // Guardar token en localStorage
      localStorage.setItem('authToken', response.token)
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }

      // Redirigir según rol del usuario
      const userRole = response.user.roles[0]?.name
      switch (userRole) {
        case 'admin':
          router.push('/admin')
          break
        case 'receptionist':
          router.push('/receptionist')
          break
        case 'coach':
          router.push('/coach')
          break
        case 'client':
          router.push('/client')
          break
        default:
          router.push('/admin')
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al iniciar sesión. Intenta de nuevo.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Gym Manager</h1>
        <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded"
            disabled={loading}
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
            Recuérdame
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
