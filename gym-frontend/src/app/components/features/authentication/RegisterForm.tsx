/**
 * REGISTER FORM
 *
 * Formulario de registro de nuevos usuarios.
 *
 * Características:
 * - Campos: nombre, email, edad, password, confirmación de password
 * - Validación básica
 * - Verificación de email único
 * - Creación de cuenta
 * - Link a login
 */

'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import authenticationService from '@/app/services/auth/authentication.service'
import { useAuthStore } from '@/app/_store/auth/auth.store'
import { Dumbbell } from 'lucide-react'

export function RegisterForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { login } = useAuthStore()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validaciones básicas
    if (!fullName || !email || !age || !password || !confirmPassword) {
      setError('Por favor completa todos los campos')
      setLoading(false)
      return
    }

    if (fullName.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres')
      setLoading(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor ingresa un email válido')
      setLoading(false)
      return
    }

    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setError('La edad debe estar entre 1 y 120 años')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    try {
      const response = await authenticationService.register({
        fullName,
        email,
        age: ageNum,
        password,
      })

      setSuccess('Cuenta creada exitosamente. Redirigiendo al dashboard')

      login(response)

      // Redirigir al dashboard según rol
      setTimeout(() => {
        const userRole = response.roles[0]?.name
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
            router.push('/client')
        }
      }, 1500)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al crear la cuenta. Intenta de nuevo.'
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
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">Crea tu cuenta para empezar</p>
        </div>

        {/* Mensajes de Alerta con nuevo estilo */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm sm:text-base">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm sm:text-base">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          {/* Campos del formulario con el nuevo estilo */}
          <input
            id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
            placeholder="Nombre Completo"
            className="!text-white w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={loading}
          />
          <input
            id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="!text-white w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={loading}
          />
          <input
            id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)}
            placeholder="Edad"
            className="!text-white w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={loading}
          />
          <input
            id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña (mín. 6 caracteres)"
            className="!text-white w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={loading}
          />
          <input
            id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar Contraseña"
            className="!text-white w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || success !== ''} // Deshabilitar también si el registro fue exitoso
            className="w-full px-4 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg bg-blue-400 hover:bg-blue-300 text-black font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="text-center mt-6 md:mt-8">
          <p className="text-gray-400 text-sm sm:text-base">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
