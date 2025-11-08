/**
 * LOGIN PAGE
 *
 * Página de inicio de sesión para usuarios del gimnasio.
 * Permite a los usuarios autenticarse usando email y contraseña.
 *
 * Características:
 * - Formulario de login con validación
 * - Manejo de errores de autenticación
 * - Redirección según el rol del usuario
 */

import { LoginForm } from '@/app/components/features/authentication/LoginForm'

export const metadata = {
  title: 'Iniciar Sesión | Gym Manager',
  description: 'Inicia sesión en tu cuenta de Gym Manager',
}

export default function LoginPage() {
  return <LoginForm />
}
